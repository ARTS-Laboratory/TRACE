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
const ragFilesByCard = new WeakMap();
let ragIngestionRunning = false;

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
    if (ragIngestionRunning) return;

    for (const file of files) {

        const card = document.createElement("div");

        ragFilesByCard.set(card, file);
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
                if (ragIngestionRunning) return;
                ragFilesByCard.delete(card);
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
        "/api/rag/collections",
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

    if (data.error || !Array.isArray(data.collections)) {
        console.error("Failed to load collections:", data.error || data);
        return;
    }

    const selectionBeforeRefresh = selectedRagCollection;
    const previousSelection = collectionToSelect ?? selectedRagCollection;
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

    if (previousSelection && collectionNames.includes(previousSelection)) {
        ragCollection.value = previousSelection;
    }

    selectedRagCollection = ragCollection.value || null;
    if (selectionBeforeRefresh !== selectedRagCollection) {
        resetRagSearch();
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
        `/api/rag/collections/${encodeURIComponent(collection_name)}`,
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

    const data = await response.json();

    if (data.error || data.deleted !== true) {
        console.error("Failed to delete collection:", data.error || data);
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
        if (ragIngestionRunning) return;
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

        if (ragIngestionRunning) return;

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
            "/api/rag/collections",
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


// Manual retrieval uses the same retrieval functions as the agent tools.
const ragQueryInput = document.getElementById("rag-query-input");
const ragQueryButton = document.getElementById("rag-query-button");
const ragQueryMethod = document.getElementById("rag-query-method");
const ragQueryLimit = document.getElementById("rag-query-limit");
const ragQueryStatus = document.getElementById("rag-query-status");
const ragResults = document.getElementById("rag-results");
let ragSearchController = null;

function setRagQueryStatus(message, isError = false) {
    ragQueryStatus.textContent = message;
    ragQueryStatus.dataset.error = String(isError);
}

function resetRagSearch() {
    if (ragSearchController) {
        ragSearchController.abort();
        ragSearchController = null;
    }
    ragQueryButton.disabled = false;
    ragQueryButton.textContent = "Query";
    ragResults.setAttribute("aria-busy", "false");
    ragResults.replaceChildren();
    setRagQueryStatus("");
}

function renderRagSearchResults(results, method) {
    ragResults.replaceChildren();
    const methodLabel = method === "keyword" ? "BM25 keyword" : "Vector similarity";
    for (const [index, hit] of results.entries()) {
        const chunk = hit.chunk || {};
        const metadata = chunk.metadata || {};
        const card = document.createElement("article");
        card.className = "rag-search-result";

        const title = document.createElement("h4");
        title.textContent = `${index + 1}. ${metadata.file_name || "Unknown source"}`;
        card.appendChild(title);

        const info = document.createElement("div");
        info.className = "rag-result-meta";
        const parts = [methodLabel];
        if (typeof hit.score === "number" && Number.isFinite(hit.score)) {
            parts.push(`Score: ${hit.score.toFixed(4)}`);
        }
        if (Array.isArray(metadata.page_numbers) && metadata.page_numbers.length) {
            parts.push(`Pages: ${metadata.page_numbers.join(", ")}`);
        }
        info.textContent = parts.join(" · ");
        card.appendChild(info);

        if (Array.isArray(metadata.headings) && metadata.headings.length) {
            const headings = document.createElement("div");
            headings.className = "rag-result-meta";
            headings.textContent = metadata.headings.join(" › ");
            card.appendChild(headings);
        }

        const passage = document.createElement("div");
        passage.className = "rag-result-text";
        passage.textContent = chunk.source_text ?? chunk.embedding_text ?? "No passage text available.";
        card.appendChild(passage);

        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = "Source details";
        details.appendChild(summary);
        for (const [label, value] of [
            ["Document ID", chunk.document_id],
            ["Chunk ID", chunk.chunk_id],
            ["Point ID", hit.point_id],
            ["Source references", Array.isArray(metadata.source_refs) ? metadata.source_refs.join(", ") : null],
        ]) {
            if (value) {
                const row = document.createElement("div");
                row.textContent = `${label}: ${value}`;
                details.appendChild(row);
            }
        }
        card.appendChild(details);
        const copyLines = [
            metadata.file_name || "Unknown source",
            info.textContent,
        ];
        if (Array.isArray(metadata.headings) && metadata.headings.length) {
            copyLines.push(metadata.headings.join(" › "));
        }
        copyLines.push("", passage.textContent);
        addRagResultCopyButton(card, copyLines.join("\n"), index + 1);
        ragResults.appendChild(card);
    }
    if (typeof lucide !== "undefined") lucide.createIcons();
}

async function copyRagResultText(text) {
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return;
        } catch {
            // Try the selection-based fallback for browsers blocking this API.
        }
    }

    const previousFocus = document.activeElement;
    const selection = window.getSelection();
    const previousRanges = [];
    if (selection) {
        for (let index = 0; index < selection.rangeCount; index += 1) {
            previousRanges.push(selection.getRangeAt(index).cloneRange());
        }
    }
    const temporary = document.createElement("textarea");
    temporary.value = text;
    temporary.readOnly = true;
    temporary.style.position = "fixed";
    temporary.style.left = "-9999px";
    document.body.appendChild(temporary);
    try {
        temporary.focus({preventScroll: true});
        temporary.select();
        if (!document.execCommand("copy")) throw new Error("Copy unavailable");
    } finally {
        temporary.remove();
        if (previousFocus?.focus) previousFocus.focus({preventScroll: true});
        if (selection) {
            selection.removeAllRanges();
            for (const range of previousRanges) selection.addRange(range);
        }
    }
}

function addRagResultCopyButton(card, text, resultNumber) {
    const actions = document.createElement("div");
    actions.className = "rag-result-actions";
    actions.style.display = "flex";
    actions.style.alignItems = "center";
    actions.style.gap = "10px";
    actions.style.marginTop = "12px";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "rag-result-copy-button";
    button.title = "Copy passage and source information";
    button.setAttribute("aria-label", `Copy result ${resultNumber}`);
    button.style.display = "inline-flex";
    button.style.alignItems = "center";
    button.style.gap = "6px";
    button.style.padding = "6px 10px";
    button.style.borderRadius = "6px";
    button.style.border = "1px solid currentColor";
    button.style.background = "transparent";
    button.style.color = "inherit";
    button.style.cursor = "pointer";

    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", "copy");
    icon.setAttribute("aria-hidden", "true");
    icon.style.width = "16px";
    icon.style.height = "16px";
    const label = document.createElement("span");
    label.textContent = "Copy";
    button.appendChild(icon);
    button.appendChild(label);

    const feedback = document.createElement("span");
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    feedback.style.fontSize = "0.85em";
    let resetTimer = null;

    button.addEventListener("click", async () => {
        if (button.disabled) return;
        if (resetTimer !== null) clearTimeout(resetTimer);
        button.disabled = true;
        feedback.textContent = "";
        try {
            await copyRagResultText(text);
            label.textContent = "Copied";
            feedback.textContent = "Copied to clipboard.";
        } catch {
            label.textContent = "Copy";
            feedback.textContent = "Copy failed. Select the passage and copy it manually.";
        } finally {
            button.disabled = false;
            resetTimer = setTimeout(() => {
                label.textContent = "Copy";
                feedback.textContent = "";
                resetTimer = null;
            }, 2500);
        }
    });
    actions.appendChild(button);
    actions.appendChild(feedback);
    card.appendChild(actions);
}

function ragSearchErrorMessage(data, status) {
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
        return data.detail.map(item => {
            const field = Array.isArray(item.loc) ? item.loc.filter(part => part !== "body").join(".") : "";
            return `${field ? field + ": " : ""}${item.msg || "Invalid value"}`;
        }).join("; ");
    }
    if (typeof data.error === "string") return data.error;
    return `Search failed (HTTP ${status}).`;
}

