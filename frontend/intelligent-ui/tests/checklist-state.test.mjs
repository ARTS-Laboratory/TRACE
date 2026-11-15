import assert from 'node:assert/strict';
import { savedVisualToOptions, checklistStateFromRenderer } from '../src/saved-spec.ts';

const data = { id: 3, schema_version: 1, spec: {
    type: 'checklist', title: 'Setup',
    checklist_items: [{ id: '1', label: 'Install' }, { id: '2', label: 'Build' }, { id: '3', label: 'Open' }],
}, state: { checked: { '1': true, '2': false, '3': true } } };
const before = JSON.stringify(data);
const options = savedVisualToOptions(data);
assert.equal(options.kind, 'checklist');
assert.deepEqual(checklistStateFromRenderer(options.checklistKeys, options.initialState), data.state);
for (const { id, key } of options.checklistKeys) {
    assert.equal(options.initialState[`$${key}`], data.state.checked[id]);
    assert.ok(!Object.hasOwn(options.initialState, key));
    assert.ok(options.response.includes(`$${key} = ${data.state.checked[id]}`));
}
assert.equal(JSON.stringify(data), before);
console.log('PASS: saved booleans restore through initialState and component defaults without mutation.');
const partial = structuredClone(data); partial.state.checked = { '1': true };
const partialOptions = savedVisualToOptions(partial);
assert.deepEqual(checklistStateFromRenderer(partialOptions.checklistKeys, partialOptions.initialState), { checked: { '1': true, '2': false, '3': false } });
console.log('PASS: omitted item IDs default to unchecked.');
const legacy = structuredClone(data);
legacy.spec.items = legacy.spec.checklist_items; delete legacy.spec.checklist_items;
assert.deepEqual(savedVisualToOptions(legacy), options);
console.log('PASS: saved state restores identically for old and new checklist specifications.');
const absent = structuredClone(data); delete absent.state;
const absentOptions = savedVisualToOptions(absent);
assert.deepEqual(Object.values(absentOptions.initialState), [false, false, false]);
console.log('PASS: visuals without saved state start unchecked.');
assert.equal(checklistStateFromRenderer(options.checklistKeys, {}), null);
assert.equal(checklistStateFromRenderer(options.checklistKeys, { ...options.initialState, [`$${options.checklistKeys[0].key}`]: 'true' }), null);
console.log('PASS: incomplete or non-Boolean runtime snapshots are not saved.');
const changed = { ...options.initialState, [`$${options.checklistKeys[0].key}`]: false, internal: 'ignored' };
assert.deepEqual(checklistStateFromRenderer(options.checklistKeys, changed), { checked: { '1': false, '2': false, '3': true } });
console.log('PASS: renderer state converts to item IDs and excludes unrelated fields.');
for (const state of [null, [], { checked: { missing: true } }, { checked: { '1': 'true' } }, { checked: { '1': null } }, { checked: {}, extra: true }]) {
    assert.throws(() => savedVisualToOptions({ ...data, state }));
}
console.log('PASS: invalid saved state and unknown item IDs rejected.');
const arbitrary = structuredClone(data);
arbitrary.spec.checklist_items = [{ id: '__proto__', label: 'Special ID' }, { id: 'space " id', label: 'Quoted ID' }];
arbitrary.state = { checked: Object.fromEntries([['__proto__', true], ['space " id', false]]) };
const arbitraryOptions = savedVisualToOptions(arbitrary);
assert.deepEqual(checklistStateFromRenderer(arbitraryOptions.checklistKeys, arbitraryOptions.initialState), arbitrary.state);
console.log('PASS: arbitrary item IDs survive roundtrip safely.');
delete arbitrary.state;
const missingSpecialState = savedVisualToOptions(arbitrary);
assert.deepEqual(Object.values(missingSpecialState.initialState), [false, false]);
console.log('PASS: special IDs without saved values default to false rather than inherited object properties.');

for (const value of ['true', null, {}]) {
    const invalid = structuredClone(arbitrary);
    invalid.state = { checked: Object.fromEntries([['__proto__', value]]) };
    assert.throws(() => savedVisualToOptions(invalid));
}
console.log('PASS: special IDs still reject non-Boolean saved values.');
