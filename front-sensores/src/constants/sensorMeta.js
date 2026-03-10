// ─── SENSOR METADATA ─────────────────────────────────────────────────────────
// Static config for each sensor: identity, unit, location, and current status.
// In a real app this would be fetched from the API on mount.

export const SENSOR_META = [
  { id: 1, name: "Depósito Principal",  unit: "Litros", icon: "◈", status: "ACTIVO",        location: "Planta A" },
  { id: 2, name: "Caudal Entrada",      unit: "L/min",  icon: "◎", status: "ACTIVO",        location: "Planta A" },
  { id: 3, name: "Presión Hidráulica",  unit: "Bar",    icon: "◉", status: "MANTENIMIENTO", location: "Planta B" },
  { id: 4, name: "Temperatura Proceso", unit: "°C",     icon: "◐", status: "ACTIVO",        location: "Planta B" },
  { id: 5, name: "Nivel Químico",       unit: "Litros", icon: "◑", status: "INACTIVO",      location: "Planta C" },
  { id: 6, name: "Vibración Motor",     unit: "mm/s",   icon: "◒", status: "ACTIVO",        location: "Planta C" },
];

// All unique locations derived from SENSOR_META — used by FilterBar
export const LOCATIONS = ["TODAS", ...new Set(SENSOR_META.map(s => s.location))];
