import { appState, saveState, getScenarioById, updateScenario, addScenario, removeScenario } from "./state.js";
import { getScenarioTheme } from "./colorThemes.js";
import { genId, setVisible, shake } from "./ui.js";
import { showToast } from "./toast.js";
import { initI18n, t, subscribeI18n } from "../i18n/index.js";

let viewList;
let viewDetail;

let scenarioListEl;
let scenarioEmptyEl;

let btnNewScenarioToggle;
let newScenarioForm;
let btnNewScenarioClose;
let btnNewScenarioSave;
let inputScenarioName;
let inputScenarioIcon;
let newScenarioError;
let colorPillGroup;

let btnBackToList;
let btnRenameScenario;
let btnDeleteScenario;

let detailIcon;
let detailName;
let detailCountText;
let detailProgressInner;
let detailStatPill;
let detailColorLabel;
let detailDesc;

let itemListEl;
let itemsEmptyEl;
let inputItemLabel;
let btnAddItem;
let btnResetItems;
let btnCheckAllItems;

// Hepsini sıfırla onay barı
let resetConfirmBar;
let btnResetConfirmYes;
let btnResetConfirmNo;
let resetConfirmText;

let currentScenarioId = null;
let newScenarioColorKey = "neutral";

export function initScenarios() {
  viewList = document.getElementById("view-list");
  viewDetail = document.getElementById("view-detail");

  // Subscribe to language changes
  subscribeI18n(() => {
    updateStaticTexts();
    renderScenarioList();
  });

  scenarioListEl = document.getElementById("scenario-list");
  scenarioEmptyEl = document.getElementById("scenario-empty");

  btnNewScenarioToggle = document.getElementById("btn-new-scenario-toggle");
  newScenarioForm = document.getElementById("new-scenario-form");
  btnNewScenarioClose = document.getElementById("btn-new-scenario-close");
  btnNewScenarioSave = document.getElementById("btn-new-scenario-save");
  inputScenarioName = document.getElementById("input-scenario-name");
  inputScenarioIcon = document.getElementById("input-scenario-icon");
  newScenarioError = document.getElementById("new-scenario-error");
  colorPillGroup = document.getElementById("color-pill-group");

  btnBackToList = document.getElementById("btn-back-to-list");
  btnRenameScenario = document.getElementById("btn-rename-scenario");
  btnDeleteScenario = document.getElementById("btn-delete-scenario");

  detailIcon = document.getElementById("detail-icon");
  detailName = document.getElementById("detail-name");
  detailCountText = document.getElementById("detail-count-text");
  detailProgressInner = document.getElementById("detail-progress-inner");
  detailStatPill = document.getElementById("detail-stat-pill");
  detailColorLabel = document.getElementById("detail-color-label");
  detailDesc = document.querySelector("#view-detail p"); // Assuming first p is desc

  itemListEl = document.getElementById("item-list");
  itemsEmptyEl = document.getElementById("items-empty");
  inputItemLabel = document.getElementById("input-item-label");
  btnAddItem = document.getElementById("btn-add-item");
  btnResetItems = document.getElementById("btn-reset-items");
  btnCheckAllItems = document.getElementById("btn-checkall-items");

  resetConfirmBar = document.getElementById("reset-confirm-bar");
  btnResetConfirmYes = document.getElementById("btn-reset-confirm-yes");
  btnResetConfirmNo = document.getElementById("btn-reset-confirm-no");
  resetConfirmText = resetConfirmBar ? resetConfirmBar.querySelector("span span") : null;

  // Initial localized texts
  updateStaticTexts();

  bindListEvents();
  bindDetailEvents();
  bindItemEvents();
  bindResetConfirmEvents();

  renderScenarioList();
  showListView();

  if (appState.lastOpenedScenarioId) {
    const s = getScenarioById(appState.lastOpenedScenarioId);
    if (s) {
      openScenarioDetail(s.id);
    }
  }
}

