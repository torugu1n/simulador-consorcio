import { requireConsultant } from "@/lib/auth";
import DashboardSidebar from "@/components/common/dashboard-sidebar";
import { contentCenter, contentShell, dashboardShell } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const consultant = await requireConsultant();

  return (
    <main className={dashboardShell}>
      <DashboardSidebar consultant={consultant} />

      <section className={contentShell}>
        <div className={contentCenter}>{children}</div>
      </section>
    </main>
  );
}
