"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RevenueByBrand {
  brand: string;
  revenue: number;
  product_count: number;
}

interface TopBrandsChartProps {
  data: RevenueByBrand[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-pink-200/50">
        <p className="text-sm font-semibold text-slate-900 mb-1">
          {data.brand}
        </p>
        <p className="text-lg font-bold text-pink-600">
          ${data.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{data.product_count} products</p>
      </div>
    );
  }
  return null;
};

export default function TopBrandsChart({ data }: TopBrandsChartProps) {
  const chartData = data.slice(0, 8).map((item) => ({
    brand: item.brand.length > 15 ? item.brand.substring(0, 15) + '...' : item.brand,
    fullBrand: item.brand,
    revenue: item.revenue,
    product_count: item.product_count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F9A8D4" strokeOpacity={0.2} />
        <XAxis
          dataKey="brand"
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
          tick={{ fontSize: 11, fill: '#64748b' }}
          stroke="#cbd5e1"
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#64748b' }}
          stroke="#cbd5e1"
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="revenue"
          fill="#F9A8D4"
          radius={[8, 8, 0, 0]}
          stroke="#EC4899"
          strokeWidth={1}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

