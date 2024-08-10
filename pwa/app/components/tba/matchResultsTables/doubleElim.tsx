import { groupBy } from 'lodash-es';
import { Match } from '~/api/v3';
import MatchResultsTableBase from '~/components/tba/matchResultsTables/base';

const DOUBLE_ELIM_ROUND_MAPPING: { [key: number]: number } = {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 2,
  6: 2,
  7: 2,
  8: 2,
  9: 3,
  10: 3,
  11: 4,
  12: 4,
  13: 5,
};

export default function MatchResultsTableDoubleElim({
  matches,
}: {
  matches: Match[];
}) {
  const matchesGroupedByRound = groupBy(
    matches.filter((m) => m.comp_level !== 'f'),
    (m) => DOUBLE_ELIM_ROUND_MAPPING[m.set_number] ?? 1,
  );

  return (
    <div>
      <h1 className="mt-1.5 text-2xl font-bold">Playoffs</h1>
      {Object.entries(matchesGroupedByRound).map(([round, matches]) => (
        <div key={round}>
          <div className="mt-1.5 text-xl">Round {round}</div>
          <MatchResultsTableBase
            matches={matches}
            matchTitleFormatter={() => `Round ${round}`}
          />
        </div>
      ))}

      <div className="mt-1.5 text-xl">Finals</div>
      <MatchResultsTableBase
        matches={matches.filter((m) => m.comp_level === 'f')}
        matchTitleFormatter={() => 'Finals'}
      />
    </div>
  );
}
