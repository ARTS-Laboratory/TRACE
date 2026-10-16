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
    let hasAttachment = false;

    if (currentAttachment !== null) {
        hasAttachment = true;
    }

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
