type Alert = {
  machineId: string;
  machineName: string;
  severity: string;
  title: string;
  message: string;
};

type AlertsPanelProps = {
  alerts: Alert[];
  onSelectMachine: (machineId: string) => void;
};

function AlertsPanel({
  alerts,
  onSelectMachine,
}: AlertsPanelProps) {
  const severityStyles: Record<string, string> = {
    critical: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-slate-400",
  };

  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Operational Alerts
          </h3>

          <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Live equipment health events
          </span>
        </div>

        <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-slate-100 px-2 text-sm font-bold text-slate-700">
          {alerts.length}
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <span className="text-xl font-bold text-emerald-600">✓</span>

          <div>
            <strong className="text-sm text-emerald-800">
              All systems normal
            </strong>

            <p className="mt-1 text-sm text-slate-600">
              No active equipment alerts
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map((alert) => (
            <button
              key={`${alert.machineId}-${alert.title}`}
              onClick={() => onSelectMachine(alert.machineId)}
              className="flex w-full gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
            >
              <div
                className={`w-2 shrink-0 rounded-full ${
                  severityStyles[alert.severity] ?? "bg-slate-400"
                }`}
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <strong className="text-sm text-slate-900">
                    {alert.title}
                  </strong>

                  <span className="text-xs font-medium text-slate-500">
                    {alert.machineName}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-600">
                  {alert.message}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default AlertsPanel;