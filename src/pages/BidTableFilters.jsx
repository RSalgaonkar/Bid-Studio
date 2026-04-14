import React, { useEffect, useState } from "react";
import "./BidTableFilters.css";

function BidTableFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  resultCount = 0,
  totalCount = 0,
  clearFilters,
  selectedCount = 0,
  onBulkDelete,
  onExportCsv,
}) {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearch);
    }, 450);

    return () => clearTimeout(timer);
  }, [localSearch, setSearchTerm]);

  const hasSearch = searchTerm.trim() !== "";
  const hasStatus = statusFilter !== "all";
  const hasSort = sortBy !== "latest";
  const hasActiveFilters = hasSearch || hasStatus || hasSort;

  return (
    <section className="bid-filters-card">
      <div className="bid-filters-top">
        <div className="bid-filters-heading">
          <span className="bid-filters-kicker">Bid Manager</span>
          <h5 className="bid-filters-title">Filter Bids</h5>
          <p className="bid-filters-subtitle">
            Showing <strong>{resultCount}</strong> of <strong>{totalCount}</strong> bids
          </p>
        </div>

        <div className="bid-filters-actions">
          <button
            type="button"
            className="bid-export-btn"
            onClick={onExportCsv}
          >
            Export CSV
          </button>

          {selectedCount > 0 && (
            <button
              type="button"
              className="bid-delete-selected-btn"
              onClick={onBulkDelete}
            >
              Delete Selected ({selectedCount})
            </button>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              className="bid-clear-btn"
              onClick={clearFilters}
            >
              <span className="bid-clear-btn-icon">✕</span>
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      <div className="bid-filters-grid">
        <div className="bid-filter-field bid-filter-search">
          <label className="bid-filter-label">Search</label>
          <div className="bid-search-wrap">
            <span className="bid-search-icon">⌕</span>
            <input
              type="text"
              className="bid-filter-input"
              placeholder="Search title or client..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bid-filter-field">
          <label className="bid-filter-label">Status</label>
          <select
            className="bid-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="bid-filter-field">
          <label className="bid-filter-label">Sort By</label>
          <select
            className="bid-filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest Added</option>
            <option value="amountHigh">Amount: High to Low</option>
            <option value="amountLow">Amount: Low to High</option>
            <option value="deadlineSoon">Deadline: Soonest</option>
            <option value="titleAZ">Title: A to Z</option>
          </select>
        </div>
      </div>

      <div className="bid-quick-filters">
        <button
          type="button"
          className={`quick-filter-chip ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>

        <button
          type="button"
          className={`quick-filter-chip ${statusFilter === "pending" ? "active warning" : ""}`}
          onClick={() => setStatusFilter("pending")}
        >
          Pending
        </button>

        <button
          type="button"
          className={`quick-filter-chip ${statusFilter === "approved" ? "active success" : ""}`}
          onClick={() => setStatusFilter("approved")}
        >
          Approved
        </button>

        <button
          type="button"
          className={`quick-filter-chip ${statusFilter === "rejected" ? "active danger" : ""}`}
          onClick={() => setStatusFilter("rejected")}
        >
          Rejected
        </button>
      </div>

      {hasActiveFilters && (
        <div className="active-filter-chips">
          {hasSearch && (
            <button
              type="button"
              className="active-filter-chip"
              onClick={() => {
                setLocalSearch("");
                setSearchTerm("");
              }}
            >
              Search: {searchTerm} <span>✕</span>
            </button>
          )}

          {hasStatus && (
            <button
              type="button"
              className="active-filter-chip"
              onClick={() => setStatusFilter("all")}
            >
              Status: {statusFilter} <span>✕</span>
            </button>
          )}

          {hasSort && (
            <button
              type="button"
              className="active-filter-chip"
              onClick={() => setSortBy("latest")}
            >
              Sort: {sortBy} <span>✕</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default BidTableFilters;