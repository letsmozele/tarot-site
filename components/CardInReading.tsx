"use client";

import { useState } from "react";
import { RotateCcw, X, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { ReadingCard, DeckType } from "@/lib/types";
import { SUIT_COLORS, ELEMENT_SYMBOLS } from "@/lib/cards";

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
  const suitColorClass = card.suit ? SUIT_COLORS[card.suit]?.split(" ")[0] : "text-purple-300";
  const elementSymbol = ELEMENT_SYMBOLS[card.element] || "✦";

  const cardName = deckType === "thoth" ? card.thoth_name : card.name_pt;
  const keywords = reversed ? card.keywords_reversed : card.keywords_upright;
  const meaning = reversed ? card.meaning_reversed : card.meaning_upright;
  const thothMeaning = card.thoth_meaning;

  return (
    <div className="bg-[#0d0820]/80 border border-purple-800/30 rounded-2xl overflow-hidden animate-fade-in hover:border-purple-700/50 transition-all">
      {/* Card Header */}
      <div className="flex items-start gap-3 p-4 pb-3">
        {/* Position number */}
        <div className="w-7 h-7 rounded-full bg-purple-900/50 border border-purple-700/40 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-xs font-bold text-purple-400">{index + 1}</span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Position label */}
          {editingPosition ? (
            <input
              autoFocus
              value={posInput}
              onChange={(e) => setPosInput(e.target.value)}
              onBlur={() => { onUpdatePosition(posInput); setEditingPosition(false); }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") { onUpdatePosition(posInput); setEditingPosition(false); } }}
              placeholder="Nome da posição..."
              className="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-2 py-0.5 text-xs text-purple-300 outline-none mb-1"
            />
          ) : (
            <button
              onClick={() => setEditingPosition(true)}
              className="text-xs text-purple-500 hover:text-purple-300 transition-colors mb-1 text-left"
            >
              {item.position || "Clique para nomear posição"}
            </button>
          )}

          {/* Card Name */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="font-semibold text-[#e8e0f0] text-base leading-tight">{cardName}</h3>
            {deckType === "thoth" && card.thoth_name !== card.name_en && (
              <span className="text-xs text-[#c9a84c]/70">(Thoth)</span>
            )}
            {deckType === "rws" && card.name_pt !== card.name_en && (
              <span className="text-xs text-purple-500">{card.name_en}</span>
            )}
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className={`text-xs ${suitColorClass} opacity-80`}>
              {elementSymbol} {card.element}
            </span>
            {card.suit && <span className={`text-xs ${suitColorClass} opacity-60`}>· {card.suit}</span>}
            {card.astrology && <span className="text-xs text-purple-500/70">· {card.astrology}</span>}
            {deckType === "thoth" && card.thoth_title && (
              <span className="text-xs text-[#c9a84c]/50 italic">· {card.thoth_title}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onToggleReversed}
            title={reversed ? "Invertida — clique para normal" : "Normal — clique para inverter"}
            className={`p-1.5 rounded-lg transition-all text-xs font-medium ${
              reversed
                ? "bg-red-900/40 border border-red-700/50 text-red-300"
                : "bg-purple-900/30 border border-purple-700/30 text-purple-400"
            }`}
          >
            <RotateCcw size={13} className={reversed ? "rotate-180" : ""} />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg bg-purple-900/30 border border-purple-700/30 text-purple-400 hover:text-purple-200 transition-colors"
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg bg-red-950/30 border border-red-900/30 text-red-500 hover:text-red-300 hover:bg-red-950/50 transition-all"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Reversed badge */}
      {reversed && (
        <div className="px-4 pb-2">
          <span className="inline-flex items-center gap-1 text-xs bg-red-900/30 text-red-400 border border-red-800/40 rounded-full px-2 py-0.5">
            ↕ Invertida
          </span>
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Keywords */}
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw) => (
              <span
                key={kw}
                className={`px-2 py-0.5 text-xs rounded-full border ${
                  reversed
                    ? "bg-red-950/30 text-red-300/80 border-red-800/30"
                    : "bg-purple-900/30 text-purple-300/80 border-purple-800/30"
                }`}
              >
                {kw}
              </span>
            ))}
          </div>

          {/* RWS Meaning */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-wider">
                {deckType === "rws" ? "Rider-Waite" : "Thoth"} — {reversed ? "Invertida" : "Normal"}
              </span>
            </div>
            <p className="text-sm text-[#d0c8e0] leading-relaxed">
              {deckType === "rws" ? meaning : (reversed ? card.meaning_reversed : thothMeaning || meaning)}
            </p>
          </div>

          {/* Thoth extra section (when in RWS mode, show Thoth as secondary) */}
          {deckType === "rws" && thothMeaning && (
            <details className="group">
              <summary className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors list-none">
                <Sparkles size={11} />
                Ver significado Thoth
                <ChevronDown size={11} className="group-open:rotate-180 transition-transform ml-auto" />
              </summary>
              <div className="mt-2 pl-3 border-l border-[#c9a84c]/20">
                {card.thoth_name !== card.name_en && (
                  <p className="text-xs text-[#c9a84c]/70 mb-1.5 italic">
                    {card.thoth_name}{card.thoth_title ? ` — ${card.thoth_title}` : ""}
                  </p>
                )}
                <p className="text-sm text-[#d0c8e0]/70 leading-relaxed">{thothMeaning}</p>
                {card.thoth_differences && (
                  <p className="text-xs text-purple-400/60 mt-2 italic">{card.thoth_differences}</p>
                )}
              </div>
            </details>
          )}

          {/* Thoth mode: show RWS as secondary */}
          {deckType === "thoth" && (
            <details className="group">
              <summary className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-purple-500/60 hover:text-purple-400 transition-colors list-none">
                <span>✦</span>
                Ver significado Rider-Waite
                <ChevronDown size={11} className="group-open:rotate-180 transition-transform ml-auto" />
              </summary>
              <div className="mt-2 pl-3 border-l border-purple-700/30">
                <p className="text-sm text-[#d0c8e0]/70 leading-relaxed">{meaning}</p>
              </div>
            </details>
          )}

          {/* Cabalístico (só arcanos maiores) */}
          {card.arcana === "major" && card.hebrew_letter && (
            <div className="flex items-center gap-3 text-xs text-purple-500/60 border-t border-purple-900/30 pt-3">
              <span>Letra Hebraica: <strong className="text-purple-400">{card.hebrew_letter}</strong></span>
              {card.tree_of_life_path && <span>· {card.tree_of_life_path}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
