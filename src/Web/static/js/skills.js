// Browser decisions are the only actions here that initiate installation.
import { state } from './state.js';

const el = (id) => document.getElementById(id);
const card = el('skill-install-card');
const dialog = el('skill-review-dialog');
const skillsDialog = el('conversation-skills-dialog');
let dialogMode = 'request';
let skillsOwner = null;
let skillsEpoch = 0;
let activityEpoch = 0;
let skillsController = null;
let previewController = null;
let previewEpoch = 0;
let skillsReturnFocus = null;
let previewSelection = null;
const statuses = new Set(['pending', 'installing', 'installed', 'denied', 'failed']);
const reviews = new Map();
const reviewErrors = new Map();
const decisions = new Map();
const dismissed = new Set();
const dismissalPrefix = 'glorpcat:skill-install-dismissed:v1:';
let conversation = null;
let generation = 0;
let rows = [];
let selectedId = null;
let listController = null;
let reviewController = null;
let reviewingKey = null;
let listError = '';
let decisionError = '';
let timer = null;
let returnFocus = null;

const keyOf = (row) => JSON.stringify([
    row.conversation_id, row.id, row.repository_url, row.revision, row.skill_file_path,
]);
const selected = () => rows.find((row) => row.id === selectedId);
const base = (owner) => `/api/conversations/${owner}/skill-install-requests`;
function isDismissed(row) {
    // A saved dismissal must never conceal a pending or active installation.
    if (row.status === 'pending' || row.status === 'installing') return false;
    const key = keyOf(row);
    try {
        return window.localStorage.getItem(dismissalPrefix + key) === '1';
    } catch {
        return dismissed.has(key);
    }
}
function rememberDismissal(row) {
    const key = keyOf(row);
    dismissed.add(key);
    try {
        window.localStorage.setItem(dismissalPrefix + key, '1');
    } catch {
        // Still dismiss for this page when browser storage is unavailable.
    }
}
const visibleRows = () => rows.filter((row) => !isDismissed(row));
function text(id, value) { el(id).textContent = value; }
function show(id, visible) { el(id).hidden = !visible; }

async function readResponse(response) {
    let data;
    try { data = await response.json(); }
    catch { throw new Error(`Unreadable server response (${response.status}).`); }
    if (!response.ok) throw new Error(typeof data?.detail === 'string'
        ? data.detail : `Request failed (${response.status}).`);
    return data;
}

function clearReviewView() {
    for (const name of ['description', 'source', 'revision', 'path', 'instructions']) {
        text(`skill-review-${name}`, '');
    }
}

