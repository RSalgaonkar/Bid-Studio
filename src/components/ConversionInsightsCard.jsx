import React from "react";

function ConversionInsightsCard({ data }) {
  const {
    total = 0,
    leadCount = 0,
    sentCount = 0,
    wonCount = 0,
    lostCount = 0,
    leadToSent = 0,
    sentToWon = 0,
    overallWinRate = 0,
    lossRate = 0,
  } = data || {};

  return (
    <div className="card soft-card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="mb-3">
          <h5 className="mb-1 font-weight-bold">Stage Conversion Insights</h5>
          <p className="text-muted small mb-0">
            Track how bids move through your pipeline
          </p>
        </div>

        <div className="row text-center mb-4">
          <div className="col-6 col-md-3 mb-3">
            <p className="text-muted small mb-1">Total Bids</p>
            <h6 className="mb-0">{total}</h6>
          </div>

          <div className="col-6 col-md-3 mb-3">
            <p className="text-muted small mb-1">Lead</p>
            <h6 className="mb-0">{leadCount}</h6>
          </div>

          <div className="col-6 col-md-3 mb-3">
            <p className="text-muted small mb-1">Sent</p>
            <h6 className="mb-0">{sentCount}</h6>
          </div>

          <div className="col-6 col-md-3 mb-3">
            <p className="text-muted small mb-1">Won</p>
            <h6 className="mb-0 text-success">{wonCount}</h6>
          </div>
        </div>

        <div className="list-group list-group-flush snapshot-list">
          <div className="list-group-item d-flex justify-content-between align-items-center px-0">
            <span>Lead → Sent Conversion</span>
            <strong className="text-primary">{leadToSent}%</strong>
          </div>

          <div className="list-group-item d-flex justify-content-between align-items-center px-0">
            <span>Sent → Won Conversion</span>
            <strong className="text-success">{sentToWon}%</strong>
          </div>

          <div className="list-group-item d-flex justify-content-between align-items-center px-0">
            <span>Overall Win Rate</span>
            <strong>{overallWinRate}%</strong>
          </div>

          <div className="list-group-item d-flex justify-content-between align-items-center px-0">
            <span>Loss Rate</span>
            <strong className="text-danger">{lossRate}%</strong>
          </div>

          <div className="list-group-item d-flex justify-content-between align-items-center px-0">
            <span>Lost Bids</span>
            <strong>{lostCount}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConversionInsightsCard;