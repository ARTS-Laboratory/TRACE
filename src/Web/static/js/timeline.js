import { state } from "./state.js";

const panel = document.getElementById("trace-panel");
const toggle = document.getElementById("trace-toggle");

let closeAnimation = null;
let openFrame = null;
let timelineEvents = [];
let timelineConversationId = null;

// Presentation state only — not execution history.
const expandedResponses = new Map();

let timelineFollowLatest = true;

const TRACE_SCROLL_THRESHOLD = 40;

function isTimelineNearBottom() {
    if (!timelineContainer) return true;

    const distance =
        timelineContainer.scrollHeight -
        timelineContainer.scrollTop -
        timelineContainer.clientHeight;

    return distance <= TRACE_SCROLL_THRESHOLD;
}

function initializeTimelineScrolling() {
    if (!timelineContainer) return;

    timelineContainer.addEventListener("scroll", () => {
        timelineFollowLatest = isTimelineNearBottom();
    }, { passive: true });
}

export function initializeTimeline() {
    if (!panel || !toggle) {
        console.error("TRACE panel elements not found.");
        return;
    }

    toggle.addEventListener("click", toggleTimeline);
    initializeTimelineScrolling();
    updateTimelineVisibility("chat");
}

function toggleTimeline() {
    if (document.body.classList.contains("trace-open")) {
        closeTimeline();
    } else {
        openTimeline();
    }
}

function openTimeline() {
    if (closeAnimation !== null) {
        clearTimeout(closeAnimation);
        closeAnimation = null;
    }

    panel.hidden = false;

    if (openFrame !== null) {
        cancelAnimationFrame(openFrame);
    }

    openFrame = requestAnimationFrame(() => {
        openFrame = requestAnimationFrame(() => {
            document.body.classList.add("trace-open");
            toggle.setAttribute("aria-expanded", "true");
            toggle.setAttribute("aria-label", "Close TRACE timeline");
            openFrame = null;
        });
    });
}

function closeTimeline() {
    if (!document.body.classList.contains("trace-open")) {
        return;
    }
    if (openFrame !== null) {
        cancelAnimationFrame(openFrame);
        openFrame = null;
    }

    document.body.classList.remove("trace-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open TRACE timeline");

    closeAnimation = setTimeout(() => {
        panel.hidden = true;
        closeAnimation = null;
    }, 280);
}


export function updateTimelineVisibility(view) {
    const hasConversation =
        state.currentConversationId !== null;

    const shouldShow =
        view === "chat" && hasConversation;

    if (!shouldShow) {
        closeTimeline();
    }

    toggle.hidden = !shouldShow;
}


/* =========================================
   TRACE — Historical Event Rendering
   Phase 5A.2
   ========================================= */

const timelineContainer =
    document.getElementById("trace-timeline");

const TOOL_TERMINAL_EVENTS = new Set([
    "tool_finished",
    "tool_failed",
    "tool_cancelled",
    "tool_interrupted"
]);


function buildTimelineItems(conversation, events) {
    const items = [];
    const responseGroups = new Map();

    let responseNumber = 0;

    // Create response groups using the persisted messages.
    for (const message of conversation.messages) {
        if (message.role !== "assistant") continue;

        responseNumber++;

        responseGroups.set(message.id, {
            kind: "response",
            message,
            number: responseNumber,
            events: [],
            firstEventId: Infinity
        });
    }

    // Associate each event with its response, if possible.
    for (const event of events) {
        const group = responseGroups.get(
            event.assistant_message_id
        );

        if (group) {
            group.events.push(event);
            group.firstEventId = Math.min(
                group.firstEventId,
                event.id
            );
        }
    }

    // Keep complete response groups together.
    for (const group of responseGroups.values()) {
        items.push(group);
    }

    // Insert conversation-level events as individual items.
    for (const event of events) {
        if (responseGroups.has(event.assistant_message_id)) {
            continue;
        }

        items.push({
            kind: "conversation_event",
            event,
            firstEventId: event.id
        });
    }

    // Persisted event IDs determine ordering.
    items.sort((a, b) =>
        a.firstEventId - b.firstEventId
    );

    return items;
}

function insertLegacyResponses(items, conversation) {
    const ordered = items.filter(
        item => item.kind !== "response" ||
                item.events.length > 0
    );

    const assistantMessages = conversation.messages.filter(
        message => message.role === "assistant"
    );

    for (let index = 0; index < assistantMessages.length; index++) {
        const message = assistantMessages[index];

        const alreadyPresent = ordered.some(
            item => item.kind === "response" &&
                    item.message.id === message.id
        );

        if (alreadyPresent) continue;

        const legacyItem = {
            kind: "response",
            message,
            number: index + 1,
            events: [],
            firstEventId: null
        };

        // Find the next response that is already positioned.
        const nextResponse = assistantMessages
            .slice(index + 1)
            .find(next => ordered.some(
                item => item.kind === "response" &&
                        item.message.id === next.id
            ));

        if (nextResponse) {
            const position = ordered.findIndex(
                item => item.kind === "response" &&
                        item.message.id === nextResponse.id
            );

            ordered.splice(position, 0, legacyItem);
            continue;
        }

        // Otherwise place it after the preceding response.
        const previousResponse = assistantMessages
            .slice(0, index)
            .reverse()
            .find(previous => ordered.some(
                item => item.kind === "response" &&
                        item.message.id === previous.id
            ));

        if (previousResponse) {
            const position = ordered.findIndex(
                item => item.kind === "response" &&
                        item.message.id === previousResponse.id
            );

            ordered.splice(position + 1, 0, legacyItem);
        } else {
            ordered.push(legacyItem);
        }
    }

    return ordered;
}

