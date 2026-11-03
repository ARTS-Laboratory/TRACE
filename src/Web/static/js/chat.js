import { state } from "./state.js";

import {
    getCurrentAttachment,
    uploadAttachment,
    clearAttachment,
    addMessageAttachment,
    openImageViewer
} from "./attachments.js";

import {
    renderMarkdown,
    renderMath,
    renderStats,
    protectMath,
    enhanceCodeBlocks
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

        responseState.markdown += message.data;

        if (!responseState.renderPending) {
            responseState.renderPending = true;

            requestAnimationFrame(() => {
                renderMarkdown(responseState);
                responseState.renderPending = false;
            });
        }
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
        responseState.assistant.thinkingDetails.open = false;
        responseState.assistant.thinkingSummary.textContent = "Thought";

        await renderMath(responseState.assistant);
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
    }

    else if (message.type === "tool_started") {
        addTool(responseState, message.data);
    }

    else if (message.type === "tool_finished") {
        finishTool(responseState ,message.data);
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

export function getResponseState(conversationId) {
    if (!state.responseStates.has(conversationId)) {
        state.responseStates.set(
            conversationId,
            {
                assistant: null,
                thoughtStream: null,
                thinkingBlock: null,
                stats: null,
                markdown: "",
                activeTools: {},
                renderPending: false,
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

    responseState.markdown = "";

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
}

function addTool(responseState, data) {
    // End the current reasoning block.
    // Any reasoning after this tool gets a new block.
    responseState.thinkingBlock = null;

    const tool = document.createElement("div");
    tool.classList.add("tool");

    const status = document.createElement("span");
    status.classList.add("tool-status");
    status.textContent = "●";

    const name = document.createElement("span");
    name.classList.add("tool-name");
    name.textContent = getToolLabel(data.name);

    const details = document.createElement("div");
    details.classList.add("tool-details");

    if (data.arguments) {
        details.textContent = getToolDetails(
            data.name,
            data.arguments
        );
    }

    tool.appendChild(status);
    tool.appendChild(name);

    if (details.textContent) {
        tool.appendChild(details);
    }

    responseState.thoughtStream.appendChild(tool);

    responseState.activeTools[data.name] = tool;
}

function finishTool(responseState, data) {
    const tool = responseState.activeTools[data.name];

    if (!tool) {
        return;
    }

    const status = tool.querySelector(".tool-status");

    status.textContent = "✓";

    const time = document.createElement("span");
    time.classList.add("tool-time");
    time.textContent = `${data.elapsed.toFixed(2)}s`;

    tool.appendChild(time);

    delete responseState.activeTools[data.name];
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

export function addStoredAssistantMessage(message, conversationId = state.currentConversationId) {
    const container = document.createElement("div");

    container.classList.add(
        "message",
        "assistant-message"
    );


    if (message.thinking) {
        const thinkingDetails =
            document.createElement("details");

        thinkingDetails.classList.add(
            "thinking-container"
        );


        const summary =
            document.createElement("summary");

        summary.textContent = "Thought";


        const thinking =
            document.createElement("div");

        thinking.classList.add("thinking");

        thinking.textContent = message.thinking;


        thinkingDetails.appendChild(summary);
        thinkingDetails.appendChild(thinking);

        container.appendChild(thinkingDetails);
    }


    const content = document.createElement("div");

    content.classList.add("assistant-content");

    const protectedMath = protectMath(
        message.content
    );

    let html = marked.parse(
        protectedMath.text
    );

    protectedMath.mathBlocks.forEach(
        (math, index) => {
            html = html.replace(
                `@@MATH_${index}@@`,
                math
            );
        }
    );

    content.innerHTML = DOMPurify.sanitize(
        html
    );

    container.appendChild(content);

    getConversationView(conversationId).appendChild(container);

    enhanceCodeBlocks(content);

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

