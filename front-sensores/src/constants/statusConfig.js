// ─── STATUS CONFIGURATION ────────────────────────────────────────────────────
// Visual tokens for each sensor status: colors, labels, and badge styling.
// Used in SensorCard, SummaryStrip, and FilterBar.

export const STATUS_CONFIG = {
  ACTIVO: {
    label: "Activo",
    dot:   "#4ade80",
    bg:    "#f0fdf4",
    text:  "#166534",
    ring:  "#bbf7d0",
  },
  MANTENIMIENTO: {
    label: "Mantenim.",
    dot:   "#fbbf24",
    bg:    "#fffbeb",
    text:  "#92400e",
    ring:  "#fde68a",
  },
  INACTIVO: {
    label: "Inactivo",
    dot:   "#94a3b8",
    bg:    "#f8fafc",
    text:  "#475569",
    ring:  "#e2e8f0",
  },
  ALERTA: {
    label: "Alerta",
    dot:   "#f87171",
    bg:    "#fef2f2",
    text:  "#991b1b",
    ring:  "#fecaca",
  },
};

// Ordered list for filter buttons
export const STATUS_FILTERS = ["TODOS", ...Object.keys(STATUS_CONFIG)];
