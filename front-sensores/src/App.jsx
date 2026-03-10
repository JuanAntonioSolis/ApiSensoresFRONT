import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { SENSOR_META }               from "./constants/sensorMeta";
import { G }                         from "./constants/palette";
import { generateReadings,
         appendReading }             from "./utils/generateReadings";
import Header                        from "./components/Header";
import SummaryStrip                  from "./components/SummaryStrip";
import FilterBar                     from "./components/FilterBar";
import SensorCard                    from "./components/SensorCard";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
// Injected once at the root level so they cascade to all child components.
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    body {
      margin: 0;
      background: #f8fafc;
      -webkit-font-smoothing: antialiased;
    }

    /* Status dot pulse animation (used in SensorCard → StatusBadge) */
    @keyframes pulse {
      0%, 100% { opacity: 1;   box-shadow: 0 0 0 2px #bbf7d0; }
      50%       { opacity: 0.7; box-shadow: 0 0 0 4px #dcfce7; }
    }

    /* Thin custom scrollbar */
    ::-webkit-scrollbar       { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
  `}</style>
);

// ─── APP ──────────────────────────────────────────────────────────────────────
// Root component. Owns all state:
//   • allReadings    — rolling window of 25 readings per sensor
//   • selectedId     — which SensorCard is currently expanded
//   • paused         — whether polling is active
//   • countdown      — seconds until next auto-refresh
//   • lastUpdate     — timestamp of last data refresh
//   • search / statusFilter / locationFilter — filter state

export default function App() {
  // ── Data state ──────────────────────────────────────────────────────────────
  const [allReadings, setAllReadings] = useState(() =>
    Object.fromEntries(SENSOR_META.map(s => [s.id, generateReadings(s.id)]))
  );
  const [selectedId,  setSelectedId]  = useState(null);

  // ── Polling state ────────────────────────────────────────────────────────────
  const [paused,      setPaused]      = useState(false);
  const [countdown,   setCountdown]   = useState(10);
  const [lastUpdate,  setLastUpdate]  = useState(new Date());

  // ── Filter state ─────────────────────────────────────────────────────────────
  const [search,          setSearch]          = useState("");
  const [statusFilter,    setStatusFilter]    = useState("TODOS");
  const [locationFilter,  setLocationFilter]  = useState("TODAS");

  // ── Refresh callback ─────────────────────────────────────────────────────────
  // In production: replace the forEach block with a real API fetch per sensor,
  // e.g. GET /api/sensors/{id}/readings?limit=25
  const refreshData = useCallback(() => {
    setAllReadings(prev => {
      const next = { ...prev };
      SENSOR_META.forEach(s => {
        next[s.id] = appendReading(prev[s.id], s);
      });
      return next;
    });
    setLastUpdate(new Date());
    setCountdown(10);
  }, []);

  // ── Auto-polling (every 10 s) ─────────────────────────────────────────────
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(refreshData, 10_000);
    return () => clearInterval(interval);
  }, [paused, refreshData]);

  // ── Countdown ticker (every 1 s) ─────────────────────────────────────────
  useEffect(() => {
    if (paused) return;
    const tick = setInterval(
      () => setCountdown(c => (c <= 1 ? 10 : c - 1)),
      1_000
    );
    return () => clearInterval(tick);
  }, [paused]);

  // ── Filtered sensor list ──────────────────────────────────────────────────
  const filtered = SENSOR_META.filter(s => {
    const matchSearch   = s.name.toLowerCase().includes(search.toLowerCase())
                       || String(s.id).includes(search);
    const matchStatus   = statusFilter   === "TODOS" || s.status   === statusFilter;
    const matchLocation = locationFilter === "TODAS" || s.location === locationFilter;
    return matchSearch && matchStatus && matchLocation;
  });

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleTogglePause = () => { setPaused(p => !p); setCountdown(10); };
  const handleCardClick   = id => setSelectedId(prev => prev === id ? null : id);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <GlobalStyles />

      <div style={{
        minHeight:       "100vh",
        background:      "#f8fafc",
        backgroundImage: `
          radial-gradient(circle at 20% 0%,   #f0fdf4 0%, transparent 40%),
          radial-gradient(circle at 80% 100%,  #dcfce7 0%, transparent 35%)
        `,
        padding:    "28px 24px",
        fontFamily: "'Sora', sans-serif",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* ── Top bar ─────────────────────────────────────────────────── */}
          <Header
            paused={paused}
            togglePause={handleTogglePause}
            onRefresh={refreshData}
            countdown={countdown}
          />

          {/* ── Status KPIs ─────────────────────────────────────────────── */}
          <SummaryStrip sensors={SENSOR_META} />

          {/* ── Filter panel ────────────────────────────────────────────── */}
          <div style={{
            background:   "#fff",
            borderRadius: 14,
            padding:      "14px 18px",
            border:       "1.5px solid #f1f5f9",
            marginBottom: 20,
            boxShadow:    "0 2px 12px rgba(0,0,0,0.03)",
          }}>
            <FilterBar
              search={search}                   setSearch={setSearch}
              statusFilter={statusFilter}       setStatusFilter={setStatusFilter}
              locationFilter={locationFilter}   setLocationFilter={setLocationFilter}
            />
          </div>

          {/* ── Results meta ────────────────────────────────────────────── */}
          <div style={{
            fontSize:     11,
            color:        "#94a3b8",
            fontFamily:   "'DM Mono', monospace",
            marginBottom: 14,
            paddingLeft:  2,
          }}>
            {filtered.length} sensor{filtered.length !== 1 ? "es" : ""}
            {" · "}
            Última sync: {lastUpdate.toLocaleTimeString()}
          </div>

          {/* ── Sensor grid ─────────────────────────────────────────────── */}
          <motion.div
            layout
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap:                 16,
              alignItems:          "start",
            }}
          >
            <AnimatePresence>
              {filtered.map(sensor => (
                <SensorCard
                  key={sensor.id}
                  sensor={sensor}
                  readings={allReadings[sensor.id]}
                  isSelected={selectedId === sensor.id}
                  onClick={() => handleCardClick(sensor.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div style={{
              textAlign:  "center",
              padding:    "60px 0",
              color:      "#cbd5e1",
              fontFamily: "'DM Mono', monospace",
              fontSize:   13,
            }}>
              ◌ Sin sensores que coincidan con los filtros
            </div>
          )}

          {/* ── Footer ──────────────────────────────────────────────────── */}
          <div style={{
            marginTop:  40,
            textAlign:  "center",
            fontSize:   10,
            color:      "#e2e8f0",
            fontFamily: "'DM Mono', monospace",
          }}>
            INDUSTRIAL IoT MONITOR · POLLING {paused ? "PAUSED" : "ACTIVE @ 10s"} · {new Date().getFullYear()}
          </div>

        </div>
      </div>
    </>
  );
}