function render() {
    const available = visibleRows();
    if (!available.some((row) => row.id === selectedId)) {
        selectedId = (available.find((row) => row.status === 'pending' || row.status === 'installing') || available.at(-1))?.id ?? null;
    }
    const row = selected();
    card.hidden = conversation === null || (!row && !listError);
    document.body.classList.toggle('skill-popup-visible', !card.hidden);
    if (card.hidden) {
        if (dialog.open && dialogMode === 'request') dialog.close();
        return;
    }
    const key = row ? keyOf(row) : null;
    const review = reviews.get(key);
    const error = decisionError || listError || reviewErrors.get(key) || '';
    const denying = decisions.get(key) === 'deny';
    const busy = decisions.has(key) || row?.status === 'installing';
    const pending = row?.status === 'pending' && !busy;
    const terminal = row && !pending && !busy;
    const position = available.findIndex((item) => item.id === selectedId);
    const fallback = row?.skill_file_path.split('/').slice(-2, -1)[0] || 'Skill';
    text('skill-install-count', row && available.length > 1
        ? `${position + 1} of ${available.length}` : '');
    text('skill-install-name', review?.metadata.name || fallback);
    text('skill-install-description', review?.metadata.description || (
        row ? 'Review this skill before approving its download.' : 'Could not load skill requests.'
    ));
    text('skill-install-source', row
        ? `${row.repository_url.replace('https://github.com/', '')} · ${row.revision.slice(0, 8)}` : '');
    const messages = {
        pending: review ? 'Awaiting your decision. No package has been downloaded.' : 'Reading candidate details…',
        installing: 'Downloading the approved package…',
        installed: 'Installed and approved. Activation is a separate step.',
        denied: 'Request denied. No download was started by this decision.',
        failed: 'Installation failed. Ask for a new request to retry.',
    };
    const status = error || (denying ? 'Saving your denial…' : busy ? messages.installing : messages[row?.status]) || '';
    text('skill-install-status', status);
    el('skill-install-status').dataset.error = String(Boolean(error));
    for (const suffix of ['prev', 'next']) {
        show(`skill-install-${suffix}`, available.length > 1);
        el(`skill-install-${suffix}`).disabled = available.length < 2;
    }
    show('skill-install-read', Boolean(row));
    show('skill-install-deny', Boolean(pending || busy));
    show('skill-install-approve', Boolean(pending || busy));
    show('skill-install-dismiss', Boolean(terminal));
    show('skill-install-retry', Boolean(error));
    el('skill-install-deny').disabled = !pending;
    el('skill-install-approve').disabled = !pending || !review || Boolean(error);
    text('skill-install-approve', denying ? 'Awaiting decision…' : busy ? 'Downloading…' : 'Approve & download');
    if (dialog.open && dialogMode === 'request') {
        clearReviewView();
        configureRequestPreview();
        text('skill-review-title', review?.metadata.name || fallback);
        text('skill-review-status', error || (review ? 'Candidate instructions for review.' : 'Reading candidate instructions…'));
        el('skill-review-status').dataset.error = String(Boolean(error));
        text('skill-review-source', row?.repository_url || '');
        text('skill-review-revision', row?.revision || '');
        text('skill-review-path', row?.skill_file_path || '');
        if (review) {
            text('skill-review-description', review.metadata.description);
            // Never render candidate instructions or metadata as HTML.
            text('skill-review-instructions', review.instructions);
        }
        show('skill-review-retry', Boolean(error));
        show('skill-review-deny', Boolean(pending || busy));
        show('skill-review-approve', Boolean(pending || busy));
        el('skill-review-deny').disabled = !pending;
        el('skill-review-approve').disabled = !pending || !review || Boolean(error);
        text('skill-review-approve', denying ? 'Awaiting decision…' : busy ? 'Downloading…' : 'Approve & download');
    }
    updateClearance();
}

function updateClearance() {
    const composer = el('input-container');
    const clearance = card.hidden ? 140 : card.offsetHeight + composer.offsetHeight + 70;
    document.documentElement.style.setProperty('--skill-popup-clearance', `${clearance}px`);
}
if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(updateClearance);
    observer.observe(card);
    observer.observe(el('input-container'));
}

async function ensureReview() {
    const row = selected();
    if (!row) return;
    const key = keyOf(row);
    if (reviews.has(key) || reviewingKey === key || reviewErrors.has(key)) return;
    reviewController?.abort();
    const controller = new AbortController();
    reviewController = controller;
    reviewingKey = key;
    const epoch = generation;
    try {
        const result = await readResponse(await fetch(`${base(conversation)}/${row.id}/review`, {
            signal: controller.signal, cache: 'no-store', headers: { Accept: 'application/json' },
        }));
        if (generation !== epoch || keyOf(selected() || {}) !== key) return;
        if (!result?.request || keyOf(result.request) !== key
            || !['name', 'description'].every((field) => (
                typeof result.metadata?.[field] === 'string' && result.metadata[field].trim()
            )) || typeof result.instructions !== 'string') {
            throw new Error('Incomplete or mismatched skill review. Retry before approving.');
        }
        reviews.set(key, result);
        reviewErrors.delete(key);
    } catch (error) {
        if (generation === epoch && !controller.signal.aborted) {
            reviewErrors.set(key, error.message || 'Could not review this skill.');
        }
    } finally {
        if (reviewController === controller) {
            reviewController = null;
            reviewingKey = null;
        }
        if (generation === epoch) render();
    }
}

function scheduleRefresh() {
    clearTimeout(timer);
    if (conversation !== null) timer = setTimeout(() => {
        void refreshSkillRequests(conversation);
    }, rows.some((row) => row.status === 'installing') ? 3000 : 10000);
}

