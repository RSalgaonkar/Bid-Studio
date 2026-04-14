import { createSelector } from "@reduxjs/toolkit";

const selectBids = (state) => state.bids?.list || [];
const selectClients = (state) => state.clients?.list || [];

// Phase configuration
export const PHASE_CONFIG = {
  new: {
    label: "New",
    color: "info",
    probability: 0.1,
  },
  proposal: {
    label: "Proposal Sent",
    color: "warning",
    probability: 0.3,
  },
  in_review: {
    label: "In Review",
    color: "primary",
    probability: 0.6,
  },
  won: {
    label: "Won",
    color: "success",
    probability: 1,
  },
  executing: {
    label: "Executing",
    color: "info",
    probability: 0.9,
  },
  delivered: {
    label: "Delivered",
    color: "success",
    probability: 1,
  },
  closed: {
    label: "Closed",
    color: "secondary",
    probability: 0,
  },
};

// Backward compatibility for old status-based bids
const mapStatusToPhase = (bid) => {
  if (bid?.phase && PHASE_CONFIG[bid.phase]) {
    return bid.phase;
  }

  switch (bid?.status) {
    case "pending":
      return "proposal";
    case "approved":
      return "won";
    case "rejected":
      return "closed";
    default:
      return "new";
  }
};

export const selectBidsByPhase = createSelector([selectBids], (bids) => {
  const grouped = {
    new: [],
    proposal: [],
    in_review: [],
    won: [],
    executing: [],
    delivered: [],
    closed: [],
  };

  bids.forEach((bid) => {
    const phase = mapStatusToPhase(bid);

    if (grouped[phase]) {
      grouped[phase].push({
        ...bid,
        phase,
      });
    }
  });

  return grouped;
});

export const selectBidStats = createSelector([selectBidsByPhase], (grouped) => {
  const allBids = Object.values(grouped).flat();

  const totalBids = allBids.length;
  const totalValue = allBids.reduce((sum, bid) => sum + Number(bid.amount || 0), 0);

  const phaseValues = Object.keys(grouped).reduce((acc, phase) => {
    acc[phase] = grouped[phase].reduce(
      (sum, bid) => sum + Number(bid.amount || 0),
      0
    );
    return acc;
  }, {});

  return {
    totalBids,
    totalValue,
    newCount: grouped.new.length,
    proposalCount: grouped.proposal.length,
    inReviewCount: grouped.in_review.length,
    wonCount: grouped.won.length,
    executingCount: grouped.executing.length,
    deliveredCount: grouped.delivered.length,
    closedCount: grouped.closed.length,
    newValue: phaseValues.new || 0,
    proposalValue: phaseValues.proposal || 0,
    inReviewValue: phaseValues.in_review || 0,
    wonValue: phaseValues.won || 0,
    executingValue: phaseValues.executing || 0,
    deliveredValue: phaseValues.delivered || 0,
    closedValue: phaseValues.closed || 0,
  };
});

export const selectPipelineHealth = createSelector([selectBidsByPhase], (grouped) => {
  const total = Object.values(grouped).reduce((sum, bids) => sum + bids.length, 0);

  const earlyStage =
    grouped.new.length + grouped.proposal.length + grouped.in_review.length;

  const lateStage =
    grouped.won.length + grouped.executing.length + grouped.delivered.length;

  const closed = grouped.closed.length;

  const progressionRate = total > 0 ? Math.round((lateStage / total) * 100) : 0;
  const closedRate = total > 0 ? Math.round((closed / total) * 100) : 0;
  const earlyStageRate = total > 0 ? Math.round((earlyStage / total) * 100) : 0;

  let healthScore = 100 - closedRate;

  if (earlyStageRate > 50) {
    healthScore -= 10;
  }

  if (progressionRate < 30) {
    healthScore -= 10;
  }

  if (healthScore < 0) {
    healthScore = 0;
  }

  return {
    total,
    earlyStage,
    lateStage,
    closed,
    progressionRate,
    closedRate,
    earlyStageRate,
    healthScore,
  };
});

