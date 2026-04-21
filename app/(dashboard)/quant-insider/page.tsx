"use client"

import { useState } from "react"
import {
  ExternalLink,
  Activity,
  GitBranch,
  Network,
  Landmark,
  FileText,
  Sparkles,
  Monitor,
  BookOpen,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"

const APP_URL = "https://quanto-six.vercel.app"
const GITHUB_URL = "https://github.com/aaronstone2/quant-insider"

export default function QuantInsiderPage() {
  const [activeTab, setActiveTab] = useState<"demo" | "details">("demo")

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <PageHeader path="/quant-insider">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
            <button
              onClick={() => setActiveTab("demo")}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 sm:px-3 text-xs font-medium transition-all ${
                activeTab === "demo"
                  ? "bg-white/10 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
              aria-label="Live demo"
            >
              <Monitor className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Live Demo</span>
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 sm:px-3 text-xs font-medium transition-all ${
                activeTab === "details"
                  ? "bg-white/10 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
              aria-label="Details"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Details</span>
            </button>
          </div>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2 py-1.5 sm:px-3 text-xs font-medium text-slate-400 border border-white/10 transition-all hover:text-white md:hover:scale-[1.05] hover:bg-white/10"
            aria-label="Source on GitHub"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Source</span>
          </a>
        </div>
      </PageHeader>

      {activeTab === "demo" ? (
        <div className="flex-1 overflow-hidden relative">
          <iframe
            src={APP_URL}
            className="w-full h-full border-0"
            title="Quant Insider — Live Demo"
            allow="fullscreen"
          />
          <noscript>
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <p className="text-slate-400">Enable JavaScript to view the live demo.</p>
            </div>
          </noscript>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            {/* Hero */}
            <div className="rounded-2xl border-2 border-white/10 bg-white/[0.02] p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-white/5 p-2 sm:p-3 border border-white/10 flex-shrink-0">
                  <Network className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h2
                    className="text-xl sm:text-2xl font-bold text-white truncate"
                    style={{ textShadow: "0 0 20px rgba(255,255,255,0.2)" }}
                  >
                    Quant Insider
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 truncate">
                    Dependency graph for public markets
                  </p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
                Portfolio intelligence SaaS for skilled retail traders. See how every stock
                you own connects to every other name that matters — and get alerted before
                your book catches a ripple. Built around one specific signal the
                author missed on SMCI in October 2024: a position still trending up but
                with its acceleration turning negative. Named <em>rolling over</em>, and
                surfaced as a first-class alert.
              </p>
            </div>

            {/* Flagship features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {[
                {
                  icon: TrendingDown,
                  title: "Rolling-over detection",
                  desc: "Second-derivative trend classifier surfaces positions where price is still positive but acceleration has turned negative — classic topping pattern. Nobody else in retail SaaS names this state.",
                  color: "#e24a4a",
                },
                {
                  icon: Network,
                  title: "Directed market graph",
                  desc: "Supply-chain + customer + competitor + TNIC product-similarity edges from 10-K cosine-similarity (Hoberg-Phillips). Weighted multiplex composition with HITS centrality for authority ranking.",
                  color: "#4a90e2",
                },
                {
                  icon: Landmark,
                  title: "Congressional + insider",
                  desc: "Pelosi-class Congressional trades, Form-4 insider filings filtered by Cohen-Malloy-Pomorski routine/opportunistic classifier, 13D/G activist filings — all tied back to the graph.",
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

            {/* Secondary features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {[
                {
                  icon: Sparkles,
                  title: "Advisor alerts",
                  desc: "Submit your book; get back rolling_over / drawdown_breach / concentration_risk / accelerating alerts grouped by severity (action / watch / info).",
                  color: "#c87cff",
                },
                {
                  icon: Activity,
                  title: "Shadow-mode attribution",
                  desc: "Every triggered signal records expected vs realized return. Scorers paying rent stay; dead weight gets dropped.",
                  color: "#f0b540",
                },
                {
                  icon: GitBranch,
                  title: "Walk-forward validation",
                  desc: "Per-regime out-of-sample gate on every new scorer: Crisis/Recovery, Low-Vol Bull, High-Vol Pivot. Deflated Sharpe Ratio (López de Prado) prevents overfitting claims.",
                  color: "#4fd1c7",
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

            {/* Academic foundation */}
            <div className="rounded-xl border-2 border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Academic foundation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    name: "Cohen-Frazzini (2008)",
                    desc: "Economic links + cross-predictability — customer returns lead supplier returns with ~1-month lag.",
                  },
                  {
                    name: "Cohen-Malloy-Pomorski (2012)",
                    desc: "Decoding Inside Information — routine vs opportunistic trades; ~8.2%/yr long-short alpha in the opportunistic subset.",
                  },
                  {
                    name: "Hoberg-Phillips (2010 / 2016)",
                    desc: "Text-based network industries — cosine similarity on 10-K Item 1 product descriptions yields the TNIC peer graph.",
                  },
                  {
                    name: "Menzly-Ozbas (2010)",
                    desc: "Market segmentation + cross-predictability — industry-level version via BEA Input-Output tables.",
                  },
                  {
                    name: "López de Prado",
                    desc: "Deflated Sharpe Ratio — adjusts reported Sharpe for multiple-testing bias. Every new scorer must clear the threshold.",
                  },
                  {
                    name: "Kleinberg (1999)",
                    desc: "HITS centrality — authorities (nodes many depend on) vs hubs (nodes that depend on many). Applied to the multiplex market graph.",
                  },
                ].map((paper) => (
                  <div
                    key={paper.name}
                    className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5"
                  >
                    <span className="text-xs font-semibold text-white">{paper.name}</span>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{paper.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture */}
            <div className="rounded-xl border-2 border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Architecture
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4 max-w-2xl">
                Hexagonal monorepo — ports &amp; adapters. Services depend on port interfaces;
                concrete adapters (Alpaca, SEC EDGAR, Polygon, Tiingo, Finnhub, NewsAPI)
                are swappable without touching business logic. 160+ tests, typecheck clean.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: "apps/web", desc: "Vite + React 19 + Vanilla Extract" },
                  { name: "apps/api", desc: "Fastify HTTP + WS, tenant-aware" },
                  { name: "apps/worker", desc: "BullMQ jobs, poller + signal runner" },
                  { name: "apps/cli", desc: "Operator CLI — status, halt, backtest" },
                  { name: "packages/core", desc: "Domain entities, zero I/O" },
                  { name: "packages/ports", desc: "Broker, MarketData, News, Filings, Cache" },
                  { name: "packages/services", desc: "Use-cases: advisor, graph, insider, patterns" },
                  { name: "packages/adapters", desc: "Concrete impls per port" },
                  { name: "packages/infra", desc: "Logger, tracing, resilience, queue" },
                ].map((pkg) => (
                  <div
                    key={pkg.name}
                    className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2"
                  >
                    <span className="text-xs font-mono font-semibold text-white">{pkg.name}</span>
                    <p className="text-[10px] text-slate-600 mt-0.5">{pkg.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="rounded-xl border-2 border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "TypeScript",
                  "Node 20",
                  "Fastify",
                  "React 19",
                  "React Flow",
                  "Vite",
                  "Vanilla Extract",
                  "Prisma",
                  "Postgres 16",
                  "BullMQ",
                  "Redis 7",
                  "Zod",
                  "Pino",
                  "OpenTelemetry",
                  "Vitest",
                  "pnpm",
                  "Turborepo",
                  "Alpaca",
                  "SEC EDGAR",
                  "Polygon",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border-2 border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Positioning */}
            <div className="rounded-xl border-2 border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                How it's different
              </h3>
              <div className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
                <p>
                  <span className="text-white font-semibold">vs Quiver Quantitative:</span>{" "}
                  they list signals per-ticker; this ties every signal to a directed graph
                  so you see which adjacent names are about to catch the ripple.
                </p>
                <p>
                  <span className="text-white font-semibold">vs Autopilot:</span> they
                  copy-trade Pelosi; this explains <em>why</em> the name matters and when
                  to exit.
                </p>
                <p>
                  <span className="text-white font-semibold">vs Koyfin:</span> they're a
                  data-viz layer; this is an intelligence layer on top of data.
                </p>
                <p>
                  <span className="text-white font-semibold">vs Seeking Alpha:</span> they
                  aggregate opinions; this surfaces measurable signals with severity
                  tiers and evidence pointers.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-center gap-4 py-4 flex-wrap">
              <button
                onClick={() => setActiveTab("demo")}
                className="flex items-center gap-2 rounded-xl border-2 border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-[1.05] hover:bg-white/10"
                style={{ boxShadow: "0 0 20px rgba(255,255,255,0.05)" }}
              >
                <Monitor className="h-4 w-4" />
                Launch Live Demo
              </button>
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border-2 border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-[1.05] hover:bg-white/10"
                style={{ boxShadow: "0 0 20px rgba(255,255,255,0.05)" }}
              >
                <TrendingUp className="h-4 w-4" />
                Open in New Tab
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border-2 border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-[1.05] hover:bg-white/10"
                style={{ boxShadow: "0 0 20px rgba(255,255,255,0.05)" }}
              >
                <ExternalLink className="h-4 w-4" />
                View on GitHub
              </a>
            </div>

            {/* Footer note */}
            <div className="text-center pb-4">
              <p className="text-[11px] text-slate-600 leading-relaxed max-w-xl mx-auto">
                Live demo runs against static fixtures for cost reasons. The full product
                connects to Postgres + Redis + live market data. See{" "}
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white underline-offset-2 hover:underline"
                >
                  source
                </a>{" "}
                for the architecture walkthrough.
              </p>
              <p className="text-[11px] text-slate-600 mt-2 flex items-center justify-center gap-1">
                <FileText className="h-3 w-3" />
                <span>
                  Academic references: Cohen-Frazzini (SSRN 2758776), CMP (SSRN 1692517),
                  Hoberg-Phillips (SSRN 1023588, NBER w15991), LdP DSR (SSRN 3104847)
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
