import React from "react";

function BidFilters({
  filters,
  clients,
  onChange,
  onReset,
}) {
  return (
    <div className="card filter-card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1 font-weight-bold">Search & Filters</h5>
            <p className="text-muted mb-0 small">
              Narrow down bids by client, status, priority, or keyword
            </p>
          </div>

          <button className="btn btn-light border btn-sm mt-2 mt-md-0" onClick={onReset}>
            Reset Filters
          </button>
        </div>

        <div className="row">
          <div className="col-md-6 col-lg-3 mb-3">
            <label className="small text-muted font-weight-bold">Search</label>
            <input
              type="text"
              name="search"
              className="form-control"
              placeholder="Search project title"
              value={filters.search}
              onChange={onChange}
            />
          </div>

          <div className="col-md-6 col-lg-3 mb-3">
            <label className="small text-muted font-weight-bold">Status</label>
            <select
              name="status"
              className="form-control"
              value={filters.status}
              onChange={onChange}
            >
              <option value="all">All Status</option>
              <option value="lead">Lead</option>
              <option value="sent">Sent</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div className="col-md-6 col-lg-3 mb-3">
            <label className="small text-muted font-weight-bold">Priority</label>
            <select
              name="priority"
              className="form-control"
              value={filters.priority}
              onChange={onChange}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="col-md-6 col-lg-3 mb-3">
            <label className="small text-muted font-weight-bold">Client</label>
            <select
              name="clientId"
              className="form-control"
              value={filters.clientId}
              onChange={onChange}
            >
              <option value="all">All Clients</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BidFilters;