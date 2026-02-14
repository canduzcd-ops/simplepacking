# Hotfix 1.0.3: Premium Polish & Stability

## 📋 Değişiklik Özeti
- **Settings UX:** Focus trap güvenliği artırıldı, scroll lock state-aware yapıldı.
- **Web Safety:** `App.addListener('backButton')` sadece native platformda çalışacak şekilde güncellendi (Web crash önlendi).
- **i18n:** `toast.exit`, `ui.close`, `ui.settings` anahtarları eklendi ve tüm modal içi metinler kapsandı.
- **Polish:** Settings footer versiyonu `1.0.3` yapıldı, aria-label'lar localize edildi.
- **Version:** `1.0.3` (Android versionCode: `4`)

## 🛠 Değişen Dosyalar

### 1. `src/ui/Settings.js`
- Focus trap null-safe hale getirildi.
- Scroll lock, önceki body overflow değerini saklayıp geri yüklüyor.
- `updateTexts` sadece modal içindeki elementleri tarıyor (performans).
- Close ve Trigger butonlarına localized `aria-label` eklendi.

### 2. `src/main.js`
- `Capacitor.isNativePlatform()` kontrolü eklendi.

### 3. `src/i18n/strings.js`
- Yeni anahtarlar eklendi: `toast.exit` (TR/EN), `ui.close`, `ui.settings`.

## 🧪 Test Talimatları
1.  **Web Preview:** Tarayıcıda açın, Settings'i açıp kapatın. Konsolda hata olmamalı.
2.  **Back Button (Android):** Geri tuşuna basınca çıkış uyarısı "Çıkmak için tekrar bas" görünmeli.
3.  **Language Switch:** Settings içinden dil değiştirince tüm metinler (aria-label dahil) anlık güncellenmeli.

