import type { Metadata } from "next"
import { Github, ExternalLink, Database, Zap, FileCheck, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Job Graph",
  description: "Semantic knowledge graph over 21k+ job postings with AI-reviewed resume tailoring",
  openGraph: {
    title: "Job Graph | Aaron Stone",
    description: "Semantic knowledge graph over 21k+ job postings with AI-reviewed resume tailoring",
    type: "website",
  },
}

const STATS = [
  { label: "Job postings indexed", value: "21,000+", icon: Database },
  { label: "Companies covered", value: "79", icon: Sparkles },
  { label: "ATS integrations", value: "5", icon: Zap },
  { label: "Preflight pass rate (latest run)", value: "12/12", icon: FileCheck },
]

const FEATURES = [
  {
    title: "Live scrapers across five ATSes",
    body: "Greenhouse, Lever, Ashby, Workday, and SmartRecruiters. Per-scraper adapters hit the public endpoints, normalize the responses into a single Posting shape, and write directly into MongoDB with Zod-validated schemas.",
  },
  {
    title: "Semantic keyword graph",
    body: "Every JD gets run through a live keyword extractor (skills, industries, company products, role-specific phrases). The graph links postings by shared keywords and lets you navigate the 21k+ dataset by skill adjacency rather than by keyword search.",
  },
  {
    title: "AI-reviewed resume tailoring",
    body: "Drag-to-reorder resume editor fills 70+ {{PLACEHOLDER}} slots per template from the target JD — company blurb, why-company, team mission, top skills, responsibilities — and runs Claude Opus structured review before any application ships.",
  },
  {
    title: "Graduated-send pipeline with hard gates",
    body: "Pilot → small batch → full batch with per-phase cooldowns, a dual ENV + per-call confirmation gate for real POSTs, a test-target override that redirects to a local mock ATS, and duplicate-submission + concurrent-lock guards in MongoDB.",
  },
  {
    title: "Preflight quality regression harness",
    body: "Pure-function preflight scans for {{...}} leaks, word-count bounds, missing sections, missing name/email/phone, duplicate bullets, missing greeting/sign-off, and missing company name in the cover letter. Findings at block severity hard-gate submission.",
  },
  {
    title: "Built on MiniMongo — my own visual MongoDB explorer",
    body: "Custom RPC framework over HTTP + WebSocket, React Flow canvas, Zod-validated procedures, theme-aware inline styles over CSS variables. The job scraper is the first domain on top of a generic Scraper<T> / Entity / Edge substrate.",
  },
]

export default function JobGraphPage() {
  return (
    <div className="min-h-screen">
      <PageHeader path="/job-graph">
        <a
          href="https://github.com/aaronstone2/job-graph"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:text-white hover:scale-[1.05] hover:bg-white/10"
        >
          <Github className="h-3.5 w-3.5" />
          Source
        </a>
      </PageHeader>

      <div className="p-4 sm:p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
        {/* Hero */}
        <section>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-2">Job Graph</h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            A semantic knowledge graph built on top of MiniMongo (a visual MongoDB explorer and
            custom RPC framework I wrote) that scrapes and indexes tens of thousands of job
            postings, extracts keywords on every JD, and ships an AI-reviewed resume-tailoring
            editor with drag-to-reorder interactions.
          </p>
        </section>

        {/* Stats grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-card p-3 sm:p-4 flex flex-col gap-2"
            >
              <s.icon className="h-4 w-4 text-slate-400" />
              <div className="text-lg sm:text-2xl font-semibold text-white">{s.value}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 leading-tight">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Features */}
        <section>
          <h2 className="text-sm font-mono text-white mb-4">
            <span style={{ textShadow: "0 0 10px rgba(255,255,255,0.3)" }}>//</span> What it does
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="rounded-xl border border-white/10 bg-card p-4 sm:p-5"
              >
                <h3 className="text-sm sm:text-base font-semibold text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Stack */}
        <section>
          <h2 className="text-sm font-mono text-white mb-3">
            <span style={{ textShadow: "0 0 10px rgba(255,255,255,0.3)" }}>//</span> Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "TypeScript", "React 19", "Vite 7", "React Flow", "Express 5",
              "MongoDB 8", "Zod", "Anthropic SDK", "Claude Opus",
              "Leaflet", "PDFKit", "jsPDF", "Docker",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/15 px-2 py-0.5 text-xs font-mono text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Test results */}
        <section className="rounded-xl border border-white/10 bg-card/50 p-5 sm:p-6">
          <h2 className="text-sm font-mono text-white mb-3">
            <span style={{ textShadow: "0 0 10px rgba(255,255,255,0.3)" }}>//</span> Latest test run
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
            Ran the fill + preflight pipeline against 6 diverse Greenhouse postings
            (Cloudflare, Coinbase, Discord, Figma, GitLab, Stripe) for both resume
            variants. <span className="text-green-400 font-semibold">12/12 passing</span> with
            tuned thresholds. Generated resumes land ~605 words; cover letters 540–780 words
            depending on JD. Every output file is committed to the repo for review.
          </p>
          <a
            href="https://github.com/aaronstone2/job-graph/tree/main/test-results"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-card px-4 py-2 text-sm font-medium text-white transition-all hover:bg-muted hover:scale-105 border border-white/10"
          >
            <ExternalLink className="h-4 w-4" />
            View test-results folder on GitHub
          </a>
        </section>

        {/* Source */}
        <section className="rounded-xl border border-white/10 bg-card/50 p-5 sm:p-6">
          <h2 className="text-sm font-mono text-white mb-3">
            <span style={{ textShadow: "0 0 10px rgba(255,255,255,0.3)" }}>//</span> Source
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
            Full source on GitHub. Monorepo with <code className="font-mono text-slate-300">server/</code>,{" "}
            <code className="font-mono text-slate-300">ui/</code>, and{" "}
            <code className="font-mono text-slate-300">common/</code> workspaces plus docs and
            test-result fixtures.
          </p>
          <a
            href="https://github.com/aaronstone2/job-graph"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-card px-4 py-2 text-sm font-medium text-white transition-all hover:bg-muted hover:scale-105 border border-white/10"
          >
            <Github className="h-4 w-4" />
            aaronstone2/job-graph
          </a>
        </section>
      </div>
    </div>
  )
}
