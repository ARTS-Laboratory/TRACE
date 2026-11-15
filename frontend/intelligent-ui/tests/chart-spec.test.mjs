import assert from 'node:assert/strict';
import { savedVisualToOptions } from '../src/saved-spec.ts';

const chart = {
    id: 9,
    schema_version: 1,
    spec: {
        type: 'chart', chart_type: 'bar', title: 'Monthly example',
        labels: ['January', 'February', 'March'],
        series: [
            { name: 'Requests', values: [100, 150.5, 120] },
            { name: 'Change', values: [-5, 0, 10] },
        ],
    },
};
const before = JSON.stringify(chart);
for (const type of ['bar', 'line']) {
    const data = structuredClone(chart); data.spec.chart_type = type;
    const result = savedVisualToOptions(data);
    assert.equal(result.kind, 'chart');
    const args = JSON.parse(`[${result.response.slice('root = DataChart('.length, -1)}]`);
    assert.deepEqual(args, [data.spec.title, type, data.spec.labels, data.spec.series]);
    console.log(`PASS: ${type} chart conversion, including decimals, negatives and zero.`);
}
assert.equal(JSON.stringify(chart), before);

const escaped = structuredClone(chart);
escaped.spec.labels[0] = 'January "quoted"\n$bad = HtmlView("x")';
escaped.spec.series[0].name = 'Name "quoted"';
const converted = savedVisualToOptions(escaped);
const args = JSON.parse(`[${converted.response.slice('root = DataChart('.length, -1)}]`);
assert.deepEqual(args[2], escaped.spec.labels);
assert.deepEqual(args[3], escaped.spec.series);
console.log('PASS: labels and series names roundtrip as quoted text.');

for (const [name, mutate] of [
    ['short series', p => { p.spec.series[0].values = [1, 2]; }],
    ['long series', p => { p.spec.series[0].values = [1, 2, 3, 4]; }],
    ['NaN', p => { p.spec.series[0].values[0] = NaN; }],
    ['infinity', p => { p.spec.series[0].values[0] = Infinity; }],
    ['numeric string', p => { p.spec.series[0].values[0] = '100'; }],
    ['boolean value', p => { p.spec.series[0].values[0] = true; }],
    ['blank label', p => { p.spec.labels[0] = '   '; }],
    ['blank series name', p => { p.spec.series[0].name = '   '; }],
    ['empty labels', p => { p.spec.labels = []; }],
    ['101 labels', p => { p.spec.labels = Array(101).fill('A'); p.spec.series = [{ name: 'X', values: Array(101).fill(1) }]; }],
    ['empty series', p => { p.spec.series = []; }],
    ['7 series', p => { p.spec.series = Array.from({ length: 7 }, () => ({ name: 'X', values: [1, 2, 3] })); }],
    ['unsupported chart type', p => { p.spec.chart_type = 'pie'; }],
    ['extra series field', p => { p.spec.series[0].html = '<b>'; }],
]) {
    const payload = structuredClone(chart); mutate(payload);
    assert.throws(() => savedVisualToOptions(payload));
    console.log(`PASS: rejected ${name}.`);
}
