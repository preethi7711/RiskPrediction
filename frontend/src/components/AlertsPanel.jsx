import { BellRing } from "lucide-react";
import { formatTime, severityBadgeClass } from "../utils/formatters";

export const AlertsPanel = ({ alerts }) => (
  <section className="panel p-5">
    <div className="panel-header">
      <div>
        <h2 className="font-display text-2xl font-semibold">Alert Center</h2>
        <p className="text-sm text-[rgb(var(--text-muted))]">
          Notifications routed to supervisors, teams, and emergency contacts.
        </p>
      </div>
      <BellRing className="h-5 w-5 text-warning" />
    </div>

    <div className="space-y-3">
      {alerts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-6 text-sm text-[rgb(var(--text-muted))]">
          No alerts yet. Live notifications will appear here.
        </div>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-2xl border border-white/10 bg-slate-950/10 p-4 dark:bg-white/5"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="font-semibold">{alert.workerName}</p>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] ring-1 ${severityBadgeClass(
                  alert.severity
                )}`}
              >
                {alert.severity}
              </span>
            </div>
            <p className="text-sm leading-6">{alert.message}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-[rgb(var(--text-muted))]">
              <span>{alert.recipient}</span>
              <span>{formatTime(alert.createdAt)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  </section>
);

