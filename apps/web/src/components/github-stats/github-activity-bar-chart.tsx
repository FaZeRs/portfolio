import { useTheme } from "@acme/ui/theme-provider";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ContributionCountByDayOfWeekToolTip from "~/components/github-stats/contribution-count-by-day-of-week-tooltip";
import { ContributionCountByDayOfWeek } from "~/lib/github";

type GithubActivityBarChartProps = {
  contributionCountByDayOfWeek?: ContributionCountByDayOfWeek[];
};

export default function GithubActivityBarChart({
  contributionCountByDayOfWeek,
}: Readonly<GithubActivityBarChartProps>) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const barGraphLoadingData = [
    { day: "Monday", count: 16 },
    { day: "Tuesday", count: 13 },
    { day: "Wednesday", count: 4 },
    { day: "Thursday", count: 6 },
    { day: "Friday", count: 9 },
    { day: "Saturday", count: 12 },
    { day: "Sunday", count: 1 },
  ];

  return (
    <div className="relative h-[300px] w-full">
      {contributionCountByDayOfWeek ? (
        <ResponsiveContainer height={300} width="100%">
          <BarChart
            data={contributionCountByDayOfWeek}
            height={250}
            margin={{ top: 25, left: -30 }}
            width={730}
          >
            <CartesianGrid
              stroke={isDarkMode ? "#ffffff20" : "#00000020"}
              strokeDasharray="2 3"
            />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              content={ContributionCountByDayOfWeekToolTip}
              cursor={{ fill: isDarkMode ? "#ffffff20" : "#00000020" }}
            />
            <Bar dataKey="count" fill="#26a641" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <>
          <div className="absolute inset-0 z-1 grid place-items-center font-semibold text-muted-foreground sm:text-lg">
            Loading Data...
          </div>
          <ResponsiveContainer>
            <BarChart
              className="pointer-events-none opacity-50"
              data={barGraphLoadingData}
              height={250}
              margin={{ top: 25, left: -30 }}
              width={730}
            >
              <CartesianGrid
                stroke={isDarkMode ? "#ffffff20" : "#00000020"}
                strokeDasharray="2 3"
              />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                content={ContributionCountByDayOfWeekToolTip}
                cursor={{ fill: isDarkMode ? "#ffffff20" : "#00000020" }}
              />
              <Bar dataKey="count" fill={isDarkMode ? "#404040" : "#ababab"} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
