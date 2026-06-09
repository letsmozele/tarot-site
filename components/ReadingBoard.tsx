"use client";

import { useState } from "react";
import { Plus, Trash2, BookOpen, Star } from "lucide-react";
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
      prev.map((item, i) =>
        i === index ? { ...item, reversed: !item.reversed } : item
      )
    );
  };

  const updatePosition = (index: number, position: string) => {
    setCards((prev) =>
      prev.map((item, i) => (i === index ? { ...item, position } : item))
    );
  };

  const clearAll = () => {
    if (cards.length === 0) return;
    if (confirm("Limpar toda a leitura?")) setCards([]);
  };

  const excludeIds = cards.map((c) => c.card.id);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Reading header */}
      <div className="flex items-center gap-3 mb-5">
        <BookOpen size={16} className="text-[#c9a84c] shrink-0" />
        {editingTitle ? (
          <input
            autoFocus
            value={readingTitle}
            onChange={(e) => setReadingTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setEditingTitle(false); }}
            placeholder="Nome da leitura..."
            className="flex-1 bg-transparent border-b border-purple-700/50 text-[#e8e0f0] outline-none text-sm pb-0.5"
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="text-sm text-purple-400 hover:text-[#c9a84c] transition-colors text-left"
          >
            {readingTitle || "Clique para nomear esta leitura"}
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          {cards.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 border border-red-800/30 hover:border-red-700/50 rounded-lg transition-all"
            >
              <Trash2 size={12} />
              Limpar
            </button>
          )}
          <button
            onClick={() => setShowPicker(true)}
            disabled={cards.length >= 15}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium bg-[#c9a84c]/20 hover:bg-[#c9a84c]/30 text-[#f0d080] border border-[#c9a84c]/30 hover:border-[#c9a84c]/50 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
            Adicionar carta
          </button>
        </div>
      </div>

      {/* Empty state */}
      {cards.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-5 opacity-30">✦</div>
          <h2 className="text-lg font-medium text-purple-300/60 mb-2">Sua leitura está vazia</h2>
          <p className="text-sm text-purple-500/50 mb-6 max-w-xs leading-relaxed">
            Clique em <span className="text-[#c9a84c]/70">Adicionar carta</span> para selecionar as cartas que saíram na sua leitura
          </p>
          <button
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#c9a84c]/20 hover:bg-[#c9a84c]/30 text-[#f0d080] border border-[#c9a84c]/30 hover:border-[#c9a84c]/50 rounded-xl transition-all pulse-gold"
          >
            <Star size={14} />
            Começar leitura
          </button>
        </div>
      )}

      {/* Cards */}
      {cards.length > 0 && (
        <div className="grid grid-cols-1 gap-3 overflow-y-auto">
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

          {/* Add more button at bottom of list */}
          {cards.length < 15 && (
            <button
              onClick={() => setShowPicker(true)}
              className="w-full py-3 border-2 border-dashed border-purple-800/30 rounded-2xl text-purple-600 hover:border-purple-700/50 hover:text-purple-400 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Plus size={14} />
              Adicionar mais uma carta
            </button>
          )}
        </div>
      )}

      {/* Card Picker Modal */}
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
