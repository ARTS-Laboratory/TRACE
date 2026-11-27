export function skillContextDisplay(payload) {
    let skillContext = "Skill context was not recorded for this older execution.";
    if (Object.hasOwn(payload, "skill_context")) {
        const recorded = payload.skill_context;
        if (Array.isArray(recorded)) {
            skillContext = recorded.length === 0
                ? "No loaded skill text was recorded in this model request."
                : recorded.map(item => {
                    if (!item || typeof item !== "object" || Array.isArray(item)) {
                        return {note: "An invalid skill-context entry was recorded."};
                    }
                    return {
                        skill_package_id: item.skill_package_id,
                        skill_name: item.skill_name,
                        source: item.source,
                        content_hash: item.content_hash,
                        relative_path: item.relative_path,
                        tool_call_id: item.tool_call_id
                    };
                });
        } else {
            skillContext = "The recorded skill context is invalid.";
        }
    }
    return skillContext;
}

export function renderToolDetails(card, event) {
    card.body.replaceChildren();
    const skillContext = skillContextDisplay(card.payload);
    const fields = [
        ["Status", card.status.title],
        ["Tool", card.toolName],
        ["Conversation ID", event.conversation_id],
        ["Assistant message ID", event.assistant_message_id],
        ["Tool call ID", event.tool_call_id],
        ["Event IDs", card.eventIds.length ? card.eventIds : undefined],
        ["Started (UTC)", card.startedAt],
        ["Ended (UTC)", card.finishedAt],
        ["Duration (seconds)", card.payload.elapsed],
        ["Skill context", skillContext],
        ["Inputs", card.payload.arguments],
        ["Output", Object.hasOwn(card.payload, "result")
            ? card.payload.result : undefined],
        ["Error", card.payload.error]
    ];
    if (card.state === "succeeded" && !Object.hasOwn(card.payload, "result")) {
        fields.push(["Output", "Output was not recorded for this older execution."]);
    }
    if (card.state === "cancelled") {
        fields.push(["Note", "Local execution was cancelled; an external tool may have continued."]);
    }
    for (const [label, value] of fields) {
        if (value === undefined) continue;
        const heading = document.createElement("strong");
        heading.textContent = label;
        heading.style.cssText = "display:block;color:#fff;font-weight:700;margin:1rem 0 0.4rem;line-height:1.4";
        if (label === "Skill context") {
            card.body.appendChild(heading);
            const note = document.createElement("p");
            note.textContent = "Skill files available when the model selected this tool call. This records available context, not proof that the model followed it.";
            note.style.cssText = "margin:0 0 0.6rem;color:#b8b8b8;font-size:0.85rem;line-height:1.5";
            card.body.appendChild(note);
        }
        const text = document.createElement("pre");
        text.style.cssText = "display:block;box-sizing:border-box;width:100%;min-width:0;margin:0;padding:0.75rem 1rem;background:#181818;border:1px solid #444;border-radius:8px;color:#e6e6e6;white-space:pre-wrap;overflow-wrap:anywhere;max-height:24rem;overflow:auto;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:0.9rem;line-height:1.5";
        const code = document.createElement("code");
        code.style.cssText = "display:block;padding:0;margin:0;border:0;background:transparent;color:inherit;font:inherit;white-space:inherit";
        // Tool outputs are untrusted data, never HTML.
        code.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
        text.appendChild(code);
        if (label !== "Skill context") card.body.appendChild(heading);
        card.body.appendChild(text);
    }
}


