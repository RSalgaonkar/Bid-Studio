import { createSelector } from "@reduxjs/toolkit";

const selectBids = (state) => state.bids?.list || [];
const selectClients = (state) => state.clients?.list || [];

const getDaysDifference = (dateString) => {
  if (!dateString) return null;

  const today = new Date();
  const target = new Date(dateString);

  if (Number.isNaN(target.getTime())) return null;

  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const targetOnly = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  const diffTime = targetOnly - todayOnly;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

export const selectPipelineHealth = createSelector(
  [selectBids, selectClients],
  (bids, clients) => {
    const totalBids = bids.length;
    const totalClients = clients.length;

    let wonCount = 0;
    let lostCount = 0;
    let sentCount = 0;
    let leadCount = 0;

    let totalPipelineValue = 0;
    let wonValue = 0;
    let overdueCount = 0;
    let dueSoonCount = 0;

    bids.forEach((bid) => {
      const status = bid?.status || "";
      const amount = Number(bid?.amount || 0);
      const dueDate = bid?.dueDate;

      totalPipelineValue += amount;

      if (status === "won") {
        wonCount += 1;
        wonValue += amount;
      } else if (status === "lost") {
        lostCount += 1;
      } else if (status === "sent") {
        sentCount += 1;
      } else if (status === "lead") {
        leadCount += 1;
      }

      const diffDays = getDaysDifference(dueDate);

      if (diffDays !== null) {
        if (diffDays < 0 && status !== "won" && status !== "lost") {
          overdueCount += 1;
        } else if (
          diffDays >= 0 &&
          diffDays <= 7 &&
          status !== "won" &&
          status !== "lost"
        ) {
          dueSoonCount += 1;
        }
      }
    });

    const winRate = totalBids > 0 ? Math.round((wonCount / totalBids) * 100) : 0;
    const lossRate = totalBids > 0 ? Math.round((lostCount / totalBids) * 100) : 0;

    let score = 50;

    score += wonCount * 6;
    score += sentCount * 2;
    score += totalClients > 0 ? 5 : 0;
    score -= lostCount * 4;
    score -= overdueCount * 6;
    score -= dueSoonCount * 2;
    score -= leadCount > sentCount ? 5 : 0;

    if (totalPipelineValue >= 200000) score += 10;
    if (wonValue >= 100000) score += 10;

    score = Math.max(0, Math.min(100, score));

    let healthLabel = "Critical";
    if (score >= 80) healthLabel = "Excellent";
    else if (score >= 65) healthLabel = "Good";
    else if (score >= 45) healthLabel = "Average";
    else if (score >= 25) healthLabel = "Weak";

    return {
      score,
      healthLabel,
      totalBids,
      totalClients,
      totalPipelineValue,
      wonValue,
      winRate,
      lossRate,
      overdueCount,
      dueSoonCount,
      leadCount,
      sentCount,
      wonCount,
      lostCount,
    };
  }
);

export const selectSmartAlerts = createSelector([selectBids], (bids) => {
  const alerts = [];

  const openBids = bids.filter(
    (bid) => bid?.status !== "won" && bid?.status !== "lost"
  );

  const overdueBids = openBids.filter((bid) => {
    const diffDays = getDaysDifference(bid?.dueDate);
    return diffDays !== null && diffDays < 0;
  });

  const dueSoonBids = openBids.filter((bid) => {
    const diffDays = getDaysDifference(bid?.dueDate);
    return diffDays !== null && diffDays >= 0 && diffDays <= 7;
  });

  const highValueOpenBids = openBids.filter(
    (bid) => Number(bid?.amount || 0) >= 50000
  );

  const leadBids = bids.filter((bid) => bid?.status === "lead");
  const sentBids = bids.filter((bid) => bid?.status === "sent");
  const lostBids = bids.filter((bid) => bid?.status === "lost");

  if (overdueBids.length > 0) {
    alerts.push({
      id: "overdue-bids",
      type: "danger",
      title: "Overdue bids need attention",
      message: `${overdueBids.length} open bid(s) are past due date.`,
    });
  }

  if (dueSoonBids.length > 0) {
    alerts.push({
      id: "due-soon-bids",
      type: "warning",
      title: "Upcoming bid deadlines",
      message: `${dueSoonBids.length} open bid(s) are due within 7 days.`,
    });
  }

  if (highValueOpenBids.length > 0) {
    alerts.push({
      id: "high-value-open",
      type: "info",
      title: "High-value opportunities open",
      message: `${highValueOpenBids.length} open bid(s) are worth ₹50,000 or more.`,
    });
  }

  if (leadBids.length > sentBids.length) {
    alerts.push({
      id: "lead-conversion",
      type: "warning",
      title: "Too many bids are still in lead stage",
      message: "Consider pushing more leads into sent stage to improve pipeline movement.",
    });
  }

  if (lostBids.length >= 3) {
    alerts.push({
      id: "loss-pattern",
      type: "secondary",
      title: "Loss trend detected",
      message: `${lostBids.length} bids are currently marked as lost.`,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "healthy-pipeline",
      type: "success",
      title: "Pipeline looks healthy",
      message: "No major delivery or follow-up risks detected right now.",
    });
  }

  return alerts;
});