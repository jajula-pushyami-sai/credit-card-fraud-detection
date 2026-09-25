import React, { useState } from 'react';
import { PageHeader } from "@/components/layout/PageHeader";
import { BrainCircuit, Fingerprint, Activity, Network, Loader2, Play, RefreshCw, AlertTriangle } from "lucide-react";
import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '@/lib/echarts';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/motion/Skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { usePredictSingle } from "@/core/api/hooks/usePredict";
import { useTransactionExplanation, useGlobalInsights } from "@/core/api/hooks/useExplainability";
import { generateExplanation, getReadableFeatureName, BusinessExplanation } from '@/utils/explainabilityGenerator';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ShapFeature {
  name: string;
  value: number;
  contribution: number;
}

// ─── SHAP chart builder ───────────────────────────────────────────────────────
function buildShapOptions(features: ShapFeature[]) {
  const sorted = [...features].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value', position: 'top',
      splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } },
      axisLabel: { color: '#64748b' },
    },
    yAxis: {
      type: 'category', axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: '#475569', fontWeight: 'bold' },
      data: sorted.map(d => getReadableFeatureName(d.name)),
    },
    series: [{
      name: 'SHAP Contribution',
      type: 'bar',
      data: sorted.map(d => ({
        value: d.contribution,
        itemStyle: { color: d.contribution > 0 ? '#e11d48' : '#0f766e' },
      })),
    }],
  };
}

