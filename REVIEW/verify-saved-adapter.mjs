import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../src/Web/static/js/visuals.js', import.meta.url), 'utf8');
class Element {
    dataset = {}; textContent = ''; isConnected = true;
    classList = { remove() {} };
    matches() { return 'visualHost' in this.dataset; }
    querySelectorAll() { return []; }
    dispatchEvent() {}
}
const pause = () => new Promise(resolve => setImmediate(resolve));
async function env({ status = 200, badId = false, rejectMount = false, rejectJson = false, rejectBundle = false, gate = null } = {}) {
    const mounts = [], unmounts = [], requests = [];
    const context = vm.createContext({
        AbortController, CustomEvent: class {}, encodeURIComponent,
        console: { error() {} },
        fetch: async (url, options) => {
            requests.push({ url, options });
            if (gate) await gate;
            if (options.signal.aborted) throw new Error('Aborted');
            return { ok: status === 200, status,
                json: async () => {
                    if (rejectJson) throw new Error('Bad JSON');
                    return { id: badId ? 88 : Number(url.split('/').at(-1)), schema_version: 1, spec: {} };
                },
            };
        },
    });
    const renderer = new vm.SyntheticModule(['mountSavedVisual', 'unmountVisual'], function () {
        this.setExport('mountSavedVisual', (element, payload) => {
            if (rejectMount) throw new Error('Invalid specification');
            mounts.push([element, payload]);
        });
        this.setExport('unmountVisual', element => unmounts.push(element));
    }, { context });
    await renderer.link(() => {}); await renderer.evaluate();
    const module = new vm.SourceTextModule(source, { context,
        importModuleDynamically: async () => {
            if (rejectBundle) throw new Error('Missing bundle');
            return renderer;
        },
    });
    await module.link(() => {}); await module.evaluate();
    return { api: module.namespace, mounts, unmounts, requests };
}
let checks = 0;
{
    const e = await env(); const element = new Element();
    e.api.renderVisual(element, 7); await pause();
    assert.equal(e.mounts.length, 1);
    assert.equal(e.requests[0].url, '/api/visuals/7'); checks++;
    e.api.renderVisual(element, 7); await pause();
    assert.equal(e.requests.length, 1); assert.equal(e.mounts.length, 1); checks++;
    e.api.unmountVisuals(element);
    assert.equal(e.unmounts.length, 1); assert.equal(e.requests[0].options.signal.aborted, true); checks++;
}
for (const status of [404, 500]) {
    const e = await env({ status }); const element = new Element();
    e.api.renderVisual(element, 7); await pause();
    assert.equal(e.mounts.length, 0);
    assert.match(element.textContent, status === 404 ? /not found/ : /could not be displayed/); checks++;
}
for (const config of [{ badId: true }, { rejectMount: true }, { rejectJson: true }, { rejectBundle: true }]) {
    const e = await env(config); const element = new Element();
    e.api.renderVisual(element, 7); await pause();
    assert.equal(e.mounts.length, 0); assert.match(element.textContent, /could not be displayed/); checks++;
}
{
    let release; const gate = new Promise(resolve => { release = resolve; });
    const e = await env({ gate }); const element = new Element();
    e.api.renderVisual(element, 7); e.api.unmountVisual(element);
    release(); await pause(); assert.equal(e.mounts.length, 0); checks++;
}
{
    let release; const gate = new Promise(resolve => { release = resolve; });
    const e = await env({ gate }); const element = new Element();
    e.api.renderVisual(element, 7); e.api.renderVisual(element, 8);
    release(); await pause();
    assert.equal(e.mounts.length, 1); assert.equal(e.mounts[0][1].id, 8); checks++;
}
{
    const e = await env(); const element = new Element();
    for (const id of [null, 0, -1, 'bad/id']) e.api.renderVisual(element, id);
    await pause(); assert.equal(e.requests.length, 0); checks++;
}
console.log(`${checks} saved-visual adapter checks passed (mock DOM and renderer).`);