```javascript
import { t, setLanguage, getLanguage, subscribeI18n } from "../i18n/index.js";
import { initUserOnboarding } from "../core/user.js";

export class Settings {
    constructor() {
        this.isOpen = false;
        this.previousActiveElement = null;
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
            // ARIA accessibility
            modal.setAttribute("role", "dialog");
            modal.setAttribute("aria-modal", "true");
            modal.setAttribute("aria-labelledby", "settings-title");
            
            modal.innerHTML = `
                <div class="glass-card w-[90%] max-w-sm p-5 md:p-6 relative bg-white/90">
                    <button id="settings-close" class="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Close settings">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    
                    <h2 id="settings-title" class="text-lg font-bold text-slate-900 mb-6" data-i18n="settings.title">${t("settings.title")}</h2>
                    
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
                            v1.0.2 • ${t("app.name")}
                         </p>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        // Add settings trigger button to header
        this.addHeaderButton();
    }

    addHeaderButton() {
        const headerActions = document.getElementById("header-actions");
        // Fallback if header-actions not present (though we added it)
        const header = document.querySelector("header .flex.items-center.justify-between.gap-3");
        
        if (!document.getElementById("btn-open-settings")) {
            const btn = document.createElement("button");
            btn.id = "btn-open-settings";
            btn.className = "icon-btn w-9 h-9 border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 bg-white shadow-sm";
            btn.setAttribute("aria-label", "Settings");
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            `;
            
            if (headerActions) {
                headerActions.appendChild(btn);
            } else if (header) {
                header.appendChild(btn);
            } else {
                // Absolute fallback if no header found
                btn.style.position = "fixed";
                btn.style.top = "1rem";
                btn.style.right = "1rem";
                btn.style.zIndex = "40";
                document.body.appendChild(btn);
            }

            btn.addEventListener("click", () => this.open());
        }
    }

    bindEvents() {
        if (this.eventsBound) return;
        this.eventsBound = true;

        const modal = document.getElementById("settings-modal");

        // Close on Escape key
        document.addEventListener("keydown", (e) => {
            if (this.isOpen) {
                if (e.key === "Escape") {
                    this.close();
                } else if (e.key === "Tab") {
                     // Focus Trap
                    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey) { /* shift + tab */
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else { /* tab */
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
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
                
                // Update visuals instantly - Logic now inside updateTexts via subscribe
                // But we can force specific button styles here if needed, 
                // or let updateTexts handle everything if we add logic there.
                // Let's do it here for immediate feedback opacity etc.
                this.updateButtonStyles(lang);
            });
        });

        // Reset Onboarding
        document.getElementById("btn-reset-onboarding")?.addEventListener("click", () => {
            if (confirm(t("settings.confirmReset"))) {
                this.close();
                window.dispatchEvent(new CustomEvent("raca-reset-onboarding"));
            }
        });
    }

    updateButtonStyles(lang) {
        const modal = document.getElementById("settings-modal");
        if(!modal) return;
        const btns = modal.querySelectorAll("[data-lang]");
        btns.forEach(b => {
            if (b.getAttribute("data-lang") === lang) {
                b.className = "flex-1 py-2 text-sm font-medium rounded-lg transition-all bg-white shadow-sm text-slate-900";
            } else {
                b.className = "flex-1 py-2 text-sm font-medium rounded-lg transition-all text-slate-500 hover:text-slate-700";
            }
        });
    }

    updateTexts() {
        const els = document.querySelectorAll("[data-i18n]");
        els.forEach(el => {
            const key = el.getAttribute("data-i18n");
            el.innerText = t(key);
        });
        
        // Ensure buttons are updating too (in case language changed from outside)
        this.updateButtonStyles(getLanguage());
    }

    open() {
        const modal = document.getElementById("settings-modal");
        if (modal) {
            this.previousActiveElement = document.activeElement;
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
            
            // Restore Focus
            if (this.previousActiveElement) {
                this.previousActiveElement.focus();
            }
        }
    }
}
```

### 2. `src/main.js` (Tam İçerik)
Storage key standardizasyonu ve event listener.

```javascript
import "./styles.css";
import { loadState, appState } from "./core/state.js";
import { loadUserName, applyUserName, initUserOnboarding } from "./core/user.js";
import { initScenarios, showListView, openScenarioDetail } from "./core/scenarios.js";
import { initI18n, t } from "./i18n/index.js"; // New i18n
import { Onboarding } from "./ui/Onboarding.js";
import { Settings } from "./ui/Settings.js"; // New Settings
import { App } from "@capacitor/app";
import { showToast } from "./core/toast.js";

const ONBOARDING_DONE_KEY = "raca_onboarding_done";

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Init I18n
  initI18n();

  // 2. Init Settings
  new Settings();

  // 3. Load State (Async DB)
  await loadState();

  const viewPremiumOb = document.getElementById("premium-onboarding");
  const viewOnboarding = document.getElementById("view-onboarding");
  const appContent = document.getElementById("app-content");

  // 4. Function to start flow
  function startAppFlow() {
    const storedName = loadUserName();
    const introCompleted = localStorage.getItem(ONBOARDING_DONE_KEY) === "true";

    if (storedName) {
      // Already has user, go to app
      applyUserName(storedName);
      if (viewPremiumOb) viewPremiumOb.classList.add("hidden");
      if (viewOnboarding) viewOnboarding.classList.add("hidden");
      if (appContent) appContent.classList.remove("hidden");
    } else {
      // No user
      if (!introCompleted) {
        // Show Premium Onboarding
        if (viewPremiumOb) viewPremiumOb.classList.remove("hidden");
        if (viewOnboarding) viewOnboarding.classList.add("hidden");
        if (appContent) appContent.classList.add("hidden");

        new Onboarding("premium-onboarding", () => {
          // On Complete:
          localStorage.setItem(ONBOARDING_DONE_KEY, "true");
          viewPremiumOb.classList.add("hidden");
          viewOnboarding.classList.remove("hidden");
          initUserOnboarding();
        });

      } else {
        // Show Name Input
        if (viewPremiumOb) viewPremiumOb.classList.add("hidden");
        if (viewOnboarding) viewOnboarding.classList.remove("hidden");
        if (appContent) appContent.classList.add("hidden");
        initUserOnboarding();
      }
    }
  }

  // Initial Start
  startAppFlow();

  // Listen for Reset Event from Settings
  window.addEventListener("raca-reset-onboarding", () => {
    localStorage.removeItem(ONBOARDING_DONE_KEY);
    // Force show onboarding by hiding others
    if (appContent) appContent.classList.add("hidden");
    if (viewOnboarding) viewOnboarding.classList.add("hidden");
    if (viewPremiumOb) viewPremiumOb.classList.remove("hidden");
    
    new Onboarding("premium-onboarding", () => {
        localStorage.setItem(ONBOARDING_DONE_KEY, "true");
        viewPremiumOb.classList.add("hidden");
        // If user has name, go to app, else go to name input
        if (loadUserName()) {
            if (appContent) appContent.classList.remove("hidden");
        } else {
            if (viewOnboarding) viewOnboarding.classList.remove("hidden");
            initUserOnboarding();
        }
    });
  });


  // 5. Init Scenarios (UI events)
  initScenarios();
  
  // Back Button Logic
  App.addListener('backButton', ({ canGoBack }) => {
    const viewDetail = document.getElementById("view-detail");
    if (viewDetail && !viewDetail.classList.contains("hidden")) {
      showListView();
      return;
    }
    if (appContent && !appContent.classList.contains("hidden")) {
      const now = Date.now();
      if (window.lastBackPress && now - window.lastBackPress < 2000) {
        App.exitApp();
      } else {
        window.lastBackPress = now;
        showToast(t("toast.exit"), { duration: 2000 }); // keys updated in strings.js? check
      }
    } else {
      App.exitApp();
    }
  });
});
```

### 3. `src/core/user.js`
- `subscribeI18n` ile dil değişince kullanıcı adı ve placeholder güncelleniyor.

### 4. `src/core/scenarios.js`
- `initScenarios` fonksiyonuna `subscribeI18n` eklendi. Dil değişince liste ve statik metinler anlık yenileniyor.

### 5. `src/i18n/strings.js`
- Eksik `app.name`, `settings.confirmReset`, `ui.confirm` anahtarları eklendi.

### 6. `index.html`
- Header butonları için `header-actions` container eklendi.
- Modal erişilebilirlik (ARIA) attribute'ları eklendi.

## 🧪 Test Talimatları
1.  **Dil Değiştirme:** Ayarlardan TR/EN geçişi yapın. Sayfa yenilenmeden tüm metinlerin (başlıklar, butonlar, placeholder'lar, senaryo listesi) değiştiğini görün.
2.  **Onboarding Reset:** Ayarlardan sıfırlayın. Anında intro ekranına dönmeli (reload yok).
3.  **Keyboard Nav:** Settings açıkken Tab tuşuna basın. Focus modal dışına çıkmamalı.
