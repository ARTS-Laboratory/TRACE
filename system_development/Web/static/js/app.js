import {
    showRagView,
    hideRagView
} from "./rag.js";

import {
    initializeConversations,
    loadConversations,
    loadConversation,
    startNewChat,
} from "./conversations.js";

import {
    getResponseState,
    getConversationView,
    showConversationView,
    scrollToBottom,
    isNearBottom,
    sendMessage,
    stopChat,
    initializeChat,
    addUserMessage,
    addStoredAssistantMessage
} from "./chat.js";

import { state } from "./state.js";

const messages = document.getElementById("messages");

const input =
    document.getElementById("message-input");

const inputContainer =
    document.getElementById("input-container");

const newChatButton =
    document.getElementById("new-chat-button");

const chatTitle =
    document.getElementById("chat-title");

const ragSectionButton =
    document.getElementById("rag-section-button");

const chat =
    document.getElementById("chat");

initializeConversations({
    chatTitle,
    chat,
    input,
    getConversationView,
    showConversationView,
    showChatSection,
    addUserMessage,
    addStoredAssistantMessage,
    scrollToBottom
});

async function initializeApp() {
    const conversations =
        await loadConversations();

    console.log(
        "Loaded conversations:",
        conversations
    );

    if (conversations.length > 0) {
        await loadConversation(
            conversations[0].id
        );
    }
    else {
        startNewChat();
    }
}

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

    if (state.currentConversationId !== null) {
        showConversationView(state.currentConversationId);
    }
}

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

initializeChat();
initializeApp();
