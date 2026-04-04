/**
 * Stamping Plant MQTT Data Model
 * Real ISA-95 manufacturing data for the TulipDemo/StampingPlant MQTT namespace.
 * 7 machines, 4 types, 37 topics following Enterprise/Site/Area/Line/Machine/Attribute.
 *
 * MQTT Broker: interchange.proxy.rlwy.net:47378
 * Subscribe:   TulipDemo/StampingPlant/#
 * Publish:     Aar_Sto/#
 */

export type MachineStatus = 'running' | 'idle' | 'fault' | 'maintenance'

export interface MachineAttribute {
  tonnage?: number
  strokeRate?: number
  oilPressure?: number
  dieTemperature?: number
  vibration?: number
  oee?: number
  speed?: number
  motorCurrent?: number
  beltTension?: number
  deviation_x?: number
  deviation_y?: number
  deviation_z?: number
  measureTime?: number
  confidence?: number
  frameRate?: number
  illuminance?: number
  pressure?: number
  temperature?: number
  flowRate?: number
  oilLevel?: number
  efficiency?: number
  power_kw?: number
  status: MachineStatus
}

export interface TimeSeriesPoint {
  timestamp: number
  value: number
}

export interface Machine {
  id: string
  name: string
  tulipId: string
  topic: string
  type: string
  area: string
  line: string
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
  const interval = 2.4 * 60 * 1000
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

// Real stamping plant machines
const machines: {
  name: string
  tulipId: string
  type: string
  station: number
  status: MachineStatus
  seed: number
  attrs: Record<string, number>
  tsConfig: { key: string; base: number; var: number; min: number; max: number }[]
}[] = [
  {
    name: 'Press_A1', tulipId: 'p5xixyX6X2HhXicFn', type: 'Press', station: 0, status: 'running', seed: 101,
    attrs: { tonnage: 180, strokeRate: 28, oilPressure: 155, dieTemperature: 72, vibration: 4.2, oee: 80 },
    tsConfig: [
      { key: 'tonnage', base: 180, var: 10, min: 150, max: 220 },
      { key: 'strokeRate', base: 28, var: 3, min: 22, max: 45 },
      { key: 'oilPressure', base: 155, var: 8, min: 135, max: 200 },
      { key: 'dieTemperature', base: 72, var: 5, min: 55, max: 85 },
      { key: 'vibration', base: 4.2, var: 0.8, min: 2, max: 6 },
      { key: 'oee', base: 80, var: 5, min: 60, max: 95 },
    ],
  },
  {
    name: 'Press_A2', tulipId: '8RTX3cvvhBQmdqLSP', type: 'Press', station: 0, status: 'running', seed: 102,
    attrs: { tonnage: 120, strokeRate: 35, oilPressure: 148, dieTemperature: 60, vibration: 2.8, oee: 82 },
    tsConfig: [
      { key: 'tonnage', base: 120, var: 8, min: 100, max: 180 },
      { key: 'strokeRate', base: 35, var: 3, min: 28, max: 45 },
      { key: 'oilPressure', base: 148, var: 6, min: 135, max: 200 },
      { key: 'dieTemperature', base: 60, var: 4, min: 50, max: 85 },
      { key: 'vibration', base: 2.8, var: 0.6, min: 1.5, max: 5 },
      { key: 'oee', base: 82, var: 4, min: 65, max: 95 },
    ],
  },
  {
    name: 'Conveyor_A', tulipId: 'S4d6NeEgcdW48B4WZ', type: 'Conveyor', station: 0, status: 'running', seed: 103,
    attrs: { speed: 13, motorCurrent: 4.2, beltTension: 420 },
    tsConfig: [
      { key: 'speed', base: 13, var: 1.5, min: 8, max: 18 },
      { key: 'motorCurrent', base: 4.2, var: 0.5, min: 3, max: 6 },
      { key: 'beltTension', base: 420, var: 30, min: 350, max: 550 },
    ],
  },
  {
    name: 'CMM_1', tulipId: 'teWGKetiDCdduBfDE', type: 'QC_Equipment', station: 1, status: 'running', seed: 201,
    attrs: { deviation_x: 0.008, deviation_y: 0.012, deviation_z: 0.006, measureTime: 11 },
    tsConfig: [
      { key: 'deviation_x', base: 0.008, var: 0.005, min: 0, max: 0.05 },
      { key: 'deviation_y', base: 0.012, var: 0.005, min: 0, max: 0.05 },
      { key: 'deviation_z', base: 0.006, var: 0.004, min: 0, max: 0.05 },
      { key: 'measureTime', base: 11, var: 2, min: 5, max: 20 },
    ],
  },
  {
    name: 'VisionSystem_1', tulipId: 'xAaHKqSSubRq8cWE8', type: 'QC_Equipment', station: 1, status: 'running', seed: 202,
    attrs: { confidence: 97, frameRate: 30, illuminance: 2800 },
    tsConfig: [
      { key: 'confidence', base: 97, var: 3, min: 75, max: 100 },
      { key: 'frameRate', base: 30, var: 2, min: 20, max: 35 },
      { key: 'illuminance', base: 2800, var: 200, min: 1500, max: 3500 },
    ],
  },
  {
    name: 'Compressor_1', tulipId: '5msASPZypfowGwTRE', type: 'Utility', station: 2, status: 'running', seed: 301,
    attrs: { pressure: 7.5, temperature: 70, flowRate: 12, efficiency: 84, power_kw: 18 },
    tsConfig: [
      { key: 'pressure', base: 7.5, var: 0.8, min: 5, max: 10 },
      { key: 'temperature', base: 70, var: 5, min: 55, max: 85 },
      { key: 'flowRate', base: 12, var: 1.5, min: 8, max: 16 },
      { key: 'efficiency', base: 84, var: 4, min: 70, max: 95 },
      { key: 'power_kw', base: 18, var: 3, min: 10, max: 28 },
    ],
  },
  {
    name: 'HPU_1', tulipId: 'ihFYnx6EtGHPEXcPX', type: 'Utility', station: 2, status: 'running', seed: 302,
    attrs: { pressure: 180, temperature: 47, flowRate: 35, oilLevel: 82, efficiency: 87, power_kw: 45 },
    tsConfig: [
      { key: 'pressure', base: 180, var: 10, min: 140, max: 220 },
      { key: 'temperature', base: 47, var: 4, min: 35, max: 60 },
      { key: 'flowRate', base: 35, var: 5, min: 25, max: 50 },
      { key: 'oilLevel', base: 82, var: 5, min: 60, max: 95 },
      { key: 'efficiency', base: 87, var: 3, min: 70, max: 95 },
      { key: 'power_kw', base: 45, var: 5, min: 30, max: 60 },
    ],
  },
]

// ISA-95 areas
const stationNames = ['PressLine_A', 'QC_Station', 'Utilities']
const stationAreas = ['Production', 'Quality', 'Utilities']
const stationIds = ['pressline-a', 'qc-station', 'utilities']

function buildShopfloor(): Shopfloor {
  const stations: Station[] = stationNames.map((name, i) => ({
    id: stationIds[i],
    name,
    topic: `TulipDemo/StampingPlant/${stationAreas[i]}/${name}`,
    machines: [],
  }))

  for (const m of machines) {
    const station = stations[m.station]
    const topic = `TulipDemo/StampingPlant/${stationAreas[m.station]}/${stationNames[m.station]}/${m.name}`
    const { seed, tsConfig } = m

    const ts: Record<string, TimeSeriesPoint[]> = {}
    tsConfig.forEach((tc, i) => {
      ts[tc.key] = generateTimeSeries(tc.base, tc.var, tc.min, tc.max, seed + i)
    })

    station.machines.push({
      id: m.name.toLowerCase().replace(/_/g, '-'),
      name: m.name,
      tulipId: m.tulipId,
      topic,
      type: m.type,
      area: stationAreas[m.station],
      line: stationNames[m.station],
      attributes: { ...m.attrs, status: m.status } as MachineAttribute,
      timeSeries: ts,
    })
  }

  return {
    id: 'stamping-plant',
    name: 'StampingPlant',
    topic: 'TulipDemo/StampingPlant',
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
  tonnage: 'tons',
  strokeRate: 'spm',
  oilPressure: 'PSI',
  dieTemperature: '°C',
  vibration: 'mm/s',
  oee: '%',
  speed: 'm/min',
  motorCurrent: 'A',
  beltTension: 'N',
  deviation_x: 'mm',
  deviation_y: 'mm',
  deviation_z: 'mm',
  measureTime: 's',
  confidence: '%',
  frameRate: 'fps',
  illuminance: 'lux',
  pressure: 'bar/PSI',
  temperature: '°C',
  flowRate: 'L/min',
  oilLevel: '%',
  efficiency: '%',
  power_kw: 'kW',
}

export const attributeLabels: Record<string, string> = {
  tonnage: 'Tonnage',
  strokeRate: 'Stroke Rate',
  oilPressure: 'Oil Pressure',
  dieTemperature: 'Die Temperature',
  vibration: 'Vibration',
  oee: 'OEE',
  speed: 'Speed',
  motorCurrent: 'Motor Current',
  beltTension: 'Belt Tension',
  deviation_x: 'Deviation X',
  deviation_y: 'Deviation Y',
  deviation_z: 'Deviation Z',
  measureTime: 'Measure Time',
  confidence: 'Confidence',
  frameRate: 'Frame Rate',
  illuminance: 'Illuminance',
  pressure: 'Pressure',
  temperature: 'Temperature',
  flowRate: 'Flow Rate',
  oilLevel: 'Oil Level',
  efficiency: 'Efficiency',
  power_kw: 'Power',
}

export const chartColors = [
  '#3b82f6', '#ef4444', '#22c55e', '#eab308', '#a855f7',
  '#06b6d4', '#f97316', '#ec4899',
]

/* ── Extended metadata for Architecture / Dataflow pages ── */

export const brokerConfig = {
  host: 'interchange.proxy.rlwy.net',
  port: 47378,
  protocol: 'mqtt' as const,
  clientId: 'tulip-bridge-01',
}

export const subscriptionPatterns = [
  { pattern: 'TulipDemo/StampingPlant/#', qos: 0, description: 'All stamping plant messages (wildcard)' },
  { pattern: 'TulipDemo/StampingPlant/Production/PressLine_A/+/Vibration', qos: 1, description: 'All press vibration readings' },
  { pattern: 'TulipDemo/StampingPlant/Production/PressLine_A/+/OEE', qos: 1, description: 'All press OEE (JSON)' },
  { pattern: 'TulipDemo/StampingPlant/Production/Events/MachineStatus', qos: 2, description: 'Machine status events (exactly-once)' },
  { pattern: 'TulipDemo/StampingPlant/Quality/Events/PartInspection', qos: 2, description: 'Part inspection results (exactly-once)' },
  { pattern: 'TulipDemo/StampingPlant/Quality/QC_Station/+/DefectRate', qos: 1, description: 'Defect rates per press' },
  { pattern: 'TulipDemo/StampingPlant/Utilities/#', qos: 0, description: 'All utility systems' },
]

export const publishPatterns = [
  { pattern: 'Aar_Sto/Status/BridgeOnline', description: 'Bridge startup heartbeat' },
  { pattern: 'Aar_Sto/Production/MachineStatus/{machine}', description: 'Republished machine status' },
  { pattern: 'Aar_Sto/Alerts/{machine}/{attribute}', description: 'Threshold breach alerts' },
  { pattern: 'Aar_Sto/Quality/PartInspection/{press}', description: 'Inspection results' },
]

export interface AttributeMeta {
  color: string
  updateFrequencyMs: number
  qos: number
  retain: boolean
}

export const attributeMetadata: Record<string, AttributeMeta> = {
  tonnage:         { color: '#3b82f6', updateFrequencyMs: 2000,  qos: 0, retain: false },
  strokeRate:      { color: '#f97316', updateFrequencyMs: 2000,  qos: 0, retain: false },
  oilPressure:     { color: '#22c55e', updateFrequencyMs: 2000,  qos: 0, retain: false },
  dieTemperature:  { color: '#ef4444', updateFrequencyMs: 2000,  qos: 1, retain: true },
  vibration:       { color: '#a855f7', updateFrequencyMs: 1000,  qos: 0, retain: false },
  oee:             { color: '#22c55e', updateFrequencyMs: 15000, qos: 1, retain: true },
  speed:           { color: '#06b6d4', updateFrequencyMs: 2000,  qos: 0, retain: false },
  motorCurrent:    { color: '#eab308', updateFrequencyMs: 2000,  qos: 0, retain: false },
  beltTension:     { color: '#ec4899', updateFrequencyMs: 2000,  qos: 0, retain: false },
  deviation_x:     { color: '#ef4444', updateFrequencyMs: 2000,  qos: 0, retain: false },
  deviation_y:     { color: '#f97316', updateFrequencyMs: 2000,  qos: 0, retain: false },
  deviation_z:     { color: '#3b82f6', updateFrequencyMs: 2000,  qos: 0, retain: false },
  measureTime:     { color: '#eab308', updateFrequencyMs: 3000,  qos: 0, retain: false },
  confidence:      { color: '#22c55e', updateFrequencyMs: 2000,  qos: 0, retain: false },
  frameRate:       { color: '#06b6d4', updateFrequencyMs: 2000,  qos: 0, retain: false },
  illuminance:     { color: '#a855f7', updateFrequencyMs: 3000,  qos: 0, retain: false },
  pressure:        { color: '#3b82f6', updateFrequencyMs: 2000,  qos: 0, retain: false },
  temperature:     { color: '#ef4444', updateFrequencyMs: 2000,  qos: 1, retain: true },
  flowRate:        { color: '#22c55e', updateFrequencyMs: 2000,  qos: 0, retain: false },
  oilLevel:        { color: '#eab308', updateFrequencyMs: 3000,  qos: 1, retain: true },
  efficiency:      { color: '#06b6d4', updateFrequencyMs: 15000, qos: 1, retain: true },
  power_kw:        { color: '#f97316', updateFrequencyMs: 15000, qos: 0, retain: false },
}

export const topicLevels = ['Enterprise', 'Site', 'Area', 'Line', 'Machine', 'Attribute'] as const
