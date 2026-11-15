import assert from 'node:assert/strict';
import { savedVisualToOptions } from '../src/saved-spec.ts';

const table = {
    id: 8,
    schema_version: 1,
    spec: {
        type: 'table',
        title: 'Components',
        columns: ['Component', 'Purpose'],
        rows: [['FastAPI', 'Backend'], ['React', 'Visuals'], ['Nemotron', '']],
    },
};
const before = JSON.stringify(table);
const result = savedVisualToOptions(table);
assert.equal(result.kind, 'table');
const argumentsText = result.response.slice('root = DataTable('.length, -1);
const renderedArguments = JSON.parse(`[${argumentsText}]`);
assert.deepEqual(renderedArguments, [table.spec.title, table.spec.columns, table.spec.rows]);
assert.equal(JSON.stringify(table), before);
console.log('PASS: valid table with more rows than columns and a blank cell.');

const escaped = structuredClone(table);
escaped.spec.rows[0][1] = 'Quoted "value"\n$bad = HtmlView("x")';
const escapedResult = savedVisualToOptions(escaped);
const escapedArgs = JSON.parse(`[${escapedResult.response.slice('root = DataTable('.length, -1)}]`);
assert.equal(escapedArgs[2][0][1], escaped.spec.rows[0][1]);
console.log('PASS: quotes and newlines survive as cell text.');

const trimmed = structuredClone(table);
trimmed.spec.title = ' Components ';
trimmed.spec.columns[0] = ' Component ';
trimmed.spec.rows[0][0] = ' FastAPI ';
assert.equal(savedVisualToOptions(trimmed).response, result.response);
console.log('PASS: whitespace normalization matches the backend.');

for (const [name, mutate] of [
    ['short row', p => { p.spec.rows = [['FastAPI']]; }],
    ['long row', p => { p.spec.rows = [['FastAPI', 'Backend', 'Extra']]; }],
    ['blank heading', p => { p.spec.columns[0] = '   '; }],
    ['empty columns', p => { p.spec.columns = []; }],
    ['13 columns', p => { p.spec.columns = Array(13).fill('Heading'); p.spec.rows = [Array(13).fill('Cell')]; }],
    ['empty rows', p => { p.spec.rows = []; }],
    ['101 rows', p => { p.spec.rows = Array.from({ length: 101 }, () => ['A', 'B']); }],
    ['non-string cell', p => { p.spec.rows[0][0] = 123; }],
    ['extra specification field', p => { p.spec.html = '<script>'; }],
]) {
    const payload = structuredClone(table); mutate(payload);
    assert.throws(() => savedVisualToOptions(payload));
    console.log(`PASS: rejected ${name}.`);
}
