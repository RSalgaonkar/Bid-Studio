import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../components/Sidebar";
import {
  addClient,
  updateClient,
  deleteClient,
} from "../features/clients/clientsSlice";

function ClientsPage({ setActivePage }) {
  const clients = useSelector((state) => state.clients.list);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    id: null,
    name: "",
    contact: "",
    email: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);

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

    if (!form.name.trim()) {
      newErrors.name = "Client company name is required";
    }

    if (!form.contact.trim()) {
      newErrors.contact = "Contact person is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    const emailExists = clients.some(
      (client) =>
        client.email.toLowerCase() === form.email.toLowerCase() &&
        client.id !== form.id
    );

    if (emailExists) {
      newErrors.email = "Email already exists";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      contact: "",
      email: "",
      status: "active",
    });
    setErrors({});
    setIsEdit(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isEdit) {
      dispatch(updateClient(form));
    } else {
      dispatch(
        addClient({
          ...form,
          id: Date.now(),
        })
      );
    }

    resetForm();
  };

  const handleEdit = (client) => {
    setForm(client);
    setErrors({});
    setIsEdit(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteClient(id));
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="clients" setActivePage={setActivePage} />

      <div className="main-content p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Clients</h2>
            <p className="text-muted mb-0">
              Manage your client list before creating bids.
            </p>
          </div>

          <button
            className="btn btn-outline-secondary"
            onClick={() => setActivePage("dashboard")}
          >
            Back to Dashboard
          </button>
        </div>

        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="mb-3">
                  {isEdit ? "Edit Client" : "Add New Client"}
                </h5>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      value={form.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Contact Person</label>
                    <input
                      type="text"
                      name="contact"
                      className={`form-control ${errors.contact ? "is-invalid" : ""}`}
                      value={form.contact}
                      onChange={handleChange}
                    />
                    {errors.contact && (
                      <div className="invalid-feedback">{errors.contact}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      value={form.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
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
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary mr-2">
                    {isEdit ? "Update Client" : "Add Client"}
                  </button>

                  {isEdit && (
                    <button
                      type="button"
                      className="btn btn-light border"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-8 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Client Directory</h5>
                  <span className="badge badge-dark p-2">
                    {clients.length} Clients
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.length > 0 ? (
                        clients.map((client) => (
                          <tr key={client.id}>
                            <td>{client.name}</td>
                            <td>{client.contact}</td>
                            <td>{client.email}</td>
                            <td>
                              <span
                                className={`badge ${
                                  client.status === "active"
                                    ? "badge-success"
                                    : "badge-secondary"
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
                                onClick={() => handleDelete(client.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center text-muted py-4">
                            No clients added yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientsPage;