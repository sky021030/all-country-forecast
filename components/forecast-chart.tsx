"use client";

import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ForecastPoint } from "@/lib/forecast";

const yen = new Intl.NumberFormat("ja-JP");

export function ForecastChart({ data }: { data: ForecastPoint[] }) {
  const forecast = data.find((point) => point.kind === "forecast");

  return (
    <div className="h-[260px] w-full sm:h-[310px]" aria-label="直近7営業日の基準価額推移チャート">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 8, left: -16, bottom: 2 }}>
          <defs>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#17a673" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#17a673" stopOpacity={0.015} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#dbe5e2" strokeDasharray="4 5" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#71827d", fontSize: 12 }} dy={10} />
          <YAxis domain={["dataMin - 400", "dataMax + 400"]} axisLine={false} tickLine={false} tick={{ fill: "#8a9894", fontSize: 11 }} tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#8ab8a7", strokeDasharray: "4 4" }} />
          <Area type="monotone" dataKey="value" stroke="#13875f" strokeWidth={3} fill="url(#forecastGradient)" activeDot={{ r: 5, fill: "#fff", stroke: "#13875f", strokeWidth: 3 }} />
          {forecast && <ReferenceDot x={forecast.date} y={forecast.value} r={6} fill="#f4aa42" stroke="#fff" strokeWidth={3} />}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; payload: ForecastPoint }>; label?: string }) {
  if (!active || !payload?.[0]) return null;
  const point = payload[0];
  return (
    <div className="rounded-xl border border-emerald-100 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
      <p className="text-[11px] font-medium text-slate-500">{label} {point.payload.kind === "forecast" ? "予測" : "実績"}</p>
      <p className="mt-0.5 font-display text-sm font-semibold text-slate-900">{yen.format(point.value)}円</p>
    </div>
  );
}
