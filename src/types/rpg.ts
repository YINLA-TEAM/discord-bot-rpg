export type CharacterClass = "warrior" | "mage" | "thief";

export interface ClassStats {
  hp: number;
  mp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Player {
  userId: string;
  username: string;
  class: CharacterClass;
  level: number;
  experience: number;
  money: number;
  diamonds: number;
  player_class_stats?: PlayerClassStats[];
  daily_streak: number;
  total_signin: number;
  last_signin?: string;
  created_at: string;
  last_activity?: string;
}

export interface PlayerClassStats {
  userId: string;
  class: CharacterClass;
  hp: number;
  mp: number;
  attack: number;
  defense: number;
  speed: number;
  created_at: string;
  last_activity?: string;
}
