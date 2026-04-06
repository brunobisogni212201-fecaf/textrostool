import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/app/components/layout";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "devroast - paste your code, get roasted",
  description: "A code review tool that roasts your code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} ${geist.variable} min-h-screen`}
      >
        <Navbar
          logoText="devroast"
          links={[
            { href: "/roast", label: "roast" },
            { href: "/leaderboard", label: "leaderboard" },
          ]}
        />
        {children}
      </body>
    </html>
  );
}
