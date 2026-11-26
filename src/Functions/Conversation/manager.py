from __future__ import annotations

import sys
from pathlib import Path

source_directory = Path.cwd().parent

if str(source_directory) not in sys.path:
    sys.path.insert(0, str(source_directory))


import asyncio
from typing import TYPE_CHECKING

from Functions.Agent.factory import build_agent_system_prompt, create_agent
from Functions.Model.config import DEFAULT_SKILL_NAMES
from Functions.Storage.database import Database
from Functions.Tools.activate_skill import ActivateSkill
from Functions.Tools.inspectMedia import InspectMedia
from Functions.Tools.requestSkillInstall import RequestSkillInstall
from Functions.Tools.searchInstalledSkills import SearchInstalledSkills
from Skills.catalog import (
    SKILLS_DIRECTORY,
    build_conversation_skill_catalog,
    build_skill_catalog,
    parse_skill_metadata,
)
from Skills.github import list_github_skill_files, read_github_skill_file
from Skills.storage import (
    SKILL_STORAGE_DIRECTORY,
    hash_skill_directory,
    install_github_skill_package,
    install_skill_package,
)

if TYPE_CHECKING:
    from Functions.Conversation.manager import ConversationManager


def make_title(message, max_length=40):
    title = " ".join(message.strip().split())

    if not title:
        return "New chat"

    if len(title) <= max_length:
        return title

    return title[:max_length].rstrip() + "..."


