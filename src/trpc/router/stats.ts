import { TRPCRouterRecord } from "@trpc/server";
import { sql } from "drizzle-orm";
import { z } from "zod/v4";
import { articles, user } from "~/lib/server/schema";

import { protectedProcedure } from "~/trpc/init";

const DEFAULT_MONTHS = 6;
const MIN_MONTHS = 1;
const MAX_MONTHS = 24;
const FIRST_DAY = 1;

// Shared input schema
const statsInputSchema = z
  .object({
    months: z.number().min(MIN_MONTHS).max(MAX_MONTHS).default(DEFAULT_MONTHS),
  })
  .optional();

// Helper function to calculate start date for a given number of months back
function calculateStartDate(months: number): Date {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), FIRST_DAY)
  );
  start.setUTCMonth(start.getUTCMonth() - (months - 1));
  return start;
}

// Helper function to process monthly data into continuous range
function processMonthlyData(
  result: { rows: Record<string, unknown>[] },
  start: Date,
  months: number
): { month: string; count: number }[] {
  const monthCounts = new Map<string, number>();
  for (const row of result.rows as {
    month: string;
    count: number;
  }[]) {
    monthCounts.set(row.month, Number(row.count));
  }

  const data: { month: string; count: number }[] = [];
  const cursor = new Date(start);
  for (let i = 0; i < months; i += 1) {
    const key = `${cursor.getUTCFullYear()}-${String(
      cursor.getUTCMonth() + 1
    ).padStart(2, "0")}`;
    data.push({ month: key, count: monthCounts.get(key) ?? 0 });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return data;
}

export const statsRouter = {
  monthlyUsers: protectedProcedure
    .input(statsInputSchema)
    .query(async ({ ctx, input }) => {
      const months = input?.months ?? DEFAULT_MONTHS;
      const start = calculateStartDate(months);

      // Fetch monthly counts from DB
      const result = await ctx.db.execute(
        sql<{ month: string; count: number }>`
          SELECT to_char(date_trunc('month', ${user.createdAt}), 'YYYY-MM') AS month,
                 COUNT(*)::int AS count
          FROM ${user}
          WHERE ${user.createdAt} >= ${start}
          GROUP BY 1
          ORDER BY 1
        `
      );

      return processMonthlyData(result, start, months);
    }),
  monthlyBlogViews: protectedProcedure
    .input(statsInputSchema)
    .query(async ({ ctx, input }) => {
      const months = input?.months ?? DEFAULT_MONTHS;
      const start = calculateStartDate(months);

      // Fetch monthly aggregated views from DB by article publish month
      const result = await ctx.db.execute(
        sql<{ month: string; count: number }>`
          SELECT to_char(date_trunc('month', ${articles.createdAt}), 'YYYY-MM') AS month,
                 SUM(${articles.views})::int AS count
          FROM ${articles}
          WHERE ${articles.createdAt} >= ${start}
          GROUP BY 1
          ORDER BY 1
        `
      );

      return processMonthlyData(result, start, months);
    }),
} satisfies TRPCRouterRecord;
