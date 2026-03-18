"use client";

import { StatCard } from "@/components/shared/stat-card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, Clock } from "lucide-react";
import type { DashboardData } from "@/lib/supabase/dashboard";

interface DashboardStatsProps {
  data: DashboardData;
}

export function DashboardStats({ data }: DashboardStatsProps) {
  // REGRA: receita e despesa consideram APENAS lançamentos com status "pago"
  const receitaPaga = data.lancamentos
    .filter((l) => l.tipo === "receita" && l.status === "pago")
    .reduce((acc, l) => acc + l.valor, 0);

  const despesaPaga = data.lancamentos
    .filter((l) => l.tipo === "despesa" && l.status === "pago")
    .reduce((acc, l) => acc + l.valor, 0);

  // REGRA: saldo = receita paga - despesa paga
  const saldo = receitaPaga - despesaPaga;

  // Indicador separado: total pendente (não entra no saldo)
  const pendentes = data.lancamentos.filter(
    (l) => l.status === "pendente" || l.status === "atrasado"
  );
  const aReceber = pendentes
    .filter((l) => l.tipo === "receita")
    .reduce((acc, l) => acc + l.valor, 0);
  const aPagar = pendentes
    .filter((l) => l.tipo === "despesa")
    .reduce((acc, l) => acc + l.valor, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Receita Confirmada"
        value={formatCurrency(receitaPaga)}
        description="lançamentos pagos"
        icon={TrendingUp}
        variant="success"
      />
      <StatCard
        title="Despesa Confirmada"
        value={formatCurrency(despesaPaga)}
        description="lançamentos pagos"
        icon={TrendingDown}
        variant="critical"
      />
      <StatCard
        title="Saldo Real"
        value={formatCurrency(saldo)}
        description="receita - despesa (pagos)"
        icon={Wallet}
        variant={saldo >= 0 ? "default" : "critical"}
      />
      <StatCard
        title="Pendente"
        value={formatCurrency(aReceber - aPagar)}
        description={`${formatCurrency(aReceber)} a receber · ${formatCurrency(aPagar)} a pagar`}
        icon={Clock}
        variant={pendentes.some((l) => l.status === "atrasado") ? "warning" : "default"}
      />
    </div>
  );
}