"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AgeDistribution {
  age_range: string;
  customer_count: number;
  avg_order_value: number;
}

interface AgeDistributionChartProps {
  data: AgeDistribution[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-pink-200/50">
        <p className="text-sm font-semibold text-slate-900 mb-1">
          {data.age_range}
        </p>
        <p className="text-base font-bold text-pink-600">
          {data.customer_count.toLocaleString()} customers
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          Avg order: ${data.avg_order_value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export default function AgeDistributionChart({ data }: AgeDistributionChartProps) {
  const chartData = data.map((item) => ({
    age_range: item.age_range,
    customer_count: item.customer_count,
    avg_order_value: item.avg_order_value,
  }));

  // Sort by age range order
  const ageOrder = ["Under 18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
  const sortedData = [...chartData].sort((a, b) => {
    const aIndex = ageOrder.indexOf(a.age_range);
    const bIndex = ageOrder.indexOf(b.age_range);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F9A8D4" strokeOpacity={0.2} />
        <XAxis
          dataKey="age_range"
          tick={{ fontSize: 11, fill: '#64748b' }}
          stroke="#cbd5e1"
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#64748b' }}
          stroke="#cbd5e1"
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="customer_count"
          fill="#F9A8D4"
          radius={[8, 8, 0, 0]}
          stroke="#EC4899"
          strokeWidth={1}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

