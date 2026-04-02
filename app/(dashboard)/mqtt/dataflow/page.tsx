'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import {
  shopfloor,
  statusColors,
  attributeMetadata,
  brokerConfig,
  subscriptionPatterns,
  attributeLabels,
  attributeUnits,
  type Machine,
  type MachineStatus,
} from '../demo-data'

/* ── Node & Edge types ── */

interface FlowNode {
  id: string
  label: string
  sublabel?: string
  x: number
  y: number
  w: number
  h: number
  type: 'machine' | 'attribute' | 'broker' | 'subscription' | 'consumer'
  color: string
  machineId?: string
  status?: MachineStatus
  machine?: Machine
}

interface FlowEdge {
  id: string
  from: string
  to: string
  color: string
  speed: number // animation duration in seconds (lower = faster)
  machineId: string
}

/* ── Build the flow graph ── */

function buildFlow(): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const nodes: FlowNode[] = []
  const edges: FlowEdge[] = []
  const allMachines = shopfloor.stations.flatMap((s) => s.machines)

  const colX = [60, 260, 480, 680, 880]
  const viewW = 1000
  const viewH = 600

  // Column 1: Machines (left)
  const machineSpacing = Math.min(65, (viewH - 40) / allMachines.length)
  const machineStartY = (viewH - (allMachines.length - 1) * machineSpacing) / 2
  allMachines.forEach((m, i) => {
    nodes.push({
      id: `m-${m.id}`,
      label: m.name,
      sublabel: m.attributes.status,
      x: colX[0],
      y: machineStartY + i * machineSpacing,
      w: 36,
      h: 20,
      type: 'machine',
      color: statusColors[m.attributes.status],
      machineId: m.id,
      status: m.attributes.status,
      machine: m,
    })
  })

  // Column 2: Attributes (per machine, collapsed)
  const attrKeys = ['temperature', 'oee', 'throughput'] as const
  allMachines.forEach((m, mi) => {
    attrKeys.forEach((attr, ai) => {
      const meta = attributeMetadata[attr]
      const nodeId = `a-${m.id}-${attr}`
      const my = machineStartY + mi * machineSpacing
      const ay = my + (ai - 1) * 18
      nodes.push({
        id: nodeId,
        label: attr.slice(0, 4),
        x: colX[1],
        y: ay,
        w: 24,
        h: 14,
        type: 'attribute',
        color: meta.color,
        machineId: m.id,
      })
      edges.push({
        id: `e-${m.id}-${attr}`,
        from: `m-${m.id}`,
        to: nodeId,
        color: meta.color,
        speed: Math.max(1, meta.updateFrequencyMs / 3000),
        machineId: m.id,
      })
    })
  })

  // Column 3: Broker (center)
  nodes.push({
    id: 'broker',
    label: 'MQTT Broker',
    sublabel: brokerConfig.host,
    x: colX[2],
    y: viewH / 2,
    w: 50,
    h: 30,
    type: 'broker',
    color: '#a855f7',
  })

  // Edges from all attributes to broker
  allMachines.forEach((m) => {
    attrKeys.forEach((attr) => {
      const meta = attributeMetadata[attr]
      edges.push({
        id: `e-${m.id}-${attr}-broker`,
        from: `a-${m.id}-${attr}`,
        to: 'broker',
        color: meta.color,
        speed: Math.max(1.5, meta.updateFrequencyMs / 2000),
        machineId: m.id,
      })
    })
  })

  // Column 4: Subscriptions
  const subsToShow = subscriptionPatterns.slice(0, 5)
  const subSpacing = Math.min(60, (viewH - 80) / subsToShow.length)
  const subStartY = (viewH - (subsToShow.length - 1) * subSpacing) / 2
  subsToShow.forEach((sub, i) => {
    const nodeId = `sub-${i}`
    nodes.push({
      id: nodeId,
      label: sub.pattern.split('/').pop() || sub.pattern,
      sublabel: `QoS ${sub.qos}`,
      x: colX[3],
      y: subStartY + i * subSpacing,
      w: 40,
      h: 18,
      type: 'subscription',
      color: '#06b6d4',
    })
    edges.push({
      id: `e-broker-${nodeId}`,
      from: 'broker',
      to: nodeId,
      color: '#06b6d4',
      speed: 2,
      machineId: '__all__',
    })
  })

  // Column 5: Consumer/Dashboard
  nodes.push({
    id: 'dashboard',
    label: 'Dashboard',
    sublabel: 'Real-time UI',
    x: colX[4],
    y: viewH / 2,
    w: 44,
    h: 26,
    type: 'consumer',
    color: '#f97316',
  })

  // Edges from subscriptions to dashboard
  subsToShow.forEach((_, i) => {
    edges.push({
      id: `e-sub-${i}-dashboard`,
      from: `sub-${i}`,
      to: 'dashboard',
      color: '#f97316',
      speed: 2.5,
      machineId: '__all__',
    })
  })

  return { nodes, edges }
}

