import { setSkillConversation, refreshSkillRequests } from "./skills.js";
import { updateTimelineVisibility, notifyTimelineEvent, clearTimeline} from "./timeline.js";
import { state } from "./state.js";

import {
    getCurrentAttachment,
    uploadAttachment,
    clearAttachment,
    addMessageAttachment,
    openImageViewer
} from "./attachments.js";

import {
    renderMath,
    renderStats,
    ensureResponseDetails,
    finishResponseDetails,
    createResponseBlockState,
    appendResponseText,
    setResponseBlock,
    releaseResponseVisuals,
    renderStoredResponse
} from "./rendering.js";

import {
    loadConversations,
    updateConversationTitle
} from "./conversations.js";

const messages =
    document.getElementById("messages");

const input =
    document.getElementById("message-input");

const sendButton =
    document.getElementById("send-button");

const chat =
    document.getElementById("chat");

const ws = new WebSocket(
    `ws://${window.location.host}/ws/chat`
);

ws.onopen = () => {
    console.log("Connected to GlorpCat");
};

ws.onmessage = async (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "error" && message.conversation_id == null) {
        // Older server errors have no conversation ID. Attribute only when
        // exactly one response is active; never guess between concurrent chats.
        const active = [...state.responseStates.entries()]
            .filter(([, response]) => response.generating);
        if (active.length !== 1) {
            console.error("Unscoped chat error:", message.data);
            return;
        }
        message.conversation_id = active[0][0];
    }
    notifyTimelineEvent(message);
    const responseState = getResponseState(message.conversation_id);

    if (message.type === "thinking_delta") {

        if (responseState.cancelled || !responseState.thoughtStream) {
            return;
        }

        addThinkingDelta(responseState, message.data);
    }

    else if (message.type === "content_delta") {
        if (responseState.cancelled) return;
        if (!acceptResponseEvent(responseState, message)) return;

        if (message.data.trim()) {
            beginAnswer(responseState);
        }

        appendResponseText(
            responseState.blockState,
            message.block_id,
            message.data
        );
    }

    else if (message.type === "block_created") {
        if (responseState.cancelled) return;
        if (!acceptResponseEvent(responseState, message)) return;

        setResponseBlock(responseState.blockState, message.data);
    }

    else if (message.type === "user_message_saved") {
        const attachment =
            getCurrentAttachment();

        if (attachment) {
            try {
                const uploadedAttachment =
                    await uploadAttachment(
                        attachment,
                        message.data.conversation_id,
                        message.data.message_id
                    );

                addMessageAttachment(
                    state.currentUserMessage,
                    {
                        id: uploadedAttachment.id,
                        original_name: attachment.name,
                        content_type: attachment.type
                    }
                );

                clearAttachment();
            }
            catch (error) {
                console.error(
                    "Attachment upload failed:",
                    error
                );
            }
        }
    }

    else if (message.type === "done") {
        if (!acceptResponseEvent(responseState, message)) return;
        finishModelContextView(responseState);
        beginAnswer(responseState);
        releaseResponseVisuals(responseState.blockState);
        // Preserve the user's open/closed choice so thinking remains readable.
        responseState.assistant.thinkingSummary.textContent = "Thought";

        const completedAssistant = responseState.assistant;
        responseState.blockState = null;
        responseState.assistant = null;
        responseState.thoughtStream = null;
        responseState.thinkingBlock = null;
        responseState.stats = null;
        responseState.activeTools = {};
        responseState.generating = false;

        if (state.currentConversationId === message.conversation_id) {
            sendButton.disabled = false;
            sendButton.textContent = "Send";
        }
        await renderMath(completedAssistant);
    }

    else if (message.type === "model_response_context") {
        if (message.assistant_message_id == null || !acceptResponseEvent(responseState, message)) return;
        applyModelContextEvent(responseState.modelContextView, message);
    }

    else if (["tool_started", "tool_finished", "tool_failed",
              "tool_cancelled", "tool_interrupted"].includes(message.type)) {
        applyToolEvent(responseState, message);
        if (message.type === "tool_finished" && message.data?.name === "request_skill_install") {
            void refreshSkillRequests(message.conversation_id);
        }
    }

    else if (message.type === "response_stats") {
        if (responseState.stats && acceptResponseEvent(responseState, message)) {
            renderStats(responseState, message.data);
        }
    }

    else if (message.type === "conversation_title") {
        updateConversationTitle(
            message.data.conversation_id,
            message.data.title
        );
    }

    else if (message.type === "cancelled") {
        if (!acceptResponseEvent(responseState, message)) return;
        finishModelContextView(responseState);
        releaseResponseVisuals(responseState.blockState);
        responseState.cancelled = true;
        if (responseState.assistant) {
            responseState.assistant.thinkingSummary.textContent = "Stopped";
        }

        responseState.generating = false;

        if (state.currentConversationId === message.conversation_id) {
            sendButton.disabled = false;
            sendButton.textContent = "Send";
        }
    }

    else if (message.type === "error") {
        if (!acceptResponseEvent(responseState, message)) return;
        finishModelContextView(responseState);
        releaseResponseVisuals(responseState.blockState);
        responseState.cancelled = true;
        responseState.generating = false;
        responseState.assistant.thinkingSummary.textContent = "Failed";
        console.error("Chat failed:", message.data);
        if (state.currentConversationId === message.conversation_id) {
            sendButton.disabled = false;
            sendButton.textContent = "Send";
        }
    }

    if (
        message.conversation_id === state.currentConversationId
    ) {
        scrollToBottom();
    }
};

