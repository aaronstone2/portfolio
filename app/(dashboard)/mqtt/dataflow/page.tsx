'use client'

import { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react'
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
  type AttributeMeta,
} from '../demo-data'

/* ── Types ── */

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
  attrKey?: string
  topicPath?: string
  subscriptionPattern?: (typeof subscriptionPatterns)[number]
}

interface FlowEdge {
  id: string
  from: string
  to: string
  color: string
  speed: number
  machineId: string
  attrKey?: string
}

/* ── Build flow graph — LARGER nodes, more spacing ── */

function buildFlow(): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const nodes: FlowNode[] = []
  const edges: FlowEdge[] = []
  const allMachines = shopfloor.stations.flatMap((s) => s.machines)

  // Much wider viewBox — we'll use 1600x900
  const colX = [120, 420, 780, 1100, 1420]

  // Column 1: Machines
  const machineSpacing = 100
  const machineStartY = (900 - (allMachines.length - 1) * machineSpacing) / 2
  allMachines.forEach((m, i) => {
    const station = shopfloor.stations.find((s) => s.machines.some((sm) => sm.id === m.id))
    nodes.push({
      id: `m-${m.id}`,
      label: m.name,
      sublabel: station?.name ?? '',
      x: colX[0],
      y: machineStartY + i * machineSpacing,
      w: 160,
      h: 56,
      type: 'machine',
      color: statusColors[m.attributes.status],
      machineId: m.id,
      status: m.attributes.status,
      machine: m,
      topicPath: m.topic,
    })
  })

  // Column 2: Attributes (per machine)
  const attrKeys = ['temperature', 'oee', 'throughput'] as const
  allMachines.forEach((m, mi) => {
    attrKeys.forEach((attr, ai) => {
      const meta = attributeMetadata[attr]
      const my = machineStartY + mi * machineSpacing
      const ay = my + (ai - 1) * 34
      const nodeId = `a-${m.id}-${attr}`
      nodes.push({
        id: nodeId,
        label: attributeLabels[attr],
        sublabel: `${m.attributes[attr]}${attributeUnits[attr]}`,
        x: colX[1],
        y: ay,
        w: 120,
        h: 40,
        type: 'attribute',
        color: meta.color,
        machineId: m.id,
        attrKey: attr,
        topicPath: `${m.topic}/${attr}`,
      })
      edges.push({
        id: `e-${m.id}-${attr}`,
        from: `m-${m.id}`,
        to: nodeId,
        color: meta.color,
        speed: Math.max(1.5, meta.updateFrequencyMs / 3000),
        machineId: m.id,
        attrKey: attr,
      })
    })
  })

  // Column 3: Broker
  nodes.push({
    id: 'broker',
    label: 'MQTT Broker',
    sublabel: `${brokerConfig.host}:${brokerConfig.port}`,
    x: colX[2],
    y: 450,
    w: 160,
    h: 64,
    type: 'broker',
    color: '#a855f7',
    topicPath: `${brokerConfig.protocol}://${brokerConfig.host}:${brokerConfig.port}`,
  })

  // Edges from attributes to broker
  allMachines.forEach((m) => {
    attrKeys.forEach((attr) => {
      const meta = attributeMetadata[attr]
      edges.push({
        id: `e-${m.id}-${attr}-broker`,
        from: `a-${m.id}-${attr}`,
        to: 'broker',
        color: meta.color,
        speed: Math.max(2, meta.updateFrequencyMs / 2000),
        machineId: m.id,
        attrKey: attr,
      })
    })
  })

  // Column 4: Subscriptions
  const subsToShow = subscriptionPatterns.slice(0, 5)
  const subSpacing = 90
  const subStartY = (900 - (subsToShow.length - 1) * subSpacing) / 2
  subsToShow.forEach((sub, i) => {
    const nodeId = `sub-${i}`
    nodes.push({
      id: nodeId,
      label: sub.pattern.split('/').slice(-2).join('/'),
      sublabel: `QoS ${sub.qos}`,
      x: colX[3],
      y: subStartY + i * subSpacing,
      w: 150,
      h: 44,
      type: 'subscription',
      color: '#06b6d4',
      topicPath: sub.pattern,
      subscriptionPattern: sub,
    })
    edges.push({
      id: `e-broker-${nodeId}`,
      from: 'broker',
      to: nodeId,
      color: '#06b6d4',
      speed: 2.5,
      machineId: '__all__',
    })
  })

  // Column 5: Consumer
  nodes.push({
    id: 'dashboard',
    label: 'Dashboard',
    sublabel: 'Real-time Monitoring UI',
    x: colX[4],
    y: 450,
    w: 150,
    h: 56,
    type: 'consumer',
    color: '#f97316',
  })

  subsToShow.forEach((_, i) => {
    edges.push({
      id: `e-sub-${i}-dashboard`,
      from: `sub-${i}`,
      to: 'dashboard',
      color: '#f97316',
      speed: 3,
      machineId: '__all__',
    })
  })

  return { nodes, edges }
}

