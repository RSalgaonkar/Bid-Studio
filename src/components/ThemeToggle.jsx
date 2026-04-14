import React from "react";

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      className="btn theme-toggle-btn ml-2"
      onClick={onToggle}
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌙 Dark" : "☀ Light"}
    </button>
  );
}

export default ThemeToggle;