function groupConversationActivity(items) {
    const grouped = [];

    for (const item of items) {
        if (item.kind !== "conversation_event") {
            grouped.push(item);
            continue;
        }

        const previous = grouped[grouped.length - 1];

        if (previous?.kind === "conversation_activity") {
            previous.events.push(item.event);
        } else {
            grouped.push({
                kind: "conversation_activity",
                firstEventId: item.firstEventId,
                events: [item.event]
            });
        }
    }

    return grouped;
}

// Keep the original database records available.


export function renderTimelineHistory(conversation) {
    if (!timelineContainer || !conversation) return;

    const switchingConversation =
        timelineConversationId !== conversation.id;

    // Preserve viewing position before rebuilding.
    const previousScrollTop = timelineContainer.scrollTop;

    const shouldFollow = switchingConversation
        ? true
        : timelineFollowLatest;

    if (switchingConversation) {
        expandedResponses.clear();
        timelineFollowLatest = true;
    }

    timelineConversationId = conversation.id;

    timelineEvents = [...(conversation.execution_events || [])]
        .sort((a, b) => a.id - b.id);

    timelineContainer.replaceChildren();

    const items = groupConversationActivity(
        insertLegacyResponses(
            buildTimelineItems(conversation, timelineEvents),
            conversation
        )
    );

    for (const item of items) {
        if (item.kind === "response") {
            timelineContainer.appendChild(
                createResponseGroup(
                    item.number,
                    item.message,
                    item.events
                )
            );
        }

        else if (item.kind === "conversation_activity") {
            timelineContainer.appendChild(
                createEventGroup(
                    "Conversation activity",
                    item.events,
                    false
                )
            );
        }
    }

    if (items.length === 0) {
        const empty = document.createElement("p");
        empty.id = "trace-empty";
        empty.textContent = "No execution events yet.";
        timelineContainer.appendChild(empty);
    }

    // Restore the appropriate viewing position.
    if (shouldFollow) {
        timelineContainer.scrollTop =
            timelineContainer.scrollHeight;
    } else {
        timelineContainer.scrollTop = previousScrollTop;
    }

    timelineFollowLatest = shouldFollow;
}



function createResponseGroup(number, message, events) {
    const messageId = message.id;

    const expanded = expandedResponses.has(messageId)
        ? expandedResponses.get(messageId)
        : true;

    return createEventGroup(
        `Response ${number}`,
        events,
        expanded,
        messageId
    );
}

function createEventGroup(
    title,
    events,
    expanded,
    messageId = null
) {
    const details = document.createElement("details");
    details.className = "trace-response-group";
    details.open = expanded;

    const summary = document.createElement("summary");
    summary.className = "trace-response-summary";

    const heading = document.createElement("span");
    heading.textContent = title;

    const count = document.createElement("span");
    count.className = "trace-event-count";
    count.textContent = `${events.length} events`;

    summary.append(heading, count);
    details.appendChild(summary);

    const body = document.createElement("div");
    body.className = "trace-response-events";

    const entries = normalizeTimelineEvents(events);

    if (entries.length === 0) {
        const empty = document.createElement("p");
        empty.className = "trace-group-empty";
        empty.textContent = "No recorded execution events.";
        body.appendChild(empty);
    }

    for (const entry of entries) {
        body.appendChild(createTimelineEntry(entry));
    }

    details.appendChild(body);

    summary.addEventListener("click", (event) => {
        event.preventDefault();

        // Avoid overlapping animations from rapid clicks.
        if (details.dataset.animating === "true") return;

        const opening = !details.open;

        if (opening) {
            details.open = true;
        }

        details.dataset.animating = "true";
        body.style.overflow = "hidden";

        const fullHeight = body.scrollHeight;

        const animation = body.animate(
            [
                {
                    height: opening ? "0px" : `${fullHeight}px`,
                    opacity: opening ? 0 : 1
                },
                {
                    height: opening ? `${fullHeight}px` : "0px",
                    opacity: opening ? 1 : 0
                }
            ],
            {
                duration: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? 0 : 240,
                easing: "ease-in-out"
            }
        );


        animation.finished.then(() => {
            if (!opening) {
                details.open = false;
            }

            // Remember the user's choice for this response.
            if (messageId !== null) {
                expandedResponses.set(messageId, opening);
            }
        }).catch(() => {
            // Animation was interrupted.
        }).finally(() => {
            body.style.overflow = "";
            delete details.dataset.animating;
        });
    });

    return details;
}

