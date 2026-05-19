import { Figtree, Fira_Code } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-figtree",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata = {
  title: "Simulador Lance DISAL / GMAC",
  description: "Simulador de consórcio com exportação em PDF e persistência de cenários.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${figtree.variable} ${firaCode.variable}`}>
      <body>{children}</body>
    </html>
  );
}
