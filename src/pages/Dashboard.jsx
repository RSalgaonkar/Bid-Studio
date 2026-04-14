import React, { useMemo, useState } from "react";
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
import ScenarioSimulatorDrawer from "../components/ScenarioSimulatorDrawer";

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

function Dashboard({ setActivePage, theme, toggleTheme, openCommandPalette }) {
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

  const [stageTypeFilter, setStageTypeFilter] = useState("all");
  const [sortMode, setSortMode] = useState("percentage-desc");
  const [minPercentage, setMinPercentage] = useState(0);
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [isScenarioDrawerOpen, setIsScenarioDrawerOpen] = useState(false);

  const phaseBidMap = useMemo(
    () => ({
      new: newBids,
      proposal: proposalBids,
      in_review: inReviewBids,
      won: wonBids,
      executing: executingBids,
      delivered: deliveredBids,
      closed: closedBids,
    }),
    [
      newBids,
      proposalBids,
      inReviewBids,
      wonBids,
      executingBids,
      deliveredBids,
      closedBids,
    ]
  );

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

  const filteredStageDistribution = useMemo(() => {
    let stages = [...stageDistribution];

    if (stageTypeFilter === "early") {
      stages = stages.filter((stage) =>
        ["new", "proposal", "in_review"].includes(stage.stage)
      );
    }

    if (stageTypeFilter === "late") {
      stages = stages.filter((stage) =>
        ["won", "executing", "delivered"].includes(stage.stage)
      );
    }

    if (stageTypeFilter === "closed") {
      stages = stages.filter((stage) => stage.stage === "closed");
    }

    stages = stages.filter(
      (stage) => Number(stage?.percentage || 0) >= Number(minPercentage || 0)
    );

    switch (sortMode) {
      case "percentage-asc":
        stages.sort((a, b) => (a?.percentage || 0) - (b?.percentage || 0));
        break;
      case "amount-desc":
        stages.sort((a, b) => (b?.amount || 0) - (a?.amount || 0));
        break;
      case "amount-asc":
        stages.sort((a, b) => (a?.amount || 0) - (b?.amount || 0));
        break;
      case "count-desc":
        stages.sort((a, b) => (b?.count || 0) - (a?.count || 0));
        break;
      case "count-asc":
        stages.sort((a, b) => (a?.count || 0) - (b?.count || 0));
        break;
      case "label-asc":
        stages.sort((a, b) => (a?.label || "").localeCompare(b?.label || ""));
        break;
      case "percentage-desc":
      default:
        stages.sort((a, b) => (b?.percentage || 0) - (a?.percentage || 0));
        break;
    }

    return stages;
  }, [stageDistribution, stageTypeFilter, sortMode, minPercentage]);

  const filteredTopStage = filteredStageDistribution[0] || null;

  const selectedPhaseBids = selectedPhaseFilter
    ? phaseBidMap[selectedPhaseFilter] || []
    : [];

  const selectedPhaseAmount = selectedPhaseBids.reduce(
    (sum, bid) => sum + Number(bid?.amount || 0),
    0
  );

  const selectedPhaseProbability =
    PHASE_CONFIG?.[selectedPhaseFilter]?.probability ?? 0;

  const selectedPhaseScenarioForecast = useMemo(() => {
    if (!selectedPhaseFilter) return null;

    const bestProbabilityMap = {
      new: 0.2,
      proposal: 0.5,
      in_review: 0.8,
      won: 1,
      executing: 1,
      delivered: 1,
      closed: 0,
    };

    const baseProbabilityMap = {
      new: 0.1,
      proposal: 0.3,
      in_review: 0.6,
      won: 1,
      executing: 0.9,
      delivered: 1,
      closed: 0,
    };

    const worstProbabilityMap = {
      new: 0.05,
      proposal: 0.2,
      in_review: 0.4,
      won: 1,
      executing: 0.8,
      delivered: 1,
      closed: 0,
    };

    const calculateScenario = (probabilityMap) => {
      return Math.round(
        selectedPhaseBids.reduce((total, bid) => {
          const amount = Number(bid?.amount || 0);
          const probability = probabilityMap[selectedPhaseFilter] ?? 0;
          return total + amount * probability;
        }, 0)
      );
    };

    return {
      bestCase: calculateScenario(bestProbabilityMap),
      baseCase: calculateScenario(baseProbabilityMap),
      worstCase: calculateScenario(worstProbabilityMap),
      selectedPhase: selectedPhaseFilter,
      selectedPhaseLabel: getPhaseLabel(selectedPhaseFilter),
      selectedPhaseCount: selectedPhaseBids.length,
      selectedPhaseAmount,
      selectedPhaseProbability,
    };
  }, [selectedPhaseFilter, selectedPhaseBids, selectedPhaseAmount]);

  const clearBottleneckFilters = () => {
    setStageTypeFilter("all");
    setSortMode("percentage-desc");
    setMinPercentage(0);
    setSelectedPhaseFilter(null);
  };

  const togglePhaseCrossFilter = (phase) => {
    setSelectedPhaseFilter((prev) => (prev === phase ? null : phase));
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
          onOpenCommandPalette={openCommandPalette}
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
            <BottleneckCard
              data={pipelineBottleneck}
              selectedStage={selectedStage}
              onStageSelect={setSelectedStage}
            />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-lg-7 mb-4">
            <div className="card soft-card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-3">
                  <div>
                    <h5 className="mb-1 font-weight-bold">Scenario Forecast</h5>
                    <p className="text-muted mb-0 small">
                      {selectedPhaseFilter
                        ? `Cross-filtered by ${getPhaseLabel(selectedPhaseFilter)} stage.`
                        : "Overall forecast across all pipeline phases."}
                    </p>
                  </div>

                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {selectedPhaseFilter ? (
                      <span className={`badge px-3 py-2 ${getPhaseBadgeClass(selectedPhaseFilter)}`}>
                        {getPhaseLabel(selectedPhaseFilter)}
                      </span>
                    ) : null}

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setIsScenarioDrawerOpen(true)}
                      disabled={!selectedPhaseFilter}
                      title={
                        selectedPhaseFilter
                          ? "Open scenario simulator"
                          : "Select a phase first from bottleneck visualization"
                      }
                    >
                      Open Simulator
                    </button>
                  </div>
                </div>

                {selectedPhaseScenarioForecast ? (
                  <>
                    <div className="row mb-3">
                      <div className="col-md-4 mb-3">
                        <div className="border rounded p-3 h-100">
                          <div className="small text-muted">Best Case</div>
                          <div className="h5 mb-0 font-weight-bold text-success">
                            ₹{Number(selectedPhaseScenarioForecast.bestCase || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 mb-3">
                        <div className="border rounded p-3 h-100">
                          <div className="small text-muted">Base Case</div>
                          <div className="h5 mb-0 font-weight-bold text-primary">
                            ₹{Number(selectedPhaseScenarioForecast.baseCase || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 mb-3">
                        <div className="border rounded p-3 h-100">
                          <div className="small text-muted">Worst Case</div>
                          <div className="h5 mb-0 font-weight-bold text-danger">
                            ₹{Number(selectedPhaseScenarioForecast.worstCase || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded p-3 bg-light">
                      <div className="row">
                        <div className="col-md-3 mb-2">
                          <div className="small text-muted">Selected Phase</div>
                          <div className="font-weight-bold">
                            {selectedPhaseScenarioForecast.selectedPhaseLabel}
                          </div>
                        </div>

                        <div className="col-md-3 mb-2">
                          <div className="small text-muted">Items</div>
                          <div className="font-weight-bold">
                            {selectedPhaseScenarioForecast.selectedPhaseCount}
                          </div>
                        </div>

                        <div className="col-md-3 mb-2">
                          <div className="small text-muted">Phase Amount</div>
                          <div className="font-weight-bold">
                            ₹{Number(selectedPhaseScenarioForecast.selectedPhaseAmount || 0).toLocaleString()}
                          </div>
                        </div>

                        <div className="col-md-3 mb-2">
                          <div className="small text-muted">Default Probability</div>
                          <div className="font-weight-bold">
                            {Math.round((selectedPhaseScenarioForecast.selectedPhaseProbability || 0) * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <ScenarioForecastCard
                    data={scenarioForecast}
                    selectedStage={selectedStage}
                    bottleneckData={pipelineBottleneck}
                  />

                  
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-5 mb-4">
            <DeadlineRiskCard data={deadlineRisk} />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-lg-12">
            <div className="card soft-card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-3">
                  <div>
                    <h5 className="mb-1 font-weight-bold">
                      Pipeline Bottleneck Visualization
                    </h5>
                    <p className="text-muted mb-0 small">
                      Click a stage bar to cross-filter the scenario forecast.
                    </p>
                  </div>

                  <span
                    className={`badge px-3 py-2 ${getSeverityBadgeClass(
                      pipelineBottleneck?.severity
                    )}`}
                  >
                    {pipelineBottleneck?.severity || "healthy"}
                  </span>
                </div>

                <div className="row mb-4">
                  <div className="col-md-4 mb-3">
                    <label className="form-label small font-weight-bold">
                      Stage Group
                    </label>
                    <select
                      className="form-control"
                      value={stageTypeFilter}
                      onChange={(e) => setStageTypeFilter(e.target.value)}
                    >
                      <option value="all">All Stages</option>
                      <option value="early">Early Stages</option>
                      <option value="late">Late Stages</option>
                      <option value="closed">Closed Only</option>
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label small font-weight-bold">
                      Sort By
                    </label>
                    <select
                      className="form-control"
                      value={sortMode}
                      onChange={(e) => setSortMode(e.target.value)}
                    >
                      <option value="percentage-desc">Highest Percentage</option>
                      <option value="percentage-asc">Lowest Percentage</option>
                      <option value="amount-desc">Highest Amount</option>
                      <option value="amount-asc">Lowest Amount</option>
                      <option value="count-desc">Highest Count</option>
                      <option value="count-asc">Lowest Count</option>
                      <option value="label-asc">Stage Name A-Z</option>
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label small font-weight-bold">
                      Minimum %: {minPercentage}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      className="form-range w-100"
                      value={minPercentage}
                      onChange={(e) => setMinPercentage(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                  <div className="small text-muted">
                    Showing {filteredStageDistribution.length} stage
                    {filteredStageDistribution.length !== 1 ? "s" : ""}
                  </div>

                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {selectedPhaseFilter ? (
                      <span className={`badge px-3 py-2 ${getPhaseBadgeClass(selectedPhaseFilter)}`}>
                        Active Cross-Filter: {getPhaseLabel(selectedPhaseFilter)}
                      </span>
                    ) : null}

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={clearBottleneckFilters}
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>

                {filteredTopStage ? (
                  <div className="mb-4">
                    <div className="p-3 rounded bg-light border">
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                          <div className="small text-muted">Top Visible Bottleneck</div>
                          <div className="font-weight-bold">
                            {filteredTopStage?.label ||
                              getPhaseLabel(filteredTopStage?.stage)}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="small text-muted">Pipeline Share</div>
                          <div className="font-weight-bold">
                            {filteredTopStage?.percentage || 0}%
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-muted small">
                        Click any stage below to filter the scenario forecast by that phase.
                      </div>
                    </div>
                  </div>
                ) : null}

                {filteredStageDistribution.length > 0 ? (
                  <div>
                    {filteredStageDistribution.map((stage) => {
                      const phaseColorClass = getPhaseBadgeClass(stage?.stage);
                      const isActive = selectedPhaseFilter === stage?.stage;

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
                        <button
                          key={stage.stage}
                          type="button"
                          className={`w-100 text-left border rounded p-3 mb-3 bg-white ${
                            isActive ? "shadow-sm border-primary" : ""
                          }`}
                          onClick={() => togglePhaseCrossFilter(stage.stage)}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                            <div className="d-flex align-items-center gap-2">
                              <span className={`badge ${phaseColorClass}`}>
                                {stage?.label || getPhaseLabel(stage?.stage)}
                              </span>
                              <span className="text-muted small">
                                {stage?.count || 0} items
                              </span>
                              {isActive ? (
                                <span className="badge badge-dark">Selected</span>
                              ) : null}
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
                                opacity: isActive ? 1 : 0.85,
                              }}
                              aria-valuenow={stage?.percentage || 0}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    No stages match the selected filters.
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
      <ScenarioSimulatorDrawer
        isOpen={isScenarioDrawerOpen}
        onClose={() => setIsScenarioDrawerOpen(false)}
        baseData={selectedPhaseScenarioForecast}
        selectedPhase={selectedPhaseFilter}
        selectedPhaseBids={selectedPhaseBids}
        getPhaseLabel={getPhaseLabel}
      />
    </div>
  );
}

export default Dashboard;