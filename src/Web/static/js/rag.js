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
    if (hasActiveJobsForCollection(collection_name)) {
        ragSubmissionNotice = "This collection has active ingestion jobs. Wait for them to finish before deleting it.";
        renderRagJobs();
        return;
    }

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

// Uploads return job IDs; the worker owns processing after the upload finishes.
const ragIngestButton = document.getElementById("rag-ingest-button");
const ragProgressSection = document.getElementById("rag-progress-section");
const ragProgressList = document.getElementById("rag-progress-list");
const ragProgressSummary = document.getElementById("rag-progress-summary");
const ragProgressNotice = document.getElementById("rag-progress-notice");
const ragClearFinishedButton = document.getElementById("rag-clear-finished");
const RAG_JOB_STORAGE_KEY = "glorpcat.ingestion-jobs.v1";
const RAG_TERMINAL_STATUSES = new Set(["succeeded", "failed", "interrupted"]);
const RAG_JOB_STATUSES = new Set(["queued", "running", ...RAG_TERMINAL_STATUSES]);
const ragTrackedJobs = new Map();
const ragJobElements = new Map();
let ragPollTimer = null;
let ragPollInFlight = false;
let ragClockTimer = null;
let ragStorageWarning = "";
let ragSubmissionNotice = "";

function setJobText(element, text) {
    if (element.textContent !== text) element.textContent = text;
}

function formatRagDuration(seconds) {
    const total = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const remainder = total % 60;
    return hours ? `${hours}h ${minutes}m ${remainder}s` : `${minutes}m ${remainder}s`;
}

function isJobTimestamp(value) {
    return typeof value === "number" && Number.isFinite(value);
}

function ragStageLabel(stage) {
    return ({
        queued: "Queued",
        starting: "Starting",
        validating: "Validating document",
        routing_and_parsing: "Routing and parsing (includes service startup)",
        starting_parsing_services: "Starting parsing services",
        parsing: "Parsing document",
        chunking: "Chunking document",
        embedding_and_storing: "Embedding and storing",
        succeeded: "Complete",
        failed: "Failed",
        interrupted: "Interrupted",
    })[stage] || String(stage || "Waiting for status").replaceAll("_", " ");
}

function ingestionErrorMessage(data, status) {
    if (typeof data?.detail === "string") return data.detail;
    if (Array.isArray(data?.detail)) {
        return data.detail.map(item => item.msg || "Invalid upload").join("; ");
    }
    if (typeof data?.error === "string") return data.error;
    return `Request failed (HTTP ${status}). Check the application logs for details.`;
}

function isTrackedJobActive(entry) {
    return Boolean(entry.job_id) && !entry.trackingStopped
        && !RAG_TERMINAL_STATUSES.has(entry.job?.status);
}

function hasActiveJobsForCollection(collectionName) {
    return Array.from(ragTrackedJobs.values()).some(entry =>
        entry.collection_name === collectionName && isTrackedJobActive(entry));
}

function persistRagJobs() {
    // Keep all unfinished jobs and the 50 most recent finished/local records.
    const entries = Array.from(ragTrackedJobs.values());
    const finished = entries.filter(entry => !isTrackedJobActive(entry)).slice(-50);
    const keep = new Set(finished.map(entry => entry.key));
    const saved = entries.filter(entry => isTrackedJobActive(entry) || keep.has(entry.key))
        .map(entry => ({
            key: entry.key,
            job_id: entry.job_id,
            original_name: entry.original_name,
            collection_name: entry.collection_name,
            submitted_at: entry.submitted_at,
            observed_at: entry.observed_at,
            transport: entry.transport,
            message: entry.message,
            job: entry.job,
            trackingStopped: entry.trackingStopped,
        }));
    try {
        localStorage.setItem(RAG_JOB_STORAGE_KEY, JSON.stringify(saved));
        ragStorageWarning = "";
    } catch {
        ragStorageWarning = "Browser storage is unavailable. Keep this page open to retain job tracking.";
    }
}

