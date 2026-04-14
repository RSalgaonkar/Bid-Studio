export const selectAnalyticsSummary = (state) => {
  const bids = state.bids.list;
  const clients = state.clients.list;

  const totalBids = bids.length;
  const totalClients = clients.length;
  const totalPipelineValue = bids.reduce((sum, bid) => sum + Number(bid.amount), 0);
  const wonValue = bids
    .filter((bid) => bid.status === "won")
    .reduce((sum, bid) => sum + Number(bid.amount), 0);

  const avgBidValue = totalBids > 0 ? Math.round(totalPipelineValue / totalBids) : 0;

  return {
    totalBids,
    totalClients,
    totalPipelineValue,
    wonValue,
    avgBidValue,
  };
};

export const selectStatusDistribution = (state) => {
  const bids = state.bids.list;

  const counts = {
    lead: 0,
    sent: 0,
    won: 0,
    lost: 0,
  };

  bids.forEach((bid) => {
    if (counts[bid.status] !== undefined) {
      counts[bid.status] += 1;
    }
  });

  return {
    labels: ["Lead", "Sent", "Won", "Lost"],
    values: [counts.lead, counts.sent, counts.won, counts.lost],
  };
};

export const selectRevenueByStatus = (state) => {
  const bids = state.bids.list;

  const totals = {
    lead: 0,
    sent: 0,
    won: 0,
    lost: 0,
  };

  bids.forEach((bid) => {
    if (totals[bid.status] !== undefined) {
      totals[bid.status] += Number(bid.amount);
    }
  });

  return {
    labels: ["Lead", "Sent", "Won", "Lost"],
    values: [totals.lead, totals.sent, totals.won, totals.lost],
  };
};

export const selectTopClients = (state) => {
  const bids = state.bids.list;
  const clients = state.clients.list;

  const totalsByClient = {};

  bids.forEach((bid) => {
    totalsByClient[bid.clientId] =
      (totalsByClient[bid.clientId] || 0) + Number(bid.amount);
  });

  return Object.entries(totalsByClient)
    .map(([clientId, total]) => {
      const client = clients.find((item) => item.id === Number(clientId));
      return {
        clientId: Number(clientId),
        clientName: client ? client.name : "Unknown Client",
        total,
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
};

export const selectMonthlyTrend = (state) => {
  const bids = state.bids.list;

  const monthMap = {};

  bids.forEach((bid) => {
    if (!bid.dueDate) return;

    const date = new Date(bid.dueDate);
    const monthKey = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    monthMap[monthKey] = (monthMap[monthKey] || 0) + Number(bid.amount);
  });

  const labels = Object.keys(monthMap);
  const values = Object.values(monthMap);

  return {
    labels,
    values,
  };
};