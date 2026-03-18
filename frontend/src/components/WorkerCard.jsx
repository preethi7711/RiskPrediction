import { HeartPulse, MapPinned, PersonStanding, Thermometer } from "lucide-react";
import { SparklineChart } from "./SparklineChart";
import { StatusBadge } from "./StatusBadge";
import { statusPanelClass } from "../utils/formatters";

const Metric = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-950/10 p-3 dark:bg-white/5">
    <div className="mb-2 flex items-center gap-2 text-[rgb(var(--text-muted))]">
      {icon}
      <span className="text-xs font-semibold uppercase tracking-[0.2em]">{label}</span>
    </div>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

export const WorkerCard = ({ worker }) => (
  <article className="panel p-5">
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <p className="font-display text-2xl font-semibold">{worker.name}</p>
        <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
          {worker.role} • {worker.zone}
        </p>
      </div>
      <StatusBadge status={worker.riskStatus} />
    </div>

    <div className={`mb-5 rounded-3xl border p-4 ${statusPanelClass(worker.riskStatus)}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--text-muted))]">
            Risk Score
          </p>
          <p className="font-display text-4xl font-bold">{worker.riskScore}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--text-muted))]">
            Risk Type
          </p>
          <p className="text-lg font-semibold">{worker.riskType}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-[rgb(var(--text-primary))]">{worker.explanation}</p>
      <p className="mt-2 text-sm font-medium text-[rgb(var(--text-muted))]">{worker.prediction}</p>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric
        icon={<HeartPulse className="h-4 w-4 text-critical" />}
        label="Heart Rate"
        value={`${worker.heartRate} bpm`}
      />
      <Metric
        icon={<Thermometer className="h-4 w-4 text-warning" />}
        label="Temperature"
        value={`${worker.temperature.toFixed(1)} C`}
      />
      <Metric
        icon={<PersonStanding className="h-4 w-4 text-cyan-400" />}
        label="Movement"
        value={worker.movement}
      />
      <Metric
        icon={<MapPinned className="h-4 w-4 text-mint" />}
        label="Coordinates"
        value={`${worker.location.lat}, ${worker.location.lng}`}
      />
    </div>

    <div className="mt-5 grid gap-4 xl:grid-cols-2">
      <SparklineChart
        data={worker.history}
        dataKey="heartRate"
        stroke="#ff6f7d"
        title="Heart rate"
        domain={[60, 145]}
      />
      <SparklineChart
        data={worker.history}
        dataKey="riskScore"
        stroke="#34d399"
        title="Risk trend"
        domain={[0, 100]}
      />
    </div>
  </article>
);

