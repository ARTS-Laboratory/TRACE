const attachButton =
    document.getElementById("attach-button");

const attachmentPreview =
    document.getElementById(
        "attachment-preview");

const fileInput =
    document.getElementById("file-input");

let currentAttachment = null;
let currentAttachmentUrl = null;   

export function getCurrentAttachment() {
    return currentAttachment;
}

function setAttachment(file) {
    clearAttachment();

    currentAttachment = file;

    attachmentPreview.innerHTML = "";
    attachmentPreview.classList.remove("hidden");


    const card = document.createElement("div");

    card.classList.add("attachment-card");


    if (file.type.startsWith("image/")) {
        currentAttachmentUrl =
            URL.createObjectURL(file);

        const image =
            document.createElement("img");

        image.classList.add(
            "attachment-image"
        );

        image.src = currentAttachmentUrl;
        image.alt = file.name;

        card.appendChild(image);
    }

    else {
        const icon =
            document.createElement("div");

        icon.classList.add(
            "attachment-icon"
        );

        if (file.type.startsWith("audio/")) {
            icon.textContent = "♪";
        }

        else {
            icon.textContent = "↗";
        }

        card.appendChild(icon);
    }


    const info = document.createElement("div");

    info.classList.add("attachment-info");


    const name = document.createElement("div");

    name.classList.add("attachment-name");
    name.textContent = file.name;


    const type = document.createElement("div");

    type.classList.add("attachment-type");

    if (file.type.startsWith("image/")) {
        type.textContent = "Image";
    }

    else if (file.type.startsWith("audio/")) {
        type.textContent = "Audio";
    }

    else {
        type.textContent = "File";
    }


    info.appendChild(name);
    info.appendChild(type);


    const removeButton =
        document.createElement("button");

    removeButton.classList.add(
        "attachment-remove"
    );

    removeButton.textContent = "×";
    removeButton.title = "Remove attachment";

    removeButton.addEventListener(
        "click",
        clearAttachment
    );


    card.appendChild(info);
    card.appendChild(removeButton);

    attachmentPreview.appendChild(card);
}

export async function uploadAttachment(
    file,
    conversationId,
    messageId
) {
    const formData = new FormData();

    formData.append("file", file);

    formData.append(
        "conversation_id",
        conversationId
    );

    formData.append(
        "message_id",
        messageId
    );

    const response = await fetch(
        "/api/attachments",
        {
            method: "POST",
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error(
            `Attachment upload failed: ${response.status}`
        );
    }

    const result = await response.json();

    if (result.error) {
        throw new Error(result.error);
    }

    return result;
}

export function clearAttachment() {
    if (currentAttachmentUrl) {
        URL.revokeObjectURL(
            currentAttachmentUrl
        );

        currentAttachmentUrl = null;
    }

    currentAttachment = null;

    fileInput.value = "";

    attachmentPreview.innerHTML = "";
    attachmentPreview.classList.add("hidden");
}

export function addMessageAttachment(
    messageElement,
    attachment
) {
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

        image.src =
            `/api/attachments/${attachment.id}`;

        image.alt =
            attachment.original_name;

        image.classList.add(
            "message-attachment-image"
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

    messageElement.appendChild(
        attachmentElement
    );

    lucide.createIcons();
}

function getAttachmentIconName(attachment) {
    const name =
        (attachment.original_name || "").toLowerCase();

    const type =
        attachment.content_type || "";

    if (type.startsWith("audio/")) {
        return "audio-lines";
    }

    if (
        type === "application/pdf" ||
        name.endsWith(".pdf")
    ) {
        return "file-text";
    }

    if (name.endsWith(".py")) {
        return "file-code";
    }

    if (name.endsWith(".json")) {
        return "braces";
    }

    if (name.endsWith(".csv")) {
        return "table";
    }

    if (
        name.endsWith(".md") ||
        name.endsWith(".txt")
    ) {
        return "file-text";
    }

    return "file";
}

function getAttachmentType(attachment) {
    const name =
        (attachment.original_name || "").toLowerCase();

    const type =
        attachment.content_type || "";

    if (type.startsWith("audio/")) {
        return "Audio";
    }

    if (type === "application/pdf" ||
        name.endsWith(".pdf")) {
        return "PDF";
    }

    if (name.endsWith(".py")) {
        return "Python";
    }

    if (name.endsWith(".json")) {
        return "JSON";
    }

    if (name.endsWith(".csv")) {
        return "CSV";
    }

    if (name.endsWith(".md")) {
        return "Markdown";
    }

    if (name.endsWith(".txt")) {
        return "Text";
    }

    return "File";
}

export function openImageViewer(imageUrl, altText) {
    const overlay = document.createElement("div");

    overlay.classList.add(
        "image-viewer-overlay"
    );

    const image = document.createElement("img");

    image.classList.add(
        "image-viewer-image"
    );

    image.src = imageUrl;
    image.alt = altText;

    overlay.appendChild(image);

    overlay.addEventListener(
        "click",
        () => {
            overlay.remove();
        }
    );

    document.body.appendChild(overlay);
}

attachButton.addEventListener(
    "click",
    () => {
        fileInput.click();
    }
);

fileInput.addEventListener(
    "change",
    () => {
        const file = fileInput.files[0];

        if (!file) {
            return;
        }

        setAttachment(file);
    }
);

