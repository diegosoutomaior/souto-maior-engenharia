"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu, User, ChevronRight } from "lucide-react";

const routeNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/leads": "CRM / Leads",
  "/propostas": "Propostas",
  "/obras": "Obras",
  "/financeiro": "Financeiro",
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    // Chama o endpoint server-side que limpa cookies do Supabase
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      redirect: "manual",
    });

    // Redirecionar manualmente após limpeza
    router.push("/login");
    router.refresh();
  }

  // Breadcrumb
  const segments = pathname.split("/").filter(Boolean);
  const baseRoute = "/" + (segments[0] || "dashboard");
  const baseName = routeNames[baseRoute] || segments[0] || "Dashboard";
  const isSubpage = segments.length > 1;

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-4 border-b border-zinc-200 bg-white/95 backdrop-blur-sm px-6">
      {/* Mobile menu button */}
      <button
        type="button"
        className="lg:hidden -m-2 p-2 text-zinc-500 hover:text-zinc-900 transition-colors"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Separator mobile */}
      <div className="h-5 w-px bg-zinc-200 lg:hidden" />

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        <span className="font-medium text-zinc-900">{baseName}</span>
        {isSubpage && (
          <>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
            <span className="text-zinc-500">Detalhe</span>
          </>
        )}
      </div>

      {/* Spacer + User menu */}
      <div className="flex flex-1 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-zinc-50 transition-colors">
              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center">
                <User className="h-4 w-4 text-brand-600" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-zinc-700">
                Conta
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-zinc-500 font-normal">
              Minha conta
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-status-critical focus:text-status-critical cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair do sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}