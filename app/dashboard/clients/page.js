import { requireConsultant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ClientCreateForm from "@/components/clients/client-create-form";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const consultant = await requireConsultant();
  const clients = await prisma.client.findMany({
    where: { consultantId: consultant.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="dashboard-stack">
      <section className="workspace-grid">
        <article className="panel input-panel">
          <div className="panel-heading">
            <h2>Novo cliente</h2>
            <p>Cadastre leads e defina o proximo acompanhamento.</p>
          </div>
          <ClientCreateForm />
        </article>

        <article className="panel saved-panel">
          <div className="panel-heading">
            <h2>Base de clientes</h2>
            <p>{clients.length} cliente(s) cadastrados.</p>
          </div>
          <div className="saved-list">
            {clients.map((client) => (
              <Link key={client.id} href={`/dashboard/clients/${client.id}`} className="saved-card link-card">
                <strong>{client.name}</strong>
                <span>{client.status}</span>
                <p>{client.email || client.phone || "Sem contato principal."}</p>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
