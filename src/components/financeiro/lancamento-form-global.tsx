"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getObras } from "@/lib/supabase/obras";
import { Loader2 } from "lucide-react";
import type { Obra, Lancamento } from "@/types";

interface LancamentoFormGlobalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LancamentoGlobalFormData) => Promise<void>;
  initialData?: Lancamento | null;
  initialObraName?: string;
}

export interface LancamentoGlobalFormData {
  obra_id: string;
  tipo: string;
  categoria: string;
  descricao: string;
  valor: string;
  data_vencimento: string;
  data_pagamento: string;
  status: string;
  nota_fiscal: string;
  observacao: string;
}

const emptyForm: LancamentoGlobalFormData = {
  obra_id: "",
  tipo: "despesa",
  categoria: "material",
  descricao: "",
  valor: "",
  data_vencimento: "",
  data_pagamento: "",
  status: "pendente",
  nota_fiscal: "",
  observacao: "",
};

function lancamentoToForm(l: Lancamento): LancamentoGlobalFormData {
  return {
    obra_id: l.obra_id,
    tipo: l.tipo,
    categoria: l.categoria,
    descricao: l.descricao,
    valor: String(l.valor),
    data_vencimento: l.data_vencimento,
    data_pagamento: l.data_pagamento || "",
    status: l.status,
    nota_fiscal: l.nota_fiscal || "",
    observacao: l.observacao || "",
  };
}

const TIPO_OPTIONS = [
  { value: "receita", label: "Receita" },
  { value: "despesa", label: "Despesa" },
];

const CATEGORIA_OPTIONS = [
  { value: "material", label: "Material" },
  { value: "mao_de_obra", label: "Mão de Obra" },
  { value: "equipamento", label: "Equipamento" },
  { value: "servico_terceiro", label: "Serviço Terceiro" },
  { value: "imposto", label: "Imposto" },
  { value: "medicao", label: "Medição" },
  { value: "adiantamento", label: "Adiantamento" },
  { value: "outros", label: "Outros" },
];

const STATUS_OPTIONS = [
  { value: "pendente", label: "Pendente" },
  { value: "pago", label: "Pago" },
  { value: "atrasado", label: "Atrasado" },
  { value: "cancelado", label: "Cancelado" },
];

export function LancamentoFormGlobal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  initialObraName,
}: LancamentoFormGlobalProps) {
  const [form, setForm] = useState<LancamentoGlobalFormData>(emptyForm);
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  useEffect(() => {
    if (open) {
      setForm(initialData ? lancamentoToForm(initialData) : emptyForm);
      setError(null);
      getObras().then(setObras).catch(() => {});
    }
  }, [open, initialData]);

  function handleChange(field: keyof LancamentoGlobalFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);

    if (!form.obra_id) {
      setError("Selecione a obra vinculada ao lançamento.");
      return;
    }
    if (!form.descricao.trim() || !form.valor || !form.data_vencimento) {
      setError("Obra, descrição, valor e vencimento são obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
      setForm(emptyForm);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar lançamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Lançamento" : "Novo Lançamento"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Obra *</Label>
            <Select value={form.obra_id} onValueChange={(v) => handleChange("obra_id", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a obra..." />
              </SelectTrigger>
              <SelectContent>
                {obras.map((obra) => (
                  <SelectItem key={obra.id} value={obra.id}>
                    {obra.nome} — {obra.cliente}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo *</Label>
              <Select value={form.tipo} onValueChange={(v) => handleChange("tipo", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPO_OPTIONS.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select value={form.categoria} onValueChange={(v) => handleChange("categoria", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIA_OPTIONS.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gf_desc">Descrição *</Label>
            <Input id="gf_desc" value={form.descricao} onChange={(e) => handleChange("descricao", e.target.value)} placeholder="Ex: Cimento e agregados" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gf_valor">Valor (R$) *</Label>
              <Input id="gf_valor" type="number" step="0.01" value={form.valor} onChange={(e) => handleChange("valor", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gf_venc">Vencimento *</Label>
              <Input id="gf_venc" type="date" value={form.data_vencimento} onChange={(e) => handleChange("data_vencimento", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gf_pgto">Data Pagamento</Label>
              <Input id="gf_pgto" type="date" value={form.data_pagamento} onChange={(e) => handleChange("data_pagamento", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gf_nf">Nota Fiscal</Label>
              <Input id="gf_nf" value={form.nota_fiscal} onChange={(e) => handleChange("nota_fiscal", e.target.value)} placeholder="NF-2024-XXXX" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gf_obs">Observação</Label>
            <Textarea id="gf_obs" value={form.observacao} onChange={(e) => handleChange("observacao", e.target.value)} rows={2} />
          </div>

          {error && (
            <div className="text-sm text-status-critical bg-red-50 border border-red-200 rounded-md p-3">{error}</div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-brand-500 hover:bg-brand-600" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar" : "Criar Lançamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}