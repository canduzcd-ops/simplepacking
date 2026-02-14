# Final QA Adjustments

Below are the full contents of files modified during the final QA audit to address offline support, UX improvements, and build configuration.

## 1. Vite Configuration (`vite.config.js`)
**Change:** Added `base: './'` for proper relative path handling in Capacitor/Offline mode.

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: './',
    base: './', // CRITICAL for offline/webview
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
    server: {
        port: 3000,
        open: true,
    },
});
```

## 2. Settings Logic (`src/ui/Settings.js`)
**Change:** Added Focus management, Escape key listener, Body scroll lock, and Click-outside closing.

```javascript
import { t, setLanguage, getLanguage, subscribeI18n } from "../i18n/index.js";
import { initUserOnboarding } from "../core/user.js";

export class Settings {
    constructor() {
        this.isOpen = false;
        this.render();
        this.bindEvents();

        // Re-render on language change
        subscribeI18n(() => {
            this.updateTexts();
        });
    }

    render() {
        // Create modal container if not exists
        if (!document.getElementById("settings-modal")) {
            const modal = document.createElement("div");
            modal.id = "settings-modal";
            modal.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm hidden fade-in";
            modal.innerHTML = `
                <div class="glass-card w-[90%] max-w-sm p-5 md:p-6 relative bg-white/90">
                    <button id="settings-close" class="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    
                    <h2 class="text-lg font-bold text-slate-900 mb-6" data-i18n="settings.title">${t("settings.title")}</h2>
                    
                    <div class="space-y-6">
                        <!-- Language -->
                        <div class="space-y-2">
                            <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider" data-i18n="settings.language">
                                ${t("settings.language")}
                            </label>
                            <div class="flex p-1 bg-slate-100 rounded-xl">
                                <button class="flex-1 py-2 text-sm font-medium rounded-lg transition-all ${getLanguage() === 'tr' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}" data-lang="tr">
                                    ${t("settings.lang.tr")}
                                </button>
                                <button class="flex-1 py-2 text-sm font-medium rounded-lg transition-all ${getLanguage() === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}" data-lang="en">
                                    ${t("settings.lang.en")}
                                </button>
                            </div>
                        </div>

                        <!-- Onboarding Reset -->
                        <div>
                            <button id="btn-reset-onboarding" class="w-full py-3 px-4 bg-amber-50 text-amber-900 font-medium rounded-xl text-sm hover:bg-amber-100 transition-colors flex items-center justify-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" />
                                    <path d="M3 3v9h9" />
                                </svg>
                                <span data-i18n="settings.showOnboarding">${t("settings.showOnboarding")}</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="mt-6 pt-6 border-t border-slate-200 text-center">
                         <p class="text-[10px] text-slate-400">
                            v1.0.1 • ${t("app.name")}
                         </p>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        // Add settings trigger button to header if app content exists
        const header = document.querySelector("header .flex.items-center.justify-between.gap-3");
        if (header && !document.getElementById("btn-open-settings")) {
            const btn = document.createElement("button");
            btn.id = "btn-open-settings";
            btn.className = "icon-btn w-9 h-9 border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 bg-white shadow-sm";
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            `;
            // Append as last child of the header row
            header.appendChild(btn);

            btn.addEventListener("click", () => this.open());
        }
    }

    bindEvents() {
        const modal = document.getElementById("settings-modal");

        // Close on Escape key
        document.addEventListener("keydown", (e) => {
            if (this.isOpen && e.key === "Escape") {
                this.close();
            }
        });

        // Close button
        document.getElementById("settings-close")?.addEventListener("click", () => this.close());
        
        // Click outside
        modal?.addEventListener("click", (e) => {
            if (e.target === modal) this.close();
        });

        // Language Switch
        const btns = modal.querySelectorAll("[data-lang]");
        btns.forEach(btn => {
            btn.addEventListener("click", () => {
                const lang = btn.getAttribute("data-lang");
                setLanguage(lang);

                // Update visuals instantly
                btns.forEach(b => {
                    if (b.getAttribute("data-lang") === lang) {
                        b.className = "flex-1 py-2 text-sm font-medium rounded-lg transition-all bg-white shadow-sm text-slate-900";
                    } else {
                        b.className = "flex-1 py-2 text-sm font-medium rounded-lg transition-all text-slate-500 hover:text-slate-700";
                    }
                });

                // Reload to apply everywhere cleanly
                setTimeout(() => location.reload(), 300);
            });
        });

        // Reset Onboarding
        document.getElementById("btn-reset-onboarding")?.addEventListener("click", () => {
            if (confirm(t("detail.confirmReset"))) {
                localStorage.removeItem("raca-intro-completed");
                location.reload();
            }
        });
    }

    updateTexts() {
        const els = document.querySelectorAll("[data-i18n]");
        els.forEach(el => {
            const key = el.getAttribute("data-i18n");
            el.innerText = t(key);
        });
    }

    open() {
        const modal = document.getElementById("settings-modal");
        if (modal) {
            modal.classList.remove("hidden");
            this.isOpen = true;
            document.body.style.overflow = "hidden"; // Scroll lock
            
            // Focus management
            setTimeout(() => {
                const closeBtn = document.getElementById("settings-close");
                if (closeBtn) closeBtn.focus();
            }, 50);
        }
    }

    close() {
        const modal = document.getElementById("settings-modal");
        if (modal) {
            modal.classList.add("hidden");
            this.isOpen = false;
            document.body.style.overflow = ""; // Unlock scroll
        }
    }
}
```

## 3. Styles (`src/styles.css`)
**Change:** Added `prefers-reduced-motion` to disable animations for accessibility.

```css
/* ... existing styles ... */

.btn-large-start {
    width: 100%;
    background: #fbbf24 !important;
    /* Amber */
    color: #451a03 !important;
    /* Dark Brown */
    font-size: 18px !important;
    padding: 16px !important;
    box-shadow: 0 10px 30px rgba(251, 191, 36, 0.4) !important;
    transform: scale(1.05);
}

@media (prefers-reduced-motion: reduce) {
    *,
    ::before,
    ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```
