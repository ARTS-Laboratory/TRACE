import { state } from "./state.js";

let chatTitle;
let chat;
let input;

let getConversationView;
let showConversationView;
let showChatSection;
let addUserMessage;
let addStoredAssistantMessage;
let scrollToBottom;

const conversationList =
    document.getElementById("conversation-list");

export function initializeConversations(dependencies) {
    chatTitle = dependencies.chatTitle;
    chat = dependencies.chat;
    input = dependencies.input;

    getConversationView =
        dependencies.getConversationView;

    showConversationView =
        dependencies.showConversationView;

    showChatSection =
        dependencies.showChatSection;

    addUserMessage =
        dependencies.addUserMessage;

    addStoredAssistantMessage =
        dependencies.addStoredAssistantMessage;

    scrollToBottom =
        dependencies.scrollToBottom;
}

export async function loadConversations() {
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
                state.currentConversationId
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

export async function loadConversation(conversationId) {
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

    state.currentConversationId = conversation.id;
    showChatSection();
    chat.classList.remove("new-chat");
    showConversationView(conversation.id);

    await loadConversations();

    state.autoScroll = true;

    scrollToBottom(true);
}

export function startNewChat() {
    if (state.currentConversationId !== null) {
        const currentView =
            state.conversationViews.get(state.currentConversationId);

        if (currentView) {
            currentView.style.display = "none";
        }
    }

    state.currentConversationId = null;
    chat.classList.add("new-chat");

    document
        .querySelectorAll(".conversation-item.active")
        .forEach((item) => {
            item.classList.remove("active");
        });

    input.value = "";
    input.focus();

    state.autoScroll = true;
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
        conversationId === state.currentConversationId;

    const view = state.conversationViews.get(conversationId);
    if (view) {
        view.remove();
        state.conversationViews.delete(conversationId);
    }

    state.responseStates.delete(conversationId);

    if (deletedCurrent) {
        state.currentConversationId = null;
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

export function updateConversationTitle(
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

    if (conversationId === state.currentConversationId) {
        chatTitle.textContent = title;
    }

}