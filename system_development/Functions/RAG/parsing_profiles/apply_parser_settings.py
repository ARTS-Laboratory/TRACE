from Functions.RAG.parsing_profiles.parsing_profiles import profileNames, doclingPipelineOptions, markerPipelineOptions
from Functions.RAG.parsing_profiles.parser_settings import doclingSettings, doclingProfiles, markerProfiles

from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.base_models import InputFormat


def buildDoclingConverterSettings(profile : doclingPipelineOptions) -> DocumentConverter:
        return DocumentConverter(
            format_options={
                InputFormat.PDF: PdfFormatOption(
                    pipeline_options=doclingSettings(profile)
                )
            }
        )

def addDoclingParserSettings(results):   
    # Get a list of the profile names
    profiles_list = [profile.value for profile in profileNames if "docling" in profile.value]
    parserPlansWithSettings = [
         {
              "profile": profile,
              "settings": buildDoclingConverterSettings(doclingProfiles[profileNames(profile)]),
              "files": []
         }

         for profile in profiles_list
    ]

    for result in results:
        parser_name = result["parsing profile"]

        for plan in parserPlansWithSettings:
             profile = plan["profile"]
             files = plan["files"]

             if profile == parser_name:
                  files.append(result)

                  break

    return parserPlansWithSettings

def getMarkerProfile(parserName: str) -> markerPipelineOptions:
    profileMap = {
        "marker": profileNames.marker,
    }

    return markerProfiles[profileMap[parserName]]