"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { X, Search, ChevronDown, ChevronUp } from "lucide-react";
import { getAllCards, SUITS, SUIT_META } from "@/lib/cards";
import { TarotCard, FilterType, DeckType } from "@/lib/types";

interface CardPickerProps {
  onSelect: (card: TarotCard) => void;
  onClose: () => void;
  excludeIds?: string[];
  deckType?: DeckType;
}

function normalize(s: string | undefined | null): string {
  if (!s) return "";
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default function CardPicker({ onSelect, onClose, excludeIds = [], deckType = "rws" }: CardPickerProps) {
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
      const q = normalize(query);
      cards = cards.filter(
        (c) =>
          normalize(c.name_pt).includes(q) ||
          normalize(c.name_en).includes(q) ||
          normalize(c.thoth_name).includes(q) ||
          normalize(c.thoth_title).includes(q) ||
          c.keywords_upright.some((k) => normalize(k).includes(q))
      );
    }
    return cards;
  }, [allCards, query, filter, excludeIds]);

  const filters: { key: FilterType; label: string; symbol?: string }[] = [
    { key: "all", label: "Todas" },
    { key: "major", label: "Arcanos Maiores", symbol: "✦" },
    ...SUITS.map((s) => ({ key: s as FilterType, label: s, symbol: SUIT_META[s].symbol })),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1c0e04]/40 backdrop-blur-[2px]" />

      {/* Modal */}
      <div
        className="relative w-full sm:max-w-xl bg-[#fffcf5] border border-[#c4a86a] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[84vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 -4px 32px rgba(28,14,4,0.12), 0 0 0 1px rgba(201,168,76,0.15)" }}
      >
        {/* Handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#c4a86a]/40" />
        </div>

        {/* Header ornamental */}
        <div className="px-5 pt-4 pb-1 text-center">
          <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[#9a7332] mb-0.5">
            ✦ Escolha uma carta ✦
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mx-4 mb-3 px-3 py-2 bg-[#faf4e8] border border-[#ddd0a8] rounded-xl">
          <Search size={14} className="text-[#9a7332] shrink-0" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou palavra-chave..."
            className="flex-1 bg-transparent text-[#1c0e04] placeholder-[#9a7332] outline-none text-sm"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-[#6b4818] hover:text-[#4a3520]">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {filters.map((f) => {
            const isActive = filter === f.key;
            const meta = f.key !== "all" && f.key !== "major" ? SUIT_META[f.key] : null;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                  isActive
                    ? "bg-[#1c0e04] text-[#e8d898] border-[#1c0e04]"
                    : meta
                    ? `${meta.bg} ${meta.badge} border hover:opacity-80`
                    : "bg-[#f0e6d0] text-[#4a3520] border-[#ddd0a8] hover:border-[#c4a86a]"
                }`}
              >
                {f.symbol && <span>{f.symbol}</span>}
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-[#c4a86a]/40 to-transparent mb-1" />

        {/* Card List */}
        <div className="overflow-y-auto flex-1 px-3 py-2 space-y-0.5">
          {filtered.length === 0 && (
            <div className="text-center py-14">
              <p className="text-[#7a5820] text-sm font-display">Nenhuma carta encontrada</p>
              <p className="text-[#9a7332] text-xs mt-1">Tente outro nome ou palavra-chave</p>
            </div>
          )}

          {filtered.map((card) => {
            const isExpanded = expandedId === card.id;
            const meta = card.suit ? SUIT_META[card.suit] : null;
            const numStr =
              card.arcana === "major"
                ? typeof card.number === "number"
                  ? card.number.toString().padStart(2, "0")
                  : card.number
                : card.number;

            return (
              <div
                key={card.id}
                className="rounded-xl overflow-hidden border border-transparent hover:border-[#ddd0a8] transition-all"
              >
                {/* Row */}
                <div
                  className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer hover:bg-[#faf4e8] rounded-xl transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : card.id)}
                >
                  {/* Número */}
                  <span className="w-7 text-center text-xs font-mono text-[#7a5820] shrink-0 tabular-nums">
                    {numStr}
                  </span>

                  {/* Símbolo do naipe */}
                  {meta && (
                    <span className={`text-sm ${meta.color} shrink-0`}>{meta.symbol}</span>
                  )}
                  {!meta && card.arcana === "major" && (
                    <span className="text-sm text-[#9a7332] shrink-0">✦</span>
                  )}

                  {/* Nomes */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5 min-w-0">
                      {/* Nome principal muda conforme o deck */}
                      <span className="font-medium text-sm text-[#1c0e04] truncate">
                        {deckType === "thoth" ? (card.thoth_name || card.name_en) : card.name_pt}
                      </span>
                      {/* Nome secundário */}
                      {deckType === "thoth"
                        ? card.thoth_title && (
                            <span className="text-xs text-[#9a7332] italic truncate">{card.thoth_title}</span>
                          )
                        : card.name_pt !== card.name_en && (
                            <span className="text-xs text-[#6b4818] truncate">{card.name_en}</span>
                          )
                      }
                    </div>
                    <div className="text-[10px] text-[#6b4818] flex items-center gap-1 flex-wrap">
                      {card.suit ? (
                        <span>{card.suit} · {card.element}</span>
                      ) : (
                        <span>Arcano Maior · {card.element}</span>
                      )}
                      {deckType === "thoth" && card.thoth_astrology && (
                        <span className="text-[#7a5820]">· {card.thoth_astrology}</span>
                      )}
                      {deckType === "rws" && card.thoth_name && card.thoth_name !== card.name_en && (
                        <span className="text-[#7a5820]">· Thoth: {card.thoth_name}</span>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelect(card); }}
                      className="px-2.5 py-1 text-xs bg-[#1c0e04] hover:bg-[#3a2010] text-[#e8d898] rounded-lg transition-all font-medium"
                    >
                      Escolher
                    </button>
                    {isExpanded
                      ? <ChevronUp size={13} className="text-[#9a7332]" />
                      : <ChevronDown size={13} className="text-[#9a7332]" />
                    }
                  </div>
                </div>

                {/* Preview expandido */}
                {isExpanded && (
                  <div className="px-4 pt-2 pb-3 bg-[#faf4e8]/60 border-t border-[#ddd0a8]/60 animate-fade-in">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {card.keywords_upright.slice(0, 5).map((kw) => (
                        <span
                          key={kw}
                          className="px-2 py-0.5 text-[10px] bg-[#f0e6d0] text-[#4a3520] border border-[#ddd0a8] rounded-full"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-[#4a3520]/80 line-clamp-3 leading-relaxed">
                      {card.meaning_upright}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-[#ddd0a8]/60">
          <span className="text-[10px] text-[#6b4818] font-display uppercase tracking-wider">
            {filtered.length} cartas
          </span>
          <button
            onClick={onClose}
            className="text-xs text-[#6b4818] hover:text-[#4a3520] transition-colors flex items-center gap-1"
          >
            <X size={11} /> Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
