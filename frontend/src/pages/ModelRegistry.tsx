import React from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '@/lib/echarts';
import { PageHeader } from "@/components/layout/PageHeader";
import { Database, GitCompare, Activity } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useModelRegistry } from "@/core/api/hooks/useOps";

export const ModelRegistry = () => {
  const { data, isLoading } = useModelRegistry();
  const models = data?.registry || [];
  const activeModel = models.find((m: any) => m.status === 'Production' || m.status === 'Champion' || m.status === 'Available' || m.status === 'Verified') || models[0];

  // Derive metrics or fallback to unavailable
  const f1Val = activeModel?.f1_score != null ? (activeModel.f1_score * 100).toFixed(2) + "%" : "Unavailable";
  const prAucVal = activeModel?.pr_auc != null ? activeModel.pr_auc.toFixed(4) : "Unavailable";
  const accVal = "Unavailable"; // Real accuracy isn't calculated in eval_metrics
  const precisionVal = "Unavailable"; // Detailed breakdown not in this endpoint
  const recallVal = "Unavailable";

  const rocOptions = null;
  const matrixData = null;

  return (
    <div className="space-y-6 pb-12 w-full animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <PageHeader 
          title="Model Performance" 
          description="Registry and evaluation metrics for active fraud detection models." 
        />
        <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm font-medium h-9">
          Deploy New Version
        </Button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Accuracy", val: accVal, color: "emerald" },
          { label: "Precision", val: precisionVal, color: "slate" },
          { label: "Recall", val: recallVal, color: "slate" },
          { label: "F1 Score", val: f1Val, color: "emerald" },
        ].map((m, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className={`text-3xl font-bold text-${m.color}-600`}>{m.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ROC Curve */}
        <div className="bg-white p-6 rounded-[1.25rem] border border-slate-200 shadow-sm flex flex-col justify-center items-center h-[380px]">
          <h3 className="text-base font-semibold text-slate-900 mb-2 self-start w-full">ROC Curve</h3>
          <div className="text-sm text-slate-500 font-medium my-auto">Data Unavailable</div>
        </div>

        {/* Confusion Matrix */}
        <div className="bg-white p-6 rounded-[1.25rem] border border-slate-200 shadow-sm flex flex-col justify-center items-center h-[380px]">
          <h3 className="text-base font-semibold text-slate-900 mb-2 self-start w-full">Confusion Matrix</h3>
          <div className="text-sm text-slate-500 font-medium my-auto">Data Unavailable</div>
        </div>

      </div>

      {/* Model History Table */}
      <div className="bg-white rounded-[1.25rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-base font-semibold text-slate-900">Active Models</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Version</th>
                <th className="p-4">Type</th>
                <th className="p-4">Deployed</th>
                <th className="p-4">Latency</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="p-4 text-center text-slate-500">Loading registry...</td></tr>
              ) : data?.status === 'unavailable' ? (
                <tr><td colSpan={5} className="p-4 text-center text-slate-500">{data?.reason || 'No verified evaluation artifact is available.'}</td></tr>
              ) : models.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-slate-500">No models in registry.</td></tr>
              ) : (
                models.map((m: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-slate-900">{m.id.replace('mdl_', '')}</td>
                    <td className="p-4 text-slate-600">{m.name}</td>
                    <td className="p-4 text-slate-600">
                      {m.training_date === "Historical" ? "Historical" : new Date(m.training_date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-slate-600">{m.latency_ms != null ? `${m.latency_ms}ms` : 'Not Measured'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                        (m.status === 'Production' || m.status === 'Champion' || m.status === 'Available' || m.status === 'Verified')
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {m.status} {m.is_demo ? "(Demo)" : ""}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
