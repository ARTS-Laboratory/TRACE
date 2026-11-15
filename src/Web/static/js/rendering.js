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

export function renderStats(state, stats) {
    state.stats.innerHTML = "";

    const details = document.createElement("details");
    details.classList.add("stats-details");

    const summary = document.createElement("summary");

    summary.textContent =
        `${stats.speed.generation.toFixed(1)} tok/s` +
        ` • ${stats.tokens.generated.toLocaleString()} tokens` +
        ` • ${stats.timing.overall.toFixed(1)}s`;

    const content = document.createElement("div");
    content.classList.add("stats-content");

    content.innerHTML = `
        <div class="stats-section">
            <strong>Model</strong>
            <span>Context</span>
            <span class="context-value">
                ${stats.model.context_used.toLocaleString()}
                /
                ${stats.model.context_length.toLocaleString()}
                (${stats.model.context_usage.toFixed(1)}%)
            </span>

            <span>Prompt tokens</span>
            <span>${stats.tokens.prompt.toLocaleString()}</span>

            <span>Generated tokens</span>
            <span>${stats.tokens.generated.toLocaleString()}</span>

            <span>Prompt speed</span>
            <span>${stats.speed.prompt.toFixed(2)} tok/s</span>

            <span>Generation speed</span>
            <span>${stats.speed.generation.toFixed(2)} tok/s</span>

            <span>Load time</span>
            <span>${stats.timing.load.toFixed(2)} s</span>
        </div>

        <div class="stats-section">
            <strong>Timing</strong>

            <span>Thinking</span>
            <span>${stats.timing.thinking.toFixed(2)} s</span>

            <span>Generation</span>
            <span>${stats.timing.generation.toFixed(2)} s</span>

            <span>Model total</span>
            <span>${stats.timing.model_total.toFixed(2)} s</span>

            <span>Overall</span>
            <span>${stats.timing.overall.toFixed(2)} s</span>
        </div>
    `;

    details.appendChild(summary);
    details.appendChild(content);

    state.stats.appendChild(details);
}
