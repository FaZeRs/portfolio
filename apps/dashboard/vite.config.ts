import path from "node:path";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export default defineConfig({
  build: {
    sourcemap: true,
    target: "es2022",
  },
  experimental: {
    enableNativePlugin: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    devtools({
      eventBusConfig: {
        port: 1235,
        debug: false,
      },
      enhancedLogs: {
        enabled: true,
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
    }),
    viteReact({
      // https://react.dev/learn/react-compiler
      babel: {
        plugins: [
          [
            "babel-plugin-react-compiler",
            {
              target: "19",
            },
          ],
        ],
      },
    }),
    tailwindcss(),
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      telemetry: false,
      sourcemaps: {
        disable: false,
      },
    }),
  ],
  optimizeDeps: {
    entries: ["src/**/*.tsx", "src/**/*.ts"],
  },
  ssr: {
    noExternal: ["@acme/db"],
  },
});
