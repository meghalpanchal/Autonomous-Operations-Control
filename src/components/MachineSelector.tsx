import type { MachineData } from "../types/machine";
import { getMachineHealth } from "../utils/machineHealth";

type MachineSelectorProps = {
  machines: MachineData[];
  selectedMachineId: string;
  onSelectMachine: (machineId: string) => void;
};

function MachineSelector({
  machines,
  selectedMachineId,
  onSelectMachine,
}: MachineSelectorProps) {
  if (machines.length === 0) {
    return (
      <div className="mb-6 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <strong className="block text-slate-900">
          No machines found
        </strong>

        <span className="mt-1 block text-sm text-slate-500">
          Try changing your search or health filter.
        </span>
      </div>
    );
  }

  return (
    <section className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
      {machines.map((machine) => {
        const health = getMachineHealth(machine);

        const healthClasses = {
          HEALTHY: "bg-emerald-100 text-emerald-700",
          IDLE: "bg-slate-100 text-slate-600",
          WARNING: "bg-amber-100 text-amber-700",
          CRITICAL: "bg-red-100 text-red-700",
        };

        const isSelected = selectedMachineId === machine.machineId;

        return (
          <button
            key={machine.machineId}
            onClick={() => onSelectMachine(machine.machineId)}
            className={`rounded-xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              isSelected
                ? "border-blue-500 ring-2 ring-blue-100"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-slate-900">
                {machine.name}
              </span>

              <span
                className={`rounded-full px-2 py-1 text-[10px] font-bold tracking-wide ${
                  healthClasses[health]
                }`}
              >
                {health}
              </span>
            </div>

            <div className="mt-2 text-xs text-slate-500">
              {machine.machineId} · {machine.status}
            </div>
          </button>
        );
      })}
    </section>
  );
}

export default MachineSelector;