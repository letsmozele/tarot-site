import tarotData from "@/data/tarot.json";
import { TarotDatabase, TarotCard } from "./types";

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

export function searchCards(query: string): TarotCard[] {
  const q = query.toLowerCase().trim();
  if (!q) return db.cards;
  return db.cards.filter(
    (c) =>
      c.name_pt.toLowerCase().includes(q) ||
      c.name_en.toLowerCase().includes(q) ||
      c.thoth_name.toLowerCase().includes(q) ||
      c.keywords_upright.some((k) => k.toLowerCase().includes(q)) ||
      (c.suit && c.suit.toLowerCase().includes(q))
  );
}

export function getCardById(id: string): TarotCard | undefined {
  return db.cards.find((c) => c.id === id);
}

export const SUITS = ["Copas", "Paus", "Espadas", "Ouros"] as const;
export const SUIT_COLORS: Record<string, string> = {
  Copas: "text-blue-300 border-blue-400",
  Paus: "text-orange-300 border-orange-400",
  Espadas: "text-slate-300 border-slate-400",
  Ouros: "text-yellow-300 border-yellow-500",
};
export const SUIT_BG: Record<string, string> = {
  Copas: "bg-blue-950/40 border-blue-800/40",
  Paus: "bg-orange-950/40 border-orange-800/40",
  Espadas: "bg-slate-800/40 border-slate-600/40",
  Ouros: "bg-yellow-950/40 border-yellow-800/40",
};

export const ELEMENT_SYMBOLS: Record<string, string> = {
  Fogo: "🔥",
  Água: "💧",
  Ar: "💨",
  Terra: "🌿",
};
