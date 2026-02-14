import { useState } from 'react';
import { Plus, Trash2, ChevronRight } from 'lucide-react';
import { usePackingStore } from '../store/packingStore';
import { useTranslation } from '../hooks/useTranslation';
import { NewScenarioModal } from './NewScenarioModal';
import { ThemeColor } from '../types';
import { cn } from '../lib/utils';

interface ScenarioListProps {
    onSelectScenario: (id: string) => void;
}

const THEME_STYLES: Record<ThemeColor, string> = {
    neutral: 'text-gray-500 bg-gray-100 dark:bg-gray-900/50 dark:text-gray-400',
    work: 'text-sky-600 bg-sky-100 dark:bg-sky-900/30 dark:text-sky-400',
    sport: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
    travel: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
    wedding: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400',
};

export function ScenarioList({ onSelectScenario }: ScenarioListProps) {
    const { t } = useTranslation();
    const scenarios = usePackingStore((state) => state.scenarios);
    const deleteScenario = usePackingStore((state) => state.deleteScenario);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    return (
        <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <h2 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t.home.scenarios}
                    </h2>
                </div>
                {!isNewModalOpen && (
                    <button
                        onClick={() => setIsNewModalOpen(true)}
                        className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        {t.home.new}
                    </button>
                )}
            </div>

            {isNewModalOpen && (
                <NewScenarioModal onClose={() => setIsNewModalOpen(false)} />
            )}

            {scenarios.length === 0 && !isNewModalOpen && (
                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-400">
                    <p className="text-sm">{t.home.empty}</p>
                </div>
            )}

            <div className="space-y-2.5">
                {scenarios.map((scenario) => {
                    const completedCount = scenario.items.filter((i) => i.isCompleted).length;
                    const totalCount = scenario.items.length;
                    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                    return (
                        <div
                            key={scenario.id}
                            onClick={() => onSelectScenario(scenario.id)}
                            className="group relative flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl hover:border-amber-200 dark:hover:border-amber-900/50 hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="w-10 h-10 flex items-center justify-center text-xl bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                {scenario.emoji}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                        {scenario.name}
                                    </h3>
                                    <span className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                                        THEME_STYLES[scenario.color]
                                    )}>
                                        {t.theme[scenario.color]}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium tabular-nums">
                                        {completedCount}/{totalCount}
                                    </span>
                                </div>
                            </div>

                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
