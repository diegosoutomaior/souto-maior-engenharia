"use client";

import { formatCurrency } from "@/lib/utils";
import { StatCard } from "@/components/shared/stat-card";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import type { Proposta } from "@/types";

interface PropostaStatsProps {
  propostas: Proposta[];
}

export function PropostaStats({ propostas }: PropostaStatsProps) {
  const total = propostas.length;
  const aprovadas = propostas.filter((p) => p.status === "aprovada");
  const pendentes = propostas.filter((p) =>
    ["rascunho", "enviada", "em_negociacao"].includes(p.status)
  );
  const rejeitadas = propostas.filter((p) =>
    ["rejeitada", "expirada"].includes(p.status)
  );

  const valorAprovado = aprovadas.reduce((acc, p) => acc + p.valor, 0);
  const valorPendente = pendentes.reduce((acc, p) => acc + p.valor, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total de Propostas"
        value={String(total)}
        icon={FileText}
        variant="default"
      />
      <StatCard
        title="Aprovadas"
        value={formatCurrency(valorAprovado)}
        description={`${aprovadas.length} proposta${aprovadas.length !== 1 ? "s" : ""}`}
        icon={CheckCircle}
        variant="success"
      />
      <StatCard
        title="Em Andamento"
        value={formatCurrency(valorPendente)}
        description={`${pendentes.length} pendente${pendentes.length !== 1 ? "s" : ""}`}
        icon={Clock}
        variant="warning"
      />
      <StatCard
        title="Perdidas"
        value={String(rejeitadas.length)}
        description="rejeitadas ou expiradas"
        icon={XCircle}
        variant="critical"
      />
    </div>
  );
}