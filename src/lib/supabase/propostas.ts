import { createClient } from "@/lib/supabase/client";
import type { Proposta, PropostaStatus } from "@/types";

export async function getPropostas() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("propostas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Proposta[];
}

export async function getPropostaById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("propostas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Proposta;
}

export async function createProposta(proposta: {
  lead_id?: string;
  titulo: string;
  cliente: string;
  descricao_servico: string;
  valor: number;
  status?: PropostaStatus;
  data_envio?: string;
  data_validade: string;
  condicoes_pagamento?: string;
  observacao?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("propostas")
    .insert(proposta)
    .select()
    .single();

  if (error) throw error;
  return data as Proposta;
}

export async function updateProposta(
  id: string,
  updates: Partial<Omit<Proposta, "id" | "created_at" | "updated_at">>
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("propostas")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Proposta;
}

export async function deleteProposta(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("propostas")
    .delete()
    .eq("id", id);

  if (error) throw error;
}