export function renderToolMetadata(container, entry, payloadState = null) {
    container.replaceChildren();

    const events = entry.events || [];

    const start = events.find(
        event => event.event_type === "tool_started"
    );

    const terminal = events.find(
        event => [
            "tool_finished",
            "tool_failed",
            "tool_cancelled",
            "tool_interrupted"
        ].includes(event.event_type)
    );

    const identity = start || terminal || events[0];

    if (!identity) return;

    const statusLabels = {
        started: "Started",
        tool_finished: "Completed",
        tool_failed: "Failed",
        tool_cancelled: "Cancelled",
        tool_interrupted: "Interrupted"
    };

    
    const stats = document.createElement("div");
    stats.className = "trace-stats-grid";

    const duration = terminal?.data?.elapsed;

    const durationText = Number.isFinite(duration)
        ? `${duration.toFixed(2)}s`
        : "—";

    const eventIds = events
        .map(event => event.id)
        .filter(id => id != null);

    stats.append(
        createTraceStat(
            "Status",
            statusLabels[entry.status] || entry.status
        ),
        createTraceStat("Duration", durationText),
        createTraceStat(
            "Started (UTC)",
            start?.created_at || "—"
        ),
        createTraceStat(
            "Event IDs",
            eventIds.join(", ") || "—"
        )
    );

    container.appendChild(stats);

    const divider = document.createElement("div");
    divider.className = "trace-details-divider";
    container.appendChild(divider);


    const recordedArguments = start?.data?.arguments;

    const inputText = recordedArguments === undefined
        ? "No recorded inputs available."
        : typeof recordedArguments === "string"
            ? recordedArguments
            : JSON.stringify(recordedArguments, null, 2);

    const hasResult = terminal &&
        Object.hasOwn(terminal.data || {}, "result");

    const hasError = terminal &&
        Object.hasOwn(terminal.data || {}, "error");

    let outputLabel = "Output";
    let outputValue;

    if (hasError) {
        outputLabel = "Error";
        outputValue = terminal.data.error;
    } else if (hasResult) {
        outputValue = terminal.data.result;
    } else if (!terminal) {
        outputValue = "Tool execution has not finished.";
    } else if (terminal.event_type === "tool_cancelled") {
        outputValue = "Tool execution was cancelled.";
    } else if (terminal.event_type === "tool_interrupted") {
        outputValue = "Tool execution was interrupted.";
    } else {
        outputValue = "No recorded output available.";
    }

    const outputText = typeof outputValue === "string"
        ? outputValue
        : JSON.stringify(outputValue, null, 2);


    const sampleNotice = document.createElement("p");
    sampleNotice.className = "trace-sample-notice";
    sampleNotice.textContent =
        "Sample payloads — live disclosure not yet enabled.";

    container.append(
        createTracePayloadField(
            "Inputs",
            inputText,
            payloadState?.inputs
        ),
        createTracePayloadField(
            outputLabel,
            outputText,
            payloadState?.output
        )
    );
}


export function createTracePayloadField(
    label,
    permittedText,
    savedState = null
) {
    const field = document.createElement("section");
    field.className = "trace-payload-field";

    const heading = document.createElement("div");
    heading.className = "trace-payload-heading";

    const title = document.createElement("strong");
    title.textContent = label;

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "trace-payload-copy";
    copy.setAttribute("aria-label", `Copy ${label}`);
    copy.title = `Copy ${label}`;

    // Lucide-compatible icon markup.
    copy.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="15" height="15" viewBox="0 0 24 24"
             fill="none" stroke="currentColor"
             stroke-width="1.8" stroke-linecap="round"
             stroke-linejoin="round" aria-hidden="true">
            <rect x="8" y="8" width="13" height="13" rx="2"/>
            <path d="M16 8V5a2 2 0 0 0-2-2H5
                     a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>
        </svg>
    `;

    let copyResetTimer = null;

    const copyIcon = copy.innerHTML;

    const checkIcon = `
        <svg xmlns="http://www.w3.org/2000/svg"
            width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5"/>
        </svg>
    `;

    copy.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(permittedText);

            if (copyResetTimer !== null) {
                clearTimeout(copyResetTimer);
            }

            copy.innerHTML = checkIcon;
            copy.classList.add("trace-copy-success");
            copy.title = "Copied!";
            copy.setAttribute("aria-label", `${label} copied`);

            copyResetTimer = setTimeout(() => {
                copy.innerHTML = copyIcon;
                copy.classList.remove("trace-copy-success");
                copy.title = `Copy ${label}`;
                copy.setAttribute("aria-label", `Copy ${label}`);
                copyResetTimer = null;
            }, 1500);

        } catch (error) {
            console.error("TRACE copy failed:", error);
        }
    });

    heading.append(title, copy);

    const box = document.createElement("pre");
    box.className = "trace-payload-box";

    const code = document.createElement("code");
    box.appendChild(code);

    const previewLength = 1000;
    const abbreviated = permittedText.length > previewLength;

    let expanded = savedState?.expanded ?? false;

    const showMore = document.createElement("button");
    showMore.type = "button";
    showMore.className = "trace-payload-more";

    function updateDisplay() {
        code.textContent = expanded || !abbreviated
            ? permittedText
            : permittedText.slice(0, previewLength) + "\n…";

        showMore.textContent = expanded ? "Show less" : "Show more";
        showMore.hidden = !abbreviated;

        box.classList.toggle("expanded", expanded);
    }

    showMore.addEventListener("click", () => {
        expanded = !expanded;

        if (savedState) {
            savedState.expanded = expanded;

            if (!expanded) {
                savedState.scrollTop = 0;
            }
        }

        updateDisplay();
    });

    updateDisplay();
    if (savedState) {
        box.scrollTop = savedState.scrollTop ?? 0;

        box.addEventListener("scroll", () => {
            savedState.scrollTop = box.scrollTop;
        }, { passive: true });
    }

    field.append(heading, box, showMore);

    return field;
}

function createTraceStat(label, value) {
    const field = document.createElement("div");
    field.className = "trace-stat";

    const heading = document.createElement("span");
    heading.className = "trace-stat-label";
    heading.textContent = label;

    const content = document.createElement("span");
    content.className = "trace-stat-value";
    content.textContent = String(value ?? "—");

    field.append(heading, content);

    return field;
}
