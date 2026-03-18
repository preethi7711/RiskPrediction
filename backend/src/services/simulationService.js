import { SCENARIOS } from "../constants.js";
import { evaluateWorkerSafety } from "../engines/safetyEngine.js";
import {
  clamp,
  createTimestamp,
  driftTowards,
  pickOne,
  randomBetween,
  randomInt
} from "../utils/formatters.js";

const movementByScenario = {
  [SCENARIOS.STABLE]: ["Active", "Active", "Slow"],
  [SCENARIOS.HEAT]: ["Active", "Slow", "Slow"],
  [SCENARIOS.COLLAPSE]: ["None", "None", "Slow"],
  [SCENARIOS.FATIGUE]: ["Slow", "Slow", "None"],
  [SCENARIOS.RECOVERY]: ["Slow", "Active", "Slow"]
};

const scenarioTargets = {
  [SCENARIOS.STABLE]: {
    heartRate: [68, 92],
    temperature: [36.3, 37.3]
  },
  [SCENARIOS.HEAT]: {
    heartRate: [108, 140],
    temperature: [38.1, 40]
  },
  [SCENARIOS.COLLAPSE]: {
    heartRate: [92, 125],
    temperature: [37.1, 39]
  },
  [SCENARIOS.FATIGUE]: {
    heartRate: [88, 110],
    temperature: [37.2, 38.4]
  },
  [SCENARIOS.RECOVERY]: {
    heartRate: [74, 98],
    temperature: [36.6, 37.6]
  }
};

const chooseNextScenario = (currentScenario) => {
  const roll = Math.random();

  if (currentScenario === SCENARIOS.HEAT || currentScenario === SCENARIOS.COLLAPSE) {
    if (roll < 0.45) {
      return SCENARIOS.RECOVERY;
    }
  }

  if (roll < 0.5) {
    return SCENARIOS.STABLE;
  }
  if (roll < 0.7) {
    return SCENARIOS.FATIGUE;
  }
  if (roll < 0.86) {
    return SCENARIOS.HEAT;
  }

  return SCENARIOS.COLLAPSE;
};

const createHistoryPoint = (worker) => ({
  timestamp: createTimestamp(),
  heartRate: worker.heartRate,
  temperature: worker.temperature,
  riskScore: worker.riskScore,
  movement: worker.movement
});

export const appendWorkerHistory = (worker, historyLimit) => {
  worker.history = [...worker.history, createHistoryPoint(worker)].slice(-historyLimit);
  return worker;
};

export const refreshWorkerSafety = (worker, historyLimit) => {
  Object.assign(worker, evaluateWorkerSafety(worker));
  return appendWorkerHistory(worker, historyLimit);
};

export const createInitialWorkers = (profiles, historyLimit) =>
  profiles.map((profile) => {
    const worker = {
      ...profile,
      heartRate: profile.baselineHeartRate,
      temperature: profile.baselineTemperature,
      movement: "Active",
      riskScore: 8,
      riskStatus: "Safe",
      riskType: "Stable",
      explanation: "Vitals are within the expected operating range.",
      prediction: "No immediate danger predicted.",
      history: [],
      meta: {
        scenario: SCENARIOS.STABLE,
        ticksRemaining: randomInt(2, 5),
        lastStatus: "Safe"
      }
    };

    worker.history = Array.from({ length: 8 }, (_, index) => ({
      timestamp: new Date(Date.now() - (8 - index) * 2000).toISOString(),
      heartRate: worker.heartRate,
      temperature: worker.temperature,
      riskScore: worker.riskScore,
      movement: worker.movement
    })).slice(-historyLimit);

    return worker;
  });

const updateScenario = (worker) => {
  const nextTicks = worker.meta.ticksRemaining - 1;
  if (nextTicks > 0) {
    worker.meta.ticksRemaining = nextTicks;
    return worker.meta.scenario;
  }

  worker.meta.scenario = chooseNextScenario(worker.meta.scenario);
  worker.meta.ticksRemaining = randomInt(3, 6);
  return worker.meta.scenario;
};

const updateVitalsByScenario = (worker, scenario) => {
  const targetRange = scenarioTargets[scenario];
  const targetHeartRate =
    randomBetween(targetRange.heartRate[0], targetRange.heartRate[1]) +
    (worker.baselineHeartRate - 76) * 0.2;
  const targetTemperature =
    randomBetween(targetRange.temperature[0], targetRange.temperature[1]) +
    (worker.baselineTemperature - 36.7) * 0.2;
  const strength =
    scenario === SCENARIOS.HEAT || scenario === SCENARIOS.COLLAPSE ? 0.48 : 0.32;

  worker.heartRate = clamp(
    Math.round(driftTowards(worker.heartRate, targetHeartRate, strength)),
    60,
    140
  );
  worker.temperature = Number(
    clamp(driftTowards(worker.temperature, targetTemperature, strength), 36, 40).toFixed(1)
  );
  worker.movement = pickOne(movementByScenario[scenario]);
  worker.location = {
    ...worker.location,
    lat: Number((worker.location.lat + randomBetween(-0.0003, 0.0003)).toFixed(4)),
    lng: Number((worker.location.lng + randomBetween(-0.0003, 0.0003)).toFixed(4))
  };
};

export const simulateWorkers = (workers, historyLimit) =>
  workers.map((worker) => {
    const previousStatus = worker.riskStatus;
    const scenario = updateScenario(worker);

    updateVitalsByScenario(worker, scenario);

    const safetyState = evaluateWorkerSafety(worker);
    Object.assign(worker, safetyState);
    worker.meta.lastStatus = previousStatus;
    appendWorkerHistory(worker, historyLimit);

    return worker;
  });

export const serializeWorker = (worker) => ({
  id: worker.id,
  name: worker.name,
  role: worker.role,
  zone: worker.zone,
  location: worker.location,
  heartRate: worker.heartRate,
  temperature: worker.temperature,
  movement: worker.movement,
  riskScore: worker.riskScore,
  riskStatus: worker.riskStatus,
  riskType: worker.riskType,
  explanation: worker.explanation,
  prediction: worker.prediction,
  history: worker.history
});