export async function refreshSkillRequests(owner = conversation) {
    if (owner === null || Number(owner) !== conversation) return;
    if (listController) return;
    const epoch = generation;
    const controller = new AbortController();
    listController = controller;
    try {
        const result = await readResponse(await fetch(base(conversation), {
            signal: controller.signal, cache: 'no-store', headers: { Accept: 'application/json' },
        }));
        if (generation !== epoch) return;
        if (!Array.isArray(result) || !result.every((row) => (
            Number.isSafeInteger(row.id) && row.conversation_id === conversation
            && statuses.has(row.status)
            && ['repository_url', 'revision', 'skill_file_path'].every((field) => typeof row[field] === 'string')
        ))) throw new Error('Invalid skill request list returned by the server.');
        const changed = JSON.stringify(rows) !== JSON.stringify(result) || Boolean(listError);
        rows = result;
        listError = '';
        if (changed) render();
        void ensureReview();
    } catch (error) {
        if (generation === epoch && !controller.signal.aborted) {
            listError = error.message || 'Could not load skill requests.';
            render();
        }
    } finally {
        if (listController === controller) listController = null;
        if (generation === epoch) scheduleRefresh();
    }
}

export function setSkillConversation(owner) {
    generation += 1;
    conversation = owner == null ? null : Number(owner);
    clearTimeout(timer);
    listController?.abort();
    reviewController?.abort();
    listController = null;
    reviewController = null;
    reviewingKey = null;
    rows = [];
    selectedId = null;
    listError = '';
    decisionError = '';
    reviews.clear();
    reviewErrors.clear();
    if (dialog.open) dialog.close();
    if (skillsDialog.open) skillsDialog.close();
    render();
    if (conversation !== null) void refreshSkillRequests(conversation);
}

async function decide(action) {
    const row = selected();
    if (!row || row.status !== 'pending') return;
    const key = keyOf(row);
    if (decisions.has(key)) return;
    if (action === 'approve' && (!reviews.has(key) || listError || reviewErrors.has(key))) return;
    const owner = conversation;
    const epoch = generation;
    decisions.set(key, action);
    decisionError = '';
    render();
    try {
        // Do not abort a POST when switching chats: the server may already be installing.
        const result = await readResponse(await fetch(`${base(owner)}/${row.id}/${action}`, {
            method: 'POST', headers: { Accept: 'application/json' },
        }));
        if (generation !== epoch) return;
        if (action === 'deny') {
            if (!result || keyOf(result) !== key || result.status !== 'denied') {
                throw new Error('Could not confirm denial. Refresh to check the saved status.');
            }
            row.status = 'denied';
        } else {
            if (!Number.isSafeInteger(result?.id) || typeof result.name !== 'string'
                || typeof result.content_hash !== 'string') {
                throw new Error('Could not confirm installation. Refresh to check the saved status.');
            }
            row.status = 'installed';
            row.skill_package_id = result.id;
        }
    } catch (error) {
        if (generation === epoch) {
            decisionError = `${error.message || 'Could not confirm the decision.'} Refresh status before trying again.`;
        }
    } finally {
        decisions.delete(key);
        if (generation === epoch) {
            render();
            // This read reconciles failures where the POST result was lost.
            void refreshSkillRequests(owner);
            if (skillsDialog.open && skillsOwner === owner && skillsController) {
                void loadSkillActivity(owner, skillsEpoch, skillsController.signal);
            }
        }
    }
}

