export const PROPOSTA_STATUS_OPTIONS = [
  { value: "rascunho", label: "Rascunho" },
  { value: "enviada", label: "Enviada" },
  { value: "em_negociacao", label: "Em Negociação" },
  { value: "aprovada", label: "Aprovada" },
  { value: "rejeitada", label: "Rejeitada" },
  { value: "expirada", label: "Expirada" },
] as const;

export const PROPOSTA_STATUS_COLOR: Record<string, string> = {
  rascunho: "bg-zinc-100 text-zinc-600",
  enviada: "bg-blue-50 text-blue-700",
  em_negociacao: "bg-yellow-50 text-status-warning",
  aprovada: "bg-green-50 text-status-success",
  rejeitada: "bg-red-50 text-status-critical",
  expirada: "bg-zinc-50 text-zinc-400",
};