import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const playCriticalTone = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.value = 880;
  gain.gain.value = 0.04;

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.18);
  oscillator.onended = () => context.close();
};

export const useDashboardSocket = () => {
  const [workers, setWorkers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    connectedClients: 0,
    workerCount: 0,
    inputMode: "simulation",
    deviceProfiles: [],
    updatedAt: null
  });
  const [connected, setConnected] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const criticalCountRef = useRef(0);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"]
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("dashboard:init", (payload) => {
      setWorkers(payload.workers || []);
      setAlerts(payload.alerts || []);
      setLogs(payload.logs || []);
      setSystemStatus((current) => ({
        ...current,
        inputMode: payload.inputMode || current.inputMode,
        deviceProfiles: payload.deviceProfiles || current.deviceProfiles
      }));
    });
    socket.on("workers:update", (payload) => setWorkers(payload || []));
    socket.on("alerts:new", (payload) => {
      setAlerts((current) => [...payload, ...current].slice(0, 24));
    });
    socket.on("logs:new", (payload) => {
      setLogs((current) => [...payload, ...current].slice(0, 60));
    });
    socket.on("system:status", (payload) => setSystemStatus(payload));

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const criticalCount = alerts.filter((alert) => alert.severity === "Critical").length;
    if (criticalCount > criticalCountRef.current) {
      playCriticalTone();
    }
    criticalCountRef.current = criticalCount;
  }, [alerts]);

  const postJson = async (path, body) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Request failed." }));
        throw new Error(error.error || "Request failed.");
      }

      return response.json();
    } finally {
      setSubmitting(false);
    }
  };

  const setInputMode = async (mode) => {
    const result = await postJson("/api/mode", { mode });
    setSystemStatus((current) => ({
      ...current,
      inputMode: result.inputMode
    }));
    return result;
  };

  const submitManualReading = (payload) => postJson("/api/manual-reading", payload);

  const submitIotReading = (payload) => postJson("/api/iot-reading", payload);

  return {
    workers,
    alerts,
    logs,
    systemStatus,
    connected,
    submitting,
    setInputMode,
    submitManualReading,
    submitIotReading
  };
};
