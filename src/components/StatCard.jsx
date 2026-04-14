import React from "react";

function StatCard({ title, value, subtitle, color }) {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <p className="text-muted mb-2 small">{title}</p>
        <h3 className={`fw-bold mb-1 text-${color}`}>{value}</h3>
        <p className="mb-0 text-secondary small">{subtitle}</p>
      </div>
    </div>
  );
}

export default StatCard;