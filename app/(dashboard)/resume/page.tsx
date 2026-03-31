"use client"

import { FileText, Download, Briefcase, GraduationCap, Code, Award, MapPin, Calendar } from "lucide-react"
import { useState } from "react"

const experience = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Bubble Holographic Systems",
    location: "New York, NY",
    period: "2022 - Present",
    description: "Leading development of holographic display systems and real-time 3D rendering pipelines. Building distributed systems for high-performance graphics processing.",
    skills: ["React", "TypeScript", "WebGL", "Node.js", "AWS", "GraphQL"],
    type: "work"
  },
  {
    id: 2,
    title: "Software Engineer",
    company: "FinTech Startup",
    location: "Boston, MA",
    period: "2020 - 2022",
    description: "Developed trading algorithms and real-time data visualization dashboards. Built microservices architecture handling millions of transactions daily.",
    skills: ["Python", "React", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
    type: "work"
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "Tech Agency",
    location: "Remote",
    period: "2018 - 2020",
    description: "Built custom web applications for enterprise clients. Specialized in complex data workflows and API integrations.",
    skills: ["JavaScript", "Vue.js", "Node.js", "MongoDB", "REST APIs"],
    type: "work"
  },
]

const education = [
  {
    id: 4,
    title: "B.S. Computer Science",
    company: "Massachusetts Institute of Technology",
    location: "Cambridge, MA",
    period: "2014 - 2018",
    description: "Focus on distributed systems, algorithms, and computer graphics. Dean's List, Senior thesis on real-time rendering optimization.",
    skills: ["Algorithms", "Data Structures", "Computer Graphics", "Distributed Systems"],
    type: "education"
  }
]

const skills = {
  languages: ["TypeScript", "JavaScript", "Python", "Go", "Rust", "SQL"],
  frontend: ["React", "Next.js", "Vue.js", "WebGL", "Three.js", "Tailwind CSS"],
  backend: ["Node.js", "Express", "FastAPI", "GraphQL", "REST APIs"],
  infrastructure: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
  databases: ["PostgreSQL", "MongoDB", "Redis", "DynamoDB"],
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
                  {experience.map((item, index) => (
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
                        
                        <p className="mb-4 text-sm text-muted-foreground">{item.description}</p>
                        
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
                      
                      <p className="mb-4 text-sm text-muted-foreground">{item.description}</p>
                      
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

            {/* Certifications */}
            <div className="mt-8">
              <div className="mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Certifications</h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  "AWS Solutions Architect",
                  "Kubernetes Administrator",
                  "GraphQL Certified Developer"
                ].map((cert) => (
                  <div
                    key={cert}
                    className="rounded-lg border border-border bg-card/50 p-4 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                  >
                    <Award className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <p className="text-sm font-medium text-foreground">{cert}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
