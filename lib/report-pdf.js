import {
  Document,
  Font,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import path from "path";
import { formatCurrency, formatTerm } from "@/lib/simulator";

const FONTS_DIR = path.join(process.cwd(), "public", "fonts");

Font.register({
  family: "Montserrat",
  fonts: [
    { src: path.join(FONTS_DIR, "Montserrat-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONTS_DIR, "Montserrat-Bold.ttf"),    fontWeight: 700 },
    { src: path.join(FONTS_DIR, "Montserrat-ExtraBold.ttf"), fontWeight: 800 },
  ],
});

Font.register({
  family: "Futura",
  fonts: [
    { src: path.join(FONTS_DIR, "Futura-Medium.ttf"), fontWeight: 400 },
    { src: path.join(FONTS_DIR, "Futura-Bold.ttf"),   fontWeight: 700 },
  ],
});

// Desativa hifenização automática
Font.registerHyphenationCallback(word => [word]);

// Paleta de cores da marca Paxeco
const BLUE    = "#3E4095"; // azul principal
const ORANGE  = "#FF6600"; // laranja destaque
const SKY     = "#00AFEF"; // azul claro
const GRAY    = "#555555"; // texto secundário
const LGRAY   = "#E6E6E6"; // fundo de cards
const WHITE   = "#ffffff";

const LOGO_PATH = path.join(process.cwd(), "public", "logo.png");

const CONTACT = {
  email:   "contempladas2025@gmail.com",
  phone:   "(86) 99406-3104",
  cnpj:    "25.007.850/0001-42",
  address: "QD 151 Itararé Dirceu 1 N-08, CEP 64.077-341 — Teresina/PI",
  site:    "https://paxecocontemplados.com.br",
  siteLabel: "paxecocontemplados.com.br",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: WHITE,
    color: BLUE,
    fontFamily: "Futura",
    fontSize: 11,
    lineHeight: 1.4,
  },

  // ── CAPA ────────────────────────────────────────────────
  coverPage: {
    backgroundColor: WHITE,
    color: BLUE,
    padding: 0,
    flexDirection: "column",
  },
  // Área branca superior com a logo
  coverLogoArea: {
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 44,
    paddingHorizontal: 50,
  },
  coverLogo: {
    width: 240,
    height: 155,
    objectFit: "contain",
  },
  coverLogoTagline: {
    fontSize: 10,
    color: GRAY,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginTop: 10,
  },
  // Barra laranja separadora
  coverDivider: {
    backgroundColor: ORANGE,
    height: 7,
  },
  // Bloco azul com o conteúdo
  coverBody: {
    flex: 1,
    backgroundColor: BLUE,
    padding: 44,
    justifyContent: "space-between",
  },
  coverKicker: {
    fontFamily: "Futura",
    color: SKY,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 2.5,
    marginBottom: 8,
    fontWeight: 400,
  },
  coverTitle: {
    fontFamily: "Montserrat",
    fontSize: 32,
    lineHeight: 1.15,
    fontWeight: 800,
    color: WHITE,
    marginBottom: 14,
  },
  coverSummary: {
    fontSize: 11.5,
    color: "#c7d2fe",
    lineHeight: 1.6,
    marginBottom: 28,
  },
  coverClientBlock: {
    borderLeftWidth: 3,
    borderLeftColor: ORANGE,
    paddingLeft: 14,
  },
  coverClientLabel: {
    fontSize: 9,
    color: SKY,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  coverClientName: {
    fontSize: 22,
    fontWeight: "bold",
    color: WHITE,
  },
  coverBottomBar: {
    borderTopWidth: 1,
    borderTopColor: "#5a5ea8",
    paddingTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coverConsultantText: {
    fontSize: 9,
    color: "#c7d2fe",
  },

  // ── CABEÇALHO DAS PÁGINAS INTERNAS ──────────────────────
  // Sem paddingHorizontal na página — o header vai de borda a borda
  contentPage: {
    paddingTop: 0,
    paddingBottom: 44,
  },
  // Wrapper para o conteúdo abaixo do header
  contentBody: {
    paddingHorizontal: 32,
  },
  pageHeader: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: BLUE,
    marginBottom: 14,
  },
  pageHeaderLogoArea: {
    backgroundColor: WHITE,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 4,
    borderRightColor: ORANGE,
  },
  pageHeaderLogo: {
    width: 110,
    height: 70,
    objectFit: "contain",
  },
  pageHeaderCenter: {
    width: 200,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
  },
  pageHeaderSectionLabel: {
    fontFamily: "Futura",
    fontSize: 7,
    color: SKY,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  pageHeaderTitle: {
    fontFamily: "Montserrat",
    fontSize: 15,
    fontWeight: 800,
    color: WHITE,
    lineHeight: 1.15,
  },
  pageHeaderSubtitle: {
    fontFamily: "Futura",
    fontSize: 8,
    color: "#c7d2fe",
    marginTop: 2,
  },
  pageHeaderContact: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
  },
  contactLine: {
    fontSize: 8,
    color: "#c7d2fe",
    marginBottom: 3,
  },
  contactLineHighlight: {
    color: SKY,
  },

  // ── RESUMO EXECUTIVO ─────────────────────────────────────
  execGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  execCard: {
    width: "47%",
    backgroundColor: LGRAY,
    padding: 12,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: BLUE,
  },
  execCardHighlight: {
    borderLeftColor: ORANGE,
    backgroundColor: BLUE,
  },
  execLabel: {
    fontSize: 8.5,
    color: GRAY,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  execLabelLight: {
    color: "#c7d2fe",
  },
  execValue: {
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: 800,
    color: BLUE,
  },
  execValueLight: {
    color: WHITE,
  },

  // ── DESTAQUES ────────────────────────────────────────────
  textBlock: {
    marginBottom: 10,
  },
  textHeading: {
    fontFamily: "Montserrat",
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 6,
    color: BLUE,
  },
  paragraph: {
    fontSize: 10,
    color: GRAY,
    lineHeight: 1.4,
    marginBottom: 8,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bulletPoint: {
    width: 12,
    color: ORANGE,
    fontWeight: "bold",
  },
  bulletText: {
    flex: 1,
    color: GRAY,
    lineHeight: 1.4,
    fontSize: 10,
  },

  // ── CENÁRIOS ─────────────────────────────────────────────
  scenarioCard: {
    backgroundColor: LGRAY,
    borderRadius: 5,
    padding: 10,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: "#d4d4d4",
  },
  scenarioRecommended: {
    backgroundColor: WHITE,
    borderColor: BLUE,
    borderWidth: 2,
  },
  scenarioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#d4d4d4",
  },
  scenarioTitle: {
    fontFamily: "Montserrat",
    fontSize: 12,
    fontWeight: 800,
    color: BLUE,
    width: "72%",
  },
  badge: {
    backgroundColor: ORANGE,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    color: WHITE,
    fontSize: 8,
    fontWeight: "heavy",
    textTransform: "uppercase",
  },
  scenarioMetrics: {
    flexDirection: "row",
    gap: 12,
  },
  metricGroup: {
    flex: 1,
    flexShrink: 0,
  },
  metricLabel: {
    fontSize: 8.5,
    color: GRAY,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metricValue: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: 700,
    color: BLUE,
  },
  metricValueMuted: {
    color: "#9ca3af",
  },
  scenarioDescription: {
    marginTop: 6,
    fontSize: 9.5,
    color: GRAY,
  },

  // ── COMPOSIÇÃO FINANCEIRA ────────────────────────────────
  finRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#d4d4d4",
  },
  finLabel: {
    color: GRAY,
    fontSize: 10,
  },
  finValue: {
    fontFamily: "Montserrat",
    fontWeight: 700,
    color: BLUE,
    fontSize: 10,
  },
  finSection: {
    marginBottom: 14,
  },
  notesBox: {
    backgroundColor: "#fff4e6",
    padding: 12,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: ORANGE,
    marginBottom: 14,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: BLUE,
    marginBottom: 5,
  },
  notesText: {
    fontSize: 9.5,
    color: GRAY,
    lineHeight: 1.5,
  },

  // ── RODAPÉ ───────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 16,
    left: 32,
    right: 32,
    borderTopWidth: 1,
    borderTopColor: LGRAY,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 0,
  },
  footerText: {
    fontSize: 7,
    color: "#9ca3af",
    lineHeight: 1.3,
  },
  footerLink: {
    fontSize: 7,
    color: SKY,
    textDecoration: "none",
  },
});

function PageHeader({ title, subtitle }) {
  return (
    <View style={styles.pageHeader} fixed>
      {/* Logo em fundo branco com borda laranja */}
      <View style={styles.pageHeaderLogoArea}>
        <Image src={LOGO_PATH} style={styles.pageHeaderLogo} />
      </View>

      {/* Título da seção */}
      <View style={styles.pageHeaderCenter}>
        <Text style={styles.pageHeaderSectionLabel}>Paxeco Contemplados & Investimentos</Text>
        <Text style={styles.pageHeaderTitle}>{title}</Text>
        <Text style={styles.pageHeaderSubtitle}>{subtitle}</Text>
      </View>

      {/* Dados de contato */}
      <View style={styles.pageHeaderContact}>
        <Text style={[styles.contactLine, styles.contactLineHighlight]}>{CONTACT.email}</Text>
        <Text style={styles.contactLine}>{CONTACT.phone}  ·  CNPJ: {CONTACT.cnpj}</Text>
        <Text style={styles.contactLine}>{CONTACT.address}</Text>
        <Link src={CONTACT.site} style={[styles.contactLine, styles.contactLineHighlight]}>
          {CONTACT.siteLabel}
        </Link>
      </View>
    </View>
  );
}

function ReportDocument({ report }) {
  const { input, metrics, scenarios, cover, highlights, footerNote, generatedLabel } = report;
  const recommendedId = input.recommendedScenario;

  return (
    <Document title={`${cover.clientLabel} - Planejamento Consórcio`}>

      {/* ── PÁGINA 1: CAPA ── */}
      <Page size="A4" style={styles.coverPage}>
        {/* Área branca com logo grande centralizada */}
        <View style={styles.coverLogoArea}>
          <Image src={LOGO_PATH} style={styles.coverLogo} />
        </View>

        {/* Barra laranja */}
        <View style={styles.coverDivider} />

        {/* Bloco azul com conteúdo */}
        <View style={styles.coverBody}>
          <View>
            <Text style={styles.coverKicker}>{cover.kicker}</Text>
            <Text style={styles.coverTitle}>{cover.title}</Text>
            <Text style={styles.coverSummary}>{cover.summary}</Text>
            <View style={styles.coverClientBlock}>
              <Text style={styles.coverClientLabel}>Apresentado para</Text>
              <Text style={styles.coverClientName}>{cover.clientLabel}</Text>
            </View>
          </View>

          <View style={styles.coverBottomBar}>
            <Text style={styles.coverConsultantText}>Consultor: {cover.consultantLabel}</Text>
            <Text style={styles.coverConsultantText}>{CONTACT.email}  ·  {CONTACT.phone}</Text>
            <Text style={styles.coverConsultantText}>Data: {generatedLabel}</Text>
          </View>
        </View>
      </Page>

      {/* ── PÁGINA 2: RESUMO EXECUTIVO ── */}
      <Page size="A4" style={[styles.page, styles.contentPage]}>
        <PageHeader title="Resumo Executivo" subtitle="Visão Geral do Crédito" />

        <View style={styles.contentBody}>
          <View style={styles.execGrid}>
            <View style={styles.execCard}>
              <Text style={styles.execLabel}>Valor do Crédito</Text>
              <Text style={styles.execValue}>{formatCurrency(input.assetValue)}</Text>
            </View>
            <View style={styles.execCard}>
              <Text style={styles.execLabel}>Prazo do Plano</Text>
              <Text style={styles.execValue}>{formatTerm(input.term)}</Text>
            </View>
            <View style={[styles.execCard, styles.execCardHighlight]}>
              <Text style={[styles.execLabel, styles.execLabelLight]}>Lance Planejado</Text>
              <Text style={[styles.execValue, styles.execValueLight]}>{formatCurrency(metrics.totalBid)}</Text>
            </View>
            <View style={styles.execCard}>
              <Text style={styles.execLabel}>Custo Total Após Lance</Text>
              <Text style={styles.execValue}>{formatCurrency(metrics.fullTotalCost)}</Text>
            </View>
          </View>

          <View style={styles.textBlock}>
            <Text style={styles.textHeading}>Estratégia e Viabilidade</Text>
            {highlights.map((item, i) => (
              <View key={i} style={styles.bulletItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Paxeco Contemplados & Investimentos  ·  {CONTACT.phone}  ·  {CONTACT.email}</Text>
          <Link src={CONTACT.site} style={styles.footerLink}>{CONTACT.siteLabel}</Link>
          <Text style={styles.footerText}>{generatedLabel}</Text>
        </View>
      </Page>

      {/* ── PÁGINA 3: CENÁRIOS ── */}
      <Page size="A4" style={[styles.page, styles.contentPage]}>
        <PageHeader title="Projeção de Cenários" subtitle="Opções de Contemplação" />

        <View style={styles.contentBody}>
          <Text style={styles.paragraph}>
            Projeções financeiras pós-contemplação considerando o lance planejado. O cenário destacado representa a recomendação do consultor.
          </Text>

          {Object.values(scenarios).map(scenario => {
            const isRecommended = scenario.id === recommendedId;
            return (
              <View key={scenario.id} style={[styles.scenarioCard, isRecommended && styles.scenarioRecommended]}>
                <View style={styles.scenarioHeader}>
                  <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                  {isRecommended && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Recomendado</Text>
                    </View>
                  )}
                </View>
                <View style={styles.scenarioMetrics}>
                  <View style={styles.metricGroup}>
                    <Text style={styles.metricLabel}>
                      {scenario.type === "installment" ? "Nova Parcela" : "Parcela Mantida"}
                    </Text>
                    <Text style={[styles.metricValue, scenario.type === "term" && styles.metricValueMuted]}>
                      {formatCurrency(scenario.installment)}
                    </Text>
                  </View>
                  <View style={styles.metricGroup}>
                    <Text style={styles.metricLabel}>
                      {scenario.type === "term" ? "Novo Prazo" : "Prazo Restante"}
                    </Text>
                    <Text style={[styles.metricValue, scenario.type === "installment" && styles.metricValueMuted]}>
                      {formatTerm(scenario.remainingTerm)}
                    </Text>
                  </View>
                  <View style={styles.metricGroup}>
                    <Text style={styles.metricLabel}>Custo Total Aprox.</Text>
                    <Text style={styles.metricValue}>{formatCurrency(scenario.totalCost)}</Text>
                  </View>
                </View>
                <Text style={styles.scenarioDescription}>{scenario.mode}.</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Paxeco Contemplados & Investimentos  ·  {CONTACT.phone}  ·  {CONTACT.email}</Text>
          <Link src={CONTACT.site} style={styles.footerLink}>{CONTACT.siteLabel}</Link>
          <Text style={styles.footerText}>{generatedLabel}</Text>
        </View>
      </Page>

      {/* ── PÁGINA 4: COMPOSIÇÃO FINANCEIRA ── */}
      <Page size="A4" style={[styles.page, styles.contentPage]}>
        <PageHeader title="Composição Financeira" subtitle="Transparência e Detalhamento" />

        <View style={styles.contentBody}>
          <View style={styles.finSection}>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Valor do Crédito</Text>
              <Text style={styles.finValue}>{formatCurrency(input.assetValue)}</Text>
            </View>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Taxa de Administração Total</Text>
              <Text style={styles.finValue}>{formatCurrency(metrics.adminFeeTotal)}</Text>
            </View>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Lance via Recursos Próprios</Text>
              <Text style={styles.finValue}>{formatCurrency(input.ownResources)}</Text>
            </View>
            {input.embeddedBid > 0 && (
              <View style={styles.finRow}>
                <Text style={styles.finLabel}>Lance Embutido Utilizado</Text>
                <Text style={styles.finValue}>{formatCurrency(input.embeddedBid)}</Text>
              </View>
            )}
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Total do Lance</Text>
              <Text style={styles.finValue}>{formatCurrency(metrics.totalBid)}</Text>
            </View>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Custo Total Após Lance — 100% do bem</Text>
              <Text style={styles.finValue}>{formatCurrency(metrics.fullTotalCost)}</Text>
            </View>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Custo Total Após Lance — 75% do bem</Text>
              <Text style={styles.finValue}>{formatCurrency(metrics.partialTotalCost)}</Text>
            </View>
          </View>

          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>Observações e Validade</Text>
            <Text style={styles.notesText}>{footerNote}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Projeção baseada nos parâmetros informados, sujeita à aprovação e regras da administradora.</Text>
          <Link src={CONTACT.site} style={styles.footerLink}>{CONTACT.siteLabel}</Link>
          <Text style={styles.footerText}>{generatedLabel}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderReportPdf(report) {
  return renderToBuffer(<ReportDocument report={report} />);
}
