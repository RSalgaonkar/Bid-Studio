import React from "react";

function ConfirmModal({
  show,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}) {
  if (!show) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog card border-0 shadow-lg">
        <div className="card-body p-4">
          <h5 className="font-weight-bold mb-2">{title}</h5>
          <p className="text-muted mb-4">{message}</p>

          <div className="d-flex flex-column flex-sm-row justify-content-end">
            <button
              type="button"
              className="btn btn-light border mb-2 mb-sm-0 mr-sm-2"
              onClick={onCancel}
            >
              {cancelText}
            </button>

            <button
              type="button"
              className={`btn btn-${confirmVariant}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;