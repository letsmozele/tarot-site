export interface TarotCard {
  id: string;
  name_pt: string;
  name_en: string;
  arcana: "major" | "minor";
  number: number | string;
  suit: "Copas" | "Paus" | "Espadas" | "Ouros" | null;
  element: string;
  astrology: string;
  hebrew_letter?: string;
  hebrew_letter_meaning?: string;
  tree_of_life_path?: string;
  keywords_upright: string[];
  keywords_reversed: string[];
  meaning_upright: string;
  meaning_reversed: string;
  thoth_name: string;
  thoth_title?: string;
  thoth_path?: string;
  thoth_astrology?: string;
  thoth_sephira?: string;
  thoth_meaning: string;
  thoth_differences?: string;
  image_description?: string;
}

export interface TarotDatabase {
  meta: {
    version: string;
    total_cards: number;
    description: string;
    suits: Record<string, { element: string; thoth_name: string; astrology: string }>;
    thoth_court_cards: { note: string; mapping: Record<string, string> };
    thoth_renamed_major: Record<string, string>;
  };
  cards: TarotCard[];
}

export interface ReadingCard {
  card: TarotCard;
  reversed: boolean;
  position?: string;
}

export type DeckType = "rws" | "thoth";
