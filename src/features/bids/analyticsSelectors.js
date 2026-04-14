import { createSelector } from "@reduxjs/toolkit";

const selectBids = (state) => state.bids?.list || [];
const selectClients = (state) => state.clients?.list || [];

export const selectAnalyticsSummary = createSelector(
  [selectBids, selectClients],
  (bids, clients) => {
    const totalBids = bids.length;
    const totalClients = clients.length;

    const totalPipelineValue = bids.reduce(
      (sum, bid) => sum + Number(bid?.amount || 0),
      0
    );

    const wonValue = bids
      .filter((bid) => bid?.status === "won")
      .reduce((sum, bid) => sum + Number(bid?.amount || 0), 0);

    const avgBidValue =
      totalBids > 0 ? Math.round(totalPipelineValue / totalBids) : 0;

    return {
      totalBids,
      totalClients,
      totalPipelineValue,
      wonValue,
      avgBidValue,
    };
  }
);

export const selectStatusDistribution = createSelector([selectBids], (bids) => {
  const counts = {
    lead: 0,
    sent: 0,
    won: 0,
    lost: 0,
  };

  bids.forEach((bid) => {
    const status = bid?.status;
    if (counts[status] !== undefined) {
      counts[status] += 1;
    }
  });

  return {
    labels: ["Lead", "Sent", "Won", "Lost"],
    values: [counts.lead, counts.sent, counts.won, counts.lost],
  };
});

export const selectRevenueByStatus = createSelector([selectBids], (bids) => {
  const totals = {
    lead: 0,
    sent: 0,
    won: 0,
    lost: 0,
  };

  bids.forEach((bid) => {
    const status = bid?.status;
    if (totals[status] !== undefined) {
      totals[status] += Number(bid?.amount || 0);
    }
  });

  return {
    labels: ["Lead", "Sent", "Won", "Lost"],
    values: [totals.lead, totals.sent, totals.won, totals.lost],
  };
});

export const selectTopClients = createSelector(
  [selectBids, selectClients],
  (bids, clients) => {
    const totalsByClient = {};

    bids.forEach((bid) => {
      const clientId = bid?.clientId;
      if (clientId == null) return;

      totalsByClient[clientId] =
        (totalsByClient[clientId] || 0) + Number(bid?.amount || 0);
    });

    return Object.entries(totalsByClient)
      .map(([clientId, total]) => {
        const client = clients.find((item) => item?.id === Number(clientId));

        return {
          clientId: Number(clientId),
          clientName: client?.name || "Unknown Client",
          total,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }
);

export const selectMonthlyTrend = createSelector([selectBids], (bids) => {
  const monthMap = {};

  bids.forEach((bid) => {
    if (!bid?.dueDate) return;

    const date = new Date(bid.dueDate);
    if (Number.isNaN(date.getTime())) return;

    const monthKey = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    monthMap[monthKey] = (monthMap[monthKey] || 0) + Number(bid?.amount || 0);
  });

  return {
    labels: Object.keys(monthMap),
    values: Object.values(monthMap),
  };
});