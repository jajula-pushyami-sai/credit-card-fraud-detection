import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Search, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemGauge } from '@/components/charts/SystemGauge';
import { usePredictSingle, useRandomTransaction } from '@/core/api/hooks/usePredict';

// ─── Schema ───────────────────────────────────────────────────────────────────
const calcSchema = z.object({
  transaction_index: z.number({ invalid_type_error: 'Enter a valid numeric transaction ID' })
                      .nonnegative('Must be a positive integer')
                      .int('Must be a valid dataset index'),
});

type CalcFields = z.infer<typeof calcSchema>;

// ─── Helper to style backend-assigned risk level ──────────────────────────────
function getRiskStyle(riskLevel: string) {
  const norm = (riskLevel || '').toUpperCase();
  if (norm === 'HIGH') {
    return { color: '#e11d48', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' };
  }
  if (norm === 'MEDIUM') {
    return { color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' };
  }
  return { color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' };
}

export const RiskScoreCalculator = () => {
  const { mutate: predict, isPending, isSuccess, isError, data: predictionData, error } = usePredictSingle();
  const { mutate: fetchRandom, isPending: isRandomLoading } = useRandomTransaction();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CalcFields>({
    resolver: zodResolver(calcSchema),
    defaultValues: {
      transaction_index: 541,
    }
  });

  const handleRandom = () => {
    fetchRandom(undefined, {
      onSuccess: (res: any) => {
        const idx = res?.data?.transaction_index;
        if (idx !== undefined && idx !== null) {
          setValue('transaction_index', idx);
        }
      }
    });
  };

  const onSubmit = (data: CalcFields) => {
    predict({ transaction_index: data.transaction_index });
  };

  const resData = predictionData?.data || {};
  const prob = resData.fraud_probability ?? 0;
  const riskScorePct = resData.risk_score != null ? resData.risk_score : (prob * 100);
  
  // Rely 100% on backend API values for risk classification and recommended action
  const riskLevel = resData.risk_level || 'LOW';
  const recAction = resData.recommended_action || 'APPROVE';
  const riskStyle = getRiskStyle(riskLevel);

  const txId = resData.transaction_id || (resData.transaction_index !== undefined ? `TX-${resData.transaction_index}` : '-');
  const amount = resData.transaction_amount != null ? `$${resData.transaction_amount.toFixed(2)}` : '-';
  const modelVer = resData.model_version || 'v1.0.0-ensemble';
  const shap = resData.shap_explanation;

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full gap-6 lg:items-stretch pt-2">
      {/* ── Left: Form Panel ────────────────────────────────────────────────── */}
      <div className="lg:w-[380px] shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Risk Calculator</h1>
            <p className="text-xs text-slate-500 mt-1">
              Select dataset row index from creditcard.csv for backend inference
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs text-slate-500 mb-2">
                Pick a row index from <code className="font-mono bg-slate-200 px-1 py-0.5 rounded text-[11px]">creditcard.csv</code>
              </p>
              <Button 
                type="button" 
                variant="outline" 
                disabled={isRandomLoading}
                className="w-full text-slate-700 border-slate-300 hover:bg-slate-100 flex items-center justify-center gap-2 text-xs font-semibold"
                onClick={handleRandom}
              >
                {isRandomLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                ) : (
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                )}
                Pick Random Transaction
              </Button>
            </div>

            {/* Transaction Index Input */}
            <div className="space-y-1.5">
              <label htmlFor="calc-tx" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Transaction ID (Dataset Row Index)
              </label>
              <input
                id="calc-tx"
                type="number"
                placeholder="e.g. 541"
                className="w-full border border-slate-200 bg-white text-slate-900 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                {...register('transaction_index', { valueAsNumber: true })}
              />
              {errors.transaction_index && (
                <p className="text-xs text-rose-600 mt-1">{errors.transaction_index.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 text-sm font-bold rounded-xl bg-[#0F766E] hover:bg-[#0F766E]/90 text-white shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Running Inference…
                </>
              ) : (
                'Run Fraud Detection'
              )}
            </Button>

            {isError && (
              <p className="text-xs text-rose-600 text-center flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {(error as any)?.response?.data?.message || "Backend error"}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* ── Right: Results & SHAP Panel ────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        <AnimatePresence mode="wait">
          {!isSuccess && !isPending ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 min-h-[400px] flex flex-col items-center justify-center gap-3 p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800 mb-1">Ready for Inference</h2>
                <p className="text-slate-500 text-xs max-w-xs">
                  Enter a transaction row index and click "Run Fraud Detection".
                </p>
              </div>
            </motion.div>
          ) : isPending ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 min-h-[400px] flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-slate-200 shadow-sm"
            >
              <Loader2 className="w-8 h-8 animate-spin text-[#0F766E]" />
              <p className="font-semibold text-slate-700 text-xs">Evaluating stacked ensemble on backend…</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Risk Result Card */}
              <div className={`bg-white rounded-2xl border ${riskStyle.border} shadow-sm p-6`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${riskStyle.bg} ${riskStyle.text} border ${riskStyle.border}`}>
                        {riskLevel === 'HIGH' ? <ShieldAlert className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        Risk: {riskLevel}
                      </span>
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        Model: {modelVer}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transaction ID</div>
                        <div className="text-base font-mono font-bold text-slate-900 mt-0.5">{txId}</div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</div>
                        <div className="text-base font-bold text-slate-900 mt-0.5">{amount}</div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fraud Probability</div>
                        <div className="text-base font-bold text-slate-900 mt-0.5">{riskScorePct.toFixed(2)}%</div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recommended Action</div>
                        <div className={`text-base font-extrabold mt-0.5 ${
                          recAction === 'DECLINE' ? 'text-rose-600' : recAction === 'REVIEW' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {recAction}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-[140px] shrink-0 self-center">
                    <SystemGauge name="Risk Score" value={riskScorePct} color={riskStyle.color} />
                  </div>
                </div>
              </div>

              {/* MODEL EXPLANATION (SHAP Output) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    MODEL EXPLANATION / SHAP Feature Contributions
                  </h3>
                </div>

                {!shap || !shap.top_features || shap.top_features.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 text-center bg-slate-50 rounded-xl">
                    Model explanation unavailable for this transaction.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {shap.top_features.map((item: any, idx: number) => {
                        const isPos = item.shap_value > 0;
                        return (
                          <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                            <div>
                              <span className="font-mono font-bold text-xs text-slate-800">{item.feature}</span>
                              <span className="text-[11px] text-slate-400 ml-2">value: {item.value}</span>
                            </div>
                            <div className={`flex items-center text-xs font-mono font-bold ${isPos ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {isPos ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                              {isPos ? `+${item.shap_value}` : item.shap_value}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
