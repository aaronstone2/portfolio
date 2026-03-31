import Link from "next/link"
import {
  GitBranch,
  FileText,
  Network,
  FolderKanban,
  Mail,
  ArrowRight,
} from "lucide-react"

const projectLinks = [
  {
    href: "/flownode",
    title: "FlowNode",
    description: "Visual Node Graph Automation Builder",
    icon: GitBranch,
    color: "blue",
  },
  {
    href: "/resume",
    title: "Resume",
    description: "Interactive Career Flow Graph",
    icon: FileText,
    color: "purple",
  },
  {
    href: "/architecture",
    title: "Architecture",
    description: "FlowNode System Design",
    icon: Network,
    color: "cyan",
  },
  {
    href: "/projects",
    title: "Projects",
    description: "Portfolio of Technical Work",
    icon: FolderKanban,
    color: "blue",
  },
  {
    href: "/service-graph",
    title: "Service Graph",
    description: "Microservice Dependency Visualizer",
    icon: GitBranch,
    color: "cyan",
  },
  {
    href: "/thesis",
    title: "Thesis",
    description: "3D VR Programming Research",
    icon: FileText,
    color: "purple",
  },
  {
    href: "/contact",
    title: "Contact",
    description: "Get in Touch",
    icon: Mail,
    color: "purple",
  },
]

const colorClasses = {
  blue: {
    border: "neon-border-blue",
    text: "neon-text-blue",
    glow: "group-hover:neon-glow-blue",
    bg: "bg-primary/10",
  },
  purple: {
    border: "neon-border-purple",
    text: "neon-text-purple",
    glow: "group-hover:neon-glow-purple",
    bg: "bg-secondary/10",
  },
  cyan: {
    border: "neon-border-cyan",
    text: "neon-text-cyan",
    glow: "group-hover:neon-glow-cyan",
    bg: "bg-accent/10",
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Hero Section */}
      <section className="relative mb-16 pt-12 md:pt-0">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />
        </div>

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-mono text-muted-foreground">
              Available for opportunities
            </span>
          </div>

          <div className="mb-6 h-28 w-28 overflow-hidden rounded-full border-2 border-primary/50 shadow-[0_0_25px_rgba(59,130,246,0.3)]">
            <img src="/aaron-photo.jpg" alt="Aaron Stone" className="h-full w-full object-cover" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="neon-text-blue">Aaron Stone</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-2xl">
            Software Engineer{" "}
            <span className="neon-text-purple">&</span> Product Builder
          </p>

          <p className="text-muted-foreground max-w-xl leading-relaxed">
            Building innovative tools and systems that push the boundaries of
            what&apos;s possible. Specializing in visual programming interfaces,
            automation, and scalable architectures.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {["TypeScript", "React", "Node.js", "Python", "AWS"].map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-border bg-card px-3 py-1 text-sm font-mono text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <section>
        <h2 className="text-lg font-mono font-semibold mb-6 text-muted-foreground">
          <span className="neon-text-cyan">//</span> EXPLORE
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projectLinks.map((project) => {
            const colors = colorClasses[project.color as keyof typeof colorClasses]
            return (
              <Link
                key={project.href}
                href={project.href}
                className={`group relative rounded-xl bg-card p-6 transition-all duration-300 hover:scale-[1.02] ${colors.border}`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`rounded-lg ${colors.bg} p-3 transition-all duration-300`}
                  >
                    <project.icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-card-foreground">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {project.description}
                </p>

                {/* Animated corner accent */}
                <div className="absolute bottom-0 right-0 h-16 w-16 overflow-hidden rounded-br-xl">
                  <div
                    className={`absolute bottom-0 right-0 h-0 w-0 border-b-[64px] border-r-[64px] border-b-transparent border-r-primary/5 transition-all duration-300 group-hover:border-r-primary/10`}
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mt-16 grid gap-4 md:grid-cols-4">
        {[
          { label: "Years Experience", value: "5+" },
          { label: "Projects Shipped", value: "20+" },
          { label: "Technologies", value: "15+" },
          { label: "Coffee Consumed", value: "∞" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card/50 p-6 text-center"
          >
            <div className="text-3xl font-bold neon-text-blue">{stat.value}</div>
            <div className="mt-1 text-sm text-muted-foreground font-mono">
              {stat.label}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
