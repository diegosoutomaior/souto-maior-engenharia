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
import { PROPOSTA_STATUS_OPTIONS } from "@/lib/constants-propostas";
import { getLeads } from "@/lib/supabase/leads";
import { Loader2 } from "lucide-react";
import type { Lead, Proposta } from "@/types";

interface PropostaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PropostaFormData) => Promise<void>;
  initialData?: Proposta | null;
}

export interface PropostaFormData {
  lead_id: string;
  titulo: string;
  cliente: string;
  descricao_servico: string;
  valor: string;
  status: string;
  data_envio: string;
  data_validade: string;
  condicoes_pagamento: string;
  observacao: string;
}

const emptyForm: PropostaFormData = {
  lead_id: "",
  titulo: "",
  cliente: "",
  descricao_servico: "",
  valor: "",
  status: "rascunho",
  data_envio: "",
  data_validade: "",
  condicoes_pagamento: "",
  observacao: "",
};

function propostaToForm(p: Proposta): PropostaFormData {
  return {
    lead_id: p.lead_id || "",
    titulo: p.titulo,
    cliente: p.cliente,
    descricao_servico: p.descricao_servico,
    valor: String(p.valor),
    status: p.status,
    data_envio: p.data_envio || "",
    data_validade: p.data_validade,
    condicoes_pagamento: p.condicoes_pagamento || "",
    observacao: p.observacao || "",
  };
}

export function PropostaForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: PropostaFormProps) {
  const [form, setForm] = useState<PropostaFormData>(
    initialData ? propostaToForm(initialData) : emptyForm
  );
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  useEffect(() => {
    if (open) {
      setForm(initialData ? propostaToForm(initialData) : emptyForm);
      getLeads()
        .then(setLeads)
        .catch(() => {});
    }
  }, [open, initialData]);

  function handleChange(field: keyof PropostaFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleLeadSelect(leadId: string) {
    const finalLeadId = leadId === "none" ? "" : leadId;
    handleChange("lead_id", finalLeadId);

    const lead = leads.find((l) => l.id === finalLeadId);
    if (lead && !form.cliente) {
      handleChange("cliente", lead.empresa || lead.nome);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      !form.titulo.trim() ||
      !form.cliente.trim() ||
      !form.valor ||
      !form.data_validade
    ) {
      setError("Título, cliente, valor e data de validade são obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
      setForm(emptyForm);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar proposta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Proposta" : "Nova Proposta"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Lead vinculado (opcional)</Label>
            <Select
              value={form.lead_id || "none"}
              onValueChange={handleLeadSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um lead..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {leads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.nome}
                    {lead.empresa ? ` — ${lead.empresa}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={form.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                placeholder="Ex: Reforma Comercial"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente *</Label>
              <Input
                id="cliente"
                value={form.cliente}
                onChange={(e) => handleChange("cliente", e.target.value)}
                placeholder="Nome do cliente"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao_servico">Descrição do Serviço *</Label>
            <Textarea
              id="descricao_servico"
              value={form.descricao_servico}
              onChange={(e) =>
                handleChange("descricao_servico", e.target.value)
              }
              placeholder="Descreva o escopo do serviço..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={form.valor}
                onChange={(e) => handleChange("valor", e.target.value)}
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => handleChange("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPOSTA_STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_validade">Validade *</Label>
              <Input
                id="data_validade"
                type="date"
                value={form.data_validade}
                onChange={(e) =>
                  handleChange("data_validade", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_envio">Data de Envio</Label>
              <Input
                id="data_envio"
                type="date"
                value={form.data_envio}
                onChange={(e) => handleChange("data_envio", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condicoes_pagamento">
                Condições de Pagamento
              </Label>
              <Input
                id="condicoes_pagamento"
                value={form.condicoes_pagamento}
                onChange={(e) =>
                  handleChange("condicoes_pagamento", e.target.value)
                }
                placeholder="Ex: 30% entrada + 7 medições"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              value={form.observacao}
              onChange={(e) => handleChange("observacao", e.target.value)}
              placeholder="Notas internas..."
              rows={2}
            />
          </div>

          {error && (
            <div className="text-sm text-status-critical bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-brand-500 hover:bg-brand-600"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar" : "Criar Proposta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}