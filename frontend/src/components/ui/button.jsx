import React from "react";
import { cn } from "./utils";

const buttonVariants = {
  default: "bg-emerald-500 text-slate-900 hover:bg-emerald-400",
  outline: "border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800",
  ghost: "text-slate-200 hover:bg-slate-800",
};

export const Button = React.forwardRef(({ className = "", variant = "default", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant] || buttonVariants.default,
        className
      )}
      {...props}
    />
  );
});

Button.displayName = "Button";
