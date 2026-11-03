const ragView =
    document.getElementById("rag-view");

const ragSectionButton =
    document.getElementById("rag-section-button");

const ragCollection =
    document.getElementById("rag-collection");

const ragDropZone =
    document.getElementById("rag-drop-zone");


const ragFileInput =
    document.getElementById("rag-file-input");

const ragSelectedFiles =
    document.getElementById("rag-selected-files");

const ragNewCollectionButton =
    document.getElementById(
        "rag-new-collection-button"
    );

const ragDeleteCollectionButton = 
    document.getElementById(
        "rag-delete-collection-button"
    )

const ragCollectionModal =
    document.getElementById(
        "rag-collection-modal"
    );

const ragCollectionNameInput =
    document.getElementById(
        "rag-collection-name"
    );

const ragCollectionDescriptionInput =
    document.getElementById(
        "rag-collection-description"
    );

const ragCancelCollectionButton =
    document.getElementById(
        "rag-cancel-collection-button"
    );


const ragCreateCollectionButton =
    document.getElementById(
        "rag-create-collection-button"
    );

let selectedRagCollection = null;

export function showRagView() {
    ragView.style.display = "block";
    ragSectionButton.classList.add("active");

    loadRagCollections();
}

export function hideRagView() {
    ragView.style.display = "none";
    ragSectionButton.classList.remove("active");
}

function addRagFiles(files) {

    for (const file of files) {

        const card = document.createElement("div");

        card.draggable = true;
        card.classList.add("rag-file-card");

        card.addEventListener(
            "dragstart",
            () => {
                card.classList.add("dragging");
            }
        );

        card.addEventListener(
            "dragend",
            () => {
                card.classList.remove("dragging");
            }
        );

        const icon = document.createElement("i");

        icon.setAttribute(
            "data-lucide",
            "file-text"
        );

        const info = document.createElement("div");

        info.classList.add("rag-file-info");

        const name = document.createElement("div");

        name.classList.add("rag-file-name");

        name.textContent = file.name;

        const meta = document.createElement("div");

        meta.classList.add("rag-file-meta");

        meta.textContent = file.type || "Unknown type";

        info.appendChild(name);
        info.appendChild(meta);

        const removeButton =
            document.createElement("button");

        removeButton.classList.add(
            "rag-file-remove"
        );

        removeButton.type = "button";
        removeButton.title = "Remove";
        removeButton.textContent = "×";

        removeButton.addEventListener(
            "click",
            () => {
                card.remove();
            }
        );

        card.appendChild(icon);
        card.appendChild(info);
        card.appendChild(removeButton);

        ragSelectedFiles.appendChild(card);
    }

    lucide.createIcons();
}

function isIpAddress(name) {

    const parts = name.split(".");

    if (parts.length !== 4) {
        return false;
    }

    return parts.every(
        (part) => {

            if (!/^\d+$/.test(part)) {
                return false;
            }

            const value = Number(part);

            return (
                value >= 0 &&
                value <= 255
            );
        }
    );
}

function validateCollectionName(name) {

    return {
        length:
            name.length >= 3 &&
            name.length <= 512,

        edges:
            /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/.test(name),

        characters:
            /^[a-z0-9._-]+$/.test(name),

        dots:
            !name.includes(".."),

        ip:
            !isIpAddress(name)
    };
}

function updateCollectionRequirements() {

        const requirements =
            validateCollectionName(
                ragCollectionNameInput.value
            );

        for (
            const [name, valid]
            of Object.entries(requirements)
        ) {

            const requirement =
                document.querySelector(
                    `.rag-name-requirement[data-requirement="${name}"]`
                );

            requirement.classList.toggle(
                "valid",
                valid
            );

            const icon =
                requirement.querySelector(
                    "svg, i"
                );

            if (valid) {
                icon.setAttribute(
                    "data-lucide",
                    "circle-check"
                );
            }
            else {
                icon.setAttribute(
                    "data-lucide",
                    "circle-x"
                );
            }
        }

        lucide.createIcons();

        const allValid =
            Object.values(requirements)
                .every(Boolean);

        ragCreateCollectionButton.disabled =
            !allValid;
    }

