import * as React from "react";
import { cn } from "@/utils/cn";
import { FadeIn } from "@/components/motion";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action, className, ...props }: EmptyStateProps) {
  return (
    <FadeIn>
      <div className={cn("flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-2xl bg-card/50", className)} {...props}>
        {icon && <div className="mb-4 p-4 rounded-full bg-secondary text-muted-foreground">{icon}</div>}
        <h3 className="mb-2 text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mb-6 text-sm text-muted-foreground max-w-sm">{description}</p>
        {action && <div>{action}</div>}
      </div>
    </FadeIn>
  );
}
