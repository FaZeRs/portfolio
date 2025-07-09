import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import dotenv from "dotenv";
import unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

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
    tailwindcss(),
    tanstackStart({
      // https://react.dev/learn/react-compiler
      react: {
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
      },

      tsr: {
        quoteStyle: "double",
        semicolons: true,
        // verboseFileRoutes: false,
      },

      // https://tanstack.com/start/latest/docs/framework/react/hosting#deployment
      // target: "node-server",
    }),
    unfonts({
      google: {
        families: ["Geist", "Geist Mono"],
      },
    }),
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
