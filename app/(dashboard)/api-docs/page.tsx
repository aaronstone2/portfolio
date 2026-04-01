"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react"

interface Endpoint {
  method: string
  path: string
  summary: string
  description: string
  tag: string
  parameters?: Array<{ name: string; in: string; schema: { type: string; default?: number }; description: string }>
  requestBody?: unknown
  responses: Record<string, { description: string; content?: unknown }>
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    get: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    post: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    put: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    delete: "bg-red-500/20 text-red-400 border-red-500/30",
  }
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colors[method] || "bg-white/10 text-white border-white/20"}`}>
      {method}
    </span>
  )
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyPath = () => {
    navigator.clipboard.writeText(endpoint.path)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      className="rounded-lg border border-white/10 bg-card/50 overflow-hidden transition-all duration-200 hover:border-white/20"
      style={{ boxShadow: expanded ? '0 0 15px rgba(255,255,255,0.03)' : 'none' }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-white/3"
      >
        {expanded ? <ChevronDown className="h-4 w-4 text-slate-500 flex-shrink-0" /> : <ChevronRight className="h-4 w-4 text-slate-500 flex-shrink-0" />}
        <MethodBadge method={endpoint.method} />
        <code className="text-sm font-mono text-white flex-1">{endpoint.path}</code>
        <span className="text-xs text-slate-500 hidden sm:block">{endpoint.summary}</span>
      </button>

      {expanded && (
        <div className="border-t border-white/5 px-4 py-4 space-y-4">
          <p className="text-sm text-slate-400">{endpoint.description}</p>

          {/* Path + copy */}
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-md bg-black/50 border border-white/10 px-3 py-2 text-xs font-mono text-slate-300">
              {endpoint.method.toUpperCase()} {endpoint.path}
            </code>
            <button onClick={copyPath} className="rounded-md bg-white/5 border border-white/10 p-2 text-slate-400 hover:text-white transition-all hover:scale-110">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Parameters */}
          {endpoint.parameters && endpoint.parameters.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Parameters</h4>
              <div className="rounded-md bg-black/30 border border-white/5 divide-y divide-white/5">
                {endpoint.parameters.map((param) => (
                  <div key={param.name} className="flex items-center gap-3 px-3 py-2 text-xs">
                    <code className="font-mono text-white font-semibold">{param.name}</code>
                    <span className="text-slate-600">{param.in}</span>
                    <span className="text-slate-500">{param.schema.type}</span>
                    <span className="text-slate-400 ml-auto">{param.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responses */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Responses</h4>
            <div className="flex gap-2">
              {Object.entries(endpoint.responses).map(([code, resp]) => (
                <div key={code} className={`rounded-md border px-2.5 py-1 text-xs ${
                  code.startsWith('2') ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                  code.startsWith('4') ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
                  'border-red-500/30 text-red-400 bg-red-500/10'
                }`}>
                  <span className="font-mono font-bold">{code}</span>
                  <span className="ml-1.5 text-slate-400">{resp.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<Record<string, unknown> | null>(null)
  const [endpoints, setEndpoints] = useState<Endpoint[]>([])
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    fetch("/flownode-openapi.json")
      .then(r => r.json())
      .then((data) => {
        setSpec(data)
        // Parse endpoints
        const eps: Endpoint[] = []
        const paths = data.paths as Record<string, Record<string, unknown>>
        for (const [path, methods] of Object.entries(paths)) {
          for (const [method, details] of Object.entries(methods)) {
            const d = details as Record<string, unknown>
            eps.push({
              method,
              path,
              summary: (d.summary as string) || "",
              description: (d.description as string) || "",
              tag: ((d.tags as string[]) || [])[0] || "Other",
              parameters: d.parameters as Endpoint["parameters"],
              requestBody: d.requestBody,
              responses: d.responses as Record<string, { description: string }>,
            })
          }
        }
        setEndpoints(eps)
        setTags([...new Set(eps.map(e => e.tag))])
      })
  }, [])

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <PageHeader path="/api-docs" />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 md:p-10">
          {/* Info */}
          {spec && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="rounded-md bg-white/10 border border-white/20 px-2 py-0.5 text-xs font-mono text-white">
                  v{(spec.info as Record<string, string>)?.version || "1.0.0"}
                </span>
                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-xs text-emerald-400">
                  OpenAPI 3.0
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-2xl">
                {(spec.info as Record<string, string>)?.description}
              </p>
            </div>
          )}

          {/* Endpoints grouped by tag */}
          {tags.map(tag => (
            <section key={tag} className="mb-8">
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span style={{ textShadow: '0 0 8px rgba(255,255,255,0.3)' }}>{tag}</span>
                <span className="text-[10px] text-slate-600 font-normal">
                  {endpoints.filter(e => e.tag === tag).length} endpoint{endpoints.filter(e => e.tag === tag).length > 1 ? 's' : ''}
                </span>
              </h2>
              <div className="space-y-2">
                {endpoints.filter(e => e.tag === tag).map(ep => (
                  <EndpointCard key={`${ep.method}-${ep.path}`} endpoint={ep} />
                ))}
              </div>
            </section>
          ))}

          {!spec && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white mx-auto" />
                <p className="text-sm text-slate-500">Loading API spec...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
