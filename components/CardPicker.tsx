"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { X, Search, ChevronDown, ChevronUp } from "lucide-react";
import { getAllCards, SUITS, SUIT_COLORS } from "@/lib/cards";
import { TarotCard } from "@/lib/types";

interface CardPickerProps {
  onSelect: (card: TarotCard) => void;
  onClose: () => void;
  excludeIds?: string[];
}

type FilterType = "all" | "major" | "Copas" | "Paus" | "Espadas" | "Ouros";

export default function CardPicker({ onSelect, onClose, excludeIds = [] }: CardPickerProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const allCards = useMemo(() => getAllCards(), []);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    let cards = allCards.filter((c) => !excludeIds.includes(c.id));

    if (filter === "major") cards = cards.filter((c) => c.arcana === "major");
    else if (filter !== "all") cards = cards.filter((c) => c.suit === filter);

    if (query.trim()) {
      const q = query.toLowerCase();
      cards = cards.filter(
        (c) =>
          c.name_pt.toLowerCase().includes(q) ||
          c.name_en.toLowerCase().includes(q) ||
          c.thoth_name.toLowerCase().includes(q) ||
          c.keywords_upright.some((k) => k.toLowerCase().includes(q))
      );
    }
    return cards;
  }, [allCards, query, filter, excludeIds]);

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "Todas" },
    { key: "major", label: "Arcanos Maiores" },
    ...SUITS.map((s) => ({ key: s as FilterType, label: s })),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl bg-[#0f0820] border border-purple-800/60 rounded-2xl shadow-2xl flex flex-col max-h-[88vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-purple-900/50">
          <Search size={18} className="text-purple-400 shrink-0" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar carta..."
            className="flex-1 bg-transparent text-[#e8e0f0] placeholder-purple-600 outline-none text-sm"
          />
          <button onClick={onClose} className="text-purple-500 hover:text-purple-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 px-4 py-3 border-b border-purple-900/40 overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filter === f.key
                  ? "bg-purple-700 text-white"
                  : "bg-purple-950/50 text-purple-400 hover:bg-purple-900/50 hover:text-purple-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Card List */}
        <div className="overflow-y-auto flex-1 p-3 space-y-1">
          {filtered.length === 0 && (
            <p className="text-center text-purple-600 py-12 text-sm">Nenhuma carta encontrada</p>
          )}
          {filtered.map((card) => {
            const isExpanded = expandedId === card.id;
            const suitColor = card.suit ? SUIT_COLORS[card.suit]?.split(" ")[0] : "text-purple-300";

            return (
              <div key={card.id} className="rounded-xl overflow-hidden border border-transparent hover:border-purple-800/40 transition-all">
                <div
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-purple-950/40 rounded-xl transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : card.id)}
                >
                  {/* Number badge */}
                  <span className="w-8 text-center text-xs font-mono text-purple-500 shrink-0">
                    {card.arcana === "major" ? (typeof card.number === "number" ? card.number.toString().padStart(2, "0") : card.number) : card.number}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-sm text-[#e8e0f0] truncate">{card.name_pt}</span>
                      <span className="text-xs text-purple-500 truncate">{card.name_en}</span>
                    </div>
                    {card.suit && (
                      <span className={`text-xs ${suitColor} opacity-70`}>{card.suit} · {card.element}</span>
                    )}
                    {!card.suit && (
                      <span className="text-xs text-purple-500 opacity-70">Arcano Maior · {card.element}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelect(card); }}
                      className="px-3 py-1 text-xs bg-[#c9a84c]/20 hover:bg-[#c9a84c]/40 text-[#f0d080] rounded-lg border border-[#c9a84c]/30 transition-all font-medium"
                    >
                      Escolher
                    </button>
                    {isExpanded ? <ChevronUp size={14} className="text-purple-500" /> : <ChevronDown size={14} className="text-purple-500" />}
                  </div>
                </div>

                {/* Quick preview */}
                {isExpanded && (
                  <div className="px-4 pb-3 pt-1 bg-purple-950/20 border-t border-purple-900/30 animate-fade-in">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {card.keywords_upright.slice(0, 5).map((kw) => (
                        <span key={kw} className="px-2 py-0.5 text-xs bg-purple-900/40 text-purple-300 rounded-full">{kw}</span>
                      ))}
                    </div>
                    <p className="text-xs text-purple-300/70 line-clamp-3 leading-relaxed">{card.meaning_upright}</p>
                    {card.thoth_name !== card.name_en && (
                      <p className="text-xs text-[#c9a84c]/60 mt-1.5">Thoth: {card.thoth_name}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-4 py-2 border-t border-purple-900/40 text-xs text-purple-600 text-center">
          {filtered.length} cartas disponíveis
        </div>
      </div>
    </div>
  );
}
