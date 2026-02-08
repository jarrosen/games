import React, { useState, useCallback } from 'react';
import CardForm from './components/CardForm';
import SettingsModal from './components/SettingsModal';
import CardPreview from './components/CardPreview';
import Toast from './components/Toast';
import Navigation from './components/Navigation';
import CollectorHome from './components/CollectorHome';
import Binder from './components/Binder';
import Shop from './components/Shop';
import { generateCardData, generateCardImage } from './services/geminiService';
import { CardData, SportType, ToastState, ViewMode, CollectedCard } from './types';

// Helper for ID generation that works in all contexts
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const App: React.FC = () => {
  // --- Global State ---
  const [view, setView] = useState<ViewMode>('FORGE');
  const [collection, setCollection] = useState<CollectedCard[]>([]);
  const [balance, setBalance] = useState<number>(1000);
  const [showSettings, setShowSettings] = useState(false);

  // --- Forge State ---
  const [selectedSport, setSelectedSport] = useState<SportType>('basketball');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success',
  });
  const [cardData, setCardData] = useState<CardData>({
    name: '',
    team: '',
    rating: 0,
    bio: '',
    badge: '',
    rarity: 'rare',
    designTheme: 'modern'
  });

  const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1469&auto=format&fit=crop';
  const displayImage = generatedImage || uploadedImage || DEFAULT_IMAGE;

  // --- Actions ---

  const handleGenerate = useCallback(async (prompt: string, sport: SportType) => {
    if (!prompt) {
      setToast({ show: true, message: "Please enter a description!", type: "error" });
      return;
    }

    setIsLoading(true);
    setToast({ show: true, message: "Forging your legend...", type: "success" });

    try {
      const isReferenceImage = uploadedImage?.startsWith('data:');
      const referenceToUse = isReferenceImage ? uploadedImage : undefined;

      const [data, imgBase64] = await Promise.all([
        generateCardData(prompt, sport),
        generateCardImage(prompt, sport, referenceToUse || undefined)
      ]);

      setCardData(data);
      if (imgBase64) {
        setGeneratedImage(imgBase64);
      }
      setToast({ show: true, message: "Legendary Card Forged!", type: "success" });
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.toString();
      if (errorMsg.includes('403') || errorMsg.includes('PERMISSION_DENIED')) {
        setToast({ show: true, message: "Access denied. Check API Key.", type: "error" });
      } else {
        setToast({ show: true, message: "Forging failed. Check inputs.", type: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage]);

  const saveToBinder = useCallback(() => {
    const newCard: CollectedCard = {
      ...cardData,
      id: generateId(),
      image: displayImage,
      sport: selectedSport,
      timestamp: Date.now()
    };
    setCollection(prev => [newCard, ...prev]);
    setToast({ show: true, message: "Added to Binder!", type: "success" });
  }, [cardData, displayImage, selectedSport]);

  const handleBuyPack = useCallback((cost: number, newCards: CollectedCard[]) => {
    setBalance(prev => prev - cost);
    setCollection(prev => [...newCards, ...prev]);
    setToast({ show: true, message: `Pack Opened! +${newCards.length} Cards`, type: "success" });
  }, []);

  const closeToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  const handleImageUpload = (imageSrc: string) => {
    setUploadedImage(imageSrc);
    setGeneratedImage(null);
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      <Navigation
        currentView={view}
        onViewChange={setView}
        onOpenSettings={() => setShowSettings(true)}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {view === 'FORGE' && (
        <div className="pt-24 p-4 md:p-8 animate-[fadeIn_0.5s_ease-out]">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-10">
              <h1 className="text-5xl font-black bebas tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
                ELITE CARD GENERATOR
              </h1>
              <p className="text-slate-400">
                Design legendary sports cards with Master Card Smith AI
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <CardForm
                onGenerate={handleGenerate}
                onImageUpload={handleImageUpload}
                selectedSport={selectedSport}
                onSportChange={setSelectedSport}
                isLoading={isLoading}
              />
              <CardPreview
                data={cardData}
                imageSrc={displayImage}
                sport={selectedSport}
                onSave={cardData.name ? saveToBinder : undefined}
              />
            </div>
          </div>
        </div>
      )}

      {view === 'COLLECTOR_HOME' && (
        <CollectorHome
          onNavigate={setView}
          cardCount={collection.length}
        />
      )}

      {view === 'BINDER' && (
        <Binder
          cards={collection}
          onBack={() => setView('COLLECTOR_HOME')}
        />
      )}

      {view === 'SHOP' && (
        <Shop
          balance={balance}
          onBuy={handleBuyPack}
          onBack={() => setView('COLLECTOR_HOME')}
        />
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />
    </div>
  );
};

export default App;