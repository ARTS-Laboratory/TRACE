from dataclasses import dataclass
from enum import Enum

class profileNames(str, Enum):
        doclingOCR = "doclingOCR"
        doclingScannedOCR = "doclingScannedOCR"
        doclingNative = "doclingNative"
        marker = "marker"

@dataclass(frozen=True)
class doclingPipelineOptions:
        name: profileNames

        #image / visual assets 
        imageScale : float = 1.0
        generatePictureImages : bool = False
        generatePageImage : bool = False
        
        #bum ahh OCR
        doOCR : bool = False
        forceFullPageOCR : bool = False
        ocrBatchSize : int = 4
        ocrEngine : str = "easyocr"

        #layout
        layoutBatchSize : int = 4
        useEgretLargeLayout : bool = False

        #tables
        doTableStructures : bool = False
        tableDoCellMatching : bool = False
        tableAccurateMode : bool = False
        tableBatchSize : int = 4

        #enrichments
        doFormulaEnrichment : bool = False
        doPictureDescriptions : bool = False
        pictureDescriptionPrompt : str = None

        #Hardware/Threading
        acceleratorDevice : str = "cuda"
        numberOfThreads : int = 4

        #safety/plugins
        allowExternalPlugins : bool = True

@dataclass(frozen=True)
class markerPipelineOptions:
    name: profileNames

    pageRanges: str | None = None

    forceOCR: bool = False
    paginateOutput: bool = True
    stripExistingOCR: bool = False

    useLLM: bool = False
    redoInlineMath: bool = False

    mode: str = "balanced"

    llmService: str | None = None


