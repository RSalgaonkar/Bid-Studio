import React from "react";

function PipelineHealthCard({ data }) {
  const {
    score = 0,
    healthLabel = "Unknown",
    totalPipelineValue = 0,
    wonValue = 0,
    winRate = 0,
    overdueCount = 0,
    dueSoonCount = 0,
  } = data || {};

  const getBadgeClass = () => {
    if (score >= 80) return "success";
    if (score >= 65) return "primary";
    if (score >= 45) return "warning";
    if (score >= 25) return "secondary";
    return "danger";
  };

  const badgeClass = getBadgeClass();

  return (
    <div className="card soft-card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="mb-1 font-weight-bold">Pipeline Health</h5>
            <p className="text-muted small mb-0">
              Smart overview of bid quality and momentum
            </p>
          </div>

          <span className={`badge badge-${badgeClass} px-3 py-2`}>
            {healthLabel}
          </span>
        </div>

        <div className="text-center my-4">
          <div
            className="mx-auto d-flex align-items-center justify-content-center rounded-circle border"
            style={{
              width: "110px",
              height: "110px",
              fontSize: "1.75rem",
              fontWeight: "700",
            }}
          >
            {score}
          </div>
          <p className="text-muted mt-2 mb-0">Health Score / 100</p>
        </div>

        <div className="row text-center">
          <div className="col-6 mb-3">
            <p className="text-muted small mb-1">Pipeline Value</p>
            <h6 className="mb-0">
              ₹ {Number(totalPipelineValue).toLocaleString()}
            </h6>
          </div>

          <div className="col-6 mb-3">
            <p className="text-muted small mb-1">Won Value</p>
            <h6 className="mb-0">₹ {Number(wonValue).toLocaleString()}</h6>
          </div>

          <div className="col-6">
            <p className="text-muted small mb-1">Win Rate</p>
            <h6 className="mb-0">{winRate}%</h6>
          </div>

          <div className="col-6">
            <p className="text-muted small mb-1">Risk Items</p>
            <h6 className="mb-0">{overdueCount + dueSoonCount}</h6>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PipelineHealthCard;