import { requireConsultant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/simulator";
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
import { UsersIcon } from "@/components/common/icons";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const consultant = await requireConsultant();

  if (consultant.role !== "admin") {
    redirect("/dashboard");
  }

  const users = await prisma.consultant.findMany({
    orderBy: { createdAt: "asc" },
  });

  const adminCount = users.filter((user) => user.role === "admin").length;

  return (
    <div className={sectionStack}>
      <section className={`${glassPanel} ${panelPadding} grid gap-5 xl:grid-cols-[1.05fr_0.95fr]`}>
        <div>
          <p className={pageEyebrow}>
            <UsersIcon className="h-4 w-4" />
            Usuarios
          </p>
          <h1 className={pageTitle}>Contas criadas na aplicacao</h1>
          <p className={heroCopy}>
            Visualize quem possui acesso ao painel comercial e acompanhe o perfil de cada consultor cadastrado.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <span className={statLabel}>Total de usuarios</span>
            <strong className={statValue}>{users.length}</strong>
          </article>
          <article className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <span className={statLabel}>Administradores</span>
            <strong className={statValue}>{adminCount}</strong>
          </article>
        </div>
      </section>

      <section className={`${glassPanel} ${panelPadding}`}>
        <div className="mb-5">
          <h2 className={cardTitle}>Lista de acessos</h2>
          <p className={mutedText}>{users.length} usuario(s) cadastrados no sistema.</p>
        </div>
        <div className="grid gap-3">
          {users.map((user) => (
            <article key={user.id} className={rowCard}>
              <div className="flex min-w-0 items-center gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[linear-gradient(135deg,#3e4095_0%,#00afef_100%)] text-sm font-semibold text-white">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <strong className="block truncate text-base font-semibold text-[var(--color-text)]">
                    {user.name}
                  </strong>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">{user.email}</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="inline-flex rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                  {user.role === "admin" ? "Administrador" : "Consultor"}
                </span>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Criado em {formatDateTime(user.createdAt)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
