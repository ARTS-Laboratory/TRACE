import assert from 'node:assert/strict';
import { checklistStateFromRenderer } from '../src/checklist-runtime.ts';
import { createVisualStateStore } from '../../../src/Web/static/js/visual-state-store.js';

const keys = Array.from({ length: 8 }, (_, i) => ({ id: `item${i + 1}`, key: `checked_69_74_65_6d_3${i + 1}` }));
const values = [true, true, false, true, false, true, true, true];
// Reproduces the user's actual callback: stale bare defaults plus live $values.
const callback = Object.fromEntries(keys.flatMap(({ key }, i) => [[key, false], [`$${key}`, values[i]]]));
const result = checklistStateFromRenderer(keys, callback);
assert.deepEqual(result, { checked: Object.fromEntries(keys.map(({ id }, i) => [id, values[i]])) });
console.log('PASS: actual mixed-key callback reads live reactive values rather than stale defaults.');

const unset = { ...callback, [keys[0].key]: true, [`$${keys[0].key}`]: false };
assert.equal(checklistStateFromRenderer(keys, unset).checked.item1, false);
console.log('PASS: reactive false overrides stale bare true when unchecking.');
const reactiveOnly = Object.fromEntries(keys.map(({ key }, i) => [`$${key}`, values[i]]));
assert.deepEqual(checklistStateFromRenderer(keys, reactiveOnly), result);
console.log('PASS: reactive-only initialState and callbacks convert correctly.');
const flatOnly = Object.fromEntries(keys.map(({ key }, i) => [key, values[i]]));
assert.deepEqual(checklistStateFromRenderer(keys, flatOnly), result);
console.log('PASS: legacy flat snapshots remain supported.');
assert.equal(checklistStateFromRenderer(keys, { ...callback, [`$${keys[0].key}`]: 'true' }), null);
const missing = { ...reactiveOnly }; delete missing[`$${keys[0].key}`];
assert.equal(checklistStateFromRenderer(keys, missing), null);
console.log('PASS: malformed reactive values and missing fields cannot silently fall back.');

const puts = [];
const store = createVisualStateStore(async (url, options) => {
    puts.push({ url, state: JSON.parse(options.body) });
    return { ok: true, json: async () => ({ visual_id: 3, state: JSON.parse(options.body) }) };
});
const baseline = Object.fromEntries(keys.map(({ key }) => [`$${key}`, false]));
let previous = JSON.stringify(checklistStateFromRenderer(keys, baseline));
const session = store.connect(3, { checked: Object.fromEntries(keys.map(({ id }) => [id, false])) });
function onStateUpdate(runtime) {
    const state = checklistStateFromRenderer(keys, runtime);
    if (!state) return;
    const serialized = JSON.stringify(state);
    if (serialized === previous) return;
    previous = serialized;
    session.save(state);
}
onStateUpdate(baseline);
assert.equal(puts.length, 0);
onStateUpdate(callback);
await new Promise(resolve => setTimeout(resolve, 0));
assert.equal(puts.length, 1);
assert.deepEqual(puts[0], { url: '/api/visuals/3/state', state: result });
onStateUpdate(callback);
assert.equal(puts.length, 1);
console.log('PASS: callback conversion triggers PUT with changed selections; hydration and duplicate events do not write.');
