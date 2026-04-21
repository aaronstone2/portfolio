"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ExternalLink, Github, Info, Search } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"

interface Keyword { keyword: string; count: number }
interface KwEdge { source: string; target: string; weight: number }
interface Job { id: string; title: string; company: string; location: string | null; url: string | null }
interface Snapshot {
  keywords: Keyword[]
  keywordEdges: KwEdge[]
  sampleJobsByKeyword: Record<string, Job[]>
  totals: { jobs: number; edges: number; keywords: number; keywordEdges: number }
}

/** Radial layout — put the 25 keywords on a circle, largest in the middle isn't nice so just use a radial spread sized by edge count. */
function radialLayout(keywords: Keyword[], width: number, height: number) {
  const cx = width / 2
  const cy = height / 2
  const radius = Math.min(width, height) * 0.38
  const positions: Record<string, { x: number; y: number; r: number }> = {}
  keywords.forEach((kw, i) => {
    const angle = (i / keywords.length) * Math.PI * 2 - Math.PI / 2
    const nodeRadius = 14 + Math.min(30, Math.sqrt(kw.count) * 0.4)
    positions[kw.keyword] = {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      r: nodeRadius,
    }
  })
  return positions
}

export default function JobGraphPage() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [size, setSize] = useState({ w: 800, h: 600 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/job-graph-snapshot.json")
      .then((r) => r.json())
      .then((data: Snapshot) => { setSnapshot(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Responsive: track container size for SVG layout
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => {
      const b = entries[0]?.contentRect
      if (b) setSize({ w: b.width, h: Math.max(360, b.height) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const positions = useMemo(
    () => snapshot ? radialLayout(snapshot.keywords, size.w, size.h) : {},
    [snapshot, size],
  )

  // Which edges/nodes to highlight based on selected or hovered
  const focus = selected ?? hovered
  const highlightedEdges = useMemo(() => {
    if (!focus || !snapshot) return new Set<string>()
    const s = new Set<string>()
    for (const e of snapshot.keywordEdges) {
      const a = e.source.replace(/^kw:/, "")
      const b = e.target.replace(/^kw:/, "")
      if (a === focus || b === focus) s.add(`${a}-${b}`)
    }
    return s
  }, [focus, snapshot])

  const highlightedNodes = useMemo(() => {
    if (!focus || !snapshot) return new Set<string>()
    const s = new Set<string>([focus])
    for (const e of snapshot.keywordEdges) {
      const a = e.source.replace(/^kw:/, "")
      const b = e.target.replace(/^kw:/, "")
      if (a === focus) s.add(b)
      if (b === focus) s.add(a)
    }
    return s
  }, [focus, snapshot])

  const selectedJobs = useMemo(() => {
    if (!selected || !snapshot) return []
    return snapshot.sampleJobsByKeyword[selected] ?? []
  }, [selected, snapshot])

  const filteredKeywords = useMemo(() => {
    if (!snapshot) return []
    if (!search.trim()) return snapshot.keywords
    const q = search.toLowerCase()
    return snapshot.keywords.filter((kw) => kw.keyword.toLowerCase().includes(q))
  }, [snapshot, search])

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <PageHeader path="/job-graph">
        <Link
          href="/job-graph/about"
          className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:text-white hover:scale-[1.05] hover:bg-white/10"
        >
          <Info className="h-3.5 w-3.5" />
          About
        </Link>
        <a
          href="https://github.com/aaronstone2/job-graph"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:text-white hover:scale-[1.05] hover:bg-white/10"
        >
          <Github className="h-3.5 w-3.5" />
          Source
        </a>
      </PageHeader>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Left: stats + keyword sidebar */}
        <aside className="w-full md:w-64 md:flex-shrink-0 border-b md:border-b-0 md:border-r border-white/10 overflow-auto bg-card/30 max-h-[35vh] md:max-h-full">
          <div className="p-4 border-b border-white/10">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">Indexed</div>
            {snapshot && (
              <div className="grid grid-cols-3 md:grid-cols-1 gap-2 md:gap-0 md:space-y-2">
                <div>
                  <div className="text-xl font-semibold text-white">{snapshot.totals.jobs.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500">postings</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-white">{snapshot.totals.keywords}</div>
                  <div className="text-[10px] text-slate-500">keywords</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-white">{snapshot.totals.edges.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500">edges</div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter keywords…"
                className="w-full pl-8 pr-2 py-1.5 bg-black/40 border border-white/10 rounded text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div className="p-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 px-2">Keywords</div>
            <div className="space-y-0.5">
              {filteredKeywords.map((kw) => {
                const isSelected = selected === kw.keyword
                return (
                  <button
                    key={kw.keyword}
                    onClick={() => setSelected(isSelected ? null : kw.keyword)}
                    onMouseEnter={() => setHovered(kw.keyword)}
                    onMouseLeave={() => setHovered(null)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${
                      isSelected
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="font-mono">{kw.keyword}</span>
                    <span className="text-[10px] text-slate-600">{kw.count.toLocaleString()}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Center: graph canvas */}
        <div ref={containerRef} className="flex-1 relative bg-black/20 overflow-hidden min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
              Loading graph snapshot…
            </div>
          )}

          {snapshot && (
            <svg
              width={size.w}
              height={size.h}
              viewBox={`0 0 ${size.w} ${size.h}`}
              className="block touch-none"
              style={{ touchAction: "none" }}
            >
              {/* Edges first (behind nodes) */}
              {snapshot.keywordEdges.map((e, i) => {
                const a = e.source.replace(/^kw:/, "")
                const b = e.target.replace(/^kw:/, "")
                const pa = positions[a]
                const pb = positions[b]
                if (!pa || !pb) return null
                const isHighlighted = highlightedEdges.has(`${a}-${b}`) || highlightedEdges.has(`${b}-${a}`)
                const opacity = focus ? (isHighlighted ? 0.7 : 0.05) : Math.min(0.35, e.weight / 5000 + 0.08)
                return (
                  <line
                    key={i}
                    x1={pa.x} y1={pa.y}
                    x2={pb.x} y2={pb.y}
                    stroke={isHighlighted ? "#fff" : "#aaa"}
                    strokeWidth={isHighlighted ? 1.5 : 0.5}
                    opacity={opacity}
                  />
                )
              })}

              {/* Nodes */}
              {snapshot.keywords.map((kw) => {
                const p = positions[kw.keyword]
                if (!p) return null
                const isSelected = selected === kw.keyword
                const isHovered = hovered === kw.keyword
                const isDim = focus && !highlightedNodes.has(kw.keyword)
                const opacity = isDim ? 0.25 : 1
                return (
                  <g
                    key={kw.keyword}
                    onClick={() => setSelected(isSelected ? null : kw.keyword)}
                    onMouseEnter={() => setHovered(kw.keyword)}
                    onMouseLeave={() => setHovered(null)}
                    onTouchStart={() => setHovered(kw.keyword)}
                    style={{ cursor: "pointer", opacity, transition: "opacity 0.15s ease" }}
                  >
                    <circle
                      cx={p.x} cy={p.y} r={p.r}
                      fill={isSelected ? "rgba(255,255,255,0.2)" : isHovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)"}
                      stroke={isSelected || isHovered ? "#fff" : "rgba(255,255,255,0.3)"}
                      strokeWidth={isSelected ? 2 : 1}
                      style={isSelected ? { filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))" } : {}}
                    />
                    <text
                      x={p.x} y={p.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isSelected || isHovered ? "#fff" : "#bbb"}
                      fontSize={Math.max(9, Math.min(13, p.r * 0.45))}
                      fontFamily="ui-monospace, monospace"
                      style={{ pointerEvents: "none", userSelect: "none" }}
                    >
                      {kw.keyword}
                    </text>
                  </g>
                )
              })}
            </svg>
          )}

          {/* Hint overlay */}
          {!selected && !loading && (
            <div className="absolute bottom-3 left-3 right-3 md:right-auto md:max-w-md text-[10px] md:text-xs text-slate-500 font-mono leading-relaxed pointer-events-none">
              Tap a keyword to see connected keywords + sample postings.
              Edge thickness reflects co-occurrence weight across 21k+ scraped JDs.
            </div>
          )}
        </div>

        {/* Right: selected-keyword detail */}
        {selected && (
          <aside className="w-full md:w-80 md:flex-shrink-0 border-t md:border-t-0 md:border-l border-white/10 overflow-auto bg-card/30 max-h-[45vh] md:max-h-full">
            <div className="p-4 border-b border-white/10 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Keyword</div>
                <div className="text-xl font-semibold text-white font-mono truncate">{selected}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {snapshot?.keywords.find((k) => k.keyword === selected)?.count.toLocaleString() ?? "?"} postings mention this
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="flex-shrink-0 text-slate-500 hover:text-white text-lg leading-none p-1"
                aria-label="Clear"
              >
                ×
              </button>
            </div>

            <div className="p-4 border-b border-white/10">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                Co-occurs with
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from(highlightedNodes)
                  .filter((k) => k !== selected)
                  .map((k) => (
                    <button
                      key={k}
                      onClick={() => setSelected(k)}
                      className="rounded-md border border-white/15 px-2 py-0.5 text-[11px] font-mono text-slate-300 hover:text-white hover:border-white/30"
                    >
                      {k}
                    </button>
                  ))}
              </div>
            </div>

            <div className="p-4">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-3">
                Sample postings
              </div>
              <div className="space-y-3">
                {selectedJobs.map((j) => (
                  <a
                    key={j.id}
                    href={j.url ?? "#"}
                    target={j.url ? "_blank" : undefined}
                    rel={j.url ? "noopener noreferrer" : undefined}
                    className="block p-3 rounded-lg bg-black/40 border border-white/10 hover:border-white/25 transition-all group"
                  >
                    <div className="text-xs font-semibold text-white mb-1 line-clamp-2">{j.title}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span>{j.company}</span>
                      {j.location && <><span className="text-slate-700">·</span><span className="truncate">{j.location}</span></>}
                    </div>
                    {j.url && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-600 mt-2 group-hover:text-slate-400">
                        <ExternalLink className="h-3 w-3" />
                        open posting
                      </div>
                    )}
                  </a>
                ))}
                {selectedJobs.length === 0 && (
                  <div className="text-xs text-slate-600">(no samples cached for this keyword)</div>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
