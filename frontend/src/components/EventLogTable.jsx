import { formatTime } from "../utils/formatters";

export const EventLogTable = ({ logs }) => (
  <section className="panel p-5">
    <div className="panel-header">
      <div>
        <h2 className="font-display text-2xl font-semibold">Event Log</h2>
        <p className="text-sm text-[rgb(var(--text-muted))]">
          Timestamped safety transitions and communication actions.
        </p>
      </div>
    </div>

    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="max-h-[28rem] overflow-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="sticky top-0 bg-[rgb(var(--bg-secondary))]">
            <tr className="text-[rgb(var(--text-muted))]">
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Worker</th>
              <th className="px-4 py-3 font-semibold">Level</th>
              <th className="px-4 py-3 font-semibold">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {logs.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-[rgb(var(--text-muted))]">
                  No events recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3 text-[rgb(var(--text-muted))]">
                    {formatTime(log.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium">{log.workerName}</td>
                  <td className="px-4 py-3">{log.level}</td>
                  <td className="px-4 py-3 text-[rgb(var(--text-muted))]">{log.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

