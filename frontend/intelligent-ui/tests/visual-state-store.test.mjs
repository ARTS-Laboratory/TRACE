import assert from 'node:assert/strict';
import { createVisualStateStore } from '../../../src/Web/static/js/visual-state-store.js';

const tick = () => new Promise(resolve => setTimeout(resolve, 0));
const state = value => ({ checked: { task: value } });
const calls = [];
const store = createVisualStateStore((url, options) => new Promise((resolve, reject) => {
    calls.push({ url, options, resolve, reject });
}));
function acknowledge(index) {
    const call = calls[index];
    call.resolve({ ok: true, json: async () => ({ visual_id: Number(call.url.split('/')[3]), state: JSON.parse(call.options.body) }) });
}
const phases = [];
const session = store.connect(3, state(false), status => phases.push(status.phase));
assert.equal(calls.length, 0);
session.save(state(false));
assert.equal(calls.length, 0);
console.log('PASS: hydration and unchanged selections do not write.');

session.save(state(true));
session.save(state(false));
assert.equal(calls.length, 1);
assert.equal(calls[0].options.method, 'PUT');
assert.equal(calls[0].options.keepalive, true);
assert.deepEqual(JSON.parse(calls[0].options.body), state(true));
acknowledge(0); await tick();
assert.equal(calls.length, 2);
assert.deepEqual(JSON.parse(calls[1].options.body), state(false));
acknowledge(1); await tick();
assert.equal(phases.at(-1), 'saved');
console.log('PASS: rapid changes use sequential PUTs and finish with latest selections.');

session.save(state(true));
session.save(state(false));
session.save(state(true));
assert.equal(calls.length, 3);
acknowledge(2); await tick();
assert.equal(calls.length, 3);
console.log('PASS: intermediate toggles coalesce while a request is pending.');

session.save(state(false));
session.disconnect();
const remountPhases = [];
const remount = store.connect(3, state(true), status => remountPhases.push(status.phase));
assert.deepEqual(remount.state, state(false));
acknowledge(3); await tick();
assert.equal(remountPhases.at(-1), 'saved');
console.log('PASS: pending selections survive disconnect/remount and stale GET data.');

const originalError = console.error;
console.error = () => {};
try {
    remount.save(state(true));
    calls[4].resolve({ ok: false, status: 422 }); await tick();
    assert.equal(remountPhases.at(-1), 'error');
    remount.retry();
    assert.equal(calls.length, 6);
    acknowledge(5); await tick();
    assert.equal(remountPhases.at(-1), 'saved');
    console.log('PASS: server rejection is visible and retry resends latest state.');

    remount.save(state(false));
    remount.save(state(true));
    calls[6].reject(new Error('Response lost after possible commit')); await tick();
    assert.equal(remountPhases.at(-1), 'error');
    remount.retry();
    assert.equal(calls.length, 8);
    assert.deepEqual(JSON.parse(calls[7].options.body), state(true));
    acknowledge(7); await tick();
    console.log('PASS: retry forces a PUT after ambiguous network failure, even when state returns to old value.');

    remount.save(state(false));
    calls[8].resolve({ ok: true, json: async () => ({ visual_id: 999, state: state(false) }) }); await tick();
    assert.equal(remountPhases.at(-1), 'error');
    console.log('PASS: unexpected save response cannot be reported as saved.');
} finally { console.error = originalError; }

const separate = store.connect(4, {});
assert.deepEqual(separate.state, { checked: {} });
separate.save(state(true));
assert.ok(calls.at(-1).url.includes('/4/state'));
acknowledge(calls.length - 1); await tick();
console.log('PASS: different visuals have independent state queues.');
for (const invalid of [null, [], { checked: null }, { checked: { task: 'true' } }, { checked: {}, extra: true }]) {
    assert.throws(() => store.connect(99, invalid));
}
console.log('PASS: malformed state is rejected.');
