/**
 * MQTT Shopfloor Demo Data
 * Realistic manufacturing IoT data for visualization.
 */

export type MachineStatus = 'running' | 'idle' | 'fault' | 'maintenance'

export interface MachineAttribute {
  temperature: number      // °C
  cycle_time: number       // seconds
  throughput: number       // units/hr
  oee: number              // %
  vibration: number        // mm/s
  power_consumption: number // kW
  status: MachineStatus
}

export interface TimeSeriesPoint {
  timestamp: number
  value: number
}

export interface Machine {
  id: string
  name: string
  topic: string
  attributes: MachineAttribute
  timeSeries: Record<string, TimeSeriesPoint[]>
}

export interface Station {
  id: string
  name: string
  topic: string
  machines: Machine[]
}

export interface Shopfloor {
  id: string
  name: string
  topic: string
  stations: Station[]
}

// Seeded random for deterministic data
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateTimeSeries(
  baseValue: number,
  variance: number,
  min: number,
  max: number,
  seed: number,
  trend: number = 0
): TimeSeriesPoint[] {
  const rand = seededRandom(seed)
  const now = Date.now()
  const interval = 2.4 * 60 * 1000 // 2.4 minutes
  const points: TimeSeriesPoint[] = []

  let value = baseValue
  for (let i = 0; i < 50; i++) {
    value = baseValue + trend * (i / 50) + (rand() - 0.5) * 2 * variance
    value = Math.max(min, Math.min(max, value))
    points.push({
      timestamp: now - (49 - i) * interval,
      value: Math.round(value * 100) / 100,
    })
  }
  return points
}

const machines: { name: string; station: number; status: MachineStatus; seed: number; attrs: Omit<MachineAttribute, 'status'> }[] = [
  { name: 'CNC-Mill-01', station: 0, status: 'running', seed: 101, attrs: { temperature: 62, cycle_time: 45, throughput: 280, oee: 87, vibration: 1.8, power_consumption: 22 } },
  { name: 'CNC-Mill-02', station: 0, status: 'running', seed: 102, attrs: { temperature: 58, cycle_time: 52, throughput: 240, oee: 82, vibration: 2.1, power_consumption: 19 } },
  { name: 'CNC-Lathe-01', station: 0, status: 'fault', seed: 103, attrs: { temperature: 78, cycle_time: 95, throughput: 80, oee: 61, vibration: 4.2, power_consumption: 35 } },
  { name: 'Robot-Arm-01', station: 1, status: 'running', seed: 201, attrs: { temperature: 38, cycle_time: 18, throughput: 420, oee: 94, vibration: 0.6, power_consumption: 8 } },
  { name: 'Robot-Arm-02', station: 1, status: 'idle', seed: 202, attrs: { temperature: 25, cycle_time: 0, throughput: 0, oee: 0, vibration: 0.1, power_consumption: 1.5 } },
  { name: 'Conveyor-Belt-01', station: 1, status: 'running', seed: 203, attrs: { temperature: 32, cycle_time: 12, throughput: 500, oee: 96, vibration: 0.9, power_consumption: 5 } },
  { name: 'CMM-Scanner-01', station: 2, status: 'running', seed: 301, attrs: { temperature: 22, cycle_time: 120, throughput: 55, oee: 91, vibration: 0.2, power_consumption: 3 } },
  { name: 'Vision-System-01', station: 2, status: 'maintenance', seed: 302, attrs: { temperature: 28, cycle_time: 30, throughput: 0, oee: 0, vibration: 0.1, power_consumption: 2 } },
]

const stationNames = ['Assembly Line 1', 'CNC Bay', 'Quality Control']
const stationIds = ['assembly-line-1', 'cnc-bay', 'quality-control']

