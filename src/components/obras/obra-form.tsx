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
import { Loader2 } from "lucide-react";
import type { Obra } from "@/types";

interface ObraFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ObraFormData) => Promise<void>;
  initialData?: Obra | null;
}

export interface ObraFormData {
  nome: string;
  cliente: string;
  endereco: string;
  status: string;
  prioridade: string;
  responsavel: string;
  data_inicio: string;
  data_previsao: string;
  orcamento: string;
  descricao: string;
}

const emptyForm: ObraFormData = {
  nome: "",
  cliente: "",
  endereco: "",
  status: "planejamento",
  prioridade: "normal",
  responsavel: "",
  data_inicio: "",
  data_previsao: "",
  orcamento: "",
  descricao: "",
};

function obraToForm(obra: Obra): ObraFormData {
  return {
    nome: obra.nome,
    cliente: obra.cliente,
    endereco: obra.endereco,
    status: obra.status,
    prioridade: obra.prioridade,
    responsavel: obra.responsavel,
    data_inicio: obra.data_inicio,
    data_previsao: obra.data_previsao,
    orcamento: String(obra.orcamento ?? ""),
    descricao: obra.descricao || "",
  };
}

const STATUS_OPTIONS = [
  { value: "planejamento", label: "Planejamento" },
  { value: "em_andamento", label: "Em Andamento" },
  { value: "pausada", label: "Pausada" },
  { value: "concluida", label: "Concluída" },
  { value: "cancelada", label: "Cancelada" },
];

const PRIORIDADE_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "atencao", label: "Atenção" },
  { value: "critico", label: "Crítico" },
];

export function ObraForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: ObraFormProps) {
  const [form, setForm] = useState<ObraFormData>(
    initialData ? obraToForm(initialData) : emptyForm
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  useEffect(() => {
    if (open) {
      setForm(initialData ? obraToForm(initialData) : emptyForm);
      setError(null);
    }
  }, [open, initialData]);

  function handleChange(field: keyof ObraFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      !form.nome.trim() ||
      !form.cliente.trim() ||
      !form.endereco.trim() ||
      !form.responsavel.trim() ||
      !form.data_inicio ||
      !form.data_previsao
    ) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
      setForm(emptyForm);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar obra.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Obra" : "Nova Obra"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Obra *</Label>
              <Input
                id="nome"
                value={form.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                placeholder="Ex: Residencial Vila Nova"
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
            <Label htmlFor="endereco">Endereço *</Label>
            <Input
              id="endereco"
              value={form.endereco}
              onChange={(e) => handleChange("endereco", e.target.value)}
              placeholder="Rua, número, bairro"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável *</Label>
              <Input
                id="responsavel"
                value={form.responsavel}
                onChange={(e) => handleChange("responsavel", e.target.value)}
                placeholder="Nome do responsável"
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
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                value={form.prioridade}
                onValueChange={(v) => handleChange("prioridade", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORIDADE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio">Data Início *</Label>
              <Input
                id="data_inicio"
                type="date"
                value={form.data_inicio}
                onChange={(e) => handleChange("data_inicio", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_previsao">Previsão *</Label>
              <Input
                id="data_previsao"
                type="date"
                value={form.data_previsao}
                onChange={(e) => handleChange("data_previsao", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orcamento">Orçamento (R$)</Label>
              <Input
                id="orcamento"
                type="number"
                step="0.01"
                value={form.orcamento}
                onChange={(e) => handleChange("orcamento", e.target.value)}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={form.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
              placeholder="Detalhes da obra..."
              rows={3}
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
              {isEditing ? "Salvar" : "Criar Obra"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}