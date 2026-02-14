export function getTheme() {
    return localStorage.getItem("raca_theme") || "light";
}

export function setTheme(theme) {
    localStorage.setItem("raca_theme", theme);
    applyTheme(theme);
}

export function applyTheme(theme) {
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
}

export function initTheme() {
    const theme = getTheme();
    applyTheme(theme);
}
