from Functions.tool import Tool
from Skills.storage import read_skill_reference


class LoadSkill(
    Tool,
):
    def __init__(self, catalog):
        self.catalog = catalog
        super().__init__(
            "load_skill",
            "Load the full procedural instructions for a skill listed in the current "
            "conversation's skill catalog. Use this when a skill's name and description "
            "match the task and you need its guidance before proceeding. Provide the "
            "exact skill_name from the catalog. This tool reads instructions; it does "
            "not discover or install skills, execute scripts, or grant permissions.",
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
                        "skill_name": {
                            "type": "string",
                            "description": (
                                "Exact skill name from the current conversation's catalog."
                            ),
                        },
                    },
                    "required": ["skill_name"],
                    "additionalProperties": False,
                },
            },
        }

    async def execute(self, skill_name: str):
        try:
            content = read_skill_reference(
                skill_name=skill_name,
                relative_path="SKILL.md",
                catalog=self.catalog,
            )

        except OSError:
            return {
                "skill_name": skill_name,
                "error": "The skill is registered, but its instructions could not be read.",
            }
        except UnicodeDecodeError:
            return {
                "skill_name": skill_name,
                "error": "The skill instructions are not valid UTF-8 text.",
            }
        except ValueError as error:
            return {"error": str(error)}

        return {
            "skill_package_id": content["skill_package_id"],
            "skill_name": content["skill_name"],
            "source": content["source"],
            "content_hash": content["content_hash"],
            "relative_path": content["relative_path"],
            "instructions": content["content"],
        }
