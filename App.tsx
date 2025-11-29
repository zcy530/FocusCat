
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PetRender } from './components/PetRender';
import { Shop } from './components/Shop';
import { FocusTimer } from './components/FocusTimer';
import { RoomBackground } from './components/RoomBackground';
import { generatePetThought } from './services/geminiService';
import { 
  PetState, 
  GameState, 
  Item, 
  ItemCategory,
  InventoryItem,
  PetAction
} from './types';
import { INITIAL_PET_STATE, INITIAL_GAME_STATE } from './constants';
import { Coins, ShoppingBag, Brain, Utensils, Home, Keyboard } from 'lucide-react';

const App: React.FC = () => {
  const [pet, setPet] = useState<PetState>(INITIAL_PET_STATE);
  const [game, setGame] = useState<GameState>(INITIAL_GAME_STATE);
  const [activeModal, setActiveModal] = useState<'NONE' | 'SHOP' | 'FOCUS' | 'INVENTORY'>('NONE');
  const [inventoryTab, setInventoryTab] = useState<ItemCategory>(ItemCategory.FOOD);
  
  // Focus Mode
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Camera State
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  
  // Input State
  const keysPressed = useRef<Set<string>>(new Set());

  // Use ref to prevent closure staleness in intervals
  const petRef = useRef(pet);
  useEffect(() => { petRef.current = pet; }, [pet]);

  // --- COLLISION LOGIC (1200px Width) ---
  const isValidPosition = (x: number, y: number) => {
    // 1. Ground Floor (Living Area)
    // x: [50, 1150], y: [1000, 1550]
    const onGround = (x > 50 && x < 1150 && y > 1000 && y < 1550);

    // 2. Loft Zone (Platform on the Right)
    // x: [500, 1150], y: [500, 800]
    const onLoft = (x > 500 && x < 1150 && y > 500 && y < 800);

    // 3. Stairs (Connecting Left Ground to Right Loft)
    // x: [150, 500], y: [800, 1050]
    const onStairs = (x > 150 && x < 550 && y > 780 && y < 1050);

    return onGround || onLoft || onStairs;
  };

  // --- KEYBOARD CONTROLS LOOP ---
  useEffect(() => {
    const moveSpeed = 6;

    const loop = setInterval(() => {
      if (activeModal !== 'NONE' || isFocusMode) return;

      const keys = keysPressed.current;
      let dx = 0;
      let dy = 0;

      if (keys.has('ArrowUp') || keys.has('w')) dy -= moveSpeed;
      if (keys.has('ArrowDown') || keys.has('s')) dy += moveSpeed;
      if (keys.has('ArrowLeft') || keys.has('a')) dx -= moveSpeed;
      if (keys.has('ArrowRight') || keys.has('d')) dx += moveSpeed;

      if (dx !== 0 || dy !== 0) {
        setPet(prev => {
          const nextX = prev.x + dx;
          const nextY = prev.y + dy;

          // Check Collision
          if (isValidPosition(nextX, nextY)) {
             return {
                ...prev,
                x: nextX,
                y: nextY,
                action: PetAction.WALK,
                direction: dx !== 0 ? (dx > 0 ? 'right' : 'left') : prev.direction
             };
          }
          return prev;
        });
      } else {
        // If no keys pressed and currently walking, stop
        setPet(prev => {
            if (prev.action === PetAction.WALK) {
                return { ...prev, action: PetAction.IDLE };
            }
            return prev;
        });
      }
    }, 16); // ~60fps

    return () => clearInterval(loop);
  }, [activeModal, isFocusMode]);

  // Input Event Listeners
  useEffect(() => {
    const down = (e: KeyboardEvent) => keysPressed.current.add(e.key);
    const up = (e: KeyboardEvent) => keysPressed.current.delete(e.key);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // --- CAMERA FOLLOW LOOP ---
  useEffect(() => {
    const followLoop = setInterval(() => {
        const pet = petRef.current;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        
        // World Dimensions
        const ROOM_W = 1200;
        const ROOM_H = 1600;

        let targetX, targetY;

        // Horizontal Camera Logic
        if (screenW >= ROOM_W) {
            // Center the room if screen is wider
            targetX = -(screenW - ROOM_W) / 2;
        } else {
            // Follow pet but clamp to room edges
            // Target is to center pet: pet.x - screenW / 2
            // Clamp min: 0 (Left edge)
            // Clamp max: ROOM_W - screenW (Right edge)
            targetX = Math.max(0, Math.min(ROOM_W - screenW, pet.x - screenW / 2));
        }

        // Vertical Camera Logic
        if (screenH >= ROOM_H) {
             targetY = -(screenH - ROOM_H) / 2;
        } else {
             targetY = Math.max(0, Math.min(ROOM_H - screenH, pet.y - screenH / 2));
        }

        setCamera(prev => ({
            x: prev.x + (targetX - prev.x) * 0.1, // Smooth lerp
            y: prev.y + (targetY - prev.y) * 0.1
        }));

    }, 16);
    return () => clearInterval(followLoop);
  }, []);

  // --- STAT DECAY ---
  useEffect(() => {
    const decayInterval = setInterval(() => {
      setPet((prev) => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 1),
        happiness: Math.max(0, prev.happiness - 0.5),
        health: (prev.hunger === 0 || prev.happiness === 0) 
          ? Math.max(0, prev.health - 1) 
          : prev.health
      }));
    }, 10000); 
    return () => clearInterval(decayInterval);
  }, []);

  // --- GEMINI & THOUGHTS ---
  const triggerPetThought = useCallback(async (context: string) => {
    const thought = await generatePetThought(pet, context);
    setPet(prev => ({ ...prev, thought }));
    setTimeout(() => setPet(prev => ({ ...prev, thought: '' })), 5000);
  }, [pet]);

  // --- HANDLERS ---
  const handleFocusStart = () => {
    setIsFocusMode(true);
    setPet(prev => ({ ...prev, action: PetAction.SIT }));
    triggerPetThought("I'll stay quiet while you work! Good luck!");
  };

  const handleFocusComplete = (minutes: number) => {
    setIsFocusMode(false);
    const earnedCoins = minutes * 2; 
    setGame(prev => ({ ...prev, coins: prev.coins + earnedCoins, totalFocusMinutes: prev.totalFocusMinutes + minutes }));
    setActiveModal('NONE');
    triggerPetThought(`You focused for ${minutes} minutes! I'm so proud!`);
  };

  const buyItem = (item: Item) => {
    if (game.coins >= item.price) {
      setGame(prev => {
        const existingItem = prev.inventory.find(i => i.id === item.id);
        const newInventory = existingItem 
          ? prev.inventory.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
          : [...prev.inventory, { ...item, quantity: 1 }];
        return { ...prev, coins: prev.coins - item.price, inventory: newInventory };
      });
      triggerPetThought(`Ooh! Is that a ${item.name}?`);
    }
  };

  const useItem = (invItem: InventoryItem) => {
    setPet(prev => {
      let newState = { ...prev };
      if (invItem.category === ItemCategory.FOOD) {
        newState.hunger = Math.min(100, newState.hunger + (invItem.effect?.hunger || 0));
        newState.happiness = Math.min(100, newState.happiness + (invItem.effect?.happiness || 0));
        newState.health = Math.min(100, newState.health + (invItem.effect?.health || 0));
        newState.action = PetAction.IDLE;
        triggerPetThought("Yummy! Thank you!");
      } 
      else if (invItem.category === ItemCategory.MEDICINE) {
        newState.health = Math.min(100, newState.health + (invItem.effect?.health || 0));
        triggerPetThought("I feel much better now.");
      }
      else if (invItem.category === ItemCategory.CLOTHES) {
        if (invItem.id.startsWith('hat') || invItem.id.startsWith('bow') || invItem.id.startsWith('glasses')) {
           newState.accessoryId = newState.accessoryId === invItem.id ? undefined : invItem.id;
        } else {
           newState.outfitId = newState.outfitId === invItem.id ? undefined : invItem.id;
        }
        triggerPetThought("Do I look cute?");
        return newState; 
      }
      return newState;
    });

    if (invItem.category === ItemCategory.FOOD || invItem.category === ItemCategory.MEDICINE) {
      setGame(prev => ({
        ...prev,
        inventory: prev.inventory.map(i => i.id === invItem.id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0)
      }));
    }
  };

  const getInventoryByCategory = (cat: ItemCategory) => game.inventory.filter(i => i.category === cat);

  return (
    <div className="h-screen w-full bg-[#F3E5F5] font-sans selection:bg-pastel-purple text-stone-800 relative overflow-hidden flex flex-col select-none">
      
      {/* Noise Overlay */}
      <div className="noise-overlay pointer-events-none z-50"></div>

      {/* --- WORLD CONTAINER --- */}
      <div 
        className="relative w-full h-full"
      >
          {/* The Game World - Transformed by Camera */}
          <div 
             className="absolute top-0 left-0 w-[1200px] h-[1600px] will-change-transform shadow-2xl"
             style={{ transform: `translate(${-camera.x}px, ${-camera.y}px)` }}
          >
             <RoomBackground />
             
             {/* Render Placed Furniture manually */}
             {game.placedFurniture.includes('plant') && <div className="absolute top-[1250px] left-[100px] text-8xl pointer-events-none z-10">🌿</div>}
             {game.placedFurniture.includes('lamp') && <div className="absolute top-[600px] left-[1000px] text-8xl pointer-events-none z-10">💡</div>}
             {game.placedFurniture.includes('rug') && <div className="absolute top-[1300px] left-[600px] text-8xl pointer-events-none z-[1] opacity-50">🧶</div>}

             {/* PET */}
             <PetRender 
                state={pet} 
                onClick={() => !isFocusMode && triggerPetThought("Meow!")} 
             />
          </div>
      </div>


      {/* --- HUD --- */}

      {/* Controls Hint */}
      {!isFocusMode && (
         <div className="absolute top-20 right-4 z-40 bg-white/80 p-2 rounded-xl sketchy-box flex items-center gap-2">
            <Keyboard size={20}/>
            <span className="text-xs font-bold">Use Arrow Keys to Move</span>
         </div>
      )}

      {/* Top Bar */}
      {!isFocusMode && (
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-30 pointer-events-none transition-opacity duration-500">
          <div className="bg-white/90 backdrop-blur-sm sketchy-box p-3 shadow-lg pointer-events-auto">
            <h1 className="font-bold text-lg leading-none">{pet.name}</h1>
            <div className="flex flex-col gap-1 mt-2 text-xs font-bold">
                <div className="flex items-center gap-1">
                  <span className="w-16">Hunger</span>
                  <div className="w-24 h-3 bg-gray-200 rounded-full border border-black overflow-hidden">
                      <div className="h-full bg-orange-400" style={{ width: `${pet.hunger}%` }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-16">Happy</span>
                  <div className="w-24 h-3 bg-gray-200 rounded-full border border-black overflow-hidden">
                      <div className="h-full bg-pink-400" style={{ width: `${pet.happiness}%` }}></div>
                  </div>
                </div>
            </div>
          </div>
          <div className="bg-yellow-300 sketchy-btn px-4 py-2 shadow-lg flex items-center gap-2 font-black text-xl pointer-events-auto">
            <Coins /> {game.coins}
          </div>
        </div>
      )}

      {/* Bottom Menu */}
      <div className={`absolute -bottom-20 left-1/2 -translate-x-1/2 w-[140%] h-64 bg-white border-t-4 border-black rounded-[50%_50%_0_0] flex justify-center items-start pt-12 gap-12 sm:gap-24 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] transition-transform duration-500 ${isFocusMode ? 'translate-y-full' : 'translate-y-0'}`}>
        <button onClick={() => setActiveModal('FOCUS')} className="flex flex-col items-center gap-1 group mt-8 transition-transform hover:scale-110">
          <div className="w-16 h-16 bg-pastel-purple sketchy-btn flex items-center justify-center group-active:translate-y-1 transition-all shadow-md"><Brain size={32} /></div>
          <span className="font-bold text-sm">Focus</span>
        </button>
        <button onClick={() => { setActiveModal('INVENTORY'); setInventoryTab(ItemCategory.FOOD); }} className="flex flex-col items-center gap-1 group -mt-6 transition-transform hover:scale-110">
          <div className="w-20 h-20 bg-pastel-pink sketchy-btn flex items-center justify-center group-active:translate-y-1 transition-all shadow-lg border-4"><Utensils size={36} /></div>
          <span className="font-bold text-sm">Care</span>
        </button>
        <button onClick={() => setActiveModal('SHOP')} className="flex flex-col items-center gap-1 group mt-8 transition-transform hover:scale-110">
          <div className="w-16 h-16 bg-pastel-yellow sketchy-btn flex items-center justify-center group-active:translate-y-1 transition-all shadow-md"><ShoppingBag size={32} /></div>
          <span className="font-bold text-sm">Shop</span>
        </button>
      </div>

      {/* --- Modals --- */}
      {activeModal === 'SHOP' && <Shop balance={game.coins} onBuy={buyItem} onClose={() => setActiveModal('NONE')} />}
      {(activeModal === 'FOCUS' || isFocusMode) && <FocusTimer onStart={handleFocusStart} onComplete={handleFocusComplete} onCancel={() => { setIsFocusMode(false); setActiveModal('NONE'); }} />}
      {activeModal === 'INVENTORY' && (
         <div className="absolute inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
           <div className="bg-white w-full max-w-md sketchy-box overflow-hidden flex flex-col h-[60vh]">
              <div className="p-4 bg-pastel-pink border-b-4 border-black flex justify-between items-center">
                 <h2 className="text-xl font-bold flex items-center gap-2"><Home /> Inventory</h2>
                 <button onClick={() => setActiveModal('NONE')} className="bg-red-400 text-white px-3 sketchy-btn font-bold">X</button>
              </div>
              <div className="flex p-2 gap-2 border-b-4 border-black bg-gray-50 overflow-x-auto no-scrollbar">
                 <button onClick={() => setInventoryTab(ItemCategory.FOOD)} className={`p-2 sketchy-btn ${inventoryTab === ItemCategory.FOOD ? 'bg-orange-200' : 'bg-white'}`}><Utensils size={20}/></button>
                 <button onClick={() => setInventoryTab(ItemCategory.CLOTHES)} className={`p-2 sketchy-btn ${inventoryTab === ItemCategory.CLOTHES ? 'bg-blue-200' : 'bg-white'}`}><Keyboard size={20}/></button>
                 <button onClick={() => setInventoryTab(ItemCategory.MEDICINE)} className={`p-2 sketchy-btn ${inventoryTab === ItemCategory.MEDICINE ? 'bg-green-200' : 'bg-white'}`}><Brain size={20}/></button>
                 <button onClick={() => setInventoryTab(ItemCategory.FURNITURE)} className={`p-2 sketchy-btn ${inventoryTab === ItemCategory.FURNITURE ? 'bg-purple-200' : 'bg-white'}`}><Home size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-stone-100 grid grid-cols-3 gap-3 content-start">
                 {getInventoryByCategory(inventoryTab).length === 0 ? <div className="col-span-3 text-center text-gray-400 mt-10">Empty...</div> : 
                    getInventoryByCategory(inventoryTab).map(item => (
                       <button key={item.id} onClick={() => useItem(item)} className="bg-white p-2 sketchy-box flex flex-col items-center gap-1 active:scale-95 transition-transform">
                          <div className="text-3xl">{item.icon}</div>
                          <div className="text-xs font-bold text-center leading-none">{item.name}</div>
                          <div className="bg-black text-white text-[10px] px-2 rounded-full absolute top-1 right-1">x{item.quantity}</div>
                       </button>
                    ))
                 }
              </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default App;
