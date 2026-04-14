import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import ClientsPage from "./pages/ClientsPage";
import BidsPage from "./pages/BidsPage";
import AnalyticsPage from "./pages/AnalyticsPage";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <>
      {activePage === "dashboard" && (
        <Dashboard setActivePage={setActivePage} />
      )}

      {activePage === "clients" && (
        <ClientsPage setActivePage={setActivePage} />
      )}

      {activePage === "bids" && (
        <BidsPage setActivePage={setActivePage} />
      )}

      {activePage === "analytics" && (
        <AnalyticsPage setActivePage={setActivePage} />
      )}
    </>
  );
}

export default App;