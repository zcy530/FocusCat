
export enum ItemCategory {
  FOOD = 'FOOD',
  CLOTHES = 'CLOTHES',
  FURNITURE = 'FURNITURE',
  MEDICINE = 'MEDICINE'
}

export enum PetAction {
  IDLE = 'IDLE',
  WALK = 'WALK',
  SIT = 'SIT',
  LIE = 'LIE',
  SLEEP = 'SLEEP',
  YAWN = 'YAWN',
  PLAY = 'PLAY'
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ItemCategory;
  icon: string; // Emoji or SVG path identifier
  effect?: {
    hunger?: number;
    happiness?: number;
    health?: number;
  };
}

export interface PetState {
  name: string;
  hunger: number; // 0-100 (100 is full)
  happiness: number; // 0-100 (100 is happy)
  health: number; // 0-100 (100 is healthy)
  isSleeping: boolean; // Overrides specific actions if true
  outfitId?: string;
  accessoryId?: string;
  thought: string;
  // Spatial movement fields
  action: PetAction;
  x: number;
  y: number;
  direction: 'left' | 'right';
}

export interface InventoryItem extends Item {
  quantity: number;
}

export interface GameState {
  coins: number;
  inventory: InventoryItem[];
  placedFurniture: string[]; // IDs of placed furniture
  totalFocusMinutes: number;
}
