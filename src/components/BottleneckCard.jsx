import React, { useMemo } from "react";

function BottleneckCard({
  data = {},
  selectedStage = null,
  onStageSelect = () => {},
}) {
  const {
    topStage,
    severity,
    insight,
    stageDistribution = [],
  } = data || {};

  const getBadgeClass = () => {
    switch (severity) {
      case "high":
        return "badge badge-danger";
      case "medium":
        return "badge badge-warning";
      case "low":
        return "badge badge-info";
      default:
        return "badge badge-success";
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case "pending":
        return "#ffc107";
      case "approved":
        return "#28a745";
      case "rejected":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const normalizedStages = useMemo(() => {
    return stageDistribution.map((stage) => ({
      ...stage,
      label: stage?.stage
        ? stage.stage.charAt(0).toUpperCase() + stage.stage.slice(1)
        : "Unknown",
      percentage: Number(stage?.percentage || 0),
      amount: Number(stage?.amount || 0),
      count: Number(stage?.count || 0),
    }));
  }, [stageDistribution]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const handleStageClick = (stageKey) => {
    if (!stageKey) return;
    if (selectedStage === stageKey) {
      onStageSelect(null);
      return;
    }
    onStageSelect(stageKey);
  };

  return (
    <div className="card border-0 shadow-sm h-100 soft-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="font-weight-bold mb-1">Pipeline Bottleneck</h5>
            <p className="text-muted small mb-0">
              Click a status to cross-filter forecast
            </p>
          </div>

          <span className={getBadgeClass()} style={{ textTransform: "capitalize" }}>
            {severity || "healthy"}
          </span>
        </div>

        <p className="text-muted small mb-3">{insight}</p>

        {selectedStage ? (
          <div className="alert alert-light border d-flex justify-content-between align-items-center py-2 px-3 mb-3">
            <div className="small mb-0">
              Active filter:{" "}
              <strong>
                {selectedStage.charAt(0).toUpperCase() + selectedStage.slice(1)}
              </strong>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => onStageSelect(null)}
            >
              Clear
            </button>
          </div>
        ) : null}

        {topStage ? (
          <div className="mb-3 p-3 rounded bg-light border">
            <div className="small text-muted mb-1">Top Bottleneck</div>
            <div className="d-flex justify-content-between align-items-center">
              <strong>
                {topStage?.stage
                  ? topStage.stage.charAt(0).toUpperCase() + topStage.stage.slice(1)
                  : "Unknown"}
              </strong>
              <span className="text-muted small">{topStage?.percentage || 0}%</span>
            </div>
          </div>
        ) : null}

        <div className="stage-breakdown">
          {normalizedStages.length > 0 ? (
            normalizedStages.map((stage) => {
              const isActive = selectedStage === stage.stage;

              return (
                <button
                  key={stage.stage}
                  type="button"
                  onClick={() => handleStageClick(stage.stage)}
                  className={`w-100 text-start border rounded px-3 py-2 mb-2 bg-white ${
                    isActive ? "shadow-sm border-primary" : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">
                      {stage.label}
                      {isActive ? (
                        <span className="badge badge-primary ms-2">Selected</span>
                      ) : null}
                    </span>

                    <div className="d-flex align-items-center gap-2">
                      <strong className="me-2">{stage.percentage}%</strong>
                      <span className="text-muted small">
                        ₹ {formatCurrency(stage.amount)}
                      </span>
                    </div>
                  </div>

                  <div
                    className="w-100 rounded"
                    style={{
                      height: "10px",
                      backgroundColor: "#e9ecef",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="stage-bar rounded"
                      style={{
                        width: `${Math.min(stage.percentage, 100)}%`,
                        height: "100%",
                        backgroundColor: getStageColor(stage.stage),
                        opacity: isActive ? 1 : 0.85,
                        transition: "all 0.2s ease",
                      }}
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="text-muted small">
                      Count: <strong>{stage.count}</strong>
                    </span>
                    <span className="text-muted small">
                      Status share: <strong>{stage.percentage}%</strong>
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center text-muted py-3">
              No bottleneck data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BottleneckCard;