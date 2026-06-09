"use client";

import { useState } from "react";
import ReadingBoard from "@/components/ReadingBoard";
import { DeckType } from "@/lib/types";

export default function Home() {
  const [deckType, setDeckType] = useState<DeckType>("rws");

  return (
    <div className="min-h-screen flex flex-col bg-[#08050f]">
      {/* Header */}
      <header className="border-b border-purple-900/30 backdrop-blur-sm bg-[#08050f]/80 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="text-xl text-[#c9a84c]">✦</span>
            <div>
              <h1 className="text-sm font-semibold text-[#e8e0f0] leading-tight text-glow">Tarot</h1>
              <p className="text-[10px] text-purple-500 leading-tight">Leitura de Cartas</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1 bg-purple-950/50 border border-purple-800/30 rounded-xl p-1">
            <button
              onClick={() => setDeckType("rws")}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                deckType === "rws"
                  ? "bg-[#c9a84c]/20 text-[#f0d080] border border-[#c9a84c]/30"
                  : "text-purple-500 hover:text-purple-300"
              }`}
            >
              Rider-Waite
            </button>
            <button
              onClick={() => setDeckType("thoth")}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                deckType === "thoth"
                  ? "bg-[#c9a84c]/20 text-[#f0d080] border border-[#c9a84c]/30"
                  : "text-purple-500 hover:text-purple-300"
              }`}
            >
              Thoth
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col">
        <ReadingBoard deckType={deckType} />
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-900/20 py-3 text-center">
        <p className="text-xs text-purple-700/50">
          78 cartas · Rider-Waite-Smith & Thoth · Arcanos Maiores e Menores
        </p>
      </footer>
    </div>
  );
}
