import { createSelector } from "@reduxjs/toolkit";

const selectBids = (state) => state.bids?.list || [];
const selectClients = (state) => state.clients?.list || [];

// Reusable grouped selector to avoid repeated filtering
export const selectBidsByStatus = createSelector([selectBids], (bids) => {
  const grouped = {
    pending: [],
    approved: [],
    rejected: [],
  };

  bids.forEach((bid) => {
    const status = bid?.status || "pending";

    if (grouped[status]) {
      grouped[status].push(bid);
    }
  });

  return grouped;
});

export const selectBidStats = createSelector([selectBidsByStatus], (grouped) => {
  const pending = grouped.pending;
  const approved = grouped.approved;
  const rejected = grouped.rejected;

  const allBids = [...pending, ...approved, ...rejected];

  const totalBids = allBids.length;
  const totalValue = allBids.reduce((sum, bid) => sum + Number(bid.amount || 0), 0);

  const approvedValue = approved.reduce((sum, bid) => sum + Number(bid.amount || 0), 0);
  const pendingValue = pending.reduce((sum, bid) => sum + Number(bid.amount || 0), 0);
  const rejectedValue = rejected.reduce((sum, bid) => sum + Number(bid.amount || 0), 0);

  return {
    totalBids,
    totalValue,
    pendingCount: pending.length,
    approvedCount: approved.length,
    rejectedCount: rejected.length,
    approvedValue,
    pendingValue,
    rejectedValue,
  };
});

export const selectPipelineHealth = createSelector([selectBidsByStatus], (grouped) => {
  const pending = grouped.pending.length;
  const approved = grouped.approved.length;
  const rejected = grouped.rejected.length;
  const total = pending + approved + rejected;

  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;
  const rejectionRate = total > 0 ? Math.round((rejected / total) * 100) : 0;
  const pendingRate = total > 0 ? Math.round((pending / total) * 100) : 0;

  let healthScore = 100 - rejectionRate;

  if (pendingRate > 50) {
    healthScore -= 10;
  }

  if (approvalRate < 30) {
    healthScore -= 10;
  }

  if (healthScore < 0) {
    healthScore = 0;
  }

  return {
    total,
    pending,
    approved,
    rejected,
    approvalRate,
    rejectionRate,
    pendingRate,
    healthScore,
  };
});

export const selectSmartAlerts = createSelector([selectBidsByStatus], (grouped) => {
  const alerts = [];

  const pendingBids = grouped.pending;
  const rejectedBids = grouped.rejected;
  const approvedBids = grouped.approved;

  if (pendingBids.length >= 3) {
    alerts.push({
      id: `pending-${pendingBids.length}`,
      type: "warning",
      message: `${pendingBids.length} bids are still pending. Review follow-ups.`,
    });
  }

  if (rejectedBids.length >= 2) {
    alerts.push({
      id: `rejected-${rejectedBids.length}`,
      type: "danger",
      message: `${rejectedBids.length} bids were rejected. Review proposal quality or pricing.`,
    });
  }

  if (approvedBids.length >= 3) {
    alerts.push({
      id: `approved-${approvedBids.length}`,
      type: "success",
      message: `${approvedBids.length} bids are approved. Strong conversion momentum.`,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "no-alerts",
      type: "info",
      message: "No major pipeline alerts right now.",
    });
  }

  return alerts;
});

export const selectWeightedForecast = createSelector([selectBids], (bids) => {
  const probabilityMap = {
    pending: 0.5,
    approved: 1,
    rejected: 0,
  };

  let totalOpenPipeline = 0;
  let weightedForecast = 0;
  let committedRevenue = 0;

  const breakdown = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  bids.forEach((bid) => {
    const status = bid?.status || "pending";
    const amount = Number(bid?.amount || 0);
    const probability = probabilityMap[status] ?? 0;

    if (breakdown[status] !== undefined) {
      breakdown[status] += amount;
    }

    if (status === "pending") {
      totalOpenPipeline += amount;
    }

    weightedForecast += amount * probability;

    if (status === "approved") {
      committedRevenue += amount;
    }
  });

  const pendingWeighted = bids
    .filter((bid) => bid.status === "pending")
    .reduce((sum, bid) => sum + Number(bid.amount || 0) * 0.5, 0);

  return {
    probabilityMap,
    totalOpenPipeline,
    weightedForecast: Math.round(weightedForecast),
    committedRevenue,
    forecastGap: Math.round(totalOpenPipeline - pendingWeighted),
    breakdown,
  };
});

