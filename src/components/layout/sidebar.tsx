"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  HardHat,
  DollarSign,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "CRM / Leads",
    href: "/leads",
    icon: Users,
  },
  {
    name: "Propostas",
    href: "/propostas",
    icon: FileText,
  },
  {
    name: "Obras",
    href: "/obras",
    icon: HardHat,
  },
  {
    name: "Financeiro",
    href: "/financeiro",
    icon: DollarSign,
  },
];

interface SidebarContentProps {
  onNavigate?: () => void;
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex grow flex-col gap-y-6 overflow-y-auto bg-white px-5 pb-4">
      {/* Branding */}
      <div className="flex h-16 shrink-0 items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-brand-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">SM</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-zinc-900 tracking-brand uppercase">
            Souto Maior
          </span>
          <span className="text-[10px] font-medium text-zinc-400 tracking-widest uppercase">
            Engenharia
          </span>
        </div>
      </div>

      {/* Divisor */}
      <div className="h-px bg-zinc-100" />

      {/* Navegação */}
      <nav className="flex flex-1 flex-col">
        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-3">
          Menu
        </p>
        <ul role="list" className="flex flex-1 flex-col gap-y-0.5">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group flex gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-brand-500 text-white shadow-sm"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-zinc-400 group-hover:text-zinc-600"
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer da sidebar */}
      <div className="h-px bg-zinc-100" />
      <div className="px-3 pb-2">
        <p className="text-[10px] text-zinc-300 tracking-brand uppercase">
          Souto Maior © 2024
        </p>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col border-r border-zinc-200">
      <SidebarContent />
    </aside>
  );
}