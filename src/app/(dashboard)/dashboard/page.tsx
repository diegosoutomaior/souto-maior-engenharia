"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardAlertas } from "@/components/dashboard/dashboard-alertas";
import { DashboardAtividades } from "@/components/dashboard/dashboard-atividades";
import { PageLoading } from "@/components/shared/page-loading";
import { getDashboardData, type DashboardData } from "@/lib/supabase/dashboard";
import { toast } from "@/hooks/use-toast";

function getSaudacao(): string {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await getDashboardData();
      setData(result);
    } catch (err: any) {
      toast({ title: "Erro ao carregar dashboard", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading || !data) return <PageLoading message="Carregando dashboard..." />;

  return (
    <div>
      <PageHeader
        title={`${getSaudacao()}`}
        description="Visão geral do sistema"
      />

      <div className="mt-6 space-y-8">
        <DashboardStats data={data} />
        <DashboardAlertas
          obras={data.obras}
          lancamentos={data.lancamentos}
          propostas={data.propostas}
        />
        <DashboardAtividades data={data} />
      </div>
    </div>
  );
}