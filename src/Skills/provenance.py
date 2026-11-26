import json


def collect_skill_context(model_messages: list[dict]) -> list[dict]:
    skill_context = {}
    for model_message in model_messages:
        if model_message.get("role") != "tool":
            continue
        if model_message.get("name") not in ["load_skill", "read_skill_reference"]:
            continue

        content = model_message.get("content")

        if not isinstance(content, str):
            continue

        try:
            result = json.loads(content)
        except json.JSONDecodeError:
            continue

        if not isinstance(result, dict) or "error" in result:
            continue
        package_id = result.get("skill_package_id")

        if type(package_id) is not int or package_id <= 0:
            continue

        if any(
            not isinstance(value, str) or not value.strip()
            for value in (
                result.get("skill_name"),
                result.get("source"),
                result.get("relative_path"),
                model_message.get("tool_call_id"),
            )
        ):
            continue

        content_hash = result.get("content_hash")

        if (
            not isinstance(content_hash, str)
            or len(content_hash) != 64
            or any(c not in "0123456789abcdefABCDEF" for c in content_hash)
        ):
            continue

        if (
            model_message.get("name") == "load_skill"
            and result.get("relative_path") != "SKILL.md"
        ):
            continue

        text_field = (
            "instructions" if model_message.get("name") == "load_skill" else "content"
        )

        if not isinstance(result.get(text_field), str):
            continue

        key = (
            package_id,
            content_hash.lower(),
            result["relative_path"],
        )

        skill_context[key] = {
            "skill_package_id": package_id,
            "skill_name": result["skill_name"],
            "source": result["source"],
            "content_hash": content_hash.lower(),
            "relative_path": result["relative_path"],
            "tool_call_id": model_message["tool_call_id"],
        }

    return list(skill_context.values())
