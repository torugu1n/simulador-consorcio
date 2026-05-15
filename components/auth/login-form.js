"use client";

import { useState } from "react";
import {
  dangerTextClass,
  fieldLabel,
  inputClass,
  labelText,
  primaryButtonClass,
} from "@/lib/ui";

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
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <label className={fieldLabel}>
        <span className={labelText}>Email</span>
        <input
          className={inputClass}
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />
      </label>
      <label className={fieldLabel}>
        <span className={labelText}>Senha</span>
        <input
          className={inputClass}
          type="password"
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
        />
      </label>
      {error ? <p className={dangerTextClass}>{error}</p> : null}
      <button type="submit" className={primaryButtonClass} disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
