import React, { useState } from 'react';

// ─── 1. Confusion Matrix Heatmap ─────────────────────────────────────────────
export const ConfusionMatrixChart: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-bold text-slate-800 text-center mb-4">
          Confusion Matrix
        </h4>

        <div className="flex flex-col items-center">
          {/* Y-axis label */}
          <div className="flex items-center w-full max-w-xs">
            <div className="rotate-[-90deg] origin-center text-[11px] font-semibold text-slate-600 whitespace-nowrap -ml-6 mr-1">
              True Label
            </div>

            <div className="flex-1 space-y-1">
              {/* Row 0: Actual Non-Fraud (0) */}
              <div className="flex items-center gap-1">
                <div className="w-24 text-[10px] font-semibold text-slate-600 text-right pr-2">
                  Actual Non-Fraud (0)
                </div>
                {/* TN (27725) */}
                <div className="flex-1 h-24 bg-[#0A3161] text-white flex items-center justify-center font-bold text-sm rounded-l shadow-inner">
                  27725
                </div>
                {/* FP (0) */}
                <div className="flex-1 h-24 bg-[#F5F9FD] text-slate-800 flex items-center justify-center font-bold text-sm rounded-r border border-slate-100">
                  0
                </div>
              </div>

              {/* Row 1: Actual Fraud (1) */}
              <div className="flex items-center gap-1">
                <div className="w-24 text-[10px] font-semibold text-slate-600 text-right pr-2">
                  Actual Fraud (1)
                </div>
                {/* FN (0) */}
                <div className="flex-1 h-24 bg-[#F5F9FD] text-slate-800 flex items-center justify-center font-bold text-sm rounded-l border border-slate-100">
                  0
                </div>
                {/* TP (93) */}
                <div className="flex-1 h-24 bg-[#F5F9FD] text-slate-800 flex items-center justify-center font-bold text-sm rounded-r border border-slate-100">
                  93
                </div>
              </div>
            </div>
          </div>

          {/* X-axis labels */}
          <div className="w-full max-w-xs pl-24 pt-2">
            <div className="flex justify-between text-[10px] font-semibold text-slate-600 text-center">
              <span className="flex-1">Predicted Non-Fraud (0)</span>
              <span className="flex-1">Predicted Fraud (1)</span>
            </div>
            <div className="text-center text-[11px] font-semibold text-slate-600 mt-1">
              Predicted Label
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
        <span className="text-[11px] font-mono text-slate-500">
          TN: 27,725 | FP: 0 | FN: 0 | TP: 93 (Total: 27,818)
        </span>
      </div>
    </div>
  );
};

// ─── 2. Receiver Operating Characteristic (ROC) Curve ────────────────────────
export const ROCCurveChart: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-bold text-slate-800 text-center mb-3">
          Receiver Operating Characteristic (ROC) Curve
        </h4>

        <div className="w-full aspect-[4/3] relative">
          <svg viewBox="0 0 400 300" className="w-full h-full overflow-visible">
            {/* Grid background lines */}
            {[0, 60, 120, 180, 240].map((y) => (
              <line key={y} x1="50" y1={50 + y} x2="370" y2={50 + y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />
            ))}
            {[0, 64, 128, 192, 256, 320].map((x) => (
              <line key={x} x1={50 + x} y1="50" x2={50 + x} y2="290" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />
            ))}

            {/* Axes Box */}
            <rect x="50" y="50" width="320" height="240" fill="none" stroke="#CBD5E1" strokeWidth="1" />

            {/* Diagonal Baseline (Random Guess - Blue Dashed) */}
            <line x1="50" y1="290" x2="370" y2="50" stroke="#000080" strokeWidth="2" strokeDasharray="5 5" />

            {/* ROC Curve Line (Orange Solid) */}
            <path d="M 50 290 L 50 50 L 370 50" fill="none" stroke="#FF8C00" strokeWidth="2.5" />

            {/* Y Axis Tick Labels */}
            <text x="42" y="294" fontSize="10" fill="#64748B" textAnchor="end">0.0</text>
            <text x="42" y="246" fontSize="10" fill="#64748B" textAnchor="end">0.2</text>
            <text x="42" y="198" fontSize="10" fill="#64748B" textAnchor="end">0.4</text>
            <text x="42" y="150" fontSize="10" fill="#64748B" textAnchor="end">0.6</text>
            <text x="42" y="102" fontSize="10" fill="#64748B" textAnchor="end">0.8</text>
            <text x="42" y="54" fontSize="10" fill="#64748B" textAnchor="end">1.0</text>

            {/* X Axis Tick Labels */}
            <text x="50" y="306" fontSize="10" fill="#64748B" textAnchor="middle">0.0</text>
            <text x="114" y="306" fontSize="10" fill="#64748B" textAnchor="middle">0.2</text>
            <text x="178" y="306" fontSize="10" fill="#64748B" textAnchor="middle">0.4</text>
            <text x="242" y="306" fontSize="10" fill="#64748B" textAnchor="middle">0.6</text>
            <text x="306" y="306" fontSize="10" fill="#64748B" textAnchor="middle">0.8</text>
            <text x="370" y="306" fontSize="10" fill="#64748B" textAnchor="middle">1.0</text>

            {/* Legend Box */}
            <rect x="230" y="240" width="130" height="24" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <line x1="238" y1="252" x2="256" y2="252" stroke="#FF8C00" strokeWidth="2.5" />
            <text x="262" y="255" fontSize="9" fontWeight="bold" fill="#334155">ROC curve (area = 1.00)</text>
          </svg>
        </div>

        <div className="text-center mt-2">
          <span className="text-[10px] font-semibold text-slate-500">
            False Positive Rate (X) vs True Positive Rate (Y)
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 text-center">
        <span className="text-[11px] font-mono font-bold text-amber-600">
          ROC AUC = 1.00 (Evaluated Split)
        </span>
      </div>
    </div>
  );
};

