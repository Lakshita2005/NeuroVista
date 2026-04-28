"use client";

import { cn } from "@/lib/utils";

interface ValueDisplayProps {
  label: string;
  value: number | string;
  unit?: string;
  variant?: "default" | "positive" | "negative" | "primary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ValueDisplay({
  label,
  value,
  unit,
  variant = "default",
  size = "md",
  className,
}: ValueDisplayProps) {
  const variantClasses = {
    default: "text-foreground",
    positive: "text-green-400",
    negative: "text-red-400",
    primary: "text-primary",
  };

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const formattedValue = typeof value === "number" 
    ? value.toFixed(value % 1 === 0 ? 0 : 3) 
    : value;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={cn("font-bold font-mono", sizeClasses[size], variantClasses[variant])}>
        {formattedValue}
        {unit && <span className="text-sm ml-1 text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}
