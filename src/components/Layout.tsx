interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700 shadow-2xl rounded-3xl p-6 min-h-[600px] flex flex-col relative overflow-hidden">
                {children}
            </div>
        </div>
    );
}
