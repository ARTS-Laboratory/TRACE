from Functions.tool import Tool


class ActivateSkill(Tool):
    def __init__(self, conversation_manager, conversation_id):
        self.conversation_manager = conversation_manager
        self.conversation_id = conversation_id
        super().__init__(
            "activate_skill",
            "Activate an approved, locally installed skill package for the current "
            "conversation using its package ID from search_installed_skills. Activation "
            "persists for this conversation and makes the skill available to load_skill. "
            "This tool does not load instructions, approve packages, install skills, "
            "or affect other conversations.",
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
                        "skill_package_id": {
                            "type": "integer",
                            "description": (
                                "ID of the installed package version returned by search_installed_skills."
                            ),
                            "minimum": 1,
                        },
                    },
                    "required": ["skill_package_id"],
                    "additionalProperties": False,
                },
            },
        }

    async def execute(self, skill_package_id: int):
        try:
            result = self.conversation_manager.activate_skill(
                conversation_id=self.conversation_id, skill_package_id=skill_package_id
            )
        except ValueError as error:
            return {"error": str(error)}

        return {
            "id": result["id"],
            "name": result["name"],
            "description": result["description"],
            "source": result["source"],
            "content_hash": result["content_hash"],
        }
