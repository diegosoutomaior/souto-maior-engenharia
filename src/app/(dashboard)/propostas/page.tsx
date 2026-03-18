"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { PropostaCard } from "@/components/propostas/proposta-card";
import { PropostaDetail } from "@/components/propostas/proposta-detail";
import { PropostaForm, type PropostaFormData } from "@/components/propostas/proposta-form";
import { PropostaStats } from "@/components/propostas/proposta-stats";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageLoading } from "@/components/shared/page-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { getPropostas, createProposta, updateProposta, deleteProposta } from "@/lib/supabase/propostas";
import { PROPOSTA_STATUS_OPTIONS } from "@/lib/constants-propostas";
import { toast } from "@/hooks/use-toast";
import { Plus, Search, FileText } from "lucide-react";
import type { Proposta, PropostaStatus } from "@/types";

export default function PropostasPage() {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProposta, setEditingProposta] = useState<Proposta | null>(null);
  const [detailProposta, setDetailProposta] = useState<Proposta | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchPropostas = useCallback(async () => {
    try { setPropostas(await getPropostas()); } catch (err: any) {
      toast({ title: "Erro ao carregar propostas", description: err.message, variant: "destructive" });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPropostas(); }, [fetchPropostas]);

  const filtered = propostas.filter((p) => {
    const matchesSearch = p.titulo.toLowerCase().includes(search.toLowerCase()) || p.cliente.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "todos" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleCreate(data: PropostaFormData) {
    await createProposta({
      lead_id: data.lead_id || undefined, titulo: data.titulo, cliente: data.cliente,
      descricao_servico: data.descricao_servico, valor: Number(data.valor),
      status: data.status as PropostaStatus, data_envio: data.data_envio || undefined,
      data_validade: data.data_validade, condicoes_pagamento: data.condicoes_pagamento || undefined,
      observacao: data.observacao || undefined,
    });
    toast({ title: "Proposta criada com sucesso" });
    await fetchPropostas();
  }

  async function handleUpdate(data: PropostaFormData) {
    if (!editingProposta) return;
    await updateProposta(editingProposta.id, {
      lead_id: data.lead_id || null, titulo: data.titulo, cliente: data.cliente,
      descricao_servico: data.descricao_servico, valor: Number(data.valor),
      status: data.status as PropostaStatus, data_envio: data.data_envio || null,
      data_validade: data.data_validade, condicoes_pagamento: data.condicoes_pagamento || null,
      observacao: data.observacao || null,
    });
    toast({ title: "Proposta atualizada" });
    setEditingProposta(null);
    await fetchPropostas();
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    try { await deleteProposta(deleteId); toast({ title: "Proposta excluída" }); await fetchPropostas(); }
    catch (err: any) { toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" }); }
    finally { setDeleteId(null); }
  }

  function handleCardClick(proposta: Proposta) { setDetailProposta(proposta); setDetailOpen(true); }
  function handleEditFromDetail(proposta: Proposta) { setEditingProposta(proposta); setFormOpen(true); }
  function handleDeleteFromDetail(id: string) { setDetailOpen(false); setDeleteId(id); }

  if (loading) return <PageLoading message="Carregando propostas..." />;

  return (
    <div>
      <PageHeader title="Propostas" description="Gerencie suas propostas comerciais">
        <Button className="bg-brand-500 hover:bg-brand-600" onClick={() => { setEditingProposta(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Nova Proposta
        </Button>
      </PageHeader>

      <div className="mt-6"><PropostaStats propostas={propostas} /></div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input placeholder="Buscar por título ou cliente..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {PROPOSTA_STATUS_OPTIONS.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="Nenhuma proposta encontrada" description="Crie uma proposta ou ajuste os filtros." className="mt-6" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {filtered.map((proposta) => (<PropostaCard key={proposta.id} proposta={proposta} onClick={handleCardClick} />))}
        </div>
      )}

      <PropostaForm open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingProposta(null); }} onSubmit={editingProposta ? handleUpdate : handleCreate} initialData={editingProposta} />
      <PropostaDetail proposta={detailProposta} open={detailOpen} onOpenChange={setDetailOpen} onEdit={handleEditFromDetail} onDelete={handleDeleteFromDetail} />
      <ConfirmDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }} title="Excluir proposta" description="Tem certeza que deseja excluir esta proposta? Esta ação não pode ser desfeita." confirmLabel="Excluir" variant="danger" onConfirm={handleDeleteConfirm} />
    </div>
  );
}