import assert from 'node:assert/strict';
import { savedVisualToOptions } from '../src/saved-spec.ts';

const states = ['pending', 'in_progress', 'success', 'warning', 'error'];
const data = { id: 20, schema_version: 1, spec: {
    type: 'status', title: 'System status',
    status_items: states.map(state => ({ label: state, state, detail: '' })),
} };
function convert(payload) {
    const result = savedVisualToOptions(payload);
    assert.equal(result.kind, 'status');
    assert.ok(result.response.startsWith('root = DataStatus('));
    return JSON.parse(`[${result.response.slice('root = DataStatus('.length, -1)}]`);
}
const before = JSON.stringify(data);
assert.deepEqual(convert(data), [data.spec.title, data.spec.status_items]);
assert.equal(JSON.stringify(data), before);
console.log('PASS: all five states convert without mutating input.');
const defaults = structuredClone(data);
defaults.spec.status_items.forEach(item => { delete item.detail; });
assert.deepEqual(convert(defaults), convert(data));
console.log('PASS: omitted details default to empty strings.');
const padded = structuredClone(data);
padded.spec.title = ' System status ';
padded.spec.status_items[0].label = ' pending ';
padded.spec.status_items[0].detail = '   ';
assert.deepEqual(convert(padded), convert(data));
console.log('PASS: whitespace normalization matches backend.');
const quoted = structuredClone(data);
quoted.spec.title = 'Status "quoted"';
quoted.spec.status_items[0].label = '<script>bad</script>';
quoted.spec.status_items[0].detail = 'Text "quoted"\n$bad = HtmlView("x")';
assert.deepEqual(convert(quoted), [quoted.spec.title, quoted.spec.status_items]);
console.log('PASS: quotes, markup, and newlines remain quoted data.');
const maximum = structuredClone(data);
maximum.spec.status_items = Array.from({ length: 20 }, (_, i) => ({ label: `Item ${i}`, state: 'pending', detail: '' }));
assert.equal(convert(maximum)[1].length, 20);
console.log('PASS: 20 status entries accepted.');
for (const [name, mutate] of [
    ['empty list', p => { p.spec.status_items = []; }],
    ['21 entries', p => { p.spec.status_items = Array(21).fill(p.spec.status_items[0]); }],
    ['blank title', p => { p.spec.title = ' '; }],
    ['blank label', p => { p.spec.status_items[0].label = ' '; }],
    ['unsupported state', p => { p.spec.status_items[0].state = 'ready'; }],
    ['padded state', p => { p.spec.status_items[0].state = ' pending '; }],
    ['missing state', p => { delete p.spec.status_items[0].state; }],
    ['non-string detail', p => { p.spec.status_items[0].detail = 123; }],
    ['null detail', p => { p.spec.status_items[0].detail = null; }],
    ['extra entry field', p => { p.spec.status_items[0].id = 'x'; }],
    ['extra specification field', p => { p.spec.html = '<b>'; }],
    ['generic items field', p => { p.spec.items = p.spec.status_items; delete p.spec.status_items; }],
]) {
    const invalid = structuredClone(data); mutate(invalid);
    assert.throws(() => savedVisualToOptions(invalid));
    console.log(`PASS: rejected ${name}.`);
}
