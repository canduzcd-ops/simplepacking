export const themes = {
  neutral: {
    label: "Nötr",
    color: "#9ca3af", // slate-400
    soft: "rgba(156,163,175,0.2)",
    text: "#374151", // slate-700
  },
  work: {
    label: "İş",
    color: "#38bdf8", // sky-400
    soft: "rgba(56,189,248,0.2)",
    text: "#0c4a6e", // sky-900
  },
  sport: {
    label: "Spor",
    color: "#22c55e", // green-500
    soft: "rgba(34,197,94,0.2)",
    text: "#14532d", // green-900
  },
  travel: {
    label: "Tatil",
    color: "#f97316", // orange-500
    soft: "rgba(249,115,22,0.2)",
    text: "#7c2d12", // orange-900
  },
  wedding: {
    label: "Düğün",
    color: "#ec4899", // pink-500
    soft: "rgba(236,72,153,0.2)",
    text: "#831843", // pink-900
  },
};

export function getScenarioTheme(scenario) {
  if (!scenario || !scenario.colorKey) return themes.neutral;
  return themes[scenario.colorKey] || themes.neutral;
}

export function inferColorKeyFromName(name) {
  const n = (name || "").toLowerCase();
  if (n.includes("iş") || n.includes("ofis") || n.includes("toplantı"))
    return "work";
  if (
    n.includes("spor") ||
    n.includes("gym") ||
    n.includes("fitness") ||
    n.includes("koşu")
  )
    return "sport";
  if (
    n.includes("tatil") ||
    n.includes("gezi") ||
    n.includes("yolculuk") ||
    n.includes("kamp")
  )
    return "travel";
  if (
    n.includes("düğün") ||
    n.includes("nikah") ||
    n.includes("davet") ||
    n.includes("balo")
  )
    return "wedding";
  return "neutral";
}
