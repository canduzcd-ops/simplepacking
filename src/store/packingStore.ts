import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Scenario, Item, AppSettings, ThemeColor } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface PackingState {
    scenarios: Scenario[];
    settings: AppSettings;

    // Actions
    addScenario: (name: string, emoji: string, color: ThemeColor) => void;
    deleteScenario: (id: string) => void;
    updateScenario: (id: string, updates: Partial<Scenario>) => void;

    addItem: (scenarioId: string, text: string, categoryId?: string) => void;
    toggleItem: (scenarioId: string, itemId: string) => void;
    deleteItem: (scenarioId: string, itemId: string) => void;
    resetItems: (scenarioId: string) => void;

    setLanguage: (lang: 'tr' | 'en') => void;
    setTheme: (theme: 'light' | 'dark') => void;
    completeOnboarding: () => void;

    // Backup/Restore
    exportData: () => string;
    importData: (jsonData: string) => boolean;
}

export const usePackingStore = create<PackingState>()(
    persist(
        (set, get) => ({
            scenarios: [],
            settings: {
                language: 'tr',
                theme: 'light',
                isOnboardingDone: false,
            },

            addScenario: (name, emoji, color) => set((state) => ({
                scenarios: [
                    {
                        id: uuidv4(),
                        name,
                        emoji: emoji || '🎒',
                        color,
                        items: [],
                        createdAt: Date.now(),
                    },
                    ...state.scenarios,
                ],
            })),

            deleteScenario: (id) => set((state) => ({
                scenarios: state.scenarios.filter((s) => s.id !== id),
            })),

            updateScenario: (id, updates) => set((state) => ({
                scenarios: state.scenarios.map((s) =>
                    s.id === id ? { ...s, ...updates } : s
                ),
            })),

            addItem: (scenarioId, text, categoryId) => set((state) => ({
                scenarios: state.scenarios.map((s) => {
                    if (s.id !== scenarioId) return s;
                    return {
                        ...s,
                        items: [
                            ...s.items,
                            { id: uuidv4(), text, isCompleted: false, categoryId },
                        ],
                    };
                }),
            })),

            toggleItem: (scenarioId, itemId) => set((state) => ({
                scenarios: state.scenarios.map((s) => {
                    if (s.id !== scenarioId) return s;
                    return {
                        ...s,
                        items: s.items.map((i) =>
                            i.id === itemId ? { ...i, isCompleted: !i.isCompleted } : i
                        ),
                    };
                }),
            })),

            deleteItem: (scenarioId, itemId) => set((state) => ({
                scenarios: state.scenarios.map((s) => {
                    if (s.id !== scenarioId) return s;
                    return {
                        ...s,
                        items: s.items.filter((i) => i.id !== itemId),
                    };
                }),
            })),

            resetItems: (scenarioId) => set((state) => ({
                scenarios: state.scenarios.map((s) => {
                    if (s.id !== scenarioId) return s;
                    return {
                        ...s,
                        items: s.items.map((i) => ({ ...i, isCompleted: false })),
                    };
                }),
            })),

            setLanguage: (lang) => set((state) => {
                document.documentElement.lang = lang;
                return { settings: { ...state.settings, language: lang } };
            }),

            setTheme: (theme) => set((state) => {
                if (theme === 'dark') document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
                return { settings: { ...state.settings, theme } };
            }),

            completeOnboarding: () => set((state) => ({
                settings: { ...state.settings, isOnboardingDone: true }
            })),

            exportData: () => {
                const { scenarios, settings } = get();
                return JSON.stringify({ scenarios, settings, version: 2 });
            },

            importData: (jsonData) => {
                try {
                    const data = JSON.parse(jsonData);
                    if (!data.scenarios || !Array.isArray(data.scenarios)) return false;

                    set({
                        scenarios: data.scenarios,
                        settings: { ...get().settings, ...data.settings }
                    });
                    return true;
                } catch (e) {
                    console.error("Import failed", e);
                    return false;
                }
            }
        }),
        {
            name: 'raca-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
