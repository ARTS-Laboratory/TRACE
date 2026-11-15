import assert from 'node:assert/strict';
import { savedVisualToOptions } from '../src/saved-spec.ts';

const data = {
    id: 12, schema_version: 1,
    spec: {
        type: 'comparison', title: 'Deployment options',
        criteria: ['Connection required', 'Hardware'],
        options: [
            { name: 'Local', values: ['No', 'Your computer'] },
            { name: 'Hosted', values: ['Yes', ''] },
        ],
    },
};
function convert(payload) {
    const result = savedVisualToOptions(payload);
    assert.equal(result.kind, 'comparison');
    assert.ok(result.response.startsWith('root = DataComparison('));
    return JSON.parse(`[${result.response.slice('root = DataComparison('.length, -1)}]`);
}
const before = JSON.stringify(data);
assert.deepEqual(convert(data), [data.spec.title, data.spec.criteria, data.spec.options]);
assert.equal(JSON.stringify(data), before);
console.log('PASS: comparison conversion preserves values, empty cells, and input.');

const quoted = structuredClone(data);
quoted.spec.title = 'Title "quoted"';
quoted.spec.criteria[0] = 'Criterion\n$bad = HtmlView("x")';
quoted.spec.options[0].name = '<b>Local</b>';
quoted.spec.options[0].values[0] = 'Text "quoted"\nnext line';
assert.deepEqual(convert(quoted), [quoted.spec.title, quoted.spec.criteria, quoted.spec.options]);
console.log('PASS: quotes, newlines, and markup remain quoted data.');

const padded = structuredClone(data);
padded.spec.title = ' Deployment options ';
padded.spec.criteria[0] = ' Connection required ';
padded.spec.options[0].name = ' Local ';
padded.spec.options[0].values[0] = ' No ';
padded.spec.options[1].values[1] = '   ';
assert.deepEqual(convert(padded), convert(data));
console.log('PASS: whitespace normalization matches backend.');

const maximum = structuredClone(data);
maximum.spec.criteria = Array.from({ length: 12 }, (_, i) => `Criterion ${i}`);
maximum.spec.options = Array.from({ length: 4 }, (_, i) => ({ name: `Option ${i}`, values: Array(12).fill('value') }));
assert.equal(convert(maximum)[2].length, 4);
console.log('PASS: 12 criteria and 4 options accepted.');

for (const [name, mutate] of [
    ['short values', p => { p.spec.options[0].values = ['No']; }],
    ['long values', p => { p.spec.options[0].values.push('Extra'); }],
    ['blank criterion', p => { p.spec.criteria[0] = ' '; }],
    ['blank option name', p => { p.spec.options[0].name = ' '; }],
    ['blank title', p => { p.spec.title = ' '; }],
    ['empty criteria', p => { p.spec.criteria = []; }],
    ['13 criteria', p => { p.spec.criteria = Array(13).fill('Criterion'); p.spec.options.forEach(o => { o.values = Array(13).fill('value'); }); }],
    ['one option', p => { p.spec.options.pop(); }],
    ['five options', p => { p.spec.options = Array(5).fill(p.spec.options[0]); }],
    ['empty values', p => { p.spec.options[0].values = []; }],
    ['non-string value', p => { p.spec.options[0].values[0] = false; }],
    ['extra option field', p => { p.spec.options[0].winner = true; }],
    ['extra specification field', p => { p.spec.html = '<b>'; }],
]) {
    const payload = structuredClone(data); mutate(payload);
    assert.throws(() => savedVisualToOptions(payload));
    console.log(`PASS: rejected ${name}.`);
}
