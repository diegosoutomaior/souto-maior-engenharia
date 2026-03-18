"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import {
  LEAD_STATUS_COLOR,
  LEAD_ORIGEM_COLOR,
  LEAD_STATUS_OPTIONS,
  LEAD_ORIGEM_OPTIONS,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Mail, Phone, Building2, Calendar, DollarSign, Edit, Trash2 } from "lucide-react";
import type { Lead } from "@/types";

interface LeadDetailProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

function getLabel(options: readonly { value: string; label: string }[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function LeadDetail({
  lead,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: LeadDetailProps) {
  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-lg">{lead.nome}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                LEAD_STATUS_COLOR[lead.status] || "bg-zinc-100 text-zinc-600"
              }`}
            >
              {getLabel(LEAD_STATUS_OPTIONS, lead.status)}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                LEAD_ORIGEM_COLOR[lead.origem] || "bg-zinc-50 text-zinc-500"
              }`}
            >
              {getLabel(LEAD_ORIGEM_OPTIONS, lead.origem)}
            </span>
          </div>

          {/* Info */}
          <div className="space-y-3 bg-zinc-50 rounded-lg p-4">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
              <span className="text-zinc-900">{lead.telefone}</span>
            </div>
            {lead.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                <span className="text-zinc-900">{lead.email}</span>
              </div>
            )}
            {lead.empresa && (
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-4 w-4 text-zinc-400 shrink-0" />
                <span className="text-zinc-900">{lead.empresa}</span>
              </div>
            )}
            {lead.valor_estimado && (
              <div className="flex items-center gap-3 text-sm">
                <DollarSign className="h-4 w-4 text-zinc-400 shrink-0" />
                <span className="text-zinc-900">
                  {formatCurrency(lead.valor_estimado)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
              <span className="text-zinc-500">
                Criado em {formatDate(lead.created_at)}
              </span>
            </div>
          </div>

          {/* Notas */}
          {lead.notas && (
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1">Notas</p>
              <p className="text-sm text-zinc-700 bg-white border border-zinc-200 rounded-md p-3 leading-relaxed">
                {lead.notas}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-status-critical hover:text-status-critical hover:bg-red-50"
            onClick={() => {
              onDelete(lead.id);
              onOpenChange(false);
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
          <Button
            size="sm"
            className="bg-brand-500 hover:bg-brand-600"
            onClick={() => {
              onEdit(lead);
              onOpenChange(false);
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}