class ConversationManager:
    def __init__(self, runtime, database: Database):
        self.runtime = runtime
        self.database = database

        # Active Agent instances keyed by conversation ID
        self.agents = {}

    def create(self, title="New chat"):
        conversation_id = self.database.create_conversation(title)
        try:
            self._activate_default_skills(conversation_id=conversation_id)
            catalog = self._build_skill_catalog(conversation_id=conversation_id)
            agent = create_agent(
                self.runtime, conversation_id=conversation_id, catalog=catalog
            )

            media_inspector = self.runtime.media_inspector

            tool = InspectMedia(
                conversation_id=conversation_id,
                conversation_manager=self,
                media_inspector=media_inspector,
            )

            agent.tool_manager.register(tool)
            agent.tool_manager.register(
                SearchInstalledSkills(
                    database=self.database,
                    conversation_id=conversation_id,
                )
            )
            agent.tool_manager.register(
                ActivateSkill(self, conversation_id=conversation_id)
            )
            agent.tool_manager.register(
                RequestSkillInstall(
                    conversation_manager=self, conversation_id=conversation_id
                )
            )

            self.agents[conversation_id] = agent
        except Exception:
            self.database.delete_conversation(conversation_id=conversation_id)
            raise

        return conversation_id

    def get_agent(self, conversation_id):
        # Already loaded
        if conversation_id in self.agents:
            return self.agents[conversation_id]

        # Otherwise restore it from SQLite
        stored = self.database.get_conversation(conversation_id)

        if stored is None:
            return None

        catalog = self._build_skill_catalog(conversation_id=conversation_id)

        agent = create_agent(
            self.runtime,
            messages=stored["messages"],
            conversation_id=conversation_id,
            catalog=catalog,
        )

        media_inspector = self.runtime.media_inspector

        tool = InspectMedia(
            conversation_id=conversation_id,
            conversation_manager=self,
            media_inspector=media_inspector,
        )

        agent.tool_manager.register(tool)
        agent.tool_manager.register(
            SearchInstalledSkills(
                database=self.database,
                conversation_id=conversation_id,
            )
        )
        agent.tool_manager.register(
            ActivateSkill(self, conversation_id=conversation_id)
        )
        agent.tool_manager.register(
            RequestSkillInstall(
                conversation_manager=self, conversation_id=conversation_id
            )
        )

        self.agents[conversation_id] = agent

        return agent

    def set_title_from_message(self, conversation_id, message):
        conversation = self.database.get_conversation(conversation_id)

        if conversation is None:
            return None

        # Only automatically title untouched chats
        if conversation["title"] != "New chat":
            return conversation["title"]

        title = make_title(message)

        self.database.update_conversation_title(conversation_id, title)

        return title

    def rename(self, conversation_id, title):
        conversation = self.database.get_conversation(conversation_id)

        if conversation is None:
            return None

        self.database.update_conversation_title(conversation_id, title)

        return title

    def delete(self, conversation_id):
        deleted = self.database.delete_conversation(conversation_id)

        if deleted:
            self.agents.pop(conversation_id, None)

        return deleted

    def add_attachment(
        self,
        conversation_id,
        message_id,
        original_name,
        file_path,
        content_type,
        size,
    ):
        attached = self.database.add_attachment(
            conversation_id,
            message_id,
            original_name,
            file_path,
            content_type,
            size,
        )

        if attached is None:
            return None

        return attached

    def get_attachment(self, conversation_id, attachment_id):
        attachment = self.database.get_attachment(attachment_id)

        if attachment is None:
            return None

        if attachment["conversation_id"] != conversation_id:
            return None

        return attachment

    def get_attachments_for_message(self, message_id):
        attachment_for_message = self.database.get_attachments_for_message(message_id)

        return attachment_for_message

    def get_conversation(self, conversation_id):
        return self.database.get_conversation(conversation_id)

    def get_attachment_by_id(self, attachment_id):
        attachment = self.database.get_attachment(attachment_id)

        if not attachment:
            return None

        return attachment

    def get_conversations(self):
        return self.database.get_conversations()

    def _build_skill_catalog(self, conversation_id):
        packages = self.database.get_conversation_skills(conversation_id)

        packages = [
            package
            for package in packages
            if self.database.can_access_skill_package(
                conversation_id=conversation_id,
                skill_package_id=package["id"],
            )
        ]

        catalog = build_conversation_skill_catalog(
            packages=packages, storage_directory=SKILL_STORAGE_DIRECTORY
        )

        return catalog

    def _activate_default_skills(self, conversation_id):
        catalog = build_skill_catalog(skills_directory=SKILLS_DIRECTORY)

        for name in DEFAULT_SKILL_NAMES:
            if name not in catalog:
                raise ValueError(f"Default skill '{name}' is missing.")

        for name in DEFAULT_SKILL_NAMES:
            skill_package_id = install_skill_package(
                skill_directory=catalog[name]["path"].parent,
                source="bundled",
                database=self.database,
                storage_directory=SKILL_STORAGE_DIRECTORY,
            )

            self.database.approve_skill_package(skill_package_id=skill_package_id)
            self.database.register_universal_skill_package(
                skill_package_id=skill_package_id
            )

            self.database.activate_conversation_skill(
                conversation_id=conversation_id,
                skill_package_id=skill_package_id,
            )

    def activate_skill(self, conversation_id, skill_package_id):
        conversation_result = self.database.get_conversation(
            conversation_id=conversation_id
        )

        if conversation_result is None:
            raise ValueError("conversation does not exist")

        skill_result = self.database.get_skill_package_by_id(
            skill_package_id=skill_package_id
        )

        if skill_result is None:
            raise ValueError("skill package does not exist")

        if not self.database.can_access_skill_package(
            conversation_id=conversation_id,
            skill_package_id=skill_package_id,
        ):
            raise ValueError("Skill package is not available to this conversation.")

        approval = self.database.is_skill_package_approved(
            skill_package_id=skill_package_id
        )

        if not approval:
            raise ValueError("Skill package is not approved for activation.")

        skills = self.database.get_conversation_skills(conversation_id=conversation_id)
        skills = [
            package
            for package in skills
            if self.database.can_access_skill_package(
                conversation_id=conversation_id,
                skill_package_id=package["id"],
            )
        ]

        for skill in skills:
            if skill_package_id == skill["id"]:
                catalog = build_conversation_skill_catalog(
                    packages=skills, storage_directory=SKILL_STORAGE_DIRECTORY
                )

                self._update_agent_skill_catalog(
                    conversation_id=conversation_id, catalog=catalog
                )

                return skill

            if skill["name"] == skill_result["name"]:
                raise ValueError(
                    "A different package with this skill name is already active."
                )

        candidate_catalog = build_conversation_skill_catalog(
            packages=skills + [skill_result],
            storage_directory=SKILL_STORAGE_DIRECTORY,
        )

        candidate_skill = candidate_catalog[skill_result["name"]]
        path = candidate_skill["path"].parent

        content_hash = hash_skill_directory(skill_directory=path)

        if content_hash != skill_result["content_hash"]:
            raise ValueError("skill directory has been altered.")

        self.database.activate_conversation_skill(
            conversation_id=conversation_id, skill_package_id=skill_package_id
        )

        self._update_agent_skill_catalog(
            conversation_id=conversation_id, catalog=candidate_catalog
        )

        return skill_result

    def _update_agent_skill_catalog(self, conversation_id, catalog):
        agent = self.agents.get(conversation_id)

        if agent is None:
            return

        loaded_system_prompt = build_agent_system_prompt(catalog=catalog)

        loader = agent.tool_manager.tools["load_skill"]
        referencer = agent.tool_manager.tools["read_skill_reference"]

        agent.conversation.set_system_prompt(system_prompt=loaded_system_prompt)

        loader.catalog = catalog
        referencer.catalog = catalog

    def review_skill_package(self, skill_package_id: int):
        skill_package = self.database.get_skill_package_by_id(
            skill_package_id=skill_package_id
        )

        if skill_package is None:
            raise ValueError("skill package does not exist")

        catalog = build_conversation_skill_catalog(
            packages=[skill_package],
            storage_directory=SKILL_STORAGE_DIRECTORY,
        )

        pulled = catalog[skill_package["name"]]
        catalog_hash = hash_skill_directory(pulled["path"].parent)

        if catalog_hash != skill_package["content_hash"]:
            raise ValueError("content hash does not match")

        return {
            "metadata": {
                "id": skill_package["id"],
                "name": skill_package["name"],
                "description": skill_package["description"],
                "source": skill_package["source"],
                "content_hash": skill_package["content_hash"],
            },
            "instructions": catalog[skill_package["name"]]["path"].read_text(
                encoding="utf-8"
            ),
        }

    def approve_reviewed_skill_package(
        self, skill_package_id: int, expected_content_hash: str
    ):
        skill_package = self.review_skill_package(skill_package_id=skill_package_id)
        package_hash = skill_package["metadata"]["content_hash"]

        if package_hash != expected_content_hash:
            raise ValueError("package hash does not match expected content hash")

        self.database.approve_skill_package(skill_package_id=skill_package_id)

        return skill_package["metadata"]

    async def request_skill_install(
        self,
        conversation_id: int,
        repository_url: str,
        revision: str,
        skill_file_path: str,
    ) -> dict:
        conversation = self.database.get_conversation(conversation_id=conversation_id)

        if conversation is None:
            raise ValueError("Conversation does not exist.")

        if type(skill_file_path) is not str:
            raise ValueError("Skill file path must be a string.")

        skill_files = await list_github_skill_files(
            repository_url=repository_url,
            revision=revision,
        )

        if skill_file_path not in skill_files:
            raise ValueError("Skill file was not found at the supplied revision.")

        request_id = self.database.create_skill_install_request(
            conversation_id=conversation_id,
            repository_url=repository_url.strip(),
            revision=revision.lower(),
            skill_file_path=skill_file_path,
        )

        request = self.database.get_skill_install_request(request_id=request_id)

        if request is None:
            raise RuntimeError("Created installation request could not be retrieved.")

        return request

    async def review_skill_install_request(self, conversation_id: int, request_id: int):
        request = self.database.get_skill_install_request(request_id=request_id)

        if request is None:
            raise ValueError("request does not exist")
        if conversation_id != request["conversation_id"]:
            raise ValueError("request belongs to another conversation")

        decoded_content = await read_github_skill_file(
            repository_url=request["repository_url"],
            revision=request["revision"],
            skill_file_path=request["skill_file_path"],
        )

        metadata = parse_skill_metadata(text=decoded_content)

        return {
            "request": request,
            "metadata": metadata,
            "instructions": decoded_content,
        }

    async def approve_skill_install_request(
        self,
        conversation_id: int,
        request_id: int,
    ) -> dict:
        request = self.database.get_skill_install_request(request_id=request_id)

        if request is None:
            raise ValueError("Request does not exist.")

        if request["conversation_id"] != conversation_id:
            raise ValueError("Request belongs to another conversation.")

        claimed = self.database.claim_skill_install_request(
            request_id=request_id,
            conversation_id=conversation_id,
        )

        if not claimed:
            raise ValueError("Request is no longer pending.")

        try:
            skill_package_id = await install_github_skill_package(
                repository_url=request["repository_url"],
                revision=request["revision"],
                skill_file_path=request["skill_file_path"],
                database=self.database,
                storage_directory=SKILL_STORAGE_DIRECTORY,
            )

            package = self.database.get_skill_package_by_id(
                skill_package_id=skill_package_id
            )

            if package is None:
                raise RuntimeError("Installed skill package could not be retrieved.")

            completed = self.database.complete_skill_install_request(
                request_id=request_id,
                conversation_id=conversation_id,
                skill_package_id=skill_package_id,
            )

            if not completed:
                raise RuntimeError("Installation request could not be completed.")

        except (Exception, asyncio.CancelledError):
            self.database.fail_skill_install_request(
                request_id=request_id,
                conversation_id=conversation_id,
            )
            raise

        return {
            "id": package["id"],
            "name": package["name"],
            "description": package["description"],
            "source": package["source"],
            "content_hash": package["content_hash"],
        }

    def deny_skill_install_request(self, conversation_id: int, request_id: int):
        request = self.database.get_skill_install_request(request_id=request_id)

        if request is None:
            raise ValueError("Request does not exist.")
        if request["conversation_id"] != conversation_id:
            raise ValueError("Request belongs to another conversation.")

        denied = self.database.deny_skill_install_request(
            request_id=request_id,
            conversation_id=conversation_id,
        )

        if not denied:
            raise ValueError("Request is no longer pending.")

        return self.database.get_skill_install_request(request_id=request_id)

    def get_skill_install_requests(self, conversation_id: int) -> list[dict]:
        result = self.database.get_conversation(conversation_id=conversation_id)

        if result is None:
            raise ValueError("conversation does not exist")

        return self.database.get_conversation_skill_install_requests(
            conversation_id=conversation_id
        )

    def get_conversation_skill_status(self, conversation_id: int) -> list[dict]:
        conversation = self.database.get_conversation(conversation_id=conversation_id)

        if conversation is None:
            raise ValueError("Conversation does not exist.")
        packages = self.database.get_conversation_skills(
            conversation_id=conversation_id
        )
        packages = [
            package
            for package in packages
            if self.database.can_access_skill_package(
                conversation_id=conversation_id,
                skill_package_id=package["id"],
            )
        ]
        events = self.database.get_execution_events(conversation_id=conversation_id)

        loaded_names = set()

        for event in events:
            if event.get("event_type") != "tool_finished":
                continue

            data = event.get("data")
            if not isinstance(data, dict):
                continue

            if data.get("name") != "load_skill":
                continue

            result = data.get("result")
            if not isinstance(result, dict):
                continue

            if "error" in result:
                continue

            skill_name = result.get("skill_name")
            instructions = result.get("instructions")

            if not isinstance(skill_name, str) or not skill_name.strip():
                continue

            if not isinstance(instructions, str):
                continue

            loaded_names.add(skill_name)

        return [
            {
                "id": package["id"],
                "name": package["name"],
                "description": package["description"],
                "source": package["source"],
                "content_hash": package["content_hash"],
                "instructions_loaded": package["name"] in loaded_names,
            }
            for package in packages
        ]
