import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md";
  variant?: "default" | "success" | "warning" | "critical";
}

const barVariants = {
  default: "bg-brand-500",
  success: "bg-status-success",
  warning: "bg-status-warning",
  critical: "bg-status-critical",
};

function getAutoVariant(percentage: number): "success" | "warning" | "critical" | "default" {
  if (percentage >= 95) return "critical";
  if (percentage >= 80) return "warning";
  return "default";
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = "md",
  variant,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  const resolvedVariant = variant || getAutoVariant(percentage);

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="text-xs font-medium text-zinc-600">{label}</span>
          )}
          {showPercentage && (
            <span className="text-xs text-zinc-500">{percentage}%</span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-zinc-100",
          size === "sm" ? "h-1.5" : "h-2.5"
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            barVariants[resolvedVariant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}