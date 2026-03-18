export const config = {
  port: Number(process.env.PORT) || 4000,
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  simulationIntervalMs: 2000,
  workerCount: 8,
  historyLimit: 16,
  maxAlerts: 24,
  maxLogs: 60
};