async function searchRagCollection() {
    if (ragSearchController) return;
    const collectionName = ragCollection.value;
    const query = ragQueryInput.value.trim();
    const method = ragQueryMethod.value;
    const limit = Number(ragQueryLimit.value);
    ragResults.replaceChildren();

    if (!collectionName) {
        setRagQueryStatus("Select a collection before searching.", true);
        return;
    }
    if (!query) {
        setRagQueryStatus("Enter a query before searching.", true);
        ragQueryInput.focus();
        return;
    }
    if (!Number.isSafeInteger(limit) || limit < 1) {
        setRagQueryStatus("Result count must be a whole number of at least 1.", true);
        ragQueryLimit.focus();
        return;
    }

    const controller = new AbortController();
    ragSearchController = controller;
    ragQueryButton.disabled = true;
    ragQueryButton.textContent = "Searching…";
    ragResults.setAttribute("aria-busy", "true");
    setRagQueryStatus(method === "vector"
        ? "Searching with vector similarity. The first query may take longer while the model loads."
        : "Searching with BM25 keywords…");

    try {
        const response = await fetch("/api/rag/search", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({collection_name: collectionName, query, method, limit}),
            signal: controller.signal,
        });
        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error(`Search failed: the server returned an unreadable response (HTTP ${response.status}).`);
        }
        if (controller.signal.aborted || ragSearchController !== controller) return;
        if (!data || typeof data !== "object") throw new Error("Search returned an unexpected response.");
        if (!response.ok || data.error) {
            throw new Error(ragSearchErrorMessage(data, response.status));
        }
        if (!Array.isArray(data.results)) throw new Error("Search returned an unexpected response.");
        renderRagSearchResults(data.results, method);
        const methodLabel = method === "keyword" ? "BM25 keyword" : "Vector similarity";
        setRagQueryStatus(data.results.length
            ? `${data.results.length} result${data.results.length === 1 ? "" : "s"} · ${methodLabel} · ${collectionName}`
            : `No matching passages found · ${methodLabel} · ${collectionName}`);
    } catch (error) {
        if (controller.signal.aborted || ragSearchController !== controller) return;
        setRagQueryStatus(error instanceof TypeError
            ? "Could not reach the search service. Check the connection and try again."
            : error.message, true);
    } finally {
        if (ragSearchController === controller) {
            ragSearchController = null;
            ragQueryButton.disabled = false;
            ragQueryButton.textContent = "Query";
            ragResults.setAttribute("aria-busy", "false");
        }
    }
}

