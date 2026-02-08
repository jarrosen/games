import React, { useState } from 'react';
import { CollectedCard } from '../types';
import { CardVisual } from './CardVisual';
import { ArrowLeft, Search } from 'lucide-react';

interface BinderProps {
  cards: CollectedCard[];
  onBack: () => void;
}

const Binder: React.FC<BinderProps> = ({ cards, onBack }) => {
  const [filter, setFilter] = useState('');

  const filteredCards = cards.filter(c => 
    c.name.toLowerCase().includes(filter.toLowerCase()) || 
    c.team.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen pt-24 px-4 pb-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-slate-300" />
            </button>
            <h2 className="text-4xl font-black bebas tracking-wider text-white">MY COLLECTION</h2>
        </div>
        
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
                type="text" 
                placeholder="Search cards..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
            />
        </div>
      </div>

      {/* Grid */}
      {cards.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-400 mb-2">Your Binder is Empty</h3>
            <p className="text-slate-500">Go to the Forge to create your first legendary card.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {filteredCards.map((card) => (
                <div key={card.id} className="group relative">
                    <div className="aspect-[3.5/5] transition-transform duration-300 group-hover:scale-[1.02] group-hover:z-10 shadow-2xl">
                        <CardVisual data={card} imageSrc={card.image} sport={card.sport} />
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Binder;