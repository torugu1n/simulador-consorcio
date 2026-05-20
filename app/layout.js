import { Figtree, Fira_Code } from "next/font/google";
import ThemeProvider from "@/components/common/theme-provider";
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
      {/* Prevent flash of wrong theme */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme'),d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t===null&&d))document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