function updateStaticTexts() {
  if (btnNewScenarioToggle) btnNewScenarioToggle.textContent = t("home.newScenario");
  if (btnNewScenarioClose) btnNewScenarioClose.textContent = t("ui.close");
  if (btnNewScenarioSave) btnNewScenarioSave.textContent = t("ui.save");

  const newListSec = document.querySelector("#view-list");
  if (newListSec) {
    const chipText = newListSec.querySelector(".chip span:last-child");
    if (chipText) chipText.textContent = t("home.scenarios");
    const pDesc = newListSec.querySelector("div > p");
    if (pDesc) pDesc.textContent = t("home.scenarios.desc");
  }

  const newFormTitle = document.querySelector("#new-scenario-form h2");
  if (newFormTitle) newFormTitle.textContent = t("home.newScenario");

  if (inputScenarioName) inputScenarioName.placeholder = t("form.name.placeholder");
  if (inputScenarioIcon) inputScenarioIcon.placeholder = "🎒";

  const labels = document.querySelectorAll("#new-scenario-form label");
  if (labels[0]) labels[0].textContent = t("form.name.label");
  if (labels[1]) labels[1].textContent = t("form.emoji.label");

  const colorLabel = document.querySelector("#new-scenario-form .mt-3 > p"); // bit fragile selector
  if (colorLabel) colorLabel.textContent = t("form.color.label");

  if (scenarioEmptyEl) scenarioEmptyEl.textContent = t("home.empty");

  if (btnBackToList) btnBackToList.textContent = t("ui.back");
  if (btnRenameScenario) btnRenameScenario.textContent = t("ui.edit");
  if (btnDeleteScenario) btnDeleteScenario.textContent = t("ui.delete");

  if (detailDesc) detailDesc.textContent = t("home.scenarios.desc");

  if (itemsEmptyEl) itemsEmptyEl.textContent = t("detail.items.empty");

  const itemLabel = document.querySelector("label[for='input-item-label']");
  if (itemLabel) itemLabel.textContent = t("detail.add");

  if (inputItemLabel) inputItemLabel.placeholder = t("detail.input.placeholder");
  if (btnAddItem) btnAddItem.textContent = t("detail.add");

  if (btnResetItems) btnResetItems.textContent = t("detail.resetAll");
  if (btnCheckAllItems) btnCheckAllItems.textContent = t("detail.checkAll");

  if (resetConfirmText) resetConfirmText.textContent = t("detail.confirmReset");
  if (btnResetConfirmYes) btnResetConfirmYes.textContent = t("detail.confirmYes");
  if (btnResetConfirmNo) btnResetConfirmNo.textContent = t("ui.cancel");

  // Theme pills
  if (colorPillGroup) {
    const pills = colorPillGroup.querySelectorAll(".color-pill");
    pills.forEach(p => {
      const key = p.getAttribute("data-color-key");
      const kName = key.charAt(0).toUpperCase() + key.slice(1);
      // e.g. themeNeutral
      const tKey = "theme" + kName;
      // Last text node inside button
      // This is tricky because of the span dot. Instead let's append text.
      // current: <span dot> Text
      if (p.lastChild.nodeType === Node.TEXT_NODE) {
        p.lastChild.textContent = " " + t(tKey);
      }
    });
  }
}

// -------------------------
// LIST VIEW
// -------------------------
function bindListEvents() {
  if (btnNewScenarioToggle) {
    btnNewScenarioToggle.addEventListener("click", () => {
      toggleNewScenarioForm();
    });
  }

  if (btnNewScenarioClose) {
    btnNewScenarioClose.addEventListener("click", () => {
      setVisible(newScenarioForm, false);
    });
  }

  if (btnNewScenarioSave) {
    btnNewScenarioSave.addEventListener("click", () => {
      saveNewScenario();
    });
  }

  if (colorPillGroup) {
    const pills = colorPillGroup.querySelectorAll(".color-pill");
    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        pills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        const key = pill.getAttribute("data-color-key");
        newScenarioColorKey = key || "neutral";
      });
    });
  }
}

function toggleNewScenarioForm() {
  if (!newScenarioForm) return;
  const isHidden = newScenarioForm.classList.contains("hidden");
  setVisible(newScenarioForm, isHidden);
  if (newScenarioError) {
    newScenarioError.textContent = "";
    setVisible(newScenarioError, false);
  }

  if (isHidden) {
    if (inputScenarioName) inputScenarioName.value = "";
    if (inputScenarioIcon) inputScenarioIcon.value = "";
    newScenarioColorKey = "neutral";

    if (colorPillGroup) {
      const pills = colorPillGroup.querySelectorAll(".color-pill");
      pills.forEach((p) => p.classList.remove("active"));
      const neutralPill = colorPillGroup.querySelector('[data-color-key="neutral"]');
      if (neutralPill) neutralPill.classList.add("active");
    }
    if (inputScenarioName) inputScenarioName.focus();
  }
}

