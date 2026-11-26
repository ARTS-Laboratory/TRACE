import sys
from pathlib import Path

source_directory = Path.cwd().parent

if str(source_directory) not in sys.path:
    sys.path.insert(0, str(source_directory))

import yaml

SKILLS_DIRECTORY = Path(__file__).resolve().parent


def load_skill_instructions(
    skill_name: str,
    catalog: dict[str, dict[str, str | Path]],
) -> str:
    if skill_name not in catalog:
        raise ValueError(f"Skill '{skill_name}' does not exist in catalog.")

    skill = catalog[skill_name]

    with open(skill["path"], "r", encoding="utf-8") as file:
        return file.read()


def build_skill_catalog(
    skills_directory: Path,
) -> dict[str, dict[str, str | Path]]:
    catalog = {}

    for skill_md_file in sorted(skills_directory.glob("*/SKILL.md")):
        skill_metadata = read_skill_metadata(skill_file=skill_md_file)
        skill_name = skill_metadata["name"]

        if skill_name in catalog:
            raise ValueError(f"Duplicate skill name '{skill_name}' in {skill_md_file}")

        catalog[skill_name] = {
            "path": skill_md_file,
            "description": skill_metadata["description"],
        }

    return catalog


def format_skill_catalog(catalog: dict[str, dict[str, str | Path]]) -> str:
    skill_list = "Available skills: \n"

    if catalog == {}:
        return ""

    for skill, metadata in catalog.items():
        skill_list += f"- {skill}: {metadata['description']}\n"

    return skill_list


def read_skill_metadata(skill_file: Path) -> dict[str, str]:
    text = skill_file.read_text(encoding="utf-8")

    try:
        return parse_skill_metadata(text)
    except ValueError as error:
        raise ValueError(f"{skill_file}: {error}") from error


def build_conversation_skill_catalog(packages, storage_directory: Path):
    catalog = {}
    root = storage_directory.resolve()

    for package in packages:
        name = package["name"]
        relative_path = Path(package["package_path"])

        if name in catalog:
            raise ValueError(f"Duplicate skill {name} found in catalog")

        if relative_path.is_absolute():
            raise ValueError("Path cannot be absolute")

        package_directory = (root / relative_path).resolve()

        if package_directory == root:
            raise ValueError("Package directory cannot equal root directory")

        if not package_directory.is_relative_to(root):
            raise ValueError("Package directory must be relative to root")

        entry_point = package_directory / "SKILL.md"

        if entry_point.is_symlink() or not entry_point.is_file():
            raise ValueError(f"{entry_point}: expected a regular SKILL.md file.")

        catalog[name] = {
            "description": package["description"],
            "path": entry_point,
            "id": package["id"],
            "source": package["source"],
            "content_hash": package["content_hash"],
        }

    return catalog


def parse_skill_metadata(text: str) -> dict[str, str]:
    if not isinstance(text, str):
        raise ValueError("Skill text must be a string.")  # noqa: TRY004

    lines = text.splitlines()

    if not lines or lines[0] != "---":
        raise ValueError("missing opening YAML delimiter.")

    try:
        closing_index = lines.index("---", 1)
    except ValueError as error:
        raise ValueError("missing closing YAML delimiter.") from error

    yaml_block = "\n".join(lines[1:closing_index])

    try:
        metadata = yaml.safe_load(yaml_block)
    except yaml.YAMLError as error:
        raise ValueError("invalid YAML metadata.") from error

    if not isinstance(metadata, dict):
        raise ValueError("metadata must be a YAML mapping.")  # noqa: TRY004

    result = {}

    for field in ("name", "description"):
        value = metadata.get(field)

        if not isinstance(value, str) or not value.strip():
            raise ValueError(f"'{field}' must be a nonempty string.")

        result[field] = value

    return result


if __name__ == "__main__":
    catalog = build_skill_catalog(skills_directory=SKILLS_DIRECTORY)
    print(format_skill_catalog(catalog=catalog))
