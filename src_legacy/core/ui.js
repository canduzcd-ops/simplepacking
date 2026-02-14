export function genId(prefix = "id") {
  return (
    prefix +
    "-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(16).slice(2, 8)
  );
}

export function setVisible(el, visible) {
  if (!el) return;
  if (visible) el.classList.remove("hidden");
  else el.classList.add("hidden");
}

export function shake(el) {
  if (!el) return;
  el.classList.remove("shake");
  // Reflow
  void el.offsetWidth;
  el.classList.add("shake");
}