async function saveNewScenario() {
  if (!inputScenarioName) return;

  if (newScenarioError) {
    newScenarioError.textContent = "";
    setVisible(newScenarioError, false);
  }

  const name = (inputScenarioName.value || "").trim();
  const icon = (inputScenarioIcon?.value || "").trim();

  if (!name) {
    if (newScenarioError) {
      newScenarioError.textContent = t("form.error.name");
      setVisible(newScenarioError, true);
    }
    shake(newScenarioForm);
    return;
  }

  const scenario = {
    id: genId("scenario"),
    name,
    icon: icon || "🎒",
    colorKey: newScenarioColorKey || "neutral",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    items: [],
  };

  await addScenario(scenario);
  renderScenarioList();
  setVisible(newScenarioForm, false);

  showToast(t("toast.saved"), { variant: "success" });
}

export function renderScenarioList() {
  if (!scenarioListEl) return;

  const scenarios = appState.scenarios;
  scenarioListEl.innerHTML = "";

  if (!scenarios.length) {
    setVisible(scenarioEmptyEl, true);
    return;
  }
  setVisible(scenarioEmptyEl, false);

  scenarios.forEach((scenario) => {
    const total = scenario.items.length;
    const doneCount = scenario.items.filter((i) => i.done).length;
    const theme = getScenarioTheme(scenario);

    const card = document.createElement("div");
    card.className =
      "scenario-card border border-slate-200 rounded-2xl px-3 py-2.5 bg-white flex items-center justify-between gap-2";

    const left = document.createElement("div");
    left.className = "flex items-center gap-2.5";

    const iconWrap = document.createElement("div");
    iconWrap.className =
      "h-8 w-8 rounded-2xl flex items-center justify-center bg-white text-base";
    iconWrap.textContent = scenario.icon || "🎒";
    iconWrap.style.border = "1px solid " + theme.color;
    iconWrap.style.boxShadow = "0 0 0 1px rgba(249,250,251,1)";
    iconWrap.style.color = theme.color;

    const textWrap = document.createElement("div");
    const nameEl = document.createElement("div");
    nameEl.className =
      "text-xs md:text-sm font-semibold text-slate-900 truncate max-w-[9rem] md:max-w-[14rem]";
    nameEl.textContent = scenario.name || "Adsız senaryo";

    const statsRow = document.createElement("div");
    statsRow.className = "flex items-center gap-2 text-[11px] text-slate-500";

    const countText = document.createElement("span");
    if (!total) {
      countText.textContent = t("detail.items.empty");
    } else {
      countText.textContent = t("detail.items.completed", { completed: doneCount, total });
    }

    const colorTag = document.createElement("span");
    // localize theme label
    const tKey = "theme" + (theme.label === "Nötr" ? "Neutral" :
      theme.label === "İş" ? "Work" :
        theme.label === "Spor" ? "Sport" :
          theme.label === "Tatil" ? "Travel" :
            theme.label === "Düğün" ? "Wedding" : "Neutral"); // fallback check

    // Better rely on colorKey if available, otherwise label
    let finalLabel = theme.label;
    if (scenario.colorKey) {
      const kName = scenario.colorKey.charAt(0).toUpperCase() + scenario.colorKey.slice(1);
      finalLabel = t("theme" + kName);
    }

    colorTag.textContent = finalLabel;
    colorTag.style.borderRadius = "999px";
    colorTag.style.padding = "0.05rem 0.5rem";
    colorTag.style.border = "1px solid " + theme.color;
    colorTag.style.backgroundImage =
      "linear-gradient(135deg,#ffffff," + theme.soft + ")";
    colorTag.style.fontSize = "0.65rem";
    colorTag.style.color = theme.text;

    statsRow.appendChild(countText);
    statsRow.appendChild(colorTag);

    textWrap.appendChild(nameEl);
    textWrap.appendChild(statsRow);

    left.appendChild(iconWrap);
    left.appendChild(textWrap);

    const right = document.createElement("div");
    right.className = "flex items-center gap-1.5";

    const renameBtn = document.createElement("button");
    renameBtn.className = "icon-btn text-xs";
    renameBtn.title = t("ui.edit");
    renameBtn.innerHTML = "✏️";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn danger text-xs";
    deleteBtn.title = t("ui.delete");
    deleteBtn.innerHTML = "🗑";

    right.appendChild(renameBtn);
    right.appendChild(deleteBtn);

    card.addEventListener("click", (e) => {
      if (
        e.target === renameBtn ||
        e.target === deleteBtn ||
        renameBtn.contains(e.target) ||
        deleteBtn.contains(e.target)
      ) {
        return;
      }
      openScenarioDetail(scenario.id);
    });

    renameBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleRenameScenario(scenario.id);
    });

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleDeleteScenario(scenario.id);
    });

    card.appendChild(left);
    card.appendChild(right);

    scenarioListEl.appendChild(card);
  });
}

