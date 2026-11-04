from parsing_profiles import profileNames, markerPipelineOptions


markerProfiles: dict[profileNames, markerPipelineOptions] = {
    profileNames.marker: markerPipelineOptions(
        name=profileNames.marker,
        forceOCR=False,
        paginateOutput=True,
        stripExistingOCR=False,
        mode="balanced",
        ocrFullPage=False,
    )
}