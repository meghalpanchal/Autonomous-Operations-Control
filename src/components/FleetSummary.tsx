type FleetSummaryProps = {
  total: number;
  running: number;
  idle: number;
  alerts: number;
};

function FleetSummary({
  total,
  running,
  idle,
  alerts,
}: FleetSummaryProps) {
  const cards = [
    {
      label: "Total Assets",
      value: total,
      valueClass: "text-slate-900",
    },
    {
      label: "Running",
      value: running,
      valueClass: "text-emerald-600",
    },
    {
      label: "Idle",
      value: idle,
      valueClass: "text-amber-600",
    },
    {
      label: "Alerts",
      value: alerts,
      valueClass: "text-red-600",
    },
  ];

  return (
    <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {card.label}
          </span>

          <strong
            className={`mt-2 block text-3xl font-bold ${card.valueClass}`}
          >
            {card.value}
          </strong>
        </div>
      ))}
    </section>
  );
}

export default FleetSummary;