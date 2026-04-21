import type { Metadata } from "next"
import { ExternalLink, Github } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { getProjects } from "@/lib/site-tree"

export const metadata: Metadata = {
  title: "Projects",
  description: "Portfolio of Technical Work",
  openGraph: {
    title: "Projects | Aaron Stone",
    description: "Portfolio of Technical Work",
    type: "website",
  },
}

const projects = getProjects()

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <PageHeader path="/projects" />
      <div className="p-4 sm:p-6 md:p-10">
        {/* Projects Grid — driven entirely by site-tree.ts */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.href}
              className="group relative flex flex-col rounded-xl bg-card p-4 sm:p-6 transition-all duration-300 md:hover:scale-[1.08] active:scale-[1.02] cursor-pointer border border-white/10 hover:border-white/25"
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

              {project.techStack && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="rounded-md border border-white/15 px-2 py-0.5 text-xs font-mono text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/10">
                <a href={project.href} className="flex items-center gap-2 text-sm font-medium text-slate-300 transition-all hover:text-white hover:scale-105">
                  <ExternalLink className="h-4 w-4" />
                  View Project
                </a>
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-all hover:text-white hover:scale-105">
                    <Github className="h-4 w-4" />
                    Source
                  </a>
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
