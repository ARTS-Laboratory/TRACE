import { renderVisual, unmountVisuals } from "./visuals.js";

// Keep Markdown parsing, sanitization, math protection and code controls shared.
export function renderMarkdown(state) {
    const protectedMath = protectMath(
        state.markdown
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

    state.assistant.innerHTML =
        DOMPurify.sanitize(html);

    enhanceCodeBlocks(state.assistant);
}

export function createResponseBlockState(container, {deferVisuals = false} = {}) {
    return {
        container, blocks: new Map(), dirty: new Set(), frame: null,
        disposed: false, deferVisuals, pendingVisuals: new Set()
    };
}

function ensureResponseBlock(state, block) {
    const key = String(block.id);
    let entry = state.blocks.get(key);
    if (entry) {
        if (entry.type !== block.type) {
            throw new Error("A response block cannot change type.");
        }
        return entry;
    }
    const element = document.createElement("div");
    element.classList.add("response-block");
    element.dataset.blockId = key;
    element.dataset.blockType = block.type;
    if (block.type === "visual" && state.deferVisuals) {
        element.hidden = true;
        element.style.display = "none";
    }
    entry = {id: block.id, type: block.type, content: "", element};
    state.blocks.set(key, entry);
    // IDs are assigned by the backend in creation order. Keep late arrivals
    // in the same order as database retrieval, without rebuilding other blocks.
    const next = [...state.container.children].find(child => {
        const id = child.dataset.blockId;
        return /^\d+$/.test(key) && /^\d+$/.test(id || "")
            && BigInt(id) > BigInt(key);
    });
    state.container.insertBefore(element, next || null);
    return entry;
}

function scheduleResponseBlocks(state) {
    if (state.disposed) return;
    if (state.frame !== null) return;
    state.frame = requestAnimationFrame(() => {
        state.frame = null;
        flushResponseBlocks(state);
    });
}

// A snapshot replaces content; a delta appends content. Never apply both
// interpretations to the same event.
export function setResponseBlock(state, block) {
    if (state.disposed) return;
    const entry = ensureResponseBlock(state, block);
    entry.content = typeof block.content === "string" ? block.content : "";
    entry.visualId = block.visual_id ?? null;
    state.dirty.add(entry);
    scheduleResponseBlocks(state);
}

export function appendResponseText(state, blockId, delta) {
    if (state.disposed) return;
    const entry = ensureResponseBlock(state, {id: blockId ?? "legacy-text", type: "text"});
    entry.content += delta;
    state.dirty.add(entry);
    scheduleResponseBlocks(state);
}

export function flushResponseBlocks(state) {
    if (!state || state.disposed) return;
    if (state.frame !== null) {
        cancelAnimationFrame(state.frame);
        state.frame = null;
    }
    for (const entry of state.dirty) {
        if (entry.type === "text") {
            renderMarkdown({markdown: entry.content, assistant: entry.element});
        } else if (entry.type === "visual") {
            if (state.deferVisuals) {
                // Reserve its ordered slot without fetching or mounting React.
                entry.element.hidden = true;
                entry.element.style.display = "none";
                state.pendingVisuals.add(entry);
                continue;
            }
            entry.element.hidden = false;
            entry.element.style.removeProperty("display");
            state.pendingVisuals.delete(entry);
            renderVisual(entry.element, entry.visualId);
        } else {
            entry.element.classList.add("response-block-placeholder");
            entry.element.style.cssText =
                "border:1px solid currentColor;border-radius:8px;padding:12px;margin:12px 0;opacity:.75";
            entry.element.textContent = "Unsupported content block: " + entry.type;
        }
    }
    state.dirty.clear();
}

// Called only when the live response finishes, stops, or fails.
export function releaseResponseVisuals(state) {
    if (!state || state.disposed) return;
    state.deferVisuals = false;
    for (const entry of state.pendingVisuals) state.dirty.add(entry);
    state.pendingVisuals.clear();
    // Also handles a visual still waiting in the scheduled dirty batch.
    flushResponseBlocks(state);
}

// Stop deferred block work before removing a response's DOM.
export function disposeResponseBlocks(state) {
    if (!state || state.disposed) return;
    state.disposed = true;
    if (state.frame !== null) cancelAnimationFrame(state.frame);
    state.frame = null;
    state.dirty.clear();
    state.pendingVisuals.clear();
    unmountVisuals(state.container);
    state.blocks.clear();
}

export function renderStoredResponse(container, message) {
    const state = createResponseBlockState(container);
    if (Array.isArray(message.blocks) && message.blocks.length > 0) {
        for (const block of message.blocks) setResponseBlock(state, block);
    } else {
        setResponseBlock(state, {
            id: "legacy-text", type: "text", content: message.content || ""
        });
    }
    flushResponseBlocks(state);
    return state;
}

export async function renderMath(element) {
    if (!window.MathJax) {
        return;
    }

    MathJax.typesetClear([element]);

    await MathJax.typesetPromise([element]);
}

export function protectMath(text) {
    const mathBlocks = [];

    const protectedText = text.replace(
        /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g,
        (match) => {
            const index = mathBlocks.length;

            mathBlocks.push(match);

            return `@@MATH_${index}@@`;
        }
    );

    return {
        text: protectedText,
        mathBlocks
    };
}

export function enhanceCodeBlocks(container) {
    const blocks = container.querySelectorAll("pre");

    blocks.forEach((pre) => {
        const code = pre.querySelector("code");

        if (!code) {
            return;
        }

        hljs.highlightElement(code);

        const languageClass =
            Array.from(code.classList).find(
                (className) =>
                    className.startsWith("language-")
            );

        const language = languageClass
            ? languageClass.replace("language-", "")
            : "text";


        const wrapper =
            document.createElement("div");

        wrapper.classList.add("code-block");


        const header =
            document.createElement("div");

        header.classList.add("code-header");


        const languageLabel =
            document.createElement("span");

        languageLabel.textContent = language;


        const copyButton =
            document.createElement("button");

        copyButton.classList.add("copy-code");

        copyButton.textContent = "Copy";


        copyButton.addEventListener(
            "click",
            async () => {
                await navigator.clipboard.writeText(
                    code.textContent
                );

                copyButton.textContent = "Copied";

                setTimeout(() => {
                    copyButton.textContent = "Copy";
                }, 1500);
            }
        );


        header.appendChild(languageLabel);
        header.appendChild(copyButton);

        pre.parentNode.insertBefore(
            wrapper,
            pre
        );

        wrapper.appendChild(header);
        wrapper.appendChild(pre);
    });
}

// Keep the outer response disclosure stable when live statistics arrive.
export function ensureResponseDetails(state, {pending = false} = {}) {
    if (state.responseDetails) return state.responseDetails;
    const details = document.createElement("details");
    details.classList.add("stats-details");
    const summary = document.createElement("summary");
    summary.textContent = "Model response";
    const status = document.createElement("p");
    status.classList.add("response-stats-status");
    status.textContent = pending
        ? "Statistics will appear when the response finishes."
        : "Response statistics were not recorded for this message.";
    const content = document.createElement("div");
    content.classList.add("stats-content");
    content.hidden = true;
    const contextHost = document.createElement("div");
    contextHost.classList.add("response-skill-context");
    details.append(summary, status, content, contextHost);
    state.stats.appendChild(details);
    state.responseDetails = {details, summary, status, content, contextHost, hasStats: false};
    return state.responseDetails;
}

export function finishResponseDetails(state) {
    const view = state.responseDetails;
    if (view && !view.hasStats) {
        view.status.textContent = "No completed response statistics were recorded for this message.";
    }
}

export function renderStats(state, stats) {
    const view = ensureResponseDetails(state);
    if (!stats || typeof stats !== "object" || !["model", "tokens", "speed", "timing"].every(
        key => stats[key] && typeof stats[key] === "object" && !Array.isArray(stats[key])
    )) {
        if (!view.hasStats) view.status.textContent = "The recorded response statistics are incomplete.";
        return false;
    }
    const number = (value, digits = 0) => typeof value === "number" && Number.isFinite(value) && value >= 0
        ? value.toLocaleString(undefined, {minimumFractionDigits: digits, maximumFractionDigits: digits}) : "—";
    const seconds = value => `${number(value, 2)} s`;
    view.summary.textContent = "Model response · "
        + `${number(stats.speed.generation, 1)} tok/s · `
        + `${number(stats.tokens.generated)} tokens · `
        + `${number(stats.timing.overall, 1)}s`;
    view.content.replaceChildren();
    const contextLength = stats.model.context_length > 0 ? number(stats.model.context_length) : "—";
    const usage = typeof stats.model.context_usage === "number" && Number.isFinite(stats.model.context_usage)
        && stats.model.context_usage >= 0 ? ` (${number(stats.model.context_usage, 1)}%)` : "";
    const sections = [
        ["Model", [
            ["Context", `${number(stats.model.context_used)} / ${contextLength}${usage}`],
            ["Prompt tokens", number(stats.tokens.prompt)],
            ["Generated tokens", number(stats.tokens.generated)],
            ["Prompt speed", `${number(stats.speed.prompt, 2)} tok/s`],
            ["Generation speed", `${number(stats.speed.generation, 2)} tok/s`],
            ["Load time", seconds(stats.timing.load)],
        ]],
        ["Timing", [
            ["Thinking", seconds(stats.timing.thinking)],
            ["Generation", seconds(stats.timing.generation)],
            ["Model total", seconds(stats.timing.model_total)],
            ["Overall", seconds(stats.timing.overall)],
        ]],
    ];
    for (const [title, fields] of sections) {
        const section = document.createElement("div");
        section.classList.add("stats-section");
        const heading = document.createElement("strong");
        heading.textContent = title;
        section.appendChild(heading);
        for (const [label, value] of fields) {
            const key = document.createElement("span");
            key.textContent = label;
            const text = document.createElement("span");
            text.textContent = value;
            if (label === "Context") text.classList.add("context-value");
            section.append(key, text);
        }
        view.content.appendChild(section);
    }
    view.hasStats = true;
    view.status.hidden = true;
    view.content.hidden = false;
    return true;
}
