const StatCard = ({ label, value, accent, subtext }) => (
  <div className="panel p-5">
    <div className="mb-4 flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--text-muted))]">
        {label}
      </p>
      <div className={`h-3 w-3 rounded-full ${accent}`} />
    </div>
    <p className="font-display text-3xl font-bold">{value}</p>
    <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">{subtext}</p>
  </div>
);

export const OverviewCards = ({ workers }) => {
  const safe = workers.filter((worker) => worker.riskStatus === "Safe").length;
  const warning = workers.filter((worker) => worker.riskStatus === "Warning").length;
  const critical = workers.filter((worker) => worker.riskStatus === "Critical").length;
  const averageHeartRate =
    workers.length === 0
      ? 0
      : Math.round(
          workers.reduce((total, worker) => total + worker.heartRate, 0) / workers.length
        );

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Workers Online"
        value={workers.length}
        accent="bg-cyan-400"
        subtext="Live telemetry from active wearables"
      />
      <StatCard
        label="Safe"
        value={safe}
        accent="bg-emerald-400"
        subtext="Stable workers in expected conditions"
      />
      <StatCard
        label="Warning / Critical"
        value={`${warning} / ${critical}`}
        accent="bg-warning"
        subtext="Workers needing intervention or close observation"
      />
      <StatCard
        label="Avg Heart Rate"
        value={`${averageHeartRate} bpm`}
        accent="bg-critical"
        subtext="Average pulse across the active workforce"
      />
    </section>
  );
};

