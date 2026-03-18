"use client";

import { useState, useEffect, useCallback } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  getLancamentosByObra,
  createLancamento,
  updateLancamento,
  deleteLancamento,
} from "@/lib/supabase/lancamentos";
import { LancamentoForm, type LancamentoFormData } from "@/components/obras/lancamento-form";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageLoading } from "@/components/shared/page-loading";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, CheckCircle, DollarSign } from "lucide-react";
import type {
  Lancamento,
  TipoLancamento,
  CategoriaFinanceira,
  StatusPagamento,
} from "@/types";

interface ObraFinanceiroProps {
  obraId: string;
}

const statusLabel: Record<StatusPagamento, string> = {
  pendente: "Pendente",
  pago: "Pago",
  atrasado: "Atrasado",
  cancelado: "Cancelado",
};

const statusColor: Record<StatusPagamento, string> = {
  pendente: "text-zinc-600 bg-zinc-100",
  pago: "text-status-success bg-green-50",
  atrasado: "text-status-critical bg-red-50",
  cancelado: "text-zinc-400 bg-zinc-50",
};

const tipoColor: Record<TipoLancamento, string> = {
  receita: "text-status-success",
  despesa: "text-status-critical",
};

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function ObraFinanceiro({ obraId }: ObraFinanceiroProps) {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Form
  const [formOpen, setFormOpen] = useState(false);
  const [editingLanc, setEditingLanc] = useState<Lancamento | null>(null);

  // Confirm delete
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Confirm marcar como pago
  const [pagoId, setPagoId] = useState<string | null>(null);

  const fetchLancamentos = useCallback(async () => {
    try {
      const data = await getLancamentosByObra(obraId);
      setLancamentos(data);
    } catch (err: any) {
      toast({ title: "Erro ao carregar lançamentos", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [obraId]);

  useEffect(() => {
    fetchLancamentos();
  }, [fetchLancamentos]);

  async function handleCreate(data: LancamentoFormData) {
    await createLancamento({
      obra_id: obraId,
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
    await fetchLancamentos();
  }

  async function handleUpdate(data: LancamentoFormData) {
    if (!editingLanc) return;
    await updateLancamento(editingLanc.id, {
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
    await fetchLancamentos();
  }

  async function handleDelete() {
    if (!deleteId || actionLoading) return;
    setActionLoading(deleteId);
    try {
      await deleteLancamento(deleteId);
      toast({ title: "Lançamento excluído" });
      await fetchLancamentos();
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
        // Voltar para pendente: limpar data_pagamento
        await updateLancamento(pagoId, { status: "pendente", data_pagamento: null });
        toast({ title: "Status alterado para pendente" });
      } else {
        // Marcar como pago: preencher data_pagamento se vazio
        await updateLancamento(pagoId, {
          status: "pago",
          data_pagamento: lanc.data_pagamento || todayISO(),
        });
        toast({ title: "Lançamento marcado como pago" });
      }
      await fetchLancamentos();
    } catch (err: any) {
      toast({ title: "Erro ao alterar status", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
      setPagoId(null);
    }
  }

  function openEdit(lanc: Lancamento) {
    setEditingLanc(lanc);
    setFormOpen(true);
  }

  function openNew() {
    setEditingLanc(null);
    setFormOpen(true);
  }

  const totalReceita = lancamentos
    .filter((l) => l.tipo === "receita")
    .reduce((acc, l) => acc + l.valor, 0);
  const totalDespesa = lancamentos
    .filter((l) => l.tipo === "despesa")
    .reduce((acc, l) => acc + l.valor, 0);
  const saldo = totalReceita - totalDespesa;

  if (loading) return <PageLoading message="Carregando lançamentos..." className="h-32" />;

  return (
    <div className="mt-4 space-y-4">
      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-green-200 p-4">
          <p className="text-xs font-medium text-zinc-500">Total Receitas</p>
          <p className="text-lg font-bold text-status-success mt-1">{formatCurrency(totalReceita)}</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4">
          <p className="text-xs font-medium text-zinc-500">Total Despesas</p>
          <p className="text-lg font-bold text-status-critical mt-1">{formatCurrency(totalDespesa)}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-xs font-medium text-zinc-500">Saldo</p>
          <p className={`text-lg font-bold mt-1 ${saldo >= 0 ? "text-status-success" : "text-status-critical"}`}>
            {formatCurrency(saldo)}
          </p>
        </div>
      </div>

      {/* Botão novo */}
      <div className="flex justify-end">
        <Button size="sm" className="bg-brand-500 hover:bg-brand-600" onClick={openNew}>
          <Plus className="h-4 w-4 mr-1" />
          Novo Lançamento
        </Button>
      </div>

      {/* Tabela ou empty state */}
      {lancamentos.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="Nenhum lançamento"
          description="Crie o primeiro lançamento financeiro desta obra."
        />
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
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
                {lancamentos.map((lanc) => (
                  <tr key={lanc.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 text-zinc-900">{lanc.descricao}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${tipoColor[lanc.tipo]}`}>
                        {lanc.tipo === "receita" ? "Receita" : "Despesa"}
                      </span>
                    </td>
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
                          className={`p-1 rounded transition-colors ${
                            lanc.status === "pago"
                              ? "text-status-success hover:bg-green-50"
                              : "text-zinc-400 hover:text-status-success hover:bg-green-50"
                          }`}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEdit(lanc)}
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

      {/* Form criar/editar */}
      <LancamentoForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingLanc(null);
        }}
        onSubmit={editingLanc ? handleUpdate : handleCreate}
        initialData={editingLanc}
      />

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null); }}
        title="Excluir lançamento"
        description="Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="danger"
        onConfirm={handleDelete}
      />

      {/* Confirm marcar pago / voltar pendente */}
      <ConfirmDialog
        open={!!pagoId}
        onOpenChange={(open) => { if (!open) setPagoId(null); }}
        title={
          lancamentos.find((l) => l.id === pagoId)?.status === "pago"
            ? "Voltar para pendente"
            : "Marcar como pago"
        }
        description={
          lancamentos.find((l) => l.id === pagoId)?.status === "pago"
            ? "O lançamento voltará ao status pendente e a data de pagamento será removida."
            : "O lançamento será marcado como pago. Se não houver data de pagamento, será preenchida com a data de hoje."
        }
        confirmLabel="Confirmar"
        variant="default"
        onConfirm={handleMarcarPago}
      />
    </div>
  );
}