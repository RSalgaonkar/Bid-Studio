import { useEffect, useState } from "react";
import {
  loadThemePreference,
  saveThemePreference,
} from "../utils/localStorage";

function useTheme() {
  const [theme, setTheme] = useState(loadThemePreference);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    saveThemePreference(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return {
    theme,
    toggleTheme,
  };
}

export default useTheme;