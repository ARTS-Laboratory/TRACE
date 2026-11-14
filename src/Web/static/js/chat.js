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
    createResponseBlockState,
    appendResponseText,
    setResponseBlock,
    flushResponseBlocks,
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
    const responseState = getResponseState(message.conversation_id);

    if (message.type === "thinking_delta") {

        if (responseState.cancelled) {
            return;
        }

        addThinkingDelta(responseState, message.data);
    }

    else if (message.type === "content_delta") {
        if (responseState.cancelled) {
            return;
        }

        if (!acceptResponseEvent(responseState, message)) return;
        appendResponseText(responseState.blockState, message.block_id, message.data);
    }

    // Future backend visual insertion: data is a complete block snapshot.
    else if (message.type === "block_created") {
        if (responseState.cancelled || !acceptResponseEvent(responseState, message)) return;
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
        flushResponseBlocks(responseState.blockState);
        responseState.assistant.thinkingDetails.open = false;
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

    else if (["tool_started", "tool_finished", "tool_failed",
              "tool_cancelled", "tool_interrupted"].includes(message.type)) {
        applyToolEvent(responseState, message);
    }

    else if (message.type === "response_stats") {
        renderStats(responseState,message.data);
    }

    else if (message.type === "conversation_title") {
        updateConversationTitle(
            message.data.conversation_id,
            message.data.title
        );
    }

    else if (message.type === "cancelled") {
        flushResponseBlocks(responseState.blockState);
        if (responseState.assistant) {
            responseState.assistant.thinkingDetails.open = false;
            responseState.assistant.thinkingSummary.textContent = "Stopped";
        }

        responseState.generating = false;

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
            chat.classList.remove("new-chat");

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

    flushResponseBlocks(responseState.blockState);
    responseState.cancelled = true;
    responseState.generating = false;

    if (responseState.assistant) {
        responseState.assistant.thinkingDetails.open = false;
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

    flushResponseBlocks(responseState.blockState);

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
    responseState.blockState = createResponseBlockState(responseState.assistant);

    responseState.stats = document.createElement("div");
    responseState.stats.classList.add("response-stats");


    container.appendChild(thinkingDetails);
    container.appendChild(responseState.assistant);
    container.appendChild(responseState.stats);

    getConversationView(conversationId).appendChild(container);


    responseState.assistant.thinkingDetails = thinkingDetails;
    responseState.assistant.thinkingSummary = thinkingSummary;

    responseState.thinkingBlock = null;
    responseState.activeTools = {};
    responseState.toolCards = new Map();
    responseState.assistantMessageId = null;
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

function renderToolDetails(card, event) {
    card.body.replaceChildren();
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
        const text = document.createElement("pre");
        text.style.cssText = "display:block;box-sizing:border-box;width:100%;min-width:0;margin:0;padding:0.75rem 1rem;background:#181818;border:1px solid #444;border-radius:8px;color:#e6e6e6;white-space:pre-wrap;overflow-wrap:anywhere;max-height:24rem;overflow:auto;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:0.9rem;line-height:1.5";
        const code = document.createElement("code");
        code.style.cssText = "display:block;padding:0;margin:0;border:0;background:transparent;color:inherit;font:inherit;white-space:inherit";
        // Tool outputs are untrusted data, never HTML.
        code.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
        text.appendChild(code);
        card.body.append(heading, text);
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
    if (message.thinking || events.length) {
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
        for (const event of events) {
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

