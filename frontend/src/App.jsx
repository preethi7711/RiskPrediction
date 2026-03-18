import { useEffect, useMemo, useState } from "react";
import { AlertsPanel } from "./components/AlertsPanel";
import { EventLogTable } from "./components/EventLogTable";
import { Header } from "./components/Header";
import { InputControlPanel } from "./components/InputControlPanel";
import { OverviewCards } from "./components/OverviewCards";
import { WorkerGrid } from "./components/WorkerGrid";
import { useDashboardSocket } from "./hooks/useDashboardSocket";

const getInitialTheme = () => {
  const storedTheme = window.localStorage.getItem("healthshield-theme");
  if (storedTheme === "light") {
    return false;
  }
  if (storedTheme === "dark") {
    return true;
  }
  return true;
};

function App() {
  const {
    workers,
    alerts,
    logs,
    systemStatus,
    connected,
    submitting,
    setInputMode,
    submitManualReading,
    submitIotReading
  } = useDashboardSocket();
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("healthshield-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const sortedWorkers = useMemo(
    () =>
      [...workers].sort((left, right) => {
        const severityOrder = { Critical: 0, Warning: 1, Safe: 2 };
        return severityOrder[left.riskStatus] - severityOrder[right.riskStatus];
      }),
    [workers]
  );

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Header
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((current) => !current)}
          connected={connected}
          systemStatus={systemStatus}
        />
        <OverviewCards workers={sortedWorkers} />
        <InputControlPanel
          workers={sortedWorkers}
          systemStatus={systemStatus}
          submitting={submitting}
          onSetInputMode={setInputMode}
          onSubmitManualReading={submitManualReading}
          onSubmitIotReading={submitIotReading}
        />
        <div className="grid gap-6 xl:grid-cols-[1.7fr,0.95fr]">
          <WorkerGrid workers={sortedWorkers} />
          <div className="space-y-6">
            <AlertsPanel alerts={alerts} />
            <EventLogTable logs={logs} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
