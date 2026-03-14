import { G }                          from "../constants/palette";
import { STATUS_CONFIG } from "../constants/statusConfig";


//Estados de sensores y actuadores
const STATUS_FILTERS = [
    'TODOS', 'ACTIVO', 'INACTIVO', 'MANTENIMIENTO',
    'ABIERTO', 'CERRADO', 'APAGADO', 'ENCENDIDO'
];

const SECTORS = ['TODAS', '1', '2'];

const GREEN = "#22c55e";
const GREEN_LIGHT = "#bbf7d0";

const getDotColor = (status) => {
    switch (status) {
        case 'ACTIVO': case 'ENCENDIDO': case 'ABIERTO': return '#22c55e';
        case 'INACTIVO': case 'MANTENIMIENTO':            return '#f59e0b';
        case 'APAGADO': case 'CERRADO':                   return '#ef4444';
        default:                                           return '#94a3b8';
    }
};

export default function FilterBar({
                                      search, setSearch,
                                      statusFilter, setStatusFilter,
                                      locationFilter, setLocationFilter,
                                  }) {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>

            {/* ── Buscador ─────────────────────────────────────────────────── */}
            <div style={{ position: "relative", flex: "1 1 200px", minWidth: 180 }}>
        <span style={{
            position: "absolute", left: 10, top: "50%",
            transform: "translateY(-50%)", color: "#94a3b8", fontSize: 13,
        }}>
          ⌕
        </span>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar sensor…"
                    style={{
                        width: "100%", padding: "8px 12px 8px 30px",
                        border: "1.5px solid #f1f5f9", borderRadius: 10,
                        fontSize: 12, fontFamily: "'DM Mono', monospace",
                        outline: "none", background: "#fff", color: "#334155",
                        boxSizing: "border-box", transition: "border-color 0.15s",
                    }}
                    onFocus={e => (e.target.style.borderColor = GREEN_LIGHT)}
                    onBlur={e  => (e.target.style.borderColor = "#f1f5f9")}
                />
            </div>

            {/* ── Filtros de estado ─────────────────────────────────────────── */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {STATUS_FILTERS.map(s => {
                    const active = statusFilter === s;
                    return (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            style={{
                                padding: "6px 12px", borderRadius: 20,
                                border: `1.5px solid ${active ? "#cbd5e1" : "#f1f5f9"}`,
                                background: active ? "#f8fafc" : "#fff",
                                color: active ? "#334155" : "#94a3b8",
                                fontSize: 10, fontFamily: "'DM Mono', monospace",
                                cursor: "pointer", fontWeight: active ? 700 : 400,
                                display: "flex", alignItems: "center", gap: 5,
                                transition: "all 0.15s",
                            }}
                        >
              <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: getDotColor(s), display: "inline-block",
              }} />
                            {s}
                        </button>
                    );
                })}
            </div>

            {/* ── Selector de sector ───────────────────────────────────────── */}
            <select
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                style={{
                    padding: "7px 12px", borderRadius: 10,
                    border: "1.5px solid #f1f5f9", background: "#fff",
                    fontSize: 11, fontFamily: "'DM Mono', monospace",
                    color: "#64748b", cursor: "pointer", outline: "none",
                }}
            >
                {SECTORS.map(loc => (
                    <option key={loc} value={loc}>
                        {loc === 'TODAS' ? 'TODOS LOS SECTORES' : `SECTOR ${loc}`}
                    </option>
                ))}
            </select>

        </div>
    );
}