async function loadRagCollections(collectionToSelect = null) {

    const collections = await fetch(
        "/api/chromadb/collections",
        {
            method: "GET"
        }
    );

    if (!collections.ok) {
        console.error(
            "Failed to load collections"
        );

        return;
    }

    const data = await collections.json();

    const collectionNames = data.collections;

    collectionNames.sort(
        (a, b) => a.localeCompare(b)
    );

    ragCollection.innerHTML = "";

    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";
    defaultOption.textContent =
        "Select collection...";

    ragCollection.appendChild(
        defaultOption
    );

    for (const name of collectionNames) {

        const option =
            document.createElement("option");

        option.value = name;
        option.textContent = name;

        ragCollection.appendChild(option);
    }

    if (collectionToSelect !== null) {
        ragCollection.value = collectionToSelect;
    }
}

async function deleteRagCollection(collection_name) {

    const confirmDelete = window.confirm(
        "Delete this collection?"
    );

    if (!confirmDelete) {
        return;
    }

    const response = await fetch(
        `/api/chromadb/collections/${collection_name}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        console.error(
            "Failed to delete collection"
        );

        return;
    }

    await loadRagCollections();
}

function getDragAfterElement(container, y) {

    const cards = [
        ...container.querySelectorAll(
            ".rag-file-card:not(.dragging)"
        )
    ];

    let closest = {
        offset: Number.NEGATIVE_INFINITY,
        element: null
    };

    for (const card of cards) {

        const box =
            card.getBoundingClientRect();

        const offset =
            y - box.top - box.height / 2;

        if (
            offset < 0 &&
            offset > closest.offset
        ) {
            closest = {
                offset: offset,
                element: card
            };
        }
    }

    return closest.element;
}

ragDropZone.addEventListener(
    "click",
    () => {
        ragFileInput.click();
    }
);

ragDropZone.addEventListener(
    "dragover",
    (event) => {

        event.preventDefault();

        ragDropZone.classList.add(
            "dragging"
        );
    }
);

ragDropZone.addEventListener(
    "dragleave",
    () => {

        ragDropZone.classList.remove(
            "dragging"
        );
    }
);

ragDropZone.addEventListener(
    "drop",
    (event) => {

        event.preventDefault();

        ragDropZone.classList.remove(
            "dragging"
        );

        addRagFiles(
            event.dataTransfer.files
        );
    }
);

ragFileInput.addEventListener(
    "change",
    () => {

        if (ragFileInput.files.length === 0) {
            return;
        }

        addRagFiles(
            ragFileInput.files
        );

        ragFileInput.value = "";
    }
);

ragSelectedFiles.addEventListener(
    "dragover",
    (event) => {

        event.preventDefault();

        const dragging =
            ragSelectedFiles.querySelector(
                ".dragging"
            );

        if (!dragging) {
            return;
        }

        const afterElement =
            getDragAfterElement(
                ragSelectedFiles,
                event.clientY
            );

        if (afterElement === null) {
            ragSelectedFiles.appendChild(
                dragging
            );
        }
        else {
            ragSelectedFiles.insertBefore(
                dragging,
                afterElement
            );
        }
    }
);

ragNewCollectionButton.addEventListener(
    "click",
    () => {
        ragCollectionModal.style.display = "flex";
    }
);

ragCancelCollectionButton.addEventListener(
    "click",
    () => {
        ragCollectionModal.style.display = "none";
    }
);

ragCollectionModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === ragCollectionModal
        ) {
            ragCollectionModal.style.display = "none";
        }

    }
);

ragCollection.addEventListener(
    "change",
    () => {
        selectedRagCollection =
            ragCollection.value;

        console.log(
            "Selected RAG collection:",
            selectedRagCollection
        );
    }
);

ragDeleteCollectionButton.addEventListener(
    "click",
    () => {
        if (!selectedRagCollection) {
            return;
        }

        deleteRagCollection(
            selectedRagCollection
        );
    }
);

ragCreateCollectionButton.addEventListener(
    "click",
    async () => {
        const collectionName = ragCollectionNameInput.value.trim();
        const collectionDescription = ragCollectionDescriptionInput.value.trim();
        
        if (!collectionName) {
            alert("Collection name cannot be empty.");
            return;
        }

        const response = await fetch(
            "/api/chromadb/collections",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    collection_name: collectionName,
                    collection_description: collectionDescription
                })
            }
        );

        if (!response.ok) {
            console.error(
                "Failed to create collection"
            );
            return;
        }

        const created_collection = await response.json();

        if (created_collection.error) {
            console.error(
                "Failed to create collection:",
                created_collection.error
            );

            

            return;
        }

        ragCollectionModal.style.display = "none";

        ragCollectionNameInput.value = "";
        ragCollectionDescriptionInput.value = "";

        await loadRagCollections(
            created_collection.collection
        );
    }
);

ragCollectionNameInput.addEventListener(
    "input",
    updateCollectionRequirements
);

