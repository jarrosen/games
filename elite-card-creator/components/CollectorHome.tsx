import React from 'react';
import { ViewMode } from '../types';
import { Library, ShoppingBag } from 'lucide-react';

interface CollectorHomeProps {
  onNavigate: (view: ViewMode) => void;
  cardCount: number;
}

const CollectorHome: React.FC<CollectorHomeProps> = ({ onNavigate, cardCount }) => {
  return (
    <div className="w-full max-w-5xl mx-auto pt-20 animate-[fadeIn_0.5s_ease-out]">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-200 to-slate-500 bebas tracking-widest mb-4">
          HEADQUARTERS
        </h2>
        <p className="text-slate-400 text-lg">Manage your legendary collection.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-8 px-4">
        {/* Binder Option */}
        <div 
          onClick={() => onNavigate('BINDER')}
          className="group relative bg-slate-800 rounded-3xl p-1 overflow-hidden cursor-pointer shadow-2xl transition-all hover:scale-[1.02] hover:shadow-blue-900/40 w-full max-w-md"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          <div className="bg-[#1a202c] rounded-[22px] h-full p-8 flex flex-col items-center justify-center text-center border border-slate-700 group-hover:border-blue-500/50 transition-colors relative z-20 min-h-[300px]">
            <div className="w-24 h-24 bg-blue-900/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Library size={48} className="text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2 bebas tracking-wider">THE BINDER</h3>
            <p className="text-slate-400 mb-6">View your collection of {cardCount} legendary cards.</p>
            <span className="px-6 py-2 bg-slate-800 rounded-full text-blue-300 text-sm font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
              OPEN BINDER
            </span>
          </div>
        </div>

        {/* Shop Option */}
        <div 
          onClick={() => onNavigate('SHOP')}
          className="group relative bg-slate-800 rounded-3xl p-1 overflow-hidden cursor-pointer shadow-2xl transition-all hover:scale-[1.02] hover:shadow-amber-900/40 w-full max-w-md"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          <div className="bg-[#1a202c] rounded-[22px] h-full p-8 flex flex-col items-center justify-center text-center border border-slate-700 group-hover:border-amber-500/50 transition-colors relative z-20 min-h-[300px]">
            <div className="w-24 h-24 bg-amber-900/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShoppingBag size={48} className="text-amber-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2 bebas tracking-wider">THE SHOP</h3>
            <p className="text-slate-400 mb-6">Acquire new talent. Spend your credits.</p>
            <span className="px-6 py-2 bg-slate-800 rounded-full text-amber-300 text-sm font-bold group-hover:bg-amber-600 group-hover:text-white transition-colors">
              VISIT SHOP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorHome;