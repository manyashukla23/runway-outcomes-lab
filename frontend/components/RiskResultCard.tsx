"use client";

interface PredictionResult {
  product_id: number;
  return_probability: number;
  risk_label: string;
}

interface RiskResultCardProps {
  prediction: PredictionResult;
}

export default function RiskResultCard({ prediction }: RiskResultCardProps) {
  const getRiskColor = (label: string) => {
    switch (label) {
      case "Low":
        return {
          bg: "bg-green-50",
          text: "text-green-800",
          border: "border-green-200",
          bar: "bg-green-500",
          pill: "bg-green-100 text-green-700",
        };
      case "Medium":
        return {
          bg: "bg-amber-50",
          text: "text-amber-800",
          border: "border-amber-200",
          bar: "bg-amber-500",
          pill: "bg-amber-100 text-amber-700",
        };
      case "High":
        return {
          bg: "bg-red-50",
          text: "text-red-800",
          border: "border-red-200",
          bar: "bg-red-500",
          pill: "bg-red-100 text-red-700",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-800",
          border: "border-slate-200",
          bar: "bg-slate-500",
          pill: "bg-slate-100 text-slate-700",
        };
    }
  };

  const colors = getRiskColor(prediction.risk_label);
  const percentage = (prediction.return_probability * 100).toFixed(1);

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)] border-2 ${colors.border} transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">
            Prediction Result
          </h3>
          <p className="text-sm text-slate-600">Return risk analysis for your product</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${colors.pill} border ${colors.border}`}>
          {prediction.risk_label} Risk
        </span>
      </div>

      <div className="space-y-6">
        {/* Return Probability */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Return Probability
            </span>
            <span className={`text-4xl font-bold ${colors.text}`}>
              {percentage}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${colors.bar} rounded-full transition-all duration-500 ease-out shadow-sm`}
              style={{ width: `${prediction.return_probability * 100}%` }}
            />
          </div>
        </div>

        {/* Risk Breakdown */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">Risk Level</div>
            <div className={`text-lg font-bold ${colors.text}`}>
              {prediction.risk_label}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">Probability</div>
            <div className="text-lg font-bold text-slate-900">
              {percentage}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">Product ID</div>
            <div className="text-lg font-bold text-slate-900">
              #{prediction.product_id}
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className={`${colors.bg} rounded-2xl p-4 border ${colors.border}`}>
          <p className="text-sm font-semibold text-slate-900 mb-1">
            {prediction.risk_label === "Low" && "✅ Low risk — Safe to launch"}
            {prediction.risk_label === "Medium" && "⚠️ Medium risk — Consider adjustments"}
            {prediction.risk_label === "High" && "🚨 High risk — Review pricing & strategy"}
          </p>
          <p className="text-xs text-slate-600 mt-1">
            {prediction.risk_label === "Low" && "This product shows low return probability. Proceed with confidence."}
            {prediction.risk_label === "Medium" && "Consider reducing discount or adjusting target demographic to lower risk."}
            {prediction.risk_label === "High" && "High return risk detected. Review pricing strategy, discount levels, or target market before launch."}
          </p>
        </div>
      </div>
    </div>
  );
}
