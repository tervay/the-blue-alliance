from flask import Response

from backend.api.handlers.decorators import api_authenticated, validate_keys
from backend.api.handlers.helpers.profiled_jsonify import profiled_jsonify
from backend.api.handlers.helpers.track_call import track_call_after_response
from backend.common.consts.api_version import ApiMajorVersion
from backend.common.decorators import cached_public
from backend.common.models.insight import Insight
from backend.common.queries.insight_query import InsightAllYearsQuery


@api_authenticated
@validate_keys
@cached_public
def insights_notables() -> Response:
    """
    Returns data about teams that may be:
    - HOF
    - CMP winners
    - WFA winners (todo)
    """
    track_call_after_response("insights/notables")
    hof = {
        insight_dict["year"]: insight_dict["data_json"]
        for insight_dict in InsightAllYearsQuery(
            insight_name=Insight.INSIGHT_NAMES[Insight.CA_WINNER]
        ).fetch_dict(ApiMajorVersion.API_V3)
    }
    cmp_winners = {
        insight_dict["year"]: insight_dict["data_json"]
        for insight_dict in InsightAllYearsQuery(
            insight_name=Insight.INSIGHT_NAMES[Insight.WORLD_CHAMPIONS]
        ).fetch_dict(ApiMajorVersion.API_V3)
        if insight_dict["year"] != 0
    }

    return profiled_jsonify(
        {
            "hof": hof,
            "cmp_winners": cmp_winners,
        }
    )
