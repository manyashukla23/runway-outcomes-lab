"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ReturnsByCategory {
  category: string;
  return_rate: number; // 0-1
}

interface ReturnsByCategoryChartProps {
  data: ReturnsByCategory[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-pink-200/50">
        <p className="text-sm font-semibold text-slate-900 mb-1">
          {payload[0].payload.category}
        </p>
        <p className="text-lg font-bold text-pink-600">
          {payload[0].value}%
        </p>
        <p className="text-xs text-slate-500 mt-0.5">Return Rate</p>
      </div>
    );
  }
  return null;
};

export default function ReturnsByCategoryChart({ data }: ReturnsByCategoryChartProps) {
  const chartData = data.map((item) => ({
    category: item.category,
    returnRate: parseFloat((item.return_rate * 100).toFixed(1)),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart 
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="#F9A8D4"
          strokeOpacity={0.2}
        />
        <XAxis
          dataKey="category"
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
          tick={{ fontSize: 11, fill: '#64748b' }}
          stroke="#cbd5e1"
        />
        <YAxis 
          label={{ 
            value: "Return Rate (%)", 
            angle: -90, 
            position: "insideLeft",
            style: { textAnchor: 'middle', fill: '#64748b', fontSize: 12 }
          }}
          tick={{ fontSize: 11, fill: '#64748b' }}
          stroke="#cbd5e1"
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="returnRate" 
          fill="#F9A8D4"
          radius={[8, 8, 0, 0]}
          stroke="#EC4899"
          strokeWidth={1}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
