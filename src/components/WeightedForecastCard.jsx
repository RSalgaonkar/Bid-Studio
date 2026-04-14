import React from "react";

function WeightedForecastCard({ data = {} }) {
  const totalOpenPipeline = Number(data?.totalOpenPipeline || 0);
  const weightedForecast = Number(data?.weightedForecast || 0);
  const committedRevenue = Number(data?.committedRevenue || 0);
  const forecastGap = Number(data?.forecastGap || 0);

  const breakdown = {
    pending: Number(data?.breakdown?.pending || 0),
    approved: Number(data?.breakdown?.approved || 0),
    rejected: Number(data?.breakdown?.rejected || 0),
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="card border-0 shadow-sm h-100 soft-card">
      <div className="card-body">
        <h5 className="font-weight-bold mb-1">Weighted Forecast</h5>
        <p className="text-muted small mb-4">
          Forecast based on pending, approved, and rejected status probability
        </p>

        <div className="row text-center mb-4">
          <div className="col-6 col-md-3 mb-3">
            <p className="small text-muted mb-1">Open Pipeline</p>
            <h6>₹ {formatCurrency(totalOpenPipeline)}</h6>
          </div>

          <div className="col-6 col-md-3 mb-3">
            <p className="small text-muted mb-1">Weighted Forecast</p>
            <h6 className="text-primary">₹ {formatCurrency(weightedForecast)}</h6>
          </div>

          <div className="col-6 col-md-3 mb-3">
            <p className="small text-muted mb-1">Committed</p>
            <h6 className="text-success">₹ {formatCurrency(committedRevenue)}</h6>
          </div>

          <div className="col-6 col-md-3 mb-3">
            <p className="small text-muted mb-1">Forecast Gap</p>
            <h6 className="text-warning">₹ {formatCurrency(forecastGap)}</h6>
          </div>
        </div>

        <ul className="list-group list-group-flush snapshot-list">
          <li className="list-group-item d-flex justify-content-between px-0">
            <span>Pending</span>
            <strong>₹ {formatCurrency(breakdown.pending)}</strong>
          </li>

          <li className="list-group-item d-flex justify-content-between px-0">
            <span>Approved</span>
            <strong>₹ {formatCurrency(breakdown.approved)}</strong>
          </li>

          <li className="list-group-item d-flex justify-content-between px-0">
            <span>Rejected</span>
            <strong>₹ {formatCurrency(breakdown.rejected)}</strong>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default WeightedForecastCard;