import { Network, ExternalLink } from "lucide-react"

export default function ArchitecturePage() {
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-accent/10 p-2 neon-border-cyan">
            <Network className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              FlowNode System Design
            </h1>
            <p className="text-sm text-muted-foreground">
              Architecture Diagram & System Overview
            </p>
          </div>
        </div>

        <a
          href="https://jira-ticket-validator-ui-react.vercel.app/architecture"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/20 neon-border-cyan"
        >
          Open in New Tab
          <ExternalLink className="h-4 w-4" />
        </a>
      </header>

      {/* Iframe Container */}
      <div className="relative flex-1">
        {/* Loading state background */}
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-accent/20 border-t-accent mx-auto" />
            <p className="text-sm text-muted-foreground font-mono">
              Loading Architecture...
            </p>
          </div>
        </div>

        <iframe
          src="https://jira-ticket-validator-ui-react.vercel.app/architecture"
          className="relative z-10 h-full w-full border-0"
          title="FlowNode Architecture Diagram"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  )
}