// ─── 3. Precision-Recall Curve ───────────────────────────────────────────────
export const PrecisionRecallCurveChart: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-bold text-slate-800 text-center mb-3">
          Precision-Recall Curve
        </h4>

        <div className="w-full aspect-[4/3] relative">
          <svg viewBox="0 0 400 300" className="w-full h-full overflow-visible">
            {/* Grid background lines */}
            {[0, 60, 120, 180, 240].map((y) => (
              <line key={y} x1="50" y1={50 + y} x2="370" y2={50 + y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />
            ))}
            {[0, 64, 128, 192, 256, 320].map((x) => (
              <line key={x} x1={50 + x} y1="50" x2={50 + x} y2="290" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />
            ))}

            {/* Axes Box */}
            <rect x="50" y="50" width="320" height="240" fill="none" stroke="#CBD5E1" strokeWidth="1" />

            {/* PR Curve Line (Blue Solid) */}
            <path d="M 50 50 L 370 50 L 370 290" fill="none" stroke="#0000FF" strokeWidth="2.5" />

            {/* Y Axis Tick Labels */}
            <text x="42" y="294" fontSize="10" fill="#64748B" textAnchor="end">0.0</text>
            <text x="42" y="246" fontSize="10" fill="#64748B" textAnchor="end">0.2</text>
            <text x="42" y="198" fontSize="10" fill="#64748B" textAnchor="end">0.4</text>
            <text x="42" y="150" fontSize="10" fill="#64748B" textAnchor="end">0.6</text>
            <text x="42" y="102" fontSize="10" fill="#64748B" textAnchor="end">0.8</text>
            <text x="42" y="54" fontSize="10" fill="#64748B" textAnchor="end">1.0</text>

            {/* X Axis Tick Labels */}
            <text x="50" y="306" fontSize="10" fill="#64748B" textAnchor="middle">0.0</text>
            <text x="114" y="306" fontSize="10" fill="#64748B" textAnchor="middle">0.2</text>
            <text x="178" y="306" fontSize="10" fill="#64748B" textAnchor="middle">0.4</text>
            <text x="242" y="306" fontSize="10" fill="#64748B" textAnchor="middle">0.6</text>
            <text x="306" y="306" fontSize="10" fill="#64748B" textAnchor="middle">0.8</text>
            <text x="370" y="306" fontSize="10" fill="#64748B" textAnchor="middle">1.0</text>

            {/* Legend Box */}
            <rect x="58" y="250" width="168" height="24" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <line x1="66" y1="262" x2="84" y2="262" stroke="#0000FF" strokeWidth="2.5" />
            <text x="90" y="265" fontSize="9" fontWeight="bold" fill="#334155">Precision-Recall curve (AP = 1.00)</text>
          </svg>
        </div>

        <div className="text-center mt-2">
          <span className="text-[10px] font-semibold text-slate-500">
            Recall (X) vs Precision (Y)
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 text-center">
        <span className="text-[11px] font-mono font-bold text-blue-600">
          Average Precision (AP) = 1.00 (Evaluated Split)
        </span>
      </div>
    </div>
  );
};

// ─── 4. Top 20 LightGBM Feature Importances ──────────────────────────────────
const featureData = [
  { feature: 'V15', score: 1850 },
  { feature: 'V5', score: 1640 },
  { feature: 'V27', score: 1500 },
  { feature: 'V1', score: 1490 },
  { feature: 'V13', score: 1225 },
  { feature: 'V16', score: 1170 },
  { feature: 'V9', score: 1135 },
  { feature: 'Amount', score: 1100 },
  { feature: 'V25', score: 1080 },
  { feature: 'V26', score: 1060 },
  { feature: 'V8', score: 1045 },
  { feature: 'V20', score: 1030 },
  { feature: 'V23', score: 1025 },
  { feature: 'V24', score: 1020 },
  { feature: 'V17', score: 1020 },
  { feature: 'V21', score: 975 },
  { feature: 'V22', score: 970 },
  { feature: 'V11', score: 970 },
  { feature: 'V14', score: 960 },
  { feature: 'V6', score: 920 },
];

