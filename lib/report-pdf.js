import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import { formatCurrency, formatPercent, formatTerm } from "@/lib/simulator";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: "#fbf7f0",
    color: "#1c1713",
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.45,
  },
  coverPage: {
    justifyContent: "space-between",
  },
  coverTop: {
    padding: 28,
    borderRadius: 22,
    backgroundColor: "#efe3d2",
  },
  coverKicker: {
    fontSize: 10,
    color: "#b35e3d",
    textTransform: "uppercase",
    letterSpacing: 1.6,
    marginBottom: 14,
  },
  coverTitle: {
    fontSize: 32,
    lineHeight: 1.1,
    fontWeight: 700,
    marginBottom: 14,
  },
  coverSummary: {
    fontSize: 12,
    color: "#5e554b",
    maxWidth: 380,
  },
  coverStats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
    flexWrap: "wrap",
  },
  coverStatCard: {
    width: "31%",
    minWidth: 150,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#fffdf9",
  },
  statLabel: {
    color: "#6d6257",
    fontSize: 10,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 15,
    fontWeight: 700,
  },
  coverBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 28,
  },
  metaBlock: {
    gap: 4,
  },
  metaLine: {
    fontSize: 11,
    color: "#5e554b",
  },
  coverNoteBox: {
    width: 220,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#1f2937",
  },
  coverNoteTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
  },
  coverNoteText: {
    color: "#e5e7eb",
    fontSize: 10,
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 18,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#fffdfa",
  },
  heading: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flexGrow: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#f7f0e6",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 700,
    marginTop: 4,
  },
  bullet: {
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e6ddd1",
    paddingBottom: 8,
    marginBottom: 8,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0e8de",
    paddingVertical: 8,
  },
  colScenario: { width: "30%" },
  colMode: { width: "26%" },
  colParcel: { width: "22%" },
  colTerm: { width: "22%" },
  definitionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#eee4d7",
  },
  sideBySide: {
    flexDirection: "row",
    gap: 16,
  },
  half: {
    width: "50%",
  },
  footerText: {
    fontSize: 10,
    color: "#6d6257",
    marginTop: 14,
  },
});

function ReportDocument({ report }) {
  const scenarios = Object.values(report.scenarios);

  return (
    <Document title={`${report.input.clientName || "Cliente"} - Simulação de Consórcio`}>
      <Page size="A4" style={[styles.page, styles.coverPage]}>
        <View style={styles.coverTop}>
          <Text style={styles.coverKicker}>{report.cover.kicker}</Text>
          <Text style={styles.coverTitle}>{report.cover.title}</Text>
          <Text style={styles.coverSummary}>{report.cover.summary}</Text>

          <View style={styles.coverStats}>
            <View style={styles.coverStatCard}>
              <Text style={styles.statLabel}>Valor do bem</Text>
              <Text style={styles.statValue}>{formatCurrency(report.input.assetValue)}</Text>
            </View>
            <View style={styles.coverStatCard}>
              <Text style={styles.statLabel}>Prazo</Text>
              <Text style={styles.statValue}>{formatTerm(report.input.term)}</Text>
            </View>
            <View style={styles.coverStatCard}>
              <Text style={styles.statLabel}>Lance total</Text>
              <Text style={styles.statValue}>{formatCurrency(report.metrics.totalBid)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.coverBottom}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLine}>Cliente: {report.cover.clientLabel}</Text>
            <Text style={styles.metaLine}>Consultor: {report.cover.consultantLabel}</Text>
            <Text style={styles.metaLine}>Gerado em {report.generatedLabel}</Text>
          </View>

          <View style={styles.coverNoteBox}>
            <Text style={styles.coverNoteTitle}>Leitura rápida</Text>
            <Text style={styles.coverNoteText}>
              Este documento resume a simulação financeira e compara os cenários
              de contemplação mais relevantes para a apresentação comercial.
            </Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Resumo executivo</Text>
          <View style={styles.row}>
            <View style={styles.summaryCard}>
              <Text style={styles.statLabel}>Parcela integral atual</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(report.metrics.fullInstallment)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.statLabel}>Parcela reduzida atual</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(report.metrics.reducedInstallment)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.statLabel}>Percentual de lance</Text>
              <Text style={styles.summaryValue}>
                {formatPercent(report.metrics.bidPercent)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Destaques da simulação</Text>
          {report.highlights.map((item) => (
            <Text key={item} style={styles.bullet}>
              • {item}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Comparativo de cenários</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.colScenario}>Cenário</Text>
            <Text style={styles.colMode}>Modo</Text>
            <Text style={styles.colParcel}>Parcela</Text>
            <Text style={styles.colTerm}>Prazo restante</Text>
          </View>
          {scenarios.map((scenario) => (
            <View key={`${scenario.title}-${scenario.mode}`} style={styles.tableRow}>
              <Text style={styles.colScenario}>{scenario.title}</Text>
              <Text style={styles.colMode}>{scenario.mode}</Text>
              <Text style={styles.colParcel}>{formatCurrency(scenario.installment)}</Text>
              <Text style={styles.colTerm}>{formatTerm(scenario.remainingTerm)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sideBySide}>
          <View style={[styles.section, styles.half]}>
            <Text style={styles.heading}>Composição financeira</Text>
            <View style={styles.definitionRow}>
              <Text>Taxa total</Text>
              <Text>{formatCurrency(report.metrics.adminFeeTotal)}</Text>
            </View>
            <View style={styles.definitionRow}>
              <Text>Seguro total</Text>
              <Text>{formatCurrency(report.metrics.insuranceTotal)}</Text>
            </View>
            <View style={styles.definitionRow}>
              <Text>Recursos próprios</Text>
              <Text>{formatCurrency(report.input.ownResources)}</Text>
            </View>
            <View style={styles.definitionRow}>
              <Text>Lance embutido</Text>
              <Text>{formatCurrency(report.input.embeddedBid)}</Text>
            </View>
          </View>

          <View style={[styles.section, styles.half]}>
            <Text style={styles.heading}>Observações</Text>
            <Text>{report.footerNote}</Text>
            <Text style={styles.footerText}>
              Documento gerado automaticamente com base nos parâmetros informados
              no simulador.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function renderReportPdf(report) {
  const instance = pdf(<ReportDocument report={report} />);
  return instance.toBuffer();
}
