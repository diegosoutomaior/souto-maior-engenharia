import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "critical";
}

const variantStyles = {
  default: {
    icon: "bg-brand-50 text-brand-500",
    border: "border-zinc-200",
    hover: "hover:border-brand-200",
  },
  success: {
    icon: "bg-green-50 text-status-success",
    border: "border-zinc-200",
    hover: "hover:border-green-200",
  },
  warning: {
    icon: "bg-yellow-50 text-status-warning",
    border: "border-zinc-200",
    hover: "hover:border-yellow-200",
  },
  critical: {
    icon: "bg-red-50 text-status-critical",
    border: "border-zinc-200",
    hover: "hover:border-red-200",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "bg-white rounded-xl border p-5 transition-colors duration-150",
        styles.border,
        styles.hover
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 tracking-tight">
            {value}
          </p>
          {description && (
            <p className="mt-1 text-xs text-zinc-500">{description}</p>
          )}
        </div>
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
            styles.icon
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}