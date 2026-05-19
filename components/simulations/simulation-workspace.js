"use client";

import { useEffect, useMemo, useState } from "react";
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
    title: selectedClient?.name ? `Simulação ${selectedClient.name}` : "Simulação geral",
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
        nextClient && (current.title === "Simulação geral" || current.title.startsWith("Simulação "))
          ? `Simulação ${nextClient.name}`
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
      setError(data.error || "Falha ao salvar simulação.");
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
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
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
                Identificação da proposta
              </h3>
              <p className={mutedText}>
                Defina cliente, título e dados comerciais usados no registro e no PDF.
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
                <option value="">Simulação sem cliente</option>
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
              <span className={labelText}>Título interno da simulação</span>
              <input
                className={inputClass}
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
              />
            </label>
            <label className={`${fieldLabel} md:col-span-2`}>
              <span className={labelText}>Título comercial do PDF</span>
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
                Vínculo atual
              </span>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {selectedClient ? `Simulação vinculada a ${selectedClient.name}` : "Sem cliente vinculado"}
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
                Parâmetros financeiros
              </h3>
              <p className={mutedText}>
                Defina prazo, taxas e valores base que determinam o comportamento da proposta.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className={fieldLabel}>
              <span className={labelText}>Prazo</span>
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-100">
                <input
                  className="w-full bg-transparent py-2.5 pl-4 pr-16 text-sm text-slate-900 outline-none"
                  inputMode="numeric"
                  value={form.term}
                  onChange={(event) => updateField("term", event.target.value.replace(/\D/g, ""))}
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 select-none">
                  meses
                </span>
              </div>
            </label>
            <PercentField
              label="Taxa de administração"
              value={form.adminRate}
              onChange={(v) => updateField("adminRate", v)}
            />
            <div className="grid gap-3 md:col-span-2">
              <CurrencyField
                label="Valor do bem"
                value={form.assetValue}
                onChange={(value) => updateField("assetValue", value)}
              />
              <CurrencyField
                label="Recursos próprios"
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
                      Não
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
              Leitura rápida dos números principais para validação comercial imediata.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <article className={metricCard}>
            <span className="text-sm text-slate-500">Total do lance</span>
            <strong className="mt-2 block text-2xl font-semibold tracking-[-0.03em] tabular-nums truncate text-slate-950">
              {formatCurrency(simulation.metrics.totalBid)}
            </strong>
          </article>
          <article className={metricCard}>
            <span className="text-sm text-slate-500">% do lance</span>
            <strong className="mt-2 block text-2xl font-semibold tracking-[-0.03em] tabular-nums truncate text-slate-950">
              {formatPercent(simulation.metrics.bidPercent)}
            </strong>
          </article>
          <article className={metricCard}>
            <span className="text-sm text-slate-500">Parcela integral (100%)</span>
            <strong className="mt-2 block text-2xl font-semibold tracking-[-0.03em] tabular-nums truncate text-slate-950">
              {formatCurrency(simulation.metrics.fullInstallment)}
            </strong>
          </article>
          <article className={metricCard}>
            <span className="text-sm text-slate-500">Parcela reduzida (75%)</span>
            <strong className="mt-2 block text-2xl font-semibold tracking-[-0.03em] tabular-nums truncate text-slate-950">
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
              Cenários projetados
            </h3>
            <p className={mutedText}>
              Compare os quatro cenários de contemplação com foco em parcela e prazo.
            </p>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          {Object.values(simulation.scenarios).map((scenario) => (
            <article
              key={scenario.id}
              className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
            >
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-500">
                Cenário
              </p>
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
                {scenario.title}
              </h3>
              <span className={`mt-4 ${badgeClass}`}>{scenario.mode}</span>
              <div className="mt-4 grid gap-3 grid-cols-3">
                <div className="min-w-0">
                  <span className="text-xs text-slate-500 sm:text-sm">
                    {scenario.type === "installment" ? "Nova parcela" : "Parcela mantida"}
                  </span>
                  <strong className={`mt-1 block truncate text-base font-semibold tracking-[-0.02em] tabular-nums sm:text-xl ${scenario.type === "installment" ? "text-slate-950" : "text-slate-400"}`}>
                    {formatCurrency(scenario.installment)}
                  </strong>
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-slate-500 sm:text-sm">
                    {scenario.type === "term" ? "Novo prazo" : "Prazo restante"}
                  </span>
                  <strong className={`mt-1 block truncate text-base font-semibold tracking-[-0.02em] sm:text-xl ${scenario.type === "term" ? "text-slate-950" : "text-slate-400"}`}>
                    {formatTerm(scenario.remainingTerm)}
                  </strong>
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-slate-500 sm:text-sm">Custo total</span>
                  <strong className="mt-1 block truncate text-base font-semibold tracking-[-0.02em] tabular-nums text-slate-950 sm:text-xl">
                    {formatCurrency(scenario.totalCost)}
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
              <h2 className={sectionTitle}>Apresentação e PDF</h2>
              <p className={mutedText}>
                Configure o cenário recomendado e as observações comerciais finais.
              </p>
            </div>
            <label className={fieldLabel}>
              <span className={labelText}>Cenário Recomendado em Destaque</span>
              <select
                className={selectClass}
                value={form.recommendedScenario}
                onChange={(event) => updateField("recommendedScenario", event.target.value)}
              >
                <option value="fullAssetReducedInstallment">Crédito Integral — Redução de Parcela</option>
                <option value="fullAssetReducedTerm">Crédito Integral — Redução de Prazo</option>
                <option value="partialAssetReducedInstallment">Crédito Parcial (75%) — Redução de Parcela</option>
                <option value="partialAssetReducedTerm">Crédito Parcial (75%) — Redução de Prazo</option>
              </select>
            </label>
            <div className="grid gap-3 rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 mt-auto">
              <p>O cenário selecionado ganhará destaque visual na página de comparativos do PDF comercial.</p>
            </div>
          </div>
          <label className={fieldLabel}>
            <span className={labelText}>Observações do PDF</span>
            <textarea
              className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Informações adicionais, condições comerciais ou observações do consultor."
            />
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

        <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
          <button className={`${primaryButtonClass} w-full sm:w-auto`} onClick={handleSave} disabled={loading}>
            {loading ? "Processando..." : "Salvar simulação"}
          </button>
          <button className={`${secondaryButtonClass} w-full sm:w-auto`} onClick={handlePdf} disabled={loading}>
            Baixar PDF
          </button>
        </div>
      </section>
    </div>
  );
}

function PercentField({ label, value, onChange }) {
  const [display, setDisplay] = useState(() => String(value).replace(".", ","));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplay(String(value).replace(".", ","));
    }
  }, [value, isFocused]);

  function handleChange(e) {
    // Permite dígitos, vírgula e no máximo 4 casas decimais
    const raw = e.target.value.replace(/[^\d,]/g, "");
    const parts = raw.split(",");
    const masked = parts.length > 1
      ? parts[0] + "," + parts.slice(1).join("").slice(0, 4)
      : raw;
    setDisplay(masked);
    onChange(masked.replace(",", "."));
  }

  function handleBlur() {
    setIsFocused(false);
    const numeric = parseFloat(display.replace(",", "."));
    if (!isNaN(numeric)) setDisplay(String(numeric).replace(".", ","));
  }

  return (
    <label className={fieldLabel}>
      <span className={labelText}>{label}</span>
      <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white transition focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-100">
        <input
          className="flex-1 bg-transparent px-4 py-2.5 text-sm text-slate-900 outline-none"
          inputMode="decimal"
          value={display}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
        />
        <span className="flex items-center border-l border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500 select-none">
          %
        </span>
      </div>
    </label>
  );
}

