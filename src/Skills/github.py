import asyncio
import base64
import binascii
import hashlib
import os
import re
import shutil
import string
import unicodedata
from pathlib import Path, PurePosixPath
from urllib.parse import quote, urlsplit

import requests

FORBIDDEN_PATTERN = r"[\\\x00-\x1f\x7f]"


def parse_github_repository_url(repository_url: str) -> tuple[str, str]:
    if type(repository_url) != str:
        raise ValueError("repository url must be string")

    url = repository_url.strip()

    if "%" in url or "\\" in url:
        raise ValueError("Repository URL contains an invalid path component.")
    if any(c.isspace() or unicodedata.category(c).startswith("C") for c in url):
        raise ValueError("Repository URL contains an invalid path component.")

    parsed_url = urlsplit(url=url)

    if parsed_url.scheme != "https":
        raise ValueError("repository url must have scheme 'https'")
    if parsed_url.netloc != "github.com":
        raise ValueError("repository url must be from github")
    if parsed_url.query != "":
        raise ValueError("repository url may not be query string")
    if parsed_url.fragment != "":
        raise ValueError("repository url may not contain fragments")

    parts = parsed_url.path.strip("/").split("/")
    if len(parts) != 2 or not all(parts):
        raise ValueError("URL must contain an owner and repository.")
    if any(part in (".", "..") for part in parts):
        raise ValueError("Repository URL contains an invalid path component.")

    owner, repository = parts

    return owner, repository


async def resolve_github_revision(repository_url: str) -> str:
    owner, repository = parse_github_repository_url(repository_url=repository_url)

    url = f"https://api.github.com/repos/{owner}/{repository}/commits"
    headers = github_request_headers()

    response = await asyncio.to_thread(
        requests.get,
        url=url,
        headers=headers,
        params={"per_page": 1},
        timeout=15,
    )
    response.raise_for_status()
    commits = response.json()

    if type(commits) is not list:
        raise ValueError("response is not a list")
    if len(commits) == 0:
        raise ValueError("There are 0 commits")
    if type(commits[0]) != dict:
        raise ValueError("First entry of commit must be dictionary type")

    sha = commits[0].get("sha")

    if type(sha) is not str:
        raise ValueError("sha must be a string")
    if len(sha) != 40:
        raise ValueError("invalid sha, must be 40 characters")
    if not all(c in string.hexdigits for c in sha):
        raise ValueError("only '0123456789abcdefABCDEF' characters allowed")

    return sha.lower()


async def list_github_skill_files(
    repository_url: str,
    revision: str,
) -> list[str]:

    if type(revision) is not str:
        raise ValueError("revision must be a string")
    if len(revision) != 40:
        raise ValueError("invalid revision, must be 40 characters")
    if not all(c in string.hexdigits for c in revision):
        raise ValueError("only '0123456789abcdefABCDEF' characters allowed")

    revision = revision.lower()

    owner, repository = parse_github_repository_url(repository_url=repository_url)

    url = f"https://api.github.com/repos/{owner}/{repository}/git/trees/{revision}"
    headers = github_request_headers()

    response = await asyncio.to_thread(
        requests.get,
        url=url,
        headers=headers,
        params={"recursive": 1},
        timeout=15,
    )

    response.raise_for_status()
    data = response.json()

    if type(data) is not dict:
        raise ValueError("response is not a dict")
    if data.get("truncated") is not False:
        raise ValueError("GitHub tree listing is incomplete or invalid.")

    entries = data.get("tree")

    if type(entries) is not list:
        raise ValueError("entries must be a list")

    skill_files = []
    for entry in entries:
        if type(entry) is not dict:
            raise ValueError("entry must be a dictionary")
        if entry.get("type") != "blob":
            continue
        if entry.get("mode") not in ["100644", "100755"]:
            continue

        path = entry.get("path")

        if type(path) is not str:
            raise ValueError("path must be a string")
        if path == "":
            raise ValueError("path cannot be empty")
        if bool(re.search(FORBIDDEN_PATTERN, path)):
            raise ValueError("path contains an invalid path component.")
        if any(unicodedata.category(c).startswith("C") for c in path):
            raise ValueError("Path contains an invalid character.")

        components = path.split("/")

        if not all(components):
            raise ValueError("Path contains an empty component.")
        if components[-1] != "SKILL.md":
            continue
        if any(part in (".", "..") for part in components):
            raise ValueError("Repository URL contains an invalid path component.")

        skill_files.append(path)

    return sorted(set(skill_files))


