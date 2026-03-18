"use client";

import { LeadCard } from "@/components/leads/lead-card";
import { LEAD_STATUS_OPTIONS, LEAD_STATUS_COLOR } from "@/lib/constants";
import type { Lead } from "@/types";

interface LeadKanbanProps {
  leads: Lead[];
  onCardClick: (lead: Lead) => void;
}

export function LeadKanban({ leads, onCardClick }: LeadKanbanProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {LEAD_STATUS_OPTIONS.map((statusOpt) => {
        const columnLeads = leads.filter((l) => l.status === statusOpt.value);

        return (
          <div
            key={statusOpt.value}
            className="flex-shrink-0 w-[300px]"
          >
            {/* Column header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  LEAD_STATUS_COLOR[statusOpt.value] || "bg-zinc-100 text-zinc-600"
                }`}
              >
                {statusOpt.label}
              </span>
              <span className="text-xs text-zinc-400">
                {columnLeads.length}
              </span>
            </div>

            {/* Column cards */}
            <div className="space-y-3 min-h-[200px] bg-zinc-50/50 rounded-lg p-2">
              {columnLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onClick={onCardClick}
                />
              ))}
              {columnLeads.length === 0 && (
                <div className="flex items-center justify-center h-[100px] text-xs text-zinc-400">
                  Nenhum lead
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}