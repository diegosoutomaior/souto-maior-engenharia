"use client";

import { formatDate } from "@/lib/utils";
import type { DashboardData } from "@/lib/supabase/dashboard";

interface DashboardAtividadesProps {
  data: DashboardData;
}

interface Atividade {
  id: string;
  texto: string;
  data: string;
  cor: string;
}

export function DashboardAtividades({ data }: DashboardAtividadesProps) {
  // Montar lista de atividades recentes combinando todas as entidades
  const atividades: Atividade[] = [];

  data.leads.slice(0, 3).forEach((lead) => {
    atividades.push({
      id: `lead-${lead.id}`,
      texto: `Novo lead: ${lead.nome}`,
      data: lead.created_at,
      cor: "bg-blue-500",
    });
  });

  data.propostas.slice(0, 3).forEach((prop) => {
    const acao =
      prop.status === "aprovada"
        ? "Proposta aprovada"
        : prop.status === "enviada"
        ? "Proposta enviada"
        : "Proposta atualizada";
    atividades.push({
      id: `prop-${prop.id}`,
      texto: `${acao}: ${prop.titulo}`,
      data: prop.updated_at,
      cor:
        prop.status === "aprovada"
          ? "bg-status-success"
          : prop.status === "rejeitada"
          ? "bg-status-critical"
          : "bg-brand-500",
    });
  });

  data.lancamentos
    .filter((l) => l.status === "pago")
    .slice(0, 3)
    .forEach((lanc) => {
      atividades.push({
        id: `lanc-${lanc.id}`,
        texto: `Pagamento ${lanc.tipo === "receita" ? "recebido" : "efetuado"}: ${lanc.descricao}`,
        data: lanc.data_pagamento || lanc.created_at,
        cor: lanc.tipo === "receita" ? "bg-status-success" : "bg-status-warning",
      });
    });

  // Ordenar por data decrescente
  atividades.sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  const recentes = atividades.slice(0, 8);

  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-6">
      <h3 className="text-sm font-medium text-zinc-900 mb-4">
        Atividades recentes
      </h3>
      {recentes.length === 0 ? (
        <p className="text-sm text-zinc-400 py-4 text-center">
          Nenhuma atividade registrada ainda.
        </p>
      ) : (
        <div className="space-y-4">
          {recentes.map((ativ) => (
            <div key={ativ.id} className="flex gap-3">
              <div
                className={`h-2 w-2 rounded-full mt-2 shrink-0 ${ativ.cor}`}
              />
              <div>
                <p className="text-sm text-zinc-900">{ativ.texto}</p>
                <p className="text-xs text-zinc-500">
                  {formatDate(ativ.data)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}