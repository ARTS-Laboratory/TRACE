import importlib.util
from pathlib import Path
from unittest.mock import patch

path = Path(__file__).resolve().parents[1] / 'docker/gateway/gateway.py'
spec = importlib.util.spec_from_file_location('gateway', path)
g = importlib.util.module_from_spec(spec)
with patch.dict('os.environ', {'COMPOSE_PROJECT': 'glorp-cat'}):
    spec.loader.exec_module(g)

def test_allowlist():
    try:
        g.resolve('inference')
    except ValueError:
        pass
    else:
        raise AssertionError('inference must not be manageable')

def test_label_resolution():
    result = [{'Id':'abc', 'State':'exited', 'Labels': {
        'com.docker.compose.project':'glorp-cat',
        'com.docker.compose.service':'media'}}]
    with patch.object(g, 'docker', return_value=result) as mocked:
        assert g.resolve('media') == ('abc', 'exited')
        assert 'com.docker.compose.project' in mocked.call_args.args[1]

def test_reject_mismatched_labels():
    result = [{'Id':'abc', 'State':'exited', 'Labels': {
        'com.docker.compose.project':'other',
        'com.docker.compose.service':'media'}}]
    with patch.object(g, 'docker', return_value=result):
        try:
            g.resolve('media')
        except RuntimeError:
            pass
        else:
            raise AssertionError('wrong project must be rejected')

def test_start_only_existing_allowed_container():
    with patch.object(g, 'resolve', return_value=('abc', 'exited')) as resolve, patch.object(g, 'docker') as docker:
        g.action('media', 'start')
        resolve.assert_called_once_with('media')
        docker.assert_called_once_with('POST', '/containers/abc/start')
