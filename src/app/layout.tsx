import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/app/components/layout";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "devroast - cole seu código, seja julgado",
  description: "Uma ferramenta de code review que detona seu código",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${jetbrainsMono.variable} ${inter.variable} font-sans min-h-screen text-foreground bg-background antialiased`}
      >
        <Navbar
          logoText="devroast"
          links={[
            { href: "/roast", label: "detonar" },
            { href: "/leaderboard", label: "ranking" },
          ]}
        />
        {children}
      </body>
    </html>
  );
}
