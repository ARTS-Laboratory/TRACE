"""Lease optional model services during active work.

The controller starts containers; clients renew leases until work finishes.
"""
import asyncio
from contextlib import asynccontextmanager, contextmanager
import logging
import os
import threading

import httpx

LOG = logging.getLogger(__name__)
URL = os.getenv('GLORPCAT_CONTROLLER_URL', 'http://controller:8090').rstrip('/')


def request(action, group, lease=None):
    payload = {'group': group}
    if lease is not None:
        payload['lease'] = lease
    with httpx.Client(timeout=httpx.Timeout(connect=5, read=660, write=10, pool=5)) as client:
        response = client.post(f'{URL}/{action}', json=payload)
        # Unknown heartbeat leases (404) are expected after a controller restart.
        if not (action == 'heartbeat' and response.status_code == 404):
            response.raise_for_status()
        return response.json()


@contextmanager
def service_lease(group):
    lease = request('acquire', group)['lease']
    finished = threading.Event()

    def renew():
        nonlocal lease
        while not finished.wait(20):
            try:
                response = request('heartbeat', group, lease)
                if not response.get('ok'):
                    lease = request('acquire', group)['lease']
            except Exception:
                LOG.exception('Could not renew %s service lease', group)

    thread = threading.Thread(target=renew, daemon=True)
    thread.start()
    try:
        yield
    finally:
        finished.set()
        thread.join(timeout=3)
        try:
            request('release', group, lease)
        except Exception:
            LOG.exception('Could not release %s service lease', group)


@asynccontextmanager
async def async_service_lease(group):
    lease = (await asyncio.to_thread(request, 'acquire', group))['lease']
    stop = asyncio.Event()

    async def renew():
        nonlocal lease
        while True:
            try:
                await asyncio.wait_for(stop.wait(), timeout=20)
                return
            except asyncio.TimeoutError:
                pass
            try:
                result = await asyncio.to_thread(request, 'heartbeat', group, lease)
                if not result.get('ok'):
                    lease = (await asyncio.to_thread(request, 'acquire', group))['lease']
            except Exception:
                LOG.exception('Could not renew %s service lease', group)

    task = asyncio.create_task(renew())
    try:
        yield
    finally:
        stop.set()
        await task
        try:
            await asyncio.to_thread(request, 'release', group, lease)
        except Exception:
            LOG.exception('Could not release %s service lease', group)
