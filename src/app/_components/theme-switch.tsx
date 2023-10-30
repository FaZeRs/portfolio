"use client";

import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";
  return (
    <button
      id="dark-mode"
      className="icon-btn mx-2 !outline-none"
      title="Toggle dark mode"
      onClick={() => setTheme(nextTheme)}
    >
      <div className="i-carbon-sun dark:i-carbon-moon" />
      {theme === "dark" ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
    </button>
  );
};

export default ThemeSwitch;