/* ── Animated edge ── */

function AnimatedEdge({
  x1, y1, x2, y2, color, speed, dimmed,
}: {
  x1: number; y1: number; x2: number; y2: number
  color: string; speed: number; dimmed: boolean
}) {
  // Curved path for visual interest
  const dx = x2 - x1
  const cp1x = x1 + dx * 0.4
  const cp2x = x1 + dx * 0.6
  const pathD = `M${x1},${y1} C${cp1x},${y1} ${cp2x},${y2} ${x2},${y2}`

  return (
    <g opacity={dimmed ? 0.06 : 1} style={{ transition: 'opacity 0.4s ease' }}>
      {/* Base path */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={dimmed ? 1 : 2}
        opacity={0.25}
      />
      {/* Glow path */}
      {!dimmed && (
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={4}
          opacity={0.08}
          style={{ filter: 'blur(4px)' }}
        />
      )}
      {/* Animated dot */}
      {!dimmed && (
        <circle r="4" fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
          <animateMotion dur={`${speed}s`} repeatCount="indefinite" path={pathD} />
        </circle>
      )}
    </g>
  )
}

/* ── Flow node ── */

function FlowNodeEl({
  node, dimmed, isSelected, onClick,
}: {
  node: FlowNode; dimmed: boolean; isSelected: boolean; onClick: () => void
}) {
  const { x, y, w, h, label, sublabel, color, type, status } = node
  const rx = type === 'broker' ? 16 : type === 'consumer' ? 16 : 8

  return (
    <g
      style={{ cursor: 'pointer', opacity: dimmed ? 0.12 : 1, transition: 'opacity 0.4s ease' }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      {/* Outer glow when selected */}
      {isSelected && (
        <rect
          x={x - w / 2 - 4}
          y={y - h / 2 - 4}
          width={w + 8}
          height={h + 8}
          rx={rx + 2}
          fill="none"
          stroke={color}
          strokeWidth={2}
          opacity={0.4}
          style={{ filter: `blur(4px)` }}
        />
      )}

      {/* Background */}
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={rx}
        fill={`${color}12`}
        stroke={color}
        strokeWidth={isSelected ? 2.5 : 1.5}
        style={{
          filter: isSelected
            ? `drop-shadow(0 0 12px ${color})`
            : `drop-shadow(0 0 4px ${color}40)`,
        }}
      />

      {/* Status dot for machines */}
      {type === 'machine' && status && (
        <>
          <circle cx={x - w / 2 + 14} cy={y} r={5} fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
          {status === 'running' && (
            <circle cx={x - w / 2 + 14} cy={y} r={5} fill={color} opacity={0.4}>
              <animate attributeName="r" values="5;9;5" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
          )}
        </>
      )}

      {/* Attribute color dot */}
      {type === 'attribute' && (
        <circle cx={x - w / 2 + 12} cy={y - 4} r={4} fill={color} style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
      )}

      {/* Label */}
      <text
        x={type === 'machine' ? x + 8 : type === 'attribute' ? x + 4 : x}
        y={sublabel ? y - 3 : y + 5}
        textAnchor="middle"
        fill="white"
        fontSize={type === 'attribute' ? 12 : 13}
        fontFamily="monospace"
        fontWeight="600"
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={type === 'machine' ? x + 8 : type === 'attribute' ? x + 4 : x}
          y={y + 13}
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize={10}
          fontFamily="monospace"
        >
          {sublabel}
        </text>
      )}
    </g>
  )
}

/* ── Detail panel — shows info based on what's selected ── */

