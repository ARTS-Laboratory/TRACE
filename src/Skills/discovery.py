import asyncio
import os
import re
import signal
import unicodedata
from urllib.parse import urlsplit


def parse_skill_search_output(output: str, limit: int = 10) -> list[dict]:
    if type(limit) is not int:
        raise ValueError("limit must be an integer")

    if limit < 1 or limit > 50:
        raise ValueError("limit must be between 1 and 50")

    output = re.sub(r"\x1b\[[0-9;]*m", "", output)
    results = []
    seen = set()

    for line in output.splitlines():
        position = line.find("https://skills.sh/")

        if position == -1:
            continue

        url = line[position:].strip()
        try:
            parsed_url = urlsplit(url=url)
        except ValueError:
            continue

        if parsed_url.scheme != "https":
            continue
        if parsed_url.netloc != "skills.sh":
            continue
        if parsed_url.query != "":
            continue
        if parsed_url.fragment != "":
            continue

        parts = parsed_url.path.strip("/").split("/")

        if len(parts) != 3:
            continue
        if not all(parts):
            continue

        owner, repository, skill_name = parts
        invalid_part = False
        for part in parts:
            if part in (".", ".."):
                invalid_part = True
                break
            if "%" in part or "\\" in part:
                invalid_part = True
                break
            if any(
                c.isspace() or unicodedata.category(c).startswith("C") for c in part
            ):
                invalid_part = True
                break

        if invalid_part:
            continue

        key = (owner, repository, skill_name)

        if key in seen:
            continue

        seen.add(key)

        results.append(
            {
                "repository_url": f"https://github.com/{owner}/{repository}",
                "skill_name": skill_name,
                "discovery_url": url,
            }
        )

        if len(results) >= limit:
            break

    return results


async def search_remote_skills(query: str, limit: int = 10) -> list[dict]:
    if type(query) != str:
        raise ValueError("Query must be a string.")
    if type(limit) is not int:
        raise ValueError("limit must be an integer")
    if limit < 1 or limit > 50:
        raise ValueError("limit must be between 1 and 50")

    query = query.strip()

    if query == "":
        return []
    if query.startswith("-"):
        raise ValueError("query cannot start with '-'")

    process = await asyncio.create_subprocess_exec(
        "npx",
        "--yes",
        "skills@1.9.0",
        "find",
        query,
        stdin=asyncio.subprocess.DEVNULL,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
        start_new_session=True,
    )

    try:
        stdout, stderr = await asyncio.wait_for(
            process.communicate(),
            timeout=30,
        )
    except (TimeoutError, asyncio.CancelledError) as error:
        try:
            os.killpg(process.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass

        await process.communicate()

        if isinstance(error, asyncio.CancelledError):
            raise

        raise RuntimeError("Remote skill search timed out.") from error

    if process.returncode != 0:
        raise RuntimeError("CLI search failed.")

    output = stdout.decode("utf-8", errors="replace")

    skill_result = parse_skill_search_output(output=output, limit=limit)

    return skill_result
