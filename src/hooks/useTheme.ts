/**
 * Theme hook — manages dark/light theme state with Ctrl+T toggle
 */
import { useState, useCallback } from "react";
import { useInput } from "ink";
import { darkTheme, lightTheme, type Theme } from "../themes/themes.js";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(darkTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev.name === "dark" ? lightTheme : darkTheme));
  }, []);

  // Ctrl+T to toggle theme
  useInput((_input, key) => {
    if (key.ctrl && _input === "t") {
      toggleTheme();
    }
  });

  return { theme, toggleTheme };
}