function ensureRagJobElements(entry) {
    if (ragJobElements.has(entry.key)) return ragJobElements.get(entry.key);
    const card = document.createElement("article");
    card.className = "rag-job-card";
    const name = document.createElement("h4");
    const collection = document.createElement("div");
    collection.className = "rag-job-meta";
    const status = document.createElement("p");
    status.className = "rag-job-status";
    status.setAttribute("role", "status");
    const timer = document.createElement("p");
    timer.className = "rag-job-timer";
    const stageTimer = document.createElement("p");
    stageTimer.className = "rag-job-meta";
    const message = document.createElement("p");
    message.className = "rag-job-message";
    const details = document.createElement("details");
    const title = document.createElement("summary");
    title.textContent = "Stage durations and job ID";
    const timingBody = document.createElement("div");
    details.appendChild(title);
    details.appendChild(timingBody);
    for (const element of [name, collection, status, timer, stageTimer, message, details]) {
        card.appendChild(element);
    }
    ragProgressList.appendChild(card);
    const elements = {card, name, collection, status, timer, stageTimer, message, details, timingBody};
    ragJobElements.set(entry.key, elements);
    return elements;
}

function updateRagJobClock(entry, now) {
    const elements = ragJobElements.get(entry.key);
    if (!elements) return;
    const job = entry.job;
    let totalText = "";
    let stageText = "";
    if (job) {
        const end = isJobTimestamp(job.finished_at) ? job.finished_at
            : entry.trackingStopped ? entry.observed_at : now;
        if (job.status === "queued" && isJobTimestamp(job.created_at)) {
            totalText = `Waiting: ${formatRagDuration(end - job.created_at)}`;
        } else if (isJobTimestamp(job.started_at)) {
            const label = job.status === "interrupted" ? "Time until interruption detected"
                : RAG_TERMINAL_STATUSES.has(job.status) ? "Processing time" : "Elapsed";
            totalText = `${label}: ${formatRagDuration(end - job.started_at)}`;
            if (isJobTimestamp(job.created_at)) {
                totalText += ` · Queued: ${formatRagDuration(job.started_at - job.created_at)}`;
            }
        }
        if (job.status === "running" && isJobTimestamp(job.stage_started_at)) {
            stageText = `Current stage: ${formatRagDuration(end - job.stage_started_at)}`;
        }
    } else if (entry.transport === "uploading") {
        totalText = `Uploading: ${formatRagDuration(now - entry.submitted_at)}`;
    } else if (entry.job_id) {
        totalText = "Waiting for server timestamps…";
    }
    setJobText(elements.timer, totalText);
    setJobText(elements.stageTimer, stageText);
}

function renderRagJobs() {
    ragProgressSection.style.display = ragTrackedJobs.size || ragSubmissionNotice || ragStorageWarning ? "block" : "none";
    const counts = {};
    for (const entry of ragTrackedJobs.values()) {
        const elements = ensureRagJobElements(entry);
        const status = entry.trackingStopped ? "unavailable" : entry.transport || entry.job?.status || "queued";
        counts[status] = (counts[status] || 0) + 1;
        elements.card.dataset.state = status;
        setJobText(elements.name, entry.original_name);
        setJobText(elements.collection, `Collection: ${entry.collection_name}`);
        let label = entry.job ? ragStageLabel(entry.job.stage) : "Queued · waiting for first status update";
        if (entry.transport) {
            label = ({waiting_upload: "Waiting to upload", uploading: "Uploading…",
                upload_failed: "Upload failed", unconfirmed: "Submission unconfirmed",
                not_submitted: "Not submitted"})[entry.transport] || entry.transport;
        } else if (entry.trackingStopped) {
            label = "Job not found · tracking stopped";
        } else if (entry.job?.status === "succeeded") {
            const result = entry.job.result;
            label = "Complete";
            if (Number.isInteger(result?.chunk_count)) label += ` · ${result.chunk_count} chunks`;
            if (result?.parser) label += ` · ${result.parser}`;
        } else if (entry.job?.status === "failed") {
            label = "Failed";
        } else if (entry.job?.status === "interrupted") {
            label = "Interrupted · completion unknown";
        }
        setJobText(elements.status, label);
        const messages = [entry.message, entry.pollNotice, entry.job?.error].filter(Boolean);
        if (entry.job?.status === "interrupted") {
            messages.push("The actual stop time is unknown; the timer ends when the restart detected the interruption. Check the collection before retrying.");
        }
        setJobText(elements.message, messages.join(" "));
        elements.timingBody.replaceChildren();
        if (entry.job_id) {
            const id = document.createElement("p");
            id.textContent = `Job ID: ${entry.job_id}`;
            elements.timingBody.appendChild(id);
        }
        for (const [stage, seconds] of Object.entries(entry.job?.stage_timings || {})) {
            if (!isJobTimestamp(seconds)) continue;
            const line = document.createElement("p");
            line.textContent = `${ragStageLabel(stage)}: ${formatRagDuration(seconds)}`;
            elements.timingBody.appendChild(line);
        }
        updateRagJobClock(entry, Date.now() / 1000);
    }
    const labels = {succeeded: "succeeded", failed: "failed", interrupted: "interrupted",
        queued: "queued", running: "running", waiting_upload: "waiting to upload", uploading: "uploading",
        upload_failed: "upload failed", unconfirmed: "unconfirmed", not_submitted: "not submitted", unavailable: "unavailable"};
    setJobText(ragProgressSummary, Object.entries(counts).map(([key, count]) => `${count} ${labels[key] || key}`).join(" · "));
    setJobText(ragProgressNotice, [ragSubmissionNotice, ragStorageWarning].filter(Boolean).join(" "));
    ragClearFinishedButton.disabled = !Array.from(ragTrackedJobs.values()).some(entry =>
        !isTrackedJobActive(entry) && entry.transport !== "uploading" && entry.transport !== "waiting_upload");
    const ticking = Array.from(ragTrackedJobs.values()).some(entry =>
        isTrackedJobActive(entry) || entry.transport === "uploading");
    if (ticking && ragClockTimer === null) {
        ragClockTimer = setInterval(() => {
            const now = Date.now() / 1000;
            for (const entry of ragTrackedJobs.values()) updateRagJobClock(entry, now);
        }, 1000);
    } else if (!ticking && ragClockTimer !== null) {
        clearInterval(ragClockTimer);
        ragClockTimer = null;
    }
}

