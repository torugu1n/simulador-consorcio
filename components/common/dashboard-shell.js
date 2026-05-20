"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/common/dashboard-sidebar";
import { contentShell, contentCenter } from "@/lib/ui";

export default function DashboardShell({ consultant, children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={[
        "grid min-h-screen transition-[grid-template-columns] duration-300",
        collapsed ? "lg:grid-cols-[72px_1fr]" : "lg:grid-cols-[280px_1fr]",
      ].join(" ")}
    >
      <DashboardSidebar
        consultant={consultant}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <section className={contentShell}>
        <div className={contentCenter}>{children}</div>
      </section>
    </div>
  );
}
