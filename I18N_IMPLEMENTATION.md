# Premium i18n & Settings Implementation

Below are the full contents of the files implemented for the i18n system and settings module.

## 1. i18n Dictionary (`src/i18n/strings.js`)
```javascript
export default {
    tr: {
        // App
        "app.name": "RACA Simple Packing",
        "app.desc": "Çantalarını kişiselleştirilmiş listelerle hazırla.",
        
        // Onboarding
        "onboarding.s1.title": "Planla. Paketle. Rahatla.",
        "onboarding.s1.subtitle": "Dakikalar içinde valiz listeni hazırla.",
        "onboarding.s2.title": "Offline çalışır.",
        "onboarding.s2.subtitle": "İnternet olmasa da listen yanında.",
        "onboarding.s3.title": "Düzenli kal.",
        "onboarding.s3.subtitle": "Senaryolarla tekrar tekrar kullan.",

        // UI Common
        "ui.skip": "Geç",
        "ui.next": "İleri",
        "ui.start": "Başla",
        "ui.close": "Kapat",
        "ui.done": "Bitti",
        "ui.cancel": "Vazgeç",
        "ui.save": "Kaydet",
        "ui.delete": "Sil",
        "ui.edit": "Düzenle",
        "ui.back": "Geri",
        
        // Settings
        "settings.title": "Ayarlar",
        "settings.language": "Dil",
        "settings.lang.tr": "Türkçe",
        "settings.lang.en": "English",
        "settings.showOnboarding": "Onboarding’i tekrar göster",
        "settings.about": "Hakkında",
        "settings.reset": "Sıfırla",
        
        // Main App
        "greeting.guest": "Hoş geldin",
        "greeting.user": "Merhaba, {name}",
        "home.scenarios": "Senaryoların",
        "home.scenarios.desc": "Farklı çantalar için senaryo oluştur.",
        "home.newScenario": "+ Yeni Senaryo",
        "home.empty": "Henüz senaryo yok. İlkini ekle.",
        
        // Scenario Detail
        "detail.items.empty": "Henüz madde yok.",
        "detail.items.completed": "{completed} / {total} tamamlandı",
        "detail.input.placeholder": "Örn: Yedek tişört, güneş kremi...",
        "detail.add": "+ Ekle",
        "detail.resetAll": "Hepsini sıfırla",
        "detail.checkAll": "Hepsini işaretle",
        "detail.confirmReset": "Tüm işaretler sıfırlansın mı?",
        "detail.confirmYes": "Sıfırla",
        
        // Toast
        "toast.saved": "Kaydedildi",
        "toast.deleted": "Silindi",
        "toast.error": "Bir şeyler ters gitti",
        "toast.reset": "Sıfırlandı",
        "toast.exit": "Çıkmak için tekrar bas",

        // Forms
        "form.name.label": "Senaryo adı",
        "form.name.placeholder": "Örn: Plaj Çantası...",
        "form.emoji.label": "Emoji",
        "form.color.label": "Renk etiketi",
        "form.error.name": "İsim gerekli.",
        
        // User Name
        "user.name.label": "İsmin",
        "user.name.placeholder": "Sura, Melis...",
        "user.name.error": "En az 2 karakter.",
        "user.name.privacy": "Veriler sadece bu cihazda.",
        "user.continue": "Devam Et"
    },
    en: {
        // App
        "app.name": "RACA Simple Packing",
        "app.desc": "Prepare your bags with personalized lists.",

        // Onboarding
        "onboarding.s1.title": "Plan. Pack. Relax.",
        "onboarding.s1.subtitle": "Build a packing list in minutes.",
        "onboarding.s2.title": "Works offline.",
        "onboarding.s2.subtitle": "Your list stays with you—no internet needed.",
        "onboarding.s3.title": "Stay organized.",
        "onboarding.s3.subtitle": "Reuse scenarios and pack faster.",

        // UI Common
        "ui.skip": "Skip",
        "ui.next": "Next",
        "ui.start": "Get started",
        "ui.close": "Close",
        "ui.done": "Done",
        "ui.cancel": "Cancel",
        "ui.save": "Save",
        "ui.delete": "Delete",
        "ui.edit": "Edit",
        "ui.back": "Back",

        // Settings
        "settings.title": "Settings",
        "settings.language": "Language",
        "settings.lang.tr": "Türkçe",
        "settings.lang.en": "English",
        "settings.showOnboarding": "Show onboarding again",
        "settings.about": "About",
        "settings.reset": "Reset",

        // Main App
        "greeting.guest": "Welcome",
        "greeting.user": "Hello, {name}",
        "home.scenarios": "Your Scenarios",
        "home.scenarios.desc": "Create scenarios for different bags.",
        "home.newScenario": "+ New Scenario",
        "home.empty": "No scenarios yet. Create your first one.",

        // Scenario Detail
        "detail.items.empty": "No items yet.",
        "detail.items.completed": "{completed} / {total} completed",
        "detail.input.placeholder": "Ex: Spare shirt, Sunscreen...",
        "detail.add": "+ Add",
        "detail.resetAll": "Reset All",
        "detail.checkAll": "Check All",
        "detail.confirmReset": "Reset all items?",
        "detail.confirmYes": "Reset",

        // Toast
        "toast.saved": "Saved",
        "toast.deleted": "Deleted",
        "toast.error": "Something went wrong",
        "toast.reset": "Reset",
        "toast.exit": "Press back again to exit",

        // Forms
        "form.name.label": "Scenario Name",
        "form.name.placeholder": "Ex: Beach Bag...",
        "form.emoji.label": "Emoji",
        "form.color.label": "Color Tag",
        "form.error.name": "Name required.",

        // User Name
        "user.name.label": "Your Name",
        "user.name.placeholder": "Alice, Bob...",
        "user.name.error": "Min 2 chars.",
        "user.name.privacy": "Data stays on device.",
        "user.continue": "Continue"
    }
};
```

