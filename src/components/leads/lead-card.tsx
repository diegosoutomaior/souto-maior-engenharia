"use client";

import { formatCurrency } from "@/lib/utils";
import { LEAD_STATUS_COLOR, LEAD_ORIGEM_COLOR, LEAD_STATUS_OPTIONS, LEAD_ORIGEM_OPTIONS } from "@/lib/constants";
import { Mail, Phone, Building2, Calendar } from "lucide-react";
import type { Lead } from "@/types";

interface LeadCardProps {
  lead: Lead;
  onClick?: (lead: Lead) => void;
}

function getLabel(options: readonly { value: string; label: string }[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  return (
    <div
      onClick={() => onClick?.(lead)}
      className="bg-white rounded-lg border border-zinc-200 p-5 hover:shadow-md hover:border-zinc-300 transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-zinc-900 truncate">
            {lead.nome}
          </h3>
          {lead.empresa && (
            <p className="text-xs text-zinc-500 truncate">{lead.empresa}</p>
          )}
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${
            LEAD_STATUS_COLOR[lead.status] || "bg-zinc-100 text-zinc-600"
          }`}
        >
          {getLabel(LEAD_STATUS_OPTIONS, lead.status)}
        </span>
      </div>

      {/* Contato */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Phone className="h-3 w-3 shrink-0" />
          <span>{lead.telefone}</span>
        </div>
        {lead.email && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
            LEAD_ORIGEM_COLOR[lead.origem] || "bg-zinc-50 text-zinc-500"
          }`}
        >
          {getLabel(LEAD_ORIGEM_OPTIONS, lead.origem)}
        </span>
        {lead.valor_estimado && (
          <span className="text-xs font-medium text-zinc-700">
            {formatCurrency(lead.valor_estimado)}
          </span>
        )}
      </div>
    </div>
  );
}