ragQueryButton.addEventListener("click", searchRagCollection);
ragQueryInput.addEventListener("keydown", event => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        searchRagCollection();
    }
});
ragCollection.addEventListener("change", resetRagSearch);
ragQueryMethod.addEventListener("change", resetRagSearch);

// Keep File objects associated with cards so drag-and-drop order is preserved.
const ragIngestButton = document.getElementById("rag-ingest-button");
const ragProgressSection = document.getElementById("rag-progress-section");
const ragProgressList = document.getElementById("rag-progress-list");

function ingestionErrorMessage(data, status) {
    if (typeof data?.detail === "string") return data.detail;
    if (Array.isArray(data?.detail)) {
        return data.detail.map(item => item.msg || "Invalid upload").join("; ");
    }
    if (typeof data?.error === "string") return data.error;
    return `Ingestion failed (HTTP ${status}). Check the application logs for details.`;
}

async function ingestRagDocuments() {
    if (ragIngestionRunning) return;
    ragProgressSection.style.display = "block";
    ragProgressList.replaceChildren();
    ragProgressList.setAttribute("aria-live", "polite");

    // Snapshot the displayed order only when the user presses Ingest.
    const queue = Array.from(ragSelectedFiles.querySelectorAll(".rag-file-card"))
        .map(card => ({card, file: ragFilesByCard.get(card)}));
    const collectionName = ragCollection.value;
    const summary = document.createElement("p");
    ragProgressList.appendChild(summary);

    if (!collectionName) {
        summary.textContent = "Select a collection before ingesting documents.";
        return;
    }
    if (!queue.length) {
        summary.textContent = "Add at least one document before ingesting.";
        return;
    }
    if (queue.some(item => !item.file)) {
        summary.textContent = "A selected file is unavailable. Remove it and attach it again.";
        return;
    }

    const rows = queue.map(({file}, index) => {
        const row = document.createElement("p");
        row.className = "rag-ingestion-status";
        row.textContent = `${index + 1}. ${file.name} — Waiting`;
        row.style.overflowWrap = "anywhere";
        ragProgressList.appendChild(row);
        return row;
    });
    const controls = [ragIngestButton, ragCollection, ragFileInput,
        ragNewCollectionButton, ragDeleteCollectionButton,
        ragCreateCollectionButton,
        ...ragSelectedFiles.querySelectorAll(".rag-file-remove")];
    const disabledBefore = controls.map(control => control.disabled);
    const draggableBefore = queue.map(({card}) => card.draggable);
    const buttonText = ragIngestButton.textContent;
    let succeeded = 0;
    let failed = 0;
    let uncertain = 0;
    let completed = 0;

    ragIngestionRunning = true;
    controls.forEach(control => { control.disabled = true; });
    queue.forEach(({card}) => { card.draggable = false; });
    ragDropZone.classList.remove("dragging");
    ragDropZone.setAttribute("aria-disabled", "true");
    ragIngestButton.textContent = "Ingesting…";

    try {
        for (const [index, {file}] of queue.entries()) {
            summary.textContent = `Processing ${index + 1} of ${queue.length} in ${collectionName}.`;
            rows[index].textContent = `${index + 1}. ${file.name} — Uploading and processing…`;
            rows[index].dataset.state = "processing";
            const form = new FormData();
            form.append("collection_name", collectionName);
            form.append("file", file, file.name);

            let response;
            try {
                response = await fetch("/api/rag/ingest", {method: "POST", body: form});
            } catch {
                // A lost connection does not prove that the server stopped.
                // Stop this queue so later files cannot overtake that request.
                uncertain += 1;
                rows[index].textContent = `${index + 1}. ${file.name} — Connection interrupted; completion unknown. Check the collection before retrying.`;
                rows[index].dataset.state = "unknown";
                break;
            }

            try {
                let data;
                try {
                    data = await response.json();
                } catch {
                    throw new Error(`Server returned an unreadable response (HTTP ${response.status}).`);
                }
                if (!response.ok || data?.error) {
                    throw new Error(ingestionErrorMessage(data, response.status));
                }
                if (data?.status !== "success" || !Number.isInteger(data.chunk_count) || data.chunk_count < 1) {
                    throw new Error("The server did not confirm successful ingestion.");
                }
                succeeded += 1;
                rows[index].dataset.state = "success";
                const parser = data.parser ? ` · ${data.parser}` : "";
                rows[index].textContent = `${index + 1}. ${file.name} — Complete · ${data.chunk_count} chunks${parser}`;
            } catch (error) {
                failed += 1;
                rows[index].dataset.state = "failed";
                rows[index].textContent = `${index + 1}. ${file.name} — Failed: ${error.message}`;
            }
            completed += 1;
        }
        const notStarted = queue.length - completed - uncertain;
        summary.textContent = `${succeeded} succeeded · ${failed} failed`
            + (uncertain ? ` · ${uncertain} unconfirmed` : "")
            + (notStarted ? ` · ${notStarted} not started` : "")
            + ` · Collection: ${collectionName}`;
        if (uncertain) {
            for (let index = completed + uncertain; index < queue.length; index += 1) {
                rows[index].textContent = `${index + 1}. ${queue[index].file.name} — Not started; queue stopped after connection interruption.`;
                rows[index].dataset.state = "not-started";
            }
        }
    } finally {
        controls.forEach((control, index) => { control.disabled = disabledBefore[index]; });
        queue.forEach(({card}, index) => { card.draggable = draggableBefore[index]; });
        ragDropZone.setAttribute("aria-disabled", "false");
        ragIngestButton.textContent = buttonText;
        ragIngestionRunning = false;
    }
}

ragIngestButton.addEventListener("click", ingestRagDocuments);
