import { format, subDays } from "date-fns";
import { useTheme } from "next-themes";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ContributionsTooltip from "~/components/stats/contributions-tooltip";
import { ContributionsDay } from "~/types";

type GithubActivityAreaChartProps = {
  contributionsByLast30Days?: ContributionsDay[];
};

const CONTRIBUTION_COUNT_RANDOM = 20;

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: valid function
export default function GithubActivityAreaChart({
  contributionsByLast30Days,
}: Readonly<GithubActivityAreaChartProps>) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  function getChartLoadingData() {
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        shortDate: format(date, "dd"),
        contributionCount: Math.floor(
          Math.random() * CONTRIBUTION_COUNT_RANDOM
        ),
      };
    });

    return dates.reverse();
  }

  const transformedData = contributionsByLast30Days?.map((item) => ({
    ...item,
    shortDate: format(new Date(item.date), "dd"),
  }));

  return (
    <div className="relative h-[300px] w-full">
      {contributionsByLast30Days ? (
        <ResponsiveContainer>
          <AreaChart
            data={transformedData}
            height={250}
            margin={{ top: 25, left: -30 }}
            width={730}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isDarkMode ? "#26a64160" : "#26a641"}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={isDarkMode ? "#26a64160" : "#26a641"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="shortDate" />
            <YAxis />
            <CartesianGrid
              stroke={isDarkMode ? "#ffffff20" : "#00000020"}
              strokeDasharray="2 3"
            />
            <Tooltip content={ContributionsTooltip} />
            <Area
              activeDot
              aria-label="count"
              dataKey="contributionCount"
              dot
              fill="url(#colorUv)"
              fillOpacity={1}
              stroke={isDarkMode ? "#26a641" : "#216e39"}
              strokeWidth={3}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <>
          <div className="absolute inset-0 z-1 grid place-items-center font-semibold text-muted-foreground sm:text-lg">
            Loading Data...
          </div>
          <ResponsiveContainer>
            <AreaChart
              className="pointer-events-none opacity-50"
              data={getChartLoadingData()}
              height={250}
              margin={{ top: 25, left: -30 }}
              width={730}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isDarkMode ? "#404040" : "#ababab"}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={isDarkMode ? "#404040" : "#ababab"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="shortDate" />
              <YAxis />
              <CartesianGrid
                stroke={isDarkMode ? "#ffffff20" : "#00000020"}
                strokeDasharray="2 3"
              />
              <Area
                activeDot
                aria-label="count"
                dataKey="contributionCount"
                dot
                fill="url(#colorUv)"
                fillOpacity={1}
                stroke={isDarkMode ? "#404040" : "#ababab"}
                strokeWidth={3}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
