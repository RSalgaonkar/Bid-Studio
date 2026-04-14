import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import ClientsPage from "./pages/ClientsPage";

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
    </>
  );
}

export default App;