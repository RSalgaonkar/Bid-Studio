import React from "react";

function ScenarioForecastCard({ data = {} }) {
  const bestCase = Number(data?.bestCase || 0);
  const baseCase = Number(data?.baseCase || 0);
  const worstCase = Number(data?.worstCase || 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="card border-0 shadow-sm h-100 soft-card">
      <div className="card-body">
        <h5 className="font-weight-bold mb-1">Scenario Forecast</h5>
        <p className="text-muted small mb-4">
          Revenue under best, base, and worst assumptions
        </p>

        <div className="row text-center">
          <div className="col-md-4 mb-3">
            <div className="p-3 rounded bg-success text-white h-100">
              <p className="small mb-1">Best Case</p>
              <h5 className="mb-0">₹ {formatCurrency(bestCase)}</h5>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="p-3 rounded bg-primary text-white h-100">
              <p className="small mb-1">Base Case</p>
              <h5 className="mb-0">₹ {formatCurrency(baseCase)}</h5>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="p-3 rounded bg-warning text-dark h-100">
              <p className="small mb-1">Worst Case</p>
              <h5 className="mb-0">₹ {formatCurrency(worstCase)}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScenarioForecastCard;