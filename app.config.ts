import { wrapVinxiConfigWithSentry } from "@sentry/tanstackstart-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/react-start/config";
import unfonts from "unplugin-fonts/vite";
import tsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
  vite: {
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
      unfonts({
        google: {
          families: ["Geist", "Geist Mono"],
        },
      }),
    ],
    ssr: {
      noExternal: ["react-use", "react-markdown"],
    },
    optimizeDeps: {
      include: ["react-use", "react-markdown"],
    },
  },

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
    // https://github.com/TanStack/router/discussions/2863#discussioncomment-12458714
    appDirectory: "./src",
  },

  server: {
    // https://tanstack.com/start/latest/docs/framework/react/hosting#deployment
    // preset: "netlify",
  },

  routers: {
    client: {
      vite: {
        plugins: [
          sentryVitePlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            telemetry: false,
          }),
        ],
      },
    },
  },
});

export default wrapVinxiConfigWithSentry(config, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Only print logs for uploading source maps in CI
  // Set to `true` to suppress logs
  silent: !process.env.CI,
});