export const selectSmartAlerts = createSelector([selectBidsByPhase], (grouped) => {
  const alerts = [];

  const proposalBids = grouped.proposal;
  const reviewBids = grouped.in_review;
  const wonBids = grouped.won;
  const executingBids = grouped.executing;
  const closedBids = grouped.closed;

  if (proposalBids.length >= 3) {
    alerts.push({
      id: `proposal-${proposalBids.length}`,
      type: "warning",
      message: `${proposalBids.length} proposals are waiting for client movement.`,
    });
  }

  if (reviewBids.length >= 3) {
    alerts.push({
      id: `review-${reviewBids.length}`,
      type: "info",
      message: `${reviewBids.length} bids are in review. Follow up with clients soon.`,
    });
  }

  if (closedBids.length >= 2) {
    alerts.push({
      id: `closed-${closedBids.length}`,
      type: "danger",
      message: `${closedBids.length} opportunities were closed/lost. Review pricing or pitch quality.`,
    });
  }

  if (wonBids.length >= 2) {
    alerts.push({
      id: `won-${wonBids.length}`,
      type: "success",
      message: `${wonBids.length} bids are won. Strong deal conversion momentum.`,
    });
  }

  if (executingBids.length >= 2) {
    alerts.push({
      id: `executing-${executingBids.length}`,
      type: "primary",
      message: `${executingBids.length} projects are currently executing. Delivery workload is growing.`,
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

export const selectWeightedForecast = createSelector([selectBidsByPhase], (grouped) => {
  const allBids = Object.values(grouped).flat();

  let totalOpenPipeline = 0;
  let weightedForecast = 0;
  let committedRevenue = 0;

  const breakdown = {
    new: 0,
    proposal: 0,
    in_review: 0,
    won: 0,
    executing: 0,
    delivered: 0,
    closed: 0,
  };

  allBids.forEach((bid) => {
    const phase = bid?.phase || mapStatusToPhase(bid);
    const amount = Number(bid?.amount || 0);
    const probability = PHASE_CONFIG[phase]?.probability ?? 0;

    breakdown[phase] = (breakdown[phase] || 0) + amount;

    if (["new", "proposal", "in_review"].includes(phase)) {
      totalOpenPipeline += amount;
    }

    weightedForecast += amount * probability;

    if (["won", "executing", "delivered"].includes(phase)) {
      committedRevenue += amount;
    }
  });

  const openWeighted = allBids
    .filter((bid) => ["new", "proposal", "in_review"].includes(bid.phase))
    .reduce((sum, bid) => {
      const amount = Number(bid.amount || 0);
      const probability = PHASE_CONFIG[bid.phase]?.probability ?? 0;
      return sum + amount * probability;
    }, 0);

  return {
    probabilityMap: Object.keys(PHASE_CONFIG).reduce((acc, phase) => {
      acc[phase] = PHASE_CONFIG[phase].probability;
      return acc;
    }, {}),
    totalOpenPipeline,
    weightedForecast: Math.round(weightedForecast),
    committedRevenue,
    forecastGap: Math.round(totalOpenPipeline - openWeighted),
    breakdown,
  };
});

export const selectStageConversion = createSelector([selectBidsByPhase], (grouped) => {
  const total = Object.values(grouped).reduce((sum, bids) => sum + bids.length, 0);

  const newCount = grouped.new.length;
  const proposalCount = grouped.proposal.length;
  const inReviewCount = grouped.in_review.length;
  const wonCount = grouped.won.length;
  const executingCount = grouped.executing.length;
  const deliveredCount = grouped.delivered.length;
  const closedCount = grouped.closed.length;

  const newRate = total > 0 ? Math.round((newCount / total) * 100) : 0;
  const proposalRate = total > 0 ? Math.round((proposalCount / total) * 100) : 0;
  const inReviewRate = total > 0 ? Math.round((inReviewCount / total) * 100) : 0;
  const wonRate = total > 0 ? Math.round((wonCount / total) * 100) : 0;
  const executingRate = total > 0 ? Math.round((executingCount / total) * 100) : 0;
  const deliveredRate = total > 0 ? Math.round((deliveredCount / total) * 100) : 0;
  const closedRate = total > 0 ? Math.round((closedCount / total) * 100) : 0;

  return {
    total,
    newCount,
    proposalCount,
    inReviewCount,
    wonCount,
    executingCount,
    deliveredCount,
    closedCount,
    newRate,
    proposalRate,
    inReviewRate,
    wonRate,
    executingRate,
    deliveredRate,
    closedRate,
  };
});

export const selectPipelineBottleneck = createSelector([selectBidsByPhase], (grouped) => {
  const allBids = Object.values(grouped).flat();
  const total = allBids.length;

  const stageDistribution = Object.keys(PHASE_CONFIG).map((phase) => {
    const phaseBids = grouped[phase] || [];
    const amount = phaseBids.reduce((sum, bid) => sum + Number(bid.amount || 0), 0);

    return {
      stage: phase,
      label: PHASE_CONFIG[phase].label,
      count: phaseBids.length,
      amount,
      percentage: total > 0 ? Math.round((phaseBids.length / total) * 100) : 0,
    };
  });

  const sortedStages = [...stageDistribution].sort(
    (a, b) => b.percentage - a.percentage
  );

  const topStage = sortedStages[0] || null;

  let severity = "healthy";
  let insight = "Pipeline looks balanced.";

  if (topStage) {
    if (topStage.percentage >= 50) {
      severity = "high";
      insight = `${topStage.label} holds ${topStage.percentage}% of pipeline items. This is a major concentration risk.`;
    } else if (topStage.percentage >= 35) {
      severity = "medium";
      insight = `${topStage.label} holds ${topStage.percentage}% of pipeline items. Watch this phase closely.`;
    } else if (topStage.percentage >= 25) {
      severity = "low";
      insight = `${topStage.label} is currently the largest phase at ${topStage.percentage}%.`;
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

export const selectScenarioForecast = createSelector([selectBidsByPhase], (grouped) => {
  const allBids = Object.values(grouped).flat();

  const scenarios = {
    best: {
      new: 0.2,
      proposal: 0.5,
      in_review: 0.8,
      won: 1,
      executing: 1,
      delivered: 1,
      closed: 0,
    },
    base: {
      new: 0.1,
      proposal: 0.3,
      in_review: 0.6,
      won: 1,
      executing: 0.9,
      delivered: 1,
      closed: 0,
    },
    worst: {
      new: 0.05,
      proposal: 0.2,
      in_review: 0.4,
      won: 1,
      executing: 0.8,
      delivered: 1,
      closed: 0,
    },
  };

  const calculateScenario = (probabilityMap) => {
    return Math.round(
      allBids.reduce((total, bid) => {
        const phase = bid?.phase || mapStatusToPhase(bid);
        const amount = Number(bid?.amount || 0);
        const probability = probabilityMap[phase] ?? 0;
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

export const selectDeadlineRisk = createSelector([selectBidsByPhase], (grouped) => {
  const today = new Date();
  const actionableBids = [
    ...grouped.proposal,
    ...grouped.in_review,
    ...grouped.won,
    ...grouped.executing,
  ];

  const enriched = actionableBids.map((bid) => {
    const deadlineDate = bid?.deadline ? new Date(bid.deadline) : today;
    const diffTime = deadlineDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let urgency = "safe";

    if (daysLeft < 0) {
      urgency = "overdue";
    } else if (daysLeft <= 3) {
      urgency = "critical";
    } else if (daysLeft <= 7) {
      urgency = "warning";
    }

    return {
      ...bid,
      daysLeft,
      urgency,
    };
  });

  const riskyBids = enriched
    .filter((bid) =>
      ["overdue", "critical", "warning"].includes(bid.urgency)
    )
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return {
    riskyCount: riskyBids.length,
    riskyBids,
  };
});

export const selectDashboardSummary = createSelector(
  [selectBids, selectClients, selectBidsByPhase],
  (bids, clients, grouped) => {
    const totalPipeline = bids.reduce(
      (sum, bid) => sum + Number(bid?.amount || 0),
      0
    );

    const activeClients = clients.filter(
      (client) => client?.status === "active"
    );

    const recentBids = [...bids]
      .map((bid) => ({
        ...bid,
        phase: mapStatusToPhase(bid),
      }))
      .sort((a, b) => Number(b?.id || 0) - Number(a?.id || 0))
      .slice(0, 5);

    return {
      totalPipeline,
      newBids: grouped.new,
      proposalBids: grouped.proposal,
      inReviewBids: grouped.in_review,
      wonBids: grouped.won,
      executingBids: grouped.executing,
      deliveredBids: grouped.delivered,
      closedBids: grouped.closed,
      activeClients,
      recentBids,
      totalClients: clients.length,
    };
  }
);