
import { Item, ItemCategory, PetAction } from './types';

export const SHOP_ITEMS: Item[] = [
  // Food
  { id: 'carrot', name: 'Crunchy Carrot', description: 'A healthy snack.', price: 10, category: ItemCategory.FOOD, icon: '🥕', effect: { hunger: 20 } },
  { id: 'cake', name: 'Strawberry Cake', description: 'Sweet treat!', price: 25, category: ItemCategory.FOOD, icon: '🍰', effect: { hunger: 30, happiness: 10 } },
  { id: 'milk', name: 'Warm Milk', description: 'Good for sleep.', price: 15, category: ItemCategory.FOOD, icon: '🥛', effect: { hunger: 10, health: 5 } },
  
  // Clothes
  { id: 'bow_red', name: 'Red Bow', description: 'Very dashing.', price: 100, category: ItemCategory.CLOTHES, icon: '🎀' },
  { id: 'hat_blue', name: 'Blue Cap', description: 'Sporty look.', price: 120, category: ItemCategory.CLOTHES, icon: '🧢' },
  { id: 'glasses', name: 'Smart Glasses', description: 'Look intelligent.', price: 150, category: ItemCategory.CLOTHES, icon: '👓' },

  // Furniture (Icons updated to look good in the new loft)
  { id: 'plant', name: 'Potted Plant', description: 'Fresh air.', price: 200, category: ItemCategory.FURNITURE, icon: '🌿' },
  { id: 'rug', name: 'Cozy Rug', description: 'Soft on the feet.', price: 300, category: ItemCategory.FURNITURE, icon: '🧶' },
  { id: 'lamp', name: 'Floor Lamp', description: 'Brightens the mood.', price: 250, category: ItemCategory.FURNITURE, icon: '💡' },

  // Medicine
  { id: 'potion', name: 'Healing Potion', description: 'Cures sickness.', price: 50, category: ItemCategory.MEDICINE, icon: '🧪', effect: { health: 50 } },
];

export const INITIAL_PET_STATE = {
  name: 'Mochi',
  hunger: 80,
  happiness: 80,
  health: 100,
  isSleeping: false,
  thought: "Use Arrow Keys to move me!",
  action: PetAction.IDLE,
  x: 600, // Start on ground floor center (1200 / 2)
  y: 1300,
  direction: 'right' as const,
};

export const INITIAL_GAME_STATE = {
  coins: 50,
  inventory: [],
  placedFurniture: [],
  totalFocusMinutes: 0,
};
