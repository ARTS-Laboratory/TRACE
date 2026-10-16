const conversationList =
    document.getElementById("conversation-list");

export async function loadConversations() {
    const response = await fetch(
        "/api/conversations"
    );

    const conversations = await response.json();

    conversationList.innerHTML = "";

    for (const conversation of conversations) {
        const item = document.createElement("div");

        item.classList.add("conversation-item");

        item.dataset.conversationId =
            conversation.id;


        const title = document.createElement("button");

        title.classList.add("conversation-title");

        title.textContent = conversation.title;

        const renameButton = document.createElement("button");

        renameButton.classList.add("conversation-rename");
        renameButton.textContent = "✎";
        renameButton.title = "Rename chat";

        renameButton.addEventListener(
            "click",
            async (event) => {
                event.stopPropagation();

                await renameConversation(
                    conversation.id,
                    conversation.title
                );
            }
        );

        const deleteButton = document.createElement("button");

        deleteButton.classList.add("conversation-delete");

        deleteButton.textContent = "×";

        deleteButton.title = "Delete chat";


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


        deleteButton.addEventListener(
            "click",
            async (event) => {
                event.stopPropagation();

                await deleteConversation(
                    conversation.id
                );
            }
        );


        item.appendChild(title);
        item.appendChild(renameButton);
        item.appendChild(deleteButton);

        conversationList.appendChild(item);
    }

    return conversations;
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