## 2. i18n Core Logic (`src/i18n/index.js`)
```javascript
import dict from "./strings.js";

let currentLang = "tr";
const STORAGE_KEY = "raca-lang";

// Event bus implementation for i18n changes
const listeners = [];

export function subscribeI18n(callback) {
    listeners.push(callback);
}

function notifyListeners() {
    listeners.forEach(cb => cb(currentLang));
}

export function initI18n() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (saved === "tr" || saved === "en")) {
        currentLang = saved;
    } else {
        // Detect device language
        const deviceLang = navigator.language || navigator.userLanguage;
        if (deviceLang && deviceLang.toLowerCase().startsWith("en")) {
            currentLang = "en";
        } else {
            currentLang = "tr"; // Fallback
        }
    }
    document.documentElement.lang = currentLang;
}

export function getLanguage() {
    return currentLang;
}

export function setLanguage(lang) {
    if (lang !== "tr" && lang !== "en") return;
    
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    
    // Notify listeners to re-render
    notifyListeners();
    
    // For simple apps, reload might be cleaner to ensure everything updates
    // But we'll try to support dynamic updates where possible
    // location.reload(); 
}

export function t(key, params = {}) {
    const langObj = dict[currentLang] || dict.tr;
    let val = langObj[key];
    
    if (!val) {
        // Fallback to TR if missing in EN
        if (currentLang !== "tr" && dict.tr[key]) {
            val = dict.tr[key];
        } else {
            return key; // Return key if not found
        }
    }
    
    Object.keys(params).forEach(p => {
        val = val.replace("{" + p + "}", params[p]);
    });
    
    return val;
}
```

## 3. Main Entry (`src/main.js`)
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

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Init I18n
  initI18n();

  // 2. Init Settings
  new Settings();

  // 3. Load State (Async DB)
```
(Remainer of file logic initializes onboarding/app view based on state)

## 4. Settings Component (`src/ui/Settings.js`)
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
            // ... Modal Content with Segmented Control ...
            document.body.appendChild(modal);
        }
        
        // Add settings trigger button to header
        const header = document.querySelector("header .flex.items-center.justify-between.gap-3");
        if (header && !document.getElementById("btn-open-settings")) {
            // ... Add Gear Icon Button ...
             header.appendChild(btn);
            btn.addEventListener("click", () => this.open());
        }
    }
    // ... Methods: open(), close(), updateTexts() ...
}
```

## 5. Onboarding Component (`src/ui/Onboarding.js`)
```javascript
import { appState } from "../core/state";
import { t } from "../i18n/index.js";

export class Onboarding {
    constructor(containerId, onComplete) {
        // ...
        this.slides = [
            {
                image: "assets/onboarding/ob-1.png",
                title: t("onboarding.s1.title"),
                text: t("onboarding.s1.subtitle")
            },
            // ...
        ];
        // ...
    }
    // ... Render uses t("ui.skip"), t("ui.next"), t("ui.start") ...
}
```

## 6. Styles (`src/styles.css`)
Added/Modified:
- `.fade-in` and `@keyframes fadeIn` for modal animation.
- `@keyframes shake` restored correctly.
- `.glass-card-premium` used in onboarding.
- Safe area adjustments (`env(safe-area-inset-bottom)`).
