from typing import Annotated, Literal

from pydantic import (
    AliasChoices,
    BaseModel,
    ConfigDict,
    Field,
    FiniteFloat,
    field_validator,
    model_validator,
)


class ChecklistItem(BaseModel):
    model_config = ConfigDict(strict=True, str_strip_whitespace=True, extra="forbid")

    id: str = Field(min_length=1)
    label: str = Field(min_length=1)


class ChecklistSpec(BaseModel):
    model_config = ConfigDict(strict=True, str_strip_whitespace=True, extra="forbid")

    type: Literal["checklist"] = "checklist"
    title: str = Field(min_length=1)
    checklist_items: list[ChecklistItem] = Field(
        min_length=1,
        max_length=50,
        validation_alias=AliasChoices("checklist_items", "items"),
    )

    @field_validator("checklist_items", mode="after")
    @classmethod
    def validate_unique_ids(cls, items: list[ChecklistItem]) -> list[ChecklistItem]:
        ids = [item.id for item in items]

        if len(ids) != len(set(ids)):
            raise ValueError("Checklist item IDs must be unique")

        return items


class ChecklistState(BaseModel):
    model_config = ConfigDict(strict=True, str_strip_whitespace=True, extra="forbid")

    checked: dict[Annotated[str, Field(min_length=1)], bool] = Field(
        default_factory=dict
    )


class TableSpec(BaseModel):
    model_config = ConfigDict(strict=True, str_strip_whitespace=True, extra="forbid")

    type: Literal["table"] = "table"
    title: str = Field(min_length=1)
    columns: list[Annotated[str, Field(min_length=1)]] = Field(
        min_length=1, max_length=12
    )
    rows: list[list[str]] = Field(min_length=1, max_length=100)

    @model_validator(mode="after")
    def validate_rows_cols(self):
        columns_number = len(self.columns)

        for row in self.rows:
            if len(row) != columns_number:
                raise ValueError("Row length differs from column length")

        return self


class ChartSeries(BaseModel):
    model_config = ConfigDict(strict=True, str_strip_whitespace=True, extra="forbid")

    name: str = Field(min_length=1)
    values: list[FiniteFloat] = Field(min_length=1, max_length=100)


class ChartSpec(BaseModel):
    model_config = ConfigDict(strict=True, str_strip_whitespace=True, extra="forbid")

    type: Literal["chart"] = "chart"
    chart_type: Literal["bar", "line"]
    title: str = Field(min_length=1)
    labels: list[Annotated[str, Field(min_length=1)]] = Field(
        min_length=1, max_length=100
    )
    series: list[ChartSeries] = Field(min_length=1, max_length=6)

    @model_validator(mode="after")
    def validate_chart(self):
        label_count = len(self.labels)

        for series in self.series:
            if len(series.values) != label_count:
                raise ValueError("Each series must have one value per label")

        return self


class ComparisonOption(BaseModel):
    model_config = ConfigDict(strict=True, str_strip_whitespace=True, extra="forbid")

    name: str = Field(min_length=1)
    values: list[str] = Field(min_length=1, max_length=12)


class ComparisonSpec(BaseModel):
    model_config = ConfigDict(strict=True, str_strip_whitespace=True, extra="forbid")

    type: Literal["comparison"] = "comparison"
    title: str = Field(min_length=1)
    criteria: list[Annotated[str, Field(min_length=1)]] = Field(
        min_length=1, max_length=12
    )
    options: list[ComparisonOption] = Field(min_length=2, max_length=4)

    @model_validator(mode="after")
    def validate_comparison(self):
        criteria_count = len(self.criteria)

        for option in self.options:
            if len(option.values) != criteria_count:
                raise ValueError("Each option must have one value per criterion.")

        return self


class FlowchartNode(BaseModel):
    model_config = ConfigDict(strict=True, str_strip_whitespace=True, extra="forbid")

    id: str = Field(min_length=1)
    label: str = Field(min_length=1)


class FlowchartEdge(BaseModel):
    model_config = ConfigDict(
        strict=True,
        str_strip_whitespace=True,
        extra="forbid",
    )

    source: str = Field(min_length=1)
    target: str = Field(min_length=1)
    label: str = ""


class FlowchartSpec(BaseModel):
    model_config = ConfigDict(
        strict=True,
        str_strip_whitespace=True,
        extra="forbid",
    )

    type: Literal["flowchart"] = "flowchart"
    title: str = Field(min_length=1)
    direction: Literal["TD", "LR"] = "TD"
    nodes: list[FlowchartNode] = Field(min_length=1, max_length=30)
    edges: list[FlowchartEdge] = Field(max_length=60)

    @model_validator(mode="after")
    def validate_flow(self):
        ids = [node.id for node in self.nodes]
        node_ids = set(ids)

        if len(ids) != len(node_ids):
            raise ValueError("Flowchart node IDs must be unique.")

        for edge in self.edges:
            if edge.source not in node_ids:
                raise ValueError(f"Unknown source node ID: {edge.source}")
            if edge.target not in node_ids:
                raise ValueError(f"Unknown target node ID: {edge.target}")

        return self


class StatusItem(BaseModel):
    model_config = ConfigDict(
        strict=True,
        str_strip_whitespace=True,
        extra="forbid",
    )

    label: str = Field(min_length=1)
    state: Literal["pending", "in_progress", "success", "warning", "error"]
    detail: str = ""


class StatusSpec(BaseModel):
    model_config = ConfigDict(
        strict=True,
        str_strip_whitespace=True,
        extra="forbid",
    )

    type: Literal["status"] = "status"
    title: str = Field(min_length=1)
    status_items: list[StatusItem] = Field(min_length=1, max_length=20)


VisualSpec = Annotated[
    ChecklistSpec | TableSpec | ChartSpec | ComparisonSpec | FlowchartSpec | StatusSpec,
    Field(discriminator="type"),
]
