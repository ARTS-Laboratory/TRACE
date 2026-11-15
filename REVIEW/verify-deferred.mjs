import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const base = new URL('../src/Web/static/js/', import.meta.url);
const renderingSource = await readFile(new URL('rendering.js', base), 'utf8');
const chatSource = await readFile(new URL('chat.js', base), 'utf8');
class Element {
    dataset = {}; children = []; hidden = false; open = false; textContent = '';
    value = ''; disabled = false;
    style = { removeProperty(name) { delete this[name]; } };
    classList = { add() {}, remove() {} };
    appendChild(child) { this.children.push(child); child.parentNode = this; return child; }
    append(...children) { children.forEach(child => this.appendChild(child)); }
    insertBefore(child, next) {
        const index = this.children.indexOf(next);
        if (index < 0) return this.appendChild(child);
        this.children.splice(index, 0, child); child.parentNode = this; return child;
    }
    querySelectorAll() { return []; }
    replaceChildren(...children) { this.children = []; this.append(...children); }
    set innerHTML(value) { this.markup = value; this.children = []; }
    get innerHTML() { return this.markup; }
    addEventListener() {}
}
async function environment() {
    const renders = [], frames = new Map(), sockets = [], errors = [];
    const nodes = new Map(['messages', 'message-input', 'send-button', 'chat'].map(id => [id, new Element()]));
    const state = { responseStates: new Map(), conversationViews: new Map(), currentConversationId: 1, autoScroll: false };
    let frameId = 0;
    class WebSocket {
        static OPEN = 1;
        readyState = 1;
        sent = [];
        constructor() { sockets.push(this); }
        send(text) { this.sent.push(JSON.parse(text)); }
    }
    const context = vm.createContext({
        console: { log() {}, error(...args) { errors.push(args); } },
        WebSocket, requestAnimationFrame: cb => { frames.set(++frameId, cb); return frameId; },
        cancelAnimationFrame: id => frames.delete(id),
        document: { getElementById: id => nodes.get(id), createElement: () => new Element(), documentElement: { scrollHeight: 100 } },
        window: { location: { host: 'localhost' }, scrollTo() {} },
        marked: { parse: text => text }, DOMPurify: { sanitize: text => text },
        lucide: { createIcons() {} },
    });
    async function mock(exports) {
        const module = new vm.SyntheticModule(Object.keys(exports), function () {
            for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
        }, { context });
        await module.link(() => {}); await module.evaluate(); return module;
    }
    const visuals = await mock({ renderVisual: (element, id) => renders.push({ element, id }), unmountVisuals() {} });
    const rendering = new vm.SourceTextModule(renderingSource, { context });
    await rendering.link(() => visuals); await rendering.evaluate();
    const deps = {
        './rendering.js': rendering,
        './state.js': await mock({ state }),
        './attachments.js': await mock({ getCurrentAttachment: () => null, uploadAttachment() {}, clearAttachment() {}, addMessageAttachment() {}, openImageViewer() {} }),
        './conversations.js': await mock({ loadConversations() {}, updateConversationTitle() {} }),
    };
    const chat = new vm.SourceTextModule(chatSource, { context });
    await chat.link(name => { assert.ok(deps[name], name); return deps[name]; });
    await chat.evaluate();
    const ws = sockets[0];
    return {
        r: rendering.namespace, c: chat.namespace, state, renders, errors, frames, ws, nodes,
        async start(id = 1) {
            state.currentConversationId = id; nodes.get('message-input').value = 'Test';
            await chat.namespace.sendMessage();
            return state.responseStates.get(id);
        },
        async event(type, extra = {}) {
            await ws.onmessage({ data: JSON.stringify({ type, conversation_id: 1, assistant_message_id: 100, ...extra }) });
        },
        drain() {
            while (frames.size) { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(cb => cb()); }
        },
    };
}
let count = 0;
async function queue(e, response, id = 1) {
    await e.event('block_created', { conversation_id: id, assistant_message_id: id * 100,
        data: { id: 2, type: 'visual', visual_id: 7 } });
    e.drain();
    assert.equal(response.blockState.blocks.get('2').element.hidden, true);
    assert.equal(e.renders.length, 0);
}
{
    const e = await environment(), response = await e.start();
    await e.event('content_delta', { block_id: 1, data: 'Before' });
    await queue(e, response);
    await e.event('tool_finished', { tool_call_id: 'call1', data: { name: 'create_visual', elapsed: 0.01, result: { visual_id: 7 } } });
    await e.event('thinking_delta', { data: 'Thinking after the tool.' });
    await e.event('content_delta', { block_id: 3, data: 'After' });
    e.drain();
    assert.equal(e.renders.length, 0);
    assert.equal(response.assistant.thinkingDetails.open, true);
    count++;
    const blocks = response.blockState, assistant = response.assistant;
    await e.event('done');
    assert.equal(e.renders.length, 1);
    assert.equal(blocks.blocks.get('2').element.hidden, false);
    assert.deepEqual(blocks.container.children.map(child => child.dataset.blockId), ['1', '2', '3']);
    assert.equal(assistant.thinkingDetails.open, true);
    assert.equal(assistant.thinkingSummary.textContent, 'Thought');
    assert.equal(response.generating, false); count++;
}
{
    const e = await environment(), response = await e.start(); await queue(e, response);
    const assistant = response.assistant; assistant.thinkingDetails.open = false;
    await e.event('done'); assert.equal(assistant.thinkingDetails.open, false); count++;
}
for (const mode of ['cancelled', 'stop', 'error', 'unscoped-error']) {
    const e = await environment(), response = await e.start(); await queue(e, response);
    if (mode === 'stop') e.c.stopChat(1);
    else if (mode === 'unscoped-error') await e.event('error', { conversation_id: undefined, data: 'Failure' });
    else await e.event(mode, { data: 'Failure' });
    assert.equal(e.renders.length, 1, mode);
    assert.equal(response.assistant.thinkingDetails.open, true, mode);
    assert.equal(response.cancelled, true, mode);
    assert.equal(response.generating, false, mode); count++;
}
{
    const e = await environment(), first = await e.start(1); await queue(e, first, 1);
    const second = await e.start(2); await queue(e, second, 2);
    await e.event('error', { conversation_id: undefined, data: 'Ambiguous' });
    assert.equal(e.renders.length, 0); assert.equal(e.errors.length, 1); count++;
    e.ws.onclose();
    assert.equal(e.renders.length, 2);
    assert.equal(first.generating, false); assert.equal(second.generating, false);
    assert.equal(e.nodes.get('send-button').disabled, true); count++;
}
{
    const e = await environment(), element = new Element();
    e.r.renderStoredResponse(element, { blocks: [{ id: 2, type: 'visual', visual_id: 7 }] });
    assert.equal(e.renders.length, 1); assert.equal(element.children[0].hidden, false); count++;
}
{
    const e = await environment(), element = new Element();
    const blocks = e.r.createResponseBlockState(element, { deferVisuals: true });
    e.r.setResponseBlock(blocks, { id: 2, type: 'visual', visual_id: 7 });
    // Finish before requestAnimationFrame has run.
    e.r.releaseResponseVisuals(blocks);
    assert.equal(e.renders.length, 1); assert.equal(e.frames.size, 0); count++;
}
{
    const e = await environment(), blocks = e.r.createResponseBlockState(new Element(), { deferVisuals: true });
    e.r.setResponseBlock(blocks, { id: 2, type: 'visual', visual_id: 7 }); e.drain();
    e.r.disposeResponseBlocks(blocks); e.r.releaseResponseVisuals(blocks); e.drain();
    assert.equal(e.renders.length, 0); assert.equal(blocks.pendingVisuals.size, 0); count++;
}
{
    const e = await environment(), response = await e.start(); await queue(e, response);
    await e.event('block_created', { data: { id: 2, type: 'visual', visual_id: 7 } }); e.drain();
    await e.event('done'); assert.equal(e.renders.length, 1); count++;
}
console.log(`${count} deferred-rendering and chat lifecycle checks passed (mock DOM and renderer).`);
