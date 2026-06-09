"use client";

import { useState } from "react";
import { RotateCcw, X, ChevronDown, ChevronUp } from "lucide-react";
import { ReadingCard, DeckType } from "@/lib/types";
import { SUIT_META, ELEMENT_SYMBOLS, getCardDisplayName, getCardMeaning } from "@/lib/cards";

interface CardInReadingProps {
  item: ReadingCard;
  index: number;
  deckType: DeckType;
  onToggleReversed: () => void;
  onRemove: () => void;
  onUpdatePosition: (pos: string) => void;
}

export default function CardInReading({
  item,
  index,
  deckType,
  onToggleReversed,
  onRemove,
  onUpdatePosition,
}: CardInReadingProps) {
  const [expanded, setExpanded] = useState(true);
  const [editingPosition, setEditingPosition] = useState(false);
  const [posInput, setPosInput] = useState(item.position || "");

  const { card, reversed } = item;
  const meta = card.suit ? SUIT_META[card.suit] : null;
  const elementSymbol = ELEMENT_SYMBOLS[card.element] || "✦";
  const cardName = getCardDisplayName(card, deckType);
  const meaning = getCardMeaning(card, deckType, reversed);
  const keywords = reversed ? card.keywords_reversed : card.keywords_upright;

  const isReversed = reversed;

  return (
    <div
      className={`rounded-2xl overflow-hidden animate-fade-in transition-all ${
        isReversed ? "card-reversed" : "card-ornate"
      }`}
    >
      {/* ── Faixa superior colorida por naipe / invertida ── */}
      <div
        className={`h-0.5 w-full ${
          isReversed
            ? "bg-gradient-to-r from-transparent via-[#d49070] to-transparent"
            : meta
            ? `bg-gradient-to-r from-transparent ${
                meta.bg.replace("bg-", "via-").replace("]", "/60]")
              } to-transparent`
            : "bg-gradient-to-r from-transparent via-[#c4a86a]/40 to-transparent"
        }`}
      />

      {/* ── Header do card ── */}
      <div className="flex items-start gap-3 px-4 pt-3.5 pb-2.5">
        {/* Número da posição */}
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold border ${
            isReversed
              ? "border-[#d49070] text-[#6b1a1a] bg-[#fdf5f0]"
              : "border-[#ddd0a8] text-[#9a7332] bg-[#f0e6d0]"
          }`}
        >
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          {/* Label da posição */}
          {editingPosition ? (
            <input
              autoFocus
              value={posInput}
              onChange={(e) => setPosInput(e.target.value)}
              onBlur={() => { onUpdatePosition(posInput); setEditingPosition(false); }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") {
                  onUpdatePosition(posInput);
                  setEditingPosition(false);
                }
              }}
              placeholder="Nome da posição..."
              className="w-full bg-[#faf4e8] border-b border-[#c4a86a]/60 text-[10px] uppercase tracking-wider text-[#9a7332] outline-none mb-1.5 pb-0.5"
            />
          ) : (
            <button
              onClick={() => setEditingPosition(true)}
              className="text-[10px] uppercase tracking-[0.15em] text-[#9a7332]/60 hover:text-[#9a7332] transition-colors mb-1.5 text-left flex items-center gap-1"
            >
              <span>✦</span>
              {item.position || "Clique para nomear posição"}
            </button>
          )}

          {/* Nome da carta */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className={`font-display font-semibold text-base leading-tight tracking-wide ${
              isReversed ? "text-[#6b1a1a]" : "text-[#1c0e04]"
            }`}>
              {cardName}
            </h3>
            {deckType === "thoth" && card.thoth_name !== card.name_en && (
              <span className="text-[10px] text-[#9a7332]/50 font-display">Thoth</span>
            )}
            {deckType === "rws" && card.name_pt !== card.name_en && (
              <span className="text-xs text-[#9a7332]/60">{card.name_en}</span>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className={`text-xs font-medium ${meta ? meta.color : "text-[#9a7332]"}`}>
              {elementSymbol} {card.element}
            </span>
            {card.suit && (
              <span className={`text-[11px] ${meta ? meta.color : ""} opacity-70`}>
                · {card.suit}
              </span>
            )}
            {card.astrology && (
              <span className="text-[11px] text-[#9a7332]/60">· {card.astrology}</span>
            )}
            {deckType === "thoth" && card.thoth_title && (
              <span className="text-[10px] text-[#9a7332]/50 italic">· {card.thoth_title}</span>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Toggle invertida */}
          <button
            onClick={onToggleReversed}
            title={isReversed ? "Invertida — clique para normal" : "Normal — clique para inverter"}
            className={`p-1.5 rounded-lg transition-all border text-xs ${
              isReversed
                ? "bg-[#fdf5f0] border-[#d49070] text-[#6b1a1a] hover:bg-[#fae8e0]"
                : "bg-[#f0e6d0] border-[#ddd0a8] text-[#9a7332] hover:border-[#c4a86a]"
            }`}
          >
            <RotateCcw size={12} className={isReversed ? "rotate-180" : ""} />
          </button>

          {/* Expandir */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg bg-[#f0e6d0] border border-[#ddd0a8] text-[#9a7332] hover:border-[#c4a86a] transition-all"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {/* Remover */}
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg bg-[#fdf5f0] border border-[#e8c8b0] text-[#b05030]/60 hover:text-[#6b1a1a] hover:border-[#d49070] transition-all"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Badge invertida */}
      {isReversed && (
        <div className="px-4 pb-2">
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-[#fdf5f0] text-[#6b1a1a] border border-[#d49070]/50 rounded-full px-2.5 py-0.5">
            ↕ Invertida
          </span>
        </div>
      )}

      {/* ── Conteúdo expandido ── */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4">

          {/* Divisor */}
          <div className="ornament-divider text-[10px] text-[#c4a86a]">
            <span>{isReversed ? "☽" : "✦"}</span>
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw) => (
              <span
                key={kw}
                className={`px-2 py-0.5 text-[11px] rounded-full border ${
                  isReversed
                    ? "bg-[#fdf5f0] text-[#6b1a1a] border-[#d49070]/40"
                    : meta
                    ? `${meta.bg} ${meta.badge} border`
                    : "bg-[#f0e6d0] text-[#4a3520] border-[#ddd0a8]"
                }`}
              >
                {kw}
              </span>
            ))}
          </div>

          {/* Significado principal */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-display text-[#9a7332] mb-2">
              {deckType === "rws" ? "Rider-Waite" : "Thoth"} — {isReversed ? "Invertida" : "Normal"}
            </p>
            <p className="text-sm text-[#1c0e04]/80 leading-relaxed">{meaning}</p>
          </div>

          {/* Significado do deck secundário */}
          {deckType === "rws" && card.thoth_meaning && (
            <details className="group">
              <summary className="flex items-center gap-1.5 cursor-pointer text-[10px] uppercase tracking-wider text-[#9a7332]/60 hover:text-[#9a7332] transition-colors">
                <span className="text-[#c4a86a]">◈</span>
                Ver significado Thoth
                <ChevronDown size={10} className="group-open:rotate-180 transition-transform ml-auto" />
              </summary>
              <div className="mt-2.5 pl-3 border-l-2 border-[#c4a86a]/30 space-y-1.5">
                {card.thoth_name !== card.name_en && (
                  <p className="text-[10px] uppercase tracking-wider text-[#9a7332]/70 font-display">
                    {card.thoth_name}{card.thoth_title ? ` — ${card.thoth_title}` : ""}
                  </p>
                )}
                <p className="text-sm text-[#4a3520]/70 leading-relaxed">{card.thoth_meaning}</p>
                {card.thoth_differences && (
                  <p className="text-xs text-[#9a7332]/50 italic">{card.thoth_differences}</p>
                )}
              </div>
            </details>
          )}

          {deckType === "thoth" && (
            <details className="group">
              <summary className="flex items-center gap-1.5 cursor-pointer text-[10px] uppercase tracking-wider text-[#9a7332]/60 hover:text-[#9a7332] transition-colors">
                <span className="text-[#c4a86a]">✦</span>
                Ver significado Rider-Waite
                <ChevronDown size={10} className="group-open:rotate-180 transition-transform ml-auto" />
              </summary>
              <div className="mt-2.5 pl-3 border-l-2 border-[#ddd0a8] ">
                <p className="text-sm text-[#4a3520]/70 leading-relaxed">
                  {reversed ? card.meaning_reversed : card.meaning_upright}
                </p>
              </div>
            </details>
          )}

          {/* Correspondências cabalísticas — só Arcanos Maiores */}
          {card.arcana === "major" && (card.hebrew_letter || card.tree_of_life_path) && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#9a7332]/60 border-t border-[#ddd0a8]/60 pt-3">
              {card.hebrew_letter && (
                <span>
                  Letra hebraica:{" "}
                  <strong className="text-[#9a7332]/80">{card.hebrew_letter}</strong>
                  {card.hebrew_letter_meaning && (
                    <span className="text-[#9a7332]/40"> ({card.hebrew_letter_meaning})</span>
                  )}
                </span>
              )}
              {card.tree_of_life_path && (
                <span className="text-[#9a7332]/50">{card.tree_of_life_path}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
