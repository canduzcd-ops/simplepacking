export type ThemeColor = 'neutral' | 'work' | 'sport' | 'travel' | 'wedding';

export interface Item {
    id: string;
    text: string;
    isCompleted: boolean;
    categoryId?: string;
}

export interface Scenario {
    id: string;
    name: string;
    emoji: string;
    color: ThemeColor;
    items: Item[];
    createdAt: number;
}

export interface Category {
    id: string;
    nameKey: string; // i18n key
    icon: string;
}

export interface AppSettings {
    language: 'tr' | 'en';
    theme: 'light' | 'dark';
    isOnboardingDone: boolean;
}

export interface DragItem {
    index: number;
    id: string;
    type: string;
}
