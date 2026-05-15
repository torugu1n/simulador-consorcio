"use client";

import { useState } from "react";

export default function SetupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Falha na configuracao." }));
      setError(data.error || "Falha na configuracao.");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Nome</span>
        <input
          type="text"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        />
      </label>
      <label className="field">
        <span>Email</span>
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />
      </label>
      <label className="field">
        <span>Senha</span>
        <input
          type="password"
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
        />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? "Criando..." : "Criar acesso"}
      </button>
    </form>
  );
}
