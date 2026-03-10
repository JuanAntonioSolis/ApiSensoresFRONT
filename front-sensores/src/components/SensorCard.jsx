import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { G }             from "../constants/palette";
import { STATUS_CONFIG } from "../constants/statusConfig";
import Sparkline          from "./Sparkline";
import TableView          from "./TableView";
import ChartView          from "./ChartView";

// ─── SENSOR CARD ──────────────────────────────────────────────────────────────
// The primary unit of the dashboard. Displays:
//   • Live latest value + delta vs previous reading
//   • Decorative sparkline (last N readings)
//   • Status badge (ACTIVO, MANTENIMIENTO, etc.)
//
// When selected (isSelected=true), the card expands with Framer Motion to show:
//   • Toggle bar: Tabla | Gráfico  +  Línea | Barras
//   • Animated content swap (TableView ↔ ChartView)
//   • Stats footer: MAX · MIN · AVG
//
// Props:
//   sensor      Object  — SENSOR_META entry
//   readings    Array   — last 25 readings
//   isSelected  bool
//   onClick     fn

// ── Sub-component: Status Badge ───────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.INACTIVO;
  return (
    <span
      style={{
        display:     "inline-flex",
        alignItems:  "center",
        gap:         5,
        background:  cfg.bg,
        color:       cfg.text,
        border:      `1px solid ${cfg.ring}`,
        borderRadius: 20,
        padding:     "3px 8px",
        fontSize:    10,
        fontFamily:  "'DM Mono', monospace",
        fontWeight:  500,
      }}
    >
      <span
        style={{
          width:        6,
          height:       6,
          borderRadius: "50%",
          background:   cfg.dot,
          display:      "inline-block",
          boxShadow:    status === "ACTIVO" ? `0 0 0 2px ${cfg.ring}` : "none",
          animation:    status === "ACTIVO" ? "pulse 2s infinite" : "none",
        }}
      />
      {cfg.label}
    </span>
  );
}

// ── Sub-component: View Toggle Bar ────────────────────────────────────────────
function ViewToggleBar({ view, setView, chartType, setChartType }) {
  return (
    <div
      style={{
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "center",
        padding:        "10px 18px",
        background:     "#fafafa",
        borderBottom:   "1px solid #f1f5f9",
      }}
    >
      {/* Table / Chart toggle */}
      <div style={{ display: "flex", gap: 4 }}>
        {["table", "chart"].map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding:    "4px 12px",
              borderRadius: 6,
              border:     "none",
              cursor:     "pointer",
              fontSize:   10,
              fontFamily: "'DM Mono', monospace",
              fontWeight: view === v ? 700 : 400,
              background: view === v ? G[500] : "transparent",
              color:      view === v ? "#fff" : "#94a3b8",
              transition: "all 0.15s",
            }}
          >
            {v === "table" ? "↕ Tabla" : "∿ Gráfico"}
          </button>
        ))}
      </div>

      {/* Line / Bar toggle — only visible in chart mode */}
      {view === "chart" && (
        <div style={{ display: "flex", gap: 4 }}>
          {["line", "bar"].map(ct => (
            <button
              key={ct}
              onClick={() => setChartType(ct)}
              style={{
                padding:    "4px 10px",
                borderRadius: 6,
                border:     `1px solid ${chartType === ct ? G[300] : "#e2e8f0"}`,
                cursor:     "pointer",
                fontSize:   10,
                fontFamily: "'DM Mono', monospace",
                background: chartType === ct ? G[50] : "#fff",
                color:      chartType === ct ? G[700] : "#94a3b8",
                transition: "all 0.15s",
              }}
            >
              {ct === "line" ? "Línea" : "Barras"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sub-component: Stats Footer ───────────────────────────────────────────────
function StatsFooter({ readings, unit }) {
  const values = readings.map(r => r.valor);
  const stats = [
    { label: "MÁX", value: Math.max(...values).toFixed(1) },
    { label: "MÍN", value: Math.min(...values).toFixed(1) },
    { label: "AVG", value: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) },
  ];

  return (
    <div
      style={{
        display:             "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        borderTop:           `1px solid ${G[100]}`,
        background:          G[50],
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          style={{
            padding:     "10px 0",
            textAlign:   "center",
            borderRight: i < stats.length - 1 ? `1px solid ${G[100]}` : "none",
          }}
        >
          <div style={{ fontSize: 9, color: "#94a3b8", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>
            {s.label}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: G[700], fontFamily: "'Sora', sans-serif" }}>
            {s.value}
          </div>
          <div style={{ fontSize: 9, color: "#cbd5e1", fontFamily: "'DM Mono', monospace" }}>
            {unit}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SensorCard({ sensor, readings, isSelected, onClick }) {
  const [view,      setView]      = useState("table"); // "table" | "chart"
  const [chartType, setChartType] = useState("line");  // "line"  | "bar"

  const last  = readings[readings.length - 1];
  const prev  = readings[readings.length - 2];
  const delta = last && prev ? (last.valor - prev.valor).toFixed(2) : null;
  const trend = delta > 0 ? "↑" : delta < 0 ? "↓" : "→";
  const deltaColor = delta > 0 ? "#16a34a" : delta < 0 ? "#ef4444" : "#94a3b8";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      style={{
        background:  "#fff",
        border:      `1.5px solid ${isSelected ? G[300] : "#f1f5f9"}`,
        borderRadius: 16,
        overflow:    "hidden",
        cursor:      "pointer",
        boxShadow:   isSelected
          ? `0 0 0 3px ${G[100]}, 0 8px 32px rgba(34,197,94,0.08)`
          : "0 2px 12px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
    >
      {/* ── Card Header ─────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid #f8fafc" }}>

        {/* Sensor identity + status badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20, lineHeight: 1, color: G[500] }}>{sensor.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}>
                {sensor.name}
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'DM Mono', monospace", marginTop: 1 }}>
                {sensor.location} · ID:{sensor.id}
              </div>
            </div>
          </div>
          <StatusBadge status={sensor.status} />
        </div>

        {/* Live value + delta */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <span style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.04em", lineHeight: 1 }}>
              {last?.valor ?? "—"}
            </span>
            <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 4, fontFamily: "'DM Mono', monospace" }}>
              {sensor.unit}
            </span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: deltaColor, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>
              {trend} {Math.abs(delta)} {sensor.unit}
            </div>
            <div style={{ fontSize: 10, color: "#cbd5e1", fontFamily: "'DM Mono', monospace" }}>
              vs anterior
            </div>
          </div>
        </div>

        {/* Sparkline */}
        <div style={{ marginTop: 8, opacity: 0.6 }}>
          <Sparkline data={readings} />
        </div>
      </div>

      {/* ── Expanded Detail Panel ────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isSelected && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
            onClick={e => e.stopPropagation()}
          >
            <ViewToggleBar
              view={view}           setView={setView}
              chartType={chartType} setChartType={setChartType}
            />

            {/* Animated content swap */}
            <div style={{ padding: "12px 18px 16px" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={view + chartType}
                  initial={{ opacity: 0, x: view === "table" ? -12 : 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{   opacity: 0, x: view === "table" ?  12 : -12 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  {view === "table"
                    ? <TableView data={readings} unit={sensor.unit} />
                    : <ChartView data={readings} chartType={chartType} />
                  }
                </motion.div>
              </AnimatePresence>
            </div>

            <StatsFooter readings={readings} unit={sensor.unit} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
