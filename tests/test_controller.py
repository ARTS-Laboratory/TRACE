import importlib.util
import os
os.environ.setdefault("PROJECT_DIR", "/tmp/test-project")
import threading
import time
from pathlib import Path

p = Path(__file__).resolve().parents[1] / 'docker/controller/controller.py'
spec = importlib.util.spec_from_file_location('controller', p)
c = importlib.util.module_from_spec(spec)
spec.loader.exec_module(c)

def test_lease_and_release():
    calls = []
    c.healthy = lambda url: False if not calls else True
    c.compose = lambda *args, **kwargs: calls.append(args)
    lease = c.ensure_running('media')
    assert len(calls) == 1
    assert c.touch('media', lease)
    assert c.release('media', lease)
    assert c.STATE['media']['idle_since'] is not None
    assert not c.release('media', lease)

def test_concurrent_single_start():
    calls = []
    c.healthy = lambda url: bool(calls)
    c.compose = lambda *args, **kwargs: calls.append(args)
    ids = []
    threads = [threading.Thread(target=lambda: ids.append(c.ensure_running('parsing'))) for _ in range(4)]
    for t in threads: t.start()
    for t in threads: t.join()
    assert len(calls) == 1
    assert len(set(ids)) == 4
    for lease in ids: c.release('parsing', lease)

if __name__ == '__main__':
    test_lease_and_release()
    test_concurrent_single_start()
    print('controller tests passed')
