import { ExternalLink, Github } from "lucide-react"
import { PageHeader } from "@/components/page-header"

const projects = [
  {
    title: "FlowNode",
    description:
      "Visual DAG workflow automation builder with 20+ custom node types, animated edges, drag-and-drop canvas, and real-time data flow visualization. Built for orchestrating Jira, Slack, and Google Sheets workflows.",
    techStack: ["React", "ReactFlow", "TypeScript", "Vite", "MUI", "D3.js", "Node.js"],
    link: "/flownode",
    github: "https://github.com/aaronstone2/flownode",
    color: "blue" as const,
    featured: true,
  },
  {
    title: "Service Graph Visualizer",
    description:
      "Microservice dependency mapping and chaos engineering tool. Drag-and-drop service nodes, toxic injection simulation, K6 load test visualization, and real-time dependency graph analysis across a full microservice architecture.",
    techStack: ["React", "ReactFlow", "Node.js", "Drizzle ORM", "EdgeDB", "NX Monorepo"],
    link: "/service-graph",
    github: "https://github.com/aaronstone2/kraken-unchained",
    color: "cyan" as const,
    featured: true,
  },
  {
    title: "Bubble Programming Language",
    description:
      "3D visual programming language where code structures are navigable spheres in virtual reality. Features recursive namespaces (Bubbles), visual type checking, Wave Graphs for control flow, and a drag-and-drop code library. Documented in a 78-page Honors Thesis.",
    techStack: ["3D Graphics", "VR", "Visual Programming", "Language Design", "Scene Graphs"],
    link: "/thesis",
    github: null,
    color: "purple" as const,
    featured: true,
  },
  {
    title: "Metro Graph",
    description:
      "Interactive 2D flow graph system for visualizing connected data. Same design philosophy as Bubble — node-based, zoomable, with drag-and-drop composition. Smaller-scope project demonstrating the visual programming paradigm.",
    techStack: ["React", "D3.js", "TypeScript", "Graph Algorithms"],
    link: null,
    github: null,
    color: "cyan" as const,
    featured: false,
  },
  {
    title: "Portfolio Site",
    description:
      "This site — built with Next.js 16, featuring interactive architecture graphs, horizontal zoomable career timeline, draggable nodes, multi-view content tabs, and a white-glow cyberpunk aesthetic.",
    techStack: ["Next.js", "React", "Tailwind CSS", "Vercel", "TypeScript"],
    link: "/",
    github: "https://github.com/aaronstone2/v0-portfolio",
    color: "blue" as const,
    featured: false,
  },
]

const colorClasses = {
  blue: {
    border: "border border-white/10 hover:border-white/25",
    text: "text-white",
    bg: "bg-white/5",
    tag: "border-white/15 text-slate-300",
  },
  purple: {
    border: "border border-white/10 hover:border-white/25",
    text: "text-white",
    bg: "bg-white/5",
    tag: "border-white/15 text-slate-300",
  },
  cyan: {
    border: "border border-white/10 hover:border-white/25",
    text: "text-white",
    bg: "bg-white/5",
    tag: "border-white/15 text-slate-300",
  },
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <PageHeader path="/projects" />
      <div className="p-6 md:p-10">
      {/* Header */}
      <section className="mb-12 pt-12 md:pt-0">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" style={{ boxShadow: '0 0 8px rgba(255,255,255,0.6)' }} />
          <span className="text-sm font-mono text-muted-foreground">
            Featured Work
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          <span className="text-white" style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>Projects</span>
        </h1>

        <p className="text-muted-foreground max-w-2xl">
          A collection of technical projects showcasing expertise in visual
          programming, data visualization, and scalable system architecture.
        </p>
      </section>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const colors = colorClasses[project.color]
          return (
            <article
              key={project.title}
              className={`group relative flex flex-col rounded-xl bg-card p-6 transition-all duration-300 hover:scale-[1.08] active:scale-[1.15] cursor-pointer ${colors.border}`}
              style={{ transition: 'all 0.3s ease' }}
            >
              {/* Featured badge */}
              {project.featured && (
                <div className="absolute -top-3 -right-3 rounded-full bg-white/10 px-3 py-1 text-xs font-mono font-medium text-white border border-white/20">
                  Featured
                </div>
              )}

              {/* Title */}
              <h2 className={`text-xl font-semibold ${colors.text}`}>
                {project.title}
              </h2>

              {/* Description */}
              <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className={`rounded-md border px-2 py-0.5 text-xs font-mono ${colors.tag}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/10">
                {project.link && (
                  <a
                    href={project.link}
                    className="flex items-center gap-2 text-sm font-medium text-slate-300 transition-all hover:text-white hover:scale-105"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Project
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-all hover:text-white hover:scale-105"
                  >
                    <Github className="h-4 w-4" />
                    Source
                  </a>
                )}
                {!project.link && !project.github && (
                  <span className="text-sm text-slate-600 italic">Coming soon</span>
                )}
              </div>

              {/* Hover glow effect */}
              <div
                className={`absolute inset-0 -z-10 rounded-xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20 ${colors.bg}`}
              />
            </article>
          )
        })}
      </div>

      {/* Additional Info */}
      <section className="mt-16 rounded-xl border border-border bg-card/50 p-8">
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          <span className="text-white" style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>//</span> Open Source Contributions
        </h2>
        <p className="text-muted-foreground mb-4">
          Beyond personal projects, I actively contribute to open source
          communities and collaborate on tools that help developers build better
          software.
        </p>
        <a
          href="https://github.com/aaronstone2"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted hover:scale-105 active:scale-110 border border-white/10"
        >
          <Github className="h-4 w-4" />
          View GitHub Profile
        </a>
      </section>
      </div>
    </div>
  )
}