export const FeatureImportancesChart: React.FC = () => {
  const [viewMode, setViewMode] = useState<'image' | 'chart'>('image');
  const maxScore = 1850;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Top 20 LightGBM Feature Importances
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Feature importance ranking by split count (F-score) across decision trees
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg self-start sm:self-auto border border-slate-200">
          <button
            type="button"
            onClick={() => setViewMode('image')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              viewMode === 'image'
                ? 'bg-white text-[#0F766E] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reference Figure
          </button>
          <button
            type="button"
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              viewMode === 'chart'
                ? 'bg-white text-[#0F766E] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Interactive Bars
          </button>
        </div>
      </div>

      {viewMode === 'image' ? (
        <div className="flex flex-col items-center justify-center p-2 bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden">
          <img
            src="/feature_importances.png"
            alt="Top 20 LightGBM Feature Importances"
            className="w-full max-w-3xl h-auto rounded-lg shadow-sm border border-slate-200 object-contain"
          />
        </div>
      ) : (
        <div className="space-y-2 py-2 max-h-[500px] overflow-y-auto pr-2">
          {featureData.map((item, idx) => {
            const pct = (item.score / maxScore) * 100;
            return (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <span className="w-16 font-mono font-bold text-slate-700 text-right shrink-0">{item.feature}</span>
                <div className="flex-1 bg-slate-100 h-6 rounded-md overflow-hidden relative border border-slate-200/60">
                  <div
                    className="h-full bg-gradient-to-r from-[#0F766E] to-[#14B8A6] rounded-md transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono font-bold text-[11px] text-slate-700">
                    {item.score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
        <span>
          <strong className="text-slate-800">Key Takeaway:</strong> Feature <strong>V15</strong> (F-score = 1,850) and <strong>V5</strong> (F-score = 1,640) provide the highest splitting gain across tree nodes.
        </span>
        <span className="font-mono text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold shrink-0">
          LightGBM Benchmark Model
        </span>
      </div>
    </div>
  );
};

export const ProbabilityDistributionChart: React.FC = () => {
  const [viewMode, setViewMode] = useState<'image' | 'details'>('image');

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Predicted Probability Distribution (Log Scale)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Logarithmic probability density separation between Legitimate (Class 0) and Fraudulent (Class 1) transactions
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg self-start sm:self-auto border border-slate-200">
          <button
            type="button"
            onClick={() => setViewMode('image')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              viewMode === 'image'
                ? 'bg-white text-[#0F766E] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reference Figure
          </button>
          <button
            type="button"
            onClick={() => setViewMode('details')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              viewMode === 'details'
                ? 'bg-white text-[#0F766E] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Threshold Breakdown
          </button>
        </div>
      </div>

      {viewMode === 'image' ? (
        <div className="flex flex-col items-center justify-center p-2 bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden">
          <img
            src="/probability_distribution.png"
            alt="Predicted Probability Distribution (Log Scale)"
            className="w-full max-w-3xl h-auto rounded-lg shadow-sm border border-slate-200 object-contain"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Legitimate (Class 0)</span>
            <p className="text-xl font-bold text-emerald-950 font-mono">Dense Concentration</p>
            <p className="text-xs text-emerald-700">Concentrated near probability 0.00 – 0.20 with rapid density drop-off across log-scales.</p>
          </div>
          <div className="bg-red-50/60 p-4 rounded-xl border border-red-200 space-y-1">
            <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Fraudulent (Class 1)</span>
            <p className="text-xl font-bold text-red-950 font-mono">Bimodal Peak</p>
            <p className="text-xs text-red-700">Broad density coverage across probability ranges with high probability spikes near 1.0.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Decision Threshold</span>
            <p className="text-xl font-bold text-[#0F766E] font-mono">0.8256</p>
            <p className="text-xs text-slate-600">Calibrated cut-off boundary ensuring 0 False Positives on benchmark evaluation sets.</p>
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
        <span>
          <strong className="text-slate-800">Key Takeaway:</strong> Calibrated threshold at <strong className="text-slate-900 font-mono">0.8256</strong> strictly isolates high-risk fraudulent spikes while preventing false alarms.
        </span>
        <span className="font-mono text-[11px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-bold shrink-0">
          Calibrated Probability Density
        </span>
      </div>
    </div>
  );
};
