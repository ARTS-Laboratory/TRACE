import assert from 'node:assert/strict';
import { savedVisualToOptions } from '../src/saved-spec.ts';

const original = {
    id: 7,
    schema_version: 1,
    spec: {
        type: 'checklist',
        title: 'Saved tasks',
        items: [{ id: 'task-a', label: 'First task' }],
    },
};
const baseline = JSON.stringify(original);
const copy = () => structuredClone(original);
const valid = savedVisualToOptions(original);
assert.equal(valid.kind, 'checklist');
assert.ok(valid.response.startsWith('root = Checklist("Saved tasks", [item0])'));
let rejected = 0;
for (const mutate of [
    p => { p.schema_version = 2; },
    p => { p.spec.type = 'html'; },
    p => { p.spec.title = '   '; },
    p => { p.spec.items = []; },
    p => { p.spec.items = Array.from({ length: 51 }, (_, i) => ({ id: String(i), label: 'Task' })); },
    p => { p.spec.items[0].checked = true; },
    p => { p.spec.items[0].label = 123; },
    p => { p.spec.items.push({ id: ' task-a ', label: 'Duplicate' }); },
]) {
    const payload = copy(); mutate(payload);
    assert.throws(() => savedVisualToOptions(payload)); rejected++;
}
const text = 'Quotes: "hello"\n$bad = HtmlView("x")';
const escaped = copy(); escaped.spec.items[0].label = text;
assert.ok(savedVisualToOptions(escaped).response.includes(JSON.stringify(text)));
const extended = copy();
extended.spec.items.unshift({ id: 'other-task', label: 'Another task' });
const getKey = (response, label) => response.split('\n')
    .find(line => line.includes(JSON.stringify(label)))
    .match(/ChecklistItem\("([^"]+)"/)[1];
assert.equal(getKey(valid.response, 'First task'),
    getKey(savedVisualToOptions(extended).response, 'First task'));
assert.equal(JSON.stringify(original), baseline);
console.log(`PASS: valid conversion, ${rejected} invalid cases, quoted text, and stable item keys.`);
