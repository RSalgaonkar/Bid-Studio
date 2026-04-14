import React from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

function Dashboard({ setActivePage }) {
  const clients = useSelector((state) => state.clients.list);
  const bids = useSelector((state) => state.bids.list);

  const totalPipeline = bids.reduce((sum, bid) => sum + bid.amount, 0);
  const wonBids = bids.filter((bid) => bid.status === "won");
  const activeClients = clients.filter((client) => client.status === "active");
  const sentBids = bids.filter((bid) => bid.status === "sent");
  const leads = bids.filter((bid) => bid.status === "lead");

  return (
    <div className="app-layout">
      <Sidebar activePage="dashboard" setActivePage={setActivePage} />

      <div className="main-content p-4">
        <Header
          title="Dashboard"
          subtitle="Track bids, clients, and proposal pipeline."
          buttonText="+ New Bid"
          onButtonClick={() => setActivePage("bids")}
        />

        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <StatCard
              title="Total Pipeline"
              value={`₹${totalPipeline.toLocaleString()}`}
              subtitle="Combined bid value"
              color="primary"
            />
          </div>
          <div className="col-md-3 mb-3">
            <StatCard
              title="Won Bids"
              value={wonBids.length}
              subtitle="Closed successfully"
              color="success"
            />
          </div>
          <div className="col-md-3 mb-3">
            <StatCard
              title="Active Clients"
              value={activeClients.length}
              subtitle="Currently engaged"
              color="warning"
            />
          </div>
          <div className="col-md-3 mb-3">
            <StatCard
              title="Pending Proposals"
              value={sentBids.length + leads.length}
              subtitle="Lead + sent stages"
              color="danger"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-7 mb-4">
            <div className="card soft-card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 font-weight-bold">Recent Bids</h5>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setActivePage("bids")}
                  >
                    View All
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle modern-table">
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bids.map((bid) => (
                        <tr key={bid.id}>
                          <td>{bid.title}</td>
                          <td>
                            <span
                              className={`badge ${
                                bid.status === "won"
                                  ? "badge-success"
                                  : bid.status === "sent"
                                  ? "badge-primary"
                                  : "badge-warning"
                              }`}
                            >
                              {bid.status}
                            </span>
                          </td>
                          <td>₹{bid.amount.toLocaleString()}</td>
                          <td>{bid.dueDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  className="btn btn-link px-0 mt-2"
                  onClick={() => setActivePage("clients")}
                >
                  Manage Clients →
                </button>

              </div>
            </div>
          </div>

          <div className="col-lg-5 mb-4">
            <div className="card soft-card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="mb-3 font-weight-bold">Pipeline Snapshot</h5>
                <ul className="list-group list-group-flush snapshot-list">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Leads</span>
                    <strong>{leads.length}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Sent</span>
                    <strong>{sentBids.length}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Won</span>
                    <strong>{wonBids.length}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Total Clients</span>
                    <strong>{clients.length}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;