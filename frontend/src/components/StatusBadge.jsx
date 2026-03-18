import { severityBadgeClass } from "../utils/formatters";

export const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ring-1 ${severityBadgeClass(
      status
    )}`}
  >
    {status}
  </span>
);

