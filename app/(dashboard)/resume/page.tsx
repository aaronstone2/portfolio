"use client"

import { FileText, Download, Briefcase, GraduationCap, Code, Award, MapPin, Calendar, LayoutGrid, FileDown, GitBranch } from "lucide-react"
import { useState } from "react"

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
  const [activeSection, setActiveSection] = useState<"experience" | "skills">("experience")
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => setActiveSection("experience")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeSection === "experience"
              ? "bg-secondary/20 text-secondary neon-border-purple"
              : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Experience
        </button>
        <button
          onClick={() => setActiveSection("skills")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeSection === "skills"
              ? "bg-secondary/20 text-secondary neon-border-purple"
              : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Skills
        </button>
      </div>

      {activeSection === "experience" ? (
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="mb-6 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Work Experience</h2>
            </div>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent" />
              <div className="space-y-6">
                {experience.map((item) => (
                  <div
                    key={item.id}
                    className={`relative pl-16 transition-all duration-300 ${hoveredItem === item.id ? "scale-[1.02]" : ""}`}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className={`absolute left-4 top-2 h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                      hoveredItem === item.id ? "border-primary bg-primary shadow-[0_0_15px_rgba(59,130,246,0.8)]" : "border-primary/50 bg-background"
                    }`} />
                    <div className={`rounded-lg border bg-card/50 p-5 transition-all duration-300 ${
                      hoveredItem === item.id ? "border-primary/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "border-border"
                    }`}>
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                          <p className="text-primary">{item.company}</p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{item.period}</div>
                          <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</div>
                        </div>
                      </div>
                      <ul className="mb-4 space-y-1 text-sm text-muted-foreground">
                        {item.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/50" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {item.skills.map((skill) => (
                          <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-semibold text-foreground">Education</h2>
            </div>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-secondary to-transparent" />
              {education.map((item) => (
                <div key={item.id} className={`relative pl-16 transition-all duration-300 ${hoveredItem === item.id ? "scale-[1.02]" : ""}`}
                  onMouseEnter={() => setHoveredItem(item.id)} onMouseLeave={() => setHoveredItem(null)}>
                  <div className={`absolute left-4 top-2 h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                    hoveredItem === item.id ? "border-secondary bg-secondary shadow-[0_0_15px_rgba(168,85,247,0.8)]" : "border-secondary/50 bg-background"
                  }`} />
                  <div className={`rounded-lg border bg-card/50 p-5 transition-all duration-300 ${
                    hoveredItem === item.id ? "border-secondary/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]" : "border-border"
                  }`}>
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                        <p className="text-secondary">{item.company}</p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{item.period}</div>
                        <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</div>
                      </div>
                    </div>
                    <ul className="mb-4 space-y-1 text-sm text-muted-foreground">
                      {item.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary/50" />{bullet}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill) => (
                        <span key={skill} className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center gap-2">
            <Code className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Technical Skills</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="rounded-lg border border-border bg-card/50 p-5 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span key={skill} className="rounded-full bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent transition-all duration-300 hover:bg-accent/20">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <div className="mb-6 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { value: "aaron@bubble.graphics", label: "Email" },
                { value: "857-231-1060", label: "Phone" },
                { value: "NYC Metro", label: "Location" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-card/50 p-4 text-center transition-all duration-300 hover:border-primary/50">
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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
