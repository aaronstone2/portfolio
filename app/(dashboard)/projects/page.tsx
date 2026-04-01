import { ExternalLink, Github } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { PAGE_META } from "@/lib/page-meta"

const projects = [
  {
    title: PAGE_META["/flownode"].title,
    subtitle: PAGE_META["/flownode"].subtitle,
    description:
      "20+ custom node types, animated edges, drag-and-drop canvas, and real-time data flow visualization. Built for orchestrating Jira, Slack, and Google Sheets workflows.",
    techStack: ["React", "ReactFlow", "TypeScript", "Vite", "MUI", "D3.js", "Node.js"],
    link: "/flownode",
    github: "https://github.com/aaronstone2/flownode",
    featured: true,
  },
  {
    title: PAGE_META["/service-graph"].title,
    subtitle: PAGE_META["/service-graph"].subtitle,
    description:
      "Drag-and-drop service nodes, toxic injection simulation, K6 load test visualization, and real-time dependency graph analysis across a full microservice architecture.",
    techStack: ["React", "ReactFlow", "Node.js", "Drizzle ORM", "EdgeDB", "NX Monorepo"],
    link: "/service-graph",
    github: "https://github.com/aaronstone2/kraken-unchained",
    featured: true,
  },
  {
    title: PAGE_META["/thesis"].title,
    subtitle: PAGE_META["/thesis"].subtitle,
    description:
      "3D visual programming language where code structures are navigable spheres in virtual reality. Features recursive namespaces, visual type checking, Wave Graphs for control flow, and a drag-and-drop code library. 78-page Honors Thesis.",
    techStack: ["3D Graphics", "VR", "Visual Programming", "Language Design", "Scene Graphs"],
    link: "/thesis",
    github: null,
    featured: true,
  },
  {
    title: PAGE_META["/subway"].title,
    subtitle: PAGE_META["/subway"].subtitle,
    description:
      "Interactive NYC subway map built as a node graph. Draggable stations, zoom controls, line coloring, and transfer detection.",
    techStack: ["React", "SVG", "TypeScript", "Graph Algorithms"],
    link: "/subway",
    github: null,
    featured: false,
  },
  {
    title: "Portfolio Site",
    subtitle: "This Website",
    description:
      "Built with Next.js 16, featuring interactive architecture graphs, horizontal zoomable career timeline, draggable nodes, multi-view content tabs, and a white-glow cyberpunk aesthetic.",
    techStack: ["Next.js", "React", "Tailwind CSS", "Vercel", "TypeScript"],
    link: "/",
    github: "https://github.com/aaronstone2/v0-portfolio",
    featured: false,
  },
]

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <PageHeader path="/projects" />
      <div className="p-6 md:p-10">
        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group relative flex flex-col rounded-xl bg-card p-6 transition-all duration-300 hover:scale-[1.08] active:scale-[1.15] cursor-pointer border border-white/10 hover:border-white/25"
            >
              {project.featured && (
                <div className="absolute -top-3 -right-3 rounded-full bg-white/10 px-3 py-1 text-xs font-mono font-medium text-white border border-white/20">
                  Featured
                </div>
              )}

              <h2 className="text-xl font-semibold text-white">{project.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{project.subtitle}</p>

              <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="rounded-md border border-white/15 px-2 py-0.5 text-xs font-mono text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/10">
                {project.link && (
                  <a href={project.link} className="flex items-center gap-2 text-sm font-medium text-slate-300 transition-all hover:text-white hover:scale-105">
                    <ExternalLink className="h-4 w-4" />
                    View Project
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-all hover:text-white hover:scale-105">
                    <Github className="h-4 w-4" />
                    Source
                  </a>
                )}
                {!project.link && !project.github && (
                  <span className="text-sm text-slate-600 italic">Coming soon</span>
                )}
              </div>

              <div className="absolute inset-0 -z-10 rounded-xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20 bg-white/5" />
            </article>
          ))}
        </div>

        {/* Open Source Section */}
        <section className="mt-16 rounded-xl border border-border bg-card/50 p-8">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            <span className="text-white" style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>//</span> Open Source
          </h2>
          <p className="text-muted-foreground mb-4">
            Beyond personal projects, I actively contribute to open source communities and collaborate on tools that help developers build better software.
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
