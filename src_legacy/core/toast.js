let toastRoot = null;

function ensureToastRoot() {
    if (!toastRoot) {
        toastRoot = document.getElementById("toast-root");
    }
    // Eğer yine yoksa create etmeyelim, HTML'de olması bekleniyor.
    // Ama belki yok, o zaman body'ye append edebiliriz.
    if (!toastRoot) {
        toastRoot = document.createElement("div");
        toastRoot.id = "toast-root";
        toastRoot.className =
            "fixed inset-x-0 bottom-4 flex flex-col items-center justify-end pointer-events-none z-50 gap-2";
        document.body.appendChild(toastRoot);
    }
}

export function showToast(message, options = {}) {
    ensureToastRoot();
    if (!toastRoot) return;

    const { variant = "default", duration = 3000 } = options;

    // Variant -> stil map
    // default: siyah/gri, success: yeşil, error: kırmızı
    let bgClass = "bg-slate-800 text-white";
    let borderClass = "border-slate-700";

    if (variant === "success") {
        bgClass = "bg-emerald-600 text-white";
        borderClass = "border-emerald-700";
    } else if (variant === "error") {
        bgClass = "bg-rose-600 text-white";
        borderClass = "border-rose-700";
    } else if (variant === "info") {
        bgClass = "bg-sky-600 text-white";
        borderClass = "border-sky-700";
    }

    const toastEl = document.createElement("div");
    toastEl.className = `
    ${bgClass} border ${borderClass}
    px-4 py-2.5 rounded-xl shadow-lg
    flex items-center gap-2 text-sm font-medium
    transform transition-all duration-300 ease-out
    translate-y-4 opacity-0 scale-95
  `;
    toastEl.style.pointerEvents = "auto";
    toastEl.textContent = message;

    toastRoot.appendChild(toastEl);

    // Animasyon için frame bekle
    requestAnimationFrame(() => {
        toastEl.classList.remove("translate-y-4", "opacity-0", "scale-95");
        toastEl.classList.add("translate-y-0", "opacity-100", "scale-100");
    });

    // Süre dolunca kaldır
    setTimeout(() => {
        toastEl.classList.remove("translate-y-0", "opacity-100", "scale-100");
        toastEl.classList.add("translate-y-4", "opacity-0", "scale-95");

        // Efekt bitince DOM'dan sil
        setTimeout(() => {
            if (toastEl.parentNode) {
                toastEl.parentNode.removeChild(toastEl);
            }
        }, 300);
    }, duration);
}
