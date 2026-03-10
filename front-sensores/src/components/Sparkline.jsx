import { ResponsiveContainer, LineChart, Line } from "recharts";
import { G } from "../constants/palette";

// ─── SPARKLINE ────────────────────────────────────────────────────────────────
// Compact, decoration-only mini line chart shown in the SensorCard header.
// No axes, no tooltips — purely visual trend indicator.
//
// Props:
//   data  Array<{ valor: number }>  — last N readings

export default function Sparkline({ data }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line
          type="monotone"
          dataKey="valor"
          stroke={G[400]}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
