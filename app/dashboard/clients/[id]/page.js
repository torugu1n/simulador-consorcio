import { notFound } from "next/navigation";
import { requireConsultant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deserializeSimulationPayload } from "@/lib/simulation-records";
import { formatCurrency, formatDateTime, formatTerm } from "@/lib/simulator";
import InteractionCreateForm from "@/components/clients/interaction-create-form";
import {
  ActivityIcon,
  ClientsIcon,
  FileTextIcon,
  SimulationIcon,
} from "@/components/common/icons";
import {
  badgeClass,
  cardTitle,
  glassPanel,
  heroPanel,
  mutedText,
  pageEyebrow,
  panelPadding,
  rowCard,
  sectionStack,
} from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }) {
  const consultant = await requireConsultant();
  const client = await prisma.client.findFirst({
    where: {
      id: params.id,
      consultantId: consultant.id,
    },
    include: {
      interactions: {
        orderBy: { createdAt: "desc" },
      },
      simulations: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) {
    notFound();
  }

  return (
    <div className={sectionStack}>
      <section className={heroPanel}>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_280px]">
          <div>
            <p className={pageEyebrow}>
              <ClientsIcon className="h-4 w-4" />
              Cliente
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
              {client.name}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-100/82">
              {client.email || "Sem email"} · {client.phone || "Sem telefone"} · {client.status}
            </p>
          </div>
          <div className="rounded-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-200/80">
              Resumo da conta
            </span>
            <strong className="mt-3 block text-2xl font-semibold tracking-[-0.03em] text-white">
              {client.simulations.length} simulação(ões)
            </strong>
            <p className="mt-3 text-sm leading-6 text-slate-100/80">
              {client.interactions.length} registro(s) de contato neste cadastro.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <article className={`${glassPanel} ${panelPadding}`}>
          <div className="mb-5 flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-600">
              <ActivityIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className={cardTitle}>Acompanhamento</h2>
              <p className={mutedText}>Registre contatos, próximas ações e observações de venda.</p>
            </div>
          </div>
          <InteractionCreateForm clientId={client.id} />

          <div className="mt-6 grid gap-3">
            {client.interactions.length === 0 ? (
              <p className={mutedText}>Nenhum acompanhamento registrado ainda.</p>
            ) : (
              client.interactions.map((interaction) => (
                <article key={interaction.id} className={rowCard}>
                  <div className="min-w-0">
                    <strong className="block text-base font-semibold text-slate-950">
                      {interaction.subject}
                    </strong>
                    <p className="mt-1 text-sm text-slate-500">{interaction.notes}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className={badgeClass}>{interaction.type}</span>
                    <p className="mt-2 text-sm text-slate-500">
                      {formatDateTime(interaction.createdAt)}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>

        <article className={`${glassPanel} ${panelPadding}`}>
          <div className="mb-5 flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-600">
              <FileTextIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className={cardTitle}>Histórico de simulações</h2>
              <p className={mutedText}>
                {client.simulations.length} simulação(ões) vinculada(s) a este cliente.
              </p>
            </div>
          </div>
          <a
            href={`/dashboard/simulations?clientId=${client.id}`}
            className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-accent)] hover:bg-[var(--color-primary-soft)]"
          >
            <SimulationIcon className="h-4 w-4" />
            Nova simulação no módulo
          </a>
          <div className="grid gap-3">
            {client.simulations.length === 0 ? (
              <p className={mutedText}>Nenhuma simulação salva para este cliente.</p>
            ) : (
              client.simulations.map((simulation) => {
                const payload = deserializeSimulationPayload(simulation.payload);
                return (
                  <article key={simulation.id} className={rowCard}>
                    <div className="min-w-0">
                      <strong className="block text-base font-semibold text-slate-950">
                        {simulation.title}
                      </strong>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatCurrency(payload.assetValue)} · {formatTerm(payload.term)}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="block text-sm text-slate-500">
                        {formatDateTime(simulation.createdAt)}
                      </span>
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
        </article>
      </section>
    </div>
  );
}
