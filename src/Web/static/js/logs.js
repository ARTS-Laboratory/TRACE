const byId = (id) => document.getElementById(id);
const view = byId("logs-view");
const services = [...document.querySelectorAll("#logs-services input")];
const selectedServices = () => services.filter((input) => input.checked).map((input) => input.value);
const tail = byId("logs-tail");
const status = byId("logs-status");
const output = byId("logs-output");
const pause = byId("logs-pause");
const scroll = byId("logs-scroll");
const hideHealth = byId("logs-hide-health");
let active = false;
let paused = false;
let timer = null;
let controller = null;
let generation = 0;
const snapshots = new Map();
const clearedSnapshots = new Map();

function cancel() {
    generation += 1;
    clearTimeout(timer);
    timer = null;
    controller?.abort();
    controller = null;
}

function visibleText() {
    const rows = [];
    for (const name of selectedServices()) {
        let text = snapshots.get(name)?.text || "";
        const cleared = clearedSnapshots.get(name);
        if (cleared) {
            const oldLines = cleared.split("\n");
            const newLines = text.split("\n");
            for (let count = Math.min(oldLines.length, newLines.length); count > 0; count--) {
                if (oldLines.slice(-count).join("\n") === newLines.slice(0, count).join("\n")) {
                    text = newLines.slice(count).join("\n");
                    break;
                }
            }
        }
        let lastTime = 0;
        let lastFraction = "";
        for (const line of text.split("\n")) {
            if (!line) continue;
            if (hideHealth.checked &&
                /["'](?:GET|HEAD) \/health(?:\?[^\s]*)? HTTP\/[\d.]+["']\s+200\b/.test(line)) continue;
            const match = line.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.(\d+))?Z\s/);
            if (match) {
                lastTime = Date.parse(match[1] + "Z");
                lastFraction = (match[2] || "").padEnd(9, "0");
            }
            rows.push({time: lastTime, fraction: lastFraction, text: `[${name}] ${line}`});
        }
    }
    rows.sort((a, b) => a.time - b.time || a.fraction.localeCompare(b.fraction));
    return rows.map((row) => row.text).join("\n");
}

function render() {
    const position = output.scrollTop;
    output.textContent = visibleText();
    output.scrollTop = scroll.checked ? output.scrollHeight : position;
}

async function refresh() {
    cancel();
    if (!active || document.hidden) return;
    const count = Number(tail.value);
    if (!Number.isInteger(count) || count < 1 || count > 1000) {
        status.textContent = "Choose between 1 and 1000 lines.";
        return;
    }
    const names = selectedServices();
    if (!names.length) {
        render();
        status.textContent = "Select one or more services.";
        return;
    }
    const token = generation;
    const request = new AbortController();
    controller = request;
    const deadline = setTimeout(() => request.abort(), 30000);
    status.textContent = "Fetching selected services…";
    try {
        const results = await Promise.allSettled(names.map(async (name) => {
            const response = await fetch(
                `/api/logs/${encodeURIComponent(name)}?tail=${count}`,
                {signal: request.signal, cache: "no-store"}
            );
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || data.error || `HTTP ${response.status}`);
            if (typeof data.text !== "string" || typeof data.state !== "string") {
                throw new Error("Unexpected log response");
            }
            return data;
        }));
        if (token !== generation) return;
        const summaries = [];
        results.forEach((result, index) => {
            const name = names[index];
            if (result.status === "fulfilled") {
                snapshots.set(name, result.value);
                summaries.push(`${name}: ${result.value.state}${result.value.text ? "" : " (no logs)"}`);
            } else {
                summaries.push(`${name}: ${request.signal.aborted ? "timed out" : result.reason.message} (last snapshot retained)`);
            }
        });
        render();
        status.textContent = `${summaries.join(" · ")} · Checked ${new Date().toLocaleTimeString()}`;
    } finally {
        clearTimeout(deadline);
        if (token === generation) {
            controller = null;
            if (active && !paused && !document.hidden) timer = setTimeout(refresh, 3000);
        }
    }
}

export function showLogsView() {
    active = true;
    view.hidden = false;
    refresh();
}

export function hideLogsView() {
    active = false;
    view.hidden = true;
    cancel();
}

function selectionChanged() {
    cancel();
    for (const name of snapshots.keys()) {
        if (!selectedServices().includes(name)) {
            snapshots.delete(name);
            clearedSnapshots.delete(name);
        }
    }
    render();
    if (active) refresh();
}
services.forEach((input) => input.addEventListener("change", selectionChanged));
tail.addEventListener("change", selectionChanged);
hideHealth.addEventListener("change", render);
scroll.addEventListener("change", render);
byId("logs-refresh").addEventListener("click", refresh);
pause.addEventListener("click", () => {
    paused = !paused;
    pause.textContent = paused ? "Resume" : "Pause";
    pause.setAttribute("aria-pressed", String(paused));
    cancel();
    if (paused) status.textContent = "Auto-refresh paused. Refresh still works.";
    else refresh();
});
byId("logs-clear").addEventListener("click", () => {
    for (const name of selectedServices()) {
        clearedSnapshots.set(name, (snapshots.get(name)?.text || "").trimEnd());
    }
    render();
    status.textContent = "View cleared. Docker logs are unchanged.";
});
byId("logs-copy").addEventListener("click", async () => {
    const text = output.textContent;
    if (!text) {
        status.textContent = "No visible logs to copy.";
        return;
    }
    try {
        if (navigator.clipboard?.writeText && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const field = document.createElement("textarea");
            field.value = text;
            field.style.position = "fixed";
            field.style.opacity = "0";
            document.body.appendChild(field);
            try {
                field.select();
                if (!document.execCommand("copy")) throw new Error("Clipboard unavailable");
            } finally { field.remove(); }
        }
        status.textContent = "Visible logs copied.";
    } catch {
        status.textContent = "Copy unavailable. Select the log text and copy manually.";
    }
});
document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancel();
    else if (active && !paused) refresh();
});
window.addEventListener("pagehide", cancel);
