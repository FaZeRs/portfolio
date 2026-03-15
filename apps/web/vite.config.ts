import path from "node:path";
import babel from "@rolldown/plugin-babel";
import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

dotenv.config({ path: path.resolve(import.meta.dirname, "../../.env") });

export default defineConfig({
  build: {
    sourcemap: true,
    target: "es2022",
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    devtools({
      eventBusConfig: {
        port: 1234,
        debug: false,
      },
      enhancedLogs: {
        enabled: true,
      },
    }),
    sentryTanstackStart({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      telemetry: false,
      sourcemaps: {
        disable: false,
      },
    }),
    tanstackStart({
      srcDirectory: "./src",
      start: { entry: "./start.tsx" },
      server: { entry: "./server.ts" },
      router: {
        quoteStyle: "double",
        semicolons: true,
        routeToken: "layout",
      },
    }),
    nitro({
      compatibilityDate: "latest",
      preset: process.env.VERCEL ? "vercel" : "node",
    }),
    viteReact(),
    babel({ presets: [reactCompilerPreset({ target: "19" })] }),
    tailwindcss(),
  ],
  optimizeDeps: {
    entries: ["src/**/*.tsx", "src/**/*.ts"],
  },
  ssr: {
    noExternal: ["@acme/db"],
  },
});
