import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import StatusDoughnutChart from "../components/charts/StatusDoughnutChart";
import RevenueBarChart from "../components/charts/RevenueBarChart";
import TrendLineChart from "../components/charts/TrendLineChart";
import {
  selectAnalyticsSummary,
  selectStatusDistribution,
  selectRevenueByStatus,
  selectTopClients,
  selectMonthlyTrend,
} from "../features/bids/analyticsSelectors";

function AnalyticsPage({ setActivePage }) {
  const summary = useSelector(selectAnalyticsSummary);
  const statusDistribution = useSelector(selectStatusDistribution);
  const revenueByStatus = useSelector(selectRevenueByStatus);
  const topClients = useSelector(selectTopClients);
  const monthlyTrend = useSelector(selectMonthlyTrend);

  return (
    <div className="app-layout">
      <Sidebar activePage="analytics" setActivePage={setActivePage} />

      <div className="main-content p-4">
        <Header
          title="Analytics"
          subtitle="Track pipeline health, client value, and proposal performance."
          buttonText="Back to Dashboard"
          onButtonClick={() => setActivePage("dashboard")}
        />

        <div className="row mb-4">
          <div className="col-sm-6 col-xl-3 mb-3">
            <StatCard
              title="Total Bids"
              value={summary.totalBids}
              subtitle="All proposals created"
              color="primary"
            />
          </div>
          <div className="col-sm-6 col-xl-3 mb-3">
            <StatCard
              title="Total Clients"
              value={summary.totalClients}
              subtitle="Clients in database"
              color="warning"
            />
          </div>
          <div className="col-sm-6 col-xl-3 mb-3">
            <StatCard
              title="Pipeline Value"
              value={`₹${summary.totalPipelineValue.toLocaleString()}`}
              subtitle="Combined proposal value"
              color="success"
            />
          </div>
          <div className="col-sm-6 col-xl-3 mb-3">
            <StatCard
              title="Avg Bid Value"
              value={`₹${summary.avgBidValue.toLocaleString()}`}
              subtitle="Average proposal amount"
              color="danger"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-xl-6 mb-4">
            <div className="card analytics-card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="font-weight-bold mb-1">Bid Status Mix</h5>
                <p className="text-muted small mb-4">
                  Distribution of bids by current stage
                </p>
                <StatusDoughnutChart data={statusDistribution} />
              </div>
            </div>
          </div>

          <div className="col-xl-6 mb-4">
            <div className="card analytics-card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="font-weight-bold mb-1">Revenue by Status</h5>
                <p className="text-muted small mb-4">
                  Pipeline value split by proposal status
                </p>
                <RevenueBarChart data={revenueByStatus} />
              </div>
            </div>
          </div>

          <div className="col-12 mb-4">
            <div className="card analytics-card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="font-weight-bold mb-1">Monthly Pipeline Trend</h5>
                <p className="text-muted small mb-4">
                  Value trend based on proposal due dates
                </p>
                <TrendLineChart data={monthlyTrend} />
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card analytics-card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="font-weight-bold mb-1">Top Clients</h5>
                    <p className="text-muted small mb-0">
                      Highest total proposal value
                    </p>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table modern-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Total Bid Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topClients.length > 0 ? (
                        topClients.map((client) => (
                          <tr key={client.clientId}>
                            <td>{client.clientName}</td>
                            <td>₹{client.total.toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center text-muted py-4">
                            No analytics data available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="alert alert-light border mt-3 mb-0">
                  Won pipeline value: <strong>₹{summary.wonValue.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;