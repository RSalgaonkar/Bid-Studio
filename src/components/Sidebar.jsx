import React from "react";

function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="sidebar bg-dark text-white p-3">
      <div className="sidebar-brand mb-4">
        <h4 className="mb-1 font-weight-bold">Bid Studio</h4>
        <small className="text-muted-custom">Freelance Pipeline</small>
      </div>

      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <button
            className={`nav-link nav-btn text-left w-100 ${
              activePage === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </button>
        </li>

        <li className="nav-item mb-2">
          <button
            className={`nav-link nav-btn text-left w-100 ${
              activePage === "clients" ? "active" : ""
            }`}
            onClick={() => setActivePage("clients")}
          >
            Clients
          </button>
        </li>

        <li className="nav-item mb-2">
          <button
            className={`nav-link nav-btn text-left w-100 ${
              activePage === "bids" ? "active" : ""
            }`}
            onClick={() => setActivePage("bids")}
          >
            Bids
          </button>
        </li>

        <li className="nav-item mb-2">
          <button
            className={`nav-link nav-btn text-left w-100 ${
              activePage === "analytics" ? "active" : ""
            }`}
            onClick={() => setActivePage("analytics")}
          >
            Analytics
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;