# Sensor Dashboard — Industrial IoT Monitor

Dashboard de monitoreo de sensores en tiempo real, construido con React + Recharts + Framer Motion.

## Stack

| Paquete | Uso |
|---|---|
| `react` + `react-dom` | UI y renderizado |
| `recharts` | Gráficos de líneas y barras |
| `framer-motion` | Animaciones de tarjetas y transiciones tabla↔gráfico |
| `vite` | Dev server y bundler |

## Instalación y arranque

```bash
# 1. Instalar dependencias
npm install

# 2. Arrancar en desarrollo (abre en http://localhost:3000)
npm run dev

# 3. Build de producción
npm run build

# 4. Preview del build
npm run preview
```

## Estructura del proyecto

```
src/
├── main.jsx                  # Entry point React
├── App.jsx                   # Raíz — estado global + composición
│
├── constants/
│   ├── palette.js            # Tokens de color (escala verde G[50..900])
│   ├── sensorMeta.js         # Metadatos estáticos de sensores
│   └── statusConfig.js       # Config visual por estado (ACTIVO, ALERTA…)
│
├── utils/
│   └── generateReadings.js   # Mock data + appendReading() para polling
│
└── components/
    ├── Header.jsx            # Barra superior + countdown ring + controles
    ├── SummaryStrip.jsx      # 4 KPIs de estado
    ├── FilterBar.jsx         # Búsqueda + filtros de estado + planta
    ├── SensorCard.jsx        # Tarjeta expandible con tabla/gráfico
    ├── ChartView.jsx         # Gráfico líneas/barras (Recharts)
    ├── TableView.jsx         # Tabla de históricos scrollable
    ├── Sparkline.jsx         # Mini línea decorativa
    └── ChartTooltip.jsx      # Tooltip custom de Recharts
```

## Conectar a la API real

En `src/utils/generateReadings.js`, reemplaza `appendReading()` con una llamada real:

```js
// Ejemplo con fetch
export async function fetchLatestReadings(sensorId) {
  const res = await fetch(`/api/sensors/${sensorId}/readings?limit=25`);
  return res.json(); // [{ id, valor, unidad, timeDay, sensorId }]
}
```

Y en `App.jsx`, dentro de `refreshData()`:

```js
const refreshData = useCallback(async () => {
  const updates = await Promise.all(
    SENSOR_META.map(s => fetchLatestReadings(s.id))
  );
  setAllReadings(Object.fromEntries(
    SENSOR_META.map((s, i) => [s.id, updates[i]])
  ));
  setLastUpdate(new Date());
  setCountdown(10);
}, []);
```
