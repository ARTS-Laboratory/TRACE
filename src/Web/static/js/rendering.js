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