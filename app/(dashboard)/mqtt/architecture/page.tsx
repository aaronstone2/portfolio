'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import { ChevronRight, ChevronDown } from 'lucide-react'
import {
  shopfloor,
  brokerConfig,
  subscriptionPatterns,
  attributeMetadata,
  topicLevels,
  statusColors,
  type Station,
  type Machine,
} from '../demo-data'

/* ── Types for the architecture tree ── */

interface ArchNode {
  label: string
  topic: string
  level: number
  type: 'broker' | 'shopfloor' | 'station' | 'machine' | 'attribute'
  value?: string | number
  qos?: number
  retain?: boolean
  payloadFormat?: string
  wildcardSubscriptions?: string[]
  children?: ArchNode[]
}

const levelColors = [
  '#a855f7', // broker — purple
  '#3b82f6', // shopfloor — blue
  '#06b6d4', // station — cyan
  '#22c55e', // machine — green
  '#eab308', // attribute — yellow
]

function buildArchTree(): ArchNode {
  const machineToAttrs = (m: Machine): ArchNode[] => {
    const attrKeys = ['temperature', 'cycle_time', 'throughput', 'oee', 'vibration', 'power_consumption', 'status'] as const
    return attrKeys.map((key) => {
      const meta = attributeMetadata[key]
      const val = m.attributes[key]
      return {
        label: key,
        topic: `${m.topic}/${key}`,
        level: 4,
        type: 'attribute' as const,
        value: val,
        qos: meta?.qos ?? 0,
        retain: meta?.retain ?? false,
        payloadFormat: typeof val === 'number' ? 'JSON number' : 'JSON string',
        wildcardSubscriptions: subscriptionPatterns
          .filter((sp) => {
            const re = new RegExp('^' + sp.pattern.replace(/\+/g, '[^/]+').replace(/#/g, '.*') + '$')
            return re.test(`${m.topic}/${key}`)
          })
          .map((sp) => sp.pattern),
      }
    })
  }

  const stationToNode = (s: Station): ArchNode => ({
    label: s.name,
    topic: s.topic,
    level: 2,
    type: 'station',
    children: s.machines.map((m) => ({
      label: m.name,
      topic: m.topic,
      level: 3,
      type: 'machine' as const,
      children: machineToAttrs(m),
    })),
  })

  return {
    label: brokerConfig.host,
    topic: `${brokerConfig.protocol}://${brokerConfig.host}:${brokerConfig.port}`,
    level: 0,
    type: 'broker',
    children: [
      {
        label: shopfloor.name,
        topic: shopfloor.topic,
        level: 1,
        type: 'shopfloor',
        children: shopfloor.stations.map(stationToNode),
      },
    ],
  }
}

/* ── Collapsible tree node ── */

function TreeNodeRow({
  node,
  selected,
  onSelect,
}: {
  node: ArchNode
  selected: ArchNode | null
  onSelect: (n: ArchNode) => void
}) {
  const [open, setOpen] = useState(node.level < 3)
  const hasChildren = node.children && node.children.length > 0
  const color = levelColors[node.level] || '#fff'
  const isSelected = selected?.topic === node.topic

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setOpen(!open)
          onSelect(node)
        }}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-all hover:bg-white/[0.04]"
        style={{
          marginLeft: node.level * 16,
          background: isSelected ? `${color}12` : undefined,
          border: isSelected ? `1px solid ${color}33` : '1px solid transparent',
        }}
      >
        {hasChildren ? (
          open ? (
            <ChevronDown className="h-3 w-3 flex-shrink-0" style={{ color }} />
          ) : (
            <ChevronRight className="h-3 w-3 flex-shrink-0" style={{ color }} />
          )
        ) : (
          <span className="h-3 w-3 flex-shrink-0 flex items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
          </span>
        )}
        <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ color, background: `${color}15` }}>
          {topicLevels[node.level]}
        </span>
        <span className="text-xs font-mono font-semibold text-white truncate">{node.label}</span>
        {node.value !== undefined && (
          <span className="ml-auto text-[10px] font-mono text-slate-500 flex-shrink-0">
            {String(node.value)}
          </span>
        )}
      </button>

      {hasChildren && open && (
        <div className="relative">
          <div
            className="absolute top-0 bottom-0 w-px"
            style={{ left: node.level * 16 + 22, background: `${color}20` }}
          />
          {node.children!.map((child) => (
            <TreeNodeRow key={child.topic} node={child} selected={selected} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Detail panel ── */

function DetailPanel({ node }: { node: ArchNode | null }) {
  if (!node) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-xs text-slate-600 text-center">Click any node to see<br />its MQTT configuration</p>
      </div>
    )
  }

  const color = levelColors[node.level] || '#fff'

  // Build a JSON representation of the selected node
  const jsonObj: Record<string, unknown> = {
    topic: node.topic,
    level: topicLevels[node.level],
    label: node.label,
  }
  if (node.value !== undefined) jsonObj.value = node.value
  if (node.qos !== undefined) jsonObj.qos = node.qos
  if (node.retain !== undefined) jsonObj.retain = node.retain
  if (node.payloadFormat) jsonObj.payloadFormat = node.payloadFormat
  if (node.wildcardSubscriptions?.length) jsonObj.matchingSubscriptions = node.wildcardSubscriptions
  if (node.children) jsonObj.childCount = node.children.length

  return (
    <div className="space-y-4">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color }}>
          {topicLevels[node.level]}
        </div>
        <h3 className="text-sm font-bold text-white">{node.label}</h3>
        <p className="text-[10px] font-mono text-slate-500 mt-1 break-all">{node.topic}</p>
      </div>

      {/* Config details */}
      {node.qos !== undefined && (
        <div className="rounded-lg border border-white/5 bg-black/30 px-3 py-2">
          <div className="text-[10px] text-slate-500">QoS Level</div>
          <div className="text-xs font-mono font-semibold text-white">{node.qos} — {node.qos === 0 ? 'At most once' : node.qos === 1 ? 'At least once' : 'Exactly once'}</div>
        </div>
      )}
      {node.retain !== undefined && (
        <div className="rounded-lg border border-white/5 bg-black/30 px-3 py-2">
          <div className="text-[10px] text-slate-500">Retain Flag</div>
          <div className="text-xs font-mono font-semibold text-white">{node.retain ? 'true' : 'false'}</div>
        </div>
      )}
      {node.payloadFormat && (
        <div className="rounded-lg border border-white/5 bg-black/30 px-3 py-2">
          <div className="text-[10px] text-slate-500">Payload Format</div>
          <div className="text-xs font-mono font-semibold text-white">{node.payloadFormat}</div>
        </div>
      )}
      {node.wildcardSubscriptions && node.wildcardSubscriptions.length > 0 && (
        <div className="rounded-lg border border-white/5 bg-black/30 px-3 py-2">
          <div className="text-[10px] text-slate-500 mb-1">Matching Subscriptions</div>
          {node.wildcardSubscriptions.map((s) => (
            <div key={s} className="text-[10px] font-mono text-cyan-400">{s}</div>
          ))}
        </div>
      )}

      {/* Raw JSON */}
      <div>
        <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-1 font-semibold">Raw JSON</div>
        <pre className="rounded-lg border border-white/5 bg-black/40 p-3 text-[10px] font-mono text-slate-400 overflow-auto max-h-64 whitespace-pre-wrap break-all">
          {JSON.stringify(jsonObj, null, 2)}
        </pre>
      </div>
    </div>
  )
}

/* ── Nested visual containers ── */

function NestedBlock({ node, depth, selected, onSelect }: {
  node: ArchNode
  depth: number
  selected: ArchNode | null
  onSelect: (n: ArchNode) => void
}) {
  const color = levelColors[node.level] || '#fff'
  const isSelected = selected?.topic === node.topic

  if (!node.children || node.children.length === 0) {
    // Leaf node (attribute)
    return (
      <button
        onClick={() => onSelect(node)}
        className="rounded-md px-2 py-1 text-left transition-all hover:bg-white/[0.04]"
        style={{
          border: isSelected ? `1px solid ${color}66` : `1px solid ${color}15`,
          background: isSelected ? `${color}12` : `${color}05`,
        }}
      >
        <span className="text-[9px] font-mono text-slate-600">{node.label}</span>
        {node.value !== undefined && (
          <span className="ml-1.5 text-[10px] font-mono font-semibold" style={{ color }}>
            {String(node.value)}
          </span>
        )}
      </button>
    )
  }

  return (
    <div
      className="rounded-xl p-3 transition-all cursor-pointer"
      style={{
        border: isSelected ? `1px solid ${color}55` : `1px solid ${color}18`,
        background: `${color}05`,
        boxShadow: isSelected ? `0 0 12px ${color}15` : undefined,
      }}
      onClick={(e) => { e.stopPropagation(); onSelect(node) }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ color, background: `${color}15` }}>
          {topicLevels[node.level]}
        </span>
        <span className="text-xs font-mono font-semibold text-white">{node.label}</span>
      </div>
      <p className="text-[9px] font-mono text-slate-600 mb-2 break-all">{node.topic}</p>
      <div className={node.level >= 3 ? 'flex flex-wrap gap-1.5' : 'space-y-2'}>
        {node.children.map((child) => (
          <NestedBlock key={child.topic} node={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

/* ── Main page ── */

function ArchitectureContent() {
  const searchParams = useSearchParams()
  const isEmbed = searchParams.get('embed') === '1'
  const [selected, setSelected] = useState<ArchNode | null>(null)
  const [viewMode, setViewMode] = useState<'tree' | 'nested'>('nested')

  const tree = buildArchTree()

  return (
    <div className={isEmbed ? 'flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a1a]' : 'flex h-screen flex-col overflow-hidden'}>
      {!isEmbed && (
        <PageHeader path="/mqtt/architecture">
          <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
            {(['nested', 'tree'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${viewMode === mode ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                style={viewMode === mode ? { boxShadow: '0 0 10px rgba(255,255,255,0.08)' } : {}}
              >
                {mode === 'nested' ? 'Nested View' : 'Tree View'}
              </button>
            ))}
          </div>
        </PageHeader>
      )}
      {isEmbed && (
        <div className="flex items-center justify-between border-b border-white/10 bg-black/50 px-4 py-2 flex-shrink-0">
          <span className="text-xs font-semibold text-white">MQTT Architecture</span>
          <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
            {(['nested', 'tree'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${viewMode === mode ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {mode === 'nested' ? 'Nested' : 'Tree'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {viewMode === 'tree' ? (
            <div className="max-w-4xl mx-auto">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                {/* Level legend */}
                <div className="flex flex-wrap gap-3 mb-4 pb-3 border-b border-white/5">
                  {topicLevels.map((level, i) => (
                    <div key={level} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: levelColors[i], boxShadow: `0 0 4px ${levelColors[i]}` }} />
                      <span className="text-[10px] text-slate-500">{level}</span>
                    </div>
                  ))}
                </div>
                <TreeNodeRow node={tree} selected={selected} onSelect={setSelected} />
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              {/* Level legend */}
              <div className="flex flex-wrap gap-3 mb-4">
                {topicLevels.map((level, i) => (
                  <div key={level} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: levelColors[i], boxShadow: `0 0 4px ${levelColors[i]}` }} />
                    <span className="text-[10px] text-slate-500">{level}</span>
                  </div>
                ))}
              </div>
              <NestedBlock node={tree} depth={0} selected={selected} onSelect={setSelected} />
            </div>
          )}
        </div>

        {/* Detail sidebar */}
        <div className="w-full md:w-80 flex-shrink-0 border-t md:border-t-0 md:border-l border-white/10 overflow-auto p-4">
          <DetailPanel node={selected} />
        </div>
      </div>
    </div>
  )
}

export default function ArchitecturePage() {
  return (
    <Suspense fallback={null}>
      <ArchitectureContent />
    </Suspense>
  )
}
