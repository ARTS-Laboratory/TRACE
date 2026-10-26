TECHNICAL_SHEET_KEYWORDS = [
    "Specifications",
    "Technical Specifications",
    "Operating Conditions",
    "Absolute Maximum Ratings",
    "Dimensions",
    "Tolerance",
    "Part Number",
    "Model Number",
    "Pin",
    "Pinout",
    "Electrical Characteristics",
    "Mechanical Characteristics",
    "Installation",
    "Datasheet",
    "Revision",
    "Parameter",
    "Min",
    "Type",
    "Max",
]

SCIENTIFIC_KEYWORDS = [
    "abstract",
    "introduction",
    "method",
    "methods",
    "methodology",
    "results",
    "discussion",
    "conclusion",
    "experiment",
    "dataset",
    "hypothesis",
    "analysis",
    "evaluation",
    "baseline",
    "accuracy",
    "statistical",
    "simulation",
    "model",
    "measurement",
    "references",
    "bibliography",
]

CITATION_PATTERNS = {
    "narrative": r"(?:\b(?!(?:Figure|Table|Model|Experiment|Results|Section|Version|December)\b)[A-Z][A-Za-z\.,\s&]+?\s*\(\d{4}[a-z]?\))|(?:\((?!(?:Figure|Table|Model|Experiment|Results|Section|Version|December|\d{4})\b)[A-Z][^)]*\b\d{4}[a-z]?\b[^)]*\))",
    "brackets": r"\[\d+(?:-\d+)?(?:\s*,\s*\d+(?:-\d+)?)*\]",
    "parenthetical": r"\((?!\d{4}\))\d+(?:-\d+)?(?:\s*,\s*\d+(?:-\d+)?)*\)"
}

CAPTION_PATTERNS = {
    "tables": r"\b(?:Table[ \t]+\d+\.?|Tab\.?[ \t]+\d+)\b",
    "figures": r"(?i)\b(?:figure|fig\.?)[ \t]+\d+(?:[a-z]|\.[ \t]*[a-z]|\.[ \t]*\([a-z]\)|[ \t]*\([a-z]\)|\.)?[ \t]*[\.:]?\b"
}