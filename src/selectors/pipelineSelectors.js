import { createSelector } from "@reduxjs/toolkit";

const selectBids = (state) => state.bids?.list || [];

export const selectBidStats = createSelector([selectBids], (bids) => {
  const totalBids = bids.length;

  const totalValue = bids.reduce((sum, bid) => sum + Number(bid.amount || 0), 0);

  const pendingCount = bids.filter((bid) => bid.status === "pending").length;
  const approvedCount = bids.filter((bid) => bid.status === "approved").length;
  const rejectedCount = bids.filter((bid) => bid.status === "rejected").length;

  const approvedValue = bids
    .filter((bid) => bid.status === "approved")
    .reduce((sum, bid) => sum + Number(bid.amount || 0), 0);

  const pendingValue = bids
    .filter((bid) => bid.status === "pending")
    .reduce((sum, bid) => sum + Number(bid.amount || 0), 0);

  const rejectedValue = bids
    .filter((bid) => bid.status === "rejected")
    .reduce((sum, bid) => sum + Number(bid.amount || 0), 0);

  return {
    totalBids,
    totalValue,
    pendingCount,
    approvedCount,
    rejectedCount,
    approvedValue,
    pendingValue,
    rejectedValue,
  };
});

export const selectPipelineHealth = createSelector([selectBids], (bids) => {
  const total = bids.length;

  const pending = bids.filter((bid) => bid.status === "pending").length;
  const approved = bids.filter((bid) => bid.status === "approved").length;
  const rejected = bids.filter((bid) => bid.status === "rejected").length;

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

export const selectSmartAlerts = createSelector([selectBids], (bids) => {
  const alerts = [];

  const pendingBids = bids.filter((bid) => bid.status === "pending");
  const rejectedBids = bids.filter((bid) => bid.status === "rejected");
  const approvedBids = bids.filter((bid) => bid.status === "approved");

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

    breakdown[status] = (breakdown[status] || 0) + amount;

    if (status === "pending") {
      totalOpenPipeline += amount;
    }

    weightedForecast += amount * probability;

    if (status === "approved") {
      committedRevenue += amount;
    }
  });

  // FIXED: Use inline function instead of external reference
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

export const selectStageConversion = createSelector([selectBids], (bids) => {
  const total = bids.length;

  const pendingCount = bids.filter((bid) => bid.status === "pending").length;
  const approvedCount = bids.filter((bid) => bid.status === "approved").length;
  const rejectedCount = bids.filter((bid) => bid.status === "rejected").length;

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

    // FIXED: Only process valid statuses to prevent NaN
    if (["pending", "approved", "rejected"].includes(status)) {
      stageCounts[status] += 1;
      stageAmounts[status] += amount;
    }
  });

  const total = bids.length;

  // FIXED: Explicitly define only your 3 statuses - NO NaN%
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

  const sortedStages = [...stageDistribution].sort(
    (a, b) => b.percentage - a.percentage
  );

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