"use client"

import { GitBranch, ExternalLink } from "lucide-react"
import { PAGE_META } from "@/lib/page-meta"

const meta = PAGE_META["/flownode"]

export default function FlowNodePage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Snackbar header */}
      <header className="flex items-center justify-between border-b border-white/10 bg-card/50 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/5 p-2 border border-white/10">
            <GitBranch className="h-5 w-5 text-white" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white" style={{ textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>{meta.title}</h1>
            <p className="text-sm text-slate-500">{meta.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/aaronstone2/flownode"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 border border-white/10 transition-all hover:text-white hover:scale-[1.05] hover:bg-white/10"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Source
          </a>
        </div>
      </header>

      {/* Iframe */}
      <div className="relative flex-1">
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-white mx-auto" />
            <p className="text-sm text-slate-500 font-mono">Loading {meta.title}...</p>
          </div>
        </div>
        <iframe
          src="https://flownode-ui-react.vercel.app/?embed=1"
          className="relative z-10 h-full w-full border-0"
          title={meta.title}
          loading="lazy"
        />
      </div>
    </div>
  )
}
