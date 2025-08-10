import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
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
    minify: "terser",
    target: "esnext",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({
      tsr: {
        quoteStyle: "double",
        semicolons: true,
        // verboseFileRoutes: false,
      },

      // https://tanstack.com/start/latest/docs/framework/react/hosting#deployment
      // target: "node-server",

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
  ssr: {
    noExternal: ["react-use", "react-markdown"],
  },
  optimizeDeps: {
    include: ["react-use", "react-markdown"],
  },
});