function scheduleRagJobPoll(delay = 3000) {
    if (ragPollTimer !== null || ragPollInFlight) return;
    if (!Array.from(ragTrackedJobs.values()).some(isTrackedJobActive)) return;
    ragPollTimer = setTimeout(() => {
        ragPollTimer = null;
        pollRagJobs();
    }, delay);
}

async function pollRagJobs() {
    if (ragPollInFlight) return;
    ragPollInFlight = true;
    try {
        for (const entry of Array.from(ragTrackedJobs.values()).filter(isTrackedJobActive)) {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);
            try {
                const response = await fetch(`/api/rag/jobs/${encodeURIComponent(entry.job_id)}`, {
                    method: "GET", cache: "no-store", signal: controller.signal,
                });
                if (response.status === 404) {
                    entry.trackingStopped = true;
                    entry.pollNotice = "The server no longer has this job record. Check the collection before resubmitting.";
                    continue;
                }
                const data = await response.json();
                if (!response.ok) throw new Error(ingestionErrorMessage(data, response.status));
                if (data?.job_id !== entry.job_id || !RAG_JOB_STATUSES.has(data.status)
                    || data.collection_name !== entry.collection_name) {
                    throw new Error("The server returned an unexpected job status.");
                }
                entry.job = data;
                entry.observed_at = Date.now() / 1000;
                entry.transport = null;
                entry.pollNotice = "";
            } catch {
                entry.pollNotice = "Status connection unavailable; retrying automatically. The backend job may still be running.";
            } finally {
                clearTimeout(timeout);
            }
        }
    } finally {
        ragPollInFlight = false;
        persistRagJobs();
        renderRagJobs();
        scheduleRagJobPoll();
    }
}

function restoreRagJobs() {
    try {
        const raw = localStorage.getItem(RAG_JOB_STORAGE_KEY);
        const saved = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(saved)) throw new Error("Invalid saved jobs");
        for (const entry of saved) {
            if (!entry || typeof entry.key !== "string" || typeof entry.original_name !== "string"
                || typeof entry.collection_name !== "string") continue;
            if (entry.job_id !== null && typeof entry.job_id !== "string") continue;
            if (!entry.job_id && entry.transport === "uploading") {
                entry.transport = "unconfirmed";
                entry.message = "The page closed during upload. No job ID was received; check the collection before resubmitting.";
            }
            if (!entry.job_id && entry.transport === "waiting_upload") {
                entry.transport = "not_submitted";
                entry.message = "The page closed before this file was submitted. Attach it again to upload it.";
            }
            entry.pollNotice = "";
            ragTrackedJobs.set(entry.key, entry);
        }
    } catch {
        ragStorageWarning = "Saved job tracking could not be restored. Current jobs may still be running on the server.";
    }
    renderRagJobs();
    scheduleRagJobPoll(0);
}

