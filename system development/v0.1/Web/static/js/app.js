import {
    showRagView,
    hideRagView
} from "./rag.js";

import {
    renderMarkdown,
    renderMath,
    protectMath,
    enhanceCodeBlocks,
    renderStats
} from "./rendering.js";

import {
    getCurrentAttachment,
    uploadAttachment,
    clearAttachment,
    addMessageAttachment,
    openImageViewer
} from "./attachments.js";

const messages = document.getElementById("messages");
const input = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const inputContainer =
    document.getElementById("input-container");

const conversationList =
    document.getElementById("conversation-list");

const newChatButton =
    document.getElementById("new-chat-button");

const chatTitle =
    document.getElementById("chat-title");

const ragSectionButton =
    document.getElementById(
        "rag-section-button"
    );

const ws = new WebSocket(
    `ws://${window.location.host}/ws/chat`
);

const responseStates = new Map();
const conversationViews = new Map();

let currentConversationId = null;
let currentUserMessage = null;
let autoScroll = true;

function getResponseState(conversationId) {
    if (!responseStates.has(conversationId)) {
        responseStates.set(
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

    return responseStates.get(conversationId);
}

function getConversationView(conversationId) {
    if (!conversationViews.has(conversationId)) {
        const view = document.createElement("div");

        view.classList.add("conversation-view");
        view.style.display = "none";

        messages.appendChild(view);
        conversationViews.set(conversationId, view);
    }

    return conversationViews.get(conversationId);
}

function showConversationView(conversationId) {
    for (const [id, view] of conversationViews) {
        view.style.display = id === conversationId ? "block" : "none";
    }
}

ws.onopen = () => {
    console.log("Connected to GlorpCat");
};

ws.onmessage = async (event) => {
    const message = JSON.parse(event.data);
    const state = getResponseState(message.conversation_id);

    if (message.type === "thinking_delta") {
        if (state.cancelled) {
            return;
        }

        addThinkingDelta(state, message.data);
    }

    else if (message.type === "content_delta") {
        if (state.cancelled) {
            return;
        }

        state.markdown += message.data;

        if (!state.renderPending) {
            state.renderPending = true;

            requestAnimationFrame(() => {
                renderMarkdown(state);
                state.renderPending = false;
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
                    currentUserMessage,
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
        state.assistant.thinkingDetails.open = false;
        state.assistant.thinkingSummary.textContent = "Thought";

        await renderMath(state.assistant);
        state.assistant = null;
        state.thoughtStream = null;
        state.thinkingBlock = null;
        state.stats = null;
        state.activeTools = {};
        state.generating = false;

        if (currentConversationId === message.conversation_id) {
            sendButton.disabled = false;
            sendButton.textContent = "Send";
        }
    }

    else if (message.type === "tool_started") {
        addTool(state, message.data);
    }

    else if (message.type === "tool_finished") {
        finishTool(state ,message.data);
    }

    else if (message.type === "response_stats") {
        renderStats(state,message.data);
    }

    else if (message.type === "conversation_title") {
        updateConversationTitle(
            message.data.conversation_id,
            message.data.title
        );
    }

    else if (message.type === "cancelled") {
        if (state.assistant) {
            state.assistant.thinkingDetails.open = false;
            state.assistant.thinkingSummary.textContent = "Stopped";
        }

        state.generating = false;

        if (currentConversationId === message.conversationId) {
            sendButton.disabled = false;
            sendButton.textContent = "Send";
        }
    }

    if (
        message.conversation_id === currentConversationId
    ) {
        scrollToBottom();
    }
};

window.addEventListener(
    "wheel",
    (event) => {
        if (event.deltaY < 0) {
            autoScroll = false;
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
        autoScroll = false;
    }
});


window.addEventListener(
    "scroll",
    () => {
        if (!autoScroll && isNearBottom()) {
            autoScroll = true;
        }
    },
    { passive: true }
);

function updateConversationTitle(
    conversationId,
    title
) {
    const item = conversationList.querySelector(
        `[data-conversation-id="${conversationId}"]`
    );

    if (item) {
        const titleElement =
            item.querySelector(".conversation-title");

        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    if (conversationId === currentConversationId) {
        chatTitle.textContent = title;
    }

}

async function deleteConversation(conversationId) {
    const confirmed = window.confirm(
        "Delete this conversation?"
    );

    if (!confirmed) {
        return;
    }

    const response = await fetch(
        `/api/conversations/${conversationId}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        console.error(
            "Failed to delete conversation:",
            conversationId
        );

        return;
    }

    const deletedCurrent =
        conversationId === currentConversationId;

    const view = conversationViews.get(conversationId);
    if (view) {
        view.remove();
        conversationViews.delete(conversationId);
    }

    responseStates.delete(conversationId);

    if (deletedCurrent) {
        currentConversationId = null;
    }

    const conversations =
        await loadConversations();

    // If we deleted the active chat,
    // select the newest remaining one.
    if (deletedCurrent) {
        if (conversations.length > 0) {
            await loadConversation(
                conversations[0].id
            );
        }

        else {
            startNewChat();
        }
    }
}

function scrollToBottom(force = false) {
    if (!autoScroll && !force) {
        return;
    }

    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "auto"
    });
}

function isNearBottom() {
    const threshold = 40;

    return (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - threshold
    );
}

async function sendMessage() {
    const text = input.value.trim();

    if (
        !text ||
        ws.readyState !== WebSocket.OPEN
    ) {
        return;
    }

    // A blank New Chat doesn't exist in SQLite yet.
    // Create it when the first message is actually sent.
    if (currentConversationId === null) {
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

            currentConversationId = conversation.id;
            chat.classList.remove("new-chat");

            await loadConversations();

            console.log(
                "Conversation:",
                currentConversationId
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

    getConversationView(currentConversationId);
    showConversationView(currentConversationId);

    currentUserMessage = addUserMessage(
        text,
        [],
        currentConversationId
    );
    createAssistantMessage(currentConversationId);

    autoScroll = true;

    const state = getResponseState(currentConversationId);
    state.generating = true;
    state.cancelled = false;



    ws.send(JSON.stringify({
        conversation_id: currentConversationId,
        message: text,
        has_attachment: hasAttachment
    }));

    input.value = "";

    sendButton.disabled = false;
    sendButton.textContent = "Stop";

    scrollToBottom(true);
}

function stopChat(conversationId) {
    const state = getResponseState(conversationId);

    if (!state.generating) {
        return;
    }

    state.cancelled = true;
    state.generating = false;

    if (state.assistant) {
        state.assistant.thinkingDetails.open = false;
        state.assistant.thinkingSummary.textContent = "Stopped";
    }

    if (conversationId === currentConversationId) {
        sendButton.disabled = false;
        sendButton.textContent = "Send";
    }

    ws.send(JSON.stringify({
        type: "cancel",
        conversation_id: conversationId
    }));
}

function addUserMessage(text, attachments = [], conversationId = currentConversationId) {
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

function addThinkingDelta(state, text) {
    if (!state.thinkingBlock) {
        state.thinkingBlock = document.createElement("div");
        state.thinkingBlock.classList.add("thinking");

        state.thoughtStream.appendChild(
            state.thinkingBlock
        );
    }

    state.thinkingBlock.textContent += text;
}

function createAssistantMessage(conversationId) {
    const container = document.createElement("div");
    const state = getResponseState(conversationId);

    state.markdown = "";

    container.classList.add(
        "message",
        "assistant-message"
    );


    const thinkingDetails = document.createElement("details");
    thinkingDetails.classList.add("thinking-container");
    thinkingDetails.open = true;


    const thinkingSummary = document.createElement("summary");
    thinkingSummary.textContent = "Thinking...";


    state.thoughtStream = document.createElement("div");
    state.thoughtStream.classList.add("thought-stream");


    thinkingDetails.appendChild(thinkingSummary);
    thinkingDetails.appendChild(state.thoughtStream);


    state.assistant = document.createElement("div");
    state.assistant.classList.add("assistant-content");

    state.stats = document.createElement("div");
    state.stats.classList.add("response-stats");


    container.appendChild(thinkingDetails);
    container.appendChild(state.assistant);
    container.appendChild(state.stats);

    getConversationView(conversationId).appendChild(container);


    state.assistant.thinkingDetails = thinkingDetails;
    state.assistant.thinkingSummary = thinkingSummary;

    state.thinkingBlock = null;
    state.activeTools = {};
}

function addTool(state,data) {
    // End the current reasoning block.
    // Any reasoning after this tool gets a new block.
    state.thinkingBlock = null;

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

    state.thoughtStream.appendChild(tool);

    state.activeTools[data.name] = tool;
}

function finishTool(state, data) {
    const tool = state.activeTools[data.name];

    if (!tool) {
        return;
    }

    const status = tool.querySelector(".tool-status");

    status.textContent = "✓";

    const time = document.createElement("span");
    time.classList.add("tool-time");
    time.textContent = `${data.elapsed.toFixed(2)}s`;

    tool.appendChild(time);

    delete state.activeTools[data.name];
}

function startNewChat() {
    if (currentConversationId !== null) {
        const currentView =
            conversationViews.get(currentConversationId);

        if (currentView) {
            currentView.style.display = "none";
        }
    }

    currentConversationId = null;
    chat.classList.add("new-chat");

    document
        .querySelectorAll(".conversation-item.active")
        .forEach((item) => {
            item.classList.remove("active");
        });

    input.value = "";
    input.focus();

    autoScroll = true;
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

async function loadConversation(conversationId) {
    const response = await fetch(
        `/api/conversations/${conversationId}`
    );

    if (!response.ok) {
        console.error(
            "Failed to load conversation:",
            conversationId
        );

        return;
    }

    const conversation = await response.json();

    chatTitle.textContent = conversation.title;
    const view = getConversationView(conversation.id);

    if (view.childElementCount === 0) {
        for (const message of conversation.messages) {
            if (message.role === "user") {
                addUserMessage(
                    message.content,
                    message.attachments,
                    conversation.id
                );
            }

            else if (message.role === "assistant") {
                addStoredAssistantMessage(
                    message,
                    conversation.id
                );
            }
        }
    }

    currentConversationId = conversation.id;
    showChatSection();
    chat.classList.remove("new-chat");
    showConversationView(conversation.id);

    await loadConversations();

    autoScroll = true;

    scrollToBottom(true);
}

async function renameConversation(
    conversationId,
    currentTitle
) {
    const newTitle = window.prompt(
        "Rename conversation:",
        currentTitle
    );

    // Cancel was pressed
    if (newTitle === null) {
        return;
    }

    const title = newTitle.trim();

    // Don't allow an empty title
    if (!title) {
        return;
    }

    // Nothing actually changed
    if (title === currentTitle) {
        return;
    }

    try {
        const response = await fetch(
            `/api/conversations/${conversationId}`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: title
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to rename conversation: ${response.status}`
            );
        }

        const result = await response.json();

        if (result.error) {
            console.error(result.error);
            return;
        }

        await loadConversations();
    }

    catch (error) {
        console.error(
            "Could not rename conversation:",
            error
        );
    }
}

function getConversationGroup(updatedAt) {
    const date = new Date(
        updatedAt.replace(" ", "T") + "Z"
    );

    const now = new Date();

    const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const conversationDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    const difference =
        today - conversationDay;

    const days =
        Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );

    if (days === 0) {
        return "Today";
    }

    if (days === 1) {
        return "Yesterday";
    }

    if (days < 7) {
        return "Previous 7 Days";
    }

    if (days < 30) {
        return "Previous 30 Days";
    }

    return "Older";
}

async function loadConversations() {
    const response = await fetch(
        "/api/conversations"
    );

    const conversations = await response.json();

    conversationList.innerHTML = "";


    // Group conversations by date
    const groups = {};

    for (const conversation of conversations) {
        const groupName = getConversationGroup(
            conversation.updated_at
        );

        if (!groups[groupName]) {
            groups[groupName] = [];
        }

        groups[groupName].push(conversation);
    }


    // Order the groups
    const groupOrder = [
        "Today",
        "Yesterday",
        "Previous 7 Days",
        "Previous 30 Days",
        "Older"
    ];


    // Render groups
    for (const groupName of groupOrder) {
        const group = groups[groupName];

        if (!group) {
            continue;
        }


        // Group heading
        const heading = document.createElement("div");

        heading.classList.add(
            "conversation-group-title"
        );

        heading.textContent = groupName;

        conversationList.appendChild(heading);


        // Conversations inside this group
        for (const conversation of group) {
            const item = document.createElement("div");
            item.classList.add("conversation-item");
            item.dataset.conversationId = conversation.id;


            const title = document.createElement("button");
            title.classList.add("conversation-title");
            title.textContent = conversation.title;


            const menuContainer = document.createElement("div");
            menuContainer.classList.add(
                "conversation-menu-container"
            );


            const menuButton = document.createElement("button");
            menuButton.classList.add(
                "conversation-menu-button"
            );

            menuButton.textContent = "⋯";
            menuButton.title = "Conversation options";


            if (
                conversation.id ===
                currentConversationId
            ) {
                item.classList.add("active");
            }


            title.addEventListener(
                "click",
                () => {
                    loadConversation(
                        conversation.id
                    );
                }
            );


            menuButton.addEventListener(
                "click",
                (event) => {
                    event.stopPropagation();

                    openConversationMenu(
                        menuButton,
                        conversation
                    );
                }
            );


            menuContainer.appendChild(menuButton);

            item.appendChild(title);
            item.appendChild(menuContainer);

            conversationList.appendChild(item);
        }
    }


    return conversations;
}

function openConversationMenu(
    button,
    conversation
) {
    document
        .querySelectorAll(
            ".floating-conversation-menu"
        )
        .forEach((menu) => menu.remove());


    const menu = document.createElement("div");

    menu.classList.add(
        "floating-conversation-menu"
    );


    const renameOption =
        document.createElement("button");

    renameOption.classList.add(
        "conversation-menu-option"
    );

    renameOption.textContent = "Rename";


    const deleteOption =
        document.createElement("button");

    deleteOption.classList.add(
        "conversation-menu-option",
        "delete-option"
    );

    deleteOption.textContent = "Delete";


    renameOption.addEventListener(
        "click",
        async (event) => {
            event.stopPropagation();

            menu.remove();

            await renameConversation(
                conversation.id,
                conversation.title
            );
        }
    );


    deleteOption.addEventListener(
        "click",
        async (event) => {
            event.stopPropagation();

            menu.remove();

            await deleteConversation(
                conversation.id
            );
        }
    );


    menu.appendChild(renameOption);
    menu.appendChild(deleteOption);

    document.body.appendChild(menu);


    const rect =
        button.getBoundingClientRect();

    menu.style.top =
        `${rect.bottom + 4}px`;

    menu.style.left =
        `${rect.right - menu.offsetWidth}px`;
}

async function initializeApp() {
    const conversations =
        await loadConversations();

    if (conversations.length > 0) {
        await loadConversation(
            conversations[0].id
        );
    }

    else {
        startNewChat();
    }
}

initializeApp();

function showRagSection() {
    messages.style.display = "none";
    inputContainer.style.display = "none";

    chatTitle.textContent = "";

    showRagView();
}

function showChatSection() {
    messages.style.display = "block";

    inputContainer.style.display = "flex";

    console.log(
        "inputContainer:",
        inputContainer,
        "display:",
        inputContainer.style.display
    );

    hideRagView();

    if (currentConversationId !== null) {
        showConversationView(currentConversationId);
    }
}

function addStoredAssistantMessage(message, conversationId = currentConversationId) {
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

sendButton.addEventListener(
    "click",
    () => {
        const state =
            getResponseState(currentConversationId);

        if (state.generating) {
            stopChat(currentConversationId);
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

newChatButton.addEventListener(
    "click",
    startNewChat
);

ragSectionButton.addEventListener(
    "click",
    () => {
        console.log("RAG button clicked");
        showRagSection();
    }
);

document.addEventListener(
    "click",
    () => {
        document
            .querySelectorAll(
                ".floating-conversation-menu"
            )
            .forEach((menu) => {
                menu.remove();
            });
    }
);