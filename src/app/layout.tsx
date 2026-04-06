import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/app/components/layout";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "devroast - análise de código por IA",
  description: "Ferramenta leve e intuitiva para revisar e otimizar seu código.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${jetbrainsMono.variable} font-sans min-h-screen text-foreground bg-background antialiased`}
      >
        <Navbar
          logoText="devroast"
          links={[
            { href: "/roast", label: "analisar" },
            { href: "/leaderboard", label: "ranking" },
          ]}
        />
        {children}
      </body>
    </html>
  );
}
