import React from "react";
import { cn } from "./utils";

const variantClasses = {
  default: "bg-primary text-primary-foreground shadow-glow hover:brightness-110",
  outline:
    "border border-border/70 bg-transparent text-foreground hover:border-primary hover:text-primary", 
  ghost: "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
  subtle: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
};

const sizeClasses = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-9 px-3 text-xs",
  lg: "h-11 px-5 text-base",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef(
  (
    { className = "", variant = "default", size = "default", asChild = false, children, ...props },
    ref
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60",
      variantClasses[variant] || variantClasses.default,
      sizeClasses[size] || sizeClasses.default,
      className
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        className: cn(children.props.className, classes),
        ref,
        ...props,
      });
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
