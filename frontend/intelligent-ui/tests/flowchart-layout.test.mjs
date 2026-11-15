import assert from 'node:assert/strict';
import { layoutFlowchart, wrapFlowText } from '../src/flowchart-layout.ts';

const nodes = [{ id: '__proto__', label: 'Start' }, { id: 'finish', label: 'Finish' }];
const edge = { source: '__proto__', target: 'finish', label: 'Continue' };
function verify(result, nodeCount, edgeCount) {
    assert.ok(Number.isFinite(result.width) && result.width > 0);
    assert.ok(Number.isFinite(result.height) && result.height > 0);
    assert.equal(result.nodes.length, nodeCount);
    assert.equal(result.edges.length, edgeCount);
    for (const node of result.nodes) {
        for (const key of ['x', 'y', 'width', 'height']) assert.ok(Number.isFinite(node[key]));
    }
    for (const connection of result.edges) {
        assert.ok(connection.points.length >= 2);
        for (const point of connection.points) {
            assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y));
        }
        if (connection.label) assert.ok(Number.isFinite(connection.x) && Number.isFinite(connection.y));
    }
}
for (const direction of ['TD', 'LR']) {
    const result = layoutFlowchart(direction, nodes, [edge]);
    verify(result, 2, 1);
    const [start, finish] = result.nodes;
    assert.ok(direction === 'TD' ? finish.y > start.y : finish.x > start.x);
    console.log(`PASS: ${direction} layout direction and finite coordinates.`);
}
verify(layoutFlowchart('TD', nodes.slice(0, 1), []), 1, 0);
console.log('PASS: single-node layout.');
const edges = [edge, { ...edge, label: 'Second connection' }, { source: 'finish', target: '__proto__', label: 'Retry' }, { source: 'finish', target: 'finish', label: '' }];
const before = JSON.stringify({ nodes, edges });
verify(layoutFlowchart('TD', nodes, edges), 2, 4);
assert.equal(JSON.stringify({ nodes, edges }), before);
console.log('PASS: cycles, parallel edges, self-connections, and input immutability.');
const branchNodes = [...nodes, { id: 'other', label: 'Other path' }, { id: 'isolated', label: 'Disconnected' }];
verify(layoutFlowchart('TD', branchNodes, [edge, { source: '__proto__', target: 'other', label: 'Alternative' }]), 4, 2);
console.log('PASS: branches and disconnected nodes.');
assert.deepEqual(wrapFlowText('abc\ndef'), ['abc', 'def']);
assert.equal(wrapFlowText('a'.repeat(60)).join(''), 'a'.repeat(60));
assert.equal(wrapFlowText('😀'.repeat(30)).join(''), '😀'.repeat(30));
console.log('PASS: multiline and Unicode-safe label wrapping.');
