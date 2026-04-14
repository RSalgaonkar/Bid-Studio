import React from "react";

function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="sidebar bg-dark text-white p-3">
      <h4 className="mb-4">Bid Studio</h4>

      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <button
            className={`nav-link text-left w-100 btn ${
              activePage === "dashboard" ? "btn-primary text-white" : "btn-link text-light"
            }`}
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </button>
        </li>

        <li className="nav-item mb-2">
          <button
            className={`nav-link text-left w-100 btn ${
              activePage === "clients" ? "btn-primary text-white" : "btn-link text-light"
            }`}
            onClick={() => setActivePage("clients")}
          >
            Clients
          </button>
        </li>

        <li className="nav-item mb-2">
          <button className="nav-link text-left w-100 btn btn-link text-light" disabled>
            Bids
          </button>
        </li>

        <li className="nav-item mb-2">
          <button className="nav-link text-left w-100 btn btn-link text-light" disabled>
            Analytics
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;