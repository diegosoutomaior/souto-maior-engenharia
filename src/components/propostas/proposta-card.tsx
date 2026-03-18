"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import {
  PROPOSTA_STATUS_COLOR,
  PROPOSTA_STATUS_OPTIONS,
} from "@/lib/constants-propostas";
import { Calendar, FileText, User } from "lucide-react";
import type { Proposta } from "@/types";

interface PropostaCardProps {
  proposta: Proposta;
  onClick?: (proposta: Proposta) => void;
}

function getLabel(
  options: readonly { value: string; label: string }[],
  value: string
) {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function PropostaCard({ proposta, onClick }: PropostaCardProps) {
  const isExpiringSoon = (() => {
    const validade = new Date(proposta.data_validade);
    const hoje = new Date();
    const diffDays = Math.ceil(
      (validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
    );
    return (
      diffDays <= 7 &&
      diffDays > 0 &&
      !["aprovada", "rejeitada", "expirada"].includes(proposta.status)
    );
  })();

  return (
    <div
      onClick={() => onClick?.(proposta)}
      className={`bg-white rounded-lg border p-5 hover:shadow-md transition-all cursor-pointer ${
        isExpiringSoon ? "border-yellow-300" : "border-zinc-200 hover:border-zinc-300"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-zinc-900 truncate">
            {proposta.titulo}
          </h3>
          <p className="text-xs text-zinc-500 truncate">{proposta.cliente}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${
            PROPOSTA_STATUS_COLOR[proposta.status] || "bg-zinc-100 text-zinc-600"
          }`}
        >
          {getLabel(PROPOSTA_STATUS_OPTIONS, proposta.status)}
        </span>
      </div>

      {/* Valor destaque */}
      <div className="mb-4">
        <p className="text-lg font-semibold text-zinc-900">
          {formatCurrency(proposta.valor)}
        </p>
      </div>

      {/* Info */}
      <div className="space-y-1.5 mb-4">
        {proposta.data_envio && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <FileText className="h-3 w-3 shrink-0" />
            <span>Enviada em {formatDate(proposta.data_envio)}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Calendar className="h-3 w-3 shrink-0" />
          <span>
            Validade: {formatDate(proposta.data_validade)}
            {isExpiringSoon && (
              <span className="ml-1 text-status-warning font-medium">
                (vence em breve)
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Footer */}
      {proposta.condicoes_pagamento && (
        <div className="pt-3 border-t border-zinc-100">
          <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-0.5">
            Condições
          </p>
          <p className="text-xs text-zinc-600 truncate">
            {proposta.condicoes_pagamento}
          </p>
        </div>
      )}
    </div>
  );
}