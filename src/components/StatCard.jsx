import React from "react";

function StatCard({ title, value, subtitle, color }) {
  return (
    <div className="card stat-card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="stat-top mb-3">
          <span className={`stat-dot bg-${color}`}></span>
          <span className="text-muted small text-uppercase">{title}</span>
        </div>
        <h3 className={`font-weight-bold text-${color} mb-1`}>{value}</h3>
        <p className="text-muted mb-0 small">{subtitle}</p>
      </div>
    </div>
  );
}

export default StatCard;