import * as React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 tracking-wide";
  
  const variants = {
    default: "bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20",
    success: "bg-success/10 text-success border border-success/20 hover:bg-success/20",
    warning: "bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20",
    outline: "text-foreground border border-border/60",
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props} />
  );
}

export { Badge };
