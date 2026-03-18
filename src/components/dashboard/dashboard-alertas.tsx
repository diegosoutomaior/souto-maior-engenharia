"use client";

import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProgressBar } from "@/components/shared/progress-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { AlertTriangle, FileText } from "lucide-react";
import type { Obra, Lancamento, Proposta } from "@/types";

interface DashboardAlertasProps {
  obras: Obra[];
  lancamentos: Lancamento[];
  propostas: Proposta[];
}

export function DashboardAlertas({ obras, lancamentos, propostas }: DashboardAlertasProps) {
  const obrasAlerta = obras
    .filter(
      (o) =>
        (o.prioridade === "critico" || o.prioridade === "atencao") &&
        o.status === "em_andamento"
    )
    .sort((a, b) => {
      if (a.prioridade === "critico" && b.prioridade !== "critico") return -1;
      if (a.prioridade !== "critico" && b.prioridade === "critico") return 1;
      return 0;
    })
    .slice(0, 5);

  const lancamentosAtrasados = lancamentos
    .filter((l) => l.status === "atrasado")
    .slice(0, 5);

  const hoje = new Date();
  const propostasVencendo = propostas
    .filter((p) => {
      if (["aprovada", "rejeitada", "expirada"].includes(p.status)) return false;
      const validade = new Date(p.data_validade);
      const diffDays = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    })
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Obras com alerta */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h3 className="text-sm font-medium text-zinc-900 mb-4">Obras com atenção</h3>
        {obrasAlerta.length === 0 ? (
          <EmptyState icon={AlertTriangle} title="Tudo em dia" className="py-8" />
        ) : (
          <div className="space-y-3">
            {obrasAlerta.map((obra) => (
              <Link key={obra.id} href={`/obras/${obra.id}`}>
                <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors hover:shadow-sm cursor-pointer ${
                  obra.prioridade === "critico" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"
                }`}>
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="text-sm font-medium text-zinc-900 truncate">{obra.nome}</p>
                    <div className="mt-1"><ProgressBar value={obra.progresso} size="sm" showPercentage={false} /></div>
                    <p className="text-xs text-zinc-500 mt-1">Previsão: {formatDate(obra.data_previsao)}</p>
                  </div>
                  <StatusBadge status={obra.prioridade === "critico" ? "critico" : "atencao"} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagamentos atrasados */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h3 className="text-sm font-medium text-zinc-900 mb-4">Pagamentos atrasados</h3>
        {lancamentosAtrasados.length === 0 ? (
          <EmptyState icon={AlertTriangle} title="Nenhum atraso" className="py-8" />
        ) : (
          <div className="space-y-3">
            {lancamentosAtrasados.map((lanc) => (
              <div key={lanc.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{lanc.descricao}</p>
                  <p className="text-xs text-zinc-500">Vencimento: {formatDate(lanc.data_vencimento)}</p>
                </div>
                <span className="text-sm font-semibold text-status-critical whitespace-nowrap ml-3">
                  {formatCurrency(lanc.valor)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Propostas vencendo */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h3 className="text-sm font-medium text-zinc-900 mb-4">Propostas vencendo</h3>
        {propostasVencendo.length === 0 ? (
          <EmptyState icon={FileText} title="Nenhuma urgência" className="py-8" />
        ) : (
          <div className="space-y-3">
            {propostasVencendo.map((prop) => (
              <Link key={prop.id} href="/propostas">
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:shadow-sm transition-colors cursor-pointer">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{prop.titulo}</p>
                    <p className="text-xs text-zinc-500">Validade: {formatDate(prop.data_validade)}</p>
                  </div>
                  <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap ml-3">
                    {formatCurrency(prop.valor)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}