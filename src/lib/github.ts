import { formatISO, subDays } from "date-fns";
import {
  ContributionCalendar,
  ContributionsCollection,
  ContributionsDay,
  GitHubUser,
} from "~/types";
import { env } from "./env/server";

const GITHUB_API_URL = "https://api.github.com/users/fazers" as const;
const DAYS_TO_FETCH = 30 as const;

const headers = new Headers({
  Authorization: `token ${env.GITHUB_ACCESS_TOKEN}`,
});

async function getGithubStats() {
  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(GITHUB_API_URL, { headers }),
      fetch("https://api.github.com/users/fazers/repos?per_page=100", {
        headers,
      }),
    ]);

    const user = (await userResponse.json()) as GitHubUser;
    const myRepos = (await reposResponse.json()) as Array<{
      fork: boolean;
      stargazers_count: number;
    }>;

    const filteredRepos = myRepos.filter((repo) => !repo.fork);
    const starsCount = filteredRepos.reduce(
      (acc, curr) => acc + curr.stargazers_count,
      0
    );

    return { user, repos: filteredRepos.length, starsCount };
  } catch (_error) {
    return null;
  }
}

export type ContributionCountByDay = {
  [day: string]: number;
};

export type ContributionCountByDayOfWeek = {
  day: string;
  count: number;
};

export type Contributions = {
  contributionsByLast30Days: ContributionsDay[];
  contributionCountByDayOfWeek: ContributionCountByDayOfWeek[];
};

async function getGithubActivities() {
  if (!env.GITHUB_ACCESS_TOKEN) {
    return {
      contributionsByLast30Days: [],
      contributionCountByDayOfWeek: [],
    };
  }

  const contributions: Contributions = {
    contributionsByLast30Days: [],
    contributionCountByDayOfWeek: [],
  };

  const now = new Date();
  const from = formatISO(subDays(now, DAYS_TO_FETCH));
  const to = formatISO(now);
  const q = {
    query: `
    query userInfo($LOGIN: String!, $FROM: DateTime!, $TO: DateTime!) {
              user(login: $LOGIN) {
                name
                contributionsCollection(from: $FROM, to: $TO) {
                  contributionCalendar {
                    weeks {
                      contributionDays {
                        contributionCount
                        date
                      }
                    }
                  }
                }
              }
            }
          `,
    variables: {
      LOGIN: "fazers",
      FROM: from,
      TO: to,
    },
  };

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify(q),
    headers,
  });

  if (!response.ok) {
    return contributions;
  }

  const apiResponse = await response.json();

  if (apiResponse.errors) {
    return contributions;
  }

  const contributionsCollection: ContributionsCollection =
    apiResponse.data.user.contributionsCollection;

  const contributionWeeks = contributionsCollection.contributionCalendar.weeks;

  for (const week of contributionWeeks) {
    for (const { date, contributionCount } of week.contributionDays) {
      contributions.contributionsByLast30Days.push({
        date,
        contributionCount,
      });
    }
  }

  contributions.contributionCountByDayOfWeek = calculateMostProductiveDayOfWeek(
    contributionsCollection.contributionCalendar
  );

  return contributions;
}

// Function to calculate the productive data by days
function calculateMostProductiveDayOfWeek(
  contributionCalendar: ContributionCalendar
): { day: string; count: number }[] {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const contributionCountByDayOfWeek: ContributionCountByDay = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };

  for (const week of contributionCalendar.weeks) {
    for (const day of week.contributionDays) {
      const date = new Date(day.date);
      const dayOfWeek = daysOfWeek[date.getUTCDay()];
      contributionCountByDayOfWeek[dayOfWeek] += day.contributionCount;
    }
  }

  const sortedData = Object.entries(contributionCountByDayOfWeek)
    .sort((a, b) => daysOfWeek.indexOf(a[0]) - daysOfWeek.indexOf(b[0]))
    .map(([day, count]) => ({ day, count }));

  const sunday = sortedData.shift();

  if (sunday) {
    sortedData.push(sunday);
  }

  return sortedData;
}

export { getGithubStats, getGithubActivities };
