"use client";

import { useState } from "react";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Falha no login." }));
      setError(data.error || "Falha no login.");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
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
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
