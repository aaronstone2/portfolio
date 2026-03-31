import { ExternalLink, Github } from "lucide-react"

const projects = [
  {
    title: "FlowNode",
    description:
      "A visual node graph automation builder that enables users to create complex DAG workflows through an intuitive drag-and-drop interface. Features real-time validation, execution monitoring, and seamless integration with external services.",
    techStack: ["React", "TypeScript", "D3.js", "Node.js", "PostgreSQL"],
    link: "/flownode",
    github: "https://github.com/aaronstone2",
    color: "blue" as const,
    featured: true,
  },
  {
    title: "Bubble Holographic Systems",
    description:
      "Advanced holographic visualization platform for 3D data representation. Implements WebGL shaders for real-time rendering and spatial computing interfaces for immersive data exploration.",
    techStack: ["Three.js", "WebGL", "React", "GLSL", "WebXR"],
    link: "https://bubble.graphics",
    github: "https://github.com/aaronstone2",
    color: "purple" as const,
    featured: true,
  },
  {
    title: "Metro Graph",
    description:
      "Interactive transit network visualization tool that maps urban transportation systems. Features real-time updates, route optimization algorithms, and accessibility analysis for city planners.",
    techStack: ["Python", "NetworkX", "FastAPI", "React", "MapboxGL"],
    link: "#",
    github: "https://github.com/aaronstone2",
    color: "cyan" as const,
    featured: false,
  },
]

const colorClasses = {
  blue: {
    border: "neon-border-blue",
    text: "neon-text-blue",
    bg: "bg-primary/10",
    tag: "border-primary/30 text-primary",
  },
  purple: {
    border: "neon-border-purple",
    text: "neon-text-purple",
    bg: "bg-secondary/10",
    tag: "border-secondary/30 text-secondary",
  },
  cyan: {
    border: "neon-border-cyan",
    text: "neon-text-cyan",
    bg: "bg-accent/10",
    tag: "border-accent/30 text-accent",
  },
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <section className="mb-12 pt-12 md:pt-0">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-mono text-muted-foreground">
            Featured Work
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          <span className="neon-text-blue">Projects</span>
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
              className={`group relative flex flex-col rounded-xl bg-card p-6 transition-all duration-300 hover:scale-[1.02] ${colors.border}`}
            >
              {/* Featured badge */}
              {project.featured && (
                <div className="absolute -top-3 -right-3 rounded-full bg-primary/20 px-3 py-1 text-xs font-mono font-medium text-primary neon-border-blue">
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
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border">
                <a
                  href={project.link}
                  className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Project
                </a>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="h-4 w-4" />
                  Source
                </a>
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
          <span className="neon-text-purple">//</span> Open Source Contributions
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
          className="inline-flex items-center gap-2 rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted neon-border-blue"
        >
          <Github className="h-4 w-4" />
          View GitHub Profile
        </a>
      </section>
    </div>
  )
}
