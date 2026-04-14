import React, { useMemo } from "react";

function StatusBadge({ status }) {
  const badgeClass =
    status === "approved"
      ? "badge-success"
      : status === "rejected"
      ? "badge-danger"
      : "badge-warning";

  return <span className={`badge ${badgeClass}`}>{status || "unknown"}</span>;
}

function VirtualizedSmartBidTable({
  bids = [],
  onEdit,
  onDelete,
  emptyMessage = "No bids found.",
}) {
  const tableData = useMemo(() => bids || [], [bids]);

  if (tableData.length === 0) {
    return (
      <div className="table-responsive">
        <table className="table modern-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" className="text-center py-4">
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table modern-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Client</th>
            <th>Amount</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tableData.map((bid) => (
            <tr key={bid?.id}>
              <td>{bid?.title || "-"}</td>
              <td>{bid?.client || "-"}</td>
              <td>₹ {Number(bid?.amount || 0).toLocaleString()}</td>
              <td>{bid?.deadline || "-"}</td>
              <td>
                <StatusBadge status={bid?.status} />
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-warning mr-2"
                  onClick={() => onEdit?.(bid)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete?.(bid?.id, bid?.title)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VirtualizedSmartBidTable;