import { config } from "../config.js";

export class DashboardStore {
  constructor(workers = []) {
    this.workers = workers;
    this.alerts = [];
    this.logs = [];
  }

  setWorkers(workers) {
    this.workers = workers;
  }

  addAlerts(alerts) {
    this.alerts = [...alerts, ...this.alerts].slice(0, config.maxAlerts);
  }

  addLogs(logs) {
    this.logs = [...logs, ...this.logs].slice(0, config.maxLogs);
  }

  getSnapshot() {
    return {
      workers: this.workers,
      alerts: this.alerts,
      logs: this.logs
    };
  }
}

