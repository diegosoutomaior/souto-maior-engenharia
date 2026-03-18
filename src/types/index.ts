// ==================== OBRAS ====================

export type ObraStatus =
  | "planejamento"
  | "em_andamento"
  | "pausada"
  | "concluida"
  | "cancelada";

export type ObraPrioridade = "critico" | "atencao" | "normal";

export interface Obra {
  id: string;
  nome: string;
  cliente: string;
  endereco: string;
  status: ObraStatus;
  prioridade: ObraPrioridade;
  responsavel: string;
  data_inicio: string;
  data_previsao: string;
  data_conclusao?: string | null;
  orcamento: number;
  custo_atual: number;
  progresso: number;
  descricao?: string | null;
  created_at: string;
  updated_at: string;
}

// ==================== FINANCEIRO ====================

export type TipoLancamento = "receita" | "despesa";

export type CategoriaFinanceira =
  | "material"
  | "mao_de_obra"
  | "equipamento"
  | "servico_terceiro"
  | "imposto"
  | "medicao"
  | "adiantamento"
  | "outros";

export type StatusPagamento = "pendente" | "pago" | "atrasado" | "cancelado";

export interface Lancamento {
  id: string;
  obra_id: string;
  tipo: TipoLancamento;
  categoria: CategoriaFinanceira;
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string | null;
  status: StatusPagamento;
  nota_fiscal?: string | null;
  observacao?: string | null;
  created_at: string;
}

// ==================== CRM / LEADS ====================

export type LeadOrigem =
  | "indicacao"
  | "site"
  | "instagram"
  | "telefone"
  | "evento"
  | "outros";

export type LeadStatus =
  | "novo"
  | "contatado"
  | "qualificado"
  | "proposta_enviada"
  | "fechado_ganho"
  | "fechado_perdido";

export interface Lead {
  id: string;
  nome: string;
  email?: string | null;
  telefone: string;
  empresa?: string | null;
  origem: LeadOrigem;
  status: LeadStatus;
  valor_estimado?: number | null;
  notas?: string | null;
  created_at: string;
  updated_at: string;
}

// ==================== PROPOSTAS ====================

export type PropostaStatus =
  | "rascunho"
  | "enviada"
  | "em_negociacao"
  | "aprovada"
  | "rejeitada"
  | "expirada";

export interface Proposta {
  id: string;
  lead_id?: string | null;
  titulo: string;
  cliente: string;
  descricao_servico: string;
  valor: number;
  status: PropostaStatus;
  data_envio?: string | null;
  data_validade: string;
  condicoes_pagamento?: string | null;
  observacao?: string | null;
  created_at: string;
  updated_at: string;
}