function DetailPanel({
  selectedNode,
  connectedEdges,
  allNodes,
}: {
  selectedNode: FlowNode | null
  connectedEdges: FlowEdge[]
  allNodes: FlowNode[]
}) {
  if (!selectedNode) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <p className="text-sm text-slate-500 text-center leading-relaxed">
          Click any node to explore<br />its data model and connections
        </p>
      </div>
    )
  }

  const nodeMap = Object.fromEntries(allNodes.map((n) => [n.id, n]))

  // Find connected nodes via edges
  const connectedNodeIds = new Set<string>()
  connectedEdges.forEach((e) => {
    connectedNodeIds.add(e.from)
    connectedNodeIds.add(e.to)
  })
  const connectedNodes = allNodes.filter((n) => connectedNodeIds.has(n.id) && n.id !== selectedNode.id)

  return (
    <div className="space-y-4 text-sm">
      {/* Node identity */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ background: selectedNode.color, boxShadow: `0 0 6px ${selectedNode.color}` }} />
          <h3 className="font-bold text-white text-base">{selectedNode.label}</h3>
        </div>
        <span className="inline-block rounded-full px-2 py-0.5 text-[11px] font-medium mt-1"
          style={{
            background: `${selectedNode.color}15`,
            color: selectedNode.color,
            border: `1px solid ${selectedNode.color}33`,
          }}
        >
          {selectedNode.type.toUpperCase()}
        </span>
      </div>

      {/* Full MQTT topic path */}
      {selectedNode.topicPath && (
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1">MQTT Topic / Path</div>
          <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2">
            <code className="text-xs text-cyan-400 font-mono break-all">{selectedNode.topicPath}</code>
          </div>
          {/* Nesting breakdown */}
          {selectedNode.topicPath.includes('/') && !selectedNode.topicPath.includes('://') && (
            <div className="mt-2 space-y-0.5">
              {selectedNode.topicPath.split('/').map((segment, i, arr) => (
                <div key={i} className="flex items-center gap-1" style={{ paddingLeft: `${i * 12}px` }}>
                  <span className="text-slate-600 text-[10px]">{i < arr.length - 1 ? '├─' : '└─'}</span>
                  <span className="text-xs font-mono text-slate-300">{segment}</span>
                  <span className="text-[10px] text-slate-600 ml-1">
                    {i === 0 ? '(root)' : i === 1 ? '(floor)' : i === 2 ? '(station)' : i === 3 ? '(machine)' : '(attribute)'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Machine-specific: full attribute data model */}
      {selectedNode.type === 'machine' && selectedNode.machine && (
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Data Model — Machine Tags</div>
          <div className="space-y-1.5">
            {(['temperature', 'cycle_time', 'throughput', 'oee', 'vibration', 'power_consumption'] as const).map((key) => {
              const meta = attributeMetadata[key]
              const val = selectedNode.machine!.attributes[key]
              return (
                <div key={key} className="rounded-lg border border-white/5 bg-black/30 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: meta.color, boxShadow: `0 0 4px ${meta.color}` }} />
                      <span className="text-xs text-slate-300 font-medium">{attributeLabels[key]}</span>
                    </div>
                    <span className="text-sm font-mono font-semibold text-white">
                      {val}<span className="text-slate-500 ml-1 text-[10px]">{attributeUnits[key]}</span>
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-600 font-mono">
                    {selectedNode.machine!.topic}/{key}
                  </div>
                  <div className="flex gap-3 mt-0.5 text-[10px] text-slate-600 font-mono">
                    <span>QoS: {meta.qos}</span>
                    <span>Retain: {meta.retain ? 'yes' : 'no'}</span>
                    <span>Freq: {meta.updateFrequencyMs}ms</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Attribute-specific: show join info */}
      {selectedNode.type === 'attribute' && selectedNode.attrKey && (
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Attribute Config</div>
          {(() => {
            const meta = attributeMetadata[selectedNode.attrKey]
            const machine = shopfloor.stations.flatMap(s => s.machines).find(m => m.id === selectedNode.machineId)
            return (
              <div className="space-y-2">
                <div className="rounded-lg border border-white/5 bg-black/30 px-3 py-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">QoS Level</span>
                    <span className="text-xs font-mono text-white">{meta.qos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">Retain</span>
                    <span className="text-xs font-mono text-white">{meta.retain ? 'true' : 'false'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">Update Freq</span>
                    <span className="text-xs font-mono text-white">{meta.updateFrequencyMs}ms</span>
                  </div>
                  {machine && (
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Current Value</span>
                      <span className="text-xs font-mono text-white">
                        {machine.attributes[selectedNode.attrKey as keyof typeof machine.attributes]}
                        {attributeUnits[selectedNode.attrKey]}
                      </span>
                    </div>
                  )}
                </div>
                {/* Data flow path */}
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mt-3 mb-1">Data Flow Path</div>
                <div className="rounded-lg border border-white/5 bg-black/30 px-3 py-2 space-y-1">
                  {machine && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="h-2 w-2 rounded-full" style={{ background: statusColors[machine.attributes.status] }} />
                      <span className="text-slate-300 font-mono">{machine.name}</span>
                    </div>
                  )}
                  <div className="text-slate-600 text-[10px] pl-4">↓ publishes to</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
                    <span className="text-cyan-400 font-mono text-[10px]">{selectedNode.topicPath}</span>
                  </div>
                  <div className="text-slate-600 text-[10px] pl-4">↓ routed via</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                    <span className="text-slate-300 font-mono">{brokerConfig.host}</span>
                  </div>
                  <div className="text-slate-600 text-[10px] pl-4">↓ matched by</div>
                  {subscriptionPatterns.filter(s =>
                    s.pattern.includes('#') ||
                    s.pattern.includes(selectedNode.attrKey!) ||
                    s.pattern.includes(selectedNode.machineId!)
                  ).slice(0, 3).map((sub, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="h-2 w-2 rounded-full bg-cyan-500" />
                      <span className="text-cyan-400 font-mono text-[10px]">{sub.pattern}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Subscription-specific */}
      {selectedNode.type === 'subscription' && selectedNode.subscriptionPattern && (
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Subscription Details</div>
          <div className="rounded-lg border border-white/5 bg-black/30 px-3 py-2 space-y-1.5">
            <div>
              <span className="text-[10px] text-slate-500">Full Pattern</span>
              <div className="text-xs font-mono text-cyan-400 mt-0.5 break-all">{selectedNode.subscriptionPattern.pattern}</div>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-400">QoS</span>
              <span className="text-xs font-mono text-white">{selectedNode.subscriptionPattern.qos}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Description</span>
              <div className="text-xs text-slate-300 mt-0.5">{selectedNode.subscriptionPattern.description}</div>
            </div>
          </div>

          {/* Which machines this subscription matches */}
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mt-3 mb-1">Matched Machines</div>
          <div className="space-y-1">
            {shopfloor.stations.flatMap(s => s.machines).filter(m => {
              const p = selectedNode.subscriptionPattern!.pattern
              return p.includes('#') || p.includes(m.id) ||
                shopfloor.stations.some(s => s.machines.includes(m) && p.includes(s.id))
            }).map(m => (
              <div key={m.id} className="flex items-center gap-2 rounded-lg border border-white/5 bg-black/20 px-2 py-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: statusColors[m.attributes.status] }} />
                <span className="text-xs font-mono text-slate-300">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Broker-specific */}
      {selectedNode.type === 'broker' && (
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Broker Config</div>
          <div className="rounded-lg border border-white/5 bg-black/30 px-3 py-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-xs text-slate-400">Host</span>
              <span className="text-xs font-mono text-white">{brokerConfig.host}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-400">Port</span>
              <span className="text-xs font-mono text-white">{brokerConfig.port}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-400">Protocol</span>
              <span className="text-xs font-mono text-white">{brokerConfig.protocol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-400">Client ID</span>
              <span className="text-xs font-mono text-white">{brokerConfig.clientId}</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mt-3 mb-1">Active Subscriptions</div>
          <div className="space-y-1">
            {subscriptionPatterns.map((sub, i) => (
              <div key={i} className="rounded border border-white/5 bg-black/20 px-2 py-1">
                <div className="text-[10px] font-mono text-cyan-400 break-all">{sub.pattern}</div>
                <div className="text-[9px] text-slate-600 mt-0.5">QoS {sub.qos} — {sub.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connected nodes section */}
      {connectedNodes.length > 0 && (
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Connected Nodes ({connectedNodes.length})
          </div>
          <div className="space-y-1 max-h-48 overflow-auto">
            {connectedNodes.slice(0, 12).map((n) => (
              <div key={n.id} className="flex items-center gap-2 rounded border border-white/5 bg-black/20 px-2 py-1">
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: n.color }} />
                <span className="text-[11px] font-mono text-slate-300 truncate">{n.label}</span>
                <span className="text-[9px] text-slate-600 ml-auto flex-shrink-0">{n.type}</span>
              </div>
            ))}
            {connectedNodes.length > 12 && (
              <div className="text-[10px] text-slate-600 text-center">+{connectedNodes.length - 12} more</div>
            )}
          </div>
        </div>
      )}
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
    <div className="flex flex-wrap gap-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color, boxShadow: `0 0 4px ${item.color}` }} />
          <span className="text-xs text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Main ── */

function DataflowContent() {
  const searchParams = useSearchParams()
  const isEmbed = searchParams.get('embed') === '1'

  const { nodes: initialNodes, edges } = useMemo(() => buildFlow(), [])
  const [nodes, setNodes] = useState(initialNodes)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOff, setDragOff] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes])

  const selectedNode = selectedNodeId ? nodeMap[selectedNodeId] ?? null : null

  // Find edges connected to selected node (direct + transitive for machines)
  const highlightedEdgeIds = useMemo(() => {
    if (!selectedNodeId) return null
    const ids = new Set<string>()
    const node = nodeMap[selectedNodeId]
    if (!node) return null

    if (node.type === 'machine') {
      // Highlight all edges for this machine + all __all__ edges
      edges.forEach((e) => {
        if (e.machineId === node.machineId || e.machineId === '__all__') ids.add(e.id)
      })
    } else if (node.type === 'attribute') {
      // Highlight edges for this specific attribute + __all__
      edges.forEach((e) => {
        if (e.from === selectedNodeId || e.to === selectedNodeId) ids.add(e.id)
        if (e.machineId === node.machineId && e.attrKey === node.attrKey) ids.add(e.id)
        if (e.machineId === '__all__') ids.add(e.id)
      })
    } else {
      // For broker/subscription/consumer, highlight directly connected edges
      edges.forEach((e) => {
        if (e.from === selectedNodeId || e.to === selectedNodeId) ids.add(e.id)
      })
    }
    return ids
  }, [selectedNodeId, nodeMap, edges])

  const connectedEdges = useMemo(() => {
    if (!selectedNodeId) return []
    return edges.filter((e) => e.from === selectedNodeId || e.to === selectedNodeId)
  }, [selectedNodeId, edges])

  const highlightedNodeIds = useMemo(() => {
    if (!highlightedEdgeIds) return null
    const ids = new Set<string>()
    edges.forEach((e) => {
      if (highlightedEdgeIds.has(e.id)) {
        ids.add(e.from)
        ids.add(e.to)
      }
    })
    if (selectedNodeId) ids.add(selectedNodeId)
    return ids
  }, [highlightedEdgeIds, edges, selectedNodeId])

  // Dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.preventDefault()
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return
      const svgX = ((e.clientX - rect.left) / rect.width) * 1600
      const svgY = ((e.clientY - rect.top) / rect.height) * 900
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
      const svgX = ((e.clientX - rect.left) / rect.width) * 1600
      const svgY = ((e.clientY - rect.top) / rect.height) * 900
      setNodes((prev) =>
        prev.map((n) => n.id === dragging ? { ...n, x: svgX - dragOff.x, y: svgY - dragOff.y } : n)
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

  return (
    <div className={isEmbed ? 'flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a1a]' : 'flex h-screen flex-col overflow-hidden'}>
      {!isEmbed && <PageHeader path="/mqtt/dataflow" />}

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Graph */}
        <div className="flex-1 overflow-hidden flex flex-col p-4">
          <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
            <Legend />
            {selectedNodeId && (
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20"
              >
                Clear selection
              </button>
            )}
          </div>

          {/* Column headers */}
          <div className="flex justify-between px-6 mb-2">
            {['Machines', 'Attributes', 'MQTT Broker', 'Subscriptions', 'Dashboard'].map((label) => (
              <span key={label} className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">{label}</span>
            ))}
          </div>

          <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <svg
              ref={svgRef}
              viewBox="0 0 1600 900"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              style={{ cursor: dragging ? 'grabbing' : 'default' }}
              onClick={() => setSelectedNodeId(null)}
            >
              {/* Edges */}
              {edges.map((edge) => {
                const from = nodeMap[edge.from]
                const to = nodeMap[edge.to]
                if (!from || !to) return null
                const dimmed = highlightedEdgeIds ? !highlightedEdgeIds.has(edge.id) : false
                return (
                  <AnimatedEdge
                    key={edge.id}
                    x1={from.x + from.w / 2}
                    y1={from.y}
                    x2={to.x - to.w / 2}
                    y2={to.y}
                    color={edge.color}
                    speed={edge.speed}
                    dimmed={dimmed}
                  />
                )
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const dimmed = highlightedNodeIds ? !highlightedNodeIds.has(node.id) : false
                const isSelected = node.id === selectedNodeId
                return (
                  <g
                    key={node.id}
                    onMouseDown={(e) => handleMouseDown(e, node.id)}
                    style={{ cursor: 'grab' }}
                  >
                    <FlowNodeEl
                      node={node}
                      dimmed={dimmed}
                      isSelected={isSelected}
                      onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                    />
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Detail panel */}
        <div className="w-full md:w-80 flex-shrink-0 border-t md:border-t-0 md:border-l border-white/10 overflow-auto p-4">
          <DetailPanel
            selectedNode={selectedNode}
            connectedEdges={connectedEdges}
            allNodes={nodes}
          />
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