for (const action of ['approve', 'deny']) {
    for (const prefix of ['skill-install', 'skill-review']) {
        el(`${prefix}-${action}`).addEventListener('click', () => {
            if (prefix === 'skill-review' && dialogMode !== 'request') return;
            void decide(action);
        });
    }
}
el('skill-install-read').addEventListener('click', () => {
    dialogMode = 'request';
    configureRequestPreview();
    returnFocus = el('skill-install-read');
    if (!dialog.open) dialog.showModal();
    render();
    void ensureReview();
});
el('skill-review-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
    previewEpoch += 1;
    previewController?.abort();
    previewController = null;
    if (returnFocus?.isConnected && (dialogMode === 'installed' || !card.hidden)) returnFocus.focus();
    dialogMode = 'request';
    previewSelection = null;
});
for (const [id, step] of [['prev', -1], ['next', 1]]) {
    el(`skill-install-${id}`).addEventListener('click', () => {
        const available = visibleRows();
        if (!available.length) return;
        const index = available.findIndex((row) => row.id === selectedId);
        selectedId = available[(index + step + available.length) % available.length].id;
        decisionError = '';
        reviewController?.abort();
        reviewController = null;
        reviewingKey = null;
        render();
        void ensureReview();
    });
}
el('skill-install-dismiss').addEventListener('click', () => {
    const row = selected();
    if (row && row.status !== 'pending' && row.status !== 'installing' && !decisions.has(keyOf(row))) {
        rememberDismissal(row);
        if (dialog.open) dialog.close();
        render();
        void ensureReview();
    }
});
async function retry() {
    decisionError = '';
    const row = selected();
    if (row) reviewErrors.delete(keyOf(row));
    await refreshSkillRequests(conversation);
    render();
    void ensureReview();
}
el('skill-install-retry').addEventListener('click', () => { void retry(); });
el('skill-review-retry').addEventListener('click', () => {
    if (dialogMode === 'installed' && previewSelection) {
        void openInstalledPreview(previewSelection.package, previewSelection.button);
    } else {
        void retry();
    }
});
window.addEventListener('storage', (event) => {
    if (event.key === null || event.key?.startsWith(dismissalPrefix)) {
        render();
        void ensureReview();
    }
});
window.addEventListener('focus', () => { void refreshSkillRequests(conversation); });
function configureRequestPreview() {
    text('skill-review-intro', 'Read the candidate instructions before approving the download.');
    text('skill-review-revision-label', 'Commit');
    show('skill-review-path-label', true);
    show('skill-review-path', true);
    text('skill-review-note', 'This preview shows SKILL.md. Approval downloads its containing directory and supporting files at the displayed commit. Activation is separate. Scripts and dependencies are not run or installed.');
}

function makeElement(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
}

export async function openConversationSkills(owner, title, trigger = null) {
    skillsOwner = owner;
    skillsReturnFocus = trigger;
    text('conversation-skills-chat', title || 'Conversation');
    if (!skillsDialog.open) skillsDialog.showModal();
    await loadConversationSkills();
}

async function loadConversationSkills() {
    skillsController?.abort();
    const controller = new AbortController();
    skillsController = controller;
    const epoch = ++skillsEpoch;
    const owner = skillsOwner;
    const activityLoad = loadSkillActivity(owner, epoch, controller.signal);
    const list = el('conversation-skills-list');
    list.replaceChildren();
    list.setAttribute('aria-busy', 'true');
    text('conversation-skills-status', 'Loading activated skills…');
    el('conversation-skills-status').dataset.error = 'false';
    try {
        const data = await readResponse(await fetch(`/api/conversations/${owner}/skills`, {
            signal: controller.signal, cache: 'no-store', headers: { Accept: 'application/json' },
        }));
        if (epoch !== skillsEpoch || !skillsDialog.open) return;
        if (!Array.isArray(data) || !data.every((item) => (
            Number.isSafeInteger(item.id) && item.id > 0
            && typeof item.instructions_loaded === 'boolean'
            && ['name', 'description', 'source', 'content_hash'].every((key) => typeof item[key] === 'string')
        ))) throw new Error('The server returned incomplete conversation skill data.');
        text('conversation-skills-status', data.length
            ? `${data.length} activated skill${data.length === 1 ? '' : 's'}.`
            : 'No skills are activated in this conversation.');
        for (const item of data) {
            const entry = makeElement('article', 'conversation-skill-entry');
            entry.appendChild(makeElement('h3', '', item.name));
            entry.appendChild(makeElement('p', 'conversation-skill-description', item.description));
            const badges = makeElement('div', 'conversation-skill-badges');
            badges.appendChild(makeElement('span', 'conversation-skill-badge', 'Activated'));
            const loaded = makeElement('span', 'conversation-skill-badge', item.instructions_loaded
                ? 'Instructions loaded previously' : 'Instructions not loaded yet');
            loaded.dataset.loaded = String(item.instructions_loaded);
            badges.appendChild(loaded);
            entry.appendChild(badges);
            const details = makeElement('details', 'conversation-skill-version');
            details.appendChild(makeElement('summary', '', 'Source and version'));
            details.appendChild(makeElement('p', '', item.source));
            details.appendChild(makeElement('p', '', item.content_hash));
            entry.appendChild(details);
            const button = makeElement('button', '', 'Read instructions');
            button.type = 'button';
            button.setAttribute('aria-haspopup', 'dialog');
            button.setAttribute('aria-label', `Read instructions for ${item.name}`);
            button.addEventListener('click', () => { void openInstalledPreview(item, button); });
            entry.appendChild(button);
            list.appendChild(entry);
        }
    } catch (error) {
        if (epoch === skillsEpoch && !controller.signal.aborted) {
            text('conversation-skills-status', error.message || 'Could not load conversation skills.');
            el('conversation-skills-status').dataset.error = 'true';
        }
    } finally {
        if (epoch === skillsEpoch) list.setAttribute('aria-busy', 'false');
        await activityLoad;
    }
}

