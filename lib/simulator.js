export const DEFAULT_VALUES = {
  clientName: "",
  consultantName: "",
  proposalTitle: "",
  notes: "",
  term: 0,
  adminRate: 0,
  insuranceMonthlyRate: 0.08168,
  assetValue: 0,
  ownResources: 0,
  includeEmbeddedBid: false,
  embeddedBid: 0,
  recommendedScenario: "fullAssetReducedInstallment",
};

const VALID_SCENARIOS = [
  "fullAssetReducedInstallment",
  "fullAssetReducedTerm",
  "partialAssetReducedInstallment",
  "partialAssetReducedTerm",
];

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
    recommendedScenario: VALID_SCENARIOS.includes(input.recommendedScenario)
      ? input.recommendedScenario
      : "fullAssetReducedInstallment",
  };
}

export function calculateSimulation(rawInput) {
  const input = sanitizeSimulationInput(rawInput);
  const term = Math.max(input.term, 1);
  const adminRateDecimal = input.adminRate / 100;
  const insuranceTermRate = (input.insuranceMonthlyRate / 100) * term;
  const adminFeeTotal = input.assetValue * adminRateDecimal;
  const insuranceTotal = (input.assetValue + adminFeeTotal) * insuranceTermRate;

  // Parcelas base (antes da contemplação)
  // reducedInstallment = parcela quando recebendo 75% do bem
  const reducedInstallment =
    (input.assetValue * 0.75) / term + adminFeeTotal / term + insuranceTotal / term;
  // fullInstallment = parcela quando recebendo 100% do bem
  const fullInstallment =
    input.assetValue / term + adminFeeTotal / term + insuranceTotal / term;

  const totalBid = input.ownResources + input.embeddedBid;
  const bidPercentBase = input.assetValue + adminFeeTotal;
  const bidPercent = bidPercentBase > 0 ? (totalBid / bidPercentBase) * 100 : 0;
  const remainingDivisor = Math.max(term - 1, 1);

  // Fórmulas extraídas diretamente da planilha DISAL/GMAC UNIVERSAL
  //
  // Cenário 1 (F6): 100% bem, PARCELA INTEGRAL — reduzindo parcela
  //   Base: saldo = fullInstallment × (term-1) − lance
  //   Nova parcela = saldo / (term-1)
  const fullTotalCost = fullInstallment * remainingDivisor - totalBid;
  const fullAssetNewInstallment = fullTotalCost / remainingDivisor;

  // Cenário 2 (F10): 100% bem, PARCELA INTEGRAL — reduzindo prazo
  //   Mantém a parcela integral; novo prazo = (term-1) − (lance / fullInstallment)
  const fullAssetNewTerm = remainingDivisor - totalBid / safeDivisor(fullInstallment);

  // Cenário 3 (H6): 75% bem, PARCELA REDUZIDA — reduzindo parcela
  //   Base: saldo = reducedInstallment × term − 1 − lance
  //   Nova parcela = saldo / (term-1)
  const partialTotalCost = reducedInstallment * term - 1 - totalBid;
  const partialAssetNewInstallment = partialTotalCost / remainingDivisor;

  // Cenário 4 (H10): 75% bem, PARCELA REDUZIDA — reduzindo prazo
  //   Mantém a parcela reduzida; novo prazo = (term-1) − (lance / reducedInstallment)
  const partialAssetNewTerm = remainingDivisor - totalBid / safeDivisor(reducedInstallment);

  return {
    input,
    metrics: {
      adminFeeTotal,
      reducedInstallment,
      fullInstallment,
      totalBid,
      bidPercent,
      fullTotalCost,
      partialTotalCost,
    },
    scenarios: {
      fullAssetReducedInstallment: {
        id: "fullAssetReducedInstallment",
        title: "Crédito Integral — Redução de Parcela",
        mode: "Mantém o prazo, reduz o valor mensal",
        type: "installment",
        installment: fullAssetNewInstallment,
        remainingTerm: remainingDivisor,
        totalCost: fullTotalCost,
      },
      fullAssetReducedTerm: {
        id: "fullAssetReducedTerm",
        title: "Crédito Integral — Redução de Prazo",
        mode: "Mantém a parcela integral, quita mais cedo",
        type: "term",
        installment: fullInstallment,
        remainingTerm: fullAssetNewTerm,
        totalCost: fullTotalCost,
      },
      partialAssetReducedInstallment: {
        id: "partialAssetReducedInstallment",
        title: "Crédito Parcial (75%) — Redução de Parcela",
        mode: "Menor parcela possível",
        type: "installment",
        installment: partialAssetNewInstallment,
        remainingTerm: remainingDivisor,
        totalCost: partialTotalCost,
      },
      partialAssetReducedTerm: {
        id: "partialAssetReducedTerm",
        title: "Crédito Parcial (75%) — Redução de Prazo",
        mode: "Quita mais cedo com parcela reduzida",
        type: "term",
        installment: reducedInstallment,
        remainingTerm: partialAssetNewTerm,
        totalCost: partialTotalCost,
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
      `Lance planejado de ${formatCurrency(metrics.totalBid)}, representando ${formatPercent(metrics.bidPercent)} do custo total do plano.`,
      `Crédito de ${formatCurrency(input.assetValue)} estruturado em ${formatTerm(input.term)}, com custo total estimado após o lance de ${formatCurrency(metrics.fullTotalCost)}.`,
      `Flexibilidade de escolha: reduza a parcela mensal ou antecipe a quitação conforme seu planejamento financeiro.`,
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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toNumber(value));
}

export function formatPercent(value) {
  return `${new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toNumber(value))}%`;
}

export function formatTerm(value) {
  const rounded = Math.floor(toNumber(value));
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
