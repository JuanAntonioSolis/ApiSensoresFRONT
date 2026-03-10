import { SENSOR_META } from "../constants/sensorMeta";

// ─── MOCK DATA GENERATOR ──────────────────────────────────────────────────────
// Simulates the last `count` readings from the API endpoint:
//   GET /api/sensors/{id}/readings?limit=25
// Response shape: { id, valor, unidad, timeDay, sensorId }

const BASE_VALUES = [60, 120, 75, 22, 80, 3.5];

/**
 * Generate an array of mock readings for a given sensor.
 * @param {number} sensorId - 1-based sensor ID
 * @param {number} count    - number of readings to generate (default 25)
 * @returns {Array<{ id, valor, unidad, timeDay, sensorId }>}
 */
export function generateReadings(sensorId, count = 25) {
  const base     = BASE_VALUES[sensorId - 1] ?? 50;
  const variance = base * 0.18;
  const now      = new Date();
  const meta     = SENSOR_META[sensorId - 1];

  return Array.from({ length: count }, (_, i) => {
    const t = new Date(now - (count - 1 - i) * 37_000);
    return {
      id:      i + 1,
      valor:   parseFloat((base + (Math.random() - 0.5) * variance * 2).toFixed(2)),
      unidad:  meta.unit,
      timeDay: t.toISOString().replace("T", " ").slice(0, 19),
      sensorId,
    };
  });
}

/**
 * Append a single new reading to an existing readings array (rolling window of 25).
 * Simulates the incremental update that polling would deliver.
 * @param {Array}  prev   - existing readings array
 * @param {Object} sensor - SENSOR_META entry
 * @returns {Array} new readings array (max 25 items)
 */
export function appendReading(prev, sensor) {
  const last = prev[prev.length - 1];
  const newReading = {
    id:      last.id + 1,
    valor:   parseFloat(
      (last.valor + (Math.random() - 0.48) * last.valor * 0.08).toFixed(2)
    ),
    unidad:  sensor.unit,
    timeDay: new Date().toISOString().replace("T", " ").slice(0, 19),
    sensorId: sensor.id,
  };
  return [...prev.slice(-24), newReading];
}
