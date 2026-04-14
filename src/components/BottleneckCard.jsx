import React from "react";

function BottleneckCard({ data }) {
  const { topStage, severity, insight, stageDistribution = [] } = data || {};

  const getAlertClass = () => {
    switch (severity) {
      case "high":
        return "alert alert-danger";
      case "medium":
        return "alert alert-warning";
      case "low":
        return "alert alert-info";
      default:
        return "alert alert-success";
    }
  };

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

  return (
    <div className="card soft-card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="mb-1 font-weight-bold">Pipeline Bottleneck</h5>
            <p className="text-muted small mb-0">
              Detect concentration risk by stage
            </p>
          </div>

          <span className={getBadgeClass()} style={{ textTransform: "capitalize" }}>
            {severity}
          </span>
        </div>

        <div className={getAlertClass()} role="alert">
          {insight}
        </div>

        {topStage && (
          <div className="mb-3">
            <p className="mb-1 text-muted small">Most crowded stage</p>
            <h6 className="mb-0">
              {topStage.stage} ({topStage.percentage}%)
            </h6>
          </div>
        )}

        <hr />

        <h6 className="font-weight-bold mb-3">Stage Distribution</h6>

        <ul className="list-group list-group-flush snapshot-list">
          {stageDistribution.map((item) => (
            <li
              key={item.stage}
              className="list-group-item d-flex justify-content-between px-0"
            >
              <span style={{ textTransform: "capitalize" }}>
                {item.stage} ({item.count})
              </span>
              <strong>{item.percentage}%</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BottleneckCard;