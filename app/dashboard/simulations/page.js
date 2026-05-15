import { requireConsultant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deserializeSimulationPayload } from "@/lib/simulation-records";
import { formatCurrency, formatDateTime, formatTerm } from "@/lib/simulator";
import SimulationWorkspace from "@/components/simulations/simulation-workspace";
import {
  cardTitle,
  glassPanel,
  mutedText,
  panelPadding,
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
      <SimulationWorkspace
        consultantName={consultant.name}
        clientOptions={clients}
        defaultClientId={selectedClientId}
      />

      <section className={`${glassPanel} ${panelPadding}`}>
        <div className="mb-5">
          <h2 className={cardTitle}>Todas as simulacoes</h2>
          <p className={mutedText}>{simulations.length} simulacao(oes) registradas.</p>
        </div>
        <div className="grid gap-3">
          {simulations.length === 0 ? (
            <p className={mutedText}>Nenhuma simulacao registrada ainda.</p>
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
                      className="mt-2 inline-flex text-sm font-semibold text-amber-600 hover:text-amber-700"
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
