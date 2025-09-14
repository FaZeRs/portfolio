import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
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
    target: "esnext",
    minify: "esbuild",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
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
      tsr: {
        quoteStyle: "double",
        semicolons: true,
        routeToken: "layout",
        // verboseFileRoutes: false,
      },

      // https://tanstack.com/start/latest/docs/framework/react/hosting#deployment
      target: process.env.DEPLOY_TARGET ?? "node-server",

      customViteReactPlugin: true,
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
    }),
  ],
  optimizeDeps: {
    entries: ["src/**/*.tsx", "src/**/*.ts"],
  },
  server: {
    warmup: {
      clientFiles: ["./src/server.tsx"],
    },
  },
});
