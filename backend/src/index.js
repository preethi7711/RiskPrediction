import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config.js";
import { DEVICE_PROFILES, INPUT_MODES } from "./constants.js";
import { workerProfiles } from "./data/workerProfiles.js";
import { buildAlertsForWorker, buildLogsForWorker } from "./services/alertService.js";
import {
  createInitialWorkers,
  refreshWorkerSafety,
  serializeWorker,
  simulateWorkers
} from "./services/simulationService.js";
import { DashboardStore } from "./services/store.js";
import { clamp } from "./utils/formatters.js";

const app = express();
app.use(
  cors({
    origin: config.frontendOrigin
  })
);
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.frontendOrigin
  }
});

let workers = createInitialWorkers(
  workerProfiles.slice(0, config.workerCount),
  config.historyLimit
);
let inputMode = INPUT_MODES.SIMULATION;

const store = new DashboardStore(workers.map(serializeWorker));

const emitSystemStatus = () => {
  io.emit("system:status", {
    connectedClients: io.engine.clientsCount,
    workerCount: store.workers.length,
    inputMode,
    deviceProfiles: DEVICE_PROFILES,
    updatedAt: new Date().toISOString()
  });
};

const emitDashboardSnapshot = () => {
  store.setWorkers(workers.map(serializeWorker));
  io.emit("workers:update", store.workers);
  emitSystemStatus();
};

const processSafetyOutcome = (worker, previousStatus) => {
  const alerts = buildAlertsForWorker(worker, previousStatus);
  const logs = buildLogsForWorker(worker, previousStatus, alerts);

  if (alerts.length > 0) {
    store.addAlerts(alerts);
    io.emit("alerts:new", alerts);
  }

  if (logs.length > 0) {
    store.addLogs(logs);
    io.emit("logs:new", logs);
  }
};

const findWorkerById = (workerId) => workers.find((worker) => worker.id === workerId);

const applyWorkerReading = (worker, payload, sourceLabel) => {
  const previousStatus = worker.riskStatus;

  worker.heartRate = clamp(Number(payload.heartRate ?? worker.heartRate), 60, 140);
  worker.temperature = Number(
    clamp(Number(payload.temperature ?? worker.temperature), 36, 40).toFixed(1)
  );
  worker.movement = payload.movement ?? worker.movement;

  if (payload.location?.lat != null && payload.location?.lng != null) {
    worker.location = {
      lat: Number(payload.location.lat),
      lng: Number(payload.location.lng)
    };
  }

  worker.meta.lastStatus = previousStatus;
  refreshWorkerSafety(worker, config.historyLimit);

  const readingLog = {
    id: `${worker.id}-${sourceLabel}-${Date.now()}`,
    workerId: worker.id,
    workerName: worker.name,
    level: worker.riskStatus,
    message: `${sourceLabel} reading received for ${worker.name}: HR ${worker.heartRate}, Temp ${worker.temperature} C, Movement ${worker.movement}.`,
    createdAt: new Date().toISOString()
  };

  store.addLogs([readingLog]);
  io.emit("logs:new", [readingLog]);
  processSafetyOutcome(worker, previousStatus);
  emitDashboardSnapshot();
};

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "HealthShield AI backend",
    updatedAt: new Date().toISOString()
  });
});

app.get("/api/dashboard", (_req, res) => {
  res.json({
    ...store.getSnapshot(),
    inputMode,
    deviceProfiles: DEVICE_PROFILES
  });
});

app.post("/api/mode", (req, res) => {
  const nextMode = req.body?.mode;
  if (!Object.values(INPUT_MODES).includes(nextMode)) {
    return res.status(400).json({ error: "Invalid input mode." });
  }

  inputMode = nextMode;

  const modeLog = {
    id: `mode-change-${Date.now()}`,
    workerId: "system",
    workerName: "System",
    level: "Info",
    message: `Input mode changed to ${nextMode}.`,
    createdAt: new Date().toISOString()
  };

  store.addLogs([modeLog]);
  io.emit("logs:new", [modeLog]);
  emitSystemStatus();

  return res.json({ inputMode });
});

app.post("/api/manual-reading", (req, res) => {
  const worker = findWorkerById(req.body?.workerId);
  if (!worker) {
    return res.status(404).json({ error: "Worker not found." });
  }

  inputMode = INPUT_MODES.MANUAL;
  applyWorkerReading(worker, req.body, "Manual");

  return res.json({
    worker: serializeWorker(worker),
    inputMode
  });
});

app.post("/api/iot-reading", (req, res) => {
  const worker = findWorkerById(req.body?.workerId);
  if (!worker) {
    return res.status(404).json({ error: "Worker not found." });
  }

  const deviceProfile = DEVICE_PROFILES.find((device) => device.id === req.body?.deviceId);
  if (!deviceProfile) {
    return res.status(404).json({ error: "Device profile not found." });
  }

  inputMode = INPUT_MODES.IOT;
  applyWorkerReading(
    worker,
    {
      ...deviceProfile.defaults,
      ...req.body
    },
    `IoT ${deviceProfile.name}`
  );

  return res.json({
    worker: serializeWorker(worker),
    inputMode,
    deviceProfile
  });
});

io.on("connection", (socket) => {
  socket.emit("dashboard:init", {
    ...store.getSnapshot(),
    inputMode,
    deviceProfiles: DEVICE_PROFILES
  });
  emitSystemStatus();

  socket.on("disconnect", () => {
    emitSystemStatus();
  });
});

setInterval(() => {
  if (inputMode !== INPUT_MODES.SIMULATION) {
    return;
  }

  workers = simulateWorkers(workers, config.historyLimit);

  workers.forEach((worker) => {
    processSafetyOutcome(worker, worker.meta.lastStatus);
  });

  emitDashboardSnapshot();
}, config.simulationIntervalMs);

server.listen(config.port, () => {
  console.log(`HealthShield AI backend running on http://localhost:${config.port}`);
});
