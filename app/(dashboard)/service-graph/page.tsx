import { Activity, ExternalLink } from "lucide-react"

export default function ServiceGraphPage() {
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-2" style={{ border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            <Activity className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Service Graph Visualizer</h1>
            <p className="text-sm text-muted-foreground">Microservice Dependency Mapping & Analysis</p>
          </div>
        </div>

        <a
          href="https://flownode-ui-react.vercel.app/service-graph"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
          style={{ border: "1px solid rgba(16, 185, 129, 0.3)" }}
        >
          Open in New Tab
          <ExternalLink className="h-4 w-4" />
        </a>
      </header>

      {/* Iframe Container */}
      <div className="relative flex-1">
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500 mx-auto" />
            <p className="text-sm text-muted-foreground font-mono">Loading Service Graph...</p>
          </div>
        </div>

        <iframe
          src="https://flownode-ui-react.vercel.app/service-graph"
          className="relative z-10 h-full w-full border-0"
          title="Service Graph Visualizer"
          loading="lazy"
        />
      </div>
    </div>
  )
}
