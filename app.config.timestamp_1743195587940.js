var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) =>
  function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])((fn = 0))), res;
  };
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};

// src/env.ts
var env_exports = {};
__export(env_exports, {
  env: () => env,
});
import { createEnv } from "@t3-oss/env-core";
import { vercel } from "@t3-oss/env-core/presets-zod";
import { z } from "zod";
var env;
var init_env = __esm({
  "src/env.ts"() {
    "use strict";
    env = createEnv({
      extends: [vercel()],
      shared: {
        NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
      },
      /**
       * Specify your server-side environment variables schema here.
       * This way you can ensure the app isn't built with invalid env vars.
       */
      server: {
        DATABASE_URL: z.string().url(),
        RESEND_API_KEY: z.string().min(1).optional(),
        RESEND_FROM_EMAIL: z.string().min(1).optional(),
        DISCORD_CLIENT_ID: z.string().min(1).optional(),
        DISCORD_CLIENT_SECRET: z.string().min(1).optional(),
        GITHUB_CLIENT_ID: z.string().min(1).optional(),
        GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
        GOOGLE_CLIENT_ID: z.string().min(1).optional(),
        GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
        VITE_BASE_URL: z.string().min(1),
      },
      /**
       * What object holds the environment variables at runtime. This is usually
       * `process.env` or `import.meta.env`.
       */
      runtimeEnv: process.env,
      /**
       * By default, this library will feed the environment variables directly to
       * the Zod validator.
       *
       * This means that if you have an empty string for a value that is supposed
       * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
       * it as a type mismatch violation. Additionally, if you have an empty string
       * for a value that is supposed to be a string with a default value (e.g.
       * `DOMAIN=` in an ".env" file), the default value will never be applied.
       *
       * In order to solve these issues, we recommend that all new projects
       * explicitly specify this option as true.
       */
      emptyStringAsUndefined: true,
    });
  },
});

// app.config.ts
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/react-start/config";
import unfonts from "unplugin-fonts/vite";
import { loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
var app_config_default = defineConfig(async ({ mode }) => {
  import.meta.env = loadEnv(mode, process.cwd());
  await Promise.resolve().then(() => (init_env(), env_exports));
  return {
    vite: {
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
        noExternal: ["react-use"],
      },
      optimizeDeps: {
        include: ["react-use"],
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
  };
});
export { app_config_default as default };
