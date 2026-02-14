import { useState } from 'react';
import { X } from 'lucide-react';
import { usePackingStore } from '../store/packingStore';
import { useTranslation } from '../hooks/useTranslation';
import { ThemeColor } from '../types';
import { cn } from '../lib/utils';

interface NewScenarioModalProps {
    onClose: () => void;
}

const COLORS: { key: ThemeColor; bg: string }[] = [
    { key: 'neutral', bg: 'bg-gray-400' },
    { key: 'work', bg: 'bg-sky-400' },
    { key: 'sport', bg: 'bg-green-500' },
    { key: 'travel', bg: 'bg-orange-500' },
    { key: 'wedding', bg: 'bg-pink-500' },
];

export function NewScenarioModal({ onClose }: NewScenarioModalProps) {
    const { t } = useTranslation();
    const addScenario = usePackingStore((state) => state.addScenario);

    const [name, setName] = useState('');
    const [emoji, setEmoji] = useState('🎒');
    const [selectedColor, setSelectedColor] = useState<ThemeColor>('neutral');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        addScenario(name, emoji, selectedColor);
        onClose();
    };

    return (
        <div className="border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 bg-white/95 dark:bg-slate-800/95 shadow-sm mb-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {t.scenario.newTitle}
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-[1fr,80px] gap-3">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                            {t.scenario.nameLabel}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t.scenario.namePlaceholder}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            autoFocus
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                            {t.scenario.iconLabel}
                        </label>
                        <input
                            type="text"
                            value={emoji}
                            onChange={(e) => setEmoji(e.target.value)}
                            maxLength={2}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                        {t.scenario.colorLabel}
                    </span>
                    <div className="flex gap-2">
                        {COLORS.map((c) => (
                            <button
                                key={c.key}
                                type="button"
                                onClick={() => setSelectedColor(c.key)}
                                className={cn(
                                    "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] border transition-all",
                                    selectedColor === c.key
                                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-slate-900 dark:text-slate-100 ring-1 ring-amber-500"
                                        : "border-transparent bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                                )}
                            >
                                <span className={cn("w-2 h-2 rounded-full", c.bg)} />
                                {t.theme[c.key]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t.scenario.save}
                    </button>
                </div>
            </form>
        </div>
    );
}
