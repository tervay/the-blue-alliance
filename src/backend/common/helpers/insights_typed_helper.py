from collections import defaultdict
from dataclasses import dataclass
from typing import Dict, List

from backend.common.consts.award_type import BLUE_BANNER_AWARDS
from backend.common.consts.event_type import EventType
from backend.common.models.award import Award
from backend.common.models.insight import (
    Insight,
    LeaderboardInsight,
    LeaderboardRanking,
)
from backend.common.models.keys import TeamKey


@dataclass
class YearlyLeaderboardWithFullData:
    data: Dict[TeamKey, int]
    insight_name: str
    year: int

    def make_leaderboard_rankings(self) -> List[LeaderboardRanking]:
        items = sorted(
            self.data.items(), key=lambda x: (x[1], int(x[0][3:])), reverse=True
        )
        temp = defaultdict(list)
        for team, value in items:
            temp[value].append(team)

        return [
            LeaderboardRanking(
                team_keys=sorted(team_keys, key=lambda x: int(x[3:])), value=value
            )
            for value, team_keys in temp.items()
        ]

    def trim_to_leaderboard_insight(self) -> LeaderboardInsight:
        return LeaderboardInsight(
            data=self.make_leaderboard_rankings()[:15],
            name=self.insight_name,
            year=self.year,
        )


class InsightsTypedHelper:
    @staticmethod
    def __get_yearly_leaderboard_dicts() -> List[List[YearlyLeaderboardWithFullData]]:
        return [
            # fixme: how do I get year range more intelligently?
            [f(year) for year in range(1992, 2025)]
            for f in [
                LeaderboardCalculator.most_banners,
            ]
        ]

    @staticmethod
    def __merge_yearly_leaderboards(
        leaderboards: List[YearlyLeaderboardWithFullData],
    ) -> YearlyLeaderboardWithFullData:
        data = defaultdict(int)
        for lb in leaderboards:
            for team, value in lb.data.items():
                data[team] += value

        return YearlyLeaderboardWithFullData(
            data=data,
            insight_name=leaderboards[0].insight_name,
            year=0,
        )

    @staticmethod
    def get_insights() -> List[Insight]:
        yearly_lbs = InsightsTypedHelper.__get_yearly_leaderboard_dicts()
        merged_lbs = [
            InsightsTypedHelper.__merge_yearly_leaderboards(lb_group)
            for lb_group in yearly_lbs
        ]

        flattened_lbs = [leaderboard for lb in yearly_lbs for leaderboard in lb]
        flattened_lbs.extend(merged_lbs)

        return [lb.trim_to_leaderboard_insight().to_insight() for lb in flattened_lbs]


class LeaderboardCalculator:
    @staticmethod
    def most_banners(year: int) -> YearlyLeaderboardWithFullData:
        data = defaultdict(int)
        blue_banner_awards = Award.query(
            Award.year == year,
            Award.award_type_enum.IN(BLUE_BANNER_AWARDS),  # pyre-ignore[16]
            Award.event_type_enum.IN(
                {
                    EventType.REGIONAL,
                    EventType.DISTRICT,
                    EventType.DISTRICT_CMP_DIVISION,
                    EventType.DISTRICT_CMP,
                    EventType.CMP_DIVISION,
                    EventType.CMP_FINALS,
                    EventType.FOC,
                    EventType.REMOTE,
                }
            ),
        ).fetch(10000)
        for award in blue_banner_awards:
            if not award.count_banner:
                continue

            for team in award.team_list:
                data[team.id()] += 1

        return YearlyLeaderboardWithFullData(
            data=data,
            insight_name=Insight.INSIGHT_NAMES[Insight.TYPED_LEADERBOARD_BLUE_BANNERS],
            year=year,
        )

    @staticmethod
    def most_matches_played(year: int) -> YearlyLeaderboardWithFullData:
        pass
