"use client"

import { useState, useRef, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { TreesIcon, BarChart3, Network, ChevronRight, ChevronDown } from "lucide-react"
import {
  shopfloor,
  statusColors,
  attributeUnits,
  attributeLabels,
  chartColors,
  type Machine,
  type Station,
  type MachineStatus,
} from "./demo-data"

type TabId = "tree" | "charts" | "graph"

/* ═══════════════════════════════════════════
   TAB 1: TREE VIEW
   ═══════════════════════════════════════════ */

function StatusBadge({ status }: { status: MachineStatus }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium"
      style={{
        background: `${statusColors[status]}15`,
        color: statusColors[status],
        border: `1px solid ${statusColors[status]}33`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: statusColors[status],
          boxShadow: `0 0 4px ${statusColors[status]}`,
        }}
      />
      {status}
    </span>
  )
}

function MachineNode({ machine }: { machine: Machine }) {
  const [open, setOpen] = useState(false)
  const attrKeys = ['temperature', 'cycle_time', 'throughput', 'oee', 'vibration', 'power_consumption'] as const

  return (
    <div
      className="rounded-lg border bg-white/[0.02] transition-all hover:bg-white/[0.04]"
      style={{ borderColor: `${statusColors[machine.attributes.status]}33` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
        <span
          className="h-2 w-2 rounded-full flex-shrink-0"
          style={{ background: statusColors[machine.attributes.status], boxShadow: `0 0 6px ${statusColors[machine.attributes.status]}` }}
        />
        <span className="text-xs font-mono font-semibold text-white">{machine.name}</span>
        <StatusBadge status={machine.attributes.status} />
        <span className="ml-auto text-[10px] text-slate-600 font-mono truncate hidden sm:block">{machine.topic}</span>
      </button>
      {open && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-3 pb-3">
          {attrKeys.map((key) => (
            <div
              key={key}
              className="rounded-md border border-white/5 bg-black/30 px-2.5 py-1.5"
            >
              <div className="text-[10px] text-slate-500">{attributeLabels[key]}</div>
              <div className="text-xs font-mono font-semibold text-white">
                {machine.attributes[key]}
                <span className="text-slate-500 ml-0.5">{attributeUnits[key]}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StationNode({ station }: { station: Station }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        {open ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
        <span className="text-sm font-semibold text-white">{station.name}</span>
        <span className="text-[10px] text-slate-600 font-mono">{station.machines.length} machines</span>
        <span className="ml-auto text-[10px] text-slate-600 font-mono hidden sm:block">{station.topic}</span>
      </button>
      {open && (
        <div className="space-y-2 px-3 pb-3">
          {station.machines.map((m) => (
            <MachineNode key={m.id} machine={m} />
          ))}
        </div>
      )}
    </div>
  )
}

function TreeView() {
  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Shopfloor root */}
        <div className="rounded-2xl border-2 border-white/10 bg-white/[0.02] p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="rounded-xl bg-white/5 p-3 border border-white/10"
              style={{ boxShadow: '0 0 15px rgba(255,255,255,0.05)' }}
            >
              <Network className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white" style={{ textShadow: '0 0 10px rgba(255,255,255,0.15)' }}>
                {shopfloor.name}
              </h2>
              <p className="text-xs text-slate-500 font-mono">{shopfloor.topic}</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              {(['running', 'idle', 'fault', 'maintenance'] as const).map((s) => {
                const count = shopfloor.stations.flatMap((st) => st.machines).filter((m) => m.attributes.status === s).length
                if (count === 0) return null
                return (
                  <div key={s} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: statusColors[s] }} />
                    <span className="text-[10px] text-slate-500">{count} {s}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="space-y-3">
            {shopfloor.stations.map((station) => (
              <StationNode key={station.id} station={station} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   TAB 2: CHARTS VIEW
   ═══════════════════════════════════════════ */

const allMachines = shopfloor.stations.flatMap((s) => s.machines)
const CHART_ATTRS = ['temperature', 'cycle_time', 'throughput', 'oee', 'vibration', 'power_consumption'] as const

function MiniChart({ attr, machines: selectedMachines }: { attr: string; machines: Machine[] }) {
  const width = 480
  const height = 180
  const padL = 55
  const padR = 10
  const padT = 10
  const padB = 30
  const plotW = width - padL - padR
  const plotH = height - padT - padB

  // Compute global Y range across selected machines
  let yMin = Infinity
  let yMax = -Infinity
  for (const m of selectedMachines) {
    const ts = m.timeSeries[attr]
    if (!ts) continue
    for (const p of ts) {
      if (p.value < yMin) yMin = p.value
      if (p.value > yMax) yMax = p.value
    }
  }
  if (yMin === Infinity) { yMin = 0; yMax = 100 }
  const yPad = (yMax - yMin) * 0.1 || 5
  yMin -= yPad
  yMax += yPad

  const xMin = selectedMachines[0]?.timeSeries[attr]?.[0]?.timestamp ?? 0
  const xMax = selectedMachines[0]?.timeSeries[attr]?.[49]?.timestamp ?? 1

  const scaleX = (t: number) => padL + ((t - xMin) / (xMax - xMin)) * plotW
  const scaleY = (v: number) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH

  // Y grid
  const yTicks: number[] = []
  const yStep = (yMax - yMin) / 4
  for (let i = 0; i <= 4; i++) yTicks.push(yMin + i * yStep)

  // X ticks (5 evenly spaced)
  const xTicks: number[] = []
  for (let i = 0; i <= 4; i++) xTicks.push(xMin + ((xMax - xMin) * i) / 4)

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-white">
          {attributeLabels[attr]}
          <span className="text-slate-500 ml-1 font-normal">({attributeUnits[attr]})</span>
        </h3>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 180 }}>
        {/* Grid */}
        {yTicks.map((v, i) => (
          <g key={i}>
            <line x1={padL} x2={width - padR} y1={scaleY(v)} y2={scaleY(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={padL - 6} y={scaleY(v) + 3} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">
              {v.toFixed(v < 10 ? 1 : 0)}
            </text>
          </g>
        ))}
        {/* X labels */}
        {xTicks.map((t, i) => {
          const d = new Date(t)
          const label = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
          return (
            <text key={i} x={scaleX(t)} y={height - 5} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="monospace">
              {label}
            </text>
          )
        })}
        {/* Lines */}
        {selectedMachines.map((m, mi) => {
          const ts = m.timeSeries[attr]
          if (!ts || ts.length === 0) return null
          const d = ts.map((p) => `${scaleX(p.timestamp)},${scaleY(p.value)}`).join(' ')
          const color = chartColors[mi % chartColors.length]
          return (
            <g key={m.id}>
              <polyline
                points={d}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 3px ${color}66)` }}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function ChartsView() {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    allMachines.filter((m) => m.attributes.status === 'running').map((m) => m.id)
  )

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const selected = allMachines.filter((m) => selectedIds.includes(m.id))

  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Machine selector */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">Select Machines</div>
          <div className="flex flex-wrap gap-2">
            {allMachines.map((m, i) => {
              const isOn = selectedIds.includes(m.id)
              const color = chartColors[allMachines.indexOf(m) % chartColors.length]
              return (
                <button
                  key={m.id}
                  onClick={() => toggle(m.id)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-mono transition-all"
                  style={{
                    background: isOn ? `${color}15` : 'transparent',
                    border: `1px solid ${isOn ? color + '55' : 'rgba(255,255,255,0.08)'}`,
                    color: isOn ? color : 'rgba(255,255,255,0.35)',
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: isOn ? color : 'rgba(255,255,255,0.15)' }}
                  />
                  {m.name}
                </button>
              )
            })}
          </div>
          {/* Legend */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2 pt-2 border-t border-white/5">
              {selected.map((m) => {
                const color = chartColors[allMachines.indexOf(m) % chartColors.length]
                return (
                  <div key={m.id} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-6 rounded-full" style={{ background: color }} />
                    <span className="text-[10px] text-slate-400 font-mono">{m.name}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Charts grid */}
        {selected.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-12 text-center">
            <p className="text-sm text-slate-500">Select at least one machine to view charts</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {CHART_ATTRS.map((attr) => (
              <MiniChart key={attr} attr={attr} machines={selected} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   TAB 3: GRAPH VIEW
   ═══════════════════════════════════════════ */

interface GraphNode {
  id: string
  label: string
  sublabel?: string
  x: number
  y: number
  r: number
  type: 'shopfloor' | 'station' | 'machine'
  status?: MachineStatus
  machine?: Machine
}

interface GraphEdge {
  from: string
  to: string
  topic: string
}

function buildGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  const cx = 450
  const cy = 300

  // Shopfloor center
  nodes.push({ id: 'floor', label: shopfloor.name, x: cx, y: cy, r: 30, type: 'shopfloor' })

  const stationCount = shopfloor.stations.length
  const stationRadius = 160

  shopfloor.stations.forEach((station, si) => {
    const angle = (si / stationCount) * Math.PI * 2 - Math.PI / 2
    const sx = cx + Math.cos(angle) * stationRadius
    const sy = cy + Math.sin(angle) * stationRadius

    nodes.push({ id: station.id, label: station.name, x: sx, y: sy, r: 24, type: 'station' })
    edges.push({ from: 'floor', to: station.id, topic: station.topic })

    const mCount = station.machines.length
    const machineRadius = 90

    station.machines.forEach((machine, mi) => {
      const mAngle = angle + ((mi - (mCount - 1) / 2) * 0.5)
      const mx = sx + Math.cos(mAngle) * machineRadius
      const my = sy + Math.sin(mAngle) * machineRadius

      nodes.push({
        id: machine.id,
        label: machine.name,
        sublabel: machine.attributes.status,
        x: mx,
        y: my,
        r: 18,
        type: 'machine',
        status: machine.attributes.status,
        machine,
      })
      edges.push({ from: station.id, to: machine.id, topic: machine.topic })
    })
  })

  return { nodes, edges }
}

function GraphView() {
  const { nodes: initialNodes, edges } = buildGraph()
  const [nodes, setNodes] = useState(initialNodes)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOff, setDragOff] = useState({ x: 0, y: 0 })
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault()
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return
    const svgX = ((e.clientX - rect.left) / rect.width) * 900
    const svgY = ((e.clientY - rect.top) / rect.height) * 600
    setDragOff({ x: svgX - node.x, y: svgY - node.y })
    setDragging(nodeId)
  }, [nodes])

  useEffect(() => {
    if (!dragging) return
    const svg = svgRef.current
    if (!svg) return

    const handleMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect()
      const svgX = ((e.clientX - rect.left) / rect.width) * 900
      const svgY = ((e.clientY - rect.top) / rect.height) * 600
      setNodes((prev) =>
        prev.map((n) =>
          n.id === dragging ? { ...n, x: svgX - dragOff.x, y: svgY - dragOff.y } : n
        )
      )
    }
    const handleUp = () => setDragging(null)
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [dragging, dragOff])

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]))

  const nodeColors: Record<string, string> = {
    shopfloor: '#a855f7',
    station: '#3b82f6',
    machine: '#22c55e',
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
      {/* Graph */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <svg
            ref={svgRef}
            viewBox="0 0 900 600"
            className="w-full h-full"
            style={{ cursor: dragging ? 'grabbing' : 'default' }}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Edges */}
            {edges.map((edge) => {
              const from = nodeMap[edge.from]
              const to = nodeMap[edge.to]
              if (!from || !to) return null
              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              )
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const baseColor = node.type === 'machine' && node.status
                ? statusColors[node.status]
                : nodeColors[node.type]
              const isSelected = selectedMachine?.id === node.id
              return (
                <g
                  key={node.id}
                  style={{ cursor: 'grab' }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                  onClick={() => {
                    if (node.machine) setSelectedMachine(node.machine)
                  }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    fill={`${baseColor}15`}
                    stroke={baseColor}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    style={{ filter: isSelected ? `drop-shadow(0 0 8px ${baseColor})` : undefined }}
                  />
                  {/* Status glow for machines */}
                  {node.type === 'machine' && node.status && (
                    <circle
                      cx={node.x + node.r * 0.6}
                      cy={node.y - node.r * 0.6}
                      r={4}
                      fill={statusColors[node.status]}
                      style={{ filter: `drop-shadow(0 0 4px ${statusColors[node.status]})` }}
                    />
                  )}
                  <text
                    x={node.x}
                    y={node.y + node.r + 14}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.6)"
                    fontSize={node.type === 'shopfloor' ? 12 : 10}
                    fontFamily="monospace"
                  >
                    {node.label}
                  </text>
                  {/* Type label inside */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill={baseColor}
                    fontSize={node.type === 'shopfloor' ? 9 : 7}
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {node.type === 'shopfloor' ? 'FLOOR' : node.type === 'station' ? 'STN' : node.status?.slice(0, 3).toUpperCase()}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Detail panel */}
      <div className="w-full md:w-72 flex-shrink-0 border-t md:border-t-0 md:border-l border-white/10 overflow-auto p-4">
        {selectedMachine ? (
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-white">{selectedMachine.name}</h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{selectedMachine.topic}</p>
              <div className="mt-2"><StatusBadge status={selectedMachine.attributes.status} /></div>
            </div>
            <div className="space-y-2">
              {Object.entries(attributeLabels).map(([key, label]) => (
                <div key={key} className="rounded-lg border border-white/5 bg-black/30 px-3 py-2">
                  <div className="text-[10px] text-slate-500">{label}</div>
                  <div className="text-sm font-mono font-semibold text-white">
                    {(selectedMachine.attributes as Record<string, number | string>)[key]}
                    <span className="text-slate-500 ml-1 text-xs">{attributeUnits[key]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-slate-600 text-center">Click a machine node<br />to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

const tabs: { id: TabId; label: string; icon: typeof TreesIcon }[] = [
  { id: 'tree', label: 'Tree View', icon: TreesIcon },
  { id: 'charts', label: 'Charts', icon: BarChart3 },
  { id: 'graph', label: 'Graph', icon: Network },
]

function MqttPageContent() {
  const searchParams = useSearchParams()
  const isEmbed = searchParams.get('embed') === '1'
  const [activeTab, setActiveTab] = useState<TabId>("tree")

  const tabBar = (
    <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            activeTab === tab.id
              ? "bg-white/10 text-white"
              : "text-slate-500 hover:text-slate-300"
          }`}
          style={activeTab === tab.id ? { boxShadow: '0 0 10px rgba(255,255,255,0.08)', textShadow: '0 0 8px rgba(255,255,255,0.3)' } : {}}
        >
          <tab.icon className="h-3.5 w-3.5" />
          {tab.label}
        </button>
      ))}
    </div>
  )

  return (
    <div className={isEmbed ? "flex h-screen w-screen flex-col overflow-hidden" : "flex h-screen flex-col overflow-hidden"}>
      {!isEmbed && <PageHeader path="/mqtt">{tabBar}</PageHeader>}
      {isEmbed && (
        <div className="flex items-center justify-center border-b border-white/10 bg-black/50 px-4 py-2 flex-shrink-0">
          {tabBar}
        </div>
      )}

      {activeTab === 'tree' && <TreeView />}
      {activeTab === 'charts' && <ChartsView />}
      {activeTab === 'graph' && <GraphView />}
    </div>
  )
}

export default function MqttPage() {
  return (
    <Suspense fallback={null}>
      <MqttPageContent />
    </Suspense>
  )
}
