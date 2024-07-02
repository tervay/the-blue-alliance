from typing import Any, Generator, List

from backend.common.models.insight import Insight
from backend.common.models.keys import Year
from backend.common.queries.database_query import CachedDatabaseQuery
from backend.common.queries.dict_converters.insight_converter import (
    InsightConverter,
    InsightDict,
)
from backend.common.tasklets import typed_tasklet


class InsightYearQuery(CachedDatabaseQuery[List[Insight], List[InsightDict]]):
    CACHE_VERSION = 0
    CACHE_KEY_FORMAT = "insights_{insight_name}_{insight_year}"
    DICT_CONVERTER = InsightConverter

    def __init__(self, insight_name: str, insight_year: Year) -> None:
        super().__init__(insight_name=insight_name, insight_year=insight_year)

    @typed_tasklet
    def _query_async(
        self, insight_name: str, insight_year: Year
    ) -> Generator[Any, Any, List[InsightDict]]:
        insights = yield Insight.query(
            Insight.name == insight_name,
            Insight.year == insight_year,
        ).fetch_async()
        return insights


class InsightAllYearsQuery(CachedDatabaseQuery[List[Insight], List[InsightDict]]):
    CACHE_VERSION = 1
    CACHE_KEY_FORMAT = "insights_{insight_name}"
    DICT_CONVERTER = InsightConverter

    def __init__(self, insight_name: str) -> None:
        super().__init__(insight_name=insight_name)

    @typed_tasklet
    def _query_async(self, insight_name: str) -> Generator[Any, Any, List[InsightDict]]:
        insights = yield Insight.query(Insight.name == insight_name).fetch_async()
        return insights
