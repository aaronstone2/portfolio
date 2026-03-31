import { FileText, Download, ExternalLink } from "lucide-react"

export default function ResumePage() {
  return (
    <div className="flex h-screen flex-col">
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
              Career Flow Graph Visualization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/resume.pdf"
            download
            className="flex items-center gap-2 rounded-lg bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary/20 neon-border-purple"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
          <a
            href="https://jira-ticket-validator-ui-react.vercel.app/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Open in New Tab
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Iframe Container */}
      <div className="relative flex-1">
        {/* Loading state background */}
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary mx-auto" />
            <p className="text-sm text-muted-foreground font-mono">
              Loading Resume...
            </p>
          </div>
        </div>

        <iframe
          src="https://jira-ticket-validator-ui-react.vercel.app/resume"
          className="relative z-10 h-full w-full border-0"
          title="Interactive Resume"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  )
}
