import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { TelemetryPoint } from "../types/machine";

type TelemetryChartsProps = {
  data: TelemetryPoint[];
};

function TelemetryCharts({ data }: TelemetryChartsProps) {
  const chartData = data.map((point) => ({
    ...point,
    time: new Date(point.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  }));

  const latestPoint = chartData.at(-1);

  return (
    <section className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Speed */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Speed
            </h3>

            <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Last 30 seconds
            </span>
          </div>

          <strong className="text-xl font-bold text-blue-600">
            {latestPoint ? `${latestPoint.speed} km/h` : "--"}
          </strong>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="time"
                tick={{ fontSize: 11 }}
                minTickGap={25}
                stroke="#94a3b8"
              />

              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 11 }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="speed"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Temperature */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Temperature
            </h3>

            <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Last 30 seconds
            </span>
          </div>

          <strong className="text-xl font-bold text-red-600">
            {latestPoint
              ? `${latestPoint.temperature} °C`
              : "--"}
          </strong>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="time"
                tick={{ fontSize: 11 }}
                minTickGap={25}
                stroke="#94a3b8"
              />

              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 11 }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#dc2626"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default TelemetryCharts;