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

import {
  selectPipelineHealth,
  selectSmartAlerts,
  selectWeightedForecast,
  selectStageConversion,
  selectPipelineBottleneck,
  selectScenarioForecast,
  selectDeadlineRisk,
  selectDashboardSummary,
  PHASE_CONFIG,
} from "../selectors/pipelineSelectors";

function Dashboard({ setActivePage, theme, toggleTheme }) {
  const {
    totalPipeline = 0,
    newBids = [],
    proposalBids = [],
    inReviewBids = [],
    wonBids = [],
    executingBids = [],
    deliveredBids = [],
    closedBids = [],
    activeClients = [],
    recentBids = [],
    totalClients = 0,
  } = useSelector(selectDashboardSummary) || {};

  const pipelineHealth = useSelector(selectPipelineHealth) || {};
  const smartAlerts = useSelector(selectSmartAlerts) || [];
  const weightedForecast = useSelector(selectWeightedForecast) || {};
  const stageConversion = useSelector(selectStageConversion) || {};
  const pipelineBottleneck = useSelector(selectPipelineBottleneck) || {};
  const scenarioForecast = useSelector(selectScenarioForecast) || {};
  const deadlineRisk = useSelector(selectDeadlineRisk) || {};

  const getPhaseBadgeClass = (phase) => {
    const color = PHASE_CONFIG?.[phase]?.color;

    switch (color) {
      case "success":
        return "badge-success";
      case "warning":
        return "badge-warning";
      case "danger":
        return "badge-danger";
      case "primary":
        return "badge-primary";
      case "info":
        return "badge-info";
      case "secondary":
      default:
        return "badge-secondary";
    }
  };

  const getPhaseLabel = (phase) => {
    return PHASE_CONFIG?.[phase]?.label || phase || "Unknown";
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case "high":
        return "badge-danger";
      case "medium":
        return "badge-warning";
      case "low":
        return "badge-info";
      default:
        return "badge-success";
    }
  };

  const stageDistribution = pipelineBottleneck?.stageDistribution || [];
  const topStage = pipelineBottleneck?.topStage || null;

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
              value={`₹${Number(totalPipeline || 0).toLocaleString()}`}
              subtitle="Combined bid value"
              color="primary"
            />
          </div>

          <div className="col-md-3 mb-3">
            <StatCard
              title="Won Projects"
              value={wonBids.length}
              subtitle="Contracts signed"
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
              title="In Review"
              value={inReviewBids.length}
              subtitle="Awaiting decision"
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

        {/* Pipeline Bottleneck Visualization */}
        <div className="row mb-4">
          <div className="col-lg-12">
            <div className="card soft-card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <div>
                    <h5 className="mb-1 font-weight-bold">
                      Pipeline Bottleneck Visualization
                    </h5>
                    <p className="text-muted mb-0 small">
                      Compare stage concentration across the pipeline.
                    </p>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span
                      className={`badge px-3 py-2 ${getSeverityBadgeClass(
                        pipelineBottleneck?.severity
                      )}`}
                    >
                      {pipelineBottleneck?.severity || "healthy"}
                    </span>
                  </div>
                </div>

                {topStage ? (
                  <div className="mb-4">
                    <div className="p-3 rounded bg-light border">
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                          <div className="small text-muted">Top Bottleneck</div>
                          <div className="font-weight-bold">
                            {topStage?.label || getPhaseLabel(topStage?.stage)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="small text-muted">Share of pipeline</div>
                          <div className="font-weight-bold">
                            {topStage?.percentage || 0}%
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-muted small">
                        {pipelineBottleneck?.insight || "Pipeline looks balanced."}
                      </div>
                    </div>
                  </div>
                ) : null}

                {stageDistribution.length > 0 ? (
                  <div>
                    {stageDistribution.map((stage) => {
                      const phaseColorClass = getPhaseBadgeClass(stage?.stage);
                      const barClass =
                        phaseColorClass === "badge-success"
                          ? "bg-success"
                          : phaseColorClass === "badge-warning"
                          ? "bg-warning"
                          : phaseColorClass === "badge-danger"
                          ? "bg-danger"
                          : phaseColorClass === "badge-primary"
                          ? "bg-primary"
                          : phaseColorClass === "badge-info"
                          ? "bg-info"
                          : "bg-secondary";

                      return (
                        <div key={stage.stage} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1 flex-wrap gap-2">
                            <div className="d-flex align-items-center gap-2">
                              <span className={`badge ${phaseColorClass}`}>
                                {stage?.label || getPhaseLabel(stage?.stage)}
                              </span>
                              <span className="text-muted small">
                                {stage?.count || 0} items
                              </span>
                            </div>

                            <div className="text-muted small">
                              ₹{Number(stage?.amount || 0).toLocaleString()} •{" "}
                              {stage?.percentage || 0}%
                            </div>
                          </div>

                          <div
                            className="progress"
                            style={{ height: "10px", borderRadius: "999px" }}
                          >
                            <div
                              className={`progress-bar ${barClass}`}
                              role="progressbar"
                              style={{
                                width: `${stage?.percentage || 0}%`,
                              }}
                              aria-valuenow={stage?.percentage || 0}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    No stage distribution available.
                  </div>
                )}
              </div>
            </div>
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
                        <th>Phase</th>
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
                                className={`badge ${getPhaseBadgeClass(
                                  bid?.phase
                                )}`}
                              >
                                {getPhaseLabel(bid?.phase)}
                              </span>
                            </td>
                            <td>
                              <strong>
                                ₹{Number(bid?.amount || 0).toLocaleString()}
                              </strong>
                            </td>
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
                  <span className="badge badge-info px-3 py-2">
                    {pipelineHealth?.healthScore || 0}/100
                  </span>
                </div>

                <ul className="list-group list-group-flush snapshot-list">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>New</span>
                    <strong>{newBids.length}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Proposal</span>
                    <strong>{proposalBids.length}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>In Review</span>
                    <strong>{inReviewBids.length}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Won</span>
                    <strong>{wonBids.length}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Executing</span>
                    <strong>{executingBids.length}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Delivered</span>
                    <strong>{deliveredBids.length}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Closed</span>
                    <strong>{closedBids.length}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Total Clients</span>
                    <strong>{totalClients}</strong>
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