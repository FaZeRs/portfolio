import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { generateSitemap } from "tanstack-router-sitemap";
import unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import sitemap from "./src/plugins/sitemap";

dotenv.config();

export default defineConfig({
  build: {
    sourcemap: true,
    target: "es2022",
  },
  plugins: [
    devtools({
      eventBusConfig: {
        debug: false,
      },
      enhancedLogs: {
        enabled: true,
      },
    }),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
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
    nitroV2Plugin({
      compatibilityDate: "latest",
      esbuild: {
        options: {
          target: "es2022",
        },
      },
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
    unfonts({
      google: {
        families: ["Geist", "Geist Mono"],
      },
    }),
    generateSitemap(sitemap),
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
  server: {
    warmup: {
      clientFiles: ["./src/server.ts"],
    },
  },
});
