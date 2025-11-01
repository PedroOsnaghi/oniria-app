import { useState, useEffect } from "react";
import Icon from "@/assets/icons/Icon";
import { getTheme, toggleTheme, type Theme } from "../services/themeService";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>(() => getTheme());
  const isDark = theme === "dark";

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setThemeState(newTheme);
  };

  return (
    <div
      className="group hidden h-full md:flex bg-gray-700/45 items-center gap-2 rounded-full px-2 py-1.5 border transition-all duration-200 ease-out cursor-pointer backdrop-blur-2xl relative"
      style={{
        borderColor: "var(--user-border)",
      }}
      onClick={handleToggle}
    >
      {/* Input oculto */}
      <input
        type="checkbox"
        checked={isDark}
        onChange={handleToggle}
        className="sr-only"
        aria-label="Toggle theme"
      />

      {/* Fondo animado que se desplaza */}
      <div
        className={`absolute top-1.5 h-8 rounded-full transition-all duration-300 ease-out ${
          isDark
            ? "right-2 w-8 origin-right group-hover:w-12"
            : "left-2 w-8 group-hover:w-12"
        }`}
        style={{
          backgroundColor: isDark
            ? "var(--color-highlight)"
            : "var(--color-primary)",
        }}
      />

      {/* Iconos */}
      <div className="relative z-10 flex items-center justify-center w-8 h-8">
        <Icon
          name="sun"
          className={`w-5 h-5 transition-colors duration-300 ${
            !isDark ? "text-white" : "text-gray-400"
          }`}
        />
      </div>
      
      <div className="relative z-10 flex items-center justify-center w-8 h-8">
        <Icon
          name="moon"
          className={`w-5 h-5 transition-colors duration-300 ${
            isDark ? "text-white" : "text-gray-400"
          }`}
        />
      </div>
    </div>
  );
}
