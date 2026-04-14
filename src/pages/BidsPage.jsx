import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BidFilters from "../components/BidFilters";
import BidDetailsPanel from "../components/BidDetailsPanel";
import {
  addBid,
  updateBid,
  deleteBid,
  setBidFilters,
  resetBidFilters,
  setSelectedBidId,
} from "../features/bids/bidsSlice";
import {
  selectBidFilters,
  selectFilteredBids,
  selectSelectedBid,
} from "../features/bids/bidsSelectors";
import AppToast from "../components/AppToast";

function BidsPage({ setActivePage }) {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients.list);
  const bids = useSelector(selectFilteredBids);
  const filters = useSelector(selectBidFilters);
  const selectedBid = useSelector(selectSelectedBid);

  const [form, setForm] = useState({
    id: null,
    clientId: "",
    title: "",
    amount: "",
    status: "lead",
    priority: "medium",
    dueDate: "",
  });

  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
    variant: "primary",
  });

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

  const getClientName = (clientId) => {
    const client = clients.find((item) => item.id === Number(clientId));
    return client ? client.name : "Unknown Client";
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setBidFilters({ [name]: value }));
  };

  const handleResetFilters = () => {
    dispatch(resetBidFilters());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.clientId) {
      newErrors.clientId = "Please select a client";
    }

    if (!form.title.trim()) {
      newErrors.title = "Project title is required";
    }

    if (!form.amount) {
      newErrors.amount = "Bid amount is required";
    } else if (Number(form.amount) <= 0) {
      newErrors.amount = "Enter a valid amount";
    }

    if (!form.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      id: null,
      clientId: "",
      title: "",
      amount: "",
      status: "lead",
      priority: "medium",
      dueDate: "",
    });
    setErrors({});
    setIsEdit(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      ...form,
      id: isEdit ? form.id : Date.now(),
      clientId: Number(form.clientId),
      amount: Number(form.amount),
    };

    if (isEdit) {
      dispatch(updateBid(payload));
      dispatch(setSelectedBidId(payload.id));
      showToast("Bid Updated", `${payload.title} was updated successfully.`, "warning");
    } else {
      dispatch(addBid(payload));
      showToast("Bid Added", `${payload.title} was created successfully.`, "success");
    }

    resetForm();
  };

  const handleEdit = (bid) => {
    setForm({
      ...bid,
      clientId: String(bid.clientId),
      amount: String(bid.amount),
    });
    setErrors({});
    setIsEdit(true);
    dispatch(setSelectedBidId(bid.id));
  };

  const handleDeleteBid = (id, title) => {
    const confirmed = window.confirm(`Delete bid "${title}"?`);

    if (!confirmed) return;

    dispatch(deleteBid(id));
    showToast("Bid Deleted", `${title} was removed successfully.`, "danger");
  };

  const handleSelectBid = (id) => {
    dispatch(setSelectedBidId(id));
  };

  const handleCloseDetails = () => {
    dispatch(setSelectedBidId(null));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "won":
        return "badge-success";
      case "sent":
        return "badge-primary";
      case "lead":
        return "badge-warning";
      case "lost":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return "badge-danger";
      case "medium":
        return "badge-warning";
      case "low":
        return "badge-info";
      default:
        return "badge-secondary";
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="bids" setActivePage={setActivePage} />

      <div className="main-content p-4">
        <Header
          title="Bids"
          subtitle="Create proposals, search faster, and inspect details in one workflow."
          buttonText="Back to Dashboard"
          onButtonClick={() => setActivePage("dashboard")}
        />

        <BidFilters
          filters={filters}
          clients={clients}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <div className="row">
          <div className="col-xl-4 col-lg-5 mb-4">
            <div className="card form-card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 font-weight-bold">
                    {isEdit ? "Edit Bid" : "Create Bid"}
                  </h5>
                  <span className="badge badge-light border px-3 py-2">
                    {isEdit ? "Update Mode" : "New Entry"}
                  </span>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-group">
                    <label>Client</label>
                    <select
                      name="clientId"
                      className={`form-control ${errors.clientId ? "is-invalid" : ""}`}
                      value={form.clientId}
                      onChange={handleChange}
                    >
                      <option value="">Select client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                    {errors.clientId && (
                      <div className="invalid-feedback">{errors.clientId}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Project Title</label>
                    <input
                      type="text"
                      name="title"
                      className={`form-control ${errors.title ? "is-invalid" : ""}`}
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Enter project title"
                    />
                    {errors.title && (
                      <div className="invalid-feedback">{errors.title}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Bid Amount</label>
                    <input
                      type="number"
                      name="amount"
                      className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                      value={form.amount}
                      onChange={handleChange}
                      placeholder="Enter amount"
                    />
                    {errors.amount && (
                      <div className="invalid-feedback">{errors.amount}</div>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group col-sm-6">
                      <label>Status</label>
                      <select
                        name="status"
                        className="form-control"
                        value={form.status}
                        onChange={handleChange}
                      >
                        <option value="lead">Lead</option>
                        <option value="sent">Sent</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>

                    <div className="form-group col-sm-6">
                      <label>Priority</label>
                      <select
                        name="priority"
                        className="form-control"
                        value={form.priority}
                        onChange={handleChange}
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      className={`form-control ${errors.dueDate ? "is-invalid" : ""}`}
                      value={form.dueDate}
                      onChange={handleChange}
                    />
                    {errors.dueDate && (
                      <div className="invalid-feedback">{errors.dueDate}</div>
                    )}
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

          <div className="col-xl-8 col-lg-7 mb-4">
            <div className="row">
              <div className="col-12 mb-4">
                <div className="card soft-card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                      <div>
                        <h5 className="mb-1 font-weight-bold">Proposal Pipeline</h5>
                        <p className="text-muted mb-0 small">
                          Click any row to inspect more details
                        </p>
                      </div>

                      <span className="badge badge-dark p-2">
                        {bids.length} Results
                      </span>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover modern-table">
                        <thead>
                          <tr>
                            <th>Project</th>
                            <th>Client</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Due</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bids.length > 0 ? (
                            bids.map((bid) => (
                              <tr
                                key={bid.id}
                                className={`clickable-row ${
                                  selectedBid?.id === bid.id ? "selected-row" : ""
                                }`}
                                onClick={() => handleSelectBid(bid.id)}
                              >
                                <td>{bid.title}</td>
                                <td>{getClientName(bid.clientId)}</td>
                                <td>₹{Number(bid.amount).toLocaleString()}</td>
                                <td>
                                  <span className={`badge ${getStatusBadge(bid.status)}`}>
                                    {bid.status}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${getPriorityBadge(bid.priority)}`}>
                                    {bid.priority}
                                  </span>
                                </td>
                                <td>{bid.dueDate}</td>
                                <td onClick={(e) => e.stopPropagation()}>
                                  <button
                                    className="btn btn-sm btn-warning mr-2"
                                    onClick={() => handleEdit(bid)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeleteBid(bid.id, bid.title)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center text-muted py-4">
                                No bids matched your filters.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {clients.length === 0 && (
                      <div className="alert alert-warning mt-3 mb-0">
                        Add at least one client first before creating bids.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-12">
                <BidDetailsPanel
                  bid={selectedBid}
                  clientName={selectedBid ? getClientName(selectedBid.clientId) : ""}
                  onClose={handleCloseDetails}
                />
              </div>
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
    
  );
}

export default BidsPage;