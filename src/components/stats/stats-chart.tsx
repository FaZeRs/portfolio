import {
  CartesianGrid,
  Line,
  LineChart,
  TooltipContentProps,
  XAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

type MonthlyData = { month: string; count: number }[];

const TICK_MARGIN_DEFAULT = 8;
const JS_MONTH_INDEX_BASE = 1; // convert human month to JS month index

type StatsChartProps = {
  title: string;
  description: string;
  data: MonthlyData;
  chartColor: string;
  label: string;
};

export function StatsChart({
  title,
  description,
  data,
  chartColor,
  label,
}: StatsChartProps) {
  const chartData = (data ?? []) as MonthlyData;

  const chartConfig = {
    count: {
      label,
      color: chartColor,
    },
  } satisfies ChartConfig;

  const formatMonthKeyToShort = (key: string) => {
    const [year, month] = key.split("-");
    const date = new Date(
      Date.UTC(Number(year), Number(month) - JS_MONTH_INDEX_BASE, 1)
    );
    return date.toLocaleString(undefined, { month: "short" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              tickFormatter={(value: string) => formatMonthKeyToShort(value)}
              tickLine={false}
              tickMargin={TICK_MARGIN_DEFAULT}
            />
            <ChartTooltip
              content={(props: TooltipContentProps<ValueType, NameType>) => (
                <ChartTooltipContent {...props} hideIndicator hideLabel />
              )}
              cursor={false}
            />
            <Line
              dataKey="count"
              dot={false}
              stroke="var(--color-count)"
              strokeWidth={2}
              type="linear"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
