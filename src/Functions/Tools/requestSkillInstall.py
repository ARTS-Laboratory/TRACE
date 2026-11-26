from __future__ import annotations

from typing import TYPE_CHECKING

from Functions.tool import Tool

if TYPE_CHECKING:
    from Functions.Conversation.manager import ConversationManager


class RequestSkillInstall(Tool):
    def __init__(self, conversation_manager: ConversationManager, conversation_id: int):
        self.conversation_manager = conversation_manager
        self.conversation_id = conversation_id
        super().__init__(
            "request_skill_install",
            "Request user approval to install a GitHub skill package for the current "
            "conversation. Provide the repository URL, pinned commit revision, and exact "
            "SKILL.md path returned by list_github_skills. This creates a pending request "
            "for the browser to display; downloading begins only when the user approves. "
            "This tool does not install, approve, activate, or execute the skill.",
        )

    def schema(self):
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": {
                    "type": "object",
                    "properties": {
                        "repository_url": {
                            "type": "string",
                            "description": (
                                "HTTPS GitHub repository URL containing the skill, such as "
                                "https://github.com/anthropics/skills. Supply only the repository URL, "
                                "without a branch, file path, query string, or fragment."
                            ),
                        },
                        "revision": {
                            "type": "string",
                            "description": (
                                "Full 40-character hexadecimal commit SHA returned by list_github_skills. "
                                "Use the same revision used to inspect the candidate so the installation "
                                "request identifies that exact version. Branch names and tags are not accepted."
                            ),
                        },
                        "skill_file_path": {
                            "type": "string",
                            "description": (
                                "Exact repository-relative SKILL.md path returned by list_github_skills, "
                                "such as skills/pdf/SKILL.md. The path must exist at the supplied revision. "
                                "The installation request covers the directory containing this file "
                                "and its supporting files."
                            ),
                        },
                    },
                    "required": ["repository_url", "revision", "skill_file_path"],
                    "additionalProperties": False,
                },
            },
        }

    async def execute(self, repository_url: str, revision: str, skill_file_path: str):
        try:
            request = await self.conversation_manager.request_skill_install(
                conversation_id=self.conversation_id,
                repository_url=repository_url,
                revision=revision,
                skill_file_path=skill_file_path,
            )

            return request
        except ValueError as error:
            return {"error": str(error)}
