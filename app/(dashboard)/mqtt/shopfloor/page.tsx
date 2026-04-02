'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import {
  shopfloor,
  statusColors,
  attributeLabels,
  attributeUnits,
  type Machine,
  type MachineStatus,
} from '../demo-data'

/* ── Tiny sparkline (last 10 values) ── */

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 60
  const h = 20
  const pad = 2
  if (values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const points = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - pad * 2)
      const y = pad + (1 - (v - min) / range) * (h - pad * 2)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 2px ${color}66)` }}
      />
    </svg>
  )
}

/* ── Machine card (glass morphism) ── */

function MachineCard({ machine, liveAttrs }: {
  machine: Machine
  liveAttrs: { temperature: number; oee: number; throughput: number }
}) {
  const status = machine.attributes.status
  const sColor = statusColors[status]
  const [flash, setFlash] = useState(false)
  const prevRef = useRef(liveAttrs)
  const [sparkHistory, setSparkHistory] = useState<number[]>(() => {
    const ts = machine.timeSeries['temperature']
    return ts ? ts.slice(-10).map((p) => p.value) : []
  })

  useEffect(() => {
    if (
      prevRef.current.temperature !== liveAttrs.temperature ||
      prevRef.current.oee !== liveAttrs.oee ||
      prevRef.current.throughput !== liveAttrs.throughput
    ) {
      setFlash(true)
      setSparkHistory((prev) => [...prev.slice(-9), liveAttrs.temperature])
      const t = setTimeout(() => setFlash(false), 400)
      prevRef.current = liveAttrs
      return () => clearTimeout(t)
    }
  }, [liveAttrs])

  return (
    <div
      className="rounded-xl p-3 transition-all duration-300 relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 20px rgba(255,255,255,0.02)`,
      }}
    >
      {/* Inner glow */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${sColor}08, transparent 60%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="h-2.5 w-2.5 rounded-full flex-shrink-0"
            style={{
              background: sColor,
              boxShadow: `0 0 6px ${sColor}, 0 0 12px ${sColor}80`,
              animation: status === 'running' ? 'statusPulse 2s ease-in-out infinite' : undefined,
            }}
          />
          <span className="text-xs font-mono font-bold text-white truncate">{machine.name}</span>
          <span
            className="ml-auto text-[9px] font-medium px-1.5 py-0.5 rounded-full"
            style={{
              color: sColor,
              background: `${sColor}15`,
              border: `1px solid ${sColor}30`,
            }}
          >
            {status}
          </span>
        </div>

        {/* Attributes */}
        <div className="space-y-1.5">
          {[
            { key: 'temperature', val: liveAttrs.temperature, unit: attributeUnits['temperature'] },
            { key: 'oee', val: liveAttrs.oee, unit: attributeUnits['oee'] },
            { key: 'throughput', val: liveAttrs.throughput, unit: attributeUnits['throughput'] },
          ].map((attr) => (
            <div key={attr.key} className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">{attributeLabels[attr.key]}</span>
              <span
                className="text-[11px] font-mono font-semibold text-white transition-all duration-300"
                style={{
                  transform: flash ? 'scale(1.15)' : 'scale(1)',
                  textShadow: flash ? '0 0 8px rgba(255,255,255,0.5)' : 'none',
                }}
              >
                {typeof attr.val === 'number' ? attr.val.toFixed(1) : attr.val}
                <span className="text-slate-600 ml-0.5 text-[9px]">{attr.unit}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Sparkline */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[9px] text-slate-600">Temp trend</span>
          <Sparkline values={sparkHistory} color="#ef4444" />
        </div>
      </div>
    </div>
  )
}

/* ── Station panel (glass) ── */

function StationPanel({ station, liveData }: {
  station: typeof shopfloor.stations[0]
  liveData: Record<string, { temperature: number; oee: number; throughput: number }>
}) {
  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 0 30px rgba(255,255,255,0.01)',
      }}
    >
      {/* Gradient border effect */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04), transparent 50%, rgba(255,255,255,0.02))',
        }}
      />

      <div className="relative z-10">
        <h3 className="text-sm font-semibold text-white mb-1" style={{ textShadow: '0 0 10px rgba(255,255,255,0.15)' }}>
          {station.name}
        </h3>
        <p className="text-[10px] font-mono text-slate-600 mb-3">{station.machines.length} machines</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {station.machines.map((m) => (
            <MachineCard key={m.id} machine={m} liveAttrs={liveData[m.id] || { temperature: m.attributes.temperature, oee: m.attributes.oee, throughput: m.attributes.throughput }} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Main page content ── */

function ShopfloorContent() {
  const searchParams = useSearchParams()
  const isEmbed = searchParams.get('embed') === '1'

  // Live data simulation
  const allMachines = shopfloor.stations.flatMap((s) => s.machines)
  const [liveData, setLiveData] = useState<Record<string, { temperature: number; oee: number; throughput: number }>>(() => {
    const d: Record<string, { temperature: number; oee: number; throughput: number }> = {}
    for (const m of allMachines) {
      d[m.id] = { temperature: m.attributes.temperature, oee: m.attributes.oee, throughput: m.attributes.throughput }
    }
    return d
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData((prev) => {
        const next = { ...prev }
        for (const m of allMachines) {
          const p = prev[m.id]
          next[m.id] = {
            temperature: +(p.temperature + (Math.random() - 0.5) * 2).toFixed(1),
            oee: +Math.max(0, Math.min(100, p.oee + (Math.random() - 0.5) * 3)).toFixed(1),
            throughput: +Math.max(0, p.throughput + (Math.random() - 0.5) * 15).toFixed(1),
          }
        }
        return next
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={isEmbed ? 'flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a1a]' : 'flex h-screen flex-col overflow-hidden'}>
      {!isEmbed && <PageHeader path="/mqtt/shopfloor" />}

      {/* CSS for status pulse */}
      <style dangerouslySetInnerHTML={{
        __html: `@keyframes statusPulse { 0%, 100% { opacity: 1; box-shadow: 0 0 6px currentColor, 0 0 12px currentColor; } 50% { opacity: 0.6; box-shadow: 0 0 3px currentColor, 0 0 6px currentColor; } }`
      }} />

      <div className="flex-1 overflow-auto p-4 md:p-6">
        {/* Shopfloor container */}
        <div
          className="max-w-6xl mx-auto rounded-3xl p-4 md:p-6 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.01)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 0 40px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.03)',
          }}
        >
          {/* Gradient border sweep */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.02) 100%)',
            }}
          />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white" style={{ textShadow: '0 0 12px rgba(255,255,255,0.2)' }}>
                  {shopfloor.name}
                </h2>
                <p className="text-[10px] font-mono text-slate-600">{shopfloor.topic}</p>
              </div>
              <div className="flex items-center gap-3">
                {(['running', 'idle', 'fault', 'maintenance'] as const).map((s) => {
                  const count = allMachines.filter((m) => m.attributes.status === s).length
                  if (count === 0) return null
                  return (
                    <div key={s} className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          background: statusColors[s],
                          boxShadow: `0 0 4px ${statusColors[s]}`,
                        }}
                      />
                      <span className="text-[10px] text-slate-500">{count} {s}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Station layout: 2 on top, 1 spanning bottom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {shopfloor.stations.slice(0, 2).map((station) => (
                <StationPanel key={station.id} station={station} liveData={liveData} />
              ))}
            </div>
            {shopfloor.stations.length > 2 && (
              <StationPanel station={shopfloor.stations[2]} liveData={liveData} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShopfloorPage() {
  return (
    <Suspense fallback={null}>
      <ShopfloorContent />
    </Suspense>
  )
}
