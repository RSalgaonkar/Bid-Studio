import React from "react";

function DeadlineRiskCard({ data }) {
  const { riskyCount = 0, riskyBids = [] } = data || {};

  const getTextClass = (urgency) => {
    switch (urgency) {
      case "overdue":
        return "text-danger";
      case "critical":
        return "text-danger";
      case "warning":
        return "text-warning";
      default:
        return "text-muted";
    }
  };

  return (
    <div className="card border-0 shadow-sm h-100 soft-card">
      <div className="card-body">
        <h5 className="font-weight-bold mb-1">Deadline Risk</h5>
        <p className="text-muted small mb-3">
          Pending bids needing attention soon
        </p>

        <div className="mb-3">
          <p className="small text-muted mb-1">Risky Pending Bids</p>
          <h4 className="mb-0 text-danger">{riskyCount}</h4>
        </div>

        <ul className="list-group list-group-flush snapshot-list">
          {riskyBids.length > 0 ? (
            riskyBids.slice(0, 5).map((bid) => (
              <li
                key={bid.id}
                className="list-group-item d-flex justify-content-between px-0"
              >
                <span>{bid.title}</span>
                <strong className={getTextClass(bid.urgency)}>
                  {bid.daysLeft < 0 ? `${Math.abs(bid.daysLeft)}d overdue` : `${bid.daysLeft}d left`}
                </strong>
              </li>
            ))
          ) : (
            <li className="list-group-item px-0 text-muted">
              No deadline risk right now
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default DeadlineRiskCard;