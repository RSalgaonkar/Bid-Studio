import React, { useMemo } from "react";

function ScenarioForecastCard({
  data = {},
  selectedStage = null,
  bottleneckData = {},
}) {
  const bestCase = Number(data?.bestCase || 0);
  const baseCase = Number(data?.baseCase || 0);
  const worstCase = Number(data?.worstCase || 0);

  const stageDistribution = bottleneckData?.stageDistribution || [];

  const selectedStageData = useMemo(() => {
    if (!selectedStage) return null;

    return (
      stageDistribution.find((stage) => stage?.stage === selectedStage) || null
    );
  }, [stageDistribution, selectedStage]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const formatStageLabel = (value) => {
    if (!value) return "Unknown";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const selectedStageForecast = useMemo(() => {
    if (!selectedStageData) return null;

    const amount = Number(selectedStageData?.amount || 0);
    const stage = selectedStageData?.stage;

    const probabilityMap = {
      pending: {
        best: 0.75,
        base: 0.5,
        worst: 0.25,
      },
      approved: {
        best: 1,
        base: 1,
        worst: 0.9,
      },
      rejected: {
        best: 0.1,
        base: 0,
        worst: 0,
      },
    };

    const probabilities = probabilityMap[stage] || {
      best: 0.5,
      base: 0.3,
      worst: 0.1,
    };

    return {
      bestCase: Math.round(amount * probabilities.best),
      baseCase: Math.round(amount * probabilities.base),
      worstCase: Math.round(amount * probabilities.worst),
      amount,
      count: Number(selectedStageData?.count || 0),
      percentage: Number(selectedStageData?.percentage || 0),
      probabilities,
    };
  }, [selectedStageData]);

  const displayBestCase = selectedStageForecast?.bestCase ?? bestCase;
  const displayBaseCase = selectedStageForecast?.baseCase ?? baseCase;
  const displayWorstCase = selectedStageForecast?.worstCase ?? worstCase;

  return (
    <div className="card border-0 shadow-sm h-100 soft-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <div>
            <h5 className="font-weight-bold mb-1">Scenario Forecast</h5>
            <p className="text-muted small mb-3">
              {selectedStage
                ? `Cross-filtered forecast for ${formatStageLabel(selectedStage)} status`
                : "Revenue under best, base, and worst assumptions"}
            </p>
          </div>

          {selectedStage ? (
            <span className="badge badge-primary">
              {formatStageLabel(selectedStage)}
            </span>
          ) : null}
        </div>

        {selectedStageForecast ? (
          <div className="alert alert-light border py-2 px-3 mb-4">
            <div className="row">
              <div className="col-md-4 mb-2 mb-md-0">
                <div className="small text-muted">Selected Amount</div>
                <strong>₹ {formatCurrency(selectedStageForecast.amount)}</strong>
              </div>
              <div className="col-md-4 mb-2 mb-md-0">
                <div className="small text-muted">Bid Count</div>
                <strong>{selectedStageForecast.count}</strong>
              </div>
              <div className="col-md-4">
                <div className="small text-muted">Pipeline Share</div>
                <strong>{selectedStageForecast.percentage}%</strong>
              </div>
            </div>
          </div>
        ) : null}

        <div className="row text-center">
          <div className="col-md-4 mb-3">
            <div className="p-3 rounded bg-success text-white h-100">
              <p className="small mb-1">Best Case</p>
              <h5 className="mb-0">₹ {formatCurrency(displayBestCase)}</h5>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="p-3 rounded bg-primary text-white h-100">
              <p className="small mb-1">Base Case</p>
              <h5 className="mb-0">₹ {formatCurrency(displayBaseCase)}</h5>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="p-3 rounded bg-warning text-dark h-100">
              <p className="small mb-1">Worst Case</p>
              <h5 className="mb-0">₹ {formatCurrency(displayWorstCase)}</h5>
            </div>
          </div>
        </div>

        {selectedStageForecast ? (
          <div className="mt-2 small text-muted">
            Applied assumptions for {formatStageLabel(selectedStage)}:
            {" "}
            best {Math.round(selectedStageForecast.probabilities.best * 100)}%,
            {" "}
            base {Math.round(selectedStageForecast.probabilities.base * 100)}%,
            {" "}
            worst {Math.round(selectedStageForecast.probabilities.worst * 100)}%.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ScenarioForecastCard;