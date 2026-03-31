"use client"

import { Network, ZoomIn, ZoomOut, Maximize2, LayoutGrid, GitBranch } from "lucide-react"
import { useState, useRef, useEffect, useCallback } from "react"

type ViewMode = "website" | "graph"

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
  { id: "react", label: "React + ReactFlow", x: 400, y: 80, type: "frontend", description: "Vite + React 18 with TypeScript, ReactFlow for node graph canvas, MUI components, D3.js for data viz" },
  { id: "api", label: "Node.js Backend", x: 400, y: 200, type: "backend", description: "Express.js REST API with TypeScript, handles workflow orchestration and external service integration" },
  { id: "dag", label: "DAG Engine", x: 400, y: 320, type: "service", description: "Core workflow engine: processes directed acyclic graphs, manages node execution order and data flow between 20+ node types" },
  { id: "scheduler", label: "Scheduler", x: 200, y: 280, type: "service", description: "Cron-based scheduling service for recurring workflow execution and LTS release management" },
  { id: "queue", label: "Task Queue", x: 600, y: 280, type: "service", description: "Async task processing for workflow execution, API polling, and batch operations" },
  { id: "validator", label: "Validator", x: 250, y: 420, type: "service", description: "Workflow validation: schema checking, node type verification, cycle detection in DAG structures" },
  { id: "executor", label: "Executor", x: 550, y: 420, type: "service", description: "Node execution engine: runs HTTP requests, functions, templates, switches with retry logic and error handling" },
  { id: "config", label: "Config Store", x: 200, y: 540, type: "database", description: "YAML/JSON configuration for workflows, release configs, validation rules, and node templates" },
  { id: "sheets", label: "Google Sheets", x: 400, y: 540, type: "database", description: "Data source and output for workflow results, sprint tracking, and release documentation" },
  { id: "jira", label: "Jira API", x: 100, y: 350, type: "external", description: "Jira Cloud REST API integration: ticket queries (JQL), status tracking, sprint management, bulk operations" },
  { id: "slack", label: "Slack API", x: 700, y: 350, type: "external", description: "Slack Web API + Webhooks: automated notifications, channel messages, workflow status alerts" },
  { id: "vercel", label: "Vercel", x: 600, y: 540, type: "external", description: "Deployment platform: auto-deploy from GitHub, serves static React frontend with SPA routing" },
]

const edges: Edge[] = [
  { from: "react", to: "api", label: "REST" },
  { from: "api", to: "dag", label: "process" },
  { from: "api", to: "queue", label: "enqueue" },
  { from: "api", to: "scheduler", label: "cron" },
  { from: "dag", to: "validator" },
  { from: "dag", to: "executor" },
  { from: "queue", to: "executor", label: "jobs" },
  { from: "validator", to: "jira", label: "JQL" },
  { from: "validator", to: "config" },
  { from: "executor", to: "jira", label: "query" },
  { from: "executor", to: "slack", label: "notify" },
  { from: "executor", to: "sheets", label: "read/write" },
  { from: "scheduler", to: "queue", label: "trigger" },
  { from: "react", to: "vercel", label: "deploy" },
  { from: "dag", to: "config", label: "load" },
]

const nodeColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  frontend: { bg: "bg-primary/20", border: "border-primary", text: "text-primary", glow: "rgba(59, 130, 246, 0.6)" },
  backend: { bg: "bg-secondary/20", border: "border-secondary", text: "text-secondary", glow: "rgba(168, 85, 247, 0.6)" },
  database: { bg: "bg-accent/20", border: "border-accent", text: "text-accent", glow: "rgba(6, 182, 212, 0.6)" },
  service: { bg: "bg-emerald-500/20", border: "border-emerald-500", text: "text-emerald-400", glow: "rgba(16, 185, 129, 0.6)" },
  external: { bg: "bg-amber-500/20", border: "border-amber-500", text: "text-amber-400", glow: "rgba(245, 158, 11, 0.6)" },
}

