export const LEAD_STATUS_OPTIONS = [
  { value: "novo", label: "Novo" },
  { value: "contatado", label: "Contatado" },
  { value: "qualificado", label: "Qualificado" },
  { value: "proposta_enviada", label: "Proposta Enviada" },
  { value: "fechado_ganho", label: "Fechado (Ganho)" },
  { value: "fechado_perdido", label: "Fechado (Perdido)" },
] as const;

export const LEAD_ORIGEM_OPTIONS = [
  { value: "indicacao", label: "Indicação" },
  { value: "site", label: "Site" },
  { value: "instagram", label: "Instagram" },
  { value: "telefone", label: "Telefone" },
  { value: "evento", label: "Evento" },
  { value: "outros", label: "Outros" },
] as const;

export const LEAD_STATUS_COLOR: Record<string, string> = {
  novo: "bg-blue-50 text-blue-700",
  contatado: "bg-purple-50 text-purple-700",
  qualificado: "bg-brand-50 text-brand-700",
  proposta_enviada: "bg-yellow-50 text-status-warning",
  fechado_ganho: "bg-green-50 text-status-success",
  fechado_perdido: "bg-red-50 text-status-critical",
};

export const LEAD_ORIGEM_COLOR: Record<string, string> = {
  indicacao: "bg-green-50 text-green-700",
  site: "bg-blue-50 text-blue-700",
  instagram: "bg-pink-50 text-pink-700",
  telefone: "bg-zinc-100 text-zinc-700",
  evento: "bg-amber-50 text-amber-700",
  outros: "bg-zinc-50 text-zinc-500",
};