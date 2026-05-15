export const DEFAULT_VALUES = {
  clientName: "",
  consultantName: "",
  proposalTitle: "Simulação de consórcio",
  notes:
    "Condições sujeitas à análise da administradora e às regras vigentes no momento da contratação.",
  term: 44,
  adminRate: 18,
  insuranceMonthlyRate: 0.08168,
  assetValue: 50000,
  ownResources: 25000,
  includeEmbeddedBid: false,
  embeddedBid: 0,
  recommendedScenario: "fullAssetReduced",
};

export function sanitizeSimulationInput(input) {
  const includeEmbeddedBid =
    typeof input.includeEmbeddedBid === "boolean"
      ? input.includeEmbeddedBid
      : toNumber(input.embeddedBid) > 0;

  return {
    clientName: String(input.clientName ?? "").trim(),
    consultantName: String(input.consultantName ?? "").trim(),
    proposalTitle: String(input.proposalTitle ?? DEFAULT_VALUES.proposalTitle).trim(),
    notes: String(input.notes ?? DEFAULT_VALUES.notes).trim(),
    term: toNumber(input.term),
    adminRate: toNumber(input.adminRate),
    insuranceMonthlyRate: toNumber(input.insuranceMonthlyRate),
    assetValue: toNumber(input.assetValue),
    ownResources: toNumber(input.ownResources),
    includeEmbeddedBid,
    embeddedBid: includeEmbeddedBid ? toNumber(input.embeddedBid) : 0,
    recommendedScenario: ["fullAssetReduced", "fullAssetFull", "partialAssetReduced"].includes(
      input.recommendedScenario,
    )
      ? input.recommendedScenario
      : "fullAssetReduced",
  };
}

export function calculateSimulation(rawInput) {
  const input = sanitizeSimulationInput(rawInput);
  const term = Math.max(input.term, 1);
  const adminRateDecimal = input.adminRate / 100;
  const insuranceTermRate = (input.insuranceMonthlyRate / 100) * term;
  const adminFeeTotal = input.assetValue * adminRateDecimal;
  const insuranceTotal = (input.assetValue + adminFeeTotal) * insuranceTermRate;
  const reducedInstallment =
    (input.assetValue * 0.75) / term + adminFeeTotal / term + insuranceTotal / term;
  const fullInstallment =
    input.assetValue / term + adminFeeTotal / term + insuranceTotal / term;
  const retainedAmount = input.assetValue * 0.25;
  const totalBid = input.ownResources + input.embeddedBid;
  const bidPercentBase = input.assetValue + adminFeeTotal;
  const bidPercent = bidPercentBase > 0 ? (totalBid / bidPercentBase) * 100 : 0;
  const remainingDivisor = Math.max(term - 1, 1);

  const fullAssetReducedInstallment =
    ((reducedInstallment * term - 1) - (totalBid - retainedAmount)) / remainingDivisor;
  const fullAssetFullInstallment =
    (fullInstallment * remainingDivisor - totalBid) / remainingDivisor;
  const partialAssetReducedInstallment =
    ((reducedInstallment * term - 1) - totalBid) / remainingDivisor;

  const fullAssetReducedTerm =
    remainingDivisor - (totalBid - retainedAmount) / safeDivisor(reducedInstallment);
  const fullAssetFullTerm = remainingDivisor - totalBid / safeDivisor(fullInstallment);
  const partialAssetReducedTerm =
    remainingDivisor - totalBid / safeDivisor(reducedInstallment);

  return {
    input,
    metrics: {
      adminFeeTotal,
      insuranceTotal,
      reducedInstallment,
      fullInstallment,
      totalBid,
      bidPercent,
      retainedAmount,
    },
    scenarios: {
      fullAssetReduced: {
        id: "fullAssetReduced",
        title: "Crédito Integral com Redução de Parcela",
        mode: "Ideal para fluxo de caixa mensal",
        installment: fullAssetReducedInstallment,
        remainingTerm: fullAssetReducedTerm,
      },
      fullAssetFull: {
        id: "fullAssetFull",
        title: "Crédito Integral com Antecipação de Prazo",
        mode: "Ideal para quitação acelerada",
        installment: fullAssetFullInstallment,
        remainingTerm: fullAssetFullTerm,
      },
      partialAssetReduced: {
        id: "partialAssetReduced",
        title: "Crédito Parcial (75%) com Redução de Parcela",
        mode: "Menor parcela possível",
        installment: partialAssetReducedInstallment,
        remainingTerm: partialAssetReducedTerm,
      },
    },
    generatedAt: new Date().toISOString(),
  };
}

export function buildClientReport(rawInput) {
  const simulation = calculateSimulation(rawInput);
  const { input, metrics, scenarios, generatedAt } = simulation;

  return {
    ...simulation,
    highlights: [
      `Lance planejado de ${formatCurrency(metrics.totalBid)}, garantindo robustez estratégica com viabilidade de ${formatPercent(metrics.bidPercent)}.`,
      `Alavancagem sustentável: crédito de ${formatCurrency(input.assetValue)} com planejamento estruturado em ${formatTerm(input.term)}.`,
      `Flexibilidade de resgate: o cenário recomendado otimiza suas finanças garantindo previsibilidade.`,
    ],
    cover: {
      title: input.proposalTitle || "Planejamento para Aquisição",
      clientLabel: input.clientName || "Cliente",
      consultantLabel: input.consultantName || "Consultor Especialista",
      kicker: "Estudo Financeiro de Consórcio",
      summary:
        "Este estudo foi desenvolvido de forma personalizada para apresentar o melhor direcionamento financeiro, alinhando rentabilidade, segurança e previsibilidade na sua próxima aquisição.",
    },
    footerNote:
      input.notes ||
      "Condições sujeitas à análise da administradora e disponibilidade do grupo.",
    generatedLabel: formatDateTime(generatedAt),
  };
}

export function createScenarioRecord(rawInput, name) {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `scenario-${Date.now()}`,
    name: name.trim(),
    createdAt: new Date().toISOString(),
    data: sanitizeSimulationInput(rawInput),
  };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(toNumber(value));
}

export function formatPercent(value) {
  return `${new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toNumber(value))}%`;
}

export function formatTerm(value) {
  const rounded = Math.ceil(toNumber(value));
  return `${rounded} parcela${rounded === 1 ? "" : "s"}`;
}

export function formatDateTime(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function parseCurrencyInput(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const normalized = String(value ?? "")
    .replace(/\s/g, "")
    .replace(/[R$r$\u00A0]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  return toNumber(normalized);
}

export function formatCurrencyInput(value) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toNumber(value));
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function safeDivisor(value) {
  return value === 0 ? 1 : value;
}
