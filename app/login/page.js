import LoginForm from "@/components/auth/login-form";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  authBrandPanel,
  authCard,
  authFormPanel,
  authHeroCopy,
  authHeroTitle,
  eyebrow,
  featureCard,
  pageShell,
} from "@/lib/ui";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
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

  return (
    <main className={`${pageShell} grid min-h-screen place-items-center px-4 py-6`}>
      <section className={`w-full max-w-6xl ${authCard}`}>
        <div className={authBrandPanel}>
          <p className={eyebrow}>Acesso de consultores</p>
          <h1 className={authHeroTitle}>Entrar no painel comercial</h1>
          <p className={authHeroCopy}>
            Acompanhe clientes, simulacoes, follow-ups e gere propostas em PDF.
          </p>

          <div className="mt-8 grid gap-4">
            <article className={featureCard}>
              <strong className="block text-base font-semibold">CRM operacional</strong>
              <p className="mt-2 text-sm leading-6 text-slate-100/80">
                Controle de clientes, historico e proximas acoes em um unico painel.
              </p>
            </article>
            <article className={featureCard}>
              <strong className="block text-base font-semibold">Simulacao comercial</strong>
              <p className="mt-2 text-sm leading-6 text-slate-100/80">
                Monte a proposta e entregue um PDF mais apresentavel para o cliente.
              </p>
            </article>
          </div>
        </div>

        <div className={authFormPanel}>
          <div className="mb-8">
            <p className="text-sm font-medium text-slate-500">Entrar</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              Acesse sua operacao
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Use o email e a senha do consultor para continuar.
            </p>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
