import { requireConsultant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDateTime, formatTerm } from "@/lib/simulator";

export const dynamic = "force-dynamic";

export default async function SimulationsPage() {
  const consultant = await requireConsultant();
  const simulations = await prisma.simulation.findMany({
    where: { consultantId: consultant.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="dashboard-stack">
      <section className="panel report-preview">
        <div className="panel-heading">
          <h2>Todas as simulacoes</h2>
          <p>{simulations.length} simulacao(oes) registradas.</p>
        </div>
        <div className="saved-list">
          {simulations.map((simulation) => (
            <article key={simulation.id} className="saved-card">
              <strong>{simulation.title}</strong>
              <span>{simulation.client?.name || "Sem cliente vinculado"}</span>
              <p>
                {formatCurrency(simulation.payload.assetValue)} ·{" "}
                {formatTerm(simulation.payload.term)} · {formatDateTime(simulation.createdAt)}
              </p>
              <a className="inline-link" href={`/api/simulations/${simulation.id}/pdf`}>
                Baixar PDF
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
