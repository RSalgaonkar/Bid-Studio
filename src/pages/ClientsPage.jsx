import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addClient,
  updateClient,
  deleteClient,
} from "../features/clients/clientsSlice";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import AppToast from "../components/AppToast";
import ConfirmModal from "../components/ConfirmModal";
import ThemeToggle from "../components/ThemeToggle";
import usePagination from "../hooks/usePagination";

const INITIAL_FORM = {
  id: null,
  name: "",
  company: "",
  email: "",
  status: "active",
};

function ClientsPage({ setActivePage, theme, toggleTheme }) {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients.list || []);

  const [form, setForm] = useState(INITIAL_FORM);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
    variant: "primary",
  });

  const [confirmState, setConfirmState] = useState({
    show: false,
    clientId: null,
    clientName: "",
  });

  const filteredClients = useMemo(() => {
    const search = (searchTerm || "").trim().toLowerCase();

    return clients.filter((client) => {
      const name = (client?.name || "").toLowerCase();
      const company = (client?.company || "").toLowerCase();
      const email = (client?.email || "").toLowerCase();
      const status = client?.status || "";

      const matchesSearch =
        name.includes(search) ||
        company.includes(search) ||
        email.includes(search);

      const matchesStatus =
        statusFilter === "all" ? true : status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, statusFilter]);

  const { currentPage, paginatedData, goToPage, resetPage } = usePagination(
    filteredClients,
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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.company.trim()) {
      showToast(
        "Validation Error",
        "Please enter both client name and company.",
        "warning"
      );
      return;
    }

    if (isEdit) {
      dispatch(updateClient(form));
      showToast("Client Updated", `${form.name} was updated successfully.`, "warning");
    } else {
      dispatch(
        addClient({
          ...form,
          id: Date.now(),
        })
      );
      showToast("Client Added", `${form.name} was added successfully.`, "success");
    }

    resetForm();
    resetPage();
  };

  const handleEdit = (client) => {
    setForm({
      id: client?.id || null,
      name: client?.name || "",
      company: client?.company || "",
      email: client?.email || "",
      status: client?.status || "active",
    });
    setIsEdit(true);
  };

  const handleDeleteClick = (id, name) => {
    setConfirmState({
      show: true,
      clientId: id,
      clientName: name || "this client",
    });
  };

  const handleConfirmDelete = () => {
    dispatch(deleteClient(confirmState.clientId));

    showToast(
      "Client Deleted",
      `${confirmState.clientName} was removed successfully.`,
      "danger"
    );

    setConfirmState({
      show: false,
      clientId: null,
      clientName: "",
    });

    resetPage();
  };

  const handleCancelDelete = () => {
    setConfirmState({
      show: false,
      clientId: null,
      clientName: "",
    });
  };

  const activeCount = clients.filter((client) => client?.status === "active").length;
  const inactiveCount = clients.filter((client) => client?.status === "inactive").length;
  const leadCount = clients.filter((client) => client?.status === "lead").length;

  return (
    <div className="app-layout">
      <Sidebar activePage="clients" setActivePage={setActivePage} />

      <div className="main-content p-4">
        <Header
          title="Clients"
          subtitle="Manage your client list and relationship status."
          buttonText="Back to Dashboard"
          onButtonClick={() => setActivePage("dashboard")}
          extraActions={<ThemeToggle theme={theme} onToggle={toggleTheme} />}
        />

        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card stat-card border-0 shadow-sm">
              <div className="card-body">
                <p className="text-muted mb-1">Total Clients</p>
                <h4 className="mb-0 font-weight-bold">{clients.length}</h4>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card stat-card border-0 shadow-sm">
              <div className="card-body">
                <p className="text-muted mb-1">Active Clients</p>
                <h4 className="mb-0 font-weight-bold">{activeCount}</h4>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card stat-card border-0 shadow-sm">
              <div className="card-body">
                <p className="text-muted mb-1">Leads</p>
                <h4 className="mb-0 font-weight-bold">{leadCount}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card form-card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="mb-3 font-weight-bold">
                  {isEdit ? "Edit Client" : "Add Client"}
                </h5>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter client name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      name="company"
                      className="form-control"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter client email"
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
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="lead">Lead</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block">
                    {isEdit ? "Update Client" : "Save Client"}
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
                    <h5 className="mb-1 font-weight-bold">Client Directory</h5>
                    <p className="text-muted small mb-0">
                      Showing {filteredClients.length} of {clients.length} clients
                    </p>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-8 mb-2 mb-md-0">
                    <SearchBar
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Search by name, company, or email"
                    />
                  </div>

                  <div className="col-md-4">
                    <select
                      className="form-control"
                      value={statusFilter}
                      onChange={handleStatusChange}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="lead">Lead</option>
                    </select>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table modern-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredClients.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            {searchTerm || statusFilter !== "all"
                              ? "No matching clients found."
                              : "No clients added yet."}
                          </td>
                        </tr>
                      ) : (
                        paginatedData.map((client) => (
                          <tr key={client?.id}>
                            <td>{client?.name || "-"}</td>
                            <td>{client?.company || "-"}</td>
                            <td>{client?.email || "-"}</td>
                            <td>
                              <span
                                className={`badge ${
                                  client?.status === "active"
                                    ? "badge-success"
                                    : client?.status === "inactive"
                                    ? "badge-secondary"
                                    : "badge-warning"
                                }`}
                              >
                                {client?.status || "unknown"}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-warning mr-2"
                                onClick={() => handleEdit(client)}
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  handleDeleteClick(client?.id, client?.name)
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
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredClients.length}
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
        title="Delete Client"
        message={`Are you sure you want to delete ${confirmState.clientName}?`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default ClientsPage;