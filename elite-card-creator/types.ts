export type SportType = 'basketball' | 'football' | 'soccer' | 'baseball';

export interface CardData {
    name: string;
    team: string;
    rating: number;
    bio: string;
    badge: string;
    rarity: 'Legendary' | 'Epic' | 'Rare' | string;
    designTheme: 'modern' | 'retro' | 'street' | 'futuristic' | 'classic' | 'pixel' | string;
}

export interface CollectedCard extends CardData {
    id: string;
    image: string;
    sport: SportType;
    timestamp: number;
    value?: number;
}

export interface ToastState {
    show: boolean;
    message: string;
    type: 'success' | 'error';
}

export type ViewMode = 'FORGE' | 'COLLECTOR_HOME' | 'BINDER' | 'SHOP';