async def read_github_skill_file(
    repository_url: str,
    revision: str,
    skill_file_path: str,
) -> str:
    if type(skill_file_path) is not str:
        raise ValueError("skill file path must be a string")

    skills = await list_github_skill_files(
        repository_url=repository_url,
        revision=revision,
    )

    if skill_file_path not in skills:
        raise ValueError("Skill file was not found at the supplied revision.")

    owner, repository = parse_github_repository_url(repository_url=repository_url)
    revision = revision.lower()
    encoded_path = quote(skill_file_path, safe="/")

    url = f"https://api.github.com/repos/{owner}/{repository}/contents/{encoded_path}"
    headers = github_request_headers()

    response = await asyncio.to_thread(
        requests.get,
        url=url,
        headers=headers,
        params={"ref": revision},
        timeout=15,
    )

    response.raise_for_status()
    data = response.json()

    if type(data) is not dict:
        raise ValueError("response is not a dict")
    if data.get("type") != "file":
        raise ValueError("data type must be file")
    if data.get("path") != skill_file_path:
        raise ValueError("data path must equal skill file path")
    if data.get("encoding") != "base64":
        raise ValueError("encoding must be base64")
    if type(data.get("content")) is not str:
        raise ValueError("content must be a string")

    content = data["content"].replace("\n", "")
    try:
        decoded_content = base64.b64decode(s=content, validate=True)

        return decoded_content.decode("utf-8")

    except binascii.Error as error:
        raise ValueError("Skill content is not valid Base64.") from error
    except UnicodeDecodeError as error:
        raise ValueError("Skill content is not valid UTF-8.") from error


async def list_github_skill_package_files(
    repository_url: str,
    revision: str,
    skill_file_path: str,
) -> list[dict]:
    if type(skill_file_path) is not str:
        raise ValueError("skill file path must be a string")

    skill_files = await list_github_skill_files(
        repository_url=repository_url, revision=revision
    )

    if skill_file_path not in skill_files:
        raise ValueError(f"{skill_file_path} not in skill files")

    package_directory = PurePosixPath(skill_file_path).parent
    # list_github_skill_files() has already validated the revision.
    revision = revision.lower()
    owner, repository = parse_github_repository_url(repository_url=repository_url)

    url = f"https://api.github.com/repos/{owner}/{repository}/git/trees/{revision}"
    headers = github_request_headers()

    response = await asyncio.to_thread(
        requests.get,
        url=url,
        headers=headers,
        params={"recursive": 1},
        timeout=15,
    )
    response.raise_for_status()
    data = response.json()

    if type(data) is not dict:
        raise ValueError("GitHub tree response must be a dictionary.")
    if data.get("truncated") is not False:
        raise ValueError("GitHub tree listing is incomplete or invalid.")

    entries = data.get("tree")

    if type(entries) is not list:
        raise ValueError("GitHub tree entries must be a list.")

    skill_files = []

    for entry in entries:
        if type(entry) is not dict:
            raise ValueError("Entry must be a dictionary.")

        path = entry.get("path")

        if type(path) is not str:
            raise ValueError("Path must be a string.")
        if not path:
            raise ValueError("Path cannot be empty.")
        if re.search(FORBIDDEN_PATTERN, path):
            raise ValueError("Path contains an invalid character.")
        if any(unicodedata.category(c).startswith("C") for c in path):
            raise ValueError("Path contains an invalid character.")

        components = path.split("/")

        if any(part in ("", ".", "..") for part in components):
            raise ValueError("Path contains an invalid path component.")

        entry_path = PurePosixPath(path)

        if not entry_path.is_relative_to(package_directory):
            continue

        entry_type = entry.get("type")
        mode = entry.get("mode")
        sha = entry.get("sha")
        size = entry.get("size")

        if entry_type == "tree" and mode == "040000":
            continue
        if entry_type != "blob" or mode not in ("100644", "100755"):
            raise ValueError(f"Package contains an unsupported entry: {path}")
        if type(sha) is not str:
            raise ValueError("sha must be a string")
        if len(sha) != 40:
            raise ValueError("invalid sha, must be 40 characters")
        if not all(c in string.hexdigits for c in sha):
            raise ValueError("only '0123456789abcdefABCDEF' characters allowed")
        if type(size) is not int:
            raise ValueError("size must be an integer")
        if size < 0:
            raise ValueError("size must be zero or greater")

        skill_files.append(
            {
                "path": path,
                "relative_path": entry_path.relative_to(package_directory).as_posix(),
                "sha": sha.lower(),
                "size": size,
                "mode": mode,
            }
        )

    return sorted(skill_files, key=lambda file: file["relative_path"])


