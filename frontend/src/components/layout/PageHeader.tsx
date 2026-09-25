import React from"react";
import { FadeIn } from"@/components/motion";

interface PageHeaderProps {
 title: string;
 description?: string;
 action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
 return (
 <FadeIn className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
 <div className="space-y-1.5">
 <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
 {description && <p className="text-muted-foreground text-lg">{description}</p>}
 </div>
 {action && <div>{action}</div>}
 </FadeIn>
 );
}
