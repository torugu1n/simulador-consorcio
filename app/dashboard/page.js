import Link from "next/link";
import { requireConsultant } from "@/lib/auth";
import { getDashboardData } from "@/lib/app-data";
import { deserializeSimulationPayload } from "@/lib/simulation-records";
import { formatCurrency, formatDateTime } from "@/lib/simulator";
import {
  ActivityIcon,
  ClientsIcon,
  DashboardIcon,
  SimulationIcon,
} from "@/components/common/icons";
import {
  badgeClass,
  cardTitle,
  glassPanel,
  metricCard,
  mutedText,
  panelPadding,
  pageEyebrow,
  primaryButtonClass,
  secondaryButtonClass,
  rowCard,
  sectionStack,
} from "@/lib/ui";

export const dynamic = "force-dynamic";

const dashboardHeroPanel =
  "rounded-[32px] border border-[var(--color-border)] bg-[radial-gradient(circle_at_top_left,rgba(255,102,0,0.10),transparent_24%),radial-gradient(circle_at_top_right,rgba(0,175,239,0.08),transparent_18%),linear-gradient(180deg,#ffffff_0%,#f8f8f8_100%)] p-6 shadow-[0_24px_60px_rgba(37,40,58,0.08)] sm:p-7";

export default async function DashboardPage() {
  const consultant = await requireConsultant();
  const data = await getDashboardData(consultant.id);
  const conversionRate =
    data.clientCount > 0 ? Math.round((data.simulationCount / data.clientCount) * 100) : 0;

  return (
    <div className={sectionStack}>
      <section className={dashboardHeroPanel}>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_280px]">
          <div>
            <p className={pageEyebrow}>
              <DashboardIcon className="h-4 w-4" />
              Visão geral
            </p>
            <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-[-0.05em] text-[var(--color-text)] sm:text-4xl">
              Operação comercial e acompanhamento de clientes
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
              Centralize follow-ups, simulações e propostas geradas para cada cliente.
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--color-border)] bg-white/90 p-4 backdrop-blur-sm">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Consultor logado
            </span>
            <strong className="mt-3 block text-2xl font-semibold tracking-[-0.03em] text-[var(--color-primary)]">
              {consultant.name}
            </strong>
            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
              Painel pronto para registrar leads, avançar negociações e entregar proposta em PDF.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link className={primaryButtonClass} href="/dashboard/clients">
            Novo cliente
          </Link>
          <Link className={secondaryButtonClass} href="/dashboard/simulations">
            Ver simulações
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <article className="rounded-[22px] border border-[var(--color-border)] bg-white/90 p-4 text-[var(--color-text)]">
            <span className="text-sm text-[var(--color-text-muted)]">Ritmo comercial</span>
            <strong className="mt-2 block text-3xl font-semibold tracking-[-0.03em] text-[var(--color-primary)]">
              {conversionRate}%
            </strong>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              Relação entre clientes cadastrados e simulações geradas.
            </p>
          </article>
          <article className="rounded-[22px] border border-[var(--color-border)] bg-white/90 p-4 text-[var(--color-text)]">
            <span className="text-sm text-[var(--color-text-muted)]">Carteira ativa</span>
            <strong className="mt-2 block text-3xl font-semibold tracking-[-0.03em] text-[var(--color-accent)]">
              {data.pendingFollowUps}
            </strong>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              Follow-ups pendentes para manter a carteira aquecida.
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className={metricCard}>
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <ClientsIcon className="h-4 w-4" />
            Clientes
          </span>
          <strong className="mt-2 block text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            {data.clientCount}
          </strong>
        </article>
        <article className={metricCard}>
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <SimulationIcon className="h-4 w-4" />
            Simulações
          </span>
          <strong className="mt-2 block text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            {data.simulationCount}
          </strong>
        </article>
        <article className={metricCard}>
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <ActivityIcon className="h-4 w-4" />
            Follow-ups ativos
          </span>
          <strong className="mt-2 block text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            {data.pendingFollowUps}
          </strong>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <article className={`${glassPanel} ${panelPadding}`}>
          <div className="mb-5">
            <h2 className={cardTitle}>Clientes recentes</h2>
            <p className={mutedText}>Leads e clientes com entrada mais recente no pipeline comercial.</p>
          </div>
          <div className="grid gap-3">
            {data.recentClients.length === 0 ? (
              <p className={mutedText}>Nenhum cliente cadastrado ainda.</p>
            ) : (
              data.recentClients.map((client) => (
                <Link
                  key={client.id}
                  className={rowCard}
                  href={`/dashboard/clients/${client.id}`}
                >
                  <div className="min-w-0">
                    <strong className="block truncate text-base font-semibold text-slate-950">
                      {client.name}
                    </strong>
                    <p className="mt-1 text-sm text-slate-500">
                      {client.email || client.phone || "Sem contato principal."}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={badgeClass}>{client.status}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </article>

        <article className={`${glassPanel} ${panelPadding}`}>
          <div className="mb-5">
            <h2 className={cardTitle}>Simulações recentes</h2>
            <p className={mutedText}>Ultimas propostas geradas e prontas para envio ao cliente.</p>
          </div>
          <div className="grid gap-3">
            {data.recentSimulations.length === 0 ? (
              <p className={mutedText}>Nenhuma simulação salva ainda.</p>
            ) : (
              data.recentSimulations.map((simulation) => {
                const payload = deserializeSimulationPayload(simulation.payload);
                return (
                  <article key={simulation.id} className={rowCard}>
                    <div className="min-w-0">
                      <strong className="block truncate text-base font-semibold text-slate-950">
                        {simulation.title}
                      </strong>
                      <p className="mt-1 text-sm text-slate-500">
                        {simulation.client?.name || "Sem cliente vinculado"}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="block text-sm font-semibold text-slate-800">
                        {formatCurrency(payload.assetValue)}
                      </span>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatDateTime(simulation.createdAt)}
                      </p>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
