"""Internal allowlisted Docker lifecycle gateway; do not publish this service."""

import http.client
import json
import logging
import os
import socket
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlencode

logging.basicConfig(level=logging.INFO)
LOG = logging.getLogger("docker-gateway")
PROJECT = os.environ["COMPOSE_PROJECT"]
ALLOWED = frozenset(("media", "surya", "marker"))
SOCKET = "/var/run/docker.sock"


class UnixConnection(http.client.HTTPConnection):
    def __init__(self):
        super().__init__("docker", timeout=15)

    def connect(self):
        self.sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.sock.settimeout(self.timeout)
        self.sock.connect(SOCKET)


def docker(method, path):
    conn = UnixConnection()
    try:
        conn.request(method, path, headers={"Host": "docker"})
        resp = conn.getresponse()
        data = resp.read()
        if resp.status >= 400:
            raise RuntimeError(f"Docker API returned {resp.status}: {data[:200]!r}")
        return json.loads(data) if data else None
    finally:
        conn.close()


def resolve(service):
    if service not in ALLOWED:
        raise ValueError("service not allowed")
    filters = json.dumps(
        {
            "label": [
                f"com.docker.compose.project={PROJECT}",
                f"com.docker.compose.service={service}",
            ]
        }
    )
    containers = docker(
        "GET", "/containers/json?" + urlencode({"all": "1", "filters": filters})
    )
    if len(containers) != 1:
        raise RuntimeError(
            f"Expected one pre-created {service} container, found {len(containers)}"
        )
    c = containers[0]
    labels = c.get("Labels", {})
    if (
        labels.get("com.docker.compose.project") != PROJECT
        or labels.get("com.docker.compose.service") != service
    ):
        raise RuntimeError("Container labels do not match allowlist")
    return c["Id"], c["State"]


def action(service, verb):
    cid, state = resolve(service)
    if verb == "status":
        return {"service": service, "state": state}
    if verb == "start":
        if state != "running":
            docker("POST", f"/containers/{cid}/start")
    elif verb == "stop":
        if state == "running":
            docker("POST", f"/containers/{cid}/stop?t=30")
    else:
        raise ValueError("operation not allowed")
    return {"service": service, "ok": True}


class Handler(BaseHTTPRequestHandler):
    def respond(self, status, body):
        data = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path == "/health":
            return self.respond(200, {"status": "ok"})
        parts = self.path.strip("/").split("/")
        if len(parts) == 2 and parts[0] == "status" and parts[1] in ALLOWED:
            try:
                return self.respond(200, action(parts[1], "status"))
            except Exception as exc:
                LOG.exception("status failed")
                return self.respond(503, {"error": str(exc)[:200]})
        return self.respond(404, {"error": "not found"})

    def log_request(self, code="-", size="-"):
        if self.path == "/health" and str(code) == "200":
            return

        super().log_request(code, size)

    def do_POST(self):
        parts = self.path.strip("/").split("/")
        if (
            len(parts) != 2
            or parts[0] not in ("start", "stop")
            or parts[1] not in ALLOWED
        ):
            return self.respond(404, {"error": "not found"})
        if int(self.headers.get("Content-Length", "0")) != 0:
            return self.respond(400, {"error": "request body forbidden"})
        try:
            return self.respond(200, action(parts[1], parts[0]))
        except Exception as exc:
            LOG.exception("lifecycle request failed")
            return self.respond(503, {"error": str(exc)[:200]})


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 8091), Handler).serve_forever()