ws.onclose = () => {
    // A dropped socket has no done event. Release already-received visuals.
    for (const responseState of state.responseStates.values()) {
        if (!responseState.generating) continue;
        finishModelContextView(responseState);
        releaseResponseVisuals(responseState.blockState);
        responseState.cancelled = true;
        responseState.generating = false;
        if (responseState.assistant) {
            responseState.assistant.thinkingSummary.textContent = "Disconnected";
        }
    }
    sendButton.disabled = true;
    sendButton.textContent = "Disconnected";
};

// The server owns message and block identities; do not apply late text to a
// different response in the same conversation.
function acceptResponseEvent(responseState, message) {
    if (!responseState.assistant || !responseState.blockState) return false;
    if (message.assistant_message_id == null) return true; // Legacy server.
    if (responseState.assistantMessageId != null
        && responseState.assistantMessageId !== message.assistant_message_id) return false;
    responseState.assistantMessageId = message.assistant_message_id;
    return true;
}

export function getResponseState(conversationId) {
    if (!state.responseStates.has(conversationId)) {
        state.responseStates.set(
            conversationId,
            {
                assistant: null,
                thoughtStream: null,
                thinkingBlock: null,
                stats: null,
                blockState: null,
                activeTools: {},
                generating: false,
                cancelled: false,
            }
        );
    }

    return state.responseStates.get(conversationId);
}

export function getConversationView(conversationId) {
    if (!state.conversationViews.has(conversationId)) {
        const view = document.createElement("div");

        view.classList.add("conversation-view");
        view.style.display = "none";

        messages.appendChild(view);
        state.conversationViews.set(conversationId, view);
    }

    return state.conversationViews.get(conversationId);
}

export function showConversationView(conversationId) {
    for (const [id, view] of state.conversationViews) {
        view.style.display = id === conversationId ? "block" : "none";
    }
}

export function scrollToBottom(force = false) {
    if (!state.autoScroll && !force) {
        return;
    }

    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "auto"
    });
}

export function isNearBottom() {
    const threshold = 40;

    return (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - threshold
    );
}

