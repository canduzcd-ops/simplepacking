import { useState, useMemo } from 'react';
import { ArrowLeft, Trash2, Edit2, Plus, Check, RotateCcw, CheckSquare, Sparkles, X } from 'lucide-react';
import { usePackingStore } from '../store/packingStore';
import { useTranslation } from '../hooks/useTranslation';
import { cn } from '../lib/utils';
import { SUGGESTIONS, CATEGORIES } from '../data/suggestions';

interface ScenarioDetailProps {
    scenarioId: string;
    onBack: () => void;
}

export function ScenarioDetail({ scenarioId, onBack }: ScenarioDetailProps) {
    const { t } = useTranslation();
    const {
        scenarios,
        updateScenario,
        deleteScenario,
        addItem,
        toggleItem,
        deleteItem,
        resetItems
    } = usePackingStore();

    const scenario = scenarios.find((s) => s.id === scenarioId);

    const [newItemText, setNewItemText] = useState('');
    const [isRenaming, setIsRenaming] = useState(false);
    const [renameText, setRenameText] = useState('');
    const [confirmReset, setConfirmReset] = useState(false);

    // Suggested items based on scenario color (theme)
    const suggestions = useMemo(() => {
        if (!scenario) return [];
        const themeSuggestions = SUGGESTIONS[scenario.color] || [];
        // Filter out items already in the list
        const existingTexts = new Set(scenario.items.map(i => i.text.toLowerCase()));
        return themeSuggestions.filter(s => !existingTexts.has(s.toLowerCase()));
    }, [scenario]);

    if (!scenario) return null;

    const completedCount = scenario.items.filter((i) => i.isCompleted).length;
    const totalCount = scenario.items.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const handleRename = () => {
        if (renameText.trim()) {
            updateScenario(scenarioId, { name: renameText });
        }
        setIsRenaming(false);
    };

    const handleAddItem = (text: string = newItemText) => {
        if (!text.trim()) return;
        // Simple auto-categorization logic
        const lowerText = text.toLowerCase();
        let catId = 'cat_other';

        if (['pasaport', 'kimlik', 'bilet', 'cüzdan', 'wallet', 'ticket'].some(k => lowerText.includes(k))) catId = 'cat_docs';
        else if (['şarj', 'kablo', 'telefon', 'laptop', 'kulaklık', 'camera'].some(k => lowerText.includes(k))) catId = 'cat_tech';
        else if (['kıyafet', 'tişört', 'pantolon', 'çorap', 'ayakkabı', 'shirt', 'shoes'].some(k => lowerText.includes(k))) catId = 'cat_clothes';
        else if (['şampuan', 'diş', 'krem', 'havlu', 'soap', 'towel'].some(k => lowerText.includes(k))) catId = 'cat_care';

        addItem(scenarioId, text, catId);
        setNewItemText('');
    };

    const handleDelete = () => {
        if (confirm(t.ui.yes + '?')) {
            deleteScenario(scenarioId);
            onBack();
        }
    };

    return (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-medium px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> {t.scenario.back}
                </button>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => { setRenameText(scenario.name); setIsRenaming(true); }}
                        className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Header Card */}
            <div className="bg-white dark:bg-slate-800 border border-amber-100 dark:border-amber-900/30 p-4 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center text-2xl bg-amber-50 dark:bg-slate-700 rounded-xl border border-amber-200 dark:border-amber-900">
                            {scenario.emoji}
                        </div>
                        <div>
                            {isRenaming ? (
                                <input
                                    autoFocus
                                    value={renameText}
                                    onChange={(e) => setRenameText(e.target.value)}
                                    onBlur={handleRename}
                                    onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                                    className="text-lg font-bold bg-transparent border-b border-amber-500 focus:outline-none text-slate-900 dark:text-slate-100 w-full"
                                />
                            ) : (
                                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{scenario.name}</h2>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                    {t.theme[scenario.color]}
                                </span>
                                {progress === 100 && (
                                    <span className="text-[10px] text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
                                        {t.detail.completed}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-32 flex flex-col items-end gap-1">
                        <div className="text-[10px] font-bold text-slate-400">
                            {completedCount} / {totalCount}
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-amber-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Suggestions (Phase 3 Feature) */}
            {suggestions.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-wider shrink-0 px-1">
                        <Sparkles className="w-3 h-3" />
                        Suggested
                    </div>
                    {suggestions.slice(0, 5).map((sugg) => (
                        <button
                            key={sugg}
                            onClick={() => handleAddItem(sugg)}
                            className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 text-[10px] text-amber-700 dark:text-amber-300 whitespace-nowrap hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                        >
                            + {sugg}
                        </button>
                    ))}
                </div>
            )}

            {/* Items List */}
            <div className="space-y-6">
                {CATEGORIES.map((cat) => {
                    const catItems = scenario.items.filter(i => i.categoryId === cat.id);
                    if (catItems.length === 0) return null;

                    return (
                        <div key={cat.id} className="space-y-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
                                <span>{cat.icon}</span> {cat.nameKey}
                            </h3>
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden">
                                {catItems.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleItem(scenarioId, item.id)}
                                        className="group flex items-center gap-3 p-3 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 cursor-pointer transition-colors"
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                                            item.isCompleted
                                                ? "bg-amber-500 border-amber-500 text-white"
                                                : "border-slate-300 dark:border-slate-600 text-transparent group-hover:border-amber-400"
                                        )}>
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <span className={cn(
                                            "flex-1 text-sm font-medium transition-all",
                                            item.isCompleted ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-200"
                                        )}>
                                            {item.text}
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteItem(scenarioId, item.id); }}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 transition-all"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Uncategorized Items (fallback) */}
                {(() => {
                    const otherItems = scenario.items.filter(i => !i.categoryId || i.categoryId === 'cat_other');
                    if (otherItems.length === 0) return null;
                    return (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
                                <span>📦</span> Diğer
                            </h3>
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden">
                                {otherItems.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleItem(scenarioId, item.id)}
                                        className="group flex items-center gap-3 p-3 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 cursor-pointer transition-colors"
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                                            item.isCompleted
                                                ? "bg-amber-500 border-amber-500 text-white"
                                                : "border-slate-300 dark:border-slate-600 text-transparent group-hover:border-amber-400"
                                        )}>
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <span className={cn(
                                            "flex-1 text-sm font-medium transition-all",
                                            item.isCompleted ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-200"
                                        )}>
                                            {item.text}
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteItem(scenarioId, item.id); }}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 transition-all"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}

                {scenario.items.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-400 text-xs">
                        {t.detail.empty}
                    </div>
                )}
            </div>

            {/* Adding Input */}
            <div className="sticky bottom-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-700 p-3 -mx-4 -mb-6 md:mx-0 md:mb-0 md:rounded-2xl md:border md:relative">
                <form onSubmit={(e) => { e.preventDefault(); handleAddItem(); }} className="flex gap-2">
                    <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        placeholder={t.detail.inputPlaceholder}
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                    <button
                        type="submit"
                        className="bg-amber-500 text-white px-3 rounded-xl hover:bg-amber-600 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </form>

                {/* Action Bar */}
                <div className="flex justify-between items-center mt-2 text-[10px]">
                    {confirmReset ? (
                        <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-lg text-rose-600">
                            <span>{t.detail.confirmReset}</span>
                            <button onClick={() => { resetItems(scenarioId); setConfirmReset(false); }} className="font-bold hover:underline">{t.ui.yes}</button>
                            <button onClick={() => setConfirmReset(false)} className="hover:underline">{t.ui.no}</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setConfirmReset(true)}
                            className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            <RotateCcw className="w-3 h-3" /> {t.detail.reset}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            // Bulk check logic could go here, for now just simple
                        }}
                        className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <CheckSquare className="w-3 h-3" /> {t.detail.checkAll}
                    </button>
                </div>
            </div>
        </div>
    );
}