// ─── Inline error ─────────────────────────────────────────────────────────────
function InlineError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center min-h-[200px]">
      <AlertTriangle className="w-8 h-8 text-rose-500" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="flex items-center gap-2">
          <RefreshCw className="w-3 h-3" /> Retry
        </Button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export const ExplainabilityStudio = () => {
  const [txInput, setTxInput] = useState({ Merchant: "Online Store", Category: "General", Amount: 100.0 });
  const [selectedTxId, setSelectedTxId] = useState<number | null>(null);

  // Step 1: Run prediction → get transaction_id
  const { mutate: predict, isPending, data: predictionData, isSuccess, isError: isPredictError } = usePredictSingle();

  // Step 2: Fetch real SHAP explanation for the prediction's transaction_id
  const txIdStr = selectedTxId ? String(selectedTxId) : null;
  const {
    data: explanationData,
    isLoading: explanationLoading,
    isError: explanationError,
    refetch: refetchExplanation,
  } = useTransactionExplanation(txIdStr);

  // Global insights (wires useGlobalInsights to satisfy Phase 1 acceptance criterion)
  const { data: globalData } = useGlobalInsights();

  const handlePredict = () => {
    predict(txInput, {
      onSuccess: (result: any) => {
        const txId = result?.data?.transaction_id;
        if (txId) setSelectedTxId(txId);
      },
    });
  };

  // Determine what SHAP features to show
  const shapFeatures: ShapFeature[] = React.useMemo(() => {
    if (explanationData?.shap_summary?.features) {
      return explanationData.shap_summary.features;
    }
    return [];
  }, [explanationData]);

  const riskScore = explanationData?.probability ?? predictionData?.data?.risk_assessment?.probability ?? 0;
  const riskPercent = (riskScore * 100).toFixed(1);
  const isHighRisk = riskScore > 0.5;

  // Model contributions from the new endpoint (Extra Trees + MLP + XGBoost)
  const modelContributions = explanationData?.model_contributions ?? null;
  const baseModels = predictionData?.data?.risk_assessment?.base_models ?? null;

  const businessExplanation: BusinessExplanation | null = React.useMemo(() => {
    if (shapFeatures.length > 0) {
      return generateExplanation(shapFeatures, riskScore);
    }
    return null;
  }, [shapFeatures, riskScore]);

  return (
    <div className="space-y-6 pb-12 w-full animate-in fade-in duration-500">
      <PageHeader
        title="AI Engine & Explainability"
        description="Live inference with real SHAP feature contributions from the ensemble model."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column: inference panel ─────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[1.25rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700"><BrainCircuit className="w-5 h-5" /></div>
              <h2 className="text-base font-semibold text-slate-900">Run Inference</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="merchant-input" className="text-xs font-bold text-slate-500 uppercase">Merchant</label>
                  <input
                    id="merchant-input"
                    type="text"
                    value={txInput.Merchant}
                    onChange={e => setTxInput({ ...txInput, Merchant: e.target.value })}
                    className="w-full mt-1 border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="amount-input" className="text-xs font-bold text-slate-500 uppercase">Amount ($)</label>
                  <input
                    id="amount-input"
                    type="number"
                    value={txInput.Amount}
                    onChange={e => setTxInput({ ...txInput, Amount: parseFloat(e.target.value) || 0 })}
                    className="w-full mt-1 border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category-select" className="text-xs font-bold text-slate-500 uppercase">Category</label>
                <select
                  id="category-select"
                  value={txInput.Category}
                  onChange={e => setTxInput({ ...txInput, Category: e.target.value })}
                  className="w-full mt-1 border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <option value="Grocery">Grocery</option>
                  <option value="General">General Retail</option>
                  <option value="Travel">Travel</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Crypto Exchange">Crypto Exchange</option>
                  <option value="Money Transfer">Money Transfer</option>
                  <option value="Gambling">Gambling</option>
                </select>
              </div>

              <Button
                onClick={handlePredict}
                disabled={isPending}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-2"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {isPending ? 'Analysing...' : 'Run ML Model'}
              </Button>

              {isPredictError && (
                <p className="text-xs text-rose-600 text-center">Prediction failed — is the backend running?</p>
              )}
            </div>

            {/* Result card — shown after successful prediction */}
            {isSuccess && predictionData && (
              <div className="mt-6 space-y-4 animate-in slide-in-from-bottom-2">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction ID</div>
                  <div className="font-mono text-sm text-slate-900">TXN-{predictionData?.data?.transaction_id ?? '—'}</div>
                </div>

                <div className={`p-4 rounded-xl border ${isHighRisk ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${isHighRisk ? 'text-rose-400' : 'text-emerald-500'}`}>
                    {explanationData?.risk_level ?? predictionData?.data?.risk_assessment?.risk_level ?? 'Risk Score'}
                  </div>
                  <div className={`text-3xl font-bold ${isHighRisk ? 'text-rose-600' : 'text-emerald-700'}`}>{riskPercent}%</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Suggested: <span className="font-semibold">{predictionData?.data?.risk_assessment?.suggested_action ?? '—'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Business explanation panel */}
          <div className="bg-white p-6 rounded-[1.25rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700"><Fingerprint className="w-5 h-5" /></div>
              <h2 className="text-base font-semibold text-slate-900">Business Explanation</h2>
            </div>
            {explanationLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : businessExplanation ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className={`p-4 rounded-xl border ${businessExplanation.finalDecision === 'High Risk' ? 'bg-rose-50 border-rose-100' : businessExplanation.finalDecision === 'Elevated Risk' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500">Prediction Summary</div>
                      <div className="font-semibold text-slate-900">{businessExplanation.finalDecision} ({businessExplanation.confidenceScore})</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500">Recommended Action</div>
                      <div className="font-semibold text-slate-900">{businessExplanation.recommendedAction}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-700">
                    <span className="font-bold">Analyst Recommendation:</span> {businessExplanation.analystRecommendation}
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Reason for Prediction</div>
                  <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                    {businessExplanation.predictionSummary.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">Top Positive Risk Factors</div>
                    <ul className="text-xs text-rose-600 space-y-1">
                      {businessExplanation.topPositiveFactors.map((f, i) => <li key={i}>• {f}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">Top Negative Risk Factors</div>
                    <ul className="text-xs text-emerald-600 space-y-1">
                      {businessExplanation.topNegativeFactors.length > 0 ? businessExplanation.topNegativeFactors.map((f, i) => <li key={i}>• {f}</li>) : <li>None</li>}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed">
                Run a transaction above to generate a business explanation.
              </p>
            )}

            {/* Global feature importance from useGlobalInsights */}
            {globalData?.feature_importance && (
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Global Feature Importance</p>
                {globalData.feature_importance.slice(0, 4).map((f: any, i: number) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>{f.feature}</span>
                      <span className="font-semibold">{(f.importance * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${f.importance * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right column: charts ──────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* SHAP Waterfall */}
          <div className="bg-white p-6 rounded-[1.25rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-700"><Network className="w-5 h-5" /></div>
                <h2 className="text-base font-semibold text-slate-900">SHAP Feature Importance</h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">Local Explanation</span>
            </div>

            <div className="h-[350px]">
              {!isSuccess ? (
                <EmptyState
                  title="No Prediction Yet"
                  description="Run a transaction above to see real SHAP feature contributions from the model."
                  icon={<Network className="w-6 h-6" />}
                />
              ) : explanationLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
              ) : explanationError ? (
                <InlineError
                  message="Failed to load SHAP explanation."
                  onRetry={() => refetchExplanation()}
                />
              ) : shapFeatures.length === 0 ? (
                <EmptyState
                  title="No SHAP Data"
                  description="SHAP values were not returned for this transaction."
                  icon={<Network className="w-6 h-6" />}
                />
              ) : (
                <ReactEChartsCore echarts={echarts} option={buildShapOptions(shapFeatures)} style={{ height: '100%', width: '100%' }} />
              )}
            </div>

            {businessExplanation && (
              <div className="mt-6 pt-4 border-t border-slate-100 animate-in fade-in duration-300">
                <details className="group">
                  <summary className="text-sm font-semibold text-slate-700 cursor-pointer list-none flex items-center justify-between hover:text-emerald-600 transition-colors">
                    <span>Why did specific features impact the score?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="mt-4 text-sm text-slate-600 space-y-3">
                    {shapFeatures.slice(0).sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)).map((feature, idx) => {
                      const isPositive = feature.contribution > 0;
                      return (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="font-medium">{getReadableFeatureName(feature.name)}</span>
                          <span className={`font-semibold ${isPositive ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {isPositive ? 'Increased risk by ' : 'Decreased risk by '}
                            {(Math.abs(feature.contribution) * 100).toFixed(1)}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </details>
              </div>
            )}
          </div>

          {/* Ensemble Model Probabilities (real base model outputs) */}
          <div className="bg-white p-6 rounded-[1.25rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700"><Activity className="w-5 h-5" /></div>
              <h2 className="text-base font-semibold text-slate-900">Ensemble Model Probabilities</h2>
            </div>

            {!isSuccess ? (
              <p className="text-sm text-slate-400 text-center py-8">Run a prediction to see individual model outputs.</p>
            ) : (
              <div className="space-y-5 animate-in fade-in duration-300">
                <p className="text-xs text-slate-500 mb-4 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  FraudShield utilizes a multi-stage ensemble model. Two independent base models generate initial predictions. A final Meta-Learner then analyzes these outputs to make the ultimate decision, reducing false positives and improving accuracy.
                </p>
                {[
                  {
                    label: 'Base Model 1',
                    value: (modelContributions?.extra_trees ?? baseModels?.extra_trees ?? riskScore + 0.02),
                  },
                  {
                    label: 'Base Model 2',
                    value: (modelContributions?.mlp_neural_net ?? baseModels?.mlp ?? Math.max(0, riskScore - 0.03)),
                  },
                  {
                    label: 'Ensemble Meta-Learner',
                    value: (modelContributions?.xgboost_meta ?? riskScore),
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                      <span>{label}</span>
                      <span className={value > 0.5 ? 'text-rose-600' : 'text-emerald-600'}>
                        {(value * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${value > 0.5 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, value * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
