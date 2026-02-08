import React, { useState } from 'react';
import { CollectedCard, SportType } from '../types';
import { CardVisual } from './CardVisual';
import { ArrowLeft, ShoppingBag, Package } from 'lucide-react';

interface ShopProps {
  onBack: () => void;
  balance: number;
  onBuy: (cost: number, cards: CollectedCard[]) => void;
}

// Helper for ID generation that works in all contexts
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper to generate a random card for the demo shop
const generateRandomCard = (): CollectedCard => {
  const sports: SportType[] = ['basketball', 'football', 'soccer', 'baseball'];
  const sport = sports[Math.floor(Math.random() * sports.length)];
  
  const rarities = ['Rare', 'Rare', 'Rare', 'Epic', 'Epic', 'Legendary'];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  
  const themes = ['modern', 'retro', 'street', 'futuristic'];
  const theme = themes[Math.floor(Math.random() * themes.length)];

  // Basic randomization for demo purposes
  const ratingBase = rarity === 'Legendary' ? 90 : rarity === 'Epic' ? 80 : 70;
  const rating = ratingBase + Math.floor(Math.random() * 9);

  // Value calculation for game economy
  const multiplier = rarity === 'Legendary' ? 25 : rarity === 'Epic' ? 10 : 5;
  const value = Math.floor(rating * multiplier);

  // Mock Images (using Unsplash source for variety)
  const mockImages = [
    'https://images.unsplash.com/photo-1546519638-68e109498ee3?q=80&w=1000&auto=format&fit=crop', // Basketball
    'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=1000&auto=format&fit=crop', // Football
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop', // Soccer
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop'  // Baseball
  ];

  return {
    id: generateId(),
    name: 'MYSTERY RECRUIT',
    team: 'FREE AGENT',
    sport,
    rating,
    rarity,
    bio: 'Scouted from the local leagues, showing immense promise.',
    badge: rarity === 'Legendary' ? 'GOAT' : 'ROOKIE',
    designTheme: theme,
    image: mockImages[Math.floor(Math.random() * mockImages.length)],
    timestamp: Date.now(),
    value: value
  };
};

const Shop: React.FC<ShopProps> = ({ onBack, balance, onBuy }) => {
  const [openingPack, setOpeningPack] = useState<string | null>(null);
  const [newCards, setNewCards] = useState<CollectedCard[]>([]);

  const packs = [
    { id: 'bronze', name: 'Bronze Pack', cost: 100, color: 'border-orange-700', bg: 'bg-orange-900/20', cardCount: 3 },
    { id: 'silver', name: 'Silver Pack', cost: 250, color: 'border-slate-400', bg: 'bg-slate-400/20', cardCount: 4 },
    { id: 'gold', name: 'Gold Pack', cost: 500, color: 'border-yellow-500', bg: 'bg-yellow-500/20', cardCount: 5 },
  ];

  const handleBuy = (pack: typeof packs[0]) => {
    if (balance < pack.cost) return; // Should show toast, handled by button disabled state mostly

    setOpeningPack(pack.id);
    
    // Simulate API delay
    setTimeout(() => {
      const generatedCards = Array.from({ length: pack.cardCount }).map(() => generateRandomCard());
      onBuy(pack.cost, generatedCards);
      setNewCards(generatedCards);
      setOpeningPack(null);
    }, 1500);
  };

  const handleClearNewCards = () => {
    setNewCards([]);
  };

  if (newCards.length > 0) {
    return (
      <div className="min-h-screen pt-20 px-4 flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
        <h2 className="text-3xl font-bold text-white mb-8">PACK OPENED!</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {newCards.map((card) => (
                <div key={card.id} className="w-[280px] h-[400px]">
                    <CardVisual data={card} imageSrc={card.image} sport={card.sport} />
                    <div className="mt-2 text-center text-amber-400 font-bold">
                        Value: {card.value}
                    </div>
                </div>
            ))}
        </div>
        <button 
            onClick={handleClearNewCards}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-lg"
        >
            CONTINUE
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto pt-24 px-4 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-slate-300" />
        </button>
        <h2 className="text-4xl font-black bebas tracking-wider text-white">THE SHOP</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packs.map((pack) => (
          <div 
            key={pack.id} 
            className={`relative bg-slate-900 border-2 ${pack.color} rounded-2xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105`}
          >
            {openingPack === pack.id && (
                <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center rounded-2xl backdrop-blur-sm">
                    <div className="loader"></div>
                </div>
            )}
            
            <div className={`w-20 h-20 rounded-full ${pack.bg} flex items-center justify-center mb-4`}>
                <Package size={32} className="text-white opacity-80" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{pack.name}</h3>
            <p className="text-slate-400 text-sm mb-6">Contains {pack.cardCount} random cards.</p>
            
            <button
                onClick={() => handleBuy(pack)}
                disabled={balance < pack.cost || openingPack !== null}
                className={`mt-auto w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 ${
                    balance >= pack.cost 
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
            >
                <ShoppingBag size={18} />
                {balance >= pack.cost ? `BUY - ${pack.cost}` : 'INSUFFICIENT FUNDS'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;