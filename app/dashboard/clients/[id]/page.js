import { notFound } from "next/navigation";
import { requireConsultant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDateTime, formatTerm } from "@/lib/simulator";
import InteractionCreateForm from "@/components/clients/interaction-create-form";
import SimulationWorkspace from "@/components/simulations/simulation-workspace";

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
    <div className="dashboard-stack">
      <section className="hero-panel compact-hero">
        <div>
          <p className="eyebrow">Cliente</p>
          <h1>{client.name}</h1>
          <p className="hero-copy">
            {client.email || "Sem email"} · {client.phone || "Sem telefone"} · {client.status}
          </p>
        </div>
      </section>

      <section className="workspace-grid">
        <article className="panel input-panel">
          <div className="panel-heading">
            <h2>Acompanhamento</h2>
            <p>Registre contatos, proximas acoes e observacoes de venda.</p>
          </div>
          <InteractionCreateForm clientId={client.id} />

          <div className="saved-list top-gap">
            {client.interactions.map((interaction) => (
              <article key={interaction.id} className="saved-card">
                <strong>{interaction.subject}</strong>
                <span>{interaction.type}</span>
                <p>{interaction.notes}</p>
                <span>{formatDateTime(interaction.createdAt)}</span>
              </article>
            ))}
          </div>
        </article>

        <article className="panel saved-panel">
          <div className="panel-heading">
            <h2>Historico de simulacoes</h2>
            <p>{client.simulations.length} simulacao(oes) vinculada(s) a este cliente.</p>
          </div>
          <div className="saved-list">
            {client.simulations.length === 0 ? (
              <p className="empty-state">Nenhuma simulacao salva para este cliente.</p>
            ) : (
              client.simulations.map((simulation) => (
                <article key={simulation.id} className="saved-card">
                  <strong>{simulation.title}</strong>
                  <span>{formatDateTime(simulation.createdAt)}</span>
                  <p>
                    {formatCurrency(simulation.payload.assetValue)} ·{" "}
                    {formatTerm(simulation.payload.term)}
                  </p>
                  <a className="inline-link" href={`/api/simulations/${simulation.id}/pdf`}>
                    Baixar PDF
                  </a>
                </article>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="panel report-preview">
        <div className="panel-heading">
          <h2>Nova simulacao para {client.name}</h2>
          <p>Monte a proposta, salve no historico e gere PDF para o cliente.</p>
        </div>
        <SimulationWorkspace
          client={{
            id: client.id,
            name: client.name,
          }}
          consultantName={consultant.name}
        />
      </section>
    </div>
  );
}
