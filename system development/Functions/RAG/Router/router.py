from Functions.Model.config import INPUT_PATH
import pymupdf

class DocumentClass:
    def __init__(self, metadata, words, blocks, drawers, geometry, tables):
        self.metadata= metadata
        self.words= words
        self.blocks= blocks
        self.drawers= drawers
        self.geometry= geometry
        self.tables= tables


def load_documents():
    files = [{"file_path":file, "document": pymupdf.open(file)} for file in INPUT_PATH.iterdir() if file.is_file()]

    return files