"use client";

import { formatCurrency } from "@/lib/utils";
import { StatCard } from "@/components/shared/stat-card";
import { TrendingUp, TrendingDown, Wallet, AlertTriangle } from "lucide-react";
import type { Lancamento } from "@/types";

interface FinanceiroResumoProps {
  lancamentos: Lancamento[];
}

export function FinanceiroResumo({ lancamentos }: FinanceiroResumoProps) {
  const totalReceita = lancamentos
    .filter((l) => l.tipo === "receita")
    .reduce((acc, l) => acc + l.valor, 0);

  const totalDespesa = lancamentos
    .filter((l) => l.tipo === "despesa")
    .reduce((acc, l) => acc + l.valor, 0);

  const saldo = totalReceita - totalDespesa;

  const atrasados = lancamentos.filter((l) => l.status === "atrasado");
  const totalAtrasado = atrasados.reduce((acc, l) => acc + l.valor, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Receitas"
        value={formatCurrency(totalReceita)}
        description={`${lancamentos.filter((l) => l.tipo === "receita").length} lançamentos`}
        icon={TrendingUp}
        variant="success"
      />
      <StatCard
        title="Total Despesas"
        value={formatCurrency(totalDespesa)}
        description={`${lancamentos.filter((l) => l.tipo === "despesa").length} lançamentos`}
        icon={TrendingDown}
        variant="critical"
      />
      <StatCard
        title="Saldo"
        value={formatCurrency(saldo)}
        icon={Wallet}
        variant={saldo >= 0 ? "default" : "critical"}
      />
      <StatCard
        title="Atrasados"
        value={formatCurrency(totalAtrasado)}
        description={`${atrasados.length} pendência${atrasados.length !== 1 ? "s" : ""}`}
        icon={AlertTriangle}
        variant={atrasados.length > 0 ? "warning" : "default"}
      />
    </div>
  );
}