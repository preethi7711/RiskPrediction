import { Activity, Moon, ShieldAlert, SunMedium, Wifi, WifiOff } from "lucide-react";
import { formatTime } from "../utils/formatters";

export const Header = ({ darkMode, onToggleTheme, connected, systemStatus }) => (
  <header className="panel overflow-hidden p-6">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-2xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400">
          <ShieldAlert className="h-4 w-4" />
          Predictive Worker Safety System
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          HealthShield AI
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[rgb(var(--text-muted))] sm:text-base">
          Real-time monitoring for workforce health, predictive risk, live alerts, and
          response coordination across critical industrial zones.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="rounded-2xl border border-white/10 bg-slate-950/10 px-4 py-3 dark:bg-white/5">
          <div className="flex items-center gap-3">
            {connected ? (
              <Wifi className="h-5 w-5 text-emerald-400" />
            ) : (
              <WifiOff className="h-5 w-5 text-critical" />
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--text-muted))]">
                Realtime Link
              </p>
              <p className="text-sm font-medium">
                {connected ? "Connected" : "Disconnected"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/10 px-4 py-3 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-cyan-400" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--text-muted))]">
                Last Update
              </p>
              <p className="text-sm font-medium">
                {systemStatus.updatedAt ? formatTime(systemStatus.updatedAt) : "Waiting"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/10 px-4 py-3 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-warning" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--text-muted))]">
                Input Mode
              </p>
              <p className="text-sm font-medium capitalize">{systemStatus.inputMode}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/10 px-4 py-3 text-sm font-medium transition hover:scale-[1.02] dark:bg-white/5"
        >
          {darkMode ? <SunMedium className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          {darkMode ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </div>
  </header>
);
