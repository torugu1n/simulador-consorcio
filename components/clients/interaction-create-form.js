"use client";

import { useState } from "react";

export default function InteractionCreateForm({ clientId }) {
  const [form, setForm] = useState({
    clientId,
    type: "follow_up",
    subject: "",
    notes: "",
    scheduledAt: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Falha ao registrar interacao.");
      setLoading(false);
      return;
    }

    window.location.reload();
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="field-grid two-columns">
        <label className="field">
          <span>Tipo</span>
          <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
            <option value="follow_up">Follow-up</option>
            <option value="ligacao">Ligacao</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="reuniao">Reuniao</option>
          </select>
        </label>
        <label className="field">
          <span>Agendado para</span>
          <input
            type="datetime-local"
            value={form.scheduledAt}
            onChange={(event) => setForm({ ...form, scheduledAt: event.target.value })}
          />
        </label>
      </div>
      <label className="field">
        <span>Assunto</span>
        <input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} />
      </label>
      <label className="field">
        <span>Descricao</span>
        <textarea rows="4" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? "Registrando..." : "Registrar acompanhamento"}
      </button>
    </form>
  );
}
