"use client";

import { useState } from "react";
import {
  dangerTextClass,
  fieldLabel,
  inputClass,
  labelText,
  primaryButtonClass,
  textareaClass,
} from "@/lib/ui";

export default function ClientCreateForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    status: "lead",
    notes: "",
    nextFollowUpAt: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Falha ao salvar cliente.");
      setLoading(false);
      return;
    }

    window.location.reload();
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
        <label className={fieldLabel}>
          <span className={labelText}>Nome</span>
          <input
            className={inputClass}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>
        <label className={fieldLabel}>
          <span className={labelText}>Email</span>
          <input
            className={inputClass}
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label className={fieldLabel}>
          <span className={labelText}>Telefone</span>
          <input
            className={inputClass}
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
        </label>
        <label className={fieldLabel}>
          <span className={labelText}>Documento</span>
          <input
            className={inputClass}
            value={form.document}
            onChange={(event) => setForm({ ...form, document: event.target.value })}
          />
        </label>
        <label className={fieldLabel}>
          <span className={labelText}>Status</span>
          <select
            className={inputClass}
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value })}
          >
            <option value="lead">Lead</option>
            <option value="qualificado">Qualificado</option>
            <option value="proposta_enviada">Proposta enviada</option>
            <option value="negociacao">Negociação</option>
            <option value="cliente">Cliente</option>
          </select>
        </label>
        <label className={fieldLabel}>
          <span className={labelText}>Próximo follow-up</span>
          <input
            className={inputClass}
            type="datetime-local"
            value={form.nextFollowUpAt}
            onChange={(event) => setForm({ ...form, nextFollowUpAt: event.target.value })}
          />
        </label>
      </div>
      <label className={fieldLabel}>
        <span className={labelText}>Observações</span>
        <textarea
          className={textareaClass}
          rows="4"
          value={form.notes}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
        />
      </label>
      {error ? <p className={dangerTextClass}>{error}</p> : null}
      <button className={primaryButtonClass} type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar cliente"}
      </button>
    </form>
  );
}