function normalizeTimelineEvents(events) {
    const entries = [];
    const activeTools = new Map();

    for (const event of events) {
        const type = event.event_type;
        const callId = event.tool_call_id;

        if (type === "tool_started") {
            const entry = {
                kind: "tool",
                name: event.data?.name || "Unknown tool",
                status: "started",
                events: [event],
                id: event.id
            };

            entries.push(entry);

            if (callId != null) {
                activeTools.set(callId, entry);
            }

            continue;
        }

        if (TOOL_TERMINAL_EVENTS.has(type)) {
            const existing = callId != null
                ? activeTools.get(callId)
                : null;

            if (existing) {
                existing.events.push(event);
                existing.status = type;
                activeTools.delete(callId);
            } else {
                entries.push({
                    kind: "tool",
                    name: event.data?.name || "Unknown tool",
                    status: type,
                    events: [event],
                    id: event.id
                });
            }

            continue;
        }

        entries.push({
            kind: "event",
            type,
            data: event.data || {},
            events: [event],
            id: event.id
        });
    }

    return entries;
}

function createTimelineEntry(entry) {
    const row = document.createElement("div");
    row.className = "trace-event";

    const icon = document.createElement("span");
    icon.className = "trace-event-icon";

    const content = document.createElement("div");
    content.className = "trace-event-content";

    const name = document.createElement("div");
    name.className = "trace-event-name";

    const meta = document.createElement("div");
    meta.className = "trace-event-meta";

    if (entry.kind === "tool") {
        const completed = entry.status === "tool_finished";
        const failed = [
            "tool_failed",
            "tool_cancelled",
            "tool_interrupted"
        ].includes(entry.status);

        icon.textContent = completed ? "✓" : failed ? "×" : "◌";
        icon.classList.add(
            completed ? "trace-success" :
            failed ? "trace-error" : "trace-pending"
        );

        name.textContent = entry.name;

        const terminal = entry.events.find(
            event => TOOL_TERMINAL_EVENTS.has(event.event_type)
        );

        const duration = terminal?.data?.elapsed;

        meta.textContent = completed
            ? "Completed"
            : failed
                ? entry.status.replace("tool_", "")
                : "Started";

        if (typeof duration === "number") {
            meta.textContent += ` · ${duration.toFixed(2)}s`;
        }
    } else {
        icon.textContent = "•";

        switch (entry.type) {
            case "model_response_context":
                name.textContent =
                    `Model iteration ${entry.data.model_iteration ?? "?"}`;
                meta.textContent = "Model context recorded";
                break;

            case "thinking_block":
                name.textContent = "Thinking recorded";
                meta.textContent = "Reasoning record";
                break;

            case "response_stats":
                name.textContent = "Response statistics";
                meta.textContent = "Response telemetry recorded";
                break;

            default:
                name.textContent =
                    entry.type.replaceAll("_", " ");
                meta.textContent = `Event ${entry.id}`;
        }
    }

    content.append(name, meta);
    row.append(icon, content);

    return row;
}


/* =========================================
   TRACE — Live History Synchronization
   Phase 5A.3.1
   ========================================= */

const TRACE_REFRESH_EVENTS = new Set([
    "tool_started",
    "tool_finished",
    "tool_failed",
    "tool_cancelled",
    "tool_interrupted",
    "model_response_context",
    "response_stats",
    "done"
]);

let traceRefreshTimer = null;
let traceRefreshVersion = 0;

export function notifyTimelineEvent(message) {
    if (!TRACE_REFRESH_EVENTS.has(message.type)) {
        return;
    }

    const conversationId = message.conversation_id;

    if (conversationId == null ||
        conversationId !== state.currentConversationId) {
        return;
    }

    clearTimeout(traceRefreshTimer);

    const version = ++traceRefreshVersion;

    traceRefreshTimer = setTimeout(() => {
        traceRefreshTimer = null;
        void refreshTimelineHistory(conversationId, version);
    }, 100);
}

async function refreshTimelineHistory(conversationId, version) {
    try {
        const response = await fetch(
            `/api/conversations/${conversationId}`
        );

        if (!response.ok) {
            throw new Error(
                `TRACE history request failed: ${response.status}`
            );
        }

        const conversation = await response.json();

        // Ignore responses from outdated requests or chats.
        if (version !== traceRefreshVersion ||
            conversationId !== state.currentConversationId) {
            return;
        }

        renderTimelineHistory(conversation);
    }
    catch (error) {
        console.error("TRACE synchronization failed:", error);
    }
}


export function clearTimeline() {
    // Invalidate any pending history refresh.
    traceRefreshVersion++;

    if (traceRefreshTimer !== null) {
        clearTimeout(traceRefreshTimer);
        traceRefreshTimer = null;
    }

    // Reset conversation-specific state.
    timelineConversationId = null;
    timelineEvents = [];
    expandedResponses.clear();
    timelineFollowLatest = true;

    // Remove the previous conversation's timeline.
    timelineContainer.replaceChildren();

    const empty = document.createElement("p");
    empty.id = "trace-empty";
    empty.textContent = "No execution events yet.";

    timelineContainer.appendChild(empty);
    timelineContainer.scrollTop = 0;
}
