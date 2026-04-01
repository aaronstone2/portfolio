"use client"

import { ExternalLink } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export default function FlowNodePage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <PageHeader path="/flownode">
        <a
          href="https://github.com/aaronstone2/flownode"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 border border-white/10 transition-all hover:text-white hover:scale-[1.05] hover:bg-white/10"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Source
        </a>
      </PageHeader>

      <div className="relative flex-1">
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-white mx-auto" />
            <p className="text-sm text-slate-500 font-mono">Loading FlowNode...</p>
          </div>
        </div>
        <iframe
          src="https://flownode-ui-react.vercel.app/?embed=1"
          className="relative z-10 h-full w-full border-0"
          title="FlowNode"
          loading="lazy"
        />
      </div>
    </div>
  )
}
