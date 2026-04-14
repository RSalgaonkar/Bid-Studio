import React from 'react';

const VirtualizedSmartBidTable = ({
  data = [],
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = "No bids found",
  className = "table modern-table"
}) => {
  if (loading) {
    return (
      <div className="table-responsive">
        <table className={className}>
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
            {[...Array(5)].map((_, i) => (
              <tr key={`skeleton-${i}`}>
                <td><div className="skeleton h-4 w-32 mb-2"></div></td>
                <td><div className="skeleton h-4 w-24 mb-2"></div></td>
                <td><div className="skeleton h-4 w-20 mb-2"></div></td>
                <td><div className="skeleton h-4 w-20 mb-2"></div></td>
                <td><div className="skeleton h-6 w-16"></div></td>
                <td><div className="skeleton h-8 w-24"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-responsive" style={{ height: '400px', overflow: 'auto' }}>
      <table className={className}>
        <thead>
          <tr className="sticky top-0 bg-white z-10 shadow-sm" style={{ position: 'sticky', top: 0 }}>
            <th>Title</th>
            <th>Client</th>
            <th>Amount</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-8">
                <div className="text-muted">
                  {emptyMessage}
                </div>
              </td>
            </tr>
          ) : (
            data.map((bid, index) => (
              <tr key={bid?.id || index} className="hover:bg-gray-50">
                <td className="py-3">{bid?.title || "-"}</td>
                <td className="py-3">{bid?.client || "-"}</td>
                <td className="py-3 font-medium">
                  ₹{Number(bid?.amount || 0).toLocaleString()}
                </td>
                <td className="py-3">{bid?.deadline || "-"}</td>
                <td className="py-3">
                  <span
                    className={`badge px-2 py-1 text-xs font-medium rounded-full ${
                      bid?.status === "approved"
                        ? "badge-success bg-green-100 text-green-800"
                        : bid?.status === "rejected"
                        ? "badge-danger bg-red-100 text-red-800"
                        : "badge-warning bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {bid?.status || "unknown"}
                  </span>
                </td>
                <td className="py-3">
                  <div className="d-flex gap-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-warning"
                      onClick={() => onEdit(bid)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete(bid?.id, bid?.title)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VirtualizedSmartBidTable;