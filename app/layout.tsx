import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tarot — Leitura de Cartas",
  description: "Selecione as cartas da sua leitura e veja os significados do Tarot Rider-Waite-Smith e Thoth",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#08050f] text-[#e8e0f0]">
        {children}
      </body>
    </html>
  );
}
