import React from "react";
import { cn } from "./utils";

const badgeVariants = {
  default: "bg-secondary text-secondary-foreground border-transparent",
  outline: "border border-border/70 text-foreground",
  success: "bg-green-600/20 text-green-200 border border-green-600/40",
};

export function Badge({ className = "", variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    />
  );
}
