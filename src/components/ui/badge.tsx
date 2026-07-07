import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "navy";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants: Record<string, string> = {
    default: "text-primary border-primary/30",
    secondary: "text-navy border-border",
    destructive: "text-destructive border-destructive/30",
    outline: "text-foreground border-border",
    success: "text-success border-success/30",
    warning: "text-warning border-warning/30",
    navy: "text-navy border-navy/30",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase bg-white/50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
