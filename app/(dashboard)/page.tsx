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
    border: "border border-white/10 hover:border-white/25",
    text: "text-slate-300",
    glow: "",
    bg: "bg-white/5",
  },
  purple: {
    border: "border border-white/10 hover:border-white/25",
    text: "text-slate-300",
    glow: "",
    bg: "bg-white/5",
  },
  cyan: {
    border: "border border-white/10 hover:border-white/25",
    text: "text-slate-300",
    glow: "",
    bg: "bg-white/5",
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" style={{ boxShadow: '0 0 8px rgba(255,255,255,0.6)' }} />
            <span className="text-sm font-mono text-slate-400">
              Available for opportunities
            </span>
          </div>

          <div className="mb-6 h-48 w-48 rounded-full p-[3px] transition-all duration-300 hover:scale-[1.25] cursor-pointer" style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045, #833ab4)', backgroundSize: '300% 300%', animation: 'igGradient 3s ease infinite' }}>
            <div className="h-full w-full rounded-full overflow-hidden border-[3px] border-black">
              <img src="/aaron-photo.jpg" alt="Aaron Stone" className="h-full w-full object-cover" />
            </div>
          </div>
          <style dangerouslySetInnerHTML={{ __html: `@keyframes igGradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }` }} />

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="text-white" style={{ textShadow: '0 0 30px rgba(255,255,255,0.2)' }}>Aaron Stone</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-6 max-w-2xl">
            Software Engineer{" "}
            <span className="text-slate-300">&amp;</span> Product Builder
          </p>

          <p className="text-muted-foreground max-w-xl leading-relaxed">
            Building innovative tools and systems that push the boundaries of
            what&apos;s possible. Specializing in visual programming interfaces,
            automation, and scalable architectures.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <a href="https://linkedin.com/in/aaron-stone-2b6994141" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
            <a href="https://github.com/aaronstone2" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
          </div>

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
        <h2 className="text-lg font-mono font-semibold mb-6 text-slate-500">
          <span className="text-white" style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>//</span> EXPLORE
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
            <div className="text-3xl font-bold text-white" style={{ textShadow: '0 0 15px rgba(255,255,255,0.2)' }}>{stat.value}</div>
            <div className="mt-1 text-sm text-muted-foreground font-mono">
              {stat.label}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
