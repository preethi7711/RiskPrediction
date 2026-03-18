export const STATUS = {
  SAFE: "Safe",
  WARNING: "Warning",
  CRITICAL: "Critical"
};

export const INPUT_MODES = {
  SIMULATION: "simulation",
  MANUAL: "manual",
  IOT: "iot"
};

export const ALERT_RECIPIENTS = {
  WARNING: ["Supervisor", "Team members"],
  CRITICAL: ["Supervisor", "Team members", "Emergency contact"]
};

export const SCENARIOS = {
  STABLE: "stable",
  HEAT: "heat",
  COLLAPSE: "collapse",
  FATIGUE: "fatigue",
  RECOVERY: "recovery"
};

export const DEVICE_PROFILES = [
  {
    id: "smart-band",
    name: "Smart Safety Band",
    description: "Balanced wearable reading with moderate activity tracking.",
    defaults: {
      heartRate: 92,
      temperature: 37.4,
      movement: "Active"
    }
  },
  {
    id: "chest-strap",
    name: "Industrial Chest Strap",
    description: "High-fidelity cardiac sensor for stress-heavy environments.",
    defaults: {
      heartRate: 118,
      temperature: 38.6,
      movement: "Slow"
    }
  },
  {
    id: "helmet-patch",
    name: "Helmet Thermal Patch",
    description: "Heat-focused device for temperature-heavy work zones.",
    defaults: {
      heartRate: 111,
      temperature: 39.1,
      movement: "Slow"
    }
  },
  {
    id: "fall-monitor",
    name: "Fall Detection Tag",
    description: "Inactivity-focused sensor for collapse-risk workflows.",
    defaults: {
      heartRate: 104,
      temperature: 37.8,
      movement: "None"
    }
  }
];
