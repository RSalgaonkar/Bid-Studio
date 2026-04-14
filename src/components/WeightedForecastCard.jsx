import React from "react";

function WeightedForecastCard({ data }) {
  const {
    totalOpenPipeline = 0,
    weightedForecast = 0,
    committedRevenue = 0,
    forecastGap = 0,
    breakdown = {},
  } = data || {};

  return (
    <div className="card soft-card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="mb-3">
          <h5 className="mb-1 font-weight-bold">Weighted Forecast</h5>
          <p className="text-muted small mb-0">
            Expected revenue based on bid stage probability
          </p>
        </div>

        <div className="row text-center mb-3">
          <div className="col-6 mb-3">
            <p className="text-muted small mb-1">Open Pipeline</p>
            <h6 className="mb-0">
              ₹ {Number(totalOpenPipeline).toLocaleString()}
            </h6>
          </div>

          <div className="col-6 mb-3">
            <p className="text-muted small mb-1">Forecast Revenue</p>
            <h6 className="mb-0 text-primary">
              ₹ {Number(weightedForecast).toLocaleString()}
            </h6>
          </div>

          <div className="col-6">
            <p className="text-muted small mb-1">Committed Revenue</p>
            <h6 className="mb-0 text-success">
              ₹ {Number(committedRevenue).toLocaleString()}
            </h6>
          </div>

          <div className="col-6">
            <p className="text-muted small mb-1">Forecast Gap</p>
            <h6 className="mb-0 text-warning">
              ₹ {Number(forecastGap).toLocaleString()}
            </h6>
          </div>
        </div>

        <hr />

        <h6 className="font-weight-bold mb-3">Stage Value Breakdown</h6>

        <ul className="list-group list-group-flush snapshot-list">
          <li className="list-group-item d-flex justify-content-between">
            <span>Lead (20%)</span>
            <strong>₹ {Number(breakdown.lead || 0).toLocaleString()}</strong>
          </li>

          <li className="list-group-item d-flex justify-content-between">
            <span>Sent (50%)</span>
            <strong>₹ {Number(breakdown.sent || 0).toLocaleString()}</strong>
          </li>

          <li className="list-group-item d-flex justify-content-between">
            <span>Won (100%)</span>
            <strong>₹ {Number(breakdown.won || 0).toLocaleString()}</strong>
          </li>

          <li className="list-group-item d-flex justify-content-between">
            <span>Lost (0%)</span>
            <strong>₹ {Number(breakdown.lost || 0).toLocaleString()}</strong>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default WeightedForecastCard;