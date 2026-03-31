"use client"

import { BookOpen, Download, FileDown, LayoutGrid } from "lucide-react"
import { useState } from "react"

type ViewMode = "document" | "reader"

export default function ThesisPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("document")

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-amber-500/10 p-2" style={{ border: "1px solid rgba(245, 158, 11, 0.3)" }}>
            <BookOpen className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Honors Thesis</h1>
            <p className="text-sm text-muted-foreground">
              Bubble: An Interface for Programming in 3D Virtual Reality Environments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Tabs */}
          <div className="flex items-center rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setViewMode("document")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === "document" ? "bg-amber-500/20 text-amber-400 shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileDown className="h-3.5 w-3.5" />
              PDF
            </button>
            <button
              onClick={() => setViewMode("reader")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === "reader" ? "bg-amber-500/20 text-amber-400 shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Reader
            </button>
          </div>

          <a
            href="/StoneThesis2021.pdf"
            download
            className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
            style={{ border: "1px solid rgba(245, 158, 11, 0.3)" }}
          >
            <Download className="h-4 w-4" />
            Download
          </a>
        </div>
      </header>

      {/* Content */}
      {viewMode === "document" && (
        <div className="flex-1">
          <iframe
            src="/StoneThesis2021.pdf"
            className="h-full w-full border-0"
            title="Bubble Thesis PDF"
          />
        </div>
      )}

      {viewMode === "reader" && (
        <div className="flex-1">
          <iframe
            src="https://flownode-ui-react.vercel.app/thesis"
            className="h-full w-full border-0"
            title="Bubble Thesis Reader"
          />
        </div>
      )}
    </div>
  )
}
