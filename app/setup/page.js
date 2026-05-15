import SetupForm from "@/components/auth/setup-form";
import { getCurrentConsultant } from "@/lib/auth";
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

export default async function SetupPage() {
  const [consultantCount, consultant] = await Promise.all([
    prisma.consultant.count(),
    getCurrentConsultant(),
  ]);

  if (consultantCount > 0) {
    redirect(consultant ? "/dashboard" : "/login");
  }

  return (
    <main className={`${pageShell} grid min-h-screen place-items-center px-4 py-6`}>
      <section className={`w-full max-w-6xl ${authCard}`}>
        <div className={authBrandPanel}>
          <p className={eyebrow}>Configuracao inicial</p>
          <h1 className={authHeroTitle}>Criar o primeiro consultor</h1>
          <p className={authHeroCopy}>
            Esta etapa cria o primeiro acesso administrativo da aplicacao.
          </p>

          <div className="mt-8 grid gap-4">
            <article className={featureCard}>
              <strong className="block text-base font-semibold">Primeiro acesso</strong>
              <p className="mt-2 text-sm leading-6 text-slate-100/80">
                Defina o usuario responsavel pela operacao comercial inicial do sistema.
              </p>
            </article>
            <article className={featureCard}>
              <strong className="block text-base font-semibold">Ambiente pronto</strong>
              <p className="mt-2 text-sm leading-6 text-slate-100/80">
                Depois do cadastro, o painel ja fica liberado para clientes, follow-ups e simulacoes.
              </p>
            </article>
          </div>
        </div>

        <div className={authFormPanel}>
          <div className="mb-8">
            <p className="text-sm font-medium text-slate-500">Setup</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              Inicie a operacao
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Crie o usuario administrador inicial para liberar o restante do fluxo.
            </p>
          </div>
          <SetupForm />
        </div>
      </section>
    </main>
  );
}
