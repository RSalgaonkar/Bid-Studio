import React, { useState } from "react";
import DashboardPage from "./pages/Dashboard";
import ClientsPage from "./pages/ClientsPage";
import BidsPage from "./pages/BidsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import useTheme from "./hooks/useTheme";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const { theme, toggleTheme } = useTheme();

  const sharedProps = {
    setActivePage,
    theme,
    toggleTheme,
  };

  return (
    <>
      {activePage === "dashboard" && (
        <DashboardPage setActivePage={setActivePage} theme={theme} toggleTheme={toggleTheme} />
      )}

      {activePage === "clients" && (
        <ClientsPage setActivePage={setActivePage} theme={theme} toggleTheme={toggleTheme} />
      )}

      {activePage === "bids" && (
        <BidsPage setActivePage={setActivePage} theme={theme} toggleTheme={toggleTheme} />
      )}
      {activePage === "analytics" && <AnalyticsPage {...sharedProps} />}
    </>
  );
}

export default App;