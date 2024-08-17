import { Team } from '~/api/v3';

import { removeNonNumeric } from './utils';

export function sortTeamsComparator(a: Team, b: Team) {
  return a.team_number - b.team_number;
}

export function sortTeamKeysComparator(a: string, b: string) {
  return Number(removeNonNumeric(a)) - Number(removeNonNumeric(b));
}

// Known problem: Does not work when the final company listed has an ampersand in its name
// For example: Company 1/Company 2 & 3&Public School
// becomes ["Company 1", "Company 2"]
export function attemptToParseSponsors(teamName: string): string[] {
  const familyCommunity = 'Family/Community';
  if (teamName.endsWith(familyCommunity)) {
    teamName = teamName.substring(0, teamName.length - familyCommunity.length);
  }

  const lastSlash = Math.max(teamName.lastIndexOf('/'), 0);
  const firstAmpersand = teamName.substring(lastSlash).indexOf('&');
  const sponsorCompanySection = teamName.substring(
    0,
    lastSlash + firstAmpersand,
  );

  const sponsors = sponsorCompanySection
    .split('/')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return sponsors;
}
