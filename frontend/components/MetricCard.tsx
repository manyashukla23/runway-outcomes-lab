"use client";

interface MetricCardProps {
  label: string;
  value: string;
  helper?: string;
  tone?: 'default' | 'warning';
}

export default function MetricCard({ label, value, helper, tone = 'default' }: MetricCardProps) {
  const isWarning = tone === 'warning';
  
  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(236,72,153,0.15)] shadow-[0_18px_45px_rgba(0,0,0,0.05)] border border-white/50">
      {/* Accent ring */}
      <div className={`absolute inset-0 rounded-3xl ${
        isWarning 
          ? 'ring-2 ring-amber-200/50' 
          : 'ring-2 ring-pink-200/50'
      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Top row: label + pill */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">
          {label}
        </span>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
          isWarning
            ? 'bg-amber-100 text-amber-700'
            : 'bg-pink-100 text-pink-700'
        }`}>
          {isWarning ? 'Risk' : 'Live'}
        </span>
      </div>
      
      {/* Middle: big value */}
      <div className="mb-2">
        <p className={`text-3xl font-bold ${
          isWarning ? 'text-amber-900' : 'text-slate-900'
        }`}>
          {value}
        </p>
      </div>
      
      {/* Bottom: helper text */}
      {helper && (
        <p className="text-xs text-slate-500 mt-1">
          {helper}
        </p>
      )}
    </div>
  );
}
