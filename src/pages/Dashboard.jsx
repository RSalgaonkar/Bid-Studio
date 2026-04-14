import React from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ThemeToggle from "../components/ThemeToggle";
import PipelineHealthCard from "../components/PipelineHealthCard";
import SmartAlertsCard from "../components/SmartAlertsCard";
import WeightedForecastCard from "../components/WeightedForecastCard";
import ConversionInsightsCard from "../components/ConversionInsightsCard";
import BottleneckCard from "../components/BottleneckCard";
import ScenarioForecastCard from "../components/ScenarioForecastCard";
import DeadlineRiskCard from "../components/DeadlineRiskCard";

// SINGLE import block - fixes ReferenceError
import {
  selectPipelineHealth,
  selectSmartAlerts,
  selectWeightedForecast,
  selectStageConversion,
  selectPipelineBottleneck,
  selectScenarioForecast,
  selectDeadlineRisk,
} from "../selectors/pipelineSelectors";

function Dashboard({ setActivePage, theme, toggleTheme }) {
  const clients = useSelector((state) => state.clients?.list || []);
  const bids = useSelector((state) => state.bids?.list || []);
  
  // All selectors now properly imported - no more ReferenceError
  const pipelineHealth = useSelector(selectPipelineHealth);
  const smartAlerts = useSelector(selectSmartAlerts);
  const weightedForecast = useSelector(selectWeightedForecast);
  const stageConversion = useSelector(selectStageConversion);
  const pipelineBottleneck = useSelector(selectPipelineBottleneck);
  const scenarioForecast = useSelector(selectScenarioForecast);
  const deadlineRisk = useSelector(selectDeadlineRisk);

  // FIXED: Use your actual statuses (pending/approved/rejected)
  const totalPipeline = bids.reduce(
    (sum, bid) => sum + Number(bid?.amount || 0),
    0
  );

  const pendingBids = bids.filter((bid) => bid?.status === "pending");
  const approvedBids = bids.filter((bid) => bid?.status === "approved");
  const rejectedBids = bids.filter((bid) => bid?.status === "rejected");

  const activeClients = clients.filter(
    (client) => client?.status === "active"
  );

  const recentBids = [...bids]
    .sort((a, b) => Number(b?.id || 0) - Number(a?.id || 0))
    .slice(0, 5);

  // FIXED: Match your actual statuses
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "rejected":
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

        {/* FIXED: Use correct statuses and data */}
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
              title="Approved Bids"
              value={approvedBids.length}
              subtitle="Closed successfully"
              color="success"
            />
          </div>

          <div className="col-md-3 mb-3">
            <StatCard
              title="Active Clients"
              value={activeClients.length}
              subtitle="Currently engaged"
              color="info"
            />
          </div>

          <div className="col-md-3 mb-3">
            <StatCard
              title="Pending Proposals"
              value={pendingBids.length}
              subtitle="Awaiting response"
              color="warning"
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

        <div className="row mb-4">
          <div className="col-lg-12 mb-4">
            <WeightedForecastCard data={weightedForecast} />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-lg-7 mb-4">
            <ConversionInsightsCard data={stageConversion} />
          </div>
          <div className="col-lg-5 mb-4">
            <BottleneckCard data={pipelineBottleneck} />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-lg-7 mb-4">
            <ScenarioForecastCard data={scenarioForecast} />
          </div>
          <div className="col-lg-5 mb-4">
            <DeadlineRiskCard data={deadlineRisk} />
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
                        <th>Client</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Deadline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBids.length > 0 ? (
                        recentBids.map((bid) => (
                          <tr key={bid.id}>
                            <td>{bid?.title || "Untitled Project"}</td>
                            <td className="text-muted small">
                              {bid?.client || "Unknown"}
                            </td>
                            <td>
                              <span
                                className={`badge ${getStatusBadgeClass(
                                  bid?.status
                                )}`}
                              >
                                {bid?.status || "unknown"}
                              </span>
                            </td>
                            <td>
                              <strong>
                                ₹{Number(bid?.amount || 0).toLocaleString()}
                              </strong>
                            </td>
                            {/* FIXED: Use deadline instead of dueDate */}
                            <td>{bid?.deadline || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
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
                  onClick={() => setActivePage("bids")}
                >
                  Manage Bids →
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-5 mb-4">
            <div className="card soft-card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 font-weight-bold">Pipeline Snapshot</h5>
                  {/* FIXED: Use actual pipelineHealth data */}
                  <span className="badge badge-info px-3 py-2">
                    {pipelineHealth?.healthScore || 0}/100
                  </span>
                </div>

                <ul className="list-group list-group-flush snapshot-list">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Pending</span>
                    <strong>{pendingBids.length}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Approved</span>
                    <strong>{approvedBids.length}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Rejected</span>
                    <strong>{rejectedBids.length}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Total Clients</span>
                    <strong>{clients.length}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Health Score</span>
                    <strong>{pipelineHealth?.healthScore || 0}/100</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Risky Deadlines</span>
                    <strong>{deadlineRisk?.riskyCount || 0}</strong>
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