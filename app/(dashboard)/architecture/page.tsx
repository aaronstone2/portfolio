"use client"

import { Network, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { useState, useRef, useEffect, useCallback } from "react"

interface Node {
  id: string
  label: string
  x: number
  y: number
  type: "frontend" | "backend" | "database" | "service" | "external"
  description: string
}

interface Edge {
  from: string
  to: string
  label?: string
}

const nodes: Node[] = [
  { id: "react", label: "React Frontend", x: 400, y: 80, type: "frontend", description: "Next.js 14 with TypeScript, TailwindCSS, and shadcn/ui components" },
  { id: "api", label: "API Gateway", x: 400, y: 200, type: "backend", description: "Express.js REST API with rate limiting and authentication middleware" },
  { id: "auth", label: "Auth Service", x: 200, y: 280, type: "service", description: "JWT-based authentication with refresh tokens and OAuth2 support" },
  { id: "dag", label: "DAG Engine", x: 400, y: 320, type: "service", description: "Core workflow engine for directed acyclic graph processing" },
  { id: "queue", label: "Task Queue", x: 600, y: 280, type: "service", description: "Redis-based job queue for async task processing" },
  { id: "validator", label: "Validator", x: 250, y: 420, type: "service", description: "JIRA ticket validation and workflow rule enforcement" },
  { id: "executor", label: "Executor", x: 550, y: 420, type: "service", description: "Workflow execution engine with retry logic and error handling" },
  { id: "postgres", label: "PostgreSQL", x: 200, y: 540, type: "database", description: "Primary database for user data, workflows, and configurations" },
  { id: "redis", label: "Redis Cache", x: 400, y: 540, type: "database", description: "In-memory cache for sessions, rate limiting, and real-time data" },
  { id: "s3", label: "S3 Storage", x: 600, y: 540, type: "database", description: "Object storage for workflow exports and large file attachments" },
  { id: "jira", label: "JIRA API", x: 100, y: 350, type: "external", description: "External JIRA integration for ticket sync and validation" },
  { id: "webhook", label: "Webhooks", x: 700, y: 350, type: "external", description: "Outbound webhooks for third-party integrations and notifications" },
]

const edges: Edge[] = [
  { from: "react", to: "api", label: "REST/WebSocket" },
  { from: "api", to: "auth", label: "verify" },
  { from: "api", to: "dag", label: "process" },
  { from: "api", to: "queue", label: "enqueue" },
  { from: "dag", to: "validator" },
  { from: "dag", to: "executor" },
  { from: "queue", to: "executor", label: "jobs" },
  { from: "validator", to: "jira", label: "validate" },
  { from: "validator", to: "postgres" },
  { from: "executor", to: "postgres" },
  { from: "executor", to: "webhook", label: "notify" },
  { from: "auth", to: "postgres" },
  { from: "auth", to: "redis", label: "sessions" },
  { from: "dag", to: "redis", label: "cache" },
  { from: "executor", to: "s3", label: "artifacts" },
]

const nodeColors = {
  frontend: { bg: "bg-primary/20", border: "border-primary", text: "text-primary", glow: "rgba(59, 130, 246, 0.6)" },
  backend: { bg: "bg-secondary/20", border: "border-secondary", text: "text-secondary", glow: "rgba(168, 85, 247, 0.6)" },
  database: { bg: "bg-accent/20", border: "border-accent", text: "text-accent", glow: "rgba(6, 182, 212, 0.6)" },
  service: { bg: "bg-emerald-500/20", border: "border-emerald-500", text: "text-emerald-400", glow: "rgba(16, 185, 129, 0.6)" },
  external: { bg: "bg-amber-500/20", border: "border-amber-500", text: "text-amber-400", glow: "rgba(245, 158, 11, 0.6)" },
}

export default function ArchitecturePage() {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === "svg") {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    }
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-accent/10 p-2 neon-border-cyan">
            <Network className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              FlowNode System Architecture
            </h1>
            <p className="text-sm text-muted-foreground">
              Interactive Node Graph Visualization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
            className="rounded-lg bg-card p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="min-w-[4rem] text-center text-sm text-muted-foreground">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.min(2, z + 0.1))}
            className="rounded-lg bg-card p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={resetView}
            className="ml-2 rounded-lg bg-accent/10 p-2 text-accent transition-colors hover:bg-accent/20 neon-border-cyan"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Graph Container */}
      <div 
        ref={containerRef}
        className="relative flex-1 overflow-hidden bg-background cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        style={{ backgroundImage: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "center" }}
        >
          {/* Edges */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-muted-foreground/50" />
            </marker>
          </defs>
          {edges.map((edge, i) => {
            const from = getNodePosition(edge.from)
            const to = getNodePosition(edge.to)
            const midX = (from.x + to.x) / 2
            const midY = (from.y + to.y) / 2
            const isHighlighted = hoveredNode === edge.from || hoveredNode === edge.to
            
            return (
              <g key={i}>
                <line
                  x1={from.x}
                  y1={from.y + 25}
                  x2={to.x}
                  y2={to.y - 25}
                  stroke={isHighlighted ? "rgba(6, 182, 212, 0.8)" : "rgba(100, 116, 139, 0.3)"}
                  strokeWidth={isHighlighted ? 2 : 1}
                  markerEnd="url(#arrowhead)"
                  className="transition-all duration-300"
                />
                {edge.label && (
                  <text
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    className={`fill-current text-[10px] font-mono transition-all duration-300 ${isHighlighted ? "text-accent" : "text-muted-foreground/50"}`}
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Nodes */}
        <div
          className="absolute inset-0"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "center" }}
        >
          {nodes.map((node) => {
            const colors = nodeColors[node.type]
            const isHovered = hoveredNode === node.id
            const isSelected = selectedNode?.id === node.id
            
            return (
              <div
                key={node.id}
                className={`absolute flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 px-4 py-2 transition-all duration-300 ${colors.bg} ${colors.border} ${colors.text}`}
                style={{
                  left: node.x - 60,
                  top: node.y - 20,
                  width: 120,
                  boxShadow: isHovered || isSelected ? `0 0 20px ${colors.glow}` : "none",
                  transform: isHovered ? "scale(1.1)" : "scale(1)",
                  zIndex: isHovered ? 10 : 1,
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(isSelected ? null : node)}
              >
                <span className="text-center text-xs font-semibold leading-tight">{node.label}</span>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 rounded-lg border border-border bg-card/90 p-4 backdrop-blur-sm">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Legend</h3>
          <div className="space-y-2">
            {Object.entries(nodeColors).map(([type, colors]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded border ${colors.bg} ${colors.border}`} />
                <span className="text-xs capitalize text-muted-foreground">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Node Details Panel */}
        {selectedNode && (
          <div className="absolute right-4 top-4 w-80 rounded-lg border border-border bg-card/95 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${nodeColors[selectedNode.type].text}`}>
                  {selectedNode.label}
                </h3>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {selectedNode.type}
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                x
              </button>
            </div>
            <p className="text-sm text-muted-foreground">{selectedNode.description}</p>
            
            <div className="mt-4 border-t border-border pt-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Connections</h4>
              <div className="space-y-1">
                {edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).map((edge, i) => {
                  const connectedId = edge.from === selectedNode.id ? edge.to : edge.from
                  const connectedNode = nodes.find(n => n.id === connectedId)
                  const direction = edge.from === selectedNode.id ? "to" : "from"
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="text-accent">{direction === "to" ? "→" : "←"}</span>
                      <span>{connectedNode?.label}</span>
                      {edge.label && <span className="text-muted-foreground/50">({edge.label})</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
