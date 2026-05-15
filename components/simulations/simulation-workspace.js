"use client";

import { useMemo, useState } from "react";
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
  selectClass,
} from "@/lib/ui";
import {
  ActivityIcon,
  CalendarIcon,
  FileTextIcon,
  MoneyIcon,
} from "@/components/common/icons";

const CURRENCY_FIELDS = new Set(["assetValue", "ownResources", "embeddedBid"]);

function buildInitialState({ client, consultantName, defaultClientId, clientOptions }) {
  const selectedClient =
    client ||
    clientOptions.find((option) => option.id === defaultClientId) ||
    null;

  return {
    ...DEFAULT_VALUES,
    clientId: selectedClient?.id || "",
    clientName: selectedClient?.name || "",
    consultantName,
    title: selectedClient?.name ? `Simulacao ${selectedClient.name}` : "Simulacao geral",
  };
}

export default function SimulationWorkspace({
  client = null,
  consultantName,
  clientOptions = [],
  defaultClientId = "",
}) {
  const [form, setForm] = useState(() =>
    buildInitialState({ client, consultantName, defaultClientId, clientOptions }),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const simulation = calculateSimulation(form);
  const report = buildClientReport(form);
  const selectedClient = useMemo(
    () => clientOptions.find((option) => option.id === form.clientId) || null,
    [clientOptions, form.clientId],
  );

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: CURRENCY_FIELDS.has(name) ? parseCurrencyInput(value) : value,
    }));
  }

  function updateEmbeddedBidState(enabled) {
    setForm((current) => ({
      ...current,
      includeEmbeddedBid: enabled,
      embeddedBid: enabled ? current.embeddedBid : 0,
    }));
  }

  function handleClientChange(clientId) {
    const nextClient = clientOptions.find((option) => option.id === clientId) || null;

    setForm((current) => ({
      ...current,
      clientId: nextClient?.id || "",
      clientName: nextClient?.name || "",
      title:
        nextClient && (current.title === "Simulacao geral" || current.title.startsWith("Simulacao "))
          ? `Simulacao ${nextClient.name}`
          : current.title,
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
    const filenameBase = (form.clientName || form.title || "simulacao-consorcio")
      .replace(/\s+/g, "-")
      .toLowerCase();

    link.href = url;
    link.download = `${filenameBase}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setLoading(false);
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className={`${glassPanel} p-5`}>
          <div className="mb-4 flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-600">
              <FileTextIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">
                Identificacao da proposta
              </h3>
              <p className={mutedText}>
                Defina cliente, titulo e dados comerciais usados no registro e no PDF.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className={fieldLabel}>
              <span className={labelText}>Cliente vinculado</span>
              <select
                className={selectClass}
                value={form.clientId}
                onChange={(event) => handleClientChange(event.target.value)}
              >
                <option value="">Simulacao sem cliente</option>
                {clientOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={fieldLabel}>
              <span className={labelText}>Nome exibido do cliente</span>
              <input
                className={inputClass}
                value={form.clientName}
                onChange={(event) => updateField("clientName", event.target.value)}
                placeholder="Nome para capa e PDF"
              />
            </label>
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
              <span className={labelText}>Consultor</span>
              <input
                className={inputClass}
                value={form.consultantName}
                onChange={(event) => updateField("consultantName", event.target.value)}
              />
            </label>
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Vinculo atual
              </span>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {selectedClient ? `Simulacao vinculada a ${selectedClient.name}` : "Sem cliente vinculado"}
              </p>
            </div>
          </div>
        </section>

        <section className={`${glassPanel} p-5`}>
          <div className="mb-4 flex items-start gap-3">
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

          <div className="grid gap-3 md:grid-cols-2">
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
            <div className="grid gap-3 md:col-span-2">
              <CurrencyField
                label="Valor do bem"
                value={form.assetValue}
                onChange={(value) => updateField("assetValue", value)}
              />
              <CurrencyField
                label="Recursos proprios"
                value={form.ownResources}
                onChange={(value) => updateField("ownResources", value)}
              />
              <div className="grid gap-3 md:grid-cols-[180px_1fr] md:items-end">
                <label className={fieldLabel}>
                  <span className={labelText}>Usar lance embutido?</span>
                  <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => updateEmbeddedBidState(true)}
                      className={[
                        "rounded-full px-4 py-2 text-sm font-semibold transition",
                        form.includeEmbeddedBid
                          ? "bg-amber-400 text-slate-950 shadow-sm"
                          : "text-slate-500 hover:text-slate-700",
                      ].join(" ")}
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      onClick={() => updateEmbeddedBidState(false)}
                      className={[
                        "rounded-full px-4 py-2 text-sm font-semibold transition",
                        !form.includeEmbeddedBid
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700",
                      ].join(" ")}
                    >
                      Nao
                    </button>
                  </div>
                </label>
                {form.includeEmbeddedBid ? (
                  <CurrencyField
                    label="Valor do lance embutido"
                    value={form.embeddedBid}
                    onChange={(value) => updateField("embeddedBid", value)}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className={`${glassPanel} p-5`}>
        <div className="mb-4 flex items-start gap-3">
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

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

      <section className={`${glassPanel} p-5`}>
        <div className="mb-4 flex items-start gap-3">
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

        <div className="grid gap-3 xl:grid-cols-3">
          {Object.values(simulation.scenarios).map((scenario) => (
            <article
              key={`${scenario.title}-${scenario.mode}`}
              className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
            >
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-500">
                Cenario
              </p>
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
                {scenario.title}
              </h3>
              <span className={`mt-4 ${badgeClass}`}>{scenario.mode}</span>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <span className="text-sm text-slate-500">Parcela</span>
                  <strong className="mt-1.5 block text-xl font-semibold tracking-[-0.03em] text-slate-950">
                    {formatCurrency(scenario.installment)}
                  </strong>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Prazo restante</span>
                  <strong className="mt-1.5 block text-xl font-semibold tracking-[-0.03em] text-slate-950">
                    {formatTerm(scenario.remainingTerm)}
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${glassPanel} ${panelPadding}`}>
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
          <div className="grid content-between gap-3">
            <div>
              <h2 className={sectionTitle}>{report.cover.title}</h2>
              <p className={mutedText}>{report.cover.summary}</p>
            </div>
            <div className="grid gap-3 rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p>Use esta area para orientar o cliente com a leitura comercial final.</p>
              <ul className="grid gap-2 text-slate-500">
                <li>• Proposta pronta para envio em PDF</li>
                <li>• Lance embutido opcional com calculo automatico</li>
                <li>• Vinculo com cliente para historico</li>
              </ul>
            </div>
          </div>
          <label className={fieldLabel}>
            <span className={labelText}>Observacoes do PDF</span>
            <textarea
              className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Informacoes adicionais, condicoes comerciais ou observacoes do consultor."
            />
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <button className={primaryButtonClass} onClick={handleSave} disabled={loading}>
            {loading ? "Processando..." : "Salvar simulacao"}
          </button>
          <button className={secondaryButtonClass} onClick={handlePdf} disabled={loading}>
            Baixar PDF
          </button>
        </div>
      </section>
    </div>
  );
}

function CurrencyField({ label, value, onChange, disabled = false }) {
  return (
    <label className={fieldLabel}>
      <span className={labelText}>{label}</span>
      <input
        className={`${inputClass} ${disabled ? "cursor-not-allowed bg-slate-50 text-slate-400" : ""}`}
        inputMode="decimal"
        value={formatCurrencyInput(value)}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
    </label>
  );
}
