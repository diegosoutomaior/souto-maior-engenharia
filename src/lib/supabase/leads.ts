import { createClient } from "@/lib/supabase/client";
import type { Lead, LeadStatus, LeadOrigem } from "@/types";

export async function getLeads() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Lead[];
}

export async function getLeadById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Lead;
}

export async function createLead(lead: {
  nome: string;
  email?: string;
  telefone: string;
  empresa?: string;
  origem: LeadOrigem;
  status?: LeadStatus;
  valor_estimado?: number;
  notas?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .insert(lead)
    .select()
    .single();

  if (error) throw error;
  return data as Lead;
}

export async function updateLead(
  id: string,
  updates: Partial<Omit<Lead, "id" | "created_at" | "updated_at">>
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Lead;
}

export async function deleteLead(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) throw error;
}