// -------------------------
// DETAIL VIEW
// -------------------------
function bindDetailEvents() {
  if (btnBackToList) {
    btnBackToList.addEventListener("click", () => {
      showListView();
    });
  }

  if (btnRenameScenario) {
    btnRenameScenario.addEventListener("click", () => {
      if (!currentScenarioId) return;
      handleRenameScenario(currentScenarioId);
    });
  }

  if (btnDeleteScenario) {
    btnDeleteScenario.addEventListener("click", () => {
      if (!currentScenarioId) return;
      handleDeleteScenario(currentScenarioId);
    });
  }
}

function bindResetConfirmEvents() {
  if (btnResetConfirmYes) {
    btnResetConfirmYes.addEventListener("click", () => {
      resetItems();
      if (resetConfirmBar) setVisible(resetConfirmBar, false);
    });
  }

  if (btnResetConfirmNo) {
    btnResetConfirmNo.addEventListener("click", () => {
      if (resetConfirmBar) setVisible(resetConfirmBar, false);
    });
  }
}

export function openScenarioDetail(id) {
  const scenario = getScenarioById(id);
  if (!scenario) return;

  currentScenarioId = id;
  appState.lastOpenedScenarioId = id;
  saveState();

  const theme = getScenarioTheme(scenario);

  if (detailIcon) {
    detailIcon.textContent = scenario.icon || "🎒";
    detailIcon.style.borderColor = theme.color;
    detailIcon.style.color = theme.color;
    detailIcon.style.boxShadow =
      "0 0 0 1px #f9fafb, 0 0 0 2px " + theme.soft;
  }

  if (detailName) {
    detailName.textContent = scenario.name || "Adsız senaryo";
  }

  const total = scenario.items.length;
  const doneCount = scenario.items.filter((i) => i.done).length;

  if (detailCountText) {
    detailCountText.textContent = t("itemsCompleted", { completed: doneCount, total });
  }

  const ratio = total === 0 ? 0 : (doneCount / total) * 100;
  if (detailProgressInner) {
    detailProgressInner.style.width = ratio.toFixed(0) + "%";
    detailProgressInner.style.background =
      "linear-gradient(90deg," + theme.color + "," + theme.text + ")";
  }

  if (detailStatPill) {
    detailStatPill.style.borderColor = theme.color;
    detailStatPill.style.backgroundImage =
      "linear-gradient(135deg,#fffbeb," + theme.soft + ")";
  }

  if (detailColorLabel) {
    let finalLabel = theme.label;
    if (scenario.colorKey) {
      const kName = scenario.colorKey.charAt(0).toUpperCase() + scenario.colorKey.slice(1);
      finalLabel = t("theme" + kName);
    }
    detailColorLabel.textContent = finalLabel + " •";
    detailColorLabel.style.color = theme.text;
    detailColorLabel.classList.remove("hidden");
  }

  // Senaryo değişince reset onay barını kapat
  if (resetConfirmBar) {
    setVisible(resetConfirmBar, false);
  }

  renderItemList(scenario);
  showDetailView();
  if (inputItemLabel) inputItemLabel.value = "";
}

export function showListView() {
  setVisible(viewList, true);
  setVisible(viewDetail, false);
  currentScenarioId = null;
  appState.lastOpenedScenarioId = null;
  saveState(); // Update lastOpenedScenarioId as null
}

function showDetailView() {
  setVisible(viewList, false);
  setVisible(viewDetail, true);
}

async function handleRenameScenario(id) {
  const scenario = getScenarioById(id);
  if (!scenario) return;

  const newName = prompt(t("ui.edit") + ":", scenario.name || "");
  if (!newName) return;

  scenario.name = newName.trim() || scenario.name;
  await updateScenario(scenario);
  renderScenarioList();
  if (currentScenarioId === id) {
    openScenarioDetail(id);
  }

  showToast(t("toast.saved"), { variant: "default" });
}

async function handleDeleteScenario(id) {
  const scenario = getScenarioById(id);
  if (!scenario) return;

  const confirmDelete = confirm(`${scenario.name} - ${t("toast.deleted")}?`);
  if (!confirmDelete) return;

  await removeScenario(id);
  if (currentScenarioId === id) {
    currentScenarioId = null;
  }
  renderScenarioList();
  showListView();

  showToast(t("toast.deleted"), { variant: "error" });
}

