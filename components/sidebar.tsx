"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
import { useState } from "react"
import { PAGE_META, RESUME_VIEWS } from "@/lib/page-meta"

interface NavChild {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  graphic?: string
  children?: NavChild[]  // grandchildren support
}

interface NavNode {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  children?: NavChild[]
  graphic?: string
}

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

const navNodes: NavNode[] = [
  { href: "/", label: PAGE_META["/"].title, icon: Home, graphic: PAGE_META["/"].graphic },
  {
    href: "/projects", label: PAGE_META["/projects"].title, icon: FolderKanban, graphic: PAGE_META["/projects"].graphic,
    children: [
      {
        href: "/flownode", label: PAGE_META["/flownode"].title, icon: GitBranch, graphic: PAGE_META["/flownode"].graphic,
        children: [
          { href: "/architecture", label: PAGE_META["/architecture"].title, icon: Network, graphic: PAGE_META["/architecture"].graphic },
          { href: "/service-graph", label: PAGE_META["/service-graph"].title, icon: Activity, graphic: PAGE_META["/service-graph"].graphic },
        ]
      },
      { href: "/thesis", label: PAGE_META["/thesis"].title, icon: BookOpen, graphic: PAGE_META["/thesis"].graphic },
      { href: "/subway", label: PAGE_META["/subway"].title, icon: Train, graphic: PAGE_META["/subway"].graphic },
    ]
  },
  {
    href: "/resume", label: PAGE_META["/resume"].title, icon: FileText, graphic: PAGE_META["/resume"].graphic,
    children: [
      { href: "/resume?view=website", label: RESUME_VIEWS.website.label, icon: Clock, graphic: RESUME_VIEWS.website.graphic },
      { href: "/resume?view=document", label: RESUME_VIEWS.document.label, icon: FileDown, graphic: RESUME_VIEWS.document.graphic },
      { href: "/resume?view=graph", label: RESUME_VIEWS.graph.label, icon: Share2, graphic: RESUME_VIEWS.graph.graphic },
    ]
  },
  { href: "/contact", label: PAGE_META["/contact"].title, icon: Mail, graphic: PAGE_META["/contact"].graphic },
]

