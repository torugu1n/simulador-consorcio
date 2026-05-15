"use client";

import { useState } from "react";
import {
  DEFAULT_VALUES,
  buildClientReport,
  calculateSimulation,
  formatCurrency,
  formatCurrencyInput,
  formatPercent,
  formatTerm,
  parseCurrencyInput,
} from "@/lib/simulator";

const CURRENCY_FIELDS = new Set(["assetValue", "ownResources", "embeddedBid"]);

export default function SimulationWorkspace({ client, consultantName }) {
  const [form, setForm] = useState({
    ...DEFAULT_VALUES,
    clientId: client.id,
    clientName: client.name,
    consultantName,
    title: `Simulacao ${client.name}`,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const simulation = calculateSimulation(form);
  const report = buildClientReport(form);

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: CURRENCY_FIELDS.has(name) ? parseCurrencyInput(value) : value,
    }));
  }

  async function handleSave() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/simulations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Falha ao salvar simulacao.");
      setLoading(false);
      return;
    }

    window.location.reload();
  }

  async function handlePdf() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/simulations/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Falha ao gerar PDF." }));
      setError(data.error || "Falha ao gerar PDF.");
      setLoading(false);
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${client.name.replace(/\s+/g, "-").toLowerCase()}-simulacao.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setLoading(false);
  }

  return (
    <div className="dashboard-stack">
      <div className="field-grid">
        <label className="field">
          <span>Titulo</span>
          <input value={form.title} onChange={(event) => updateField("title", event.target.value)} />
        </label>
        <label className="field">
          <span>Prazo</span>
          <input type="number" value={form.term} onChange={(event) => updateField("term", event.target.value)} />
        </label>
        <label className="field">
          <span>Taxa de administracao (%)</span>
          <input
            type="number"
            step="0.01"
            value={form.adminRate}
            onChange={(event) => updateField("adminRate", event.target.value)}
          />
        </label>
        <label className="field">
          <span>Seguro mensal (%)</span>
          <input
            type="number"
            step="0.00001"
            value={form.insuranceMonthlyRate}
            onChange={(event) => updateField("insuranceMonthlyRate", event.target.value)}
          />
        </label>
        <CurrencyField label="Valor do bem" value={form.assetValue} onChange={(value) => updateField("assetValue", value)} />
        <CurrencyField label="Recursos proprios" value={form.ownResources} onChange={(value) => updateField("ownResources", value)} />
        <CurrencyField label="Lance embutido" value={form.embeddedBid} onChange={(value) => updateField("embeddedBid", value)} />
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <span>Total do lance</span>
          <strong>{formatCurrency(simulation.metrics.totalBid)}</strong>
        </article>
        <article className="metric-card">
          <span>% do lance</span>
          <strong>{formatPercent(simulation.metrics.bidPercent)}</strong>
        </article>
        <article className="metric-card">
          <span>Parcela integral</span>
          <strong>{formatCurrency(simulation.metrics.fullInstallment)}</strong>
        </article>
        <article className="metric-card">
          <span>Parcela reduzida</span>
          <strong>{formatCurrency(simulation.metrics.reducedInstallment)}</strong>
        </article>
      </div>

      <div className="scenario-grid">
        {Object.values(simulation.scenarios).map((scenario) => (
          <article className="scenario-card" key={`${scenario.title}-${scenario.mode}`}>
            <p className="eyebrow">Cenario</p>
            <h3>{scenario.title}</h3>
            <span className="scenario-tag">{scenario.mode}</span>
            <div className="scenario-values">
              <div>
                <span>Parcela</span>
                <strong>{formatCurrency(scenario.installment)}</strong>
              </div>
              <div>
                <span>Prazo restante</span>
                <strong>{formatTerm(scenario.remainingTerm)}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="report-sheet">
        <div className="panel-heading">
          <h2>{report.cover.title}</h2>
          <p>{report.cover.summary}</p>
        </div>
      </div>

      {error ? <p className="form-error">{error}</p> : null}
      <div className="hero-actions">
        <button className="primary-button" type="button" disabled={loading} onClick={handleSave}>
          {loading ? "Processando..." : "Salvar simulacao"}
        </button>
        <button className="secondary-button" type="button" disabled={loading} onClick={handlePdf}>
          Baixar PDF
        </button>
      </div>
    </div>
  );
}

function CurrencyField({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="currency-input">
        <span className="currency-prefix">R$</span>
        <input type="text" inputMode="decimal" value={formatCurrencyInput(value)} onChange={(event) => onChange(event.target.value)} />
      </div>
    </label>
  );
}
