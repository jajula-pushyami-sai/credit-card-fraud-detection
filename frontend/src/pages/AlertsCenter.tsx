import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AlertTriangle, Clock, ShieldAlert, AlertCircle, ArrowRight, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuditLogs } from "@/core/api/hooks/useOps";
import { EmptyState } from "@/components/ui/empty-state";

export const AlertsCenter = () => {
  const { data: logs, isLoading, isError } = useAuditLogs();

  const getAlertConfig = (action: string) => {
    if (action.includes("PREDICTION") || action.includes("FRAUD")) return { risk: "High", icon: ShieldAlert, color: "rose" };
    if (action.includes("THRESHOLD") || action.includes("OVERRIDE")) return { risk: "Medium", icon: AlertTriangle, color: "amber" };
    return { risk: "Low", icon: AlertCircle, color: "primary" };
  };

  return (
    <div className="space-y-6 pb-12 w-full animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <PageHeader 
          title="Security Alerts & Audit Log" 
          description="Review system events, overrides, and automated flags." 
        />
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="text-sm bg-white border-slate-200 text-slate-600" 
            disabled={isLoading || !logs?.length}
            onClick={() => alert("All alerts have been acknowledged and archived.")}
          >
            Acknowledge All
          </Button>
          <Button 
            className="text-sm bg-rose-600 hover:bg-rose-700 text-white border-none" 
            disabled={isLoading}
            onClick={() => alert("Redirecting to critical security review workflow...")}
          >
            Review Critical
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[1.25rem] border border-slate-200 shadow-sm p-6 lg:p-8 min-h-[400px] flex flex-col">
        <h2 className="text-sm font-semibold text-slate-900 mb-8 uppercase tracking-wider">Active Timeline</h2>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-sm font-medium">Fetching secure audit trail...</p>
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState 
              title="Audit Sync Failed" 
              description="Unable to connect to the MLOps logging service." 
              icon={<AlertTriangle className="w-8 h-8 text-rose-500" />}
              action={<Button variant="outline" onClick={() => window.location.reload()}>Reconnect</Button>}
            />
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState 
              title="All Clear" 
              description="No active security alerts or recent audit logs." 
              icon={<ShieldAlert className="w-8 h-8 text-emerald-500" />}
            />
          </div>
        ) : (
          <div className="relative border-l border-slate-200 ml-4 space-y-10 pb-4">
            {logs.map((log: any, idx: number) => {
              const config = getAlertConfig(log.action);
              return (
                <div key={idx} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[17px] top-1 p-1.5 rounded-full bg-white border-2 shadow-sm border-${config.color}-500`}>
                    <config.icon className={`w-4 h-4 text-${config.color}-500`} />
                  </div>

                  {/* Content */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 hover:bg-white hover:shadow-md hover:border-slate-200 transition-all group">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-slate-900">{log.action.replace(/_/g, ' ')}</h3>
                        <span className={`px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider
                          ${config.risk === 'High' ? 'bg-rose-100 text-rose-700' : 
                            config.risk === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'}
                        `}>
                          {config.risk}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-4">
                      <span className="font-medium text-slate-900">{log.actor}</span> performed action on <span className="font-mono text-xs">{log.resource}</span> from IP: {log.ip}. Status: {log.status}.
                    </p>
                    
                    <div className="flex items-center justify-between border-t border-slate-200/60 pt-4 mt-2">
                      <span className="font-mono text-xs text-slate-400">ID: {log.id}</span>
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-slate-600 group-hover:text-emerald-600">
                        Investigate <ArrowRight className="w-3 h-3 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
