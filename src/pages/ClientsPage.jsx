import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import { useDispatch, useSelector } from "react-redux";
import { addClient, updateClient, deleteClient } from "../features/clients/clientsSlice";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AppToast from "../components/AppToast";
import ConfirmModal from "../components/ConfirmModal";
import ThemeToggle from "../components/ThemeToggle";

function ClientsPage({ setActivePage, theme, toggleTheme }) {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients.list);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter clients based on search term
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const search = searchTerm.toLowerCase();
      return (
        client.name.toLowerCase().includes(search) ||
        client.company.toLowerCase().includes(search) ||
        (client.email || "").toLowerCase().includes(search)
      );
    });
  }, [clients, searchTerm]);

  // Pagination for filtered clients
  const {
    currentPage,
    paginatedData,
    goToPage,
    resetPage,
  } = usePagination(filteredClients, 5);

  // Reset page when search changes
  useEffect(() => {
    resetPage();
  }, [searchTerm, resetPage]);

  // Form state
  const [form, setForm] = useState({
    id: null,
    name: "",
    company: "",
    status: "active",
  });

  const [confirmState, setConfirmState] = useState({
    show: false,
    clientId: null,
    clientName: "",
  });

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      company: "",
      status: "active",
    });
    setIsEdit(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.company) {
      showToast("Validation Error", "Please fill name and company fields.", "warning");
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
  };

  const handleEdit = (client) => {
    setForm(client);
    setIsEdit(true);
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
  };

  const handleCancelDelete = () => {
    setConfirmState({
      show: false,
      clientId: null,
      clientName: "",
    });
  };

  const handleDeleteClick = (id, name) => {
    setConfirmState({
      show: true,
      clientId: id,
      clientName: name,
    });
  };

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

        <div className="row">
          {/* Form Column */}
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

          {/* Table Column */}
          <div className="col-lg-8 mb-4">
            <div className="card soft-card border-0 shadow-sm">
              <div className="card-body">
                {/* Header with count */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="mb-1 font-weight-bold">Client Directory</h5>
                    <p className="text-muted small mb-0">
                      {filteredClients.length} of {clients.length} clients
                      {searchTerm && ` • "${searchTerm}"`}
                    </p>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
                  <h6 className="mb-2 mb-md-0">Clients List</h6>
                  <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search by name, company, or email..."
                  />
                </div>

                {/* Table */}
                <div className="table-responsive">
                  <table className="table modern-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-4">
                            <div className="text-muted">
                              {searchTerm 
                                ? `No clients found for "${searchTerm}"`
                                : "No clients added yet. Create your first client!"
                              }
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedData.map((client) => (
                          <tr key={client.id} className="clickable-row">
                            <td>{client.name}</td>
                            <td>{client.company}</td>
                            <td>
                              <span
                                className={`badge ${
                                  client.status === "active"
                                    ? "badge-success"
                                    : client.status === "inactive"
                                    ? "badge-secondary"
                                    : "badge-warning"
                                }`}
                              >
                                {client.status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-warning mr-2"
                                onClick={() => handleEdit(client)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteClick(client.id, client.name)}
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

                {/* Pagination */}
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

        {/* Toast */}
        <AppToast
          show={toast.show}
          title={toast.title}
          message={toast.message}
          variant={toast.variant}
          onClose={closeToast}
        />

        {/* Confirm Modal */}
        <ConfirmModal
          show={confirmState.show}
          title="Delete Client"
          message={`Are you sure you want to delete ${confirmState.clientName}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </div>
  );
}

export default ClientsPage;