import { t, setLanguage, getLanguage, subscribeI18n } from "../i18n/index.js";
import { getTheme, setTheme } from "../theme/index.js";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { showToast } from "../core/toast.js";
import { getLogoSVG } from "./Logo.js";

export class Settings {
    constructor() {
        this.isOpen = false;
        this.previousActiveElement = null;
        this.prevBodyOverflow = null;
        this.render();
        this.bindEvents();

        subscribeI18n(() => {
            this.updateTexts();
        });
    }

    render() {
        if (!document.getElementById("settings-modal")) {
            const modal = document.createElement("div");
            modal.id = "settings-modal";
            modal.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm hidden fade-in";
            modal.setAttribute("role", "dialog");
            modal.setAttribute("aria-modal", "true");
            modal.setAttribute("aria-labelledby", "settings-title");

            modal.innerHTML = `
                <div class="glass-card w-[90%] max-w-sm max-h-[85vh] overflow-y-auto p-5 md:p-6 relative bg-white/90 dark:bg-slate-800/90 shadow-2xl">
                    <button id="settings-close" class="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-10" aria-label="${t("ui.close")}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500 dark:text-slate-400">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    
                    <h2 id="settings-title" class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6" data-i18n="settings.title">${t("settings.title")}</h2>
                    
                    <div class="space-y-6">
                        <!-- Appearance -->
                        <div class="space-y-2">
                             <label class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" data-i18n="settings.theme">
                                ${t("settings.theme")}
                            </label>
                            <div class="flex p-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl">
                                <button class="flex-1 py-2 text-sm font-medium rounded-lg transition-all" data-theme="light">
                                    ${t("settings.theme.light")}
                                </button>
                                <button class="flex-1 py-2 text-sm font-medium rounded-lg transition-all" data-theme="dark">
                                    ${t("settings.theme.dark")}
                                </button>
                            </div>
                        </div>

                        <!-- Language -->
                        <div class="space-y-2">
                            <label class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" data-i18n="settings.language">
                                ${t("settings.language")}
                            </label>
                            <div class="flex p-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl">
                                <button class="flex-1 py-2 text-sm font-medium rounded-lg transition-all" data-lang="tr">
                                    ${t("settings.lang.tr")}
                                </button>
                                <button class="flex-1 py-2 text-sm font-medium rounded-lg transition-all" data-lang="en">
                                    ${t("settings.lang.en")}
                                </button>
                            </div>
                        </div>

                        <!-- Privacy & Security -->
                        <div class="space-y-2">
                             <label class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" data-i18n="settings.privacySectionTitle">
                                ${t("settings.privacySectionTitle")}
                            </label>
                            
                            <!-- Accordion Items -->
                            <div class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                ${this.renderAccordionItem("privacy", "settings.privacyTitle", "settings.privacyBody")}
                                ${this.renderAccordionItem("data", "settings.dataSafetyTitle", "settings.dataSafetyBody")}
                                ${this.renderAccordionItem("perms", "settings.permissionsTitle", "settings.permissionsBody")}
                            </div>
                        </div>

                        <!-- Contact -->
                        <div class="text-xs text-slate-500 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                            <span data-i18n="settings.contactEmailLabel" class="font-medium text-slate-700 dark:text-slate-300 mr-2">${t("settings.contactEmailLabel")}</span>
                            <span class="select-all">support@racalabs.app</span>
                        </div>

                        <!-- Exit App -->
                        <div>
                            <button id="btn-exit-app" class="w-full py-3 px-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-medium rounded-xl text-sm hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors flex items-center justify-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                <span data-i18n="settings.exit">${t("settings.exit")}</span>
                            </button>
                            <p class="text-[10px] text-center text-slate-400 mt-1" data-i18n="settings.exitHint">${t("settings.exitHint")}</p>
                        </div>
                    </div>
                    
                    <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col items-center gap-3">
                         ${getLogoSVG({ size: 48, variant: "mark" })}
                         <div class="text-center">
                            <p class="font-bold text-slate-800 dark:text-slate-100" data-i18n="app.name">${t("app.name")}</p>
                            <p class="text-[10px] text-slate-400">v1.0.4 • RACA Labs</p>
                         </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        this.addHeaderButton();
        this.updateThemeButtons();
        this.updateParams(); // Language buttons
    }

    renderAccordionItem(id, titleKey, bodyKey) {
        return `
            <div class="accordion-item border-b border-slate-200 dark:border-slate-700 last:border-0">
                <button class="w-full flex items-center justify-between p-3 text-left bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors" onclick="document.getElementById('acc-${id}').classList.toggle('hidden');">
                    <span class="text-[11px] font-medium text-slate-700 dark:text-slate-300" data-i18n="${titleKey}">${t(titleKey)}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400 transform transition-transform">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                <div id="acc-${id}" class="hidden p-3 bg-slate-50 dark:bg-slate-900/30 text-[10px] leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line" data-i18n="${bodyKey}">
                    ${t(bodyKey)}
                </div>
            </div>
        `;
    }

    addHeaderButton() {
        const headerActions = document.getElementById("header-actions");
        if (!document.getElementById("btn-open-settings")) {
            const btn = document.createElement("button");
            btn.id = "btn-open-settings";
            btn.className = "icon-btn w-9 h-9 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 shadow-sm";
            btn.setAttribute("aria-label", t("ui.settings"));
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            `;
            if (headerActions) headerActions.appendChild(btn);
            else document.body.appendChild(btn); // Fallback
            btn.addEventListener("click", () => this.open());
        }
    }

