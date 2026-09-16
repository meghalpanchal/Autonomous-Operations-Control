import { useEffect, useState } from "react";
import { useMachineWebSocket } from "./hooks/useMachineWebSocket";
import "./App.css";
import { getMachineHealth, type MachineHealth } from "./utils/machineHealth";
import TelemetryCharts from "./components/TelemetryCharts";
import FleetSummary from "./components/FleetSummary";
import MachineSelector from "./components/MachineSelector";
import AlertsPanel from "./components/AlertsPanel";
import MachineFilters from "./components/MachineFilters";

function App() {
  const [selectedMachineId, setSelectedMachineId] = useState("EX-001");
  const [searchTerm, setSearchTerm] = useState("");

  const [healthFilter, setHealthFilter] = useState<"ALL" | MachineHealth>(
    "ALL",
  );
  const { machines, telemetryHistory, connectionStatus } =
    useMachineWebSocket();

  const selectedMachine = machines.find(
    (machine) => machine.machineId === selectedMachineId,
  );
  const selectedMachineHistory = telemetryHistory[selectedMachineId] ?? [];

  const selectedMachineHealth = selectedMachine
    ? getMachineHealth(selectedMachine)
    : null;

  const totalMachines = machines.length;

  const runningMachines = machines.filter(
    (machine) => machine.status.toUpperCase() === "RUNNING",
  ).length;

  const idleMachines = machines.filter(
    (machine) => machine.status.toUpperCase() === "IDLE",
  ).length;

  const alertMachines = machines.filter((machine) => {
    const health = getMachineHealth(machine);

    return health === "WARNING" || health === "CRITICAL";
  }).length;
  const activeAlerts = machines
    .map((machine) => {
      const health = getMachineHealth(machine);

      if (health === "CRITICAL") {
        return {
          machineId: machine.machineId,
          machineName: machine.name,
          severity: "critical",
          title: "Critical temperature",
          message: `${machine.temperature}°C — immediate attention required`,
        };
      }

      if (health === "WARNING") {
        return {
          machineId: machine.machineId,
          machineName: machine.name,
          severity: "warning",
          title: "High temperature",
          message: `${machine.temperature}°C — above normal operating range`,
        };
      }

      if (health === "IDLE") {
        return {
          machineId: machine.machineId,
          machineName: machine.name,
          severity: "info",
          title: "Equipment idle",
          message: "Machine is currently not operating",
        };
      }

      return null;
    })
    .filter((alert) => alert !== null);

  const filteredMachines = machines.filter((machine) => {
    const searchValue = searchTerm.toLowerCase();

    const matchesSearch =
      machine.name.toLowerCase().includes(searchValue) ||
      machine.machineId.toLowerCase().includes(searchValue);

    const machineHealth = getMachineHealth(machine);

    const matchesHealth =
      healthFilter === "ALL" || machineHealth === healthFilter;

    return matchesSearch && matchesHealth;
  });

  useEffect(() => {
    if (filteredMachines.length === 0) {
      return;
    }

    const selectedMachineIsVisible = filteredMachines.some(
      (machine) => machine.machineId === selectedMachineId,
    );

    if (!selectedMachineIsVisible) {
      setSelectedMachineId(filteredMachines[0].machineId);
    }
  }, [filteredMachines, selectedMachineId]);

  const connectionStyles = {
    connected: "bg-emerald-100 text-emerald-700",
    reconnecting: "bg-amber-100 text-amber-700",
    disconnected: "bg-red-100 text-red-700",
  };

  const connectionLabels = {
    connected: "● Connected",
    reconnecting: "● Reconnecting...",
    disconnected: "● Disconnected",
  };

  const selectedHealthStyle = {
    HEALTHY: "bg-emerald-100 text-emerald-700",
    IDLE: "bg-slate-100 text-slate-600",
    WARNING: "bg-amber-100 text-amber-700",
    CRITICAL: "bg-red-100 text-red-700",
  };
 return (
  <main className="min-h-screen bg-slate-100">
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Autonomous Operations Control
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Real-time equipment monitoring
          </p>
        </div>

        <div
          className={`w-fit rounded-full px-3 py-1.5 text-sm font-semibold ${
            connectionStyles[connectionStatus]
          }`}
        >
          {connectionLabels[connectionStatus]}
        </div>
      </header>

      {/* Connection warning */}
      {connectionStatus === "disconnected" && selectedMachine && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Live connection lost. Showing last known data from{" "}
          <strong>
            {new Date(selectedMachine.timestamp).toLocaleTimeString()}
          </strong>
          .
        </div>
      )}

      {/* Fleet KPIs */}
      <FleetSummary
        total={totalMachines}
        running={runningMachines}
        idle={idleMachines}
        alerts={alertMachines}
      />

      {/* Search + Filter */}
      <MachineFilters
        searchTerm={searchTerm}
        healthFilter={healthFilter}
        onSearchChange={setSearchTerm}
        onHealthFilterChange={setHealthFilter}
      />

      {/* Machine selection */}
      <MachineSelector
        machines={filteredMachines}
        selectedMachineId={selectedMachineId}
        onSelectMachine={setSelectedMachineId}
      />

      {!selectedMachine ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
          Waiting for machine data...
        </div>
      ) : (
        <>
          {/* Selected machine heading */}
          <section className="mb-5 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Selected Machine
              </span>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {selectedMachine.name}
              </h2>

              <span className="mt-1 block text-sm text-slate-500">
                {selectedMachine.machineId}
              </span>
            </div>

            {selectedMachineHealth && (
              <span
                className={`w-fit rounded-full px-3 py-1.5 text-sm font-bold ${
                  selectedHealthStyle[selectedMachineHealth]
                }`}
              >
                {selectedMachineHealth}
              </span>
            )}
          </section>

          {/* Metrics */}
          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-sm text-slate-500">Speed</span>

              <div className="mt-2 flex items-end gap-2">
                <strong className="text-3xl font-bold text-slate-900">
                  {selectedMachine.speed}
                </strong>

                <span className="pb-1 text-sm text-slate-500">
                  km/h
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-sm text-slate-500">
                Temperature
              </span>

              <div className="mt-2 flex items-end gap-2">
                <strong className="text-3xl font-bold text-slate-900">
                  {selectedMachine.temperature}
                </strong>

                <span className="pb-1 text-sm text-slate-500">
                  °C
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-sm text-slate-500">
                Connection
              </span>

              <div className="mt-2">
                <strong className="text-2xl font-bold text-slate-900">
                  {connectionStatus === "connected" ? "Live" : "Lost"}
                </strong>

                <span className="mt-1 block text-sm text-slate-500">
                  WebSocket
                </span>
              </div>
            </div>
          </section>

          {/* Live charts */}
          <TelemetryCharts data={selectedMachineHistory} />

          {/* Alerts */}
          <AlertsPanel
            alerts={activeAlerts}
            onSelectMachine={setSelectedMachineId}
          />

          {/* Details */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Live Machine Details
            </h3>

            <div className="divide-y divide-slate-100">
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-500">
                  Machine ID
                </span>

                <strong className="text-sm text-slate-900">
                  {selectedMachine.machineId}
                </strong>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-500">
                  Operational Status
                </span>

                <strong className="text-sm text-slate-900">
                  {selectedMachine.status}
                </strong>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-500">
                  Last Update
                </span>

                <strong className="text-sm text-slate-900">
                  {new Date(
                    selectedMachine.timestamp,
                  ).toLocaleTimeString()}
                </strong>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  </main>
);
}

export default App;
