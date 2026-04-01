"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Suspense } from "react"
import {
  Home,
  GitBranch,
  FileText,
  Network,
  FolderKanban,
  Mail,
  Menu,
  X,
  Activity,
  BookOpen,
  Train,
  Clock,
  FileDown,
  Share2,
  Layers,
  Globe,
} from "lucide-react"
import { useState, useEffect } from "react"
import { SITE_TREE, type SiteNode } from "@/lib/site-tree"

/* ── Tiny simulated graphics for each nav item ── */
function MiniGraphic({ type, isActive }: { type: string; isActive: boolean }) {
  const glow = isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)'
  const stroke = isActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'
  const dot = isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)'

  switch (type) {
    case "architecture":
      // Mini node graph — 3 nodes connected
      return (
        <svg width="28" height="18" viewBox="0 0 28 18" className="flex-shrink-0">
          <line x1="7" y1="5" x2="14" y2="13" stroke={stroke} strokeWidth="1" />
          <line x1="21" y1="5" x2="14" y2="13" stroke={stroke} strokeWidth="1" />
          <rect x="4" y="2" width="6" height="6" rx="1.5" fill="none" stroke={stroke} strokeWidth="1" style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <rect x="18" y="2" width="6" height="6" rx="1.5" fill="none" stroke={stroke} strokeWidth="1" style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <rect x="11" y="10" width="6" height="6" rx="1.5" fill="none" stroke={stroke} strokeWidth="1" style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <circle cx="7" cy="5" r="1" fill={dot} />
          <circle cx="21" cy="5" r="1" fill={dot} />
          <circle cx="14" cy="13" r="1" fill={dot} />
        </svg>
      )

    case "service-graph":
      // Mini mesh — interconnected dots
      return (
        <svg width="28" height="18" viewBox="0 0 28 18" className="flex-shrink-0">
          <line x1="6" y1="9" x2="14" y2="4" stroke={stroke} strokeWidth="0.8" />
          <line x1="6" y1="9" x2="14" y2="14" stroke={stroke} strokeWidth="0.8" />
          <line x1="14" y1="4" x2="22" y2="9" stroke={stroke} strokeWidth="0.8" />
          <line x1="14" y1="14" x2="22" y2="9" stroke={stroke} strokeWidth="0.8" />
          <line x1="14" y1="4" x2="14" y2="14" stroke={stroke} strokeWidth="0.5" strokeDasharray="1.5 1.5" />
          <circle cx="6" cy="9" r="2.5" fill="none" stroke={stroke} strokeWidth="1" style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <circle cx="14" cy="4" r="2" fill="none" stroke={stroke} strokeWidth="1" />
          <circle cx="14" cy="14" r="2" fill="none" stroke={stroke} strokeWidth="1" />
          <circle cx="22" cy="9" r="2.5" fill="none" stroke={stroke} strokeWidth="1" style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <circle cx="6" cy="9" r="1" fill={dot} />
          <circle cx="22" cy="9" r="1" fill={dot} />
        </svg>
      )

    case "timeline":
      // Mini horizontal timeline with dots
      return (
        <svg width="28" height="18" viewBox="0 0 28 18" className="flex-shrink-0">
          <line x1="3" y1="9" x2="25" y2="9" stroke={stroke} strokeWidth="1" />
          <circle cx="6" cy="9" r="2" fill={dot} style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <circle cx="14" cy="9" r="2" fill={dot} style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <circle cx="22" cy="9" r="2" fill={dot} style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <line x1="6" y1="5" x2="6" y2="7" stroke={stroke} strokeWidth="0.8" />
          <line x1="14" y1="5" x2="14" y2="7" stroke={stroke} strokeWidth="0.8" />
          <line x1="22" y1="5" x2="22" y2="7" stroke={stroke} strokeWidth="0.8" />
          <rect x="4" y="2" width="4" height="2" rx="0.5" fill={stroke} opacity="0.4" />
          <rect x="11" y="2" width="6" height="2" rx="0.5" fill={stroke} opacity="0.4" />
          <rect x="20" y="2" width="4" height="2" rx="0.5" fill={stroke} opacity="0.4" />
        </svg>
      )

    case "document":
      // Mini document with lines
      return (
        <svg width="28" height="18" viewBox="0 0 28 18" className="flex-shrink-0">
          <rect x="7" y="1" width="14" height="16" rx="1.5" fill="none" stroke={stroke} strokeWidth="1" style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <line x1="10" y1="5" x2="18" y2="5" stroke={stroke} strokeWidth="1" opacity="0.6" />
          <line x1="10" y1="8" x2="16" y2="8" stroke={stroke} strokeWidth="1" opacity="0.5" />
          <line x1="10" y1="11" x2="18" y2="11" stroke={stroke} strokeWidth="1" opacity="0.4" />
          <line x1="10" y1="14" x2="14" y2="14" stroke={stroke} strokeWidth="1" opacity="0.3" />
        </svg>
      )

    case "node-graph":
      // Mini flow graph — nodes with arrows
      return (
        <svg width="28" height="18" viewBox="0 0 28 18" className="flex-shrink-0">
          <line x1="8" y1="5" x2="14" y2="5" stroke={stroke} strokeWidth="0.8" />
          <line x1="14" y1="5" x2="20" y2="3" stroke={stroke} strokeWidth="0.8" />
          <line x1="14" y1="5" x2="20" y2="9" stroke={stroke} strokeWidth="0.8" />
          <line x1="20" y1="9" x2="25" y2="13" stroke={stroke} strokeWidth="0.8" />
          <circle cx="5" cy="5" r="2.5" fill="none" stroke={stroke} strokeWidth="1" style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <circle cx="14" cy="5" r="2" fill="none" stroke={stroke} strokeWidth="1" />
          <circle cx="22" cy="3" r="1.5" fill="none" stroke={stroke} strokeWidth="1" />
          <circle cx="22" cy="9" r="1.5" fill="none" stroke={stroke} strokeWidth="1" />
          <circle cx="5" cy="5" r="0.8" fill={dot} />
          <circle cx="14" cy="5" r="0.8" fill={dot} />
        </svg>
      )

    case "flownode":
      // Mini DAG — stacked nodes with downward flow
      return (
        <svg width="28" height="18" viewBox="0 0 28 18" className="flex-shrink-0">
          <line x1="14" y1="5" x2="8" y2="13" stroke={stroke} strokeWidth="0.8" />
          <line x1="14" y1="5" x2="20" y2="13" stroke={stroke} strokeWidth="0.8" />
          <rect x="10" y="1" width="8" height="6" rx="1.5" fill="none" stroke={stroke} strokeWidth="1" style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <rect x="3" y="11" width="8" height="5" rx="1.5" fill="none" stroke={stroke} strokeWidth="1" />
          <rect x="17" y="11" width="8" height="5" rx="1.5" fill="none" stroke={stroke} strokeWidth="1" />
          <circle cx="14" cy="4" r="1" fill={dot} />
          <circle cx="7" cy="13.5" r="0.8" fill={dot} />
          <circle cx="21" cy="13.5" r="0.8" fill={dot} />
        </svg>
      )

    case "thesis":
      // Mini 3D sphere (Bubble concept)
      return (
        <svg width="28" height="18" viewBox="0 0 28 18" className="flex-shrink-0">
          <circle cx="14" cy="9" r="7" fill="none" stroke={stroke} strokeWidth="1" style={{ filter: `drop-shadow(0 0 3px ${glow})` }} />
          <ellipse cx="14" cy="9" rx="7" ry="3" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
          <ellipse cx="14" cy="9" rx="3" ry="7" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
          <circle cx="14" cy="9" r="1.5" fill={dot} style={{ filter: `drop-shadow(0 0 3px ${glow})` }} />
          <circle cx="11" cy="6" r="0.6" fill={dot} opacity="0.4" />
          <circle cx="17" cy="12" r="0.6" fill={dot} opacity="0.4" />
        </svg>
      )

    case "subway":
      // Mini subway lines — colored paths
      return (
        <svg width="28" height="18" viewBox="0 0 28 18" className="flex-shrink-0">
          <path d="M3 4 L10 4 L14 9 L25 9" fill="none" stroke={isActive ? '#EE352E' : 'rgba(238,53,46,0.4)'} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 9 L25 9" fill="none" stroke={isActive ? '#00933C' : 'rgba(0,147,60,0.4)'} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 14 L10 14 L14 9 L25 9" fill="none" stroke={isActive ? '#2850AD' : 'rgba(40,80,173,0.4)'} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="14" cy="9" r="2" fill="white" stroke={stroke} strokeWidth="0.8" style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <circle cx="7" cy="4" r="1.2" fill="white" stroke="rgba(238,53,46,0.6)" strokeWidth="0.6" />
          <circle cx="7" cy="14" r="1.2" fill="white" stroke="rgba(40,80,173,0.6)" strokeWidth="0.6" />
        </svg>
      )

    case "home":
      // Mini dashboard grid
      return (
        <svg width="28" height="18" viewBox="0 0 28 18" className="flex-shrink-0">
          <rect x="2" y="2" width="10" height="6" rx="1.5" fill="none" stroke={stroke} strokeWidth="1" style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <rect x="15" y="2" width="10" height="6" rx="1.5" fill="none" stroke={stroke} strokeWidth="1" />
          <rect x="2" y="10" width="10" height="6" rx="1.5" fill="none" stroke={stroke} strokeWidth="1" />
          <rect x="15" y="10" width="10" height="6" rx="1.5" fill="none" stroke={stroke} strokeWidth="1" style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <circle cx="7" cy="5" r="0.8" fill={dot} />
          <circle cx="20" cy="13" r="0.8" fill={dot} />
        </svg>
      )

    case "projects":
      // Mini card stack
      return (
        <svg width="28" height="18" viewBox="0 0 28 18" className="flex-shrink-0">
          <rect x="5" y="3" width="18" height="12" rx="1.5" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.3" />
          <rect x="4" y="2" width="18" height="12" rx="1.5" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.5" />
          <rect x="3" y="1" width="18" height="12" rx="1.5" fill="none" stroke={stroke} strokeWidth="1" style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <line x1="6" y1="5" x2="14" y2="5" stroke={stroke} strokeWidth="0.8" opacity="0.5" />
          <line x1="6" y1="8" x2="12" y2="8" stroke={stroke} strokeWidth="0.6" opacity="0.3" />
          <circle cx="18" cy="5" r="1" fill={dot} />
        </svg>
      )

    case "contact":
      // Mini envelope
      return (
        <svg width="28" height="18" viewBox="0 0 28 18" className="flex-shrink-0">
          <rect x="3" y="3" width="22" height="12" rx="1.5" fill="none" stroke={stroke} strokeWidth="1" style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <polyline points="3,3 14,10 25,3" fill="none" stroke={stroke} strokeWidth="0.8" />
          <line x1="3" y1="15" x2="10" y2="9" stroke={stroke} strokeWidth="0.5" opacity="0.3" />
          <line x1="25" y1="15" x2="18" y2="9" stroke={stroke} strokeWidth="0.5" opacity="0.3" />
          <circle cx="14" cy="7" r="0.8" fill={dot} />
        </svg>
      )

    case "resume":
      // Mini resume doc with timeline accent
      return (
        <svg width="28" height="18" viewBox="0 0 28 18" className="flex-shrink-0">
          <rect x="6" y="1" width="16" height="16" rx="1.5" fill="none" stroke={stroke} strokeWidth="1" style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
          <circle cx="11" cy="5" r="2" fill="none" stroke={stroke} strokeWidth="0.8" />
          <line x1="14" y1="4" x2="19" y2="4" stroke={stroke} strokeWidth="0.8" opacity="0.6" />
          <line x1="14" y1="6" x2="17" y2="6" stroke={stroke} strokeWidth="0.6" opacity="0.4" />
          <line x1="9" y1="10" x2="19" y2="10" stroke={stroke} strokeWidth="0.8" opacity="0.5" />
          <line x1="9" y1="12.5" x2="17" y2="12.5" stroke={stroke} strokeWidth="0.6" opacity="0.3" />
          <line x1="9" y1="15" x2="15" y2="15" stroke={stroke} strokeWidth="0.6" opacity="0.2" />
        </svg>
      )

    default:
      return null
  }
}

