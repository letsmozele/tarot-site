import tarotData from "@/data/tarot.json";
import { TarotDatabase, TarotCard, DeckType } from "./types";

const db = tarotData as TarotDatabase;

export function getAllCards(): TarotCard[] {
  return db.cards;
}

export function getMajorArcana(): TarotCard[] {
  return db.cards.filter((c) => c.arcana === "major");
}

export function getMinorArcana(): TarotCard[] {
  return db.cards.filter((c) => c.arcana === "minor");
}

export function getCardsBySuit(suit: string): TarotCard[] {
  return db.cards.filter((c) => c.suit === suit);
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function searchCards(query: string): TarotCard[] {
  const q = normalize(query.trim());
  if (!q) return db.cards;
  return db.cards.filter(
    (c) =>
      normalize(c.name_pt).includes(q) ||
      normalize(c.name_en).includes(q) ||
      normalize(c.thoth_name).includes(q) ||
      c.keywords_upright.some((k) => normalize(k).includes(q)) ||
      c.keywords_reversed.some((k) => normalize(k).includes(q)) ||
      (c.suit && normalize(c.suit).includes(q))
  );
}

export function getCardById(id: string): TarotCard | undefined {
  return db.cards.find((c) => c.id === id);
}

export function getCardDisplayName(card: TarotCard, deck: DeckType): string {
  return deck === "thoth" ? card.thoth_name : card.name_pt;
}

export function getCardMeaning(
  card: TarotCard,
  deck: DeckType,
  reversed: boolean
): string {
  if (reversed) return card.meaning_reversed;
  return deck === "thoth" ? card.thoth_meaning || card.meaning_upright : card.meaning_upright;
}

export const SUITS = ["Copas", "Paus", "Espadas", "Ouros"] as const;

export const SUIT_META: Record<
  string,
  { symbol: string; element: string; thoth: string; color: string; bg: string; badge: string }
> = {
  Copas: {
    symbol: "☽",
    element: "Água",
    thoth: "Cups",
    color: "text-[#1e4d8c]",
    bg: "bg-[#eef3ff]",
    badge: "border-[#bfcfef] text-[#1e4d8c]",
  },
  Paus: {
    symbol: "✦",
    element: "Fogo",
    thoth: "Wands",
    color: "text-[#7a2e0a]",
    bg: "bg-[#fff3ed]",
    badge: "border-[#f0c8a8] text-[#7a2e0a]",
  },
  Espadas: {
    symbol: "⊕",
    element: "Ar",
    thoth: "Swords",
    color: "text-[#2a3a4a]",
    bg: "bg-[#f0f4f8]",
    badge: "border-[#c0ced8] text-[#2a3a4a]",
  },
  Ouros: {
    symbol: "◈",
    element: "Terra",
    thoth: "Disks",
    color: "text-[#6b5012]",
    bg: "bg-[#fffae8]",
    badge: "border-[#e0c870] text-[#6b5012]",
  },
};

// Keep legacy export for backward compat
export const SUIT_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(SUIT_META).map(([k, v]) => [k, `${v.color} border-current`])
);

export const ELEMENT_SYMBOLS: Record<string, string> = {
  Fogo: "✦",
  Água: "☽",
  Ar: "⊕",
  Terra: "◈",
};
