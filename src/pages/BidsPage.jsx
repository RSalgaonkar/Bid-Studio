import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBid, updateBid, deleteBid } from "../features/bids/bidsSlice";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import AppToast from "../components/AppToast";
import ConfirmModal from "../components/ConfirmModal";
import ThemeToggle from "../components/ThemeToggle";
import usePagination from "../hooks/usePagination";
import VirtualizedSmartBidTable from "../components/VirtualizedSmartBidTable";

const INITIAL_FORM = {
  id: null,
  title: "",
  client: "",
  amount: "",
  status: "pending",
  deadline: "",
};

function BidsPage({ setActivePage, theme, toggleTheme }) {
  const dispatch = useDispatch();
  const bids = useSelector((state) => state.bids.list || []);

  const [form, setForm] = useState(INITIAL_FORM);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [savedViews, setSavedViews] = useState([
    { id: 1, name: "All Bids", searchTerm: "", statusFilter: "all" },
    { id: 2, name: "Pending Only", searchTerm: "", statusFilter: "pending" },
    { id: 3, name: "Approved Only", searchTerm: "", statusFilter: "approved" },
    { id: 4, name: "Rejected Only", searchTerm: "", statusFilter: "rejected" },
  ]);

  const [newViewName, setNewViewName] = useState("");
  const [activeViewId, setActiveViewId] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
    variant: "primary",
  });

  const [confirmState, setConfirmState] = useState({
    show: false,
    bidId: null,
    bidTitle: "",
  });

  const filteredBids = useMemo(() => {
    const search = (searchTerm || "").trim().toLowerCase();

    return bids.filter((bid) => {
      const title = (bid?.title || "").toLowerCase();
      const client = (bid?.client || "").toLowerCase();
      const status = bid?.status || "";

      const matchesSearch =
        title.includes(search) || client.includes(search);

      const matchesStatus =
        statusFilter === "all" ? true : status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bids, searchTerm, statusFilter]);

  const { currentPage, paginatedData, goToPage, resetPage } = usePagination(
    filteredBids,
    5
  );

  const showToast = (title, message, variant = "primary") => {
    setToast({
      show: true,
      title,
      message,
      variant,
    });
  };

  const closeToast = () => {
    setToast((prev) => ({
      ...prev,
      show: false,
    }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setIsEdit(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    resetPage();
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    resetPage();
  };

  const applyView = (view) => {
    setSearchTerm(view.searchTerm || "");
    setStatusFilter(view.statusFilter || "all");
    setActiveViewId(view.id);
    resetPage();
  };

  const saveCurrentView = () => {
    const trimmedName = newViewName.trim();

    if (!trimmedName) {
      showToast("View Name Required", "Please enter a view name.", "warning");
      return;
    }

    const newView = {
      id: Date.now(),
      name: trimmedName,
      searchTerm,
      statusFilter,
    };

    setSavedViews((prev) => [...prev, newView]);
    setActiveViewId(newView.id);
    setNewViewName("");
    showToast("View Saved", `${trimmedName} was saved successfully.`, "success");
  };

  const deleteSavedView = (viewId) => {
    const viewToDelete = savedViews.find((view) => view.id === viewId);

    setSavedViews((prev) => prev.filter((view) => view.id !== viewId));

    if (activeViewId === viewId) {
      setActiveViewId(null);
    }

    showToast(
      "View Deleted",
      `${viewToDelete?.name || "Saved view"} was removed successfully.`,
      "danger"
    );
  };

  const applySmartPreset = (presetKey) => {
    switch (presetKey) {
      case "high-value":
        setSearchTerm("");
        setStatusFilter("all");
        setActiveViewId(null);
        break;
      case "pending":
        setSearchTerm("");
        setStatusFilter("pending");
        setActiveViewId(null);
        break;
      case "approved":
        setSearchTerm("");
        setStatusFilter("approved");
        setActiveViewId(null);
        break;
      case "rejected":
        setSearchTerm("");
        setStatusFilter("rejected");
        setActiveViewId(null);
        break;
      default:
        setSearchTerm("");
        setStatusFilter("all");
        setActiveViewId(null);
    }

    resetPage();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.client.trim() || !form.amount || !form.deadline) {
      showToast(
        "Validation Error",
        "Please fill all required fields.",
        "warning"
      );
      return;
    }

    const payload = {
      ...form,
      amount: Number(form.amount),
    };

    if (isEdit) {
      dispatch(updateBid(payload));
      showToast("Bid Updated", `${form.title} was updated successfully.`, "warning");
    } else {
      dispatch(
        addBid({
          ...payload,
          id: Date.now(),
        })
      );
      showToast("Bid Added", `${form.title} was added successfully.`, "success");
    }

    resetForm();
    resetPage();
  };

  const handleEdit = (bid) => {
    setForm({
      id: bid?.id || null,
      title: bid?.title || "",
      client: bid?.client || "",
      amount: bid?.amount || "",
      status: bid?.status || "pending",
      deadline: bid?.deadline || "",
    });
    setIsEdit(true);
  };

  const handleDeleteClick = (id, title) => {
    setConfirmState({
      show: true,
      bidId: id,
      bidTitle: title || "this bid",
    });
  };

  const handleConfirmDelete = () => {
    dispatch(deleteBid(confirmState.bidId));

    showToast(
      "Bid Deleted",
      `${confirmState.bidTitle} was removed successfully.`,
      "danger"
    );

    setConfirmState({
      show: false,
      bidId: null,
      bidTitle: "",
    });

    resetPage();
  };

  const handleCancelDelete = () => {
    setConfirmState({
      show: false,
      bidId: null,
      bidTitle: "",
    });
  };

  const pendingCount = bids.filter((bid) => bid?.status === "pending").length;
  const approvedCount = bids.filter((bid) => bid?.status === "approved").length;
  const rejectedCount = bids.filter((bid) => bid?.status === "rejected").length;

  return (
    <div className="app-layout">
      <Sidebar activePage="bids" setActivePage={setActivePage} />

      <div className="main-content p-4">
        <Header
          title="Bids"
          subtitle="Track and manage all submitted bids."
          buttonText="Back to Dashboard"
          onButtonClick={() => setActivePage("dashboard")}
          extraActions={<ThemeToggle theme={theme} onToggle={toggleTheme} />}
        />

        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card stat-card border-0 shadow-sm">
              <div className="card-body">
                <p className="text-muted mb-1">Total Bids</p>
                <h4 className="mb-0 font-weight-bold">{bids.length}</h4>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card stat-card border-0 shadow-sm">
              <div className="card-body">
                <p className="text-muted mb-1">Approved</p>
                <h4 className="mb-0 font-weight-bold">{approvedCount}</h4>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card stat-card border-0 shadow-sm">
              <div className="card-body">
                <p className="text-muted mb-1">Pending</p>
                <h4 className="mb-0 font-weight-bold">{pendingCount}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card form-card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="mb-3 font-weight-bold">
                  {isEdit ? "Edit Bid" : "Add Bid"}
                </h5>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Bid Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Enter bid title"
                    />
                  </div>

                  <div className="form-group">
                    <label>Client</label>
                    <input
                      type="text"
                      name="client"
                      className="form-control"
                      value={form.client}
                      onChange={handleChange}
                      placeholder="Enter client name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="number"
                      name="amount"
                      className="form-control"
                      value={form.amount}
                      onChange={handleChange}
                      placeholder="Enter amount"
                    />
                  </div>

                  <div className="form-group">
                    <label>Deadline</label>
                    <input
                      type="date"
                      name="deadline"
                      className="form-control"
                      value={form.deadline}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      className="form-control"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block">
                    {isEdit ? "Update Bid" : "Save Bid"}
                  </button>

                  {isEdit && (
                    <button
                      type="button"
                      className="btn btn-light border btn-block mt-2"
                      onClick={resetForm}
                    >
                      Cancel Edit
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-8 mb-4">
            <div className="card soft-card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
                  <div>
                    <h5 className="mb-1 font-weight-bold">Bids Directory</h5>
                    <p className="text-muted small mb-0">
                      Showing {filteredBids.length} of {bids.length} bids
                    </p>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-8 mb-2 mb-md-0">
                    <SearchBar
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Search by bid title or client"
                    />
                  </div>

                  <div className="col-md-4">
                    <select
                      className="form-control"
                      value={statusFilter}
                      onChange={handleStatusChange}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                    <span className="small font-weight-bold text-muted mr-2">Smart Presets:</span>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => applySmartPreset("all")}
                    >
                      All
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => applySmartPreset("pending")}
                    >
                      Pending
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success"
                      onClick={() => applySmartPreset("approved")}
                    >
                      Approved
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => applySmartPreset("rejected")}
                    >
                      Rejected
                    </button>
                  </div>

                  <div className="border rounded p-3 bg-light">
                    <div className="d-flex flex-wrap align-items-center justify-content-between mb-2">
                      <h6 className="mb-2 mb-md-0 font-weight-bold">Saved Views</h6>

                      <div className="d-flex flex-wrap align-items-center gap-2">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          style={{ minWidth: "180px" }}
                          value={newViewName}
                          onChange={(e) => setNewViewName(e.target.value)}
                          placeholder="Enter view name"
                        />

                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={saveCurrentView}
                        >
                          Save Current View
                        </button>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      {savedViews.length === 0 ? (
                        <span className="text-muted small">No saved views yet.</span>
                      ) : (
                        savedViews.map((view) => (
                          <div
                            key={view.id}
                            className={`d-flex align-items-center border rounded px-2 py-1 ${
                              activeViewId === view.id ? "bg-white shadow-sm" : ""
                            }`}
                          >
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-decoration-none p-0 mr-2"
                              onClick={() => applyView(view)}
                            >
                              {view.name}
                            </button>

                            {view.id > 4 && (
                              <button
                                type="button"
                                className="btn btn-sm btn-link text-danger p-0"
                                onClick={() => deleteSavedView(view.id)}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* <div className="table-responsive">
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
                      {filteredBids.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            {searchTerm || statusFilter !== "all"
                              ? "No matching bids found."
                              : "No bids added yet."}
                          </td>
                        </tr>
                      ) : (
                        paginatedData.map((bid) => (
                          <tr key={bid?.id}>
                            <td>{bid?.title || "-"}</td>
                            <td>{bid?.client || "-"}</td>
                            <td>₹ {Number(bid?.amount || 0).toLocaleString()}</td>
                            <td>{bid?.deadline || "-"}</td>
                            <td>
                              <span
                                className={`badge ${
                                  bid?.status === "approved"
                                    ? "badge-success"
                                    : bid?.status === "rejected"
                                    ? "badge-danger"
                                    : "badge-warning"
                                }`}
                              >
                                {bid?.status || "unknown"}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-warning mr-2"
                                onClick={() => handleEdit(bid)}
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  handleDeleteClick(bid?.id, bid?.title)
                                }
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div> */}

                <VirtualizedSmartBidTable
                  bids={paginatedData}
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  emptyMessage={
                    searchTerm || statusFilter !== "all"
                      ? "No matching bids found."
                      : "No bids added yet."
                  }
                />

                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredBids.length}
                  itemsPerPage={5}
                  onPageChange={goToPage}
                />
              </div>
            </div>
          </div>
        </div>

        <AppToast
          show={toast.show}
          title={toast.title}
          message={toast.message}
          variant={toast.variant}
          onClose={closeToast}
        />
      </div>

      <ConfirmModal
        show={confirmState.show}
        title="Delete Bid"
        message={`Are you sure you want to delete ${confirmState.bidTitle}?`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default BidsPage;