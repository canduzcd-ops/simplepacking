import { Settings } from 'lucide-react';
import { usePackingStore } from '../store/packingStore';

interface HeaderProps {
    onOpenSettings: () => void;
}

export function Header({ onOpenSettings }: HeaderProps) {
    return (
        <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 select-none">
                <div className="relative">
                    <svg width="32" height="32" viewBox="0 0 1024 1024" className="drop-shadow-sm">
                        <defs>
                            <linearGradient id="logo-grad-head" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <path d="M800 300H700 V200 C700 144.77 655.23 100 600 100 H400 C344.77 100 300 144.77 300 200 V300 H200 C144.77 300 100 344.77 100 400 V800 C100 855.23 144.77 900 200 900 H800 C855.23 900 900 855.23 900 800 V400 C900 344.77 855.23 300 800 300 Z M400 200 H600 V300 H400 V200 Z" fill="url(#logo-grad-head)" />
                        <path d="M420 650 L320 550 L250 620 L420 790 L750 460 L680 390 Z" fill="white" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 leading-none">
                        RACA <span className="text-amber-500">Simple Packing</span>
                    </h1>
                </div>
            </div>

            <button
                onClick={onOpenSettings}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                aria-label="Settings"
            >
                <Settings className="w-6 h-6" />
            </button>
        </header>
    );
}
