from Functions.RAG.parsing_profiles.parsing_profiles import profileNames, doclingPipelineOptions, markerPipelineOptions

from docling.datamodel.pipeline_options import (
    EasyOcrOptions,
    RapidOcrOptions,
    LayoutOptions,
    TableFormerMode,
    TableStructureOptions,
    ThreadedPdfPipelineOptions,
    granite_picture_description,
)
from docling.datamodel.layout_model_specs import DOCLING_LAYOUT_EGRET_LARGE
from docling.datamodel.accelerator_options import (
    AcceleratorDevice,
    AcceleratorOptions,
)

doclingProfiles: dict[profileNames, doclingPipelineOptions] = {
    profileNames.doclingNative: doclingPipelineOptions(
        name = profileNames.doclingNative,
        doOCR = True,
        doTableStructures=True,
        tableAccurateMode=False,
        generatePageImage=False,
        generatePictureImages=False,
        doFormulaEnrichment=True,
        doPictureDescriptions=False,
        imageScale=1.0
    ),

    profileNames.doclingScannedOCR : doclingPipelineOptions(
        name=profileNames.doclingScannedOCR,
        doOCR=True,
        forceFullPageOCR=True,
        ocrBatchSize=1,
        layoutBatchSize=1,
        doTableStructures=True,
        tableAccurateMode=True,
        generatePageImage=False,
        generatePictureImages=True,
        useEgretLargeLayout=False,
        imageScale=1.1,
        numberOfThreads=2,
        doPictureDescriptions=False,
        pictureDescriptionPrompt=(
        "Always begin with 'Picture description:'. "
        "In 2–3 sentences, describe the figure type, its main content, and any important labels, values, or relationships. "
        "Be concise and factual."
        ),
    ),
    profileNames.doclingOCR : doclingPipelineOptions(
        name=profileNames.doclingOCR,
        doOCR=True,
        forceFullPageOCR=False,
        doTableStructures=True,
        tableAccurateMode=True,
        generatePictureImages=True,
        generatePageImage=False,
        useEgretLargeLayout=False,
        imageScale=1.25,
        doPictureDescriptions=False,
        pictureDescriptionPrompt=(
        "Always begin with 'Picture description:'. "
        "In 2–3 sentences, describe the figure type, its main content, and any important labels, values, or relationships. "
        "Be concise and factual."
        ),
    )
}

markerProfiles: dict[profileNames, markerPipelineOptions] = {
    profileNames.marker: markerPipelineOptions(
        name=profileNames.marker,
        forceOCR=False,
        paginateOutput=True,
        stripExistingOCR=False,
        useLLM=False,
    ),
}

def doclingSettings(profile : doclingPipelineOptions) -> ThreadedPdfPipelineOptions:
        options = ThreadedPdfPipelineOptions()

        # Images
        options.images_scale = profile.imageScale
        options.generate_picture_images = profile.generatePictureImages
        options.generate_page_images = profile.generatePageImage

        # OCR
        options.do_ocr = profile.doOCR
        options.ocr_batch_size = profile.ocrBatchSize
        if profile.ocrEngine == "rapidocr":
                options.ocr_options = RapidOcrOptions(
                        backend="torch",
                        lang=["english"],
                        force_full_page_ocr=profile.forceFullPageOCR,
                        print_verbose=False,
        )
        else:
                options.ocr_options = EasyOcrOptions(
                        force_full_page_ocr=profile.forceFullPageOCR
                )

        # Layout
        options.layout_batch_size = profile.layoutBatchSize
        if profile.useEgretLargeLayout:
                options.layout_options = LayoutOptions(
                model_spec=DOCLING_LAYOUT_EGRET_LARGE
                )

        # Tables
        options.do_table_structure = profile.doTableStructures
        options.table_batch_size = profile.tableBatchSize
        options.table_structure_options = TableStructureOptions(
                do_cell_matching=profile.tableDoCellMatching,
                mode=(
                TableFormerMode.ACCURATE
                if profile.tableAccurateMode
                else TableFormerMode.FAST
                ),
        )

        # Enrichments
        options.do_formula_enrichment = profile.doFormulaEnrichment
        options.do_picture_description = profile.doPictureDescriptions

        if profile.doPictureDescriptions:
                options.picture_description_options = granite_picture_description
                options.picture_description_options.prompt = profile.pictureDescriptionPrompt
                options.picture_description_options.generation_config = {
                        "max_new_tokens": 200,
                        "do_sample": False
                }      

        # Hardware
        options.accelerator_options = AcceleratorOptions(
                num_threads=profile.numberOfThreads,
                device=AcceleratorDevice(profile.acceleratorDevice),
        )

        # Plugins
        options.allow_external_plugins = profile.allowExternalPlugins

        return options