function ArchitectureCanvas() {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [clickedNode, setClickedNode] = useState<string | null>(null)
  const [nodePositions, setNodePositions] = useState<Record<string, {x: number, y: number}>>(
    Object.fromEntries(nodes.map(n => [n.id, { x: n.x, y: n.y }]))
  )
  const [draggingNode, setDraggingNode] = useState<string | null>(null)
  const [nodeDragStart, setNodeDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-node]')) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation()
    const pos = nodePositions[nodeId]
    setDraggingNode(nodeId)
    setNodeDragStart({ x: e.clientX / zoom - pos.x, y: e.clientY / zoom - pos.y })
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (draggingNode) {
      setNodePositions(prev => ({
        ...prev,
        [draggingNode]: {
          x: e.clientX / zoom - nodeDragStart.x,
          y: e.clientY / zoom - nodeDragStart.y,
        }
      }))
    } else if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    }
  }, [isDragging, dragStart, draggingNode, nodeDragStart, zoom])

  const handleMouseUp = useCallback(() => {
    if (draggingNode) {
      setDraggingNode(null)
    }
    setIsDragging(false)
  }, [draggingNode])

  const handleNodeClick = (node: Node) => {
    if (draggingNode) return
    // Bulge effect
    setClickedNode(node.id)
    setTimeout(() => setClickedNode(null), 300)
    // Toggle selection
    setSelectedNode(prev => prev?.id === node.id ? null : node)
  }

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
    setNodePositions(Object.fromEntries(nodes.map(n => [n.id, { x: n.x, y: n.y }])))
  }

  const getNodePosition = (nodeId: string) => {
    return nodePositions[nodeId] || { x: 0, y: 0 }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Zoom Controls */}
      <div className="flex items-center justify-end gap-2 border-b border-border bg-card/50 px-4 py-2">
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
                  stroke={isHighlighted ? "rgba(255, 255, 255, 0.6)" : "rgba(100, 116, 139, 0.3)"}
                  strokeWidth={isHighlighted ? 2 : 1}
                  markerEnd="url(#arrowhead)"
                  className="transition-all duration-300"
                />
                {edge.label && (
                  <text
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    className={`fill-current text-[10px] font-mono transition-all duration-300 ${isHighlighted ? "text-white" : "text-muted-foreground/50"}`}
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
            const pos = nodePositions[node.id] || { x: node.x, y: node.y }
            const isHovered = hoveredNode === node.id
            const isSelected = selectedNode?.id === node.id
            const isClicked = clickedNode === node.id
            const isDragged = draggingNode === node.id
            
            let scale = 1
            if (isClicked) scale = 1.35
            else if (isDragged) scale = 1.15
            else if (isHovered) scale = 1.1

            return (
              <div
                key={node.id}
                data-node
                className={`absolute flex cursor-grab active:cursor-grabbing flex-col items-center justify-center rounded-lg border-2 px-4 py-2 ${colors.bg} ${colors.border} ${colors.text}`}
                style={{
                  left: pos.x - 60,
                  top: pos.y - 20,
                  width: 120,
                  boxShadow: isClicked
                    ? `0 0 40px rgba(255,255,255,0.5), 0 0 80px ${colors.glow}`
                    : isHovered || isSelected ? `0 0 20px ${colors.glow}` : "none",
                  transform: `scale(${scale})`,
                  transition: isDragged ? 'none' : 'all 0.3s',
                  zIndex: isDragged ? 100 : isHovered || isClicked ? 10 : 1,
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                onClick={() => handleNodeClick(node)}
              >
                <span className="text-center text-xs font-semibold leading-tight select-none">{node.label}</span>
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

export default function ArchitecturePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("website")

  const viewModes = [
    { id: "website" as ViewMode, label: "Interactive", icon: LayoutGrid },
    { id: "graph" as ViewMode, label: "Node Graph", icon: GitBranch },
  ]

  if (viewMode === "website") {
    return (
      <div className="flex h-screen flex-col overflow-hidden">
        {/* Tab bar overlaid on the existing header area */}
        <div className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-2 neon-border-cyan">
              <Network className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">FlowNode System Architecture</h1>
              <p className="text-sm text-muted-foreground">Interactive Node Graph Visualization</p>
            </div>
          </div>
          <div className="flex items-center rounded-lg border border-border bg-card p-1">
            {viewModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  viewMode === mode.id ? "bg-accent/20 text-accent shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <mode.icon className="h-3.5 w-3.5" />
                {mode.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ArchitectureCanvas />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-accent/10 p-2 neon-border-cyan">
            <Network className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">FlowNode System Architecture</h1>
            <p className="text-sm text-muted-foreground">Interactive Node Graph Visualization</p>
          </div>
        </div>
        <div className="flex items-center rounded-lg border border-border bg-card p-1">
          {viewModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === mode.id ? "bg-accent/20 text-accent shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <mode.icon className="h-3.5 w-3.5" />
              {mode.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative flex-1">
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-accent/20 border-t-accent mx-auto" />
            <p className="text-sm text-muted-foreground font-mono">Loading Architecture Graph...</p>
          </div>
        </div>
        <iframe
          src="https://flownode-ui-react.vercel.app/architecture"
          className="relative z-10 h-full w-full border-0"
          title="Architecture Node Graph"
        />
      </div>
    </div>
  )
}
