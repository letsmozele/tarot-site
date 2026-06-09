"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import CardPicker from "./CardPicker";
import CardInReading from "./CardInReading";
import { ReadingCard, TarotCard, DeckType } from "@/lib/types";

interface ReadingBoardProps {
  deckType: DeckType;
}

export default function ReadingBoard({ deckType }: ReadingBoardProps) {
  const [cards, setCards] = useState<ReadingCard[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [readingTitle, setReadingTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);

  const addCard = (card: TarotCard) => {
    setCards((prev) => [
      ...prev,
      { card, reversed: false, position: `Posição ${prev.length + 1}` },
    ]);
    setShowPicker(false);
  };

  const removeCard = (index: number) => {
    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleReversed = (index: number) => {
    setCards((prev) =>
      prev.map((item, i) => (i === index ? { ...item, reversed: !item.reversed } : item))
    );
  };

  const updatePosition = (index: number, position: string) => {
    setCards((prev) =>
      prev.map((item, i) => (i === index ? { ...item, position } : item))
    );
  };

  const clearAll = () => {
    if (cards.length === 0) return;
    if (confirm("Limpar toda a leitura atual?")) setCards([]);
  };

  const excludeIds = cards.map((c) => c.card.id);

  return (
    <div className="flex-1 flex flex-col min-h-0">

      {/* ── Topo da leitura ── */}
      <div className="flex items-center gap-3 mb-6">
        {editingTitle ? (
          <input
            autoFocus
            value={readingTitle}
            onChange={(e) => setReadingTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setEditingTitle(false); }}
            placeholder="Nome da leitura..."
            className="flex-1 bg-transparent border-b border-[#c4a86a]/60 text-[#1c0e04] outline-none font-display text-sm pb-0.5 placeholder-[#7a5820]"
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="font-display text-sm tracking-wide text-[#6b4818] hover:text-[#4a3520] transition-colors text-left flex items-center gap-1.5"
          >
            <span className="text-[#c4a86a]">✦</span>
            {readingTitle || "Clique para nomear esta leitura"}
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          {cards.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider text-[#8a3010] hover:text-[#6b1a1a] border border-[#e8c8b0] hover:border-[#d49070] rounded-lg transition-all"
            >
              <Trash2 size={11} />
              Limpar
            </button>
          )}
          <button
            onClick={() => setShowPicker(true)}
            disabled={cards.length >= 15}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-[#1c0e04] hover:bg-[#3a2010] text-[#e8d898] rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={13} />
            Adicionar carta
          </button>
        </div>
      </div>

      {/* ── Estado vazio ── */}
      {cards.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center select-none">
          {/* Ilustração ornamental */}
          <div className="relative mb-8">
            {/* Círculo externo */}
            <div className="w-32 h-32 rounded-full border border-[#ddd0a8] flex items-center justify-center relative">
              {/* Círculo interno */}
              <div className="w-20 h-20 rounded-full border border-[#c4a86a]/40 flex items-center justify-center">
                <span className="text-4xl text-[#c4a86a]/50" style={{ fontFamily: "Georgia, serif" }}>✦</span>
              </div>
              {/* Ornamentos nos 4 lados */}
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[#c4a86a]/40 text-xs">☽</span>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[#c4a86a]/40 text-xs">◈</span>
              <span className="absolute -left-2 top-1/2 -translate-y-1/2 text-[#c4a86a]/40 text-xs">⊕</span>
              <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-[#c4a86a]/40 text-xs">✦</span>
            </div>
          </div>

          <h2 className="font-display text-lg font-semibold tracking-widest text-[#6b4818] uppercase mb-2">
            Grimório Vazio
          </h2>
          <p className="text-sm text-[#7a5820] mb-1 max-w-xs leading-relaxed">
            Embaralhe suas cartas, faça sua pergunta ao universo
          </p>
          <p className="text-xs text-[#9a7332] mb-8 max-w-xs">
            e selecione cada carta que saiu na sua tiragem
          </p>

          <button
            onClick={() => setShowPicker(true)}
            className="breathe-gold flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-[#1c0e04] hover:bg-[#3a2010] text-[#e8d898] rounded-xl transition-all"
          >
            <span>✦</span>
            Iniciar leitura
          </button>

          {/* Dica */}
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#7a5820] mt-8">
            78 cartas · Rider-Waite-Smith & Thoth
          </p>
        </div>
      )}

      {/* ── Lista de cartas ── */}
      {cards.length > 0 && (
        <div className="space-y-3">
          {cards.map((item, i) => (
            <CardInReading
              key={`${item.card.id}-${i}`}
              item={item}
              index={i}
              deckType={deckType}
              onToggleReversed={() => toggleReversed(i)}
              onRemove={() => removeCard(i)}
              onUpdatePosition={(pos) => updatePosition(i, pos)}
            />
          ))}

          {/* Botão de adicionar mais */}
          {cards.length < 15 && (
            <button
              onClick={() => setShowPicker(true)}
              className="w-full py-3 border border-dashed border-[#c4a86a]/50 rounded-2xl text-[#6b4818] hover:border-[#9a7332] hover:text-[#4a3520] hover:bg-[#faf4e8] transition-all text-xs flex items-center justify-center gap-2 font-display uppercase tracking-wider"
            >
              <Plus size={12} />
              Adicionar carta
            </button>
          )}
        </div>
      )}

      {/* ── Modal picker ── */}
      {showPicker && (
        <CardPicker
          onSelect={addCard}
          onClose={() => setShowPicker(false)}
          excludeIds={excludeIds}
        />
      )}
    </div>
  );
}
