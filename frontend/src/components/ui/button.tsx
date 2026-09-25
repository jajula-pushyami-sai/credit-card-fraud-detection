import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "glass";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer relative overflow-hidden";
    
    // Using standard motion curve from Landing Page: [0.22, 1, 0.36, 1] mapped to duration-400
    // We add standard translateY and shadow elevations
    const variants = {
      default: "bg-secondary text-secondary-foreground shadow-sm hover:bg-primary hover:shadow-[0_0_15px_rgba(20,184,166,0.4)] hover:-translate-y-[2px] active:translate-y-[0px] active:shadow-sm duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-[2px] active:translate-y-[0px] active:shadow-sm duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
      outline: "border-2 border-primary bg-background text-primary shadow-sm hover:bg-muted hover:-translate-y-[2px] hover:shadow-[var(--shadow-elevated)] active:translate-y-[0px] active:shadow-sm duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
      secondary: "border-2 border-primary bg-background text-primary shadow-sm hover:bg-muted hover:-translate-y-[2px] hover:shadow-[var(--shadow-elevated)] active:translate-y-[0px] active:shadow-sm duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
      ghost: "hover:bg-muted hover:text-foreground duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] active:translate-y-[0px]",
      link: "text-primary underline-offset-4 hover:underline",
      glass: "glass text-foreground hover:bg-white/40 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-[2px] active:translate-y-[0px] active:shadow-sm duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
    };
    
    const sizes = {
      default: "h-14 px-8 py-3 rounded-[16px]",
      sm: "h-10 rounded-[12px] px-4 text-sm",
      lg: "h-16 rounded-[20px] px-10 text-base",
      icon: "h-14 w-14 rounded-[16px]",
    };

    if (asChild) {
      return (
        <Comp
          className={cn(baseStyles, variants[variant], sizes[size], className)}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...(props as any)}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
