import * as dict from "./strings.js";

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
