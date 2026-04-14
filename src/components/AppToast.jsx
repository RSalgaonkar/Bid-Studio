import React, { useEffect } from "react";

function AppToast({ show, title, message, variant = "primary", onClose }) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="toast-wrapper">
      <div className={`custom-toast toast-${variant}`}>
        <div className="toast-header-custom">
          <strong>{title}</strong>
          <button className="toast-close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="toast-body-custom">{message}</div>
      </div>
    </div>
  );
}

export default AppToast;