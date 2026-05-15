import SetupForm from "@/components/auth/setup-form";

export const dynamic = "force-dynamic";

export default function SetupPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Configuração inicial</p>
        <h1>Criar o primeiro consultor</h1>
        <p className="hero-copy">
          Esta etapa cria o primeiro acesso administrativo da aplicação.
        </p>
        <SetupForm />
      </section>
    </main>
  );
}
