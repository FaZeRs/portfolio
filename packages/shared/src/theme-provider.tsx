import { ScriptOnce } from "@tanstack/react-router";
import { createClientOnlyFn, createIsomorphicFn } from "@tanstack/react-start";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { z } from "zod/v4";

const themeModeSchema = z.enum(["light", "dark", "auto"]);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used for type inference
const resolvedThemeSchema = z.enum(["light", "dark"]);
const themeKey = "theme";

type ThemeMode = z.infer<typeof themeModeSchema>;
type ResolvedTheme = z.infer<typeof resolvedThemeSchema>;

const THEME_COLORS = {
  light: "#f9fafb", // Tailwind gray-50
  dark: "#101828", // Tailwind gray-900
} as const;

const getStoredThemeMode = createIsomorphicFn()
  .server((): ThemeMode => "auto")
  .client((): ThemeMode => {
    try {
      const storedTheme = localStorage.getItem(themeKey);
      return themeModeSchema.parse(storedTheme);
    } catch {
      return "auto";
    }
  });

const setStoredThemeMode = createClientOnlyFn((theme: ThemeMode) => {
  try {
    const parsedTheme = themeModeSchema.parse(theme);
    localStorage.setItem(themeKey, parsedTheme);
  } catch {
    // Silently fail if localStorage is unavailable
  }
});

const getSystemTheme = createIsomorphicFn()
  .server((): ResolvedTheme => "light")
  .client(
    (): ResolvedTheme =>
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
  );

const updateThemeClass = createClientOnlyFn((themeMode: ThemeMode) => {
  const root = document.documentElement;
  root.classList.remove("light", "dark", "auto");
  const newTheme = themeMode === "auto" ? getSystemTheme() : themeMode;
  root.classList.add(newTheme);

  if (themeMode === "auto") {
    root.classList.add("auto");
  }

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      "content",
      newTheme === "dark" ? THEME_COLORS.dark : THEME_COLORS.light
    );
  }
});

const getNextTheme = createClientOnlyFn((current: ThemeMode): ThemeMode => {
  const themes: ThemeMode[] =
    getSystemTheme() === "dark"
      ? ["auto", "light", "dark"]
      : ["auto", "dark", "light"];
  // biome-ignore lint/style/noNonNullAssertion: valid case
  return themes[(themes.indexOf(current) + 1) % themes.length]!;
});

const themeDetectorScript = (() => {
  function themeFn() {
    try {
      const storedTheme = localStorage.getItem("theme") || "auto";
      const validTheme = ["light", "dark", "auto"].includes(storedTheme)
        ? storedTheme
        : "auto";

      if (validTheme === "auto") {
        const autoTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        document.documentElement.classList.add(autoTheme, "auto");
      } else {
        document.documentElement.classList.add(validTheme);
      }
    } catch (_e) {
      const autoTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      document.documentElement.classList.add(autoTheme, "auto");
    }
  }
  return `(${themeFn.toString()})();`;
})();

interface ThemeContextProps {
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  themeMode: ThemeMode;
  toggleMode: () => void;
}
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}
const getResolvedThemeFromDOM = createIsomorphicFn()
  .server((): ResolvedTheme => "light")
  .client(
    (): ResolvedTheme =>
      document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredThemeMode);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(
    getResolvedThemeFromDOM
  );

  // Sync resolved theme from DOM on mount (handles SSR -> client transition)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional hydration after SSR
    setResolvedTheme(getResolvedThemeFromDOM());
  }, []);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (themeMode !== "auto") {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      updateThemeClass("auto");
      setResolvedTheme(getSystemTheme());
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [themeMode]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeMode(newTheme);
    setStoredThemeMode(newTheme);
    updateThemeClass(newTheme);
    setResolvedTheme(newTheme === "auto" ? getSystemTheme() : newTheme);
  };

  const toggleMode = () => {
    setTheme(getNextTheme(themeMode));
  };

  return (
    <ThemeContext.Provider
      value={{ themeMode, resolvedTheme, setTheme, toggleMode }}
    >
      {/** biome-ignore lint/correctness/noChildrenProp: valid */}
      <ScriptOnce children={themeDetectorScript} />
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