function SubNode({ child, isActive, pathname, onNav }: { child: NavChild; isActive: boolean; pathname: string; onNav: () => void }) {
  const hasGrandchildren = child.children && child.children.length > 0
  const isGrandchildActive = hasGrandchildren && child.children!.some(gc => pathname === gc.href || pathname.startsWith(gc.href.split('?')[0]))
  const [expanded, setExpanded] = useState(isActive || isGrandchildActive)

  return (
    <div>
      <Link
        href={child.href}
        onClick={(e) => {
          if (hasGrandchildren) { e.preventDefault(); setExpanded(!expanded) }
          onNav()
        }}
        className={cn(
          "group flex items-center gap-2.5 rounded-md px-2 py-2 text-[11px] font-medium transition-all duration-200",
          "hover:scale-[1.12] active:scale-[1.2]",
          (isActive || isGrandchildActive) ? "bg-white/8 text-white" : "text-slate-600 hover:text-white hover:bg-white/4",
        )}
        style={{
          border: (isActive || isGrandchildActive) ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
          boxShadow: (isActive || isGrandchildActive) ? '0 0 8px rgba(255,255,255,0.06)' : 'none',
        }}
      >
        {child.graphic ? (
          <MiniGraphic type={child.graphic} isActive={isActive || !!isGrandchildActive} />
        ) : (
          <child.icon
            className={cn("h-3 w-3 flex-shrink-0", (isActive || isGrandchildActive) ? "text-white" : "text-slate-700")}
            style={(isActive || isGrandchildActive) ? { filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.5))' } : {}}
          />
        )}
        <span>{child.label}</span>
        {hasGrandchildren && (
          <span className={cn("ml-auto text-[9px] text-slate-700 transition-transform duration-200", expanded && "rotate-180")}>▾</span>
        )}
      </Link>

      {/* Grandchildren */}
      {hasGrandchildren && expanded && (
        <div className="ml-3 mt-0.5 rounded-md bg-black/20 p-1 space-y-0.5" style={{ border: '1px solid rgba(255,255,255,0.03)' }}>
          {child.children!.map(gc => {
            const gcActive = pathname === gc.href || pathname.startsWith(gc.href.split('?')[0])
            return (
              <Link
                key={gc.href}
                href={gc.href}
                onClick={onNav}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] font-medium transition-all duration-200",
                  "hover:scale-[1.1] active:scale-[1.15]",
                  gcActive ? "bg-white/8 text-white" : "text-slate-600 hover:text-white hover:bg-white/4",
                )}
                style={{
                  border: gcActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                  boxShadow: gcActive ? '0 0 6px rgba(255,255,255,0.04)' : 'none',
                }}
              >
                {gc.graphic ? (
                  <MiniGraphic type={gc.graphic} isActive={gcActive} />
                ) : (
                  <gc.icon
                    className={cn("h-2.5 w-2.5 flex-shrink-0", gcActive ? "text-white" : "text-slate-700")}
                    style={gcActive ? { filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.5))' } : {}}
                  />
                )}
                <span>{gc.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function NavNodeWidget({ node, pathname, onNav }: { node: NavNode; pathname: string; onNav: () => void }) {
  const isActive = pathname === node.href
  const hasChildren = node.children && node.children.length > 0
  const isChildActive = hasChildren && node.children!.some(c =>
    pathname === c.href || pathname.startsWith(c.href.split('?')[0])
    || (c.children && c.children.some(gc => pathname === gc.href || pathname.startsWith(gc.href.split('?')[0])))
  )
  const [expanded, setExpanded] = useState(isActive || isChildActive)

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
      {/* Parent node header */}
      <Link
        href={node.href}
        onClick={() => { if (hasChildren) setExpanded(!expanded); onNav() }}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200",
          (isActive || isChildActive) ? "text-white" : "text-slate-500 hover:text-white",
        )}
      >
        {node.graphic ? (
          <MiniGraphic type={node.graphic} isActive={isActive || !!isChildActive} />
        ) : (
          <node.icon
            className={cn("h-5 w-5 flex-shrink-0", (isActive || isChildActive) ? "text-white" : "text-slate-600")}
            style={(isActive || isChildActive) ? { filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.6))' } : {}}
          />
        )}
        <span>{node.label}</span>
        {isActive && !hasChildren && (
          <div className="ml-auto h-2 w-2 rounded-full bg-white" style={{ boxShadow: '0 0 6px #fff, 0 0 12px #fff' }} />
        )}
        {hasChildren && (
          <span className={cn("ml-auto text-[10px] text-slate-700 transition-transform duration-200", expanded && "rotate-180")}>▾</span>
        )}
      </Link>

      {/* Children container — visually nested inside parent */}
      {hasChildren && expanded && (
        <div className="mx-2 mb-2 rounded-md bg-black/30 p-1.5 space-y-0.5" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          {node.children!.map(child => (
            <SubNode
              key={child.href}
              child={child}
              isActive={pathname === child.href || pathname.startsWith(child.href.split('?')[0])}
              pathname={pathname}
              onNav={onNav}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
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
          <div className="flex items-center border-b border-white/5 px-5 py-5">
            <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
              <div className="h-14 w-14 rounded-full p-[2px] transition-all duration-300 hover:scale-[2.0] cursor-pointer" style={{ background: 'rgba(255,255,255,0.25)', boxShadow: '0 0 20px rgba(255,255,255,0.25), 0 0 40px rgba(255,255,255,0.08)', animation: 'sidebarPulse 2s ease-in-out infinite' }}>
                <div className="h-full w-full rounded-full overflow-hidden border-[2px] border-[#0a0a1a]">
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
            {navNodes.map(node => (
              <NavNodeWidget key={node.href} node={node} pathname={pathname} onNav={() => setMobileMenuOpen(false)} />
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
