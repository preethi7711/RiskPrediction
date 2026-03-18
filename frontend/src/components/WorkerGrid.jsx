import { WorkerCard } from "./WorkerCard";

export const WorkerGrid = ({ workers }) => (
  <section className="space-y-4">
    <div className="panel-header">
      <div>
        <h2 className="font-display text-2xl font-semibold">Worker Monitoring</h2>
        <p className="text-sm text-[rgb(var(--text-muted))]">
          Live vitals, predictive risk state, and trend charts for each active worker.
        </p>
      </div>
    </div>
    <div className="grid gap-5 2xl:grid-cols-2">
      {workers.map((worker) => (
        <WorkerCard key={worker.id} worker={worker} />
      ))}
    </div>
  </section>
);

