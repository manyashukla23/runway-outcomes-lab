"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface RevenueByDepartment {
  department: string;
  revenue: number;
  order_count: number;
}

interface RevenueByDepartmentChartProps {
  data: RevenueByDepartment[];
}

const COLORS = ['#F9A8D4', '#EC4899', '#F472B6', '#FB7185', '#F87171'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-pink-200/50">
        <p className="text-sm font-semibold text-slate-900 mb-1">
          {data.department}
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

export default function RevenueByDepartmentChart({ data }: RevenueByDepartmentChartProps) {
  const chartData = data.map((item) => ({
    department: item.department,
    revenue: item.revenue,
    order_count: item.order_count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry: any) => `${entry.department}: ${(entry.percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="revenue"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

