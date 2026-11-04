"""Offline unit/integration tests; real Qwen-tokenizer acceptance is a separate run."""
import ast
import copy
import hashlib
import importlib.util
import json
import logging
from pathlib import Path
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
MODULE = ROOT / 'src/Functions/RAG/chunking_helpers/marker_chunking.py'
spec = importlib.util.spec_from_file_location('marker_chunking_impl', MODULE)
m = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = m
spec.loader.exec_module(m)


class ByteCounter:
    """Conservative test double, NOT a Qwen token benchmark."""
    def count_tokens(self, text):
        return len(text.encode('utf-8'))


def block(ref, kind='Text', html='', children=None, headings=None, images=None):
    return {'id': ref, 'block_type': kind, 'html': html, 'children': children or [],
            'section_hierarchy': headings or {}, 'images': images or {}}


def document(*children):
    return {'block_type': 'Document', 'children': [block('/page/0/Page/0', 'Page', children=list(children))]}


def run(doc, budget=200, **kwargs):
    return m.chunk_marker_document(doc, 'test-document', ByteCounter(), max_tokens=budget, model_id='test-byte-counter', **kwargs)


class MarkerTests(unittest.TestCase):
    def test_inline_html_and_entities(self):
        self.assertEqual(m.html_to_text('<p>A <b>bold</b> word &amp; <i>more</i>.</p>'), 'A bold word & more.')
        self.assertEqual(m.html_to_text('<p>Before<content-ref src="x"></content-ref> after</p>'), 'Before after')

    def test_traversal_page_and_duplicate_ids(self):
        d=document(block('/page/0/Text/1', html='<p>one</p>'))
        records=m.extract_marker_blocks(d)
        self.assertEqual(records[1]['page_numbers'],[1])
        d['children'][0]['children'].append(copy.deepcopy(d['children'][0]['children'][0]))
        with self.assertRaisesRegex(ValueError,'Duplicate'):m.extract_marker_blocks(d)

    def test_headings_resolved_without_cross_section_merge(self):
        h1='/page/0/SectionHeader/1';h2='/page/0/SectionHeader/3'
        d=document(block(h1,'SectionHeader','<h1>Alpha</h1>'),block('/page/0/Text/2',html='<p>First.</p>',headings={'1':h1}),
                   block(h2,'SectionHeader','<h1>Beta</h1>'),block('/page/0/Text/4',html='<p>Second.</p>',headings={'1':h2}))
        cs=run(d)['chunking_result']['chunks']
        self.assertEqual([c['embedding_text'] for c in cs],['Alpha\nFirst.','Beta\nSecond.'])

    def test_split_long_prose_without_loss(self):
        text=' '.join(f'word{i}' for i in range(100))
        cs=run(document(block('/page/0/Text/1',html=f'<p>{text}</p>')),budget=70)['chunking_result']['chunks']
        self.assertGreater(len(cs),1)
        self.assertEqual(' '.join(c['source_text'] for c in cs).split(),text.split())
        self.assertTrue(all(c['token_count']<=70 for c in cs))

    def test_table_headers_spans_and_assets(self):
        html='<table><thead><tr><th>Name</th><th>Value</th></tr></thead><tbody>'+''.join(f'<tr><td>row{i}</td><td>{i}</td></tr>' for i in range(20))+'</tbody></table>'
        d=document(block('/page/0/TableGroup/1','TableGroup',children=[block('/page/0/Caption/2','Caption','<p>Measurements</p>'),block('/page/0/Table/3','Table',html)]))
        result=run(d,budget=100); cs=[c for c in result['chunking_result']['chunks'] if 'Table' in c['metadata']['labels']]
        self.assertGreater(len(cs),1)
        self.assertTrue(all('| Name | Value |' in c['source_text'] for c in cs))
        for i in range(20):self.assertEqual(sum(f'| row{i} | {i} |' in c['source_text'] for c in cs),1)
        self.assertEqual(result['assets']['tables'][0]['caption_refs'],['/page/0/Caption/2'])
        self.assertEqual(result['chunking_result']['chunks'][0]['metadata']['asset_refs'],['/page/0/Table/3'])
        spans=m._table_data('<table><tr><th colspan="2">Both</th></tr><tr><td rowspan="2">X</td><td>Y</td></tr><tr><td>Z</td></tr></table>')
        self.assertEqual(spans['grid'],[['Both','Both'],['X','Y'],['X','Z']])

    def test_oversized_row_no_data_loss(self):
        text=' '.join(f'item{i}' for i in range(60))
        r=run(document(block('/page/0/Table/1','Table',f'<table><tr><th>H</th></tr><tr><td>{text}</td></tr></table>')),budget=90)
        self.assertTrue(all(c['token_count']<=90 for c in r['chunking_result']['chunks']))
        self.assertTrue(all(c['parser_metadata'].get('row_fragment') for c in r['chunking_result']['chunks']))
        combined=' '.join(c['source_text'].split('\n',2)[-1] for c in r['chunking_result']['chunks'])
        for i in range(60):self.assertIn(f'item{i}',combined)

    def test_missing_header_retains_first_row(self):
        cs=run(document(block('/page/0/Table/1','Table','<table><tr><td>A</td><td>B</td></tr></table>')))['chunking_result']['chunks']
        self.assertIn('| A | B |',cs[0]['source_text'])

    def test_assets_without_text_and_furniture_exclusion(self):
        r=run(document(block('/page/0/Picture/1','Picture',images={'x':'images/x.png'}),block('/page/0/PageFooter/2','PageFooter','<p>ignore</p>')))
        self.assertEqual(r['chunking_result']['chunk_count'],0)
        self.assertEqual(len(r['assets']['pictures']),1)

    def test_missing_heading_and_impossible_budget_fail(self):
        with self.assertRaisesRegex(ValueError,'Missing heading'):run(document(block('/page/0/Text/1',html='x',headings={'1':'missing'})))
        h='/page/0/SectionHeader/1'
        with self.assertRaisesRegex(ValueError,'budget'):run(document(block(h,'SectionHeader','A'*100),block('/page/0/Text/2',html='x',headings={'1':h})),budget=20)

    def test_stable_ids_and_no_document_mutation(self):
        d=document(block('/page/0/Text/1',html='<p>Hello</p>'));before=copy.deepcopy(d)
        self.assertEqual(run(d),run(d));self.assertEqual(d,before)

    def test_real_marker_export(self):
        path=Path(__file__).parent/'fixtures/marker_sample.json'
        if not path.exists():self.skipTest('Sample fixture not installed')
        d=m.load_marker_json(path);r=run(d,budget=1024)
        cs=r['chunking_result']['chunks']
        self.assertTrue(cs);self.assertEqual(len(r['assets']['pictures']),3)
        self.assertEqual(len(r['assets']['tables']),1)
        self.assertTrue(all(c['token_count']<=1024 for c in cs))
        self.assertEqual(len({c['chunk_id'] for c in cs}),len(cs))
        self.assertFalse(any('content-ref' in c['source_text'] for c in cs))
        self.assertFalse(any(set(c['metadata']['labels']) & m.FURNITURE for c in cs))
        # Every nonempty text leaf, caption and footnote is represented by a source ref.
        refs={r for c in cs for r in c['metadata']['source_refs']}
        for b in m.extract_marker_blocks(d):
            if b['block_type'] in {'Text','ListItem','Caption','Footnote'} and m.html_to_text(b['html']):self.assertIn(b['source_ref'],refs)
        print('\nReal sample (byte-counter test):',len(cs),'chunks; max',max(c['token_count'] for c in cs))

    def test_coordinator_two_documents_failed_entry_and_empty(self):
        # Execute the actual coordinator function, isolating the unavailable Docling imports.
        tree=ast.parse((ROOT/'src/Functions/RAG/chunking.py').read_text())
        funcs=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in {'generate_sha256_id','marker_chunking'}]
        ns={'Path':Path,'hashlib':hashlib,'logger':logging.getLogger('test'),
            'chunk_marker_document':m.chunk_marker_document,'load_marker_json':m.load_marker_json}
        exec(compile(ast.Module(body=funcs,type_ignores=[]),'coordinator','exec'),ns)
        with tempfile.TemporaryDirectory() as td:
            p=Path(td);items=[]
            for i in range(2):
                source=p/f'{i}.pdf';source.write_bytes(f'original{i}'.encode())
                target=p/f'{i}.json';target.write_text(json.dumps(document(block('/page/0/Text/1',html=f'Doc {i}'))))
                items.append({'status':'success','file_path':source,'json_path':target})
            items.append({'status':'failed'})
            out=ns['marker_chunking'](items,chunking_objects={'tokenizer':ByteCounter(),'max_tokens':100,'model_id':'test'})
            self.assertEqual(len(out),2)
            self.assertNotEqual(out[0]['chunking_result']['document_id'],out[1]['chunking_result']['document_id'])
            self.assertEqual(ns['marker_chunking']([{'status':'failed'}]),[])


if __name__=='__main__':unittest.main(verbosity=2)