function buildShopfloor(): Shopfloor {
  const stations: Station[] = stationNames.map((name, i) => ({
    id: stationIds[i],
    name,
    topic: `shopfloor/floor-alpha/${stationIds[i]}`,
    machines: [],
  }))

  for (const m of machines) {
    const station = stations[m.station]
    const machineId = m.name.toLowerCase()
    const topic = `${station.topic}/${machineId}`
    const { seed, attrs } = m

    const ts: Record<string, TimeSeriesPoint[]> = {
      temperature: generateTimeSeries(attrs.temperature, 5, 20, 85, seed),
      cycle_time: generateTimeSeries(attrs.cycle_time, 8, 10, 120, seed + 1),
      throughput: generateTimeSeries(attrs.throughput, 30, 50, 500, seed + 2),
      oee: generateTimeSeries(attrs.oee, 5, 60, 98, seed + 3),
      vibration: generateTimeSeries(attrs.vibration, 0.5, 0.1, 5.0, seed + 4),
      power_consumption: generateTimeSeries(attrs.power_consumption, 3, 1, 50, seed + 5),
    }

    station.machines.push({
      id: machineId,
      name: m.name,
      topic,
      attributes: { ...attrs, status: m.status },
      timeSeries: ts,
    })
  }

  return {
    id: 'floor-alpha',
    name: 'Floor Alpha',
    topic: 'shopfloor/floor-alpha',
    stations,
  }
}

export const shopfloor = buildShopfloor()

export const statusColors: Record<MachineStatus, string> = {
  running: '#22c55e',
  idle: '#eab308',
  fault: '#ef4444',
  maintenance: '#3b82f6',
}

export const attributeUnits: Record<string, string> = {
  temperature: '°C',
  cycle_time: 's',
  throughput: 'units/hr',
  oee: '%',
  vibration: 'mm/s',
  power_consumption: 'kW',
}

export const attributeLabels: Record<string, string> = {
  temperature: 'Temperature',
  cycle_time: 'Cycle Time',
  throughput: 'Throughput',
  oee: 'OEE',
  vibration: 'Vibration',
  power_consumption: 'Power Consumption',
}

export const chartColors = [
  '#3b82f6', '#ef4444', '#22c55e', '#eab308', '#a855f7',
  '#06b6d4', '#f97316', '#ec4899',
]

/* ── Extended metadata for Architecture / Dataflow pages ── */

export const brokerConfig = {
  host: 'broker.floor-alpha.local',
  port: 1883,
  protocol: 'mqtt' as const,
  clientId: 'dashboard-viz-01',
}

export const subscriptionPatterns = [
  { pattern: 'shopfloor/floor-alpha/#', qos: 0, description: 'All floor-alpha messages (wildcard)' },
  { pattern: 'shopfloor/floor-alpha/+/+/temperature', qos: 1, description: 'All machine temperatures' },
  { pattern: 'shopfloor/floor-alpha/+/+/oee', qos: 1, description: 'All machine OEE values' },
  { pattern: 'shopfloor/floor-alpha/+/+/status', qos: 2, description: 'All machine status (exactly-once)' },
  { pattern: 'shopfloor/floor-alpha/assembly-line-1/#', qos: 0, description: 'Assembly Line 1 full feed' },
  { pattern: 'shopfloor/floor-alpha/cnc-bay/#', qos: 0, description: 'CNC Bay full feed' },
  { pattern: 'shopfloor/floor-alpha/quality-control/#', qos: 0, description: 'Quality Control full feed' },
]

export interface AttributeMeta {
  color: string
  updateFrequencyMs: number
  qos: number
  retain: boolean
}

export const attributeMetadata: Record<string, AttributeMeta> = {
  temperature:       { color: '#ef4444', updateFrequencyMs: 2000,  qos: 1, retain: true },
  cycle_time:        { color: '#f97316', updateFrequencyMs: 5000,  qos: 0, retain: false },
  throughput:        { color: '#3b82f6', updateFrequencyMs: 10000, qos: 0, retain: false },
  oee:               { color: '#22c55e', updateFrequencyMs: 15000, qos: 1, retain: true },
  vibration:         { color: '#a855f7', updateFrequencyMs: 1000,  qos: 0, retain: false },
  power_consumption: { color: '#eab308', updateFrequencyMs: 5000,  qos: 0, retain: true },
  status:            { color: '#06b6d4', updateFrequencyMs: 30000, qos: 2, retain: true },
}

export const topicLevels = ['Broker', 'Shopfloor', 'Station', 'Machine', 'Attribute'] as const
