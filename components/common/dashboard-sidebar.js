"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/common/logout-button";
import { badgeClass } from "@/lib/ui";
import {
  ClientsIcon,
  DashboardIcon,
  SimulationIcon,
} from "@/components/common/icons";

const navGroups = [
  {
    label: "Painel",
    items: [{ href: "/dashboard", label: "Dashboard", icon: DashboardIcon }],
  },
  {
    label: "Operacao",
    items: [
      { href: "/dashboard/clients", label: "Clientes", icon: ClientsIcon },
      { href: "/dashboard/simulations", label: "Simulacoes", icon: SimulationIcon },
    ],
  },
];

export default function DashboardSidebar({ consultant }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen flex-col border-r border-slate-200 bg-slate-50/95 px-3 py-4 backdrop-blur lg:px-4">
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="grid gap-4">
          <SidebarGroup label="Painel">
            {navGroups[0].items.map((item) => (
              <SidebarLink key={item.href} item={item} pathname={pathname} />
            ))}
          </SidebarGroup>
          <SidebarGroup label="Operacao">
            {navGroups[1].items.map((item) => (
              <SidebarLink key={item.href} item={item} pathname={pathname} />
            ))}
          </SidebarGroup>
        </div>

        <div className="mt-auto rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Ambiente
          </p>
          <p className="mt-2 text-sm leading-5 text-slate-500">
            Estrutura pronta para atendimento, simulacao e entrega de PDF comercial.
          </p>
          <div className="mt-3">
            <span className={badgeClass}>Ativo</span>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[24px] border border-slate-200 bg-white p-3.5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#4f46e5_0%,#6d28d9_100%)] text-sm font-semibold text-white">
            {consultant.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <strong className="block truncate text-sm font-semibold text-slate-950">
              {consultant.name}
            </strong>
            <span className="block text-xs text-slate-500">
              {consultant.role === "admin" ? "Administrador" : "Consultor"}
            </span>
          </div>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

function SidebarGroup({ label, children }) {
  return (
    <section className="grid gap-2.5 border-t border-slate-200 pt-3 first:border-t-0 first:pt-0">
      <p className="pl-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <nav className="grid gap-1.5">{children}</nav>
    </section>
  );
}

function SidebarLink({ item, pathname }) {
  const Icon = item.icon;
  const isActive =
    pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

  return (
    <Link
      href={item.href}
      className={[
        "group flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-sm font-medium transition",
        isActive
          ? "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.08)]"
          : "border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-8 w-8 place-items-center rounded-xl border transition",
          isActive
            ? "border-indigo-200 bg-white text-indigo-600"
            : "border-slate-200 bg-slate-50 text-slate-400 group-hover:border-slate-300 group-hover:bg-white group-hover:text-slate-600",
        ].join(" ")}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span>{item.label}</span>
    </Link>
  );
}
