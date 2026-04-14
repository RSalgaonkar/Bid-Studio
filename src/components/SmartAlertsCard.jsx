import React from "react";

function SmartAlertsCard({ alerts = [] }) {
  const getAlertClass = (type) => {
    switch (type) {
      case "danger":
        return "alert-danger";
      case "warning":
        return "alert-warning";
      case "success":
        return "alert-success";
      case "info":
        return "alert-info";
      default:
        return "alert-secondary";
    }
  };

  return (
    <div className="card soft-card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="mb-3">
          <h5 className="mb-1 font-weight-bold">Smart Alerts</h5>
          <p className="text-muted small mb-0">
            Action-focused warnings and pipeline highlights
          </p>
        </div>

        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert ${getAlertClass(alert.type)} mb-3`}
              role="alert"
            >
              <h6 className="mb-1">{alert.title}</h6>
              <p className="mb-0 small">{alert.message}</p>
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