import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatTime } from "../utils/formatters";

export const SparklineChart = ({
  data,
  dataKey,
  stroke,
  title,
  domain = ["auto", "auto"]
}) => (
  <div className="h-32 rounded-2xl bg-slate-950/10 p-3 dark:bg-white/5">
    <div className="mb-2 flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--text-muted))]">
        {title}
      </p>
      <p className="text-xs text-[rgb(var(--text-muted))]">Live</p>
    </div>
    <ResponsiveContainer width="100%" height="85%">
      <LineChart data={data}>
        <XAxis dataKey="timestamp" hide />
        <YAxis hide domain={domain} />
        <Tooltip
          formatter={(value) => [value, title]}
          labelFormatter={(label) => formatTime(label)}
          contentStyle={{
            background: "#09111f",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "16px",
            color: "#e2e8f0"
          }}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={stroke}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

