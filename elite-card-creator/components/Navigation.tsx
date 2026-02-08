import React, { useState } from 'react';
import { ViewMode } from '../types';
import { Menu, Hammer, LayoutGrid, ShoppingBag } from 'lucide-react';

interface NavigationProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSelect = (view: ViewMode) => {
    onViewChange(view);
    setIsOpen(false);
  };

  const getViewName = (view: ViewMode) => {
    if (view === 'FORGE') return 'Card Forge';
    if (view === 'SHOP') return 'Card Shop';
    return 'Card Collector';
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-start pointer-events-none">
      {/* Top Left Menu */}
      <div className="pointer-events-auto relative">
        <button
          onClick={toggleMenu}
          className="bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 hover:bg-slate-800 transition-all font-bold"
        >
          <Menu size={20} />
          <span className="hidden md:inline">{getViewName(currentView)}</span>
          <i className={`fas fa-chevron-down transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <button
              onClick={() => handleSelect('FORGE')}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-800 transition-colors ${
                currentView === 'FORGE' ? 'bg-slate-800 text-blue-400' : 'text-slate-300'
              }`}
            >
              <Hammer size={18} />
              <div className="flex flex-col">
                <span className="font-bold">Card Forge</span>
                <span className="text-[10px] opacity-70">Create custom legends</span>
              </div>
            </button>
            <div className="h-px bg-slate-800 w-full" />
            <button
              onClick={() => handleSelect('COLLECTOR_HOME')}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-800 transition-colors ${
                currentView === 'COLLECTOR_HOME' || currentView === 'BINDER' ? 'bg-slate-800 text-green-400' : 'text-slate-300'
              }`}
            >
              <LayoutGrid size={18} />
              <div className="flex flex-col">
                <span className="font-bold">Card Collector</span>
                <span className="text-[10px] opacity-70">View collection</span>
              </div>
            </button>
            <div className="h-px bg-slate-800 w-full" />
            <button
              onClick={() => handleSelect('SHOP')}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-800 transition-colors ${
                currentView === 'SHOP' ? 'bg-slate-800 text-amber-400' : 'text-slate-300'
              }`}
            >
              <ShoppingBag size={18} />
              <div className="flex flex-col">
                <span className="font-bold">Card Shop</span>
                <span className="text-[10px] opacity-70">Buy packs</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;