import "./styles.css";
import { loadState, appState } from "./core/state.js";
import { initScenarios, showListView } from "./core/scenarios.js";
import { initI18n, t } from "./i18n/index.js";
import { Settings } from "./ui/Settings.js";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { showToast } from "./core/toast.js";
import { initTheme } from "./theme/index.js";
import { getLogoSVG } from "./ui/Logo.js";

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Init Core Systems
  initI18n();
  initTheme();

  // 2. Render Header Logo
  const logoContainer = document.getElementById("header-logo-container");
  if (logoContainer) {
    logoContainer.innerHTML = getLogoSVG({ size: 32, variant: "lockup" });
  }

  // 3. Init UI Components
  new Settings();

  // 4. Load Data
  await loadState();

  // 5. Init Scenarios (Main View)
  initScenarios();

  // Ensure main content is visible (in case it was hidden by legacy code)
  const appContent = document.getElementById("app-content");
  if (appContent) appContent.classList.remove("hidden");

  // 6. Native Back Button Logic
  if (Capacitor.isNativePlatform()) {
    App.addListener('backButton', ({ canGoBack }) => {
      const viewDetail = document.getElementById("view-detail");
      if (viewDetail && !viewDetail.classList.contains("hidden")) {
        // If in detail view, go back to list
        showListView();
        return;
      }

      // If in main list, confirm exit
      const now = Date.now();
      if (window.lastBackPress && now - window.lastBackPress < 2000) {
        App.exitApp();
      } else {
        window.lastBackPress = now;
        showToast(t("toast.exit"), { duration: 2000 });
      }
    });
  }
});
