import Link from "next/link";
import {
  authBrandPanel,
  authCard,
  authFormPanel,
  authHeroCopy,
  authHeroTitle,
  eyebrow,
  pageShell,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/lib/ui";

export default function NotFoundPage() {
  return (
    <main className={`${pageShell} grid min-h-screen place-items-center px-4 py-6`}>
      <section className={`w-full max-w-6xl ${authCard}`}>
        <div className={authBrandPanel}>
          <p className={eyebrow}>Pagina nao encontrada</p>
          <h1 className={authHeroTitle}>O conteudo solicitado nao esta disponivel.</h1>
          <p className={authHeroCopy}>
            Volte para a area comercial e continue o atendimento a partir do painel principal.
          </p>
        </div>

        <div className={authFormPanel}>
          <div className="grid gap-5">
            <p className="text-sm leading-6 text-slate-500">
              O link pode estar invalido, expirado ou o registro nao pertence a este consultor.
            </p>
            <Link className={primaryButtonClass} href="/dashboard">
              Ir para o dashboard
            </Link>
            <Link className={secondaryButtonClass} href="/login">
              Voltar ao login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
