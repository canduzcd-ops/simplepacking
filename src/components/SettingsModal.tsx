import { useState, useRef } from 'react';
import { X, Moon, Sun, Globe, Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { usePackingStore } from '../store/packingStore';
import { useTranslation } from '../hooks/useTranslation';
import { cn } from '../lib/utils';
import { App as CapacitorApp } from '@capacitor/app';

interface SettingsModalProps {
    onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
    const { t, language } = useTranslation();
    const { settings, setLanguage, setTheme, exportData, importData } = usePackingStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleDownload = () => {
        const dataStr = exportData();
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `raca_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            const success = importData(content);
            setImportStatus(success ? 'success' : 'error');
            setTimeout(() => setImportStatus('idle'), 3000);
        };
        reader.readAsText(file);
    };

    const handleExit = async () => {
        await CapacitorApp.exitApp();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {t.settings.title}
                    </h2>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-full transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-6">

                    {/* Language */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {t.settings.language}
                        </label>
                        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
                            <button
                                onClick={() => setLanguage('tr')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all",
                                    language === 'tr' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                )}
                            >
                                <Globe className="w-3 h-3" /> Türkçe
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all",
                                    language === 'en' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                )}
                            >
                                <Globe className="w-3 h-3" /> English
                            </button>
                        </div>
                    </div>

                    {/* Theme */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {t.settings.theme}
                        </label>
                        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
                            <button
                                onClick={() => setTheme('light')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all",
                                    settings.theme === 'light' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                )}
                            >
                                <Sun className="w-3.5 h-3.5" /> Light
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all",
                                    settings.theme === 'dark' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                )}
                            >
                                <Moon className="w-3.5 h-3.5" /> Dark
                            </button>
                        </div>
                    </div>

                    {/* Backup & Restore */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {t.settings.backup}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={handleDownload} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <Download className="w-5 h-5 text-amber-500" />
                                <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 text-center">{t.settings.export}</span>
                            </button>
                            <button onClick={handleUploadClick} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors relative transition-all">
                                {importStatus === 'idle' && <Upload className="w-5 h-5 text-sky-500" />}
                                {importStatus === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500 animate-in zoom-in" />}
                                {importStatus === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 animate-in shake" />}
                                <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 text-center">
                                    {importStatus === 'idle' ? t.settings.import : importStatus === 'success' ? t.settings.importSuccess : t.settings.importError}
                                </span>
                                <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
                            </button>
                        </div>
                    </div>

                    {/* Footer App Info */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 text-center space-y-3">
                        <button onClick={handleExit} className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors">
                            {t.settings.exit}
                        </button>

                        <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {t.app.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                                v2.0.0
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
