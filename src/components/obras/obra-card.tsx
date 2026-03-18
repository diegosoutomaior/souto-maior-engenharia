"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProgressBar } from "@/components/shared/progress-bar";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Calendar, MapPin, User } from "lucide-react";
import type { Obra, ObraPrioridade } from "@/types";

interface ObraCardProps {
  obra: Obra;
}

const prioridadeToStatus: Record<
  ObraPrioridade,
  "critico" | "atencao" | "normal"
> = {
  critico: "critico",
  atencao: "atencao",
  normal: "normal",
};

const statusLabels: Record<string, string> = {
  planejamento: "Planejamento",
  em_andamento: "Em andamento",
  pausada: "Pausada",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

export function ObraCard({ obra }: ObraCardProps) {
  const custoPercentual =
    obra.orcamento > 0
      ? Math.round((obra.custo_atual / obra.orcamento) * 100)
      : 0;

  return (
    <Link href={`/obras/${obra.id}`}>
      <div className="bg-white rounded-lg border border-zinc-200 p-5 hover:shadow-md hover:border-zinc-300 transition-all cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-zinc-900 truncate">
              {obra.nome}
            </h3>
            <p className="text-xs text-zinc-500 truncate">{obra.cliente}</p>
          </div>
          <StatusBadge status={prioridadeToStatus[obra.prioridade]} />
        </div>

        {/* Info */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{obra.endereco}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <User className="h-3 w-3 shrink-0" />
            <span>{obra.responsavel}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>Previsão: {formatDate(obra.data_previsao)}</span>
          </div>
        </div>

        {/* Progresso */}
        <ProgressBar value={obra.progresso} label="Progresso" size="sm" />

        {/* Financeiro */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
          <div>
            <p className="text-xs text-zinc-400">Orçamento</p>
            <p className="text-sm font-medium text-zinc-900">
              {formatCurrency(obra.orcamento)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-zinc-400">Gasto</p>
            <p className="text-sm font-medium text-zinc-700">
              {custoPercentual}%
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="mt-3">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
            {statusLabels[obra.status] || obra.status}
          </span>
        </div>
      </div>
    </Link>
  );
}