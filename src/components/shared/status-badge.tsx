import { cn } from "@/lib/utils";

type Status = "critico" | "atencao" | "normal" | "concluido";

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

const statusConfig: Record<
  Status,
  { bg: string; text: string; dot: string; defaultLabel: string }
> = {
  critico: {
    bg: "bg-red-50",
    text: "text-status-critical",
    dot: "bg-status-critical",
    defaultLabel: "Crítico",
  },
  atencao: {
    bg: "bg-yellow-50",
    text: "text-status-warning",
    dot: "bg-status-warning",
    defaultLabel: "Atenção",
  },
  normal: {
    bg: "bg-zinc-50",
    text: "text-zinc-600",
    dot: "bg-zinc-400",
    defaultLabel: "Normal",
  },
  concluido: {
    bg: "bg-green-50",
    text: "text-status-success",
    dot: "bg-status-success",
    defaultLabel: "Concluído",
  },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bg,
        config.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {label || config.defaultLabel}
    </span>
  );
}