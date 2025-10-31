import type { ClassStats, CharacterClass } from "@/types/rpg";

export const classStats: Record<CharacterClass, ClassStats> = {
  warrior: { hp: 120, mp: 30, attack: 15, defense: 10, speed: 5 },
  mage: { hp: 70, mp: 120, attack: 20, defense: 5, speed: 8 },
  thief: { hp: 90, mp: 50, attack: 12, defense: 6, speed: 15 },
};

export const classMap: Record<CharacterClass | any, string> = {
  warrior: "戰士",
  mage: "法師",
  thief: "盜賊",
};
