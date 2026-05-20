"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/common/logout-button";
import { useTheme } from "@/components/common/theme-provider";
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
    label: "Operação",
    items: [
      { href: "/dashboard/clients", label: "Clientes", icon: ClientsIcon },
      { href: "/dashboard/simulations", label: "Simulações", icon: SimulationIcon },
    ],
  },
];

const allNavItems = navGroups.flatMap((g) => g.items);

function SunIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ChevronLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function DashboardSidebar({ consultant, collapsed, onToggle }) {
  const pathname = usePathname();
  const { dark, toggle: toggleTheme } = useTheme();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={[
          "sticky top-0 hidden h-screen flex-col border-r border-[var(--color-border)] bg-[rgba(255,255,255,0.96)] backdrop-blur",
          "transition-all duration-300 dark:border-slate-700 dark:bg-slate-900/95 lg:flex",
          collapsed ? "p-2" : "p-3",
        ].join(" ")}
      >
        {/* Logo + collapse button */}
        <div className="relative flex min-h-[32px] items-center justify-center mb-4 mt-2">
          {!collapsed && (
            <div className="min-w-0 max-w-[180px]">
              <Image
                src="/logo.png"
                alt="Paxeco Contemplados & Investimentos"
                width={380}
                height={194}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
          )}
          <button
            onClick={onToggle}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
            className={[
              "grid h-8 w-8 shrink-0 place-items-center rounded-xl border transition z-10",
              !collapsed ? "absolute right-0" : "",
              "border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-primary)]",
              "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200",
            ].join(" ")}
          >
            {collapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Nav */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
          <div className="grid gap-4">
            {collapsed ? (
              <nav className="grid gap-1.5">
                {allNavItems.map((item) => (
                  <CollapsedLink key={item.href} item={item} pathname={pathname} />
                ))}
              </nav>
            ) : (
              <>
                <SidebarGroup label="Painel">
                  {navGroups[0].items.map((item) => (
                    <SidebarLink key={item.href} item={item} pathname={pathname} />
                  ))}
                </SidebarGroup>
                <SidebarGroup label="Operação">
                  {navGroups[1].items.map((item) => (
                    <SidebarLink key={item.href} item={item} pathname={pathname} />
                  ))}
                </SidebarGroup>
              </>
            )}
          </div>

          {/* Theme toggle */}
          <div className="mt-auto">
            <button
              onClick={toggleTheme}
              title={dark ? "Mudar para modo claro" : "Mudar para modo escuro"}
              className={[
                "flex w-full items-center gap-2.5 rounded-2xl border transition",
                "border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-primary)]",
                "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200",
                collapsed ? "justify-center px-0 py-2.5 h-10" : "px-3 py-2.5 text-sm font-medium",
              ].join(" ")}
            >
              {dark ? (
                <SunIcon className="h-4 w-4 shrink-0" />
              ) : (
                <MoonIcon className="h-4 w-4 shrink-0" />
              )}
              {!collapsed && (
                <span className="text-sm font-medium">{dark ? "Modo claro" : "Modo escuro"}</span>
              )}
            </button>
          </div>
        </div>

        {/* User card */}
        <div
          className={[
            "mt-4 rounded-[20px] border border-[var(--color-border)] bg-white p-3 shadow-[0_10px_30px_rgba(37,40,58,0.04)]",
            "dark:border-slate-700 dark:bg-slate-800",
            collapsed ? "flex justify-center" : "",
          ].join(" ")}
        >
          <div className={["flex items-center gap-2.5", collapsed ? "justify-center" : ""].join(" ")}>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#3e4095_0%,#00afef_100%)] text-sm font-semibold text-white">
              {consultant.name.slice(0, 1).toUpperCase()}
            </div>
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-sm font-semibold text-slate-950 dark:text-slate-100">
                    {consultant.name}
                  </strong>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    {consultant.role === "admin" ? "Administrador" : "Consultor"}
                  </span>
                </div>
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex border-t border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {allNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
                className={[
                  "flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold tracking-[0.06em] transition",
                isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)] dark:text-slate-500",
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-7 w-7 place-items-center rounded-xl transition",
                  isActive
                    ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)] dark:bg-indigo-900/40 dark:text-indigo-400"
                    : "text-[var(--color-text-muted)] dark:text-slate-500",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function CollapsedLink({ item, pathname }) {
  const Icon = item.icon;
  const isActive =
    pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

  return (
    <Link
      href={item.href}
      title={item.label}
      className={[
        "grid h-10 w-10 mx-auto place-items-center rounded-2xl border transition",
        isActive
          ? "border-[var(--color-accent)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] dark:border-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400"
          : "border-transparent text-[var(--color-text-muted)] hover:border-[var(--color-border)] hover:bg-white hover:text-[var(--color-primary)] dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
    </Link>
  );
}

function SidebarGroup({ label, children }) {
  return (
    <section className="grid gap-2.5 border-t border-[var(--color-border)] pt-3 first:border-t-0 first:pt-0 dark:border-slate-700">
      <p className="pl-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)] dark:text-slate-500">
        {label}
      </p>
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
          ? "border-[var(--color-accent)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] shadow-[inset_0_0_0_1px_rgba(0,175,239,0.12)] dark:border-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300"
          : "border-transparent text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-white hover:text-[var(--color-primary)] dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-8 w-8 place-items-center rounded-xl border transition",
          isActive
            ? "border-[var(--color-accent)] bg-white text-[var(--color-primary)] dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-400"
            : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] group-hover:border-[var(--color-accent)] group-hover:bg-white group-hover:text-[var(--color-primary)] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:group-hover:bg-slate-700 dark:group-hover:text-slate-300",
        ].join(" ")}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span>{item.label}</span>
    </Link>
  );
}
