"use client";

import { useState } from "react";
import ReadingBoard from "@/components/ReadingBoard";
import { DeckType } from "@/lib/types";

export default function Home() {
  const [deckType, setDeckType] = useState<DeckType>("rws");

  return (
    <div className="min-h-screen flex flex-col bg-[#faf4e8]">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-40 bg-[#faf4e8]/95 backdrop-blur-sm border-b border-[#ddd0a8]">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center gap-4">

          {/* Logotipo */}
          <div className="flex items-center gap-2.5">
            <span className="text-lg text-[#9a7332] leading-none" style={{ fontFamily: "Georgia, serif" }}>✦</span>
            <div>
              <h1 className="font-display text-sm font-semibold tracking-widest text-[#1c0e04] uppercase leading-tight">
                Tarot
              </h1>
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#9a7332] leading-tight">
                Grimório de Leitura
              </p>
            </div>
          </div>

          {/* Ornamento central */}
          <div className="hidden sm:flex flex-1 items-center justify-center gap-3 text-[#c4a86a] text-xs opacity-50 select-none">
            <span>─── ✦ ───</span>
          </div>

          {/* Toggle de baralho */}
          <div className="ml-auto flex items-center gap-1 bg-[#f0e6d0] border border-[#ddd0a8] rounded-lg p-0.5">
            <button
              onClick={() => setDeckType("rws")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all tracking-wide ${
                deckType === "rws"
                  ? "bg-[#fffcf5] text-[#9a7332] border border-[#c4a86a] shadow-sm"
                  : "text-[#7a6040] hover:text-[#4a3520]"
              }`}
            >
              Rider-Waite
            </button>
            <button
              onClick={() => setDeckType("thoth")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all tracking-wide ${
                deckType === "thoth"
                  ? "bg-[#fffcf5] text-[#9a7332] border border-[#c4a86a] shadow-sm"
                  : "text-[#7a6040] hover:text-[#4a3520]"
              }`}
            >
              Thoth
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 flex flex-col">
        <ReadingBoard deckType={deckType} />
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[#ddd0a8] py-4 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a7332]/60">
          78 cartas · Rider-Waite-Smith & Thoth · Arcanos Maiores e Menores
        </p>
      </footer>
    </div>
  );
}
