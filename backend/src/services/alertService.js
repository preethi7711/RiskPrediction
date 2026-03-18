import { STATUS, ALERT_RECIPIENTS } from "../constants.js";
import { createTimestamp } from "../utils/formatters.js";

export const buildAlertsForWorker = (worker, previousStatus) => {
  if (worker.riskStatus === STATUS.SAFE) {
    return [];
  }

  const isEscalation =
    previousStatus !== worker.riskStatus ||
    (previousStatus === STATUS.WARNING && worker.riskStatus === STATUS.CRITICAL);

  if (!isEscalation) {
    return [];
  }

  const recipients =
    worker.riskStatus === STATUS.CRITICAL
      ? ALERT_RECIPIENTS.CRITICAL
      : ALERT_RECIPIENTS.WARNING;

  const timestamp = createTimestamp();

  return recipients.map((recipient, index) => ({
    id: `${worker.id}-${worker.riskStatus.toLowerCase()}-${Date.now()}-${index}`,
    workerId: worker.id,
    workerName: worker.name,
    recipient,
    severity: worker.riskStatus,
    message: `${recipient} notified: ${worker.name} is in ${worker.riskStatus.toLowerCase()} state due to ${worker.riskType.toLowerCase()}.`,
    createdAt: timestamp
  }));
};

export const buildLogsForWorker = (worker, previousStatus, alerts) => {
  const logs = [];
  const timestamp = createTimestamp();

  if (previousStatus !== worker.riskStatus) {
    logs.push({
      id: `${worker.id}-status-${Date.now()}`,
      workerId: worker.id,
      workerName: worker.name,
      level: worker.riskStatus,
      message: `${worker.name} changed from ${previousStatus} to ${worker.riskStatus}.`,
      createdAt: timestamp
    });
  }

  alerts.forEach((alert, index) => {
    logs.push({
      id: `${worker.id}-alert-log-${Date.now()}-${index}`,
      workerId: worker.id,
      workerName: worker.name,
      level: alert.severity,
      message: alert.message,
      createdAt: alert.createdAt
    });
  });

  if (worker.riskStatus === STATUS.CRITICAL && previousStatus !== STATUS.CRITICAL) {
    logs.push({
      id: `${worker.id}-critical-${Date.now()}`,
      workerId: worker.id,
      workerName: worker.name,
      level: STATUS.CRITICAL,
      message: `${worker.name} requires immediate intervention at ${worker.zone}.`,
      createdAt: timestamp
    });
  }

  return logs;
};

