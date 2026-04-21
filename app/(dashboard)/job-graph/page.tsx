"use client"

import { ExternalLink, Github, Info } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"

const DEMO_URL = "https://job-graph-ui.vercel.app/"

export default function JobGraphPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <PageHeader path="/job-graph">
        <Link
          href="/job-graph/about"
          className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 sm:px-3 text-xs font-medium text-slate-400 transition-all hover:text-white md:hover:scale-[1.05] hover:bg-white/10"
          aria-label="About"
        >
          <Info className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">About</span>
        </Link>
        <a
          href={DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 sm:px-3 text-xs font-medium text-slate-400 transition-all hover:text-white md:hover:scale-[1.05] hover:bg-white/10"
          aria-label="Open in new tab"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Open in new tab</span>
        </a>
        <a
          href="https://github.com/aaronstone2/job-graph"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 sm:px-3 text-xs font-medium text-slate-400 transition-all hover:text-white md:hover:scale-[1.05] hover:bg-white/10"
          aria-label="Source"
        >
          <Github className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Source</span>
        </a>
      </PageHeader>

      <div className="flex-1 relative bg-black/20">
        <iframe
          src={DEMO_URL}
          className="absolute inset-0 h-full w-full border-0"
          title="Job Graph — live deployed UI"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  )
}
