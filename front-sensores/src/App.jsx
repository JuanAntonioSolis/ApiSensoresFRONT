import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SummaryStrip from './components/SummaryStrip';
import FilterBar from './components/FilterBar';
import SensorCard from './components/SensorCard';
import { taskApi } from './api/api.jsx';

function App() {
    const [sensors, setSensors]       = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);
    const [lectures, setLectures]     = useState({});

    const [filter, setFilter]               = useState('TODOS');
    const [sectorFilter, setSectorFilter]   = useState('TODAS');
    const [searchTerm, setSearchTerm]       = useState('');
    const [paused, setPaused]               = useState(false);
    const [countdown, setCountdown]         = useState(10);

    // Agrupa lecturas por sensorId
    const groupLectures = (lectureData) => {
        const grouped = {};
        lectureData.forEach(l => {
            if (!grouped[l.sensorId]) grouped[l.sensorId] = [];
            grouped[l.sensorId].push(l);
        });
        return grouped;
    };

    // Carga inicial
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [sensorsData, lectureData] = await Promise.all([
                    taskApi.getAllSensors(),
                    taskApi.getAllLectures(),
                ]);
                setSensors(sensorsData);
                setLectures(groupLectures(lectureData));
            } catch (err) {
                console.error("Error:", err);
                setError("Error al conectar con Backend");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Refresco manual
    const refreshData = useCallback(async () => {
        try {
            const lectureData = await taskApi.getAllLectures();
            setLectures(groupLectures(lectureData));
            setCountdown(10);
        } catch (err) {
            console.error("Error al refrescar:", err);
        }
    }, []);

    // Polling cada 10s
    useEffect(() => {
        if (paused || loading) return;
        const interval = setInterval(() => { refreshData(); }, 10000);
        return () => clearInterval(interval);
    }, [paused, loading, refreshData]);

    // Countdown tick
    useEffect(() => {
        if (paused || loading) return;
        const tick = setInterval(() => setCountdown(c => c <= 1 ? 10 : c - 1), 1000);
        return () => clearInterval(tick);
    }, [paused, loading]);

    const filteredSensors = sensors.filter(sensor => {
        const matchesState   = filter === 'TODOS' || sensor.state === filter;
        const matchesSector  = sectorFilter === 'TODAS' || sensor.sector === sectorFilter;
        const matchesSearch  = sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sensor.type.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesState && matchesSector && matchesSearch;
    });

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontFamily: "'DM Mono', monospace" }}>
            Cargando sistemas de monitoreo...
        </div>
    );

    if (error) return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>
            ⚠️ {error}
        </div>
    );

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #f8fafc; }
        @keyframes pulse {
          0%,100% { opacity:1; box-shadow: 0 0 0 2px #bbf7d0; }
          50%      { opacity:.7; box-shadow: 0 0 0 4px #dcfce7; }
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
      `}</style>
            <div style={{
                minHeight: '100vh',
                background: '#f8fafc',
                backgroundImage: 'radial-gradient(circle at 20% 0%, #f0fdf4 0%, transparent 40%), radial-gradient(circle at 80% 100%, #dcfce7 0%, transparent 35%)',
                padding: '28px 24px',
                fontFamily: "'Sora', sans-serif",
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>

                    <Header
                        paused={paused}
                        togglePause={() => { setPaused(p => !p); setCountdown(10); }}
                        onRefresh={refreshData}
                        countdown={countdown}
                        totalSensors={sensors.length}
                    />

                    <SummaryStrip sensors={sensors} />

                    <div style={{ background: '#fff', borderRadius: 14, padding: '14px 18px', border: '1.5px solid #f1f5f9', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                        <FilterBar
                            search={searchTerm}         setSearch={setSearchTerm}
                            statusFilter={filter}       setStatusFilter={setFilter}
                            locationFilter={sectorFilter} setLocationFilter={setSectorFilter}
                        />
                    </div>

                    <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: "'DM Mono', monospace", marginBottom: 14, paddingLeft: 2 }}>
                        {filteredSensors.length} sensor{filteredSensors.length !== 1 ? 'es' : ''} encontrados
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16, alignItems: 'start' }}>
                        {filteredSensors.map(sensor => (
                            <SensorCard
                                key={sensor.id}
                                sensor={sensor}
                                lectures={lectures[sensor.id] || []}
                            />
                        ))}
                    </div>

                    {filteredSensors.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: '#cbd5e1', fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
                            ◌ Sin sensores que coincidan con los filtros
                        </div>
                    )}

                    <div style={{ marginTop: 40, textAlign: 'center', fontSize: 10, color: '#e2e8f0', fontFamily: "'DM Mono', monospace" }}>
                        INDUSTRIAL IoT MONITOR · POLLING {paused ? 'PAUSED' : 'ACTIVE @ 10s'} · {new Date().getFullYear()}
                    </div>

                </div>
            </div>
        </>
    );
}

export default App;