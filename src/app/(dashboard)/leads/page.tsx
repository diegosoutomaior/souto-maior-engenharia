"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { LeadCard } from "@/components/leads/lead-card";
import { LeadKanban } from "@/components/leads/lead-kanban";
import { LeadDetail } from "@/components/leads/lead-detail";
import { LeadForm, type LeadFormData } from "@/components/leads/lead-form";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageLoading } from "@/components/shared/page-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { getLeads, createLead, updateLead, deleteLead } from "@/lib/supabase/leads";
import { LEAD_STATUS_OPTIONS } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { Plus, Search, LayoutGrid, Columns3, Users } from "lucide-react";
import type { Lead, LeadOrigem, LeadStatus } from "@/types";

type ViewMode = "cards" | "kanban";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    try { setLeads(await getLeads()); } catch (err: any) {
      toast({ title: "Erro ao carregar leads", description: err.message, variant: "destructive" });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const filtered = leads.filter((lead) => {
    const matchesSearch = lead.nome.toLowerCase().includes(search.toLowerCase()) ||
      (lead.empresa || "").toLowerCase().includes(search.toLowerCase()) ||
      (lead.email || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "todos" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleCreate(data: LeadFormData) {
    await createLead({
      nome: data.nome, email: data.email || undefined, telefone: data.telefone,
      empresa: data.empresa || undefined, origem: data.origem as LeadOrigem,
      status: data.status as LeadStatus, valor_estimado: data.valor_estimado ? Number(data.valor_estimado) : undefined,
      notas: data.notas || undefined,
    });
    toast({ title: "Lead criado com sucesso" });
    await fetchLeads();
  }

  async function handleUpdate(data: LeadFormData) {
    if (!editingLead) return;
    await updateLead(editingLead.id, {
      nome: data.nome, email: data.email || null, telefone: data.telefone,
      empresa: data.empresa || null, origem: data.origem as LeadOrigem,
      status: data.status as LeadStatus, valor_estimado: data.valor_estimado ? Number(data.valor_estimado) : null,
      notas: data.notas || null,
    });
    toast({ title: "Lead atualizado" });
    setEditingLead(null);
    await fetchLeads();
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    try {
      await deleteLead(deleteId);
      toast({ title: "Lead excluído" });
      await fetchLeads();
    } catch (err: any) {
      toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" });
    } finally { setDeleteId(null); }
  }

  function handleCardClick(lead: Lead) { setDetailLead(lead); setDetailOpen(true); }
  function handleEditFromDetail(lead: Lead) { setEditingLead(lead); setFormOpen(true); }
  function handleDeleteFromDetail(id: string) { setDetailOpen(false); setDeleteId(id); }

  if (loading) return <PageLoading message="Carregando leads..." />;

  return (
    <div>
      <PageHeader title="CRM / Leads" description="Gerencie seus leads e oportunidades">
        <Button className="bg-brand-500 hover:bg-brand-600" onClick={() => { setEditingLead(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Novo Lead
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input placeholder="Buscar por nome, empresa ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {LEAD_STATUS_OPTIONS.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
          </SelectContent>
        </Select>
        <div className="flex border border-zinc-200 rounded-lg overflow-hidden">
          <button onClick={() => setViewMode("cards")} className={`px-3 py-2 text-sm ${viewMode === "cards" ? "bg-brand-500 text-white" : "bg-white text-zinc-600 hover:bg-zinc-50"}`}><LayoutGrid className="h-4 w-4" /></button>
          <button onClick={() => setViewMode("kanban")} className={`px-3 py-2 text-sm ${viewMode === "kanban" ? "bg-brand-500 text-white" : "bg-white text-zinc-600 hover:bg-zinc-50"}`}><Columns3 className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="mt-6">
        {viewMode === "cards" ? (
          filtered.length === 0 ? (
            <EmptyState icon={Users} title="Nenhum lead encontrado" description="Crie um lead ou ajuste os filtros." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((lead) => (<LeadCard key={lead.id} lead={lead} onClick={handleCardClick} />))}
            </div>
          )
        ) : (
          <LeadKanban leads={filtered} onCardClick={handleCardClick} />
        )}
      </div>

      <LeadForm open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingLead(null); }} onSubmit={editingLead ? handleUpdate : handleCreate} initialData={editingLead} />
      <LeadDetail lead={detailLead} open={detailOpen} onOpenChange={setDetailOpen} onEdit={handleEditFromDetail} onDelete={handleDeleteFromDetail} />
      <ConfirmDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }} title="Excluir lead" description="Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita." confirmLabel="Excluir" variant="danger" onConfirm={handleDeleteConfirm} />
    </div>
  );
}