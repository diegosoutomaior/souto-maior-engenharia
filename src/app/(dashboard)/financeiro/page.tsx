"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { FinanceiroResumo } from "@/components/financeiro/financeiro-resumo";
import {
  LancamentoFormGlobal,
  type LancamentoGlobalFormData,
} from "@/components/financeiro/lancamento-form-global";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageLoading } from "@/components/shared/page-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllLancamentos,
  createLancamento,
  updateLancamento,
  deleteLancamento,
} from "@/lib/supabase/lancamentos";
import { getObras } from "@/lib/supabase/obras";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Plus, Search, Trash2, Edit, CheckCircle, DollarSign } from "lucide-react";
import type {
  Lancamento,
  Obra,
  TipoLancamento,
  CategoriaFinanceira,
  StatusPagamento,
} from "@/types";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function FinanceiroPage() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Form
  const [formOpen, setFormOpen] = useState(false);
  const [editingLanc, setEditingLanc] = useState<Lancamento | null>(null);

  // Confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [pagoId, setPagoId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [lancData, obrasData] = await Promise.all([getAllLancamentos(), getObras()]);
      setLancamentos(lancData);
      setObras(obrasData);
    } catch (err: any) {
      toast({ title: "Erro ao carregar financeiro", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const obraMap = new Map(obras.map((o) => [o.id, o.nome]));

  const filtered = lancamentos.filter((l) => {
    const matchesSearch =
      l.descricao.toLowerCase().includes(search.toLowerCase()) ||
      (obraMap.get(l.obra_id) || "").toLowerCase().includes(search.toLowerCase());
    const matchesTipo = tipoFilter === "todos" || l.tipo === tipoFilter;
    const matchesStatus = statusFilter === "todos" || l.status === statusFilter;
    return matchesSearch && matchesTipo && matchesStatus;
  });

  async function handleCreate(data: LancamentoGlobalFormData) {
    await createLancamento({
      obra_id: data.obra_id,
      tipo: data.tipo as TipoLancamento,
      categoria: data.categoria as CategoriaFinanceira,
      descricao: data.descricao,
      valor: Number(data.valor),
      data_vencimento: data.data_vencimento,
      data_pagamento: data.data_pagamento || undefined,
      status: data.status as StatusPagamento,
      nota_fiscal: data.nota_fiscal || undefined,
      observacao: data.observacao || undefined,
    });
    toast({ title: "Lançamento criado com sucesso" });
    await fetchData();
  }

  async function handleUpdate(data: LancamentoGlobalFormData) {
    if (!editingLanc) return;
    await updateLancamento(editingLanc.id, {
      obra_id: data.obra_id,
      tipo: data.tipo as TipoLancamento,
      categoria: data.categoria as CategoriaFinanceira,
      descricao: data.descricao,
      valor: Number(data.valor),
      data_vencimento: data.data_vencimento,
      data_pagamento: data.data_pagamento || null,
      status: data.status as StatusPagamento,
      nota_fiscal: data.nota_fiscal || null,
      observacao: data.observacao || null,
    });
    toast({ title: "Lançamento atualizado" });
    setEditingLanc(null);
    await fetchData();
  }

  async function handleDelete() {
    if (!deleteId || actionLoading) return;
    setActionLoading(deleteId);
    try {
      await deleteLancamento(deleteId);
      toast({ title: "Lançamento excluído" });
      await fetchData();
    } catch (err: any) {
      toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
      setDeleteId(null);
    }
  }

  async function handleMarcarPago() {
    if (!pagoId || actionLoading) return;
    setActionLoading(pagoId);
    try {
      const lanc = lancamentos.find((l) => l.id === pagoId);
      if (!lanc) return;
      if (lanc.status === "pago") {
        await updateLancamento(pagoId, { status: "pendente", data_pagamento: null });
        toast({ title: "Status alterado para pendente" });
      } else {
        await updateLancamento(pagoId, {
          status: "pago",
          data_pagamento: lanc.data_pagamento || todayISO(),
        });
        toast({ title: "Lançamento marcado como pago" });
      }
      await fetchData();
    } catch (err: any) {
      toast({ title: "Erro ao alterar status", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
      setPagoId(null);
    }
  }

  const statusLabel: Record<string, string> = { pendente: "Pendente", pago: "Pago", atrasado: "Atrasado", cancelado: "Cancelado" };
  const statusColor: Record<string, string> = { pendente: "text-zinc-600 bg-zinc-100", pago: "text-status-success bg-green-50", atrasado: "text-status-critical bg-red-50", cancelado: "text-zinc-400 bg-zinc-50" };
  const tipoColor: Record<string, string> = { receita: "text-status-success", despesa: "text-status-critical" };

  if (loading) return <PageLoading message="Carregando financeiro..." />;

  return (
    <div>
      <PageHeader title="Financeiro" description="Visão consolidada de todas as obras">
        <Button className="bg-brand-500 hover:bg-brand-600" onClick={() => { setEditingLanc(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Lançamento
        </Button>
      </PageHeader>

      <div className="mt-6"><FinanceiroResumo lancamentos={lancamentos} /></div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input placeholder="Buscar por descrição ou obra..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="receita">Receita</SelectItem>
            <SelectItem value="despesa">Despesa</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="atrasado">Atrasado</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      {filtered.length === 0 ? (
        <EmptyState icon={DollarSign} title="Nenhum lançamento encontrado" description="Crie um lançamento ou ajuste os filtros." className="mt-6" />
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Obra</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Descrição</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Tipo</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Categoria</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Valor</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Vencimento</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((lanc) => (
                  <tr key={lanc.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 text-zinc-600 text-xs">{obraMap.get(lanc.obra_id) || "—"}</td>
                    <td className="px-4 py-3 text-zinc-900">{lanc.descricao}</td>
                    <td className="px-4 py-3"><span className={`font-medium ${tipoColor[lanc.tipo]}`}>{lanc.tipo === "receita" ? "Receita" : "Despesa"}</span></td>
                    <td className="px-4 py-3 text-zinc-600 capitalize">{lanc.categoria.replace("_", " ")}</td>
                    <td className="px-4 py-3 text-right font-medium text-zinc-900">{formatCurrency(lanc.valor)}</td>
                    <td className="px-4 py-3 text-zinc-600">{formatDate(lanc.data_vencimento)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[lanc.status]}`}>
                        {statusLabel[lanc.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setPagoId(lanc.id)}
                          disabled={actionLoading === lanc.id}
                          title={lanc.status === "pago" ? "Voltar para pendente" : "Marcar como pago"}
                          className={`p-1 rounded transition-colors ${lanc.status === "pago" ? "text-status-success hover:bg-green-50" : "text-zinc-400 hover:text-status-success hover:bg-green-50"}`}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => { setEditingLanc(lanc); setFormOpen(true); }}
                          className="p-1 rounded text-zinc-400 hover:text-brand-500 hover:bg-brand-50 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(lanc.id)}
                          disabled={actionLoading === lanc.id}
                          className="p-1 rounded text-zinc-400 hover:text-status-critical hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <LancamentoFormGlobal
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingLanc(null); }}
        onSubmit={editingLanc ? handleUpdate : handleCreate}
        initialData={editingLanc}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null); }}
        title="Excluir lançamento"
        description="Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="danger"
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={!!pagoId}
        onOpenChange={(open) => { if (!open) setPagoId(null); }}
        title={lancamentos.find((l) => l.id === pagoId)?.status === "pago" ? "Voltar para pendente" : "Marcar como pago"}
        description={lancamentos.find((l) => l.id === pagoId)?.status === "pago" ? "O lançamento voltará ao status pendente e a data de pagamento será removida." : "O lançamento será marcado como pago. Se não houver data de pagamento, será preenchida com a data de hoje."}
        confirmLabel="Confirmar"
        variant="default"
        onConfirm={handleMarcarPago}
      />
    </div>
  );
}