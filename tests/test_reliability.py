import importlib.util
import os
from pathlib import Path
from unittest.mock import patch

os.environ.setdefault('PROJECT_DIR', '/tmp/test-project')
ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('controller_reliability', ROOT / 'docker/controller/controller.py')
c = importlib.util.module_from_spec(spec)
spec.loader.exec_module(c)


def reset():
    for state in c.STATE.values():
        state['leases'].clear()
        state['managed'] = False
        state['idle_since'] = None


def test_active_lease_survives_idle_window():
    reset()
    with patch.object(c, 'healthy', return_value=True), patch.object(c, 'compose') as compose:
        with patch.object(c.time, 'monotonic', return_value=100):
            lease = c.ensure_running('media')
        with patch.object(c.time, 'monotonic', return_value=350):
            assert c.touch('media', lease)
        c.reap_once(400)
        compose.assert_not_called()
        assert c.STATE['media']['leases']
        assert c.release('media', lease)
        c.reap_once(c.STATE['media']['idle_since'] + 301)
        compose.assert_called_once()


def test_stale_lease_expires_then_idle_shutdown():
    reset()
    with patch.object(c, 'healthy', return_value=True), patch.object(c, 'compose') as compose:
        with patch.object(c.time, 'monotonic', return_value=100):
            c.ensure_running('media')
        c.reap_once(191)
        assert not c.STATE['media']['leases']
        assert c.STATE['media']['idle_since'] == 191
        c.reap_once(490)
        compose.assert_not_called()
        c.reap_once(492)
        compose.assert_called_once()


def test_restart_adopts_healthy_service():
    reset()
    def healthy(url):
        return 'media:' in url
    with patch.object(c, 'healthy', side_effect=healthy), patch.object(c.time, 'monotonic', return_value=100):
        c.recover_running_services()
    assert c.STATE['media']['managed']
    assert c.STATE['media']['idle_since'] == 100
    assert not c.STATE['parsing']['managed']


def test_unknown_heartbeat_reacquires():
    import sys
    sys.path.insert(0, str(ROOT / 'system_development'))
    from Functions.Services import lifecycle
    class FakeResponse:
        status_code = 404
        def raise_for_status(self):
            raise AssertionError('404 heartbeat should be handled as lease loss')
        def json(self):
            return {'ok': False}
    class FakeClient:
        def __init__(self, **kwargs): pass
        def __enter__(self): return self
        def __exit__(self, *args): pass
        def post(self, *args, **kwargs): return FakeResponse()
    with patch.object(lifecycle.httpx, 'Client', FakeClient):
        assert lifecycle.request('heartbeat', 'media', 'lost') == {'ok': False}


if __name__ == '__main__':
    for name, fn in list(globals().items()):
        if name.startswith('test_') and callable(fn):
            fn()
            print('PASS', name)
