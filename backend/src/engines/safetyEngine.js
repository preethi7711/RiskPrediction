import { STATUS } from "../constants.js";
import { clamp } from "../utils/formatters.js";

const countRecent = (history, predicate, limit = 5) =>
  history.slice(-limit).filter(predicate).length;

export const evaluateWorkerSafety = (worker) => {
  const history = worker.history || [];
  const recentNoMovement = countRecent(
    history,
    (point) => point.movement === "None"
  );
  const previousPoint = history[history.length - 2];
  const riskDelta = previousPoint ? worker.riskScore - previousPoint.riskScore : 0;

  let riskScore = 0;
  let heatScore = 0;
  let collapseScore = 0;
  const reasons = [];

  if (worker.heartRate >= 105) {
    const heartRateRisk = 12 + (worker.heartRate - 105) * 1.35;
    riskScore += heartRateRisk;
    heatScore += heartRateRisk;
    reasons.push("elevated heart rate");
  }

  if (worker.temperature >= 38) {
    const temperatureRisk = 16 + (worker.temperature - 38) * 28;
    riskScore += temperatureRisk;
    heatScore += temperatureRisk + 8;
    reasons.push("high temperature");
  }

  if (worker.movement === "Slow") {
    riskScore += 8;
    collapseScore += 6;
  }

  if (worker.movement === "None") {
    const inactivityRisk = 34 + recentNoMovement * 7;
    riskScore += inactivityRisk;
    collapseScore += inactivityRisk + 8;
    reasons.push("inactivity");
  }

  if (worker.heartRate >= 110 && worker.temperature >= 38.5) {
    riskScore += 18;
    heatScore += 14;
  }

  if (worker.movement === "None" && worker.heartRate >= 95) {
    riskScore += 12;
    collapseScore += 12;
  }

  if (worker.movement === "None" && worker.temperature >= 38) {
    riskScore += 10;
    collapseScore += 10;
  }

  riskScore = clamp(Math.round(riskScore), 0, 100);

  let riskStatus = STATUS.SAFE;
  if (riskScore >= 70) {
    riskStatus = STATUS.CRITICAL;
  } else if (riskScore >= 35) {
    riskStatus = STATUS.WARNING;
  }

  let riskType = "Stable";
  if (riskScore >= 35) {
    if (heatScore >= 28 && collapseScore >= 28) {
      riskType = "Compound Risk";
    } else if (collapseScore >= heatScore) {
      riskType = "Collapse Risk";
    } else {
      riskType = "Heat Risk";
    }
  }

  let explanation = "Vitals are within the expected operating range.";
  if (reasons.length > 0) {
    const prefix =
      riskStatus === STATUS.CRITICAL ? "High risk due to" : "Rising risk due to";
    explanation = `${prefix} ${reasons.join(", ")}.`;
  }

  let prediction = "No immediate danger predicted.";
  if (riskType === "Collapse Risk" || (riskType === "Compound Risk" && worker.movement === "None")) {
    const seconds = clamp(30 - Math.floor(riskScore / 4) - recentNoMovement * 2, 8, 28);
    prediction =
      riskStatus === STATUS.SAFE
        ? "Movement is stable."
        : `Possible collapse in ${seconds} seconds if inactivity continues.`;
  } else if (riskType === "Heat Risk" || riskType === "Compound Risk") {
    const seconds = clamp(34 - Math.floor(riskScore / 5), 10, 30);
    prediction =
      riskStatus === STATUS.SAFE
        ? "Heat trend is controlled."
        : `Possible heat stress escalation in ${seconds} seconds.`;
  }

  if (riskStatus !== STATUS.SAFE && riskDelta >= 10) {
    prediction = `${prediction} Risk is accelerating.`;
  }

  return {
    riskScore,
    riskStatus,
    riskType,
    explanation,
    prediction
  };
};

