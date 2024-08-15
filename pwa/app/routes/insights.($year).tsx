import { LoaderFunctionArgs } from '@remix-run/node';
import {
  ClientLoaderFunctionArgs,
  Link,
  MetaFunction,
  Params,
  json,
  useLoaderData,
} from '@remix-run/react';

import { LeaderboardInsight, getInsightsLeaderboardsYear } from '~/api/v3';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

async function loadData(params: Params) {
  let numericYear = -1;
  if (params.year === undefined) {
    numericYear = 0;
  } else {
    const parsed = Number(params.year);
    if (!Number.isNaN(parsed) && parsed > 0) {
      numericYear = parsed;
    }
  }

  if (numericYear === -1) {
    throw new Response(null, {
      status: 404,
    });
  }

  const leaderboards = await getInsightsLeaderboardsYear({ year: numericYear });

  if (leaderboards.status !== 200) {
    throw new Response(null, {
      status: 500,
    });
  }

  if (leaderboards.data.length === 0) {
    throw new Response(null, {
      status: 404,
    });
  }

  return { year: numericYear, leaderboards: leaderboards.data };
}

export async function loader({ params }: LoaderFunctionArgs) {
  return json(await loadData(params));
}

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
  return await loadData(params);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: `${data?.year} FIRST Robotics Events - The Blue Alliance`,
    },
    {
      name: 'description',
      content: `Insights for the ${data?.year} FIRST Robotics Competition.`,
    },
  ];
};

export default function InsightsPage() {
  const { leaderboards, year } = useLoaderData<typeof loader>();

  return (
    <div>
      <SingleYearInsights leaderboards={leaderboards} year={year} />
    </div>
  );
}

function SingleYearInsights({
  year,
  leaderboards,
}: {
  year: number;
  leaderboards: LeaderboardInsight[];
}) {
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">
        Insights ({year > 0 ? year : 'All Time'})
      </h1>

      <h3 className="mb-4 text-xl font-bold">Leaderboards</h3>
      <div className="grid grid-cols-2 gap-4">
        {leaderboards.map((l, i) => (
          <Leaderboard leaderboard={l} key={i} />
        ))}
      </div>
    </div>
  );
}

function Leaderboard({ leaderboard }: { leaderboard: LeaderboardInsight }) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{leaderboard.name}</CardTitle>
          <CardDescription>
            {leaderboard.year > 0 ? leaderboard.year : 'All Time'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">#</TableHead>
                <TableHead className="text-right capitalize">
                  {leaderboard.data.key_type}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.data.rankings.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="">{r.value}</TableCell>
                  <TableCell className="text-right">
                    <LeaderboardKeyList
                      cutoffSize={20}
                      keyType={leaderboard.data.key_type}
                      keyVals={r.keys}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function LeaderboardKeyList({
  keyVals,
  keyType,
  cutoffSize,
}: {
  keyType: LeaderboardInsight['data']['key_type'];
  keyVals: string[];
  cutoffSize: number;
}) {
  return (
    <>
      {keyVals.slice(0, cutoffSize).map((k, i) => (
        <>
          {i > 0 && ', '}
          <LeaderboardKeyLink key={i} keyType={keyType} keyVal={k} />
        </>
      ))}
      {keyVals.length > cutoffSize &&
        ` (... and ${keyVals.length - cutoffSize} more)`}
    </>
  );
}

function LeaderboardKeyLink({
  keyVal,
  keyType,
}: {
  keyType: LeaderboardInsight['data']['key_type'];
  keyVal: string;
}) {
  if (keyType === 'team') {
    return (
      <Link to={`/team/${keyVal.substring(3)}`}>{keyVal.substring(3)}</Link>
    );
  } else {
    return <Link to={`/${keyType}/${keyVal}`}>{keyVal}</Link>;
  }
}
