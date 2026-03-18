"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ObraCard } from "@/components/obras/obra-card";
import { ObraForm, type ObraFormData } from "@/components/obras/obra-form";
import { EmptyState } from "@/components/shared/empty-state";
import { PageLoading } from "@/components/shared/page-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { getObras, createObra } from "@/lib/supabase/obras";
import { toast } from "@/hooks/use-toast";
import { Plus, Search, HardHat } from "lucide-react";
import type { Obra, ObraStatus, ObraPrioridade } from "@/types";

export default function ObrasPage() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [formOpen, setFormOpen] = useState(false);

  const fetchObras = useCallback(async () => {
    try { setObras(await getObras()); } catch (err: any) {
      toast({ title: "Erro ao carregar obras", description: err.message, variant: "destructive" });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchObras(); }, [fetchObras]);

  const filtered = obras.filter((obra) => {
    const matchesSearch = obra.nome.toLowerCase().includes(search.toLowerCase()) || obra.cliente.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "todos" || obra.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleCreate(data: ObraFormData) {
    await createObra({
      nome: data.nome, cliente: data.cliente, endereco: data.endereco,
      status: data.status as ObraStatus, prioridade: data.prioridade as ObraPrioridade,
      responsavel: data.responsavel, data_inicio: data.data_inicio,
      data_previsao: data.data_previsao, orcamento: data.orcamento ? Number(data.orcamento) : 0,
      descricao: data.descricao || undefined,
    });
    toast({ title: "Obra criada com sucesso" });
    await fetchObras();
  }

  if (loading) return <PageLoading message="Carregando obras..." />;

  return (
    <div>
      <PageHeader title="Obras" description="Gerencie suas obras e projetos">
        <Button className="bg-brand-500 hover:bg-brand-600" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />Nova Obra
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input placeholder="Buscar por nome ou cliente..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="planejamento">Planejamento</SelectItem>
            <SelectItem value="em_andamento">Em andamento</SelectItem>
            <SelectItem value="pausada">Pausada</SelectItem>
            <SelectItem value="concluida">Concluída</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={HardHat} title="Nenhuma obra encontrada" description="Crie uma obra ou ajuste os filtros." className="mt-6" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {filtered.map((obra) => (<ObraCard key={obra.id} obra={obra} />))}
        </div>
      )}

      <ObraForm open={formOpen} onOpenChange={setFormOpen} onSubmit={handleCreate} />
    </div>
  );
}