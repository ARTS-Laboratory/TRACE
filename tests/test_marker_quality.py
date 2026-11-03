import copy
import hashlib
import json
from pathlib import Path
import unittest
from test_marker_chunking import m, ByteCounter, block, document, run


class QualityTests(unittest.TestCase):
    def test_numbered_siblings_and_missing_parent(self):
        a='/page/0/SectionHeader/1';b='/page/0/SectionHeader/2';c='/page/0/SectionHeader/3'
        d=document(block(a,'SectionHeader','<h1>1 Introduction</h1>'),block(b,'SectionHeader','<h2>3 Pipeline</h2>',headings={'1':a,'2':b}),block(c,'SectionHeader','<h2>3.4 Extension</h2>',headings={'1':a,'2':c}),block('/page/0/Text/4',html='Body',headings={'1':a,'2':c}))
        r=run(d)
        self.assertEqual(r['chunking_result']['chunks'][0]['metadata']['headings'],['3 Pipeline','3.4 Extension'])
        self.assertTrue(r['chunking_result']['quality_report']['heading_corrections'])

    def test_unumbered_subhead_and_references_boundary(self):
        a='/page/0/SectionHeader/1';b='/page/0/SectionHeader/2';c='/page/0/SectionHeader/3';e='/page/0/SectionHeader/5'
        d=document(block(a,'SectionHeader','<h1>3 Pipeline</h1>'),block(b,'SectionHeader','<h4>3.2 Models</h4>'),block(c,'SectionHeader','<h4>OCR</h4>'),block('/page/0/Text/4',html='Details',headings={'1':a,'4':c}),block(e,'SectionHeader','<h2>References</h2>'),block('/page/0/Text/6',html='References body',headings={'1':a,'2':e}))
        cs=run(d)['chunking_result']['chunks']
        self.assertEqual(cs[0]['metadata']['headings'],['3 Pipeline','3.2 Models','OCR'])
        self.assertEqual(cs[1]['metadata']['headings'],['References'])

    def test_hash_guards(self):
        d=document(block('/page/0/Text/1',html='Original'))
        base={'document_id':'test-document','blocks':[{'source_ref':'/page/0/Text/1','expected_html_sha256':hashlib.sha256(b'Original').hexdigest(),'replacement_html':'Corrected','reason':'Test correction','evidence':'Test fixture'}]}
        with self.assertRaisesRegex(ValueError,'different source'):run(d,reviewed_corrections={**base,'document_id':'other'})
        with self.assertRaisesRegex(ValueError,'changed'):run(document(block('/page/0/Text/1',html='Changed')),reviewed_corrections=base)
        before=copy.deepcopy(d);r=run(d,reviewed_corrections=base)
        self.assertEqual(d,before)
        self.assertEqual(r['chunking_result']['chunks'][0]['source_text'],'Corrected')
        self.assertEqual(r['chunking_result']['quality_report']['reviewed_corrections'][0]['original_html'],'Original')
        self.assertIn('-review-',r['chunking_result']['chunks'][0]['chunk_id'])

    def test_quarantine_is_explicit_not_generic_deletion(self):
        html='write the first line of the response'
        d=document(block('/page/0/Caption/1','Caption',html))
        self.assertEqual(run(d)['chunking_result']['chunk_count'],1)
        override={'document_id':'test-document','blocks':[{'source_ref':'/page/0/Caption/1','expected_html_sha256':hashlib.sha256(html.encode()).hexdigest(),'exclude_from_index':True,'reason':'Reviewed sample','evidence':'Test fixture'}]}
        result=run(d,reviewed_corrections=override)['chunking_result']
        self.assertEqual(result['chunk_count'],0)
        self.assertEqual(result['quality_report']['reviewed_corrections'][0]['original_html'],html)

    def test_actual_sample_review(self):
        corrections=json.loads((Path(__file__).parent/'fixtures/marker_reviewed_corrections.json').read_text())
        raw=json.loads((Path(__file__).parent/'fixtures/marker_sample.json').read_text())
        r=m.chunk_marker_document(raw,corrections['document_id'],ByteCounter(),max_tokens=1024,reviewed_corrections=corrections)
        table=r['assets']['tables'][0]
        self.assertEqual(table['table_data']['num_cols'],8)
        self.assertEqual(table['table_data']['num_rows'],5)
        self.assertIn('original_html',table)
        self.assertEqual(len(r['chunking_result']['quality_report']['reviewed_corrections']),2)
        refs={ref for c in r['chunking_result']['chunks'] for ref in c['metadata']['source_refs']}
        self.assertNotIn('/page/7/Caption/0',refs)
        for c in r['chunking_result']['chunks']:
            self.assertLessEqual(c['token_count'],1024)
            headings=c['metadata']['headings']
            if '3 Processing pipeline' in headings:self.assertNotIn('1 Introduction',headings)
            if '3.4 Extensibility' in headings:self.assertEqual(headings,['3 Processing pipeline','3.4 Extensibility'])
            if 'References' in headings:self.assertEqual(headings,['References'])
        print('\nReviewed sample:',r['chunking_result']['chunk_count'],'byte-counted chunks; table 8 columns/4 data rows; 2 audited overrides.')


if __name__=='__main__':unittest.main(verbosity=2)
