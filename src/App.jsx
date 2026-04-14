import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
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
      {activePage === "dashboard" && <Dashboard {...sharedProps} />}
      {activePage === "clients" && <ClientsPage {...sharedProps} />}
      {activePage === "bids" && <BidsPage {...sharedProps} />}
      {activePage === "analytics" && <AnalyticsPage {...sharedProps} />}
    </>
  );
}

export default App;