export const formatTime = (value) =>
  new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

export const statusPanelClass = (status) => {
  if (status === "Critical") {
    return "border-critical/40 bg-critical/10";
  }
  if (status === "Warning") {
    return "border-warning/40 bg-warning/10";
  }
  return "border-emerald-400/30 bg-emerald-400/10";
};

export const severityBadgeClass = (status) => {
  if (status === "Critical") {
    return "bg-critical/15 text-critical ring-critical/30";
  }
  if (status === "Warning") {
    return "bg-warning/15 text-warning ring-warning/30";
  }
  return "bg-emerald-400/15 text-emerald-400 ring-emerald-400/30";
};