function renderItemList(scenario) {
  if (!itemListEl) return;
  const items = scenario.items || [];
  itemListEl.innerHTML = "";

  if (!items.length) {
    setVisible(itemsEmptyEl, true);
    return;
  }
  setVisible(itemsEmptyEl, false);

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "item-row";
    if (item.done) row.classList.add("done");

    const left = document.createElement("div");
    left.className = "flex items-center gap-2 flex-1";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!item.done;
    checkbox.className =
      "h-4 w-4 rounded border-slate-300 bg-white text-emerald-500 focus:ring-0 cursor-pointer";

    const labelEl = document.createElement("div");
    labelEl.className = "item-label flex-1 truncate";
    if (item.done) labelEl.classList.add("done");
    labelEl.textContent = item.label || "(Adsız madde)";

    left.appendChild(checkbox);
    left.appendChild(labelEl);

    const right = document.createElement("div");
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn danger text-xs";
    deleteBtn.innerHTML = "✕";
    deleteBtn.title = t("ui.delete");

    right.appendChild(deleteBtn);

    checkbox.addEventListener("change", () => {
      item.done = checkbox.checked;
      if (item.done) {
        row.classList.add("done");
        labelEl.classList.add("done");
      } else {
        row.classList.remove("done");
        labelEl.classList.remove("done");
      }
      persistScenarioAndRefresh(scenario.id);
    });

    deleteBtn.addEventListener("click", () => {
      const s = getScenarioById(scenario.id);
      if (!s) return;
      s.items = s.items.filter((i) => i.id !== item.id);
      persistScenarioAndRefresh(s.id);
      showToast(t("toast.deleted"), { variant: "error", duration: 1800 });
    });

    row.appendChild(left);
    row.appendChild(right);

    itemListEl.appendChild(row);
  });
}

function persistScenarioAndRefresh(id) {
  const scenario = getScenarioById(id);
  if (!scenario) return;
  // We use sync update for rapid item checking to avoid UI stutter wait,
  // but DB save happens in background inside updateScenario.
  updateScenario(scenario);
  // Rerender list to update progress bars
  renderScenarioList();
  // We don't call openScenarioDetail again to avoid resetting scroll or input focus
  // But we might need to update the top stat pill
  updateDetailStats(scenario);
}

function updateDetailStats(scenario) {
  const total = scenario.items.length;
  const doneCount = scenario.items.filter((i) => i.done).length;

  if (detailCountText) {
    detailCountText.textContent = t("itemsCompleted", { completed: doneCount, total });
  }
  const ratio = total === 0 ? 0 : (doneCount / total) * 100;
  if (detailProgressInner) {
    detailProgressInner.style.width = ratio.toFixed(0) + "%";
  }
}

// -------------------------
// ITEMS
// -------------------------
function bindItemEvents() {
  if (btnAddItem) {
    btnAddItem.addEventListener("click", () => {
      addItem();
    });
  }

  if (inputItemLabel) {
    inputItemLabel.addEventListener("keyup", (ev) => {
      if (ev.key === "Enter") {
        addItem();
      }
    });
  }

  if (btnResetItems) {
    btnResetItems.addEventListener("click", () => {
      askResetItems();
    });
  }

  if (btnCheckAllItems) {
    btnCheckAllItems.addEventListener("click", () => {
      checkAllItems();
    });
  }
}

function addItem() {
  if (!currentScenarioId || !inputItemLabel) return;
  const label = (inputItemLabel.value || "").trim();
  if (!label) {
    shake(inputItemLabel);
    return;
  }
  const scenario = getScenarioById(currentScenarioId);
  if (!scenario) return;
  scenario.items.push({
    id: genId("item"),
    label,
    done: false,
  });
  inputItemLabel.value = "";
  persistScenarioAndRefresh(scenario.id);

  showToast(t("toast.saved"), { variant: "default" });
}

function askResetItems() {
  if (!currentScenarioId) return;
  const scenario = getScenarioById(currentScenarioId);
  if (!scenario) return;

  if (!scenario.items.length) {
    showToast(t("detail.items.empty"), { variant: "default" });
    return;
  }

  const anyDone = scenario.items.some((i) => i.done);
  if (!anyDone) {
    showToast(t("toast.reset"), { variant: "default" });
    return;
  }

  if (resetConfirmBar) {
    setVisible(resetConfirmBar, true);
  }
}

function resetItems() {
  if (!currentScenarioId) return;
  const scenario = getScenarioById(currentScenarioId);
  if (!scenario) return;
  scenario.items.forEach((item) => {
    item.done = false;
  });
  persistScenarioAndRefresh(scenario.id);

  showToast(t("toast.reset"), { variant: "default" });
}

function checkAllItems() {
  if (!currentScenarioId) return;
  const scenario = getScenarioById(currentScenarioId);
  if (!scenario) return;
  scenario.items.forEach((item) => {
    item.done = true;
  });
  persistScenarioAndRefresh(scenario.id);

  showToast(t("toast.saved"), { variant: "success" });
}
