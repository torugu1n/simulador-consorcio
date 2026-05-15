import { requireConsultant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deserializeSimulationPayload } from "@/lib/simulation-records";
import { formatCurrency, formatDateTime, formatTerm } from "@/lib/simulator";
import {
  ClientsIcon,
  FileTextIcon,
  SimulationIcon,
} from "@/components/common/icons";
import {
  cardTitle,
  glassPanel,
  heroCopy,
  mutedText,
  pageEyebrow,
  pageTitle,
  panelPadding,
  rowCard,
  sectionStack,
  statLabel,
  statValue,
} from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SimulationsPage() {
  const consultant = await requireConsultant();
  const simulations = await prisma.simulation.findMany({
    where: { consultantId: consultant.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });
  const linkedCount = simulations.filter((simulation) => simulation.clientId).length;

  return (
    <div className={sectionStack}>
      <section className={`${glassPanel} ${panelPadding} grid gap-5 xl:grid-cols-[1.05fr_0.95fr]`}>
        <div>
          <p className={pageEyebrow}>
            <SimulationIcon className="h-4 w-4" />
            Simulacoes
          </p>
          <h1 className={pageTitle}>Propostas salvas e prontas para envio</h1>
          <p className={heroCopy}>
            Consulte o historico comercial, revise valores e baixe o PDF final para compartilhar com o cliente.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
            <span className={`${statLabel} flex items-center gap-2`}>
              <FileTextIcon className="h-4 w-4" />
              Total salvo
            </span>
            <strong className={statValue}>{simulations.length}</strong>
          </article>
          <article className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
            <span className={`${statLabel} flex items-center gap-2`}>
              <ClientsIcon className="h-4 w-4" />
              Com cliente
            </span>
            <strong className={statValue}>{linkedCount}</strong>
          </article>
        </div>
      </section>

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
                      className="mt-2 inline-flex text-sm font-semibold text-orange-600 hover:text-orange-700"
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
