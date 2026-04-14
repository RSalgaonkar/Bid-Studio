import React from "react";

function BottleneckCard({ data }) {
  const { topStage, severity, insight, stageDistribution = [] } = data || {};

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
    <div className="card border-0 shadow-sm h-100 soft-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="font-weight-bold mb-1">Pipeline Bottleneck</h5>
            <p className="text-muted small mb-0">Concentration by status</p>
          </div>
          <span className={getBadgeClass()} style={{ textTransform: "capitalize" }}>
            {severity || "healthy"}
          </span>
        </div>

        <p className="text-muted small mb-4">{insight}</p>

        <div className="stage-breakdown">
          {stageDistribution.map((stage) => (
            <div key={stage.stage} className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small">
                {stage.stage.charAt(0).toUpperCase() + stage.stage.slice(1)}
              </span>
              <div className="d-flex align-items-center">
                <strong className="me-2">{stage.percentage}%</strong>
                <div 
                  className="stage-bar" 
                  style={{ 
                    width: `${Math.min(stage.percentage, 100)}%`,
                    backgroundColor: stage.stage === 'pending' ? '#ffc107' : 
                                   stage.stage === 'approved' ? '#28a745' : '#dc3545'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BottleneckCard;