// Formata string enquanto digita: "59000" → "59.000", "59000,5" → "59.000,5"
function applyBrMask(raw) {
  // Permite apenas dígitos e no máximo uma vírgula
  const cleaned = raw.replace(/[^\d,]/g, "");
  const commaIdx = cleaned.indexOf(",");
  let intStr, decStr;

  if (commaIdx === -1) {
    intStr = cleaned;
    decStr = null;
  } else {
    intStr = cleaned.slice(0, commaIdx);
    decStr = cleaned.slice(commaIdx + 1, commaIdx + 3); // máximo 2 casas decimais
  }

  // Adiciona pontos a cada 3 dígitos na parte inteira
  const intFormatted = intStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return decStr !== null ? `${intFormatted},${decStr}` : intFormatted;
}

// Converte a string mascarada para número
function parseBrMask(masked) {
  const noThousands = masked.replace(/\./g, "");
  const dotDecimal = noThousands.replace(",", ".");
  return dotDecimal;
}

function CurrencyField({ label, value, onChange, disabled = false }) {
  const [display, setDisplay] = useState(() => formatCurrencyInput(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplay(formatCurrencyInput(value));
    }
  }, [value, isFocused]);

  function handleChange(e) {
    const masked = applyBrMask(e.target.value);
    setDisplay(masked);
    const numeric = parseFloat(parseBrMask(masked));
    onChange(isNaN(numeric) ? 0 : numeric);
  }

  function handleBlur() {
    setIsFocused(false);
    const numeric = parseFloat(parseBrMask(display));
    const corrected = isNaN(numeric) ? 0 : numeric;
    setDisplay(formatCurrencyInput(corrected));
    onChange(corrected);
  }

  return (
    <label className={fieldLabel}>
      <span className={labelText}>{label}</span>
      <div className={`flex overflow-hidden rounded-2xl border border-slate-200 bg-white transition focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-100 ${disabled ? "bg-slate-50" : ""}`}>
        <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500 select-none">
          R$
        </span>
        <input
          className={`flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none ${disabled ? "cursor-not-allowed text-slate-400" : ""}`}
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          disabled={disabled}
        />
      </div>
    </label>
  );
}
