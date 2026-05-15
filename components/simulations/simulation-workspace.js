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
import {
  badgeClass,
  dangerTextClass,
  fieldLabel,
  glassPanel,
  inputClass,
  labelText,
  metricCard,
  mutedText,
  panelPadding,
  primaryButtonClass,
  secondaryButtonClass,
  sectionTitle,
} from "@/lib/ui";
import {
  ActivityIcon,
  CalendarIcon,
  FileTextIcon,
  MoneyIcon,
} from "@/components/common/icons";

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
    <div className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className={`${glassPanel} p-6`}>
          <div className="mb-5 flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-600">
              <FileTextIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">
                Identificacao da proposta
              </h3>
              <p className={mutedText}>
                Esses campos alimentam o registro salvo e o titulo comercial exibido no PDF.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className={`${fieldLabel} md:col-span-2`}>
              <span className={labelText}>Titulo interno da simulacao</span>
              <input
                className={inputClass}
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
              />
            </label>
            <label className={`${fieldLabel} md:col-span-2`}>
              <span className={labelText}>Titulo comercial do PDF</span>
              <input
                className={inputClass}
                value={form.proposalTitle}
                onChange={(event) => updateField("proposalTitle", event.target.value)}
              />
            </label>
            <label className={fieldLabel}>
              <span className={labelText}>Cliente</span>
              <input
                className={`${inputClass} bg-slate-50 text-slate-500`}
                value={form.clientName}
                onChange={(event) => updateField("clientName", event.target.value)}
              />
            </label>
            <label className={fieldLabel}>
              <span className={labelText}>Consultor</span>
              <input
                className={inputClass}
                value={form.consultantName}
                onChange={(event) => updateField("consultantName", event.target.value)}
              />
            </label>
          </div>
        </section>

        <section className={`${glassPanel} p-6`}>
          <div className="mb-5 flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-600">
              <CalendarIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">
                Parametros financeiros
              </h3>
              <p className={mutedText}>
                Defina prazo, taxas e valores base que determinam o comportamento da proposta.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className={fieldLabel}>
              <span className={labelText}>Prazo</span>
              <input
                className={inputClass}
                type="number"
                value={form.term}
                onChange={(event) => updateField("term", event.target.value)}
              />
            </label>
            <label className={fieldLabel}>
              <span className={labelText}>Taxa de administracao (%)</span>
              <input
                className={inputClass}
                type="number"
                step="0.01"
                value={form.adminRate}
                onChange={(event) => updateField("adminRate", event.target.value)}
              />
            </label>
            <label className={fieldLabel}>
              <span className={labelText}>Seguro mensal (%)</span>
              <input
                className={inputClass}
                type="number"
                step="0.00001"
                value={form.insuranceMonthlyRate}
                onChange={(event) => updateField("insuranceMonthlyRate", event.target.value)}
              />
            </label>
            <div className="md:col-span-2 grid gap-4">
              <CurrencyField
                label="Valor do bem"
                value={form.assetValue}
                onChange={(value) => updateField("assetValue", value)}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <CurrencyField
                  label="Recursos proprios"
                  value={form.ownResources}
                  onChange={(value) => updateField("ownResources", value)}
                />
                <CurrencyField
                  label="Lance embutido"
                  value={form.embeddedBid}
                  onChange={(value) => updateField("embeddedBid", value)}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className={`${glassPanel} p-6`}>
        <div className="mb-5 flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-600">
            <MoneyIcon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">
              Resumo financeiro
            </h3>
            <p className={mutedText}>
              Leitura rapida dos numeros principais para validacao comercial imediata.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <article className={metricCard}>
            <span className="text-sm text-slate-500">Total do lance</span>
            <strong className="mt-2 block text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              {formatCurrency(simulation.metrics.totalBid)}
            </strong>
          </article>
          <article className={metricCard}>
            <span className="text-sm text-slate-500">% do lance</span>
            <strong className="mt-2 block text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              {formatPercent(simulation.metrics.bidPercent)}
            </strong>
          </article>
          <article className={metricCard}>
            <span className="text-sm text-slate-500">Parcela integral</span>
            <strong className="mt-2 block text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              {formatCurrency(simulation.metrics.fullInstallment)}
            </strong>
          </article>
          <article className={metricCard}>
            <span className="text-sm text-slate-500">Parcela reduzida</span>
            <strong className="mt-2 block text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              {formatCurrency(simulation.metrics.reducedInstallment)}
            </strong>
          </article>
        </div>
      </section>

      <section className={`${glassPanel} p-6`}>
        <div className="mb-5 flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-600">
            <ActivityIcon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">
              Cenarios projetados
            </h3>
            <p className={mutedText}>
              Compare os tres cenarios principais de contemplacao com foco em parcela e prazo.
            </p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {Object.values(simulation.scenarios).map((scenario) => (
            <article
              key={`${scenario.title}-${scenario.mode}`}
              className="rounded-[26px] border border-slate-200 bg-slate-50 p-6"
            >
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-500">
                Cenario
              </p>
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                {scenario.title}
              </h3>
              <span className={`mt-4 ${badgeClass}`}>{scenario.mode}</span>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="text-sm text-slate-500">Parcela</span>
                  <strong className="mt-2 block text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    {formatCurrency(scenario.installment)}
                  </strong>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Prazo restante</span>
                  <strong className="mt-2 block text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    {formatTerm(scenario.remainingTerm)}
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${glassPanel} ${panelPadding}`}>
        <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <h2 className={sectionTitle}>{report.cover.title}</h2>
            <p className={mutedText}>{report.cover.summary}</p>
          </div>
          <label className={fieldLabel}>
            <span className={labelText}>Observacoes do PDF</span>
            <textarea
              className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
            />
          </label>
        </div>
      </section>

      {error ? <p className={dangerTextClass}>{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button className={primaryButtonClass} type="button" disabled={loading} onClick={handleSave}>
          {loading ? "Processando..." : "Salvar simulacao"}
        </button>
        <button
          className={secondaryButtonClass}
          type="button"
          disabled={loading}
          onClick={handlePdf}
        >
          Baixar PDF
        </button>
      </div>
    </div>
  );
}

function CurrencyField({ label, value, onChange }) {
  return (
    <label className={fieldLabel}>
      <span className={labelText}>{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
        <span className="text-sm font-semibold text-slate-500">R$</span>
        <input
          className="w-full border-0 bg-transparent p-0 text-sm text-slate-900 outline-none"
          type="text"
          inputMode="decimal"
          value={formatCurrencyInput(value)}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </label>
  );
}
