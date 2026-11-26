import errno
import hashlib
import sqlite3
import sys
import tempfile
from pathlib import Path

source_directory = Path.cwd().parent

if str(source_directory) not in sys.path:
    sys.path.insert(0, str(source_directory))

import shutil
from tempfile import TemporaryDirectory

from Functions.Model.config import DATA_PATH
from Functions.Storage.database import Database
from Skills.catalog import read_skill_metadata
from Skills.github import download_github_skill_package

SKILL_STORAGE_DIRECTORY = DATA_PATH / "skills"
skill = Path("/home/thienan/Documents/GitHub/Glorp-Cat/src/Skills/skill-search")


def validate_skill_directory(skill_directory: Path) -> dict[str, str]:
    if skill_directory.is_symlink() or not skill_directory.is_dir():
        raise ValueError(
            f"{skill_directory}: expected a directory that is not a symbolic link."
        )

    for entry in skill_directory.rglob("*"):
        if entry.is_symlink():
            raise ValueError(f"{entry}: symbolic links are not allowed.")

        if not entry.is_file() and not entry.is_dir():
            raise ValueError(f"{entry}: unsupported file type.")

    skill_file = skill_directory / "SKILL.md"

    if not skill_file.is_file():
        raise ValueError(f"{skill_directory}: missing a regular SKILL.md file.")

    return read_skill_metadata(skill_file=skill_file)


def hash_skill_directory(skill_directory: Path) -> str:
    root = Path(skill_directory).resolve()
    hasher = hashlib.sha256()
    validate_skill_directory(skill_directory=skill_directory)

    regular_files = [p for p in root.rglob("*") if p.is_file()]

    for file_path in sorted(regular_files):
        rel_path = file_path.relative_to(root).as_posix().encode("utf-8")

        # 1. Hash the path length and the relative path itself
        hasher.update(len(rel_path).to_bytes(4, "big"))
        hasher.update(rel_path)

        # 2. Hash the file size and stream the file contents in 64KB chunks
        hasher.update(file_path.stat().st_size.to_bytes(8, "big"))
        with file_path.open("rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                hasher.update(chunk)

    return hasher.hexdigest()


def save_skill_package(
    skill_directory: Path,
    storage_directory: Path = SKILL_STORAGE_DIRECTORY,
):
    validate_skill_directory(skill_directory=skill_directory)

    source = skill_directory.resolve()
    storage = storage_directory.resolve()

    if storage == source or storage.is_relative_to(source):
        raise ValueError("Storage must be outside the source skill directory.")

    storage.mkdir(parents=True, exist_ok=True)

    with TemporaryDirectory(dir=storage, prefix=".staging-") as staging_directory:
        staged_package = Path(staging_directory) / "package"

        shutil.copytree(
            source,
            staged_package,
            symlinks=True,
        )

        metadata = validate_skill_directory(
            skill_directory=staged_package,
        )
        content_hash = hash_skill_directory(
            skill_directory=staged_package,
        )

        destination = storage / content_hash

        if destination.exists():
            existing_hash = hash_skill_directory(skill_directory=destination)

            if existing_hash != content_hash:
                raise ValueError("Saved package hash does not match.")
        else:
            try:
                staged_package.rename(destination)
            except OSError as error:
                if error.errno not in (errno.EEXIST, errno.ENOTEMPTY):
                    raise

                existing_hash = hash_skill_directory(skill_directory=destination)

                if existing_hash != content_hash:
                    raise ValueError("Saved package hash does not match.") from error

    return {
        "metadata": metadata,
        "content_hash": content_hash,
        "package_path": str(destination.relative_to(storage)),
    }


def install_skill_package(
    skill_directory: Path,
    source: str,
    database: Database,
    storage_directory: Path = SKILL_STORAGE_DIRECTORY,
) -> int:
    skill = save_skill_package(
        skill_directory=skill_directory, storage_directory=storage_directory
    )

    metadata = skill["metadata"]
    content_hash = skill["content_hash"]
    package_path = skill["package_path"]

    existing_package = database.get_skill_package(
        source=source, name=metadata["name"], content_hash=content_hash
    )

    if existing_package is None:
        try:
            skill_id = database.register_skill_package(
                name=metadata["name"],
                description=metadata["description"],
                source=source,
                content_hash=content_hash,
                package_path=package_path,
            )

            return skill_id
        except sqlite3.IntegrityError:
            new_package = database.get_skill_package(
                source=source, name=metadata["name"], content_hash=content_hash
            )

            if new_package is not None:
                return new_package["id"]

            raise

    return existing_package["id"]


async def install_github_skill_package(
    repository_url: str,
    revision: str,
    skill_file_path: str,
    database: Database,
    storage_directory=SKILL_STORAGE_DIRECTORY,
) -> int:

    with tempfile.TemporaryDirectory() as temp_file:
        destination = Path(temp_file) / "package"

        await download_github_skill_package(
            repository_url=repository_url,
            revision=revision,
            skill_file_path=skill_file_path,
            destination=destination,
        )

        return install_skill_package(
            skill_directory=destination,
            source=f"{repository_url}@{revision.lower()}:{skill_file_path}",
            database=database,
            storage_directory=storage_directory,
        )


def read_skill_reference(
    skill_name: str,
    relative_path: str,
    catalog: dict,
) -> dict:

    if type(skill_name) != str:
        raise ValueError("skill name must be a string")
    if not skill_name.strip():
        raise ValueError("skill name cannot be empty")
    if type(relative_path) != str:
        raise ValueError("relative path must be a string")
    if not relative_path.strip():
        raise ValueError("relative path cannot be empty")
    if skill_name not in catalog:
        raise ValueError("skill name is not in catalog")
    if "\\" in relative_path:
        raise ValueError("Relative path cannot contain backslashes.")
    if Path(relative_path).is_absolute():
        raise ValueError("Absolute paths are not allowed.")

    components = relative_path.split("/")

    if any(part in ("", ".", "..") for part in components):
        raise ValueError("Relative path contains an invalid component.")

    skill = catalog[skill_name]
    package_directory = Path(skill["path"]).parent

    if package_directory.is_symlink():
        raise ValueError("Skill package directory cannot be a symbolic link.")

    target = package_directory

    for component in components:
        target = target / component

        if target.is_symlink():
            raise ValueError("Reference path cannot contain symbolic links.")

    package_root = package_directory.resolve(strict=True)
    target = target.resolve(strict=True)

    if not target.is_relative_to(package_root):
        raise ValueError("Reference must remain inside the skill package.")

    if not target.is_file():
        raise ValueError("Reference must be a regular file.")

    sha_hash = hash_skill_directory(skill_directory=package_root)

    if sha_hash != skill["content_hash"]:
        raise ValueError("package root hash does not match skill content hash")

    with target.open("r", encoding="utf-8") as file:
        content = file.read()

    return {
        "skill_package_id": skill["id"],
        "skill_name": skill_name,
        "source": skill["source"],
        "content_hash": sha_hash,
        "relative_path": relative_path,
        "content": content,
    }


if __name__ == "__main__":
    print(hash_skill_directory(skill_directory=skill))
