import React, { useRef, useState } from 'react';
import { CardData, SportType } from '../types';
import { CardVisual } from './CardVisual';
import { Download, Save } from 'lucide-react';

interface CardPreviewProps {
  data: CardData;
  imageSrc: string;
  sport: SportType;
  onSave?: () => void;
}

const CardPreview: React.FC<CardPreviewProps> = ({ data, imageSrc, sport, onSave }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (e.clientY - rect.top - centerY) / 10;
    const rotateY = (centerX - (e.clientX - rect.left)) / 10;
    cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSave) {
        onSave();
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Small Preview Card */}
      <div
        className="perspective-1000 w-[350px] h-[500px] cursor-pointer group"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFullscreen(true)}
      >
        <div
          id="output-card"
          ref={cardRef}
          className="w-full h-full transition-transform duration-100 ease-out"
        >
          <CardVisual 
            data={data} 
            imageSrc={imageSrc} 
            sport={sport}
          />
        </div>
        
        {/* Hover Hint */}
        <div className="absolute -bottom-8 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 text-xs">
          <i className="fas fa-expand mr-1"></i> Click to enlarge
        </div>
      </div>

      <div className="mt-12 flex gap-4 w-full justify-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-bold transition-all flex items-center gap-2 text-white"
        >
          <Download size={18} /> SAVE PDF
        </button>

        {onSave && (
             <button
             onClick={handleSaveClick}
             disabled={isSaved || !data.name}
             className={`px-6 py-3 border rounded-xl text-sm font-bold transition-all flex items-center gap-2 text-white ${
                 isSaved 
                 ? 'bg-green-600 border-green-500' 
                 : 'bg-blue-600 hover:bg-blue-500 border-blue-500'
             } ${!data.name ? 'opacity-50 cursor-not-allowed' : ''}`}
           >
             <Save size={18} /> {isSaved ? 'SAVED!' : 'ADD TO BINDER'}
           </button>
        )}
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <div 
            className="relative w-full max-w-lg animate-[fadeIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="absolute -top-12 right-0 flex gap-4">
              <button 
                onClick={() => setIsFullscreen(false)}
                className="text-white hover:text-red-400 transition-colors flex items-center gap-2 font-bold"
              >
                <i className="fas fa-times text-2xl"></i> CLOSE
              </button>
            </div>
            
            <div className="aspect-[3.5/5] w-full">
              <CardVisual 
                data={data} 
                imageSrc={imageSrc} 
                sport={sport}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPreview;