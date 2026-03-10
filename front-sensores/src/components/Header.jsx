import { G } from "../constants/palette";
import { SENSOR_META } from "../constants/sensorMeta";

// ─── HEADER ───────────────────────────────────────────────────────────────────
// Top bar of the dashboard. Contains:
//   • Title + subtitle
//   • Animated SVG countdown ring (resets every 10s)
//   • Manual refresh button
//   • Pause / Resume polling toggle
//   • EN VIVO / PAUSADO status indicator
//
// Props:
//   paused       bool
//   togglePause  fn()
//   onRefresh    fn()
//   lastUpdate   Date
//   countdown    number  — seconds remaining until next auto-refresh (0–10)

// ── Sub-component: Countdown Ring ─────────────────────────────────────────────
function CountdownRing({ countdown, paused }) {
  // SVG circle circumference for r=14: 2π×14 ≈ 87.96
  const CIRCUMFERENCE = 87.96;
  const progress = paused ? CIRCUMFERENCE : (countdown / 10) * CIRCUMFERENCE;

  return (
    <div style={{
      display:    "flex",
      alignItems: "center",
      gap:        6,
      padding:    "6px 12px",
      background: "#f8fafc",
      borderRadius: 10,
      fontSize:   11,
      fontFamily: "'DM Mono', monospace",
      color:      "#64748b",
    }}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 36 36"
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track */}
        <circle cx="18" cy="18" r="14" fill="none" stroke={G[100]} strokeWidth="3" />
        {/* Progress */}
        <circle
          cx="18" cy="18" r="14"
          fill="none"
          stroke={G[400]}
          strokeWidth="3"
          strokeDasharray={`${progress} ${CIRCUMFERENCE}`}
          style={{ transition: "stroke-dasharray 1s linear" }}
        />
      </svg>
      {paused ? "—" : `${countdown}s`}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Header({ paused, togglePause, onRefresh, countdown }) {
  return (
    <div style={{
      display:        "flex",
      justifyContent: "space-between",
      alignItems:     "center",
      flexWrap:       "wrap",
      gap:            12,
      marginBottom:   24,
    }}>
      {/* Title block */}
      <div>
        <h1 style={{
          margin:        0,
          fontSize:      22,
          fontWeight:    800,
          letterSpacing: "-0.04em",
          color:         "#0f172a",
          fontFamily:    "'Sora', sans-serif",
          lineHeight:    1.1,
        }}>
          Sistema de{" "}
          <span style={{ color: G[500] }}>Monitoreo</span>
        </h1>
        <p style={{
          margin:     "4px 0 0",
          fontSize:   11,
          color:      "#94a3b8",
          fontFamily: "'DM Mono', monospace",
        }}>
          {SENSOR_META.length} sensores activos · Actualización cada 10s
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <CountdownRing countdown={countdown} paused={paused} />

        <button
          onClick={onRefresh}
          style={{
            padding:    "7px 14px",
            borderRadius: 10,
            border:     `1.5px solid ${G[200]}`,
            background: G[50],
            color:      G[700],
            fontSize:   11,
            fontFamily: "'DM Mono', monospace",
            cursor:     "pointer",
            fontWeight: 600,
            transition: "all 0.15s",
          }}
        >
          ↻ Actualizar
        </button>

        <button
          onClick={togglePause}
          style={{
            padding:    "7px 16px",
            borderRadius: 10,
            border:     "none",
            background: paused ? G[500] : "#f1f5f9",
            color:      paused ? "#fff" : "#64748b",
            fontSize:   11,
            fontFamily: "'DM Mono', monospace",
            cursor:     "pointer",
            fontWeight: 600,
            transition: "all 0.2s",
          }}
        >
          {paused ? "▶ Reanudar" : "⏸ Pausar"}
        </button>

        {/* Live indicator */}
        <div style={{
          padding:    "6px 10px",
          background: paused ? "#fef2f2" : G[50],
          borderRadius: 8,
          fontSize:   10,
          fontFamily: "'DM Mono', monospace",
          color:      paused ? "#ef4444" : G[600],
          border:     `1px solid ${paused ? "#fecaca" : G[200]}`,
        }}>
          {paused ? "● PAUSADO" : "● EN VIVO"}
        </div>
      </div>
    </div>
  );
}
