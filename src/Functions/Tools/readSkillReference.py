from Functions.tool import Tool
from Skills.storage import read_skill_reference


class ReadSkillReference(Tool):
    def __init__(self, catalog):
        self.catalog = catalog
        super().__init__(
            "read_skill_reference",
            "Read a supporting UTF-8 text file from a skill activated in the current "
            "conversation. Use this when the skill's instructions refer to additional "
            "guidance or examples needed for the task. Reads only the requested file "
            "after verifying the saved package content hash. Returns the file text "
            "and package identity for provenance. Does not discover, install, approve, "
            "or activate skills, execute scripts, or install dependencies.",
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
                                "Exact name of an activated skill in the current conversation's catalog, "
                                "such as 'pdf'. Skills installed globally but not activated in this "
                                "conversation are unavailable."
                            ),
                        },
                        "relative_path": {
                            "type": "string",
                            "description": (
                                "Exact path to the text file relative to the skill package directory "
                                "containing SKILL.md, such as 'REFERENCE.md', 'FORMS.md', or "
                                "'references/forms.md'. Use forward slashes. Absolute paths, empty or "
                                "dot components, parent traversal, and symbolic links are rejected. "
                                "Request only the file needed for the current task."
                            ),
                        },
                    },
                    "required": ["skill_name", "relative_path"],
                    "additionalProperties": False,
                },
            },
        }

    async def execute(self, skill_name: str, relative_path: str):
        try:
            references = read_skill_reference(
                skill_name=skill_name, relative_path=relative_path, catalog=self.catalog
            )

        except UnicodeDecodeError:
            return {"error": "The requested reference is not valid UTF-8 text."}
        except ValueError as error:
            return {"error": str(error)}
        except OSError:
            return {"error": "The requested reference could not be read."}

        return references
