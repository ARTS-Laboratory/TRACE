"""Acceptance check using the real configured Qwen tokenizer on the user's machine."""
import argparse
import json
from pathlib import Path
import sys

# Supports running from the extracted bundle, or from the repository's tests directory.
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'src'))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True, help='Original PDF, not parsed JSON')
    parser.add_argument('--json', type=Path, required=True, dest='json_path')
    parser.add_argument('--max-tokens', type=int, default=1024)
    parser.add_argument('--output', type=Path, help='Optional complete output JSON destination')
    parser.add_argument('--reviewed-corrections', type=Path, help='Optional hash-guarded document corrections JSON')
    args = parser.parse_args()
    from Functions.RAG.chunking import marker_chunking
    from Functions.RAG.chunking_helpers.marker_chunking import initialize_marker_chunking
    tools = initialize_marker_chunking(max_tokens=args.max_tokens)
    records = marker_chunking([
        {'status': 'success', 'file_path': args.source, 'json_path': args.json_path,
         'reviewed_corrections': json.loads(args.reviewed_corrections.read_text(encoding='utf-8')) if args.reviewed_corrections else None},
        {'status': 'failed'},
    ], chunking_objects=tools)
    assert len(records) == 1
    result = records[0]
    chunks = result['chunking_result']['chunks']
    assert chunks, 'No searchable text produced'
    assert len({c['chunk_id'] for c in chunks}) == len(chunks)
    for c in chunks:
        actual = len(tools['tokenizer'].encode(c['embedding_text'], add_special_tokens=True))
        assert actual == c['token_count'], 'Stored count differs from the real tokenizer'
        assert actual <= args.max_tokens, f'Token budget exceeded: {actual}'
    print(json.dumps({
        'file': args.source.name,
        'document_id': result['chunking_result']['document_id'],
        'chunks': len(chunks),
        'min_tokens': min(c['token_count'] for c in chunks),
        'max_tokens': max(c['token_count'] for c in chunks),
        'pictures': len(result['assets']['pictures']),
        'tables': len(result['assets']['tables']),
        'splitter': sorted({c['parser_metadata']['splitter'] for c in chunks}),
        'token_overflow': result['chunking_result']['token_overflow'],
        'heading_corrections': len(result['chunking_result']['quality_report']['heading_corrections']),
        'reviewed_corrections': len(result['chunking_result']['quality_report']['reviewed_corrections']),
    }, indent=2))
    if args.output:
        result['file_path'] = str(result['file_path'])
        result['json_path'] = str(result['json_path'])
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding='utf-8')
    print('PASS: Marker output, IDs, failed-entry skipping, and real-tokenizer budget checks.')


if __name__ == '__main__':
    main()
