from Functions.tool import Tool


class SearchInstalledSkills(Tool):
    def __init__(self, database, conversation_id):
        self.database = database
        self.conversation_id = conversation_id
        super().__init__(
            "search_installed_skills",
            "Search universal skills and skills installed for the current conversation by name or description to find "
            "procedural guidance relevant to the task. Use concise keywords. Results "
            "include package IDs and content hashes identifying specific saved versions. "
            "This tool searches metadata only; it does not load instructions, activate "
            "skills for the conversation, install packages, or search online.",
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
                        "query": {
                            "type": "string",
                            "description": (
                                "Keywords to match against locally installed skill names or "
                                "descriptions. Use a concise term such as 'spreadsheet' or 'search'. "
                                "Blank queries return no results."
                            ),
                        },
                        "limit": {
                            "type": "integer",
                            "description": (
                                "Maximum number of matching package versions to return, "
                                "from 1 to 50. Defaults to 10 when omitted."
                            ),
                            "minimum": 1,
                            "maximum": 50,
                            "default": 10,
                        },
                    },
                    "required": ["query"],
                    "additionalProperties": False,
                },
            },
        }

    async def execute(self, query: str, limit: int = 10):
        try:
            results = self.database.search_skill_packages(
                query=query, limit=limit, conversation_id=self.conversation_id
            )

        except ValueError as error:
            return {"error": str(error)}

        return {"skills": results}
