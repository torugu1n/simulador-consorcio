import LoginForm from "@/components/auth/login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Acesso de consultores</p>
        <h1>Entrar no painel comercial</h1>
        <p className="hero-copy">
          Acompanhe clientes, simulações, follow-ups e gere propostas em PDF.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
