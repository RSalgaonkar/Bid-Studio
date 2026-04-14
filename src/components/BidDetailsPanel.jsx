import React from "react";

function BidDetailsPanel({ bid, clientName, onClose }) {
  if (!bid) {
    return (
      <div className="card details-card border-0 shadow-sm h-100">
        <div className="card-body d-flex align-items-center justify-content-center text-center">
          <div>
            <h5 className="font-weight-bold mb-2">No bid selected</h5>
            <p className="text-muted mb-0">
              Select any bid from the table to view project details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card details-card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="font-weight-bold mb-1">{bid.title}</h5>
            <p className="text-muted mb-0">{clientName}</p>
          </div>

          <button className="btn btn-light border btn-sm" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Amount</span>
            <strong>₹{Number(bid.amount).toLocaleString()}</strong>
          </div>

          <div className="detail-item">
            <span className="detail-label">Status</span>
            <strong className="text-capitalize">{bid.status}</strong>
          </div>

          <div className="detail-item">
            <span className="detail-label">Priority</span>
            <strong className="text-capitalize">{bid.priority}</strong>
          </div>

          <div className="detail-item">
            <span className="detail-label">Due Date</span>
            <strong>{bid.dueDate}</strong>
          </div>
        </div>

        <div className="mt-4">
          <h6 className="font-weight-bold mb-2">Project Notes</h6>
          <div className="notes-box">
            This proposal is currently in the <strong>{bid.status}</strong> stage
            and belongs to a <strong>{bid.priority}</strong> priority workflow.
            In later phases, we can extend this panel with notes, scope items,
            reminders, and activity history.
          </div>
        </div>
      </div>
    </div>
  );
}

export default BidDetailsPanel;