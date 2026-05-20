import { requireConsultant } from "@/lib/auth";
import DashboardShell from "@/components/common/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const consultant = await requireConsultant();

  return (
    <DashboardShell consultant={consultant}>
      {children}
    </DashboardShell>
  );
}
