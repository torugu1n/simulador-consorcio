import Link from "next/link";
import { requireConsultant } from "@/lib/auth";
import LogoutButton from "@/components/common/logout-button";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const consultant = await requireConsultant();

  return (
    <main className="crm-shell">
      <aside className="crm-sidebar">
        <div className="sidebar-block">
          <p className="eyebrow">Painel comercial</p>
          <h2 className="sidebar-title">Consorcio CRM</h2>
          <p className="sidebar-copy">{consultant.name}</p>
        </div>

        <div className="sidebar-stack">
          <nav className="sidebar-nav">
            <Link href="/dashboard">Visao geral</Link>
            <Link href="/dashboard/clients">Clientes</Link>
            <Link href="/dashboard/simulations">Simulacoes</Link>
          </nav>

          <div className="sidebar-support">
            <p className="sidebar-section-label">Operacao</p>
            <p className="sidebar-section-copy">
              Cadastre clientes, acompanhe follow-ups e gere propostas.
            </p>
          </div>
        </div>

        <div className="sidebar-footer">
          <LogoutButton />
        </div>
      </aside>

      <section className="crm-content">
        <div className="crm-content-center">{children}</div>
      </section>
    </main>
  );
}
