import { createClient } from "@/lib/supabase/client";
import type { Lancamento, TipoLancamento, CategoriaFinanceira, StatusPagamento } from "@/types";

export async function getLancamentosByObra(obraId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lancamentos")
    .select("*")
    .eq("obra_id", obraId)
    .order("data_vencimento", { ascending: false });

  if (error) throw error;
  return data as Lancamento[];
}

export async function getAllLancamentos() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lancamentos")
    .select("*")
    .order("data_vencimento", { ascending: false });

  if (error) throw error;
  return data as Lancamento[];
}

export async function createLancamento(lancamento: {
  obra_id: string;
  tipo: TipoLancamento;
  categoria: CategoriaFinanceira;
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  status?: StatusPagamento;
  nota_fiscal?: string;
  observacao?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lancamentos")
    .insert(lancamento)
    .select()
    .single();

  if (error) throw error;
  return data as Lancamento;
}

export async function updateLancamento(
  id: string,
  updates: Partial<Omit<Lancamento, "id" | "created_at">>
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lancamentos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Lancamento;
}

export async function deleteLancamento(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("lancamentos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}