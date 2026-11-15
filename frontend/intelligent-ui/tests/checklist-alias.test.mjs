import assert from 'node:assert/strict';
import { savedVisualToOptions } from '../src/saved-spec.ts';

const entries = [{ id: 'task-a', label: 'First task' }];
const legacy = { id: 7, schema_version: 1, spec: { type: 'checklist', title: 'Setup', items: entries } };
const current = { id: 7, schema_version: 1, spec: { type: 'checklist', title: 'Setup', checklist_items: entries } };
const before = JSON.stringify({ legacy, current });
const expected = savedVisualToOptions(legacy);
assert.equal(expected.kind, 'checklist');
assert.deepEqual(savedVisualToOptions(current), expected);
assert.equal(JSON.stringify({ legacy, current }), before);
console.log('PASS: old and new checklist fields produce identical visuals and state keys.');
console.log('PASS: compatibility normalization leaves original payloads unchanged.');

const both = structuredClone(current);
both.spec.items = entries;
assert.throws(() => savedVisualToOptions(both));
console.log('PASS: both field names together are rejected, matching backend.');

for (const field of ['items', 'checklist_items']) {
    for (const [name, mutate] of [
        ['empty list', p => { p.spec[field] = []; }],
        ['duplicate IDs after trimming', p => { p.spec[field].push({ id: ' task-a ', label: 'Duplicate' }); }],
        ['extra item field', p => { p.spec[field][0].checked = true; }],
    ]) {
        const invalid = structuredClone(field === 'items' ? legacy : current);
        mutate(invalid);
        assert.throws(() => savedVisualToOptions(invalid));
        console.log(`PASS: ${field} rejects ${name}.`);
    }
}
const missing = structuredClone(current);
delete missing.spec.checklist_items;
assert.throws(() => savedVisualToOptions(missing));
console.log('PASS: missing checklist entries rejected.');
