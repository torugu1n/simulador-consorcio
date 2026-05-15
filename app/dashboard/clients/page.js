import { requireConsultant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ClientCreateForm from "@/components/clients/client-create-form";
import Link from "next/link";
import { ClientsIcon, FileTextIcon, UsersIcon } from "@/components/common/icons";
import {
  badgeClass,
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

export default async function ClientsPage() {
  const consultant = await requireConsultant();
  const clients = await prisma.client.findMany({
    where: { consultantId: consultant.id },
    orderBy: { createdAt: "desc" },
  });
  const qualifiedCount = clients.filter((client) => client.status !== "lead").length;
  const withContactCount = clients.filter((client) => client.email || client.phone).length;

  return (
    <div className={sectionStack}>
      <section className={`${glassPanel} ${panelPadding} grid gap-5 xl:grid-cols-[1.05fr_0.95fr]`}>
        <div>
          <p className={pageEyebrow}>
            <ClientsIcon className="h-4 w-4" />
            Clientes
          </p>
          <h1 className={pageTitle}>Carteira comercial e novas entradas</h1>
          <p className={heroCopy}>
            Cadastre novos contatos, mantenha o pipeline limpo e acompanhe a evolucao de cada negociacao.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
            <span className={`${statLabel} flex items-center gap-2`}>
              <UsersIcon className="h-4 w-4" />
              Total na base
            </span>
            <strong className={statValue}>{clients.length}</strong>
          </article>
          <article className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
            <span className={`${statLabel} flex items-center gap-2`}>
              <FileTextIcon className="h-4 w-4" />
              Com contato
            </span>
            <strong className={statValue}>{withContactCount}</strong>
          </article>
          <article className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
            <span className={`${statLabel} flex items-center gap-2`}>
              <ClientsIcon className="h-4 w-4" />
              Ja avancados
            </span>
            <strong className={statValue}>{qualifiedCount}</strong>
          </article>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <article className={`${glassPanel} ${panelPadding}`}>
          <div className="mb-5">
            <h2 className={cardTitle}>Novo cliente</h2>
            <p className={mutedText}>Cadastre leads e defina o proximo acompanhamento.</p>
          </div>
          <ClientCreateForm />
        </article>

        <article className={`${glassPanel} ${panelPadding}`}>
          <div className="mb-5">
            <h2 className={cardTitle}>Base de clientes</h2>
            <p className={mutedText}>{clients.length} cliente(s) cadastrados.</p>
          </div>
          <div className="grid gap-3">
            {clients.length === 0 ? (
              <p className={mutedText}>Nenhum cliente cadastrado ainda.</p>
            ) : (
              clients.map((client) => (
                <Link
                  key={client.id}
                  href={`/dashboard/clients/${client.id}`}
                  className={rowCard}
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
      </section>
    </div>
  );
}
