"use client"

import { Download, FileDown, BookOpen } from "lucide-react"
import { useState } from "react"
import { PAGE_META } from "@/lib/page-meta"

const meta = PAGE_META["/thesis"]

type ViewMode = "document" | "reader"

export default function ThesisPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("document")

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Snackbar header */}
      <header className="flex items-center justify-between border-b border-white/10 bg-card/50 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/5 p-2 border border-white/10">
            <BookOpen className="h-5 w-5 text-white" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white" style={{ textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>{meta.title}</h1>
            <p className="text-sm text-slate-500">{meta.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-white/10 bg-black/50 p-1">
            <button
              onClick={() => setViewMode("document")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-[1.05] ${
                viewMode === "document" ? "bg-white/10 text-white" : "text-slate-600 hover:text-white"
              }`}
              style={viewMode === "document" ? { boxShadow: '0 0 10px rgba(255,255,255,0.1)', textShadow: '0 0 8px rgba(255,255,255,0.3)' } : {}}
            >
              <FileDown className="h-3.5 w-3.5" />
              PDF
            </button>
            <button
              onClick={() => setViewMode("reader")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-[1.05] ${
                viewMode === "reader" ? "bg-white/10 text-white" : "text-slate-600 hover:text-white"
              }`}
              style={viewMode === "reader" ? { boxShadow: '0 0 10px rgba(255,255,255,0.1)', textShadow: '0 0 8px rgba(255,255,255,0.3)' } : {}}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Reader
            </button>
          </div>
          <a
            href="/StoneThesis2021.pdf"
            download
            className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:text-white hover:scale-[1.05] hover:bg-white/10"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </a>
        </div>
      </header>

      {viewMode === "document" ? (
        <div className="flex-1">
          <iframe
            src="/StoneThesis2021.pdf#view=FitH&pagemode=none&toolbar=1&navpanes=0"
            className="h-full w-full border-0"
            title="Bubble Thesis PDF"
          />
        </div>
      ) : (
        <div className="flex-1">
          <iframe
            src="https://flownode-ui-react.vercel.app/thesis?embed=1"
            className="h-full w-full border-0"
            title="Bubble Thesis Reader"
          />
        </div>
      )}
    </div>
  )
}

