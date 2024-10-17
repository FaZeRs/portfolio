import { env } from "~/env";

export const baseUrl: string =
  env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:8000";
