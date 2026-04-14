import React from "react";

function SmartAlertsCard({ alerts = [] }) {
  const getAlertClass = (type) => {
    switch (type) {
      case "success":
        return "alert alert-success";
      case "warning":
        return "alert alert-warning";
      case "danger":
        return "alert alert-danger";
      default:
        return "alert alert-info";
    }
  };

  return (
    <div className="card border-0 shadow-sm h-100 soft-card">
      <div className="card-body">
        <h5 className="font-weight-bold mb-1">Smart Alerts</h5>
        <p className="text-muted small mb-4">
          Important pipeline signals and suggestions
        </p>

        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div
              key={`${alert.type}-${alert.message}-${index}`}
              className={`${getAlertClass(alert.type)} mb-3`}
              role="alert"
            >
              {alert.message}
            </div>
          ))
        ) : (
          <div className="alert alert-light mb-0" role="alert">
            No alerts available.
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartAlertsCard;