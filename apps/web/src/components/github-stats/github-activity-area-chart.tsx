import { ContributionsDay } from "@acme/types";
import { useTheme } from "@acme/ui/theme-provider";
import { format, subDays } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ContributionsTooltip from "~/components/github-stats/contributions-tooltip";

type GithubActivityAreaChartProps = {
  contributionsByLast30Days?: ContributionsDay[];
};

type ChartColors = {
  gradientStart: string;
  gradientEnd: string;
  stroke: string;
};

type AreaChartComponentProps = {
  data: Array<{ shortDate: string; contributionCount: number }>;
  colors: ChartColors;
  gridStroke: string;
  className?: string;
  showTooltip?: boolean;
};

const CONTRIBUTION_COUNT_RANDOM = 20;

const CHART_CONFIG = {
  height: 250,
  margin: { top: 25, left: -30 },
  width: 730,
  strokeDasharray: "2 3",
} as const;

const AREA_CONFIG = {
  activeDot: true,
  "aria-label": "count",
  dataKey: "contributionCount",
  dot: true,
  fill: "url(#colorUv)",
  fillOpacity: 1,
  strokeWidth: 3,
  type: "monotone" as const,
};

function AreaChartComponent({
  data,
  colors,
  gridStroke,
  className,
  showTooltip = false,
}: Readonly<AreaChartComponentProps>) {
  return (
    <ResponsiveContainer>
      <AreaChart
        className={className}
        data={data}
        height={CHART_CONFIG.height}
        margin={CHART_CONFIG.margin}
        width={CHART_CONFIG.width}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="5%"
              stopColor={colors.gradientStart}
              stopOpacity={0.8}
            />
            <stop offset="95%" stopColor={colors.gradientEnd} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="shortDate" />
        <YAxis />
        <CartesianGrid
          stroke={gridStroke}
          strokeDasharray={CHART_CONFIG.strokeDasharray}
        />
        {showTooltip && <Tooltip content={ContributionsTooltip} />}
        <Area {...AREA_CONFIG} stroke={colors.stroke} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function GithubActivityAreaChart({
  contributionsByLast30Days,
}: Readonly<GithubActivityAreaChartProps>) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

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

  const dataColors: ChartColors = {
    gradientStart: isDarkMode ? "#26a64160" : "#26a641",
    gradientEnd: isDarkMode ? "#26a64160" : "#26a641",
    stroke: isDarkMode ? "#26a641" : "#216e39",
  };

  const loadingColors: ChartColors = {
    gradientStart: isDarkMode ? "#404040" : "#ababab",
    gradientEnd: isDarkMode ? "#404040" : "#ababab",
    stroke: isDarkMode ? "#404040" : "#ababab",
  };

  const gridStroke = isDarkMode ? "#ffffff20" : "#00000020";

  return (
    <div className="relative h-[300px] w-full">
      {contributionsByLast30Days ? (
        <AreaChartComponent
          colors={dataColors}
          data={contributionsByLast30Days.map((item) => ({
            ...item,
            shortDate: format(new Date(item.date), "dd"),
          }))}
          gridStroke={gridStroke}
          showTooltip={true}
        />
      ) : (
        <>
          <div className="absolute inset-0 z-1 grid place-items-center font-semibold text-muted-foreground sm:text-lg">
            Loading Data...
          </div>
          <AreaChartComponent
            className="pointer-events-none opacity-50"
            colors={loadingColors}
            data={getChartLoadingData()}
            gridStroke={gridStroke}
            showTooltip={false}
          />
        </>
      )}
    </div>
  );
}
