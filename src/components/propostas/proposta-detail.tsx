"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import {
  PROPOSTA_STATUS_COLOR,
  PROPOSTA_STATUS_OPTIONS,
} from "@/lib/constants-propostas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Calendar,
  DollarSign,
  FileText,
  User,
  Edit,
  Trash2,
  Link as LinkIcon,
} from "lucide-react";
import type { Proposta } from "@/types";

interface PropostaDetailProps {
  proposta: Proposta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (proposta: Proposta) => void;
  onDelete: (id: string) => void;
}

function getLabel(
  options: readonly { value: string; label: string }[],
  value: string
) {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function PropostaDetail({
  proposta,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: PropostaDetailProps) {
  if (!proposta) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{proposta.titulo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status + Valor */}
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                PROPOSTA_STATUS_COLOR[proposta.status] ||
                "bg-zinc-100 text-zinc-600"
              }`}
            >
              {getLabel(PROPOSTA_STATUS_OPTIONS, proposta.status)}
            </span>
            <p className="text-xl font-semibold text-zinc-900">
              {formatCurrency(proposta.valor)}
            </p>
          </div>

          {/* Info */}
          <div className="space-y-3 bg-zinc-50 rounded-lg p-4">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-zinc-400 shrink-0" />
              <span className="text-zinc-900">{proposta.cliente}</span>
            </div>
            {proposta.data_envio && (
              <div className="flex items-center gap-3 text-sm">
                <FileText className="h-4 w-4 text-zinc-400 shrink-0" />
                <span className="text-zinc-700">
                  Enviada em {formatDate(proposta.data_envio)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
              <span className="text-zinc-700">
                Validade: {formatDate(proposta.data_validade)}
              </span>
            </div>
            {proposta.condicoes_pagamento && (
              <div className="flex items-center gap-3 text-sm">
                <DollarSign className="h-4 w-4 text-zinc-400 shrink-0" />
                <span className="text-zinc-700">
                  {proposta.condicoes_pagamento}
                </span>
              </div>
            )}
            {proposta.lead_id && (
              <div className="flex items-center gap-3 text-sm">
                <LinkIcon className="h-4 w-4 text-zinc-400 shrink-0" />
                <span className="text-zinc-500 text-xs">
                  Lead vinculado: {proposta.lead_id.slice(0, 8)}...
                </span>
              </div>
            )}
          </div>

          {/* Descrição do serviço */}
          <div>
            <p className="text-xs font-medium text-zinc-500 mb-1">
              Descrição do Serviço
            </p>
            <p className="text-sm text-zinc-700 bg-white border border-zinc-200 rounded-md p-3 leading-relaxed">
              {proposta.descricao_servico}
            </p>
          </div>

          {/* Observação */}
          {proposta.observacao && (
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1">
                Observação
              </p>
              <p className="text-sm text-zinc-700 bg-white border border-zinc-200 rounded-md p-3 leading-relaxed">
                {proposta.observacao}
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
              onDelete(proposta.id);
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
              onEdit(proposta);
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