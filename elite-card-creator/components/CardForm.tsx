import React, { useRef, useState } from 'react';
import { SportType } from '../types';

interface CardFormProps {
  onGenerate: (prompt: string, sport: SportType) => void;
  onImageUpload: (imageSrc: string) => void;
  selectedSport: SportType;
  onSportChange: (sport: SportType) => void;
  isLoading: boolean;
}

const CardForm: React.FC<CardFormProps> = ({
  onGenerate,
  onImageUpload,
  selectedSport,
  onSportChange,
  isLoading,
}) => {
  const [prompt, setPrompt] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setImagePreview(result);
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    // Reset to default image in parent
    onImageUpload('https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1469&auto=format&fit=crop');
  };

  const sports: { id: SportType; label: string; icon: string; color: string }[] = [
    { id: 'basketball', label: 'BASKETBALL', icon: 'fa-basketball-ball', color: 'orange-500' },
    { id: 'football', label: 'FOOTBALL', icon: 'fa-football-ball', color: 'green-500' },
    { id: 'soccer', label: 'SOCCER', icon: 'fa-futbol', color: 'blue-500' },
    { id: 'baseball', label: 'BASEBALL', icon: 'fa-baseball-bat-ball', color: 'red-500' },
  ];

  return (
    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm">
      <div className="space-y-6">
        
        {/* Prompt Section */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Player Description</label>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your player... e.g. 'A lightning-fast point guard from the year 2099' or 'The greatest home-run hitter in history.'"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-slate-200"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Player Photo</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-blue-500 cursor-pointer transition-colors group relative"
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            
            {!imagePreview ? (
              <div className="flex flex-col items-center">
                <i className="fas fa-image text-3xl mb-2 text-slate-500 group-hover:text-blue-400"></i>
                <p className="text-sm text-slate-400">Upload Player Photo</p>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <img src={imagePreview} alt="Preview" className="w-12 h-12 object-cover rounded border border-slate-600" />
                <span className="text-sm text-blue-400 font-bold">PHOTO READY</span>
                <button
                  onClick={handleResetImage}
                  className="text-xs text-red-400 hover:underline ml-2"
                >
                  Change
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sport Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sports.map((sport) => (
            <button
              key={sport.id}
              onClick={() => onSportChange(sport.id)}
              className={`p-3 rounded-lg bg-slate-900 border transition-all duration-200 ${
                selectedSport === sport.id
                  ? `border-${sport.color} ring-2 ring-${sport.color}/20`
                  : 'border-slate-700 hover:border-slate-500'
              }`}
            >
              <i className={`fas ${sport.icon} text-${sport.color} mb-1 block text-lg`}></i>
              <span className="block text-[10px] font-bold text-slate-300">{sport.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => onGenerate(prompt, selectedSport)}
          disabled={isLoading || !prompt}
          className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-5 rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 transition-all active:scale-95 ${
            (isLoading || !prompt) ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <div className="loader"></div>
          ) : (
            <span className="tracking-widest">FORGE LEGENDARY CARD</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CardForm;