export const selectStageConversion = createSelector([selectBidsByStatus], (grouped) => {
  const pendingCount = grouped.pending.length;
  const approvedCount = grouped.approved.length;
  const rejectedCount = grouped.rejected.length;
  const total = pendingCount + approvedCount + rejectedCount;

  const approvalRate = total > 0 ? Math.round((approvedCount / total) * 100) : 0;
  const rejectionRate = total > 0 ? Math.round((rejectedCount / total) * 100) : 0;
  const pendingRate = total > 0 ? Math.round((pendingCount / total) * 100) : 0;

  return {
    total,
    pendingCount,
    approvedCount,
    rejectedCount,
    approvalRate,
    rejectionRate,
    pendingRate,
  };
});

export const selectPipelineBottleneck = createSelector([selectBids], (bids) => {
  const stageCounts = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  const stageAmounts = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  bids.forEach((bid) => {
    const status = bid?.status || "pending";
    const amount = Number(bid?.amount || 0);

    if (["pending", "approved", "rejected"].includes(status)) {
      stageCounts[status] += 1;
      stageAmounts[status] += amount;
    }
  });

  const total = bids.length;

  const stageDistribution = [
    {
      stage: "pending",
      count: stageCounts.pending,
      amount: stageAmounts.pending,
      percentage: total > 0 ? Math.round((stageCounts.pending / total) * 100) : 0,
    },
    {
      stage: "approved",
      count: stageCounts.approved,
      amount: stageAmounts.approved,
      percentage: total > 0 ? Math.round((stageCounts.approved / total) * 100) : 0,
    },
    {
      stage: "rejected",
      count: stageCounts.rejected,
      amount: stageAmounts.rejected,
      percentage: total > 0 ? Math.round((stageCounts.rejected / total) * 100) : 0,
    },
  ];

  const sortedStages = [...stageDistribution].sort((a, b) => b.percentage - a.percentage);
  const topStage = sortedStages[0] || null;

  let severity = "healthy";
  let insight = "Pipeline looks balanced.";

  if (topStage) {
    if (topStage.percentage >= 50) {
      severity = "high";
      insight = `${topStage.stage} stage holds ${topStage.percentage}% of bids. This is a major concentration risk.`;
    } else if (topStage.percentage >= 35) {
      severity = "medium";
      insight = `${topStage.stage} stage holds ${topStage.percentage}% of bids. Watch this stage closely.`;
    } else if (topStage.percentage >= 25) {
      severity = "low";
      insight = `${topStage.stage} stage is the biggest share at ${topStage.percentage}%.`;
    }
  }

  return {
    total,
    topStage,
    severity,
    insight,
    stageDistribution,
  };
});

export const selectScenarioForecast = createSelector([selectBids], (bids) => {
  const scenarios = {
    best: { pending: 0.7, approved: 1, rejected: 0 },
    base: { pending: 0.5, approved: 1, rejected: 0 },
    worst: { pending: 0.3, approved: 1, rejected: 0 },
  };

  const calculateScenario = (probabilityMap) => {
    return Math.round(
      bids.reduce((total, bid) => {
        const status = bid?.status || "pending";
        const amount = Number(bid?.amount || 0);
        const probability = probabilityMap[status] ?? 0;
        return total + amount * probability;
      }, 0)
    );
  };

  return {
    bestCase: calculateScenario(scenarios.best),
    baseCase: calculateScenario(scenarios.base),
    worstCase: calculateScenario(scenarios.worst),
    scenarios,
  };
});

export const selectDeadlineRisk = createSelector([selectBids], (bids) => {
  const today = new Date();

  const enriched = bids.map((bid) => {
    const deadlineDate = bid?.deadline ? new Date(bid.deadline) : today;
    const diffTime = deadlineDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let urgency = "safe";

    if (bid.status === "pending") {
      if (daysLeft < 0) {
        urgency = "overdue";
      } else if (daysLeft <= 3) {
        urgency = "critical";
      } else if (daysLeft <= 7) {
        urgency = "warning";
      }
    }

    return {
      ...bid,
      daysLeft,
      urgency,
    };
  });

  const riskyBids = enriched
    .filter(
      (bid) =>
        bid.status === "pending" &&
        (bid.urgency === "overdue" ||
          bid.urgency === "critical" ||
          bid.urgency === "warning")
    )
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return {
    riskyCount: riskyBids.length,
    riskyBids,
  };
});

// Optional combined selector for dashboard
export const selectDashboardSummary = createSelector(
  [selectBids, selectClients, selectBidsByStatus],
  (bids, clients, grouped) => {
    const totalPipeline = bids.reduce((sum, bid) => sum + Number(bid?.amount || 0), 0);

    const activeClients = clients.filter((client) => client?.status === "active");

    const recentBids = [...bids]
      .sort((a, b) => Number(b?.id || 0) - Number(a?.id || 0))
      .slice(0, 5);

    return {
      totalPipeline,
      pendingBids: grouped.pending,
      approvedBids: grouped.approved,
      rejectedBids: grouped.rejected,
      activeClients,
      recentBids,
      totalClients: clients.length,
    };
  }
);