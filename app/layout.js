import "./globals.css";

export const metadata = {
  title: "Simulador Lance DISAL / GMAC",
  description: "Simulador de consórcio com exportação em PDF e persistência de cenários.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
