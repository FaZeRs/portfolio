import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/react-start/config";
import unfonts from "unplugin-fonts/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
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
    prerender: {
      routes: ["/"],
      crawlLinks: true,
    },
    // https://tanstack.com/start/latest/docs/framework/react/hosting#deployment
    // preset: "netlify",
  },
});
