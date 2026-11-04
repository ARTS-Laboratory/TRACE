"""Internal-only lifecycle coordinator for optional Compose services.

Docker socket access is powerful: isolate this container and do not publish its port.
"""

import json
import logging
import os
import threading
import time
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import URLError
from urllib.request import urlopen

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
LOG = logging.getLogger("service-controller")
IDLE_SECONDS = int(os.getenv("IDLE_SECONDS", "300"))
LEASE_SECONDS = int(os.getenv("LEASE_SECONDS", "90"))
GATEWAY_URL = os.getenv("GATEWAY_URL", "http://gateway:8091")
GROUPS = {
    "media": {
        "target": "media",
        "services": ("media",),
        "url": "http://media:8082/health",
        "startup": 300,
    },
    "parsing": {
        "target": "marker",
        "services": ("marker", "surya"),
        "url": "http://marker:8002/health",
        "startup": 600,
    },
}
STATE = {
    key: {"lock": threading.RLock(), "leases": {}, "idle_since": None, "managed": False}
    for key in GROUPS
}


def gateway(service, operation):
    import json as _json
    from urllib.request import Request

    if service not in ("media", "marker", "surya") or operation not in (
        "start",
        "stop",
    ):
        raise ValueError("invalid gateway operation")
    req = Request(f"{GATEWAY_URL}/{operation}/{service}", data=b"", method="POST")
    with urlopen(req, timeout=60) as response:
        if response.status != 200:
            raise RuntimeError(f"Gateway returned {response.status}")
        return _json.loads(response.read())


def healthy(url):
    try:
        with urlopen(url, timeout=3) as response:
            return response.status == 200
    except (URLError, TimeoutError, OSError):
        return False


def ensure_running(group):
    spec = GROUPS[group]
    state = STATE[group]
    with state["lock"]:
        if not healthy(spec["url"]):
            LOG.info("Starting %s", group)

            if group == "parsing":
                gateway("surya", "start")
                surya_deadline = time.monotonic() + spec["startup"]
                while not healthy("http://surya:8000/health"):
                    if time.monotonic() >= surya_deadline:
                        raise TimeoutError("surya did not become healthy")
                    time.sleep(2)
                gateway("marker", "start")
            else:
                gateway("media", "start")
            deadline = time.monotonic() + spec["startup"]
            while time.monotonic() < deadline:
                if healthy(spec["url"]):
                    break
                time.sleep(2)
            else:
                raise TimeoutError(f"{group} did not become healthy")
        lease = uuid.uuid4().hex
        state["leases"][lease] = time.monotonic() + LEASE_SECONDS
        state["idle_since"] = None
        state["managed"] = True
        return lease


def touch(group, lease):
    state = STATE[group]
    with state["lock"]:
        if lease not in state["leases"]:
            return False
        state["leases"][lease] = time.monotonic() + LEASE_SECONDS
        return True


def release(group, lease):
    state = STATE[group]
    with state["lock"]:
        if lease not in state["leases"]:
            return False
        del state["leases"][lease]
        if not state["leases"]:
            state["idle_since"] = time.monotonic()
        return True


def recover_running_services():
    """Adopt already healthy optional services after controller restart."""
    now = time.monotonic()
    for group, spec in GROUPS.items():
        state = STATE[group]
        with state["lock"]:
            if healthy(spec["url"]):
                state["managed"] = True
                state["idle_since"] = now
                LOG.info(
                    "Recovered running %s; waiting for leases or idle timeout", group
                )


def reap_once(now=None):
    now = time.monotonic() if now is None else now
    for group, state in STATE.items():
        with state["lock"]:
            for lease, expiry in list(state["leases"].items()):
                if expiry <= now:
                    LOG.warning("Expired stale lease for %s", group)
                    del state["leases"][lease]
            if state["leases"] or not state["managed"]:
                continue
            if state["idle_since"] is None:
                state["idle_since"] = now
            if now - state["idle_since"] < IDLE_SECONDS:
                continue
            try:
                LOG.info("Stopping idle %s", group)

                if group == "parsing":
                    gateway("marker", "stop")
                    gateway("surya", "stop")
                else:
                    gateway("media", "stop")
                state["managed"] = False
                state["idle_since"] = None
            except Exception:
                LOG.exception("Failed to stop %s; will retry", group)


def reaper():
    while True:
        time.sleep(5)
        reap_once()


class Handler(BaseHTTPRequestHandler):
    def respond(self, status, data):
        raw = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self):
        if self.path == "/health":
            self.respond(200, {"status": "ok"})
        else:
            self.respond(404, {"error": "not found"})

    def log_request(self, code="-", size="-"):
        if self.path == "/health" and str(code) == "200":
            return

        super().log_request(code, size)

    def do_POST(self):
        if self.path not in ("/acquire", "/heartbeat", "/release"):
            return self.respond(404, {"error": "not found"})
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 2048 or length <= 0:
                return self.respond(400, {"error": "invalid request size"})
            body = json.loads(self.rfile.read(length))
            group = body.get("group")
            if group not in GROUPS:
                return self.respond(400, {"error": "unknown group"})
            if self.path == "/acquire":
                return self.respond(200, {"lease": ensure_running(group)})
            lease = body.get("lease", "")
            success = (
                touch(group, lease)
                if self.path == "/heartbeat"
                else release(group, lease)
            )
            return self.respond(200 if success else 404, {"ok": success})
        except Exception as exc:
            LOG.exception("Request failed")
            self.respond(503, {"error": str(exc)[:200]})


if __name__ == "__main__":
    recover_running_services()
    threading.Thread(target=reaper, daemon=True).start()
    ThreadingHTTPServer(("0.0.0.0", 8090), Handler).serve_forever()
