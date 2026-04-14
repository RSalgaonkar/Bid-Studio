import React, { useMemo, useState } from "react";
import BidTableFilters from "./BidTableFilters";
import "./BidManagementTable.css";

const initialBids = [
  {
    id: 1,
    title: "Website Redesign",
    client: "Acme Corp",
    amount: 45000,
    status: "pending",
    deadline: "2026-04-18",
    createdAt: "2026-04-10",
  },
  {
    id: 2,
    title: "Mobile App UI",
    client: "Nova Labs",
    amount: 62000,
    status: "approved",
    deadline: "2026-04-16",
    createdAt: "2026-04-09",
  },
  {
    id: 3,
    title: "SEO Optimization",
    client: "Bright Media",
    amount: 28000,
    status: "rejected",
    deadline: "2026-04-19",
    createdAt: "2026-04-08",
  },
  {
    id: 4,
    title: "Admin Dashboard",
    client: "FinEdge",
    amount: 71000,
    status: "pending",
    deadline: "2026-04-14",
    createdAt: "2026-04-11",
  },
  {
    id: 5,
    title: "CRM Integration",
    client: "BluePeak",
    amount: 51000,
    status: "approved",
    deadline: "2026-04-22",
    createdAt: "2026-04-07",
  },
];

function BidManagementTable() {
  const [bids, setBids] = useState(initialBids);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const filteredBids = useMemo(() => {
    let updated = [...bids];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      updated = updated.filter(
        (bid) =>
          bid.title.toLowerCase().includes(search) ||
          bid.client.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== "all") {
      updated = updated.filter((bid) => bid.status === statusFilter);
    }

    switch (sortBy) {
      case "amountHigh":
        updated.sort((a, b) => b.amount - a.amount);
        break;
      case "amountLow":
        updated.sort((a, b) => a.amount - b.amount);
        break;
      case "deadlineSoon":
        updated.sort(
          (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );
        break;
      case "titleAZ":
        updated.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "latest":
      default:
        updated.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return updated;
  }, [bids, searchTerm, statusFilter, sortBy]);

  const allVisibleSelected =
    filteredBids.length > 0 &&
    filteredBids.every((bid) => selectedIds.includes(bid.id));

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !filteredBids.some((bid) => bid.id === id))
      );
      return;
    }

    const visibleIds = filteredBids.map((bid) => bid.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("latest");
  };

  const confirmBulkDelete = () => {
    setBids((prev) => prev.filter((bid) => !selectedIds.includes(bid.id)));
    setSelectedIds([]);
    setShowDeleteModal(false);
  };

  const exportCsv = () => {
    const rows = filteredBids.map((bid) => ({
      ID: bid.id,
      Title: bid.title,
      Client: bid.client,
      Amount: bid.amount,
      Status: bid.status,
      Deadline: bid.deadline,
      CreatedAt: bid.createdAt,
    }));

    const headers = Object.keys(rows[0] || {
      ID: "",
      Title: "",
      Client: "",
      Amount: "",
      Status: "",
      Deadline: "",
      CreatedAt: "",
    });

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "bids-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bid-management-page">
      <BidTableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        resultCount={filteredBids.length}
        totalCount={bids.length}
        clearFilters={clearFilters}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setShowDeleteModal(true)}
        onExportCsv={exportCsv}
      />

      <div className="bid-table-card">
        <div className="bid-table-toolbar">
          <div className="bid-selection-summary">
            {selectedIds.length > 0
              ? `${selectedIds.length} selected`
              : "No bids selected"}
          </div>
        </div>

        <div className="bid-table-wrap">
          <table className="bid-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAllVisible}
                  />
                </th>
                <th>Title</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {filteredBids.length > 0 ? (
                filteredBids.map((bid) => (
                  <tr
                    key={bid.id}
                    className={selectedIds.includes(bid.id) ? "selected-row" : ""}
                  >
                    <td className="checkbox-col">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(bid.id)}
                        onChange={() => toggleSelectOne(bid.id)}
                      />
                    </td>
                    <td>
                      <div className="bid-primary-cell">
                        <span className="bid-title">{bid.title}</span>
                      </div>
                    </td>
                    <td>{bid.client}</td>
                    <td>₹{bid.amount.toLocaleString("en-IN")}</td>
                    <td>
                      <span className={`status-badge ${bid.status}`}>
                        {bid.status}
                      </span>
                    </td>
                    <td>{bid.deadline}</td>
                    <td>{bid.createdAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="bid-empty-state">
                      <h4>No bids found</h4>
                      <p>Try changing your search text or filter selection.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && (
        <div className="bid-modal-backdrop" onClick={() => setShowDeleteModal(false)}>
          <div
            className="bid-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bid-modal-header">
              <h3>Delete selected bids?</h3>
            </div>
            <p className="bid-modal-text">
              You are about to permanently delete {selectedIds.length} selected bid
              {selectedIds.length > 1 ? "s" : ""}. This action cannot be undone.
            </p>
            <div className="bid-modal-actions">
              <button
                type="button"
                className="modal-btn secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-btn danger"
                onClick={confirmBulkDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BidManagementTable;