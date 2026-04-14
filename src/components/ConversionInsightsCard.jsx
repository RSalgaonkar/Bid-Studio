import React from "react";

function ConversionInsightsCard({ data }) {
  const {
    total = 0,
    pendingCount = 0,
    approvedCount = 0,
    rejectedCount = 0,
    approvalRate = 0,
    rejectionRate = 0,
    pendingRate = 0,
  } = data || {};

  return (
    <div className="card border-0 shadow-sm h-100 soft-card">
      <div className="card-body">
        <h5 className="font-weight-bold mb-1">Conversion Insights</h5>
        <p className="text-muted small mb-4">
          Snapshot of approval, rejection, and pending rates
        </p>

        <div className="row text-center mb-4">
          <div className="col-3">
            <p className="small text-muted mb-1">Total</p>
            <h6>{total}</h6>
          </div>
          <div className="col-3">
            <p className="small text-muted mb-1">Pending</p>
            <h6>{pendingCount}</h6>
          </div>
          <div className="col-3">
            <p className="small text-muted mb-1">Approved</p>
            <h6 className="text-success">{approvedCount}</h6>
          </div>
          <div className="col-3">
            <p className="small text-muted mb-1">Rejected</p>
            <h6 className="text-danger">{rejectedCount}</h6>
          </div>
        </div>

        <ul className="list-group list-group-flush snapshot-list">
          <li className="list-group-item d-flex justify-content-between px-0">
            <span>Approval Rate</span>
            <strong className="text-success">{approvalRate}%</strong>
          </li>
          <li className="list-group-item d-flex justify-content-between px-0">
            <span>Rejection Rate</span>
            <strong className="text-danger">{rejectionRate}%</strong>
          </li>
          <li className="list-group-item d-flex justify-content-between px-0">
            <span>Pending Rate</span>
            <strong className="text-warning">{pendingRate}%</strong>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ConversionInsightsCard;