"use client"

import { useState } from "react"
import { ExternalLink, GitBranch, Layers, Zap, FlaskConical, Activity, Monitor, BookOpen } from "lucide-react"
import { PageHeader } from "@/components/page-header"

const KRAKEN_URL = "https://kraken-unchained.vercel.app"

export default function ServiceGraphPage() {
  const [activeTab, setActiveTab] = useState<"demo" | "details">("demo")

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <PageHeader path="/service-graph">
        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
            <button
              onClick={() => setActiveTab("demo")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === "demo"
                  ? "bg-white/10 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              Live Demo
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === "details"
                  ? "bg-white/10 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Details
            </button>
          </div>

          <a
            href="https://github.com/aaronstone2/kraken-unchained"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 border border-white/10 transition-all hover:text-white hover:scale-[1.05] hover:bg-white/10"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Source
          </a>
        </div>
      </PageHeader>

      {activeTab === "demo" ? (
        <div className="flex-1 overflow-hidden relative">
          <iframe
            src={`${KRAKEN_URL}?embed=1`}
            className="w-full h-full border-0"
            title="Service Graph Visualizer — Live Demo"
            allow="fullscreen"
          />
          {/* Fallback overlay in case iframe doesn't load */}
          <noscript>
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <p className="text-slate-400">Enable JavaScript to view the live demo.</p>
            </div>
          </noscript>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-8 space-y-8">
            {/* Hero */}
            <div className="rounded-2xl border-2 border-white/10 bg-white/[0.02] p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                  <Layers className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
                    Service Graph Visualizer
                  </h2>
                  <p className="text-sm text-slate-500">kraken-unchained — NX Monorepo</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-2xl">
                Full-stack service dependency visualization tool built as an NX monorepo. Features a drag-and-drop ReactFlow canvas
                with a NodePalette sidebar, real-time dependency graph analysis, toxic injection simulation, and K6 load test visualization.
              </p>
            </div>

            {/* Architecture Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  icon: GitBranch,
                  title: "Dependency Graph",
                  desc: "Drag service nodes onto the canvas. Dependencies auto-wire based on config data. Double-click to expand detailed views.",
                  color: "#4a90e2",
                },
                {
                  icon: FlaskConical,
                  title: "Toxic Injection",
                  desc: "Simulate latency, timeouts, and bandwidth toxics via Toxiproxy integration. Visual toxic nodes connect to affected services.",
                  color: "#e24a4a",
                },
                {
                  icon: Activity,
                  title: "K6 Load Testing",
                  desc: "Create load test scenarios targeting specific services. Spike tests, soak tests, and stress tests with configurable VUs and duration.",
                  color: "#50c878",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border-2 bg-white/[0.02] p-5 transition-all hover:scale-[1.02]"
                  style={{ borderColor: `${card.color}33` }}
                >
                  <card.icon className="h-5 w-5 mb-3" style={{ color: card.color }} />
                  <h3 className="text-sm font-semibold text-white mb-2">{card.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Tech Stack */}
            <div className="rounded-xl border-2 border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "ReactFlow", "TypeScript", "Node.js", "Drizzle ORM", "EdgeDB", "NX Monorepo", "Zustand", "Toxiproxy", "K6"].map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border-2 border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Monorepo Structure */}
            <div className="rounded-xl border-2 border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Monorepo Packages</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: "ui", desc: "React + ReactFlow canvas" },
                  { name: "api", desc: "Express REST server" },
                  { name: "database", desc: "EdgeDB + Drizzle ORM" },
                  { name: "analyzer", desc: "Dependency analysis engine" },
                  { name: "cli", desc: "CLI tooling" },
                  { name: "validation", desc: "Schema validation" },
                  { name: "data-generator", desc: "Mock data generation" },
                  { name: "shared", desc: "Shared types & utils" },
                  { name: "common", desc: "Common config" },
                ].map((pkg) => (
                  <div key={pkg.name} className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2">
                    <span className="text-xs font-mono font-semibold text-white">{pkg.name}</span>
                    <p className="text-[10px] text-slate-600 mt-0.5">{pkg.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-center gap-4 py-4">
              <button
                onClick={() => setActiveTab("demo")}
                className="flex items-center gap-2 rounded-xl border-2 border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-[1.05] hover:bg-white/10"
                style={{ boxShadow: '0 0 20px rgba(255,255,255,0.05)' }}
              >
                <Monitor className="h-4 w-4" />
                Launch Live Demo
              </button>
              <a
                href="https://github.com/aaronstone2/kraken-unchained"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border-2 border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-[1.05] hover:bg-white/10"
                style={{ boxShadow: '0 0 20px rgba(255,255,255,0.05)' }}
              >
                <ExternalLink className="h-4 w-4" />
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
