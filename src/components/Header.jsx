import React from "react";

function Header() {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="mb-1">Dashboard</h2>
        <p className="text-muted mb-0">Track bids, clients, and proposal pipeline.</p>
      </div>
      <button className="btn btn-primary">+ New Bid</button>
    </div>
  );
}

export default Header;