const lifecycleLabels = {
    skill_install_approved: 'Download approved',
    skill_install_denied: 'Request denied',
    skill_install_completed: 'Installed and approved',
    skill_install_failed: 'Installation failed',
};

function renderSkillActivity(events) {
    const list = el('skill-activity-list');
    list.replaceChildren();
    const seen = new Set();
    const entries = events.filter(event => {
        if (!event || !Object.hasOwn(lifecycleLabels, event.event_type || event.type)
            || !Number.isSafeInteger(event.id) || seen.has(event.id)) return false;
        seen.add(event.id);
        return true;
    }).sort((a, b) => b.id - a.id);

    for (const event of entries) {
        const type = event.event_type || event.type;
        const data = event.data && typeof event.data === 'object' && !Array.isArray(event.data)
            ? event.data : {};
        const item = makeElement('li', 'skill-activity-entry');
        item.dataset.eventType = type;
        const header = makeElement('div', 'skill-activity-header');
        header.appendChild(makeElement('strong', '', lifecycleLabels[type]));
        const time = makeElement('time', '', typeof event.created_at === 'string'
            ? `${event.created_at} UTC` : 'Time not recorded');
        header.appendChild(time);
        item.appendChild(header);
        const path = typeof data.skill_file_path === 'string' ? data.skill_file_path : '';
        const name = typeof data.name === 'string' && data.name.trim()
            ? data.name : path || 'Skill package';
        item.appendChild(makeElement('p', 'skill-activity-name', name));
        if (type === 'skill_install_approved') {
            item.appendChild(makeElement('p', 'skill-activity-note', 'Download authorized; this event does not confirm installation finished.'));
        } else if (type === 'skill_install_failed') {
            const message = data.reason === 'server_restart'
                ? 'Installation was interrupted by a server restart. Marked failed during startup; no automatic retry was started.'
                : 'Installation did not complete. This request did not activate a skill.';

            item.appendChild(
                makeElement('p', 'skill-activity-note', message)
            );
        }
        const details = makeElement('details', 'skill-activity-details');
        details.appendChild(makeElement('summary', '', 'Event details'));
        const fields = makeElement('dl', '');
        for (const [label, value] of [
            ['Event ID', event.id],
            ['Event type', type],
            ['Conversation ID', event.conversation_id],
            ['Reason', data.reason],
            ['Request ID', data.request_id],
            ['Repository', data.repository_url],
            ['Commit', data.revision],
            ['Entry point', data.skill_file_path],
            ['Package ID', data.skill_package_id],
            ['Skill name', data.name],
            ['Source', data.source],
            ['Content hash', data.content_hash],
        ]) {
            if (typeof value !== 'string' && typeof value !== 'number') continue;
            fields.appendChild(makeElement('dt', '', label));
            const description = makeElement('dd', '');
            description.appendChild(makeElement('code', '', String(value)));
            fields.appendChild(description);
        }
        details.appendChild(fields);
        item.appendChild(details);
        list.appendChild(item);
    }
    text('skill-activity-status', entries.length
        ? `${entries.length} saved installation event${entries.length === 1 ? '' : 's'}. Newest first.`
        : 'No installation activity was recorded for this conversation. Older decisions may predate activity tracking.');
}

