import { Match } from '~/api/v3';
import MatchResultsTableBase from '~/components/tba/matchResultsTables/base';

export default function MatchResultsTableQuals({
  matches,
}: {
  matches: Match[];
}) {
  return (
    <div>
      <div className="mb-2 text-3xl font-bold">Quals</div>
      <MatchResultsTableBase
        matches={matches}
        matchTitleFormatter={(m) => `Qual ${m.match_number}`}
      />
    </div>
  );
}
