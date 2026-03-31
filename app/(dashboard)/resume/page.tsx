"use client"

import { FileText, Download, Briefcase, GraduationCap, Code, Award, MapPin, Calendar, LayoutGrid, FileDown, GitBranch, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"

type ViewMode = "website" | "document" | "graph"

const experience = [
  {
    id: 1,
    title: "Software Engineer — DevX Team",
    company: "Tulip Interfaces",
    location: "Boston, MA",
    period: "Jan 2026 – Present",
    bullets: [
      "Architected load testing infrastructure using K6 and Ironhorse frameworks for full product coverage",
      "Built synthetic data generation pipelines modeling real customer usage patterns across enterprise deployments",
      "Rebuilt API client libraries and comprehensive test suites, improving developer velocity and test reliability"
    ],
    skills: ["JavaScript", "TypeScript", "K6", "Node.js"],
    type: "work"
  },
  {
    id: 2,
    title: "TPM / Software Engineer",
    company: "Tulip Interfaces",
    location: "Boston, MA",
    period: "Jul – Dec 2025",
    bullets: [
      "Built FlowNode: visual DAG automation builder with 20+ custom node types (React, ReactFlow, TypeScript)",
      "Integrated Jira, Slack, and Google Sheets APIs for cross-platform workflow orchestration",
      "Managed LTS 15 release cycle: coordinated 6 engineering teams across 200+ Jira tickets"
    ],
    skills: ["React", "TypeScript", "ReactFlow", "D3.js", "MUI", "Jira API", "Slack API"],
    type: "work"
  },
  {
    id: 3,
    title: "Senior Escalation Engineer",
    company: "Tulip Interfaces",
    location: "Boston, MA",
    period: "Oct 2023 – Dec 2025",
    bullets: [
      "Managed $10M–20M+ ARR enterprise accounts: Generac, Milwaukee Tool, DMG Mori, Tiffany & Co.",
      "Primary engineering liaison bridging Customer Success and Engineering organizations (50+ engineers)",
      "Drove proactive issue resolution across $70M ARR customer base, directly reducing enterprise churn"
    ],
    skills: ["MongoDB", "JavaScript", "mongosh", "Loki", "debugging"],
    type: "work"
  },
  {
    id: 4,
    title: "Customer Support Engineer I → II",
    company: "Tulip Interfaces",
    location: "Boston, MA",
    period: "Nov 2021 – Oct 2023",
    bullets: [
      "Scaled support engineering team from 3 to 8 engineers while maintaining response quality",
      "Resolved complex application logic, connector integration, and performance issues",
      "Promoted through 3 tiers to highest escalation level within 2 years"
    ],
    skills: ["Zendesk", "Jira", "Technical Troubleshooting"],
    type: "work"
  },
  {
    id: 5,
    title: "Founder & CEO — Head of Product & Design",
    company: "Bubble Holographic Systems",
    location: "Remote",
    period: "2017 – Present",
    bullets: [
      "Designing 3D visual programming language with recursive namespace system (Bubbles, Slots, Wave Graphs)",
      "Authored 78-page Honors Thesis at Brandeis University on VR programming interfaces",
      "Building premium 3D creative marketplace with visual code library (Biblo Codebase)",
      "Managing engineering partner on compiler and runtime implementation"
    ],
    skills: ["3D Graphics", "Visual Programming", "Product Design"],
    type: "work"
  },
]

const education = [
  {
    id: 6,
    title: "BA, Computer Science — Honors Thesis",
    company: "Brandeis University",
    location: "Waltham, MA",
    period: "2017 – 2021",
    bullets: [
      "Thesis: \"Bubble: An Interface for Programming in 3D Virtual Reality Environments\"",
      "Advisors: Harry Mairson, Timothy Hickey, Antonella Di Lillo",
    ],
    skills: ["Computer Science", "Honors Thesis", "VR/3D Programming"],
    type: "education"
  }
]

const skills = {
  languages: ["TypeScript", "JavaScript", "Python", "SQL", "mongosh"],
  frontend: ["React", "Next.js", "ReactFlow", "D3.js", "MUI", "Tailwind CSS"],
  backend: ["Node.js", "REST APIs", "Jira API", "Slack API", "Google Sheets API", "GraphQL"],
  infrastructure: ["K6", "Ironhorse", "Docker", "CI/CD", "Vite", "Vercel"],
  databases: ["MongoDB", "PostgreSQL", "EdgeDB", "Redis"],
}

function WebsiteView() {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const allItems = [...experience, ...education]
  const selected = allItems.find(i => i.id === selectedItem)

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-card]')) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    }
    const handleMouseUp = () => setIsDragging(false)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => { window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseup", handleMouseUp) }
  }, [isDragging, dragStart])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setZoom(z => Math.max(0.3, Math.min(2, z - e.deltaY * 0.001)))
  }

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  // Timeline layout: education first (leftmost), then experience in reverse chronological
  const timelineItems = [...education, ...experience.slice().reverse()]
  const cardWidth = 340
  const cardGap = 40
  const timelineY = 180

  const roleColors: Record<number, string> = {
    1: '#3b82f6', 2: '#a855f7', 3: '#22c55e', 4: '#06b6d4', 5: '#ec4899', 6: '#8b5cf6',
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `@keyframes dotPulse { 0%, 100% { box-shadow: 0 0 25px rgba(255,255,255,0.5); } 50% { box-shadow: 0 0 45px rgba(255,255,255,0.8), 0 0 80px rgba(255,255,255,0.3); } }` }} />
      {/* Zoom controls */}
      <div className="flex items-center justify-between border-b border-border bg-card/50 px-4 py-2">
        <div className="flex items-center gap-3">
          <Briefcase className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground font-mono">Career Timeline</span>
          <span className="text-xs text-muted-foreground">— drag to pan, scroll to zoom</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="rounded-lg bg-card p-1.5 text-muted-foreground hover:text-foreground"><ZoomOut className="h-4 w-4" /></button>
          <span className="min-w-[3rem] text-center text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="rounded-lg bg-card p-1.5 text-muted-foreground hover:text-foreground"><ZoomIn className="h-4 w-4" /></button>
          <button onClick={resetView} className="rounded-lg bg-accent/10 p-1.5 text-accent hover:bg-accent/20 neon-border-cyan"><Maximize2 className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Pannable/zoomable canvas */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        style={{ backgroundImage: "radial-gradient(circle, rgba(59,130,246,0.08) 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {/* Horizontal timeline line */}
          <div
            style={{
              position: "absolute",
              top: timelineY + 12,
              left: 40,
              width: timelineItems.length * (cardWidth + cardGap) - cardGap + 40,
              height: 2,
              background: "linear-gradient(90deg, rgba(168,85,247,0.6), rgba(59,130,246,0.6), rgba(6,182,212,0.6))",
            }}
          />

          {/* Year markers */}
          {timelineItems.map((item, i) => {
            const x = 60 + i * (cardWidth + cardGap)
            const year = item.period.split("–")[0].trim().split(" ").pop() || ""
            return (
              <div key={`year-${i}`} style={{ position: "absolute", left: x + cardWidth / 2 - 20, top: timelineY - 20 }}>
                <span className="text-xs font-mono text-muted-foreground">{year}</span>
              </div>
            )
          })}

          {/* Cards */}
          {timelineItems.map((item, i) => {
            const x = 60 + i * (cardWidth + cardGap)
            const isAbove = i % 2 === 0
            const cardY = isAbove ? timelineY - 260 : timelineY + 40
            const color = roleColors[item.id] || '#3b82f6'
            const isHovered = hoveredItem === item.id
            const isSelected = selectedItem === item.id

            return (
              <div key={item.id}>
                {/* Connector line from timeline to card */}
                <div
                  style={{
                    position: "absolute",
                    left: x + cardWidth / 2,
                    top: isAbove ? cardY + 230 : timelineY + 14,
                    width: 2,
                    height: isAbove ? timelineY - cardY - 230 + 10 : cardY - timelineY - 14,
                    background: color,
                    opacity: isHovered || isSelected ? 1 : 0.3,
                    transition: "opacity 0.3s",
                  }}
                />

                {/* Timeline dot */}
                <div
                  style={{
                    position: "absolute",
                    left: x + cardWidth / 2 - 10,
                    top: timelineY + 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `3px solid ${isHovered || isSelected ? 'white' : color}`,
                    background: isHovered || isSelected ? 'white' : "var(--background, #0a0a1a)",
                    boxShadow: isHovered || isSelected ? `0 0 25px rgba(255,255,255,0.5), 0 0 50px ${color}66` : "none",
                    transition: "all 0.3s",
                    zIndex: 5,
                    animation: isHovered || isSelected ? 'dotPulse 1.5s ease-in-out infinite' : 'none',
                  }}
                />

                {/* Card */}
                <div
                  data-card
                  style={{
                    position: "absolute",
                    left: x,
                    top: cardY,
                    width: cardWidth,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    transform: isHovered ? "scale(1.15)" : "scale(1)",
                    zIndex: isHovered || isSelected ? 10 : 1,
                  }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => setSelectedItem(isSelected ? null : item.id)}
                >
                  <div
                    className="rounded-lg border bg-card/90 backdrop-blur-sm p-4"
                    style={{
                      borderColor: isHovered || isSelected ? color : "var(--border, rgba(255,255,255,0.1))",
                      boxShadow: isHovered || isSelected ? `0 0 25px ${color}33` : "none",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {item.type === "education" ? (
                        <GraduationCap className="h-4 w-4 flex-shrink-0" style={{ color }} />
                      ) : (
                        <Briefcase className="h-4 w-4 flex-shrink-0" style={{ color }} />
                      )}
                      <span className="text-xs font-mono" style={{ color }}>{item.period}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground leading-tight">{item.title}</h3>
                    <p className="text-xs mt-1" style={{ color }}>{item.company}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />{item.location}
                    </div>

                    {(isSelected || isHovered) && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <ul className="space-y-1">
                          {item.bullets.slice(0, isSelected ? undefined : 2).map((bullet, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                              <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full" style={{ background: color }} />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.skills.slice(0, isSelected ? undefined : 4).map((skill) => (
                            <span key={skill} className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: `${color}15`, color }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Skills section at the end */}
          <div
            data-card
            style={{
              position: "absolute",
              left: 60 + timelineItems.length * (cardWidth + cardGap),
              top: timelineY - 140,
              width: 400,
            }}
          >
            <div className="rounded-lg border border-accent/30 bg-card/90 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Code className="h-5 w-5 text-accent" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">Technical Skills</h2>
              </div>
              {Object.entries(skills).map(([category, items]) => (
                <div key={category} className="mb-3">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-1.5 capitalize">{category}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((skill) => (
                      <span key={skill} className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-3 border-t border-border grid grid-cols-3 gap-2">
                {[
                  { value: "aaron@bubble.graphics", label: "Email" },
                  { value: "857-231-1060", label: "Phone" },
                  { value: "NYC Metro", label: "Location" },
                ].map((c) => (
                  <div key={c.label} className="text-center">
                    <p className="text-[10px] font-medium text-foreground">{c.value}</p>
                    <p className="text-[9px] text-muted-foreground">{c.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResumePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("website")

  const viewModes = [
    { id: "website" as ViewMode, label: "Website", icon: LayoutGrid },
    { id: "document" as ViewMode, label: "Document", icon: FileDown },
    { id: "graph" as ViewMode, label: "Node Graph", icon: GitBranch },
  ]

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-secondary/10 p-2 neon-border-purple">
            <FileText className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Interactive Resume</h1>
            <p className="text-sm text-muted-foreground">Aaron Stone - Software Engineer</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Tabs */}
          <div className="flex items-center rounded-lg border border-border bg-card p-1">
            {viewModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  viewMode === mode.id
                    ? "bg-secondary/20 text-secondary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <mode.icon className="h-3.5 w-3.5" />
                {mode.label}
              </button>
            ))}
          </div>

          <a
            href="/AaronStone_Resume.pdf"
            download
            className="flex items-center gap-2 rounded-lg bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary/20 neon-border-purple"
          >
            <Download className="h-4 w-4" />
            PDF
          </a>
        </div>
      </header>

      {/* Content */}
      {viewMode === "website" && <WebsiteView />}

      {viewMode === "document" && (
        <div className="flex-1 bg-background">
          <iframe
            src="/Aaron_Stone_Resume.html"
            className="h-full w-full border-0"
            title="Resume Document"
          />
        </div>
      )}

      {viewMode === "graph" && (
        <div className="relative flex-1">
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary mx-auto" />
              <p className="text-sm text-muted-foreground font-mono">Loading Resume Graph...</p>
            </div>
          </div>
          <iframe
            src="https://flownode-ui-react.vercel.app/resume"
            className="relative z-10 h-full w-full border-0"
            title="Resume Node Graph"
          />
        </div>
      )}
    </div>
  )
}
