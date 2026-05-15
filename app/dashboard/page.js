import Link from "next/link";
import { requireConsultant } from "@/lib/auth";
import { getDashboardData } from "@/lib/app-data";
import { formatCurrency, formatDateTime } from "@/lib/simulator";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const consultant = await requireConsultant();
  const data = await getDashboardData(consultant.id);

  return (
    <div className="dashboard-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Visao geral</p>
          <h1>Operacao comercial e acompanhamento de clientes</h1>
          <p className="hero-copy">
            Centralize follow-ups, simulacoes e propostas geradas para cada cliente.
          </p>
        </div>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <span>Clientes</span>
          <strong>{data.clientCount}</strong>
        </article>
        <article className="metric-card">
          <span>Simulacoes</span>
          <strong>{data.simulationCount}</strong>
        </article>
        <article className="metric-card">
          <span>Follow-ups ativos</span>
          <strong>{data.pendingFollowUps}</strong>
        </article>
      </section>

      <section className="workspace-grid">
        <article className="panel input-panel">
          <div className="panel-heading">
            <h2>Clientes recentes</h2>
            <p>Leads e clientes cadastrados mais recentemente.</p>
          </div>
          <div className="saved-list">
            {data.recentClients.length === 0 ? (
              <p className="empty-state">Nenhum cliente cadastrado ainda.</p>
            ) : (
              data.recentClients.map((client) => (
                <Link key={client.id} className="saved-card link-card" href={`/dashboard/clients/${client.id}`}>
                  <strong>{client.name}</strong>
                  <span>{client.status}</span>
                  <p>{client.email || client.phone || "Sem contato principal."}</p>
                </Link>
              ))
            )}
          </div>
        </article>

        <article className="panel saved-panel">
          <div className="panel-heading">
            <h2>Simulacoes recentes</h2>
            <p>Ultimas propostas geradas no ambiente.</p>
          </div>
          <div className="saved-list">
            {data.recentSimulations.length === 0 ? (
              <p className="empty-state">Nenhuma simulacao salva ainda.</p>
            ) : (
              data.recentSimulations.map((simulation) => (
                <article key={simulation.id} className="saved-card">
                  <strong>{simulation.title}</strong>
                  <span>{simulation.client?.name || "Sem cliente vinculado"}</span>
                  <p>
                    {formatCurrency(simulation.payload.assetValue)} · {formatDateTime(simulation.createdAt)}
                  </p>
                </article>
              ))
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
