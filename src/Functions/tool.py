from abc import ABC, abstractmethod

class Tool(ABC):
    def __init__(self, name : str, description : str):
        self.name = name
        self.description = description

    @abstractmethod
    def schema(self) -> dict:
        pass

    @abstractmethod
    def execute(self, **kwargs):
        pass
