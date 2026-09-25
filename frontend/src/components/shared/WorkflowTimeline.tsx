import { CheckCircle2, AlertTriangle, ShieldCheck, Mail, BrainCircuit, User } from "lucide-react";

export const WorkflowTimeline = () => {
  const steps = [
    { label: "Transaction Ingress", status: "complete", icon: <BrainCircuit className="w-4 h-4" /> },
    { label: "Hybrid Inference", status: "complete", icon: <BrainCircuit className="w-4 h-4" /> },
    { label: "Risk Flag (High)", status: "warning", icon: <AlertTriangle className="w-4 h-4" /> },
    { label: "Audit Entry Written", status: "complete", icon: <ShieldCheck className="w-4 h-4" /> },
    { label: "Email Alert Dispatched", status: "complete", icon: <Mail className="w-4 h-4" /> },
    { label: "Analyst Review Assigned", status: "current", icon: <User className="w-4 h-4" /> },
    { label: "Final Decision", status: "pending", icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <div className="relative border-l border-border/50 ml-4 pl-6 space-y-8 py-4">
      {steps.map((step, idx) => (
        <div key={idx} className="relative">
          <div className={`absolute -left-[35px] p-1.5 rounded-full border ${
            step.status === 'complete' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' :
            step.status === 'warning' ? 'bg-rose-500/20 border-rose-500 text-rose-500' :
            step.status === 'current' ? 'bg-primary/20 border-primary text-primary animate-pulse' :
            'bg-background border-border text-muted-foreground'
          }`}>
            {step.icon}
          </div>
          <div>
            <h4 className={`text-sm font-medium ${step.status === 'pending' ? 'opacity-50' : ''}`}>{step.label}</h4>
            {step.status === 'current' && <p className="text-xs text-primary mt-1">Awaiting Analyst Action</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
