import { createClient } from "@/lib/supabase/client";
import type { Obra, ObraStatus, ObraPrioridade } from "@/types";

export async function getObras() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("obras")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Obra[];
}

export async function getObraById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("obras")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Obra;
}

export async function createObra(obra: {
  nome: string;
  cliente: string;
  endereco: string;
  status?: ObraStatus;
  prioridade?: ObraPrioridade;
  responsavel: string;
  data_inicio: string;
  data_previsao: string;
  orcamento: number;
  descricao?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("obras")
    .insert(obra)
    .select()
    .single();

  if (error) throw error;
  return data as Obra;
}

export async function updateObra(
  id: string,
  updates: Partial<Omit<Obra, "id" | "created_at" | "updated_at">>
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("obras")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Obra;
}

export async function deleteObra(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("obras")
    .delete()
    .eq("id", id);

  if (error) throw error;
}