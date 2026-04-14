import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addClient, updateClient, deleteClient } from "../features/clients/clientsSlice";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AppToast from "../components/AppToast";

function ClientsPage({ setActivePage }) {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients.list);

  const [form, setForm] = useState({
    id: null,
    name: "",
    company: "",
    status: "active",
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

  const handleDelete = (id, name) => {
    const confirmed = window.confirm(`Delete ${name}?`);

    if (!confirmed) return;

    dispatch(deleteClient(id));
    showToast("Client Deleted", `${name} was removed successfully.`, "danger");
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
        />

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
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="mb-1 font-weight-bold">Client Directory</h5>
                    <p className="text-muted small mb-0">
                      All your saved clients in one place
                    </p>
                  </div>
                  <span className="badge badge-dark p-2">{clients.length} Clients</span>
                </div>

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
                      {clients.map((client) => (
                        <tr key={client.id}>
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
                              onClick={() => handleDelete(client.id, client.name)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
    </div>
  );
}

export default ClientsPage;