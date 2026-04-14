import React from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ThemeToggle from "../components/ThemeToggle";
import PipelineHealthCard from "../components/PipelineHealthCard";
import SmartAlertsCard from "../components/SmartAlertsCard";
import {
  selectPipelineHealth,
  selectSmartAlerts,
} from "../selectors/pipelineSelectors";

function Dashboard({ setActivePage, theme, toggleTheme }) {
  const clients = useSelector((state) => state.clients?.list || []);
  const bids = useSelector((state) => state.bids?.list || []);
  const pipelineHealth = useSelector(selectPipelineHealth);
  const smartAlerts = useSelector(selectSmartAlerts);

  const totalPipeline = bids.reduce(
    (sum, bid) => sum + Number(bid?.amount || 0),
    0
  );

  const wonBids = bids.filter((bid) => bid?.status === "won");
  const lostBids = bids.filter((bid) => bid?.status === "lost");
  const sentBids = bids.filter((bid) => bid?.status === "sent");
  const leads = bids.filter((bid) => bid?.status === "lead");

  const activeClients = clients.filter(
    (client) => client?.status === "active"
  );

  const recentBids = [...bids]
    .sort((a, b) => Number(b?.id || 0) - Number(a?.id || 0))
    .slice(0, 5);

  const getStatusBadgeClass = (status) => {
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

  return (
    <div className="app-layout">
      <Sidebar activePage="dashboard" setActivePage={setActivePage} />

      <div className="main-content p-4">
        <Header
          title="Dashboard"
          subtitle="Track bids, clients, and proposal pipeline."
          buttonText="+ New Bid"
          onButtonClick={() => setActivePage("bids")}
          extraActions={<ThemeToggle theme={theme} onToggle={toggleTheme} />}
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

        <div className="row mb-4">
          <div className="col-lg-5 mb-4">
            <PipelineHealthCard data={pipelineHealth} />
          </div>

          <div className="col-lg-7 mb-4">
            <SmartAlertsCard alerts={smartAlerts} />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-7 mb-4">
            <div className="card soft-card border-0 shadow-sm h-100">
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
                      {recentBids.length > 0 ? (
                        recentBids.map((bid) => (
                          <tr key={bid.id}>
                            <td>{bid?.title || "Untitled Project"}</td>
                            <td>
                              <span
                                className={`badge ${getStatusBadgeClass(
                                  bid?.status
                                )}`}
                              >
                                {bid?.status || "unknown"}
                              </span>
                            </td>
                            <td>₹{Number(bid?.amount || 0).toLocaleString()}</td>
                            <td>{bid?.dueDate || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center text-muted py-4"
                          >
                            No bids found
                          </td>
                        </tr>
                      )}
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
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 font-weight-bold">Pipeline Snapshot</h5>
                  <span className="badge badge-info px-3 py-2">
                    {pipelineHealth.healthLabel}
                  </span>
                </div>

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
                    <span>Lost</span>
                    <strong>{lostBids.length}</strong>
                  </li>

                  <li className="list-group-item d-flex justify-content-between">
                    <span>Total Clients</span>
                    <strong>{clients.length}</strong>
                  </li>

                  <li className="list-group-item d-flex justify-content-between">
                    <span>Health Score</span>
                    <strong>{pipelineHealth?.score || 0}/100</strong>
                  </li>

                  <li className="list-group-item d-flex justify-content-between">
                    <span>Overdue Bids</span>
                    <strong>{pipelineHealth?.overdueCount || 0}</strong>
                  </li>

                  <li className="list-group-item d-flex justify-content-between">
                    <span>Due Soon</span>
                    <strong>{pipelineHealth?.dueSoonCount || 0}</strong>
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