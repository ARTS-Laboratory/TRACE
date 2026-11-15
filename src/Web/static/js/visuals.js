import { createVisualStateStore } from './visual-state-store.js';

const handles = new WeakMap();
const stateStore = createVisualStateStore();
let modulePromise;

function getRenderer() {
    modulePromise ??= import('/static/intelligent-ui/renderer.js');
    return modulePromise;
}

export function unmountVisual(element) {
    const handle = handles.get(element);
    if (!handle) return;
    handles.delete(element);
    handle.controller.abort();
    handle.session?.disconnect();
    // Do not abort pending saves when switching conversations.
    if (handle.module) handle.module.unmountVisual(handle.rendererHost);
    delete element.dataset.visualHost;
    element.classList.remove('gc-visual-state-host');
}

export function unmountVisuals(container) {
    if (container.matches('[data-visual-host]')) unmountVisual(container);
    container.querySelectorAll('[data-visual-host]').forEach(unmountVisual);
}

function createSaveControls(element, handle) {
    const controls = document.createElement('div');
    controls.className = 'gc-visual-save-controls';
    controls.hidden = true;
    const status = document.createElement('p');
    status.className = 'gc-visual-save-status';
    status.setAttribute('role', 'status');
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Retry save';
    retry.hidden = true;
    retry.addEventListener('click', () => handle.session?.retry());
    controls.append(status, retry);
    element.append(controls);
    return ({ phase }) => {
        if (handles.get(element) !== handle) return;
        controls.hidden = phase === 'idle';
        controls.dataset.phase = phase;
        status.textContent = phase === 'saving' ? 'Saving selections…'
            : phase === 'error' ? 'Selections not saved. Retry before reloading.'
                : phase === 'saved' ? 'Selections saved.' : '';
        retry.hidden = phase !== 'error';
    };
}

export function renderVisual(element, visualId) {
    const id = visualId == null ? null : String(visualId);
    const previous = handles.get(element);
    if (previous && previous.id === id) return;
    unmountVisual(element);
    const handle = { id, module: null, rendererHost: null, session: null, controller: new AbortController() };
    handles.set(element, handle);
    element.dataset.visualHost = '';
    element.classList.remove('response-block-placeholder');

    if (id === null || !/^[1-9]\d*$/.test(id)) {
        element.textContent = 'Visual unavailable.';
        return;
    }

    element.textContent = 'Loading visual…';
    void (async () => {
        const response = await fetch(`/api/visuals/${encodeURIComponent(id)}`, {
            signal: handle.controller.signal,
            cache: 'no-store',
        });
        if (handles.get(element) !== handle) return;
        if (!response.ok) {
            if (response.status === 404) { element.textContent = 'Visual not found.'; return; }
            throw new Error(`Visual request failed: ${response.status}`);
        }
        const payload = await response.json();
        if (handles.get(element) !== handle) return;
        if (!payload || String(payload.id) !== id) throw new Error('Visual response ID does not match the requested ID');
        const module = await getRenderer();
        if (handles.get(element) !== handle) return;
        if (!element.isConnected) { unmountVisual(element); return; }

        const rendererHost = document.createElement('div');
        element.replaceChildren(rendererHost);
        handle.rendererHost = rendererHost;
        handle.module = module;
        let renderingPayload = payload;
        if (payload.spec?.type === 'checklist') {
            element.classList.add('gc-visual-state-host');
            const showStatus = createSaveControls(element, handle);
            handle.session = stateStore.connect(id, payload.state ?? {}, showStatus);
            // Preserve local changes during pending saves or a quick remount.
            renderingPayload = { ...payload, state: handle.session.state };
        }
        module.mountSavedVisual(rendererHost, renderingPayload, state => {
            if (handles.get(element) !== handle) return;
            handle.session?.save(state);
            element.dispatchEvent(new CustomEvent('glorpcat:visual-state', {
                bubbles: true,
                detail: { visualId: id, state },
            }));
        });
    })().catch(error => {
        if (handles.get(element) !== handle) return;
        handle.session?.disconnect();
        if (handle.module) handle.module.unmountVisual(handle.rendererHost);
        handle.module = null;
        console.error('Could not load visual:', error);
        element.textContent = 'This visual could not be displayed.';
    });
}