async function loadSkillActivity(owner, epoch, signal) {
    const activityRequest = ++activityEpoch;
    const list = el('skill-activity-list');
    list.replaceChildren();
    list.setAttribute('aria-busy', 'true');
    text('skill-activity-status', 'Loading installation activity…');
    el('skill-activity-status').dataset.error = 'false';
    try {
        const result = await readResponse(await fetch(`/api/conversations/${owner}`, {
            signal, cache: 'no-store', headers: { Accept: 'application/json' },
        }));
        if (activityRequest !== activityEpoch || epoch !== skillsEpoch || owner !== skillsOwner || !skillsDialog.open || signal.aborted) return;
        if (!result || result.id !== owner || !Array.isArray(result.execution_events)) {
            throw new Error('The server returned incomplete installation activity.');
        }
        renderSkillActivity(result.execution_events.filter(event => event?.conversation_id === owner));
    } catch (error) {
        if (activityRequest === activityEpoch && epoch === skillsEpoch && owner === skillsOwner && skillsDialog.open && !signal.aborted) {
            text('skill-activity-status', error.message || 'Could not load installation activity. Use Refresh skills and activity to retry.');
            el('skill-activity-status').dataset.error = 'true';
        }
    } finally {
        if (activityRequest === activityEpoch && epoch === skillsEpoch && owner === skillsOwner) list.setAttribute('aria-busy', 'false');
    }
}

async function openInstalledPreview(packageInfo, button) {
    previewController?.abort();
    const controller = new AbortController();
    previewController = controller;
    const epoch = ++previewEpoch;
    dialogMode = 'installed';
    const owner = skillsOwner;
    previewSelection = { package: packageInfo, button };
    returnFocus = button;
    clearReviewView();
    text('skill-review-title', packageInfo.name);
    text('skill-review-intro', 'Read the saved instructions for this activated skill.');
    text('skill-review-revision-label', 'Content hash');
    show('skill-review-path-label', false);
    show('skill-review-path', false);
    text('skill-review-description', packageInfo.description);
    text('skill-review-source', packageInfo.source);
    text('skill-review-revision', packageInfo.content_hash);
    text('skill-review-note', 'Viewing these instructions does not load them into the agent, change activation, execute scripts, or install dependencies.');
    show('skill-review-deny', false);
    show('skill-review-approve', false);
    show('skill-review-retry', false);
    text('skill-review-status', 'Verifying the saved skill package…');
    el('skill-review-status').dataset.error = 'false';
    if (!dialog.open) dialog.showModal();
    try {
        const result = await readResponse(await fetch(`/api/conversations/${owner}/skills/${packageInfo.id}/review`, {
            signal: controller.signal, cache: 'no-store', headers: { Accept: 'application/json' },
        }));
        if (epoch !== previewEpoch || !dialog.open || dialogMode !== 'installed') return;
        if (result?.metadata?.id !== packageInfo.id
            || result.metadata.name !== packageInfo.name
            || result.metadata.content_hash !== packageInfo.content_hash
            || typeof result.instructions !== 'string') {
            throw new Error('The returned skill does not match the selected package.');
        }
        text('skill-review-instructions', result.instructions);
        text('skill-review-status', 'Saved package verified. Instructions shown below.');
    } catch (error) {
        if (epoch === previewEpoch && !controller.signal.aborted) {
            text('skill-review-status', error.message || 'Could not read the saved instructions.');
            el('skill-review-status').dataset.error = 'true';
            show('skill-review-retry', true);
        }
    }
}

el('conversation-skills-close').addEventListener('click', () => skillsDialog.close());
el('conversation-skills-refresh').addEventListener('click', () => { void loadConversationSkills(); });
skillsDialog.addEventListener('close', () => {
    skillsEpoch += 1;
    skillsController?.abort();
    if (dialog.open && dialogMode === 'installed') dialog.close();
    skillsOwner = null;
    if (skillsReturnFocus?.isConnected) skillsReturnFocus.focus();
});

function closeOnBackdrop(target) {
    let pressedOutside = false;
    const outside = (event) => {
        const rect = target.getBoundingClientRect();
        return event.clientX < rect.left || event.clientX > rect.right
            || event.clientY < rect.top || event.clientY > rect.bottom;
    };
    target.addEventListener('pointerdown', (event) => {
        pressedOutside = event.target === target && outside(event);
    });
    target.addEventListener('click', (event) => {
        if (pressedOutside && event.target === target && outside(event)) target.close();
        pressedOutside = false;
    });
    target.addEventListener('pointercancel', () => { pressedOutside = false; });
}
closeOnBackdrop(dialog);
closeOnBackdrop(skillsDialog);
setSkillConversation(state.currentConversationId);