export async function sendMessage() {
    const text = input.value.trim();

    if (
        !text ||
        ws.readyState !== WebSocket.OPEN
    ) {
        return;
    }

    // A blank New Chat doesn't exist in SQLite yet.
    // Create it when the first message is actually sent.
    if (state.currentConversationId === null) {
        try {
            const response = await fetch(
                "/api/conversations",
                {
                    method: "POST"
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to create conversation: ${response.status}`
                );
            }

            const conversation = await response.json();

            state.currentConversationId = conversation.id;
            setSkillConversation(conversation.id);
            chat.classList.remove("new-chat");
            clearTimeline();
            updateTimelineVisibility("chat");

            await loadConversations();

            console.log(
                "Conversation:",
                state.currentConversationId
            );
        }

        catch (error) {
            console.error(
                "Could not create conversation:",
                error
            );

            return;
        }
    }
    const attachment =
        getCurrentAttachment();

    const hasAttachment =
        attachment !== null;

    getConversationView(state.currentConversationId);
    showConversationView(state.currentConversationId);

    state.currentUserMessage = addUserMessage(
        text,
        [],
        state.currentConversationId
    );
    createAssistantMessage(state.currentConversationId);

    state.autoScroll = true;

    const responseState = getResponseState(state.currentConversationId);
    responseState.generating = true;
    responseState.cancelled = false;



    ws.send(JSON.stringify({
        conversation_id: state.currentConversationId,
        message: text,
        has_attachment: hasAttachment
    }));

    input.value = "";

    sendButton.disabled = false;
    sendButton.textContent = "Stop";

    scrollToBottom(true);
}

export function stopChat(conversationId) {
    const responseState =
        getResponseState(conversationId);

    if (!responseState.generating) {
        return;
    }

    releaseResponseVisuals(responseState.blockState);
    responseState.cancelled = true;
    responseState.generating = false;

    if (responseState.assistant) {
        responseState.assistant.thinkingSummary.textContent = "Stopped";
    }

    if (conversationId === state.currentConversationId) {
        sendButton.disabled = false;
        sendButton.textContent = "Send";
    }

    ws.send(JSON.stringify({
        type: "cancel",
        conversation_id: conversationId
    }));
}

export function addUserMessage(text, attachments = [], conversationId = state.currentConversationId) {
    const element = document.createElement("div");

    element.classList.add(
        "message",
        "user-message"
    );

    const textElement = document.createElement("div");

    textElement.textContent = text;

    element.appendChild(textElement);

    if (attachments.length > 0) {
        for (const attachment of attachments) {
            const attachmentElement =
                document.createElement("div");

            attachmentElement.classList.add(
                "message-attachment"
            );

            if (
                attachment.content_type &&
                attachment.content_type.startsWith("image/")
            ) {
                const image =
                    document.createElement("img");

                image.src = `/api/attachments/${attachment.id}`;

                image.alt =
                    attachment.original_name;

                image.classList.add(
                    "message-attachment-image"
                );

                image.addEventListener(
                    "click",
                    () => {
                        openImageViewer(
                            image.src,
                            image.alt
                        );
                    }
                );

                attachmentElement.appendChild(image);
            }

            else {
                const icon = document.createElement("i");

                icon.setAttribute(
                    "data-lucide",
                    getAttachmentIconName(attachment)
                );

                icon.classList.add(
                    "message-attachment-icon"
                );

                const info = document.createElement("div");

                info.classList.add(
                    "message-attachment-info"
                );

                const name = document.createElement("div");

                name.classList.add(
                    "message-attachment-name"
                );

                name.textContent =
                    attachment.original_name;

                const type = document.createElement("div");

                type.classList.add(
                    "message-attachment-type"
                );

                type.textContent =
                    getAttachmentType(attachment);

                info.appendChild(name);
                info.appendChild(type);

                attachmentElement.appendChild(icon);
                attachmentElement.appendChild(info);
            }

            element.appendChild(
                attachmentElement
            );
        }
    }

    getConversationView(conversationId).appendChild(element);
    lucide.createIcons();

    return element;
}

function addThinkingDelta(responseState, text) {
    if (!responseState.thinkingBlock) {
        responseState.thinkingBlock = document.createElement("div");
        responseState.thinkingBlock.classList.add("thinking");

        responseState.thoughtStream.appendChild(
            responseState.thinkingBlock
        );
    }

    responseState.thinkingBlock.textContent += text;
}

function createAssistantMessage(conversationId) {
    const container = document.createElement("div");
    const responseState =
        getResponseState(conversationId);

    releaseResponseVisuals(responseState.blockState);

    container.classList.add(
        "message",
        "assistant-message"
    );


    const thinkingDetails = document.createElement("details");
    thinkingDetails.classList.add("thinking-container");
    thinkingDetails.open = true;


    const thinkingSummary = document.createElement("summary");
    thinkingSummary.textContent = "Thinking...";


    responseState.thoughtStream = document.createElement("div");
    responseState.thoughtStream.classList.add("thought-stream");


    thinkingDetails.appendChild(thinkingSummary);
    thinkingDetails.appendChild(responseState.thoughtStream);


    responseState.assistant = document.createElement("div");
    responseState.assistant.classList.add("assistant-content");
    responseState.blockState = createResponseBlockState(
        responseState.assistant, {deferVisuals: true}
    );

    responseState.stats = document.createElement("div");
    responseState.stats.classList.add("response-stats");
    responseState.responseDetails = null;


    container.appendChild(thinkingDetails);
    container.appendChild(responseState.assistant);
    container.appendChild(responseState.stats);
    const responseDetails = ensureResponseDetails(responseState, {pending: true});
    responseState.modelContextView = createModelContextView(responseDetails.contextHost, conversationId, true);

    getConversationView(conversationId).appendChild(container);


    responseState.assistant.thinkingDetails = thinkingDetails;
    responseState.assistant.thinkingSummary = thinkingSummary;

    responseState.thinkingBlock = null;
    responseState.activeTools = {};
    responseState.toolCards = new Map();
    responseState.assistantMessageId = null;
    responseState.answerStarted = false;
}

function beginAnswer(responseState) {
    if (responseState.answerStarted) return;

    responseState.answerStarted = true;
    responseState.assistant.thinkingDetails.open = false;
}

// Live events use `type`; database events use `event_type`.
// Keep one renderer so restored tools expose the same details as live tools.
function applyToolEvent(responseState, event) {
    if (!responseState.thoughtStream || !event.tool_call_id) return;
    if (responseState.assistantMessageId != null
        && responseState.assistantMessageId !== event.assistant_message_id) return;
    responseState.assistantMessageId = event.assistant_message_id;
    responseState.toolCards ??= new Map();

    const key = JSON.stringify([event.assistant_message_id, event.tool_call_id]);
    const type = event.event_type || event.type;
    const data = event.data || {};
    let card = responseState.toolCards.get(key);
    if (!card) {
        responseState.thinkingBlock = null;
        const element = document.createElement("div");
        element.classList.add("tool");
        element.style.display = "block";
        const header = document.createElement("div");
        header.style.cssText = "display:flex;align-items:baseline;gap:0.5em;flex-wrap:wrap";
        const status = document.createElement("span");
        status.classList.add("tool-status");
        const name = document.createElement("span");
        name.classList.add("tool-name");
        const time = document.createElement("span");
        time.classList.add("tool-time");
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = "Execution details";
        const body = document.createElement("div");
        details.append(summary, body);
        header.append(status, name, time);
        element.append(header, details);
        responseState.thoughtStream.appendChild(element);
        card = {element, status, name, time, body, payload: {},
                toolName: data.name, state: "running", eventIds: [], identity: event};
        responseState.toolCards.set(key, card);
    }
    // Terminal events take precedence over a replayed start event.
    if (type === "tool_started" && card.state !== "running") return;
    Object.assign(card.payload, data);
    card.toolName = data.name || card.toolName;
    if (event.id != null && !card.eventIds.includes(event.id)) card.eventIds.push(event.id);
    if (type === "tool_started") card.startedAt = event.created_at;
    else card.finishedAt = event.created_at;
    const states = {
        tool_started: ["running", "●", "Running"],
        tool_finished: ["succeeded", "✓", "Completed"],
        tool_failed: ["failed", "✕", "Failed"],
        tool_cancelled: ["cancelled", "■", "Cancelled"],
        tool_interrupted: ["interrupted", "!", "Interrupted"]
    };
    const stateInfo = states[type];
    if (!stateInfo) return;
    [card.state, card.status.textContent, card.status.title] = stateInfo;
    card.element.dataset.status = card.state;
    card.name.textContent = getToolLabel(card.toolName || "Tool");
    card.time.textContent = Number.isFinite(card.payload.elapsed)
        ? `${card.payload.elapsed.toFixed(2)}s` : "";
    renderToolDetails(card, event);
}

function skillContextDisplay(payload) {
    let skillContext = "Skill context was not recorded for this older execution.";
    if (Object.hasOwn(payload, "skill_context")) {
        const recorded = payload.skill_context;
        if (Array.isArray(recorded)) {
            skillContext = recorded.length === 0
                ? "No loaded skill text was recorded in this model request."
                : recorded.map(item => {
                    if (!item || typeof item !== "object" || Array.isArray(item)) {
                        return {note: "An invalid skill-context entry was recorded."};
                    }
                    return {
                        skill_package_id: item.skill_package_id,
                        skill_name: item.skill_name,
                        source: item.source,
                        content_hash: item.content_hash,
                        relative_path: item.relative_path,
                        tool_call_id: item.tool_call_id
                    };
                });
        } else {
            skillContext = "The recorded skill context is invalid.";
        }
    }
    return skillContext;
}

function createModelContextView(container, conversationId, pending = false) {
    const element = document.createElement("details");
    element.classList.add("model-skill-context");
    element.style.cssText = "margin:0.9rem 0;color:#b9b5cb;font-size:0.85rem;line-height:1.5;min-width:0";
    const summary = document.createElement("summary");
    summary.textContent = "Skill context";
    summary.style.cssText = "cursor:pointer;color:#d6d1e7";
    const note = document.createElement("p");
    note.textContent = "Skill files available for each completed model iteration. This records available context, not proof that the model followed it.";
    const status = document.createElement("p");
    status.textContent = pending ? "No completed model-response snapshot yet."
        : "No model-response context was recorded. This may be an older message or a request without a completed model response.";
    const body = document.createElement("div");
    element.append(summary, note, status, body);
    container.appendChild(element);
    return {element, summary, status, body, conversationId, assistantMessageId: null, iterations: new Map()};
}

function finishModelContextView(responseState) {
    finishResponseDetails(responseState);
    const view = responseState.modelContextView;
    if (view && view.iterations.size === 0) {
        view.status.textContent = "No completed model-response context was recorded for this message.";
    }
}

function applyModelContextEvent(view, event) {
    if (!view || event.conversation_id !== view.conversationId
        || event.assistant_message_id == null
        || (view.assistantMessageId != null && view.assistantMessageId !== event.assistant_message_id)) return;
    const data = event.data;
    if (!data || !Number.isSafeInteger(data.model_iteration) || data.model_iteration <= 0) return;
    view.assistantMessageId = event.assistant_message_id;
    const iteration = data.model_iteration;
    let entry = view.iterations.get(iteration);
    if (entry && event.id != null && entry.event.id === event.id) return;
    if (entry?.event.id != null && (event.id == null || event.id < entry.event.id)) return;
    if (!entry) {
        const element = document.createElement("details");
        element.style.cssText = "margin:0.6rem 0;padding:0.7rem 0.9rem;border:1px solid #ffffff20;border-radius:12px;min-width:0";
        const summary = document.createElement("summary");
        summary.style.cssText = "cursor:pointer;color:#eeebfa";
        const body = document.createElement("div");
        element.append(summary, body);
        entry = {element, summary, body};
        view.iterations.set(iteration, entry);
    }
    entry.event = event;
    const recorded = data.skill_context;
    const count = Array.isArray(recorded) ? recorded.length : null;
    entry.summary.textContent = `Model iteration ${iteration} · ${count === null ? "snapshot unavailable"
        : count === 0 ? "no loaded skill text" : `${count} skill file${count === 1 ? "" : "s"}`}`;
    entry.body.replaceChildren();
    const provenance = document.createElement("p");
    provenance.textContent = `Conversation ${event.conversation_id} · Assistant message ${event.assistant_message_id}`
        + (event.id != null ? ` · Event ${event.id}` : "");
    entry.body.appendChild(provenance);
    const pre = document.createElement("pre");
    pre.style.cssText = "box-sizing:border-box;max-width:100%;margin:0;padding:0.75rem;background:#181818;border:1px solid #444;border-radius:8px;color:#e6e6e6;white-space:pre-wrap;overflow-wrap:anywhere;max-height:24rem;overflow:auto;font:0.85rem/1.5 ui-monospace,SFMono-Regular,Consolas,monospace";
    const display = skillContextDisplay(data);
    pre.textContent = typeof display === "string" ? display : JSON.stringify(display, null, 2);
    entry.body.appendChild(pre);
    // Move existing nodes rather than replacing them, preserving disclosure state.
    for (const [, item] of [...view.iterations].sort((a, b) => a[0] - b[0])) {
        view.body.appendChild(item.element);
    }
    view.summary.textContent = `Skill context · ${view.iterations.size} model iteration${view.iterations.size === 1 ? "" : "s"}`;
    view.status.hidden = true;
}

function renderToolDetails(card, event) {
    card.body.replaceChildren();
    const skillContext = skillContextDisplay(card.payload);
    const fields = [
        ["Status", card.status.title],
        ["Tool", card.toolName],
        ["Conversation ID", event.conversation_id],
        ["Assistant message ID", event.assistant_message_id],
        ["Tool call ID", event.tool_call_id],
        ["Event IDs", card.eventIds.length ? card.eventIds : undefined],
        ["Started (UTC)", card.startedAt],
        ["Ended (UTC)", card.finishedAt],
        ["Duration (seconds)", card.payload.elapsed],
        ["Skill context", skillContext],
        ["Inputs", card.payload.arguments],
        ["Output", Object.hasOwn(card.payload, "result")
            ? card.payload.result : undefined],
        ["Error", card.payload.error]
    ];
    if (card.state === "succeeded" && !Object.hasOwn(card.payload, "result")) {
        fields.push(["Output", "Output was not recorded for this older execution."]);
    }
    if (card.state === "cancelled") {
        fields.push(["Note", "Local execution was cancelled; an external tool may have continued."]);
    }
    for (const [label, value] of fields) {
        if (value === undefined) continue;
        const heading = document.createElement("strong");
        heading.textContent = label;
        heading.style.cssText = "display:block;color:#fff;font-weight:700;margin:1rem 0 0.4rem;line-height:1.4";
        if (label === "Skill context") {
            card.body.appendChild(heading);
            const note = document.createElement("p");
            note.textContent = "Skill files available when the model selected this tool call. This records available context, not proof that the model followed it.";
            note.style.cssText = "margin:0 0 0.6rem;color:#b8b8b8;font-size:0.85rem;line-height:1.5";
            card.body.appendChild(note);
        }
        const text = document.createElement("pre");
        text.style.cssText = "display:block;box-sizing:border-box;width:100%;min-width:0;margin:0;padding:0.75rem 1rem;background:#181818;border:1px solid #444;border-radius:8px;color:#e6e6e6;white-space:pre-wrap;overflow-wrap:anywhere;max-height:24rem;overflow:auto;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:0.9rem;line-height:1.5";
        const code = document.createElement("code");
        code.style.cssText = "display:block;padding:0;margin:0;border:0;background:transparent;color:inherit;font:inherit;white-space:inherit";
        // Tool outputs are untrusted data, never HTML.
        code.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
        text.appendChild(code);
        if (label !== "Skill context") card.body.appendChild(heading);
        card.body.appendChild(text);
    }
}

function getToolLabel(name) {
    const labels = {
        search_text: "Searched the web",
        search_news: "Searched news",
        get_collections: "Checked document collections",
        query_collection: "Searched documents",
        sequentialthinking: "Used sequential thinking"
    };

    return labels[name] || name;
}

function getToolDetails(name, args) {
    if (
        name === "search_text" ||
        name === "search_news"
    ) {
        return args.query || "";
    }

    if (name === "query_collection") {
        return args.query || args.collection || "";
    }

    return "";
}

export function addStoredAssistantMessage(message, conversationId = state.currentConversationId, executionEvents = []) {
    const container = document.createElement("div");

    container.classList.add(
        "message",
        "assistant-message"
    );


    const events = executionEvents
        .filter(event => event.assistant_message_id === message.id)
        .slice().sort((a, b) => a.id - b.id);
    const thoughtEvents = events.filter(event => !["model_response_context", "response_stats"].includes(event.event_type));
    if (message.thinking || thoughtEvents.length) {
        const thinkingDetails = document.createElement("details");
        thinkingDetails.classList.add("thinking-container");
        const summary = document.createElement("summary");
        summary.textContent = "Thought";
        const stream = document.createElement("div");
        stream.classList.add("thought-stream");
        const hasThinkingEvents = events.some(event => event.event_type === "thinking_block");
        // Older responses lack block events, so retain their saved text as a fallback.
        if (!hasThinkingEvents && message.thinking) {
            const thinking = document.createElement("div");
            thinking.classList.add("thinking");
            thinking.textContent = message.thinking;
            stream.appendChild(thinking);
        }
        // A local rendering context avoids changing an active live response.
        const storedState = {thoughtStream: stream, toolCards: new Map(),
                             assistantMessageId: message.id};
        for (const event of thoughtEvents) {
            if (event.event_type === "thinking_block") {
                const text = event.data?.text;
                if (typeof text !== "string" || !text) continue;
                const thinking = document.createElement("div");
                thinking.classList.add("thinking");
                thinking.dataset.eventId = String(event.id);
                thinking.textContent = text;
                stream.appendChild(thinking);
            } else {
                applyToolEvent(storedState, event);
            }
        }
        for (const card of storedState.toolCards.values()) {
            if (card.state === "running") {
                // A saved start alone doesn't establish the current execution state.
                card.state = "unknown";
                card.element.dataset.status = "unknown";
                card.status.textContent = "?";
                card.status.title = "Outcome unconfirmed";
                renderToolDetails(card, card.identity);
            }
        }
        thinkingDetails.append(summary, stream);
        container.appendChild(thinkingDetails);
    }

    const content = document.createElement("div");

    content.classList.add("assistant-content");

    renderStoredResponse(content, message);

    container.appendChild(content);

    const stats = document.createElement("div");
    stats.classList.add("response-stats");
    container.appendChild(stats);
    const storedResponse = {stats};
    const responseDetails = ensureResponseDetails(storedResponse);
    const contextView = createModelContextView(responseDetails.contextHost, conversationId);
    contextView.assistantMessageId = message.id;
    for (const event of events) {
        if (event.event_type === "model_response_context") applyModelContextEvent(contextView, event);
        if (event.event_type === "response_stats" && event.conversation_id === conversationId) {
            renderStats(storedResponse, event.data);
        }
    }

    getConversationView(conversationId).appendChild(container);

    renderMath(content);
}

export function initializeChat() {
    window.addEventListener(
        "wheel",
        (event) => {
            if (event.deltaY < 0) {
                state.autoScroll = false;
            }
        },
        { passive: true }
    );


    window.addEventListener("keydown", (event) => {
        if (
            event.key === "ArrowUp" ||
            event.key === "PageUp" ||
            event.key === "Home"
        ) {
            state.autoScroll = false;
        }
    });


    window.addEventListener(
        "scroll",
        () => {
            if (!state.autoScroll && isNearBottom()) {
                state.autoScroll = true;
            }
        },
        { passive: true }
    );

    sendButton.addEventListener(
        "click",
        () => {
            const responseState =
                getResponseState(
                    state.currentConversationId
                );

            if (responseState.generating) {
                stopChat(
                    state.currentConversationId
                );
            }
            else {
                sendMessage();
            }
        }
    );

    input.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {
                event.preventDefault();

                sendMessage();
            }
        }
    );
}