async def read_github_blob(
    repository_url: str,
    sha: str,
    expected_size: int,
) -> bytes:
    if type(repository_url) is not str:
        raise ValueError("repository URL must be a string")
    if type(sha) is not str:
        raise ValueError("sha must be a string")
    if len(sha) != 40:
        raise ValueError("invalid sha, must be 40 characters")
    if not all(c in string.hexdigits for c in sha):
        raise ValueError("only '0123456789abcdefABCDEF' characters allowed")
    if type(expected_size) is not int:
        raise ValueError("expected size must be an integer")
    if expected_size < 0:
        raise ValueError("expected size must be zero or greater")

    sha = sha.lower()
    owner, repository = parse_github_repository_url(repository_url=repository_url)
    url = f"https://api.github.com/repos/{owner}/{repository}/git/blobs/{sha}"
    headers = github_request_headers()

    response = await asyncio.to_thread(
        requests.get,
        url=url,
        headers=headers,
        timeout=15,
    )

    response.raise_for_status()
    data = response.json()

    if type(data) is not dict:
        raise ValueError("response data must be a dictionary")

    data_sha = data.get("sha")
    data_size = data.get("size")
    data_encoding = data.get("encoding")
    data_content = data.get("content")

    if data_sha != sha:
        raise ValueError("sha address does not match")
    if type(data_size) is not int:
        raise ValueError("data size is not an integer")
    if data_size != expected_size:
        raise ValueError("data size does not match expected size")
    if data_encoding != "base64":
        raise ValueError("encoding is not base64")
    if type(data_content) is not str:
        raise ValueError("data content must be a string")

    content = data["content"].replace("\n", "")
    try:
        decoded_content = base64.b64decode(s=content, validate=True)

        if len(decoded_content) != expected_size:
            raise ValueError("decoded content does not match expected size")

    except binascii.Error as error:
        raise ValueError("Skill content is not valid Base64.") from error

    binary_data = (
        b"blob " + str(len(decoded_content)).encode("ascii") + b"\0" + decoded_content
    )
    hash_sha = hashlib.sha1(data=binary_data)

    hash_sha = hash_sha.hexdigest()

    if hash_sha != sha:
        raise ValueError("hash digest does not match requested sha")

    return decoded_content


async def download_github_skill_package(
    repository_url: str,
    revision: str,
    skill_file_path: str,
    destination: Path,
) -> None:

    skill_files = await list_github_skill_package_files(
        repository_url=repository_url,
        revision=revision,
        skill_file_path=skill_file_path,
    )

    destination.mkdir(parents=True, exist_ok=False)

    try:
        for file in skill_files:
            local_path = destination / file["relative_path"]

            decoded_content = await read_github_blob(
                repository_url=repository_url,
                sha=file["sha"],
                expected_size=file["size"],
            )

            local_path.parent.mkdir(parents=True, exist_ok=True)
            local_path.write_bytes(decoded_content)
            local_path.chmod(0o755 if file["mode"] == "100755" else 0o644)

    except (Exception, asyncio.CancelledError):
        shutil.rmtree(destination)
        raise


def github_request_headers() -> dict[str, str]:
    headers = {"Accept": "application/vnd.github+json"}
    github_token = os.getenv("GITHUB_TOKEN", "").strip()

    if github_token:
        headers["Authorization"] = f"Bearer {github_token}"

    return headers
