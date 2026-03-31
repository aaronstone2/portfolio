"use client"

import { FileText, Download, Briefcase, GraduationCap, Code, Award, MapPin, Calendar } from "lucide-react"
import { useState } from "react"

const experience = [
  {
    id: 1,
    title: "Software Engineer — DevX Team",
    company: "Tulip Interfaces",
    location: "Boston, MA",
    period: "Jan 2026 – Present",
    bullets: [
      "Built load testing infrastructure for full platform using K6 and Ironhorse",
      "Designed data generation system modeled on real customer usage patterns",
      "Rebuilt API client and test suites"
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
      "Built FlowNode — visual DAG automation builder with drag-and-drop nodes",
      "Integrated Jira, Slack, Google Sheets via REST APIs",
      "Managed LTS 15 release lifecycle and documentation system"
    ],
    skills: ["React", "TypeScript", "ReactFlow", "D3.js", "MUI", "Jira API", "Slack API"],
    type: "work"
  },
  {
    id: 3,
    title: "Technical Support Engineer — Senior Escalation",
    company: "Tulip Interfaces",
    location: "Boston, MA",
    period: "Oct 2023 – 2026",
    bullets: [
      "Engineering liaison for $10M–20M+ ARR enterprise customer clusters",
      "Led RCA investigations for Generac, Milwaukee Tool, DMG Mori, Tiffany & Co.",
      "Reduced churn risk during company growth from $20M to $70M ARR"
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
      "Team grew from 3 to 8 engineers",
      "Promoted to highest escalation tier"
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
      "3D visual programming language and creative marketplace",
      "Authored 78-page Honors Thesis at Brandeis University",
      "Lead product vision, design system, and technical architecture"
    ],
    skills: ["3D Graphics", "Visual Programming", "Product Design"],
    type: "work"
  },
]

const education = [
  {
    id: 6,
    title: "B.S. Computer Science",
    company: "Brandeis University",
    location: "Waltham, MA",
    period: "2017 – 2021",
    bullets: [
      "Honors Thesis: \"Bubble: An Interface for Programming in 3D Virtual Reality Environments\"",
      "Advisors: Harry Mairson, Timothy Hickey, Antonella Di Lillo",
      "SAT: 2300 (99th percentile)"
    ],
    skills: ["Computer Science", "Honors Thesis", "VR/3D Programming"],
    type: "education"
  }
]

const skills = {
  languages: ["TypeScript", "JavaScript", "Python", "SQL", "mongosh"],
  frontend: ["React", "Next.js", "ReactFlow", "D3.js", "MUI", "Tailwind CSS"],
  backend: ["Node.js", "REST APIs", "Jira API", "Slack API", "Google Sheets API"],
  infrastructure: ["K6", "Ironhorse", "Docker", "CI/CD", "Load Testing"],
  databases: ["MongoDB", "PostgreSQL", "Loki"],
}

export default function ResumePage() {
  const [activeSection, setActiveSection] = useState<"experience" | "skills">("experience")
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-secondary/10 p-2 neon-border-purple">
            <FileText className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Interactive Resume
            </h1>
            <p className="text-sm text-muted-foreground">
              Aaron Stone - Software Engineer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
          <a
            href="/resume.pdf"
            download
            className="flex items-center gap-2 rounded-lg bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary/20 neon-border-purple"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeSection === "experience" ? (
          <div className="mx-auto max-w-4xl">
            {/* Work Experience */}
            <div className="mb-8">
              <div className="mb-6 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Work Experience</h2>
              </div>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent" />
                
                <div className="space-y-6">
                  {experience.map((item) => (
                    <div
                      key={item.id}
                      className={`relative pl-16 transition-all duration-300 ${
                        hoveredItem === item.id ? "scale-[1.02]" : ""
                      }`}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {/* Timeline dot */}
                      <div className={`absolute left-4 top-2 h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                        hoveredItem === item.id 
                          ? "border-primary bg-primary shadow-[0_0_15px_rgba(59,130,246,0.8)]" 
                          : "border-primary/50 bg-background"
                      }`} />
                      
                      <div className={`rounded-lg border bg-card/50 p-5 transition-all duration-300 ${
                        hoveredItem === item.id 
                          ? "border-primary/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]" 
                          : "border-border"
                      }`}>
                        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                            <p className="text-primary">{item.company}</p>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {item.period}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {item.location}
                            </div>
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
                            <span
                              key={skill}
                              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="mb-6 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-secondary" />
                <h2 className="text-lg font-semibold text-foreground">Education</h2>
              </div>
              
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-secondary to-transparent" />
                
                {education.map((item) => (
                  <div
                    key={item.id}
                    className={`relative pl-16 transition-all duration-300 ${
                      hoveredItem === item.id ? "scale-[1.02]" : ""
                    }`}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className={`absolute left-4 top-2 h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                      hoveredItem === item.id 
                        ? "border-secondary bg-secondary shadow-[0_0_15px_rgba(168,85,247,0.8)]" 
                        : "border-secondary/50 bg-background"
                    }`} />
                    
                    <div className={`rounded-lg border bg-card/50 p-5 transition-all duration-300 ${
                      hoveredItem === item.id 
                        ? "border-secondary/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]" 
                        : "border-border"
                    }`}>
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                          <p className="text-secondary">{item.company}</p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.period}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {item.location}
                          </div>
                        </div>
                      </div>
                      
                      <ul className="mb-4 space-y-1 text-sm text-muted-foreground">
                        {item.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary/50" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex flex-wrap gap-2">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary"
                          >
                            {skill}
                          </span>
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
                <div
                  key={category}
                  className="rounded-lg border border-border bg-card/50 p-5 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                >
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent transition-all duration-300 hover:bg-accent/20 hover:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-8">
              <div className="mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Contact</h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-card/50 p-4 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <p className="text-sm font-medium text-foreground">aaron@bubble.graphics</p>
                  <p className="text-xs text-muted-foreground">Email</p>
                </div>
                <div className="rounded-lg border border-border bg-card/50 p-4 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <p className="text-sm font-medium text-foreground">857-231-1060</p>
                  <p className="text-xs text-muted-foreground">Phone</p>
                </div>
                <div className="rounded-lg border border-border bg-card/50 p-4 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <p className="text-sm font-medium text-foreground">NYC Metro</p>
                  <p className="text-xs text-muted-foreground">Location</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
