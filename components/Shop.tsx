import React, { useState } from 'react';
import { Item, ItemCategory } from '../types';
import { SHOP_ITEMS } from '../constants';
import { ShoppingBag, Coins } from 'lucide-react';

interface ShopProps {
  balance: number;
  onBuy: (item: Item) => void;
  onClose: () => void;
}

export const Shop: React.FC<ShopProps> = ({ balance, onBuy, onClose }) => {
  const [filter, setFilter] = useState<ItemCategory | 'ALL'>('ALL');

  const filteredItems = SHOP_ITEMS.filter(item => 
    filter === 'ALL' ? true : item.category === filter
  );

  return (
    <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md sketchy-box overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-pastel-yellow p-4 border-b-4 border-black flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" /> Shop
          </h2>
          <button onClick={onClose} className="bg-red-400 text-white px-3 py-1 sketchy-btn hover:bg-red-500 font-bold">
            X
          </button>
        </div>

        {/* Balance */}
        <div className="bg-white p-3 border-b-4 border-black flex justify-center items-center gap-2">
          <span className="font-bold text-lg">Your Balance:</span>
          <div className="bg-yellow-300 px-3 py-1 sketchy-btn flex items-center gap-1 font-mono font-bold">
            <Coins size={16} /> {balance}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto p-2 gap-2 bg-gray-100 border-b-4 border-black no-scrollbar">
          {['ALL', ...Object.values(ItemCategory)].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as ItemCategory | 'ALL')}
              className={`px-4 py-2 sketchy-btn font-bold whitespace-nowrap text-sm ${
                filter === cat ? 'bg-pastel-purple text-black' : 'bg-white text-gray-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4 bg-pastel-blue">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white sketchy-box p-3 flex flex-col items-center gap-2 shadow-md relative group">
              <div className="text-4xl">{item.icon}</div>
              <h3 className="font-bold text-center leading-tight">{item.name}</h3>
              <p className="text-xs text-gray-500 text-center line-clamp-2">{item.description}</p>
              
              <div className="mt-auto w-full pt-2">
                <button
                  onClick={() => onBuy(item)}
                  disabled={balance < item.price}
                  className={`w-full py-2 sketchy-btn font-bold flex items-center justify-center gap-1 ${
                    balance >= item.price 
                      ? 'bg-pastel-green hover:brightness-95' 
                      : 'bg-gray-300 cursor-not-allowed opacity-50'
                  }`}
                >
                  <Coins size={14} /> {item.price}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};