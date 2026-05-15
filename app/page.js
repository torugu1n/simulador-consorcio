import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [consultantCount, session] = await Promise.all([
    prisma.consultant.count(),
    getSession(),
  ]);

  if (consultantCount === 0) {
    redirect("/setup");
  }

  if (session?.sub) {
    redirect("/dashboard");
  }

  redirect("/login");
}
