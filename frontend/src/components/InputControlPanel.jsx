import { useEffect, useMemo, useState } from "react";
import { Cpu, PencilLine, PlayCircle } from "lucide-react";

const INPUT_MODES = [
  {
    id: "simulation",
    label: "Simulation",
    description: "Backend auto-generates telemetry every 2 seconds.",
    icon: PlayCircle
  },
  {
    id: "manual",
    label: "Manual Input",
    description: "Type vitals directly and generate safety output instantly.",
    icon: PencilLine
  },
  {
    id: "iot",
    label: "IoT Device",
    description: "Apply device-based readings and test wearable scenarios.",
    icon: Cpu
  }
];

export const InputControlPanel = ({
  workers,
  systemStatus,
  submitting,
  onSetInputMode,
  onSubmitManualReading,
  onSubmitIotReading
}) => {
  const selectedWorker = workers[0];
  const [workerId, setWorkerId] = useState(selectedWorker?.id ?? "");
  const [heartRate, setHeartRate] = useState(selectedWorker?.heartRate ?? 82);
  const [temperature, setTemperature] = useState(selectedWorker?.temperature ?? 37.2);
  const [movement, setMovement] = useState(selectedWorker?.movement ?? "Active");
  const [deviceId, setDeviceId] = useState(systemStatus.deviceProfiles?.[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const deviceProfiles = systemStatus.deviceProfiles || [];

  useEffect(() => {
    if (selectedWorker && !workerId) {
      setWorkerId(selectedWorker.id);
    }
  }, [selectedWorker, workerId]);

  useEffect(() => {
    const worker = workers.find((entry) => entry.id === workerId);
    if (worker) {
      setHeartRate(worker.heartRate);
      setTemperature(worker.temperature);
      setMovement(worker.movement);
    }
  }, [workerId, workers]);

  useEffect(() => {
    if (!deviceId && deviceProfiles.length > 0) {
      setDeviceId(deviceProfiles[0].id);
    }
  }, [deviceId, deviceProfiles]);

  const selectedDevice = useMemo(
    () => deviceProfiles.find((device) => device.id === deviceId),
    [deviceId, deviceProfiles]
  );

  const handleModeChange = async (mode) => {
    try {
      await onSetInputMode(mode);
      setMessage(`Input mode switched to ${mode}.`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleManualSubmit = async (event) => {
    event.preventDefault();
    try {
      await onSubmitManualReading({
        workerId,
        heartRate: Number(heartRate),
        temperature: Number(temperature),
        movement
      });
      setMessage("Manual reading applied successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDeviceApply = async () => {
    try {
      await onSubmitIotReading({
        workerId,
        deviceId
      });
      setMessage(`IoT profile ${selectedDevice?.name || deviceId} applied successfully.`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="panel p-5">
      <div className="panel-header">
        <div>
          <h2 className="font-display text-2xl font-semibold">Input Modes</h2>
          <p className="text-sm text-[rgb(var(--text-muted))]">
            Switch between live simulation, manual readings, and IoT-device-driven inputs.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {INPUT_MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = systemStatus.inputMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => handleModeChange(mode.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                isActive
                  ? "border-cyan-400/50 bg-cyan-400/10"
                  : "border-white/10 bg-slate-950/10 hover:border-cyan-400/30 dark:bg-white/5"
              }`}
            >
              <div className="mb-3 flex items-center gap-3">
                <Icon className="h-5 w-5 text-cyan-400" />
                <p className="font-semibold">{mode.label}</p>
              </div>
              <p className="text-sm text-[rgb(var(--text-muted))]">{mode.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <form onSubmit={handleManualSubmit} className="rounded-3xl border border-white/10 p-4">
          <div className="mb-4">
            <h3 className="font-display text-xl font-semibold">Manual Input</h3>
            <p className="text-sm text-[rgb(var(--text-muted))]">
              Choose a worker and enter vitals manually to generate risk output.
            </p>
          </div>

          <div className="grid gap-3">
            <label className="text-sm">
              <span className="mb-2 block text-[rgb(var(--text-muted))]">Worker</span>
              <select
                value={workerId}
                onChange={(event) => setWorkerId(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/10 px-4 py-3 outline-none dark:bg-white/5"
              >
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-2 block text-[rgb(var(--text-muted))]">Heart Rate</span>
                <input
                  type="number"
                  min="60"
                  max="140"
                  value={heartRate}
                  onChange={(event) => setHeartRate(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/10 px-4 py-3 outline-none dark:bg-white/5"
                />
              </label>

              <label className="text-sm">
                <span className="mb-2 block text-[rgb(var(--text-muted))]">Temperature</span>
                <input
                  type="number"
                  min="36"
                  max="40"
                  step="0.1"
                  value={temperature}
                  onChange={(event) => setTemperature(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/10 px-4 py-3 outline-none dark:bg-white/5"
                />
              </label>
            </div>

            <label className="text-sm">
              <span className="mb-2 block text-[rgb(var(--text-muted))]">Movement</span>
              <select
                value={movement}
                onChange={(event) => setMovement(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/10 px-4 py-3 outline-none dark:bg-white/5"
              >
                <option value="Active">Active</option>
                <option value="Slow">Slow</option>
                <option value="None">None</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={submitting || workers.length === 0}
              className="rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Applying..." : "Generate Output"}
            </button>
          </div>
        </form>

        <div className="rounded-3xl border border-white/10 p-4">
          <div className="mb-4">
            <h3 className="font-display text-xl font-semibold">IoT Device Profiles</h3>
            <p className="text-sm text-[rgb(var(--text-muted))]">
              Simulate device-originated readings using wearable-specific presets.
            </p>
          </div>

          <div className="grid gap-3">
            <label className="text-sm">
              <span className="mb-2 block text-[rgb(var(--text-muted))]">Worker</span>
              <select
                value={workerId}
                onChange={(event) => setWorkerId(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/10 px-4 py-3 outline-none dark:bg-white/5"
              >
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-2 block text-[rgb(var(--text-muted))]">IoT Device</span>
              <select
                value={deviceId}
                onChange={(event) => setDeviceId(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/10 px-4 py-3 outline-none dark:bg-white/5"
              >
                {deviceProfiles.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </select>
            </label>

            {selectedDevice ? (
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <p className="font-semibold">{selectedDevice.name}</p>
                <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
                  {selectedDevice.description}
                </p>
                <p className="mt-3 text-sm text-[rgb(var(--text-muted))]">
                  Default reading: HR {selectedDevice.defaults.heartRate}, Temp{" "}
                  {selectedDevice.defaults.temperature} C, Movement{" "}
                  {selectedDevice.defaults.movement}
                </p>
              </div>
            ) : null}

            <button
              type="button"
              disabled={submitting || workers.length === 0 || !deviceId}
              onClick={handleDeviceApply}
              className="rounded-2xl bg-mint px-4 py-3 font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Applying..." : "Apply Device Input"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/10 px-4 py-3 text-sm dark:bg-white/5">
        <span className="font-semibold">Current mode:</span> {systemStatus.inputMode}
        {message ? <span className="ml-3 text-[rgb(var(--text-muted))]">{message}</span> : null}
      </div>
    </section>
  );
};
