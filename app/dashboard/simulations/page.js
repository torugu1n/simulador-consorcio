import { requireConsultant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deserializeSimulationPayload } from "@/lib/simulation-records";
import { formatCurrency, formatDateTime, formatTerm } from "@/lib/simulator";
import SimulationWorkspace from "@/components/simulations/simulation-workspace";
import {
  badgeClass,
  cardTitle,
  glassPanel,
  mutedText,
  panelPadding,
  pageEyebrow,
  rowCard,
  sectionStack,
} from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SimulationsPage({ searchParams }) {
  const consultant = await requireConsultant();
  const selectedClientId = searchParams?.clientId || "";
  const simulations = await prisma.simulation.findMany({
    where: { consultantId: consultant.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });
  const clients = await prisma.client.findMany({
    where: { consultantId: consultant.id },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className={sectionStack}>
      <section className="rounded-[32px] border border-[var(--color-border)] bg-[radial-gradient(circle_at_top_left,rgba(62,64,149,0.08),transparent_22%),radial-gradient(circle_at_top_right,rgba(0,175,239,0.10),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f8f8f8_100%)] p-6 shadow-[0_24px_60px_rgba(37,40,58,0.07)] sm:p-7">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_280px]">
          <div>
            <p className={pageEyebrow}>Simulações comerciais</p>
            <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-[-0.05em] text-[var(--color-text)] sm:text-4xl">
              Monte cenários, valide números e entregue a proposta final
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
              Use a mesma base visual e comercial da operação para construir propostas com rapidez.
            </p>
          </div>
          <div className="rounded-[24px] border border-[var(--color-border)] bg-white/90 p-4">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Volume atual
            </span>
            <strong className="mt-3 block text-3xl font-semibold tracking-[-0.03em] text-[var(--color-primary)]">
              {simulations.length}
            </strong>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              simulação(ões) registradas para acompanhamento e geração de PDF.
            </p>
            <span className={`mt-3 ${badgeClass}`}>Ambiente pronto</span>
          </div>
        </div>
      </section>

      <SimulationWorkspace
        consultantName={consultant.name}
        clientOptions={clients}
        defaultClientId={selectedClientId}
      />

      <section className={`${glassPanel} ${panelPadding}`}>
        <div className="mb-5">
          <h2 className={cardTitle}>Todas as simulações</h2>
          <p className={mutedText}>{simulations.length} simulação(ões) registradas.</p>
        </div>
        <div className="grid gap-3">
          {simulations.length === 0 ? (
            <p className={mutedText}>Nenhuma simulação registrada ainda.</p>
          ) : (
            simulations.map((simulation) => {
              const payload = deserializeSimulationPayload(simulation.payload);
              return (
                <article key={simulation.id} className={rowCard}>
                  <div className="min-w-0">
                    <strong className="block text-base font-semibold text-slate-950">
                      {simulation.title}
                    </strong>
                    <p className="mt-1 text-sm text-slate-500">
                      {simulation.client?.name || "Sem cliente vinculado"} · {formatTerm(payload.term)}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="block text-sm font-semibold text-slate-800">
                      {formatCurrency(payload.assetValue)}
                    </span>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatDateTime(simulation.createdAt)}
                    </p>
                    <a
                      className="mt-2 inline-flex text-sm font-semibold text-[var(--color-warm)] hover:text-[var(--color-warm-strong)]"
                      href={`/api/simulations/${simulation.id}/pdf`}
                    >
                      Baixar PDF
                    </a>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
