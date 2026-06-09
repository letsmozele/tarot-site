import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Cinzel } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tarot — Grimório de Leitura",
  description:
    "Selecione as cartas da sua tiragem e consulte os significados completos do Rider-Waite-Smith e Thoth. 78 cartas com arcanos maiores e menores.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf4e8] text-[#1c0e04]">
        {children}
      </body>
    </html>
  );
}
