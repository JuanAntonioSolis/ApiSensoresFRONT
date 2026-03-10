import { STATUS_CONFIG } from "../constants/statusConfig";

// ─── SUMMARY STRIP ────────────────────────────────────────────────────────────
// Four KPI cards displayed below the Header, one per sensor status type.
// Each card shows:
//   • Status label (uppercased)
//   • Count of sensors currently in that state
//   • Colored dot matching the status palette
//
// Props:
//   sensors  Array  — full SENSOR_META array (unfiltered)

export default function SummaryStrip({ sensors }) {
  // Count sensors per status key
  const counts = Object.fromEntries(
    Object.keys(STATUS_CONFIG).map(k => [
      k,
      sensors.filter(s => s.status === k).length,
    ])
  );

  return (
    <div style={{
      display:             "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap:                 10,
      marginBottom:        24,
    }}>
      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
        <div
          key={key}
          style={{
            background:     cfg.bg,
            border:         `1px solid ${cfg.ring}`,
            borderRadius:   12,
            padding:        "12px 16px",
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
          }}
        >
          <div>
            <div style={{
              fontSize:      9,
              color:         cfg.text,
              fontFamily:    "'DM Mono', monospace",
              letterSpacing: "0.08em",
              opacity:       0.7,
            }}>
              {cfg.label.toUpperCase()}
            </div>
            <div style={{
              fontSize:   24,
              fontWeight: 800,
              color:      cfg.text,
              fontFamily: "'Sora', sans-serif",
              lineHeight: 1.1,
            }}>
              {counts[key] ?? 0}
            </div>
          </div>

          <span style={{
            width:        12,
            height:       12,
            borderRadius: "50%",
            background:   cfg.dot,
            display:      "block",
          }} />
        </div>
      ))}
    </div>
  );
}
