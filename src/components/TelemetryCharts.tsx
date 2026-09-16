import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type TelemetryPoint = {
  timestamp: string;
  speed: number;
  temperature: number;
};

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

  return (
    <section className="telemetry-section">
      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h3>Speed</h3>
            <span>Last 30 seconds</span>
          </div>

          <strong>
            {chartData.length > 0
              ? `${chartData[chartData.length - 1].speed} km/h`
              : "--"}
          </strong>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11 }}
                minTickGap={25}
              />
              <YAxis />
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

      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h3>Temperature</h3>
            <span>Last 30 seconds</span>
          </div>

          <strong>
            {chartData.length > 0
              ? `${chartData[chartData.length - 1].temperature} °C`
              : "--"}
          </strong>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11 }}
                minTickGap={25}
              />
              <YAxis />
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