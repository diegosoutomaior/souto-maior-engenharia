import { createClient } from "@/lib/supabase/client";
import type { Obra, Lancamento, Lead, Proposta } from "@/types";

export interface DashboardData {
  obras: Obra[];
  lancamentos: Lancamento[];
  leads: Lead[];
  propostas: Proposta[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = createClient();

  const [obrasRes, lancamentosRes, leadsRes, propostasRes] = await Promise.all([
    supabase.from("obras").select("*").order("created_at", { ascending: false }),
    supabase.from("lancamentos").select("*").order("data_vencimento", { ascending: true }),
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("propostas").select("*").order("created_at", { ascending: false }),
  ]);

  if (obrasRes.error) throw obrasRes.error;
  if (lancamentosRes.error) throw lancamentosRes.error;
  if (leadsRes.error) throw leadsRes.error;
  if (propostasRes.error) throw propostasRes.error;

  return {
    obras: obrasRes.data as Obra[],
    lancamentos: lancamentosRes.data as Lancamento[],
    leads: leadsRes.data as Lead[],
    propostas: propostasRes.data as Proposta[],
  };
}