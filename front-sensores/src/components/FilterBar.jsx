import { G }                          from "../constants/palette";
import { STATUS_CONFIG, STATUS_FILTERS } from "../constants/statusConfig";
import { LOCATIONS }                   from "../constants/sensorMeta";

// ─── FILTER BAR ───────────────────────────────────────────────────────────────
// Provides three filtering controls rendered in a single horizontal strip:
//   1. Text search  — matches sensor name or ID
//   2. Status pills — TODOS | ACTIVO | MANTENIMIENTO | INACTIVO | ALERTA
//   3. Location     — dropdown derived from SENSOR_META locations
//
// Props:
//   search          string
//   setSearch       fn(string)
//   statusFilter    string  — one of STATUS_FILTERS
//   setStatusFilter fn(string)
//   locationFilter  string  — one of LOCATIONS
//   setLocationFilter fn(string)

export default function FilterBar({
  search, setSearch,
  statusFilter, setStatusFilter,
  locationFilter, setLocationFilter,
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>

      {/* ── Text Search ───────────────────────────────────────────────── */}
      <div style={{ position: "relative", flex: "1 1 200px", minWidth: 180 }}>
        <span style={{
          position:  "absolute",
          left:      10,
          top:       "50%",
          transform: "translateY(-50%)",
          color:     "#94a3b8",
          fontSize:  13,
        }}>
          ⌕
        </span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar sensor…"
          style={{
            width:      "100%",
            padding:    "8px 12px 8px 30px",
            border:     "1.5px solid #f1f5f9",
            borderRadius: 10,
            fontSize:   12,
            fontFamily: "'DM Mono', monospace",
            outline:    "none",
            background: "#fff",
            color:      "#334155",
            boxSizing:  "border-box",
            transition: "border-color 0.15s",
          }}
          onFocus={e => (e.target.style.borderColor = G[300])}
          onBlur={e  => (e.target.style.borderColor = "#f1f5f9")}
        />
      </div>

      {/* ── Status Pill Filters ───────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {STATUS_FILTERS.map(s => {
          const active = statusFilter === s;
          const cfg    = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding:     "6px 12px",
                borderRadius: 8,
                border:      `1.5px solid ${active ? G[300] : "#f1f5f9"}`,
                background:  active ? G[50] : "#fff",
                color:       active ? G[700] : "#94a3b8",
                fontSize:    10,
                fontFamily:  "'DM Mono', monospace",
                cursor:      "pointer",
                fontWeight:  active ? 700 : 400,
                display:     "flex",
                alignItems:  "center",
                gap:         5,
                transition:  "all 0.15s",
              }}
            >
              {cfg && (
                <span style={{
                  width:        6,
                  height:       6,
                  borderRadius: "50%",
                  background:   cfg.dot,
                  display:      "inline-block",
                }} />
              )}
              {s}
            </button>
          );
        })}
      </div>

      {/* ── Location Dropdown ─────────────────────────────────────────── */}
      <select
        value={locationFilter}
        onChange={e => setLocationFilter(e.target.value)}
        style={{
          padding:    "7px 12px",
          borderRadius: 10,
          border:     "1.5px solid #f1f5f9",
          background: "#fff",
          fontSize:   11,
          fontFamily: "'DM Mono', monospace",
          color:      "#64748b",
          cursor:     "pointer",
          outline:    "none",
        }}
      >
        {LOCATIONS.map(l => <option key={l}>{l}</option>)}
      </select>
    </div>
  );
}
