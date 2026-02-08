import React from 'react';
import { CardData, SportType } from '../types';

interface CardVisualProps {
  data: CardData;
  imageSrc: string;
  sport?: SportType; // Optional, can be used for theming if needed
}

export const CardVisual: React.FC<CardVisualProps> = ({ data, imageSrc, sport }) => {
  // Determine Theme Color based on sport or fallback (could be passed in, but recalculated here for standalone usage)
  let themeColor = '#f97316'; // Default orange
  if (sport) {
    const themeColors: Record<SportType, string> = {
      basketball: '#f97316',
      football: '#22c55e',
      soccer: '#3b82f6',
      baseball: '#ef4444',
    };
    themeColor = themeColors[sport];
  } else {
    // Fallback if sport isn't strictly typed or available in some contexts
    themeColor = '#cbd5e1'; 
  }

  const getRarityClass = (rarity: string) => {
    const r = rarity?.toLowerCase() || 'rare';
    if (r.includes('legendary')) return 'rarity-legendary';
    if (r.includes('epic')) return 'rarity-epic';
    return 'rarity-rare';
  };

  const getNameStyle = (theme: string | undefined): React.CSSProperties => {
    switch (theme) {
      case 'retro':
        return {
          fontFamily: '"Alfa Slab One", cursive',
          background: `linear-gradient(to bottom, #fff 40%, ${themeColor} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,0.9))',
          transform: 'skew(-5deg)',
          letterSpacing: '0.05em',
        };
      case 'street':
        return {
          fontFamily: '"Permanent Marker", cursive',
          color: '#ffffff',
          textShadow: `0 0 10px ${themeColor}, 3px 3px 0 #000`,
          transform: 'rotate(-2deg)',
        };
      case 'futuristic':
        return {
          fontFamily: '"Righteous", cursive',
          color: '#00f2ff',
          textShadow: `0 0 5px #00f2ff, 0 0 15px ${themeColor}`,
          letterSpacing: '0.15em',
        };
      case 'classic':
        return {
          fontFamily: '"Cinzel", serif',
          background: 'linear-gradient(45deg, #d4af37, #fdf5e6, #d4af37)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          fontWeight: 700,
        };
      case 'pixel':
        return {
          fontFamily: '"Press Start 2P", cursive',
          color: '#fff',
          textShadow: '4px 4px 0 #000',
          fontSize: '1.2rem',
          lineHeight: '1.6',
        };
      case 'modern':
      default:
        return {
          fontFamily: '"Bebas Neue", cursive',
          color: 'white',
          letterSpacing: '0.05em',
          textShadow: '0 4px 8px rgba(0,0,0,0.5)',
        };
    }
  };

  const nameStyle = getNameStyle(data.designTheme);
  const rarityClass = getRarityClass(data.rarity);

  return (
    <div
      className={`w-full h-full bg-[#1e293b] rounded-[20px] relative overflow-hidden border-[8px] border-[#334155] shadow-2xl holo-shimmer ${rarityClass}`}
    >
      <img
        src={imageSrc}
        alt="Player"
        className="absolute inset-0 w-full h-full object-cover filter contrast-110 brightness-110 z-0"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />

      <div className="relative z-20 w-full h-full flex flex-col justify-between p-4">


        <div className="flex flex-col items-center pb-8">
          <div className="text-center mb-2">
            <p
              className="text-[12px] font-bold uppercase tracking-[0.3em] drop-shadow-lg"
              style={{ color: themeColor, textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
            >
              {data.team || 'THE SQUAD'}
            </p>
          </div>

          <div className="text-center">
            <h2
              className="text-4xl leading-tight transition-all duration-300"
              style={nameStyle}
            >
              {data.name || 'GENERATE PLAYER'}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};
