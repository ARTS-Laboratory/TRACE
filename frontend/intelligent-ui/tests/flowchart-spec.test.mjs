import assert from 'node:assert/strict';
import { savedVisualToOptions } from '../src/saved-spec.ts';

const data = { id: 15, schema_version: 1, spec: {
    type: 'flowchart', title: 'Answer workflow', direction: 'TD',
    nodes: [{ id: 'search', label: 'Search sources' }, { id: 'answer', label: 'Answer' }],
    edges: [{ source: 'search', target: 'answer', label: 'Evidence found' }],
} };
function convert(payload) {
    const result = savedVisualToOptions(payload);
    assert.equal(result.kind, 'flowchart');
    assert.ok(result.response.startsWith('root = DataFlowchart('));
    return JSON.parse(`[${result.response.slice('root = DataFlowchart('.length, -1)}]`);
}
const before = JSON.stringify(data);
assert.deepEqual(convert(data), [data.spec.title, 'TD', data.spec.nodes, data.spec.edges]);
assert.equal(JSON.stringify(data), before);
console.log('PASS: flowchart conversion preserves data and input.');
const single = structuredClone(data);
single.spec.nodes.pop(); single.spec.edges = [];
delete single.spec.direction;
assert.equal(convert(single)[1], 'TD');
console.log('PASS: single node, empty edges, and default direction.');
const loops = structuredClone(data);
loops.spec.direction = 'LR';
loops.spec.edges.push({ source: 'answer', target: 'search' }, { source: 'search', target: 'search' }, { source: 'search', target: 'answer' });
assert.equal(convert(loops)[3][1].label, '');
console.log('PASS: LR, cycles, self-connections, parallel edges, and default labels.');
const quoted = structuredClone(data);
quoted.spec.nodes[0].label = 'Text "quoted"\n<script>alert(1)</script>';
quoted.spec.edges[0].label = '$bad = HtmlView("x")';
assert.deepEqual(convert(quoted)[2], quoted.spec.nodes);
assert.deepEqual(convert(quoted)[3], quoted.spec.edges);
console.log('PASS: markup, quotes, and newlines remain quoted text.');
const padded = structuredClone(data);
padded.spec.title = ' Answer workflow ';
padded.spec.nodes[0].id = ' search ';
padded.spec.edges[0].source = ' search ';
padded.spec.edges[0].label = ' Evidence found ';
assert.deepEqual(convert(padded), convert(data));
console.log('PASS: normalization matches backend.');

for (const [name, mutate] of [
    ['duplicate IDs', p => { p.spec.nodes[1].id = 'search'; }],
    ['duplicates after trim', p => { p.spec.nodes[1].id = ' search '; }],
    ['unknown source', p => { p.spec.edges[0].source = 'missing'; }],
    ['unknown target', p => { p.spec.edges[0].target = 'missing'; }],
    ['blank node ID', p => { p.spec.nodes[0].id = ' '; }],
    ['blank node label', p => { p.spec.nodes[0].label = ' '; }],
    ['blank edge source', p => { p.spec.edges[0].source = ' '; }],
    ['blank title', p => { p.spec.title = ' '; }],
    ['empty nodes', p => { p.spec.nodes = []; }],
    ['31 nodes', p => { p.spec.nodes = Array.from({ length: 31 }, (_, i) => ({ id: String(i), label: String(i) })); p.spec.edges = []; }],
    ['61 edges', p => { p.spec.edges = Array(61).fill(p.spec.edges[0]); }],
    ['unsupported direction', p => { p.spec.direction = 'UP'; }],
    ['non-string label', p => { p.spec.edges[0].label = 123; }],
    ['extra node field', p => { p.spec.nodes[0].html = '<b>'; }],
    ['extra edge field', p => { p.spec.edges[0].style = 'x'; }],
    ['extra specification field', p => { p.spec.extra = true; }],
    ['missing edges', p => { delete p.spec.edges; }],
]) {
    const payload = structuredClone(data); mutate(payload);
    assert.throws(() => savedVisualToOptions(payload));
    console.log(`PASS: rejected ${name}.`);
}
