"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { SidebarContent } from "@/components/layout/sidebar";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  // Bloquear scroll do body quando aberto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="relative z-50 lg:hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-zinc-900/50 fade-in"
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div className="fixed inset-y-0 left-0 flex w-64 slide-in-left">
        <div className="relative flex w-64 flex-col bg-white shadow-xl">
          {/* Botão fechar */}
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <SidebarContent onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}