    bindEvents() {
        if (this.eventsBound) return;
        this.eventsBound = true;

        const modal = document.getElementById("settings-modal");

        document.addEventListener("keydown", (e) => {
            if (this.isOpen) {
                if (e.key === "Escape") this.close();
                else if (e.key === "Tab") {
                    if (!modal) return;
                    const focusableElements = Array.from(modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute("disabled"));
                    if (focusableElements.length < 2) return;

                    const first = focusableElements[0];
                    const last = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey) {
                        if (document.activeElement === first) { last.focus(); e.preventDefault(); }
                    } else {
                        if (document.activeElement === last) { first.focus(); e.preventDefault(); }
                    }
                }
            }
        });

        document.getElementById("settings-close")?.addEventListener("click", () => this.close());
        modal?.addEventListener("click", (e) => { if (e.target === modal) this.close(); });

        // Language Buttons
        modal?.querySelectorAll("[data-lang]").forEach(btn => {
            btn.addEventListener("click", () => {
                setLanguage(btn.getAttribute("data-lang"));
                this.updateParams();
            });
        });

        // Theme Buttons
        modal?.querySelectorAll("[data-theme]").forEach(btn => {
            btn.addEventListener("click", () => {
                setTheme(btn.getAttribute("data-theme"));
                this.updateThemeButtons();
            });
        });

        // Exit App
        document.getElementById("btn-exit-app")?.addEventListener("click", () => {
            if (Capacitor.isNativePlatform()) {
                if (confirm(t("settings.exitConfirmTitle") + "\n" + t("settings.exitConfirmBody"))) {
                    App.exitApp();
                }
            } else {
                showToast(t("toast.web.exit"), { duration: 3000 });
            }
        });
    }

    updateThemeButtons() {
        const theme = getTheme();
        const modal = document.getElementById("settings-modal");
        if (!modal) return;

        modal.querySelectorAll("[data-theme]").forEach(btn => {
            const isSelected = btn.getAttribute("data-theme") === theme;
            btn.className = isSelected
                ? "flex-1 py-2 text-sm font-medium rounded-lg transition-all bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-600"
                : "flex-1 py-2 text-sm font-medium rounded-lg transition-all text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300";
        });
    }

    updateParams() {
        this.updateTexts();
        const lang = getLanguage();
        const modal = document.getElementById("settings-modal");
        if (!modal) return;

        modal.querySelectorAll("[data-lang]").forEach(b => {
            const isSelected = b.getAttribute("data-lang") === lang;
            b.className = isSelected
                ? "flex-1 py-2 text-sm font-medium rounded-lg transition-all bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-600"
                : "flex-1 py-2 text-sm font-medium rounded-lg transition-all text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300";
        });
    }

    updateTexts() {
        const modal = document.getElementById("settings-modal");
        if (modal) {
            modal.querySelectorAll("[data-i18n]").forEach(el => {
                const key = el.getAttribute("data-i18n");
                el.innerText = t(key);
            });
            document.getElementById("settings-close")?.setAttribute("aria-label", t("ui.close"));
        }
        document.getElementById("btn-open-settings")?.setAttribute("aria-label", t("ui.settings"));
    }

    open() {
        const modal = document.getElementById("settings-modal");
        if (modal) {
            this.previousActiveElement = document.activeElement;
            this.prevBodyOverflow = document.body.style.overflow;
            modal.classList.remove("hidden");
            this.isOpen = true;
            document.body.style.overflow = "hidden";
            setTimeout(() => document.getElementById("settings-close")?.focus(), 50);
        }
    }

    close() {
        const modal = document.getElementById("settings-modal");
        if (modal) {
            modal.classList.add("hidden");
            this.isOpen = false;
            document.body.style.overflow = this.prevBodyOverflow ?? "";
            this.previousActiveElement?.focus();
        }
    }
}
