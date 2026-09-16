import type { MachineHealth } from "../utils/machineHealth";

type HealthFilter = "ALL" | MachineHealth;

type MachineFiltersProps = {
  searchTerm: string;
  healthFilter: HealthFilter;
  onSearchChange: (value: string) => void;
  onHealthFilterChange: (value: HealthFilter) => void;
};

function MachineFilters({
  searchTerm,
  healthFilter,
  onSearchChange,
  onHealthFilterChange,
}: MachineFiltersProps) {
  return (
    <section className="mb-4 flex flex-col gap-3 md:flex-row">
      <input
        type="search"
        placeholder="Search machine name or ID..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <select
        value={healthFilter}
        onChange={(event) =>
          onHealthFilterChange(event.target.value as HealthFilter)
        }
        className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="ALL">All health states</option>
        <option value="HEALTHY">Healthy</option>
        <option value="IDLE">Idle</option>
        <option value="WARNING">Warning</option>
        <option value="CRITICAL">Critical</option>
      </select>
    </section>
  );
}

export default MachineFilters;