/* ── Animated edge with flowing dot ── */

function AnimatedEdge({
  x1, y1, x2, y2, color, speed, dimmed, edgeId,
}: {
  x1: number; y1: number; x2: number; y2: number
  color: string; speed: number; dimmed: boolean; edgeId: string
}) {
  return (
    <g opacity={dimmed ? 0.08 : 1}>
      {/* Base line */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={dimmed ? 0.5 : 1}
        opacity={0.3}
        strokeDasharray="3 3"
      />
      {/* Glow line */}
      {!dimmed && (
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color}
          strokeWidth={0.5}
          opacity={0.15}
          style={{ filter: `blur(2px)` }}
        />
      )}
      {/* Animated dot */}
      {!dimmed && (
        <circle r="2.5" fill={color} style={{ filter: `drop-shadow(0 0 3px ${color})` }}>
          <animateMotion
            dur={`${speed}s`}
            repeatCount="indefinite"
            path={`M${x1},${y1} L${x2},${y2}`}
          />
        </circle>
      )}
    </g>
  )
}

/* ── Flow node rendering ── */

function FlowNodeEl({
  node, dimmed, isSelected, onClick,
}: {
  node: FlowNode; dimmed: boolean; isSelected: boolean; onClick: () => void
}) {
  const { x, y, w, h, label, sublabel, color, type } = node
  const rx = type === 'broker' ? 8 : type === 'consumer' ? 8 : 4

  return (
    <g
      style={{ cursor: 'pointer', opacity: dimmed ? 0.15 : 1, transition: 'opacity 0.3s' }}
      onClick={onClick}
    >
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={rx}
        fill={`${color}10`}
        stroke={color}
        strokeWidth={isSelected ? 2 : 1}
        style={{
          filter: isSelected ? `drop-shadow(0 0 8px ${color})` : `drop-shadow(0 0 3px ${color}33)`,
        }}
      />
      {/* Status dot for machines */}
      {type === 'machine' && node.status && (
        <circle
          cx={x + w / 2 - 4}
          cy={y - h / 2 + 4}
          r={3}
          fill={color}
          style={{ filter: `drop-shadow(0 0 3px ${color})` }}
        />
      )}
      <text
        x={x}
        y={sublabel ? y - 1 : y + 3}
        textAnchor="middle"
        fill="white"
        fontSize={type === 'attribute' ? 7 : 8}
        fontFamily="monospace"
        fontWeight="bold"
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={x}
          y={y + 8}
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize={6}
          fontFamily="monospace"
        >
          {sublabel}
        </text>
      )}
    </g>
  )
}

/* ── Detail panel ── */

