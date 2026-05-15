"use client";

import { useState } from "react";

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
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="field-grid">
        <label className="field">
          <span>Nome</span>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </label>
        <label className="field">
          <span>Email</span>
          <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label className="field">
          <span>Telefone</span>
          <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        </label>
        <label className="field">
          <span>Documento</span>
          <input value={form.document} onChange={(event) => setForm({ ...form, document: event.target.value })} />
        </label>
        <label className="field">
          <span>Status</span>
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="lead">Lead</option>
            <option value="qualificado">Qualificado</option>
            <option value="proposta_enviada">Proposta enviada</option>
            <option value="negociacao">Negociacao</option>
            <option value="cliente">Cliente</option>
          </select>
        </label>
        <label className="field">
          <span>Proximo follow-up</span>
          <input
            type="datetime-local"
            value={form.nextFollowUpAt}
            onChange={(event) => setForm({ ...form, nextFollowUpAt: event.target.value })}
          />
        </label>
      </div>
      <label className="field">
        <span>Observacoes</span>
        <textarea rows="4" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar cliente"}
      </button>
    </form>
  );
}
