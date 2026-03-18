"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ObraFinanceiro } from "@/components/obras/obra-financeiro";
import { ObraForm, type ObraFormData } from "@/components/obras/obra-form";
import { getObraById, updateObra } from "@/lib/supabase/obras";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Edit,
  MapPin,
  User,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import type { Obra, ObraStatus, ObraPrioridade } from "@/types";

const prioridadeToStatus: Record<ObraPrioridade, "critico" | "atencao" | "normal"> = {
  critico: "critico",
  atencao: "atencao",
  normal: "normal",
};

export default function ObraDetalhePage() {
  const params = useParams();
  const [obra, setObra] = useState<Obra | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [progressoInput, setProgressoInput] = useState("");

  const fetchObra = useCallback(async () => {
    try {
      const data = await getObraById(params.id as string);
      setObra(data);
      setProgressoInput(String(data.progresso));
    } catch (err: any) {
      toast({
        title: "Erro ao carregar obra",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchObra();
  }, [fetchObra]);

  async function handleUpdate(data: ObraFormData) {
    if (!obra) return;
    await updateObra(obra.id, {
      nome: data.nome,
      cliente: data.cliente,
      endereco: data.endereco,
      status: data.status as ObraStatus,
      prioridade: data.prioridade as ObraPrioridade,
      responsavel: data.responsavel,
      data_inicio: data.data_inicio,
      data_previsao: data.data_previsao,
      orcamento: data.orcamento ? Number(data.orcamento) : 0,
      descricao: data.descricao || null,
    });
    toast({ title: "Obra atualizada com sucesso" });
    await fetchObra();
  }

  async function handleProgressoSave() {
    if (!obra) return;
    const value = Math.min(100, Math.max(0, Number(progressoInput) || 0));
    await updateObra(obra.id, { progresso: value });
    toast({ title: "Progresso atualizado" });
    await fetchObra();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!obra) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">Obra não encontrada.</p>
        <Link
          href="/obras"
          className="text-brand-500 hover:underline text-sm mt-2 inline-block"
        >
          Voltar para obras
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Voltar + Header */}
      <div className="mb-6">
        <Link
          href="/obras"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para obras
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-zinc-900">
                {obra.nome}
              </h1>
              <StatusBadge status={prioridadeToStatus[obra.prioridade]} />
            </div>
            <p className="text-sm text-zinc-500 mt-1">{obra.cliente}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-zinc-200 p-4">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <MapPin className="h-4 w-4" />
            <span className="text-xs font-medium">Endereço</span>
          </div>
          <p className="text-sm text-zinc-900">{obra.endereco}</p>
        </div>
        <div className="bg-white rounded-lg border border-zinc-200 p-4">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <User className="h-4 w-4" />
            <span className="text-xs font-medium">Responsável</span>
          </div>
          <p className="text-sm text-zinc-900">{obra.responsavel}</p>
        </div>
        <div className="bg-white rounded-lg border border-zinc-200 p-4">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium">Previsão</span>
          </div>
          <p className="text-sm text-zinc-900">
            {formatDate(obra.data_inicio)} — {formatDate(obra.data_previsao)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-zinc-200 p-4">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-xs font-medium">Orçamento</span>
          </div>
          <p className="text-sm text-zinc-900">
            {formatCurrency(obra.orcamento)}
          </p>
        </div>
      </div>

      {/* Progresso com input editável */}
      <div className="bg-white rounded-lg border border-zinc-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-zinc-900">
            Progresso da Obra
          </h3>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              max={100}
              value={progressoInput}
              onChange={(e) => setProgressoInput(e.target.value)}
              className="w-20 h-8 text-sm text-center"
            />
            <span className="text-sm text-zinc-500">%</span>
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={handleProgressoSave}
            >
              Salvar
            </Button>
          </div>
        </div>
        <ProgressBar value={obra.progresso} size="md" />
        <div className="flex justify-between mt-3 text-xs text-zinc-500">
          <span>Custo atual: {formatCurrency(obra.custo_atual)}</span>
          <span>Orçamento: {formatCurrency(obra.orcamento)}</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="financeiro" className="w-full">
        <TabsList>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="descricao">Descrição</TabsTrigger>
        </TabsList>

        <TabsContent value="financeiro">
          <ObraFinanceiro obraId={obra.id} />
        </TabsContent>

        <TabsContent value="descricao">
          <div className="bg-white rounded-lg border border-zinc-200 p-6 mt-4">
            <p className="text-sm text-zinc-700 leading-relaxed">
              {obra.descricao || "Sem descrição cadastrada."}
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog editar obra */}
      <ObraForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleUpdate}
        initialData={obra}
      />
    </div>
  );
}