function DetailPanel({ machine }: { machine: Machine | null }) {
  if (!machine) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-xs text-slate-600 text-center">Click a machine node<br />to trace its data flow</p>
      </div>
    )
  }

  const attrKeys = ['temperature', 'cycle_time', 'throughput', 'oee', 'vibration', 'power_consumption'] as const

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-bold text-white">{machine.name}</h3>
        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{machine.topic}</p>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium mt-2"
          style={{
            background: `${statusColors[machine.attributes.status]}15`,
            color: statusColors[machine.attributes.status],
            border: `1px solid ${statusColors[machine.attributes.status]}33`,
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusColors[machine.attributes.status] }} />
          {machine.attributes.status}
        </span>
      </div>

      <div className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Published Attributes</div>
      <div className="space-y-1.5">
        {attrKeys.map((key) => {
          const meta = attributeMetadata[key]
          return (
            <div key={key} className="rounded-lg border border-white/5 bg-black/30 px-3 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: meta.color, boxShadow: `0 0 4px ${meta.color}` }} />
                  <span className="text-[10px] text-slate-400">{attributeLabels[key]}</span>
                </div>
                <span className="text-xs font-mono font-semibold text-white">
                  {machine.attributes[key]}
                  <span className="text-slate-500 ml-0.5 text-[9px]">{attributeUnits[key]}</span>
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-[9px] text-slate-600 font-mono">
                <span>Topic: {machine.topic}/{key}</span>
              </div>
              <div className="flex items-center gap-3 mt-0.5 text-[9px] text-slate-600 font-mono">
                <span>QoS: {meta.qos}</span>
                <span>Retain: {meta.retain ? 'yes' : 'no'}</span>
                <span>Freq: {meta.updateFrequencyMs}ms</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Legend ── */

function Legend() {
  const items = [
    { color: '#ef4444', label: 'Temperature' },
    { color: '#22c55e', label: 'OEE' },
    { color: '#3b82f6', label: 'Throughput' },
    { color: '#a855f7', label: 'Broker' },
    { color: '#06b6d4', label: 'Subscription' },
    { color: '#f97316', label: 'Consumer' },
  ]
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: item.color, boxShadow: `0 0 4px ${item.color}` }} />
          <span className="text-[10px] text-slate-500">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Main dataflow content ── */

function DataflowContent() {
  const searchParams = useSearchParams()
  const isEmbed = searchParams.get('embed') === '1'

  const { nodes: initialNodes, edges } = buildFlow()
  const [nodes, setNodes] = useState(initialNodes)
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOff, setDragOff] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  const selectedMachine = selectedMachineId
    ? shopfloor.stations.flatMap((s) => s.machines).find((m) => m.id === selectedMachineId) || null
    : null

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.preventDefault()
      e.stopPropagation()
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return
      const svgX = ((e.clientX - rect.left) / rect.width) * 1000
      const svgY = ((e.clientY - rect.top) / rect.height) * 600
      setDragOff({ x: svgX - node.x, y: svgY - node.y })
      setDragging(nodeId)
    },
    [nodes]
  )

  useEffect(() => {
    if (!dragging) return
    const svg = svgRef.current
    if (!svg) return

    const handleMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect()
      const svgX = ((e.clientX - rect.left) / rect.width) * 1000
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

  const isEdgeHighlighted = (edge: FlowEdge) => {
    if (!selectedMachineId) return true
    return edge.machineId === selectedMachineId || edge.machineId === '__all__'
  }

  const isNodeHighlighted = (node: FlowNode) => {
    if (!selectedMachineId) return true
    if (node.machineId === selectedMachineId) return true
    if (node.type === 'broker' || node.type === 'subscription' || node.type === 'consumer') return true
    return false
  }

  return (
    <div className={isEmbed ? 'flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a1a]' : 'flex h-screen flex-col overflow-hidden'}>
      {!isEmbed && <PageHeader path="/mqtt/dataflow" />}

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Graph area */}
        <div className="flex-1 overflow-hidden flex flex-col p-4">
          {/* Legend */}
          <div className="mb-2 flex items-center justify-between">
            <Legend />
            {selectedMachineId && (
              <button
                onClick={() => setSelectedMachineId(null)}
                className="text-[10px] text-slate-500 hover:text-white transition-colors px-2 py-1 rounded border border-white/10"
              >
                Clear selection
              </button>
            )}
          </div>

          {/* Column headers */}
          <div className="flex justify-between px-2 mb-1">
            {['Machines', 'Attributes', 'Broker', 'Subscriptions', 'Dashboard'].map((label, i) => (
              <span key={label} className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">{label}</span>
            ))}
          </div>

          <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <svg
              ref={svgRef}
              viewBox="0 0 1000 600"
              className="w-full h-full"
              style={{ cursor: dragging ? 'grabbing' : 'default' }}
            >
              <defs>
                <filter id="edgeGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
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
                const highlighted = isEdgeHighlighted(edge)
                return (
                  <AnimatedEdge
                    key={edge.id}
                    x1={from.x + from.w / 2}
                    y1={from.y}
                    x2={to.x - to.w / 2}
                    y2={to.y}
                    color={edge.color}
                    speed={edge.speed}
                    dimmed={!highlighted}
                    edgeId={edge.id}
                  />
                )
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const highlighted = isNodeHighlighted(node)
                const isSelected = node.machineId === selectedMachineId && node.type === 'machine'
                return (
                  <g
                    key={node.id}
                    onMouseDown={(e) => handleMouseDown(e, node.id)}
                    style={{ cursor: 'grab' }}
                  >
                    <FlowNodeEl
                      node={node}
                      dimmed={!highlighted}
                      isSelected={isSelected}
                      onClick={() => {
                        if (node.machine) {
                          setSelectedMachineId(node.machineId === selectedMachineId ? null : node.machineId!)
                        }
                      }}
                    />
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Detail panel */}
        <div className="w-full md:w-72 flex-shrink-0 border-t md:border-t-0 md:border-l border-white/10 overflow-auto p-4">
          <DetailPanel machine={selectedMachine} />
        </div>
      </div>
    </div>
  )
}

export default function DataflowPage() {
  return (
    <Suspense fallback={null}>
      <DataflowContent />
    </Suspense>
  )
}
