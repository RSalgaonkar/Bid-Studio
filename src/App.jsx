import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import BidsPage from "./pages/BidsPage";
import ClientsPage from "./pages/ClientsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CommandPalette from "./components/CommandPalette";
import useCommandPalette from "./hooks/useCommandPalette";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [theme, setTheme] = useState("light");

  const {
    isOpen: isCommandPaletteOpen,
    openPalette,
    closePalette,
  } = useCommandPalette();

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const renderPage = () => {
    switch (activePage) {
      case "bids":
        return (
          <BidsPage
            setActivePage={setActivePage}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );

      case "clients":
        return (
          <ClientsPage
            setActivePage={setActivePage}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );

      case "analytics":
        return (
          <AnalyticsPage
            setActivePage={setActivePage}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );

      case "dashboard":
      default:
        return (
          <Dashboard
            setActivePage={setActivePage}
            theme={theme}
            toggleTheme={toggleTheme}
            openCommandPalette={openPalette}
          />
        );
    }
  };

  return (
    <div className={theme === "dark" ? "theme-dark" : "theme-light"}>
      {renderPage()}

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={closePalette}
        setActivePage={setActivePage}
        toggleTheme={toggleTheme}
        theme={theme}
      />

      <button
        type="button"
        onClick={openPalette}
        className="btn btn-dark shadow-sm"
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          zIndex: 1050,
          borderRadius: "999px",
          padding: "10px 16px",
        }}
        aria-label="Open command palette"
      >
        Ctrl + K
      </button>
    </div>
  );
}

export default App;