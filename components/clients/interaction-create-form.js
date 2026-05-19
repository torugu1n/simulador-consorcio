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
      setError(data.error || "Falha ao registrar interação.");
      setLoading(false);
      return;
    }

    window.location.reload();
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className={fieldLabel}>
          <span className={labelText}>Tipo</span>
          <select
            className={inputClass}
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value })}
          >
            <option value="follow_up">Follow-up</option>
            <option value="ligacao">Ligação</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="reuniao">Reunião</option>
          </select>
        </label>
        <label className={fieldLabel}>
          <span className={labelText}>Agendado para</span>
          <input
            className={inputClass}
            type="datetime-local"
            value={form.scheduledAt}
            onChange={(event) => setForm({ ...form, scheduledAt: event.target.value })}
          />
        </label>
      </div>
      <label className={fieldLabel}>
        <span className={labelText}>Assunto</span>
        <input
          className={inputClass}
          value={form.subject}
          onChange={(event) => setForm({ ...form, subject: event.target.value })}
        />
      </label>
      <label className={fieldLabel}>
        <span className={labelText}>Descrição</span>
        <textarea
          className={textareaClass}
          rows="4"
          value={form.notes}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
        />
      </label>
      {error ? <p className={dangerTextClass}>{error}</p> : null}
      <button className={primaryButtonClass} type="submit" disabled={loading}>
        {loading ? "Registrando..." : "Registrar acompanhamento"}
      </button>
    </form>
  );
}