/* Nav is driven entirely by SITE_TREE — no duplication */

/** Check if ANY descendant is active */
function isDescendantActive(node: SiteNode, pathname: string, fullPath: string): boolean {
  if (isNavActive(node.href, pathname, fullPath)) return true
  if (node.children) return node.children.some(c => isDescendantActive(c, pathname, fullPath))
  return false
}

/** Recursive nav node — handles any depth of nesting */
function TreeNode({ node, depth, pathname, fullPath, onNav }: { node: SiteNode; depth: number; pathname: string; fullPath: string; onNav: () => void }) {
  const isActive = isNavActive(node.href, pathname, fullPath)
  const hasChildren = node.children && node.children.length > 0
  const isChildActive = hasChildren && node.children!.some(c => isDescendantActive(c, pathname, fullPath))
  const shouldExpand = isActive || !!isChildActive
  const [expanded, setExpanded] = useState(shouldExpand)

  useEffect(() => { if (shouldExpand) setExpanded(true) }, [shouldExpand])

  // Sizing based on depth
  const isRoot = depth === 0
  const textSize = isRoot ? "text-sm" : depth === 1 ? "text-[11px]" : "text-[10px]"
  const py = isRoot ? "py-2.5" : "py-2"
  const px = isRoot ? "px-3" : "px-2"
  const gap = isRoot ? "gap-3" : "gap-2.5"

  if (isRoot) {
    // Top-level node — full card style
    return (
      <div
        className={cn(
          "rounded-lg mb-2 transition-all duration-200 overflow-hidden",
          "hover:scale-[1.03]",
          (isActive || isChildActive) ? "bg-white/4" : "hover:bg-white/2",
        )}
        style={{
          border: (isActive || isChildActive || expanded) ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
          boxShadow: (isActive || isChildActive) ? '0 0 12px rgba(255,255,255,0.05)' : 'none',
        }}
      >
        <Link
          href={node.href}
          onClick={() => { if (hasChildren) setExpanded(!expanded); onNav() }}
          className={cn(
            "flex items-center", gap, px, py, "font-medium transition-all duration-200",
            textSize,
            (isActive || isChildActive) ? "text-white" : "text-slate-500 hover:text-white",
          )}
        >
          <MiniGraphic type={node.graphic} isActive={isActive || !!isChildActive} />
          <span>{node.title}</span>
          {isActive && !hasChildren && (
            <div className="ml-auto h-2 w-2 rounded-full bg-white" style={{ boxShadow: '0 0 6px #fff, 0 0 12px #fff' }} />
          )}
          {hasChildren && (
            <span className={cn("ml-auto text-[10px] text-slate-700 transition-transform duration-200", expanded && "rotate-180")}>▾</span>
          )}
        </Link>

        {hasChildren && expanded && (
          <div className="mx-2 mb-2 rounded-md bg-black/30 p-1.5 space-y-0.5" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            {node.children!.map(child => (
              <TreeNode key={child.href} node={child} depth={1} pathname={pathname} fullPath={fullPath} onNav={onNav} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Nested node (child / grandchild / any depth)
  return (
    <div>
      <Link
        href={node.href}
        onClick={() => { if (hasChildren) setExpanded(!expanded); onNav() }}
        className={cn(
          "group flex items-center", gap, "rounded-md", px, py, textSize, "font-medium transition-all duration-200",
          "hover:scale-[1.12] active:scale-[1.2]",
          (isActive || isChildActive) ? "bg-white/8 text-white" : "text-slate-600 hover:text-white hover:bg-white/4",
        )}
        style={{
          border: (isActive || isChildActive) ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
          boxShadow: (isActive || isChildActive) ? '0 0 8px rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <MiniGraphic type={node.graphic} isActive={isActive || !!isChildActive} />
        <span>{node.title}</span>
        {hasChildren && (
          <span className={cn("ml-auto text-[9px] text-slate-700 transition-transform duration-200", expanded && "rotate-180")}>▾</span>
        )}
      </Link>

      {hasChildren && expanded && (
        <div className="ml-3 mt-0.5 rounded-md bg-black/20 p-1 space-y-0.5" style={{ border: '1px solid rgba(255,255,255,0.03)' }}>
          {node.children!.map(child => (
            <TreeNode key={child.href} node={child} depth={depth + 1} pathname={pathname} fullPath={fullPath} onNav={onNav} />
          ))}
        </div>
      )}
    </div>
  )
}

/** Check if a nav href matches the current location (handles query params) */
function isNavActive(href: string, pathname: string, fullPath: string): boolean {
  if (href.includes('?')) {
    // Has query params — must match exactly
    return fullPath === href
  }
  // No query params — match pathname exactly
  return pathname === href
}

export function Sidebar() {
  return (
    <Suspense fallback={null}>
      <SidebarInner />
    </Suspense>
  )
}

function SidebarInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const fullPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-white/10 md:hidden"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
      </button>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-80 bg-sidebar border-r border-white/5 transition-transform duration-300 md:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center border-b border-white/5 px-5 py-6">
            <Link href="/" className="flex flex-col items-center gap-3 w-full" onClick={() => setMobileMenuOpen(false)}>
              <div className="h-40 w-40 rounded-full p-[3px] transition-all duration-500 hover:scale-[2.0] cursor-pointer origin-center z-50 relative" style={{ background: 'rgba(255,255,255,0.3)', boxShadow: '0 0 35px rgba(255,255,255,0.35), 0 0 70px rgba(255,255,255,0.12)', animation: 'sidebarPulse 2s ease-in-out infinite' }}>
                <div className="h-full w-full rounded-full overflow-hidden border-[3px] border-[#0a0a1a]">
                  <img src="/aaron-photo.jpg" alt="Aaron Stone" className="h-full w-full object-cover" />
                </div>
              </div>
              <style dangerouslySetInnerHTML={{ __html: `@keyframes sidebarPulse { 0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.25), 0 0 40px rgba(255,255,255,0.08); } 50% { box-shadow: 0 0 40px rgba(255,255,255,0.45), 0 0 70px rgba(255,255,255,0.15); } }` }} />
              <span className="text-xl tracking-wide transition-all duration-300 hover:scale-[1.2] cursor-pointer" style={{ fontFamily: "var(--font-comfortaa), 'Comfortaa', system-ui, sans-serif", fontWeight: 300, color: '#fff', textShadow: '0 0 7px #fff, 0 0 15px #fff, 0 0 30px #fff, 0 0 50px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}>
                aaron.stone
              </span>
            </Link>
          </div>

          {/* Node Tree */}
          <nav className="flex-1 overflow-y-auto px-3 py-3">
            {SITE_TREE.map(node => (
              <TreeNode key={node.href} node={node} depth={0} pathname={pathname} fullPath={fullPath} onNav={() => setMobileMenuOpen(false)} />
            ))}
          </nav>

          {/* Status Node */}
          <div className="border-t border-white/5 p-3">
            <div
              className="rounded-lg overflow-hidden transition-all duration-200 hover:scale-[1.03]"
              style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-white" style={{ boxShadow: '0 0 4px #fff, 0 0 8px #fff' }} />
                <span className="text-xs font-medium text-white" style={{ textShadow: '0 0 6px rgba(255,255,255,0.3)' }}>Metro New York Area</span>
              </div>
              <div className="mx-2 mb-2 rounded-md bg-black/30 p-1.5 space-y-0.5" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                <a href="https://linkedin.com/in/aaron-stone-2b6994141" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[11px] text-slate-600 rounded px-2 py-1 hover:scale-[1.08] hover:text-white transition-all">
                  <Globe className="h-3 w-3 flex-shrink-0" />LinkedIn
                </a>
                <a href="https://github.com/aaronstone2" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[11px] text-slate-600 rounded px-2 py-1 hover:scale-[1.08] hover:text-white transition-all">
                  <Layers className="h-3 w-3 flex-shrink-0" />GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