async function ingestRagDocuments() {
    if (ragIngestionRunning) return;
    const queue = Array.from(ragSelectedFiles.querySelectorAll(".rag-file-card"))
        .map(card => ({card, file: ragFilesByCard.get(card)}));
    const collectionName = ragCollection.value;
    ragSubmissionNotice = "";
    if (!collectionName || !queue.length || queue.some(item => !item.file)) {
        ragSubmissionNotice = !collectionName ? "Select a collection before uploading."
            : !queue.length ? "Attach at least one document before uploading."
            : "A selected file is unavailable. Remove it and attach it again.";
        renderRagJobs();
        return;
    }
    if (queue.some(({card}) => card.dataset.ingestionUnknown === "true")) {
        ragSubmissionNotice = "A previous upload is unconfirmed. Check the collection, then remove that file card before submitting more documents.";
        renderRagJobs();
        return;
    }
    const controls = [ragIngestButton, ragCollection, ragFileInput,
        ragNewCollectionButton, ragDeleteCollectionButton, ragCreateCollectionButton,
        ...ragSelectedFiles.querySelectorAll(".rag-file-remove")];
    const disabledBefore = controls.map(control => control.disabled);
    const draggableBefore = queue.map(({card}) => card.draggable);
    const buttonText = ragIngestButton.textContent;
    const batchKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const entries = queue.map(({file}, index) => ({
        key: `${batchKey}-${index}`, job_id: null, original_name: file.name,
        collection_name: collectionName, submitted_at: Date.now() / 1000,
        observed_at: null, transport: "waiting_upload", message: "", job: null,
        trackingStopped: false,
    }));
    entries.forEach(entry => ragTrackedJobs.set(entry.key, entry));
    ragIngestionRunning = true;
    controls.forEach(control => { control.disabled = true; });
    queue.forEach(({card}) => { card.draggable = false; });
    ragDropZone.setAttribute("aria-disabled", "true");
    ragIngestButton.textContent = "Uploading…";
    persistRagJobs();
    renderRagJobs();
    try {
        for (const [index, {card, file}] of queue.entries()) {
            const entry = entries[index];
            entry.transport = "uploading";
            entry.submitted_at = Date.now() / 1000;
            persistRagJobs();
            renderRagJobs();
            const form = new FormData();
            form.append("collection_name", collectionName);
            form.append("file", file, file.name);
            let accepted = false;
            let response;
            let data;
            try {
                response = await fetch("/api/rag/ingest", {method: "POST", body: form});
                try { data = await response.json(); } catch { data = null; }
                if (!response.ok && response.status < 500) {
                    entry.transport = "upload_failed";
                    entry.message = ingestionErrorMessage(data, response.status);
                } else if (response.status === 202 && typeof data?.job_id === "string" && data.job_id) {
                    entry.job_id = data.job_id;
                    entry.transport = null;
                    accepted = true;
                    // Remove accepted file cards to avoid accidental resubmission.
                    ragFilesByCard.delete(card);
                    card.remove();
                    scheduleRagJobPoll(0);
                } else {
                    throw new Error("No job receipt");
                }
            } catch {
                entry.transport = "unconfirmed";
                entry.message = "No job ID was received. The server may have queued this file; check the collection before retrying. Remaining uploads were stopped to preserve order.";
                card.dataset.ingestionUnknown = "true";
                for (let next = index + 1; next < entries.length; next += 1) {
                    entries[next].transport = "not_submitted";
                    entries[next].message = "Not uploaded because the previous submission was unconfirmed.";
                }
                break;
            } finally {
                persistRagJobs();
                renderRagJobs();
            }
            if (accepted) ragSubmissionNotice = "Uploads return promptly; processing continues in the background. You can leave this tab and return later.";
        }
    } finally {
        controls.forEach((control, index) => { control.disabled = disabledBefore[index]; });
        queue.forEach(({card}, index) => { card.draggable = draggableBefore[index]; });
        ragDropZone.setAttribute("aria-disabled", "false");
        ragIngestButton.textContent = buttonText;
        ragIngestionRunning = false;
        persistRagJobs();
        renderRagJobs();
        scheduleRagJobPoll(0);
    }
}

ragIngestButton.addEventListener("click", ingestRagDocuments);
ragClearFinishedButton.addEventListener("click", () => {
    for (const [key, entry] of ragTrackedJobs) {
        if (isTrackedJobActive(entry) || entry.transport === "uploading" || entry.transport === "waiting_upload") continue;
        ragJobElements.get(key)?.card.remove();
        ragJobElements.delete(key);
        ragTrackedJobs.delete(key);
    }
    ragSubmissionNotice = "";
    persistRagJobs();
    renderRagJobs();
});
restoreRagJobs();
