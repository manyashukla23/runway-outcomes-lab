"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RevenueOverTime {
  date: string;
  revenue: number;
  order_count: number;
}

interface RevenueOverTimeChartProps {
  data: RevenueOverTime[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-pink-200/50">
        <p className="text-sm font-semibold text-slate-900 mb-1">
          {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
        <p className="text-lg font-bold text-pink-600">
          ${data.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{data.order_count} orders</p>
      </div>
    );
  }
  return null;
};

export default function RevenueOverTimeChart({ data }: RevenueOverTimeChartProps) {
  const chartData = data.map((item) => ({
    date: item.date,
    revenue: item.revenue,
    order_count: item.order_count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F9A8D4" strokeOpacity={0.2} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#64748b' }}
          stroke="#cbd5e1"
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#64748b' }}
          stroke="#cbd5e1"
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#EC4899"
          strokeWidth={3}
          dot={{ fill: '#F9A8D4', r: 4 }}
          activeDot={{ r: 6, fill: '#EC4899' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

