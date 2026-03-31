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
  Map,
} from "lucide-react"
import { useState } from "react"

interface NavChild {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
}

interface NavNode {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  children?: NavChild[]
}

const navNodes: NavNode[] = [
  { href: "/", label: "Home", icon: Home },
  {
    href: "/flownode", label: "FlowNode", icon: GitBranch,
    children: [
      { href: "/architecture", label: "Architecture", icon: Network },
      { href: "/service-graph", label: "Service Graph", icon: Activity },
    ]
  },
  {
    href: "/resume", label: "Resume", icon: FileText,
    children: [
      { href: "/resume?view=website", label: "Timeline", icon: Clock },
      { href: "/resume?view=document", label: "Document", icon: FileDown },
      { href: "/resume?view=graph", label: "Node Graph", icon: Share2 },
    ]
  },
  {
    href: "/projects", label: "Projects", icon: FolderKanban,
    children: [
      { href: "/flownode", label: "FlowNode", icon: GitBranch },
      { href: "/service-graph", label: "Service Graph", icon: Activity },
      { href: "/thesis", label: "Bubble / Thesis", icon: BookOpen },
      { href: "/subway", label: "Subway Map", icon: Train },
    ]
  },
  { href: "/subway", label: "Subway", icon: Train },
  { href: "/contact", label: "Contact", icon: Mail },
]

function SubNode({ child, isActive, onNav }: { child: NavChild; isActive: boolean; onNav: () => void }) {
  return (
    <Link
      href={child.href}
      onClick={onNav}
      className={cn(
        "group flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-medium transition-all duration-200",
        "hover:scale-[1.12] active:scale-[1.2]",
        isActive ? "bg-white/8 text-white" : "text-slate-600 hover:text-white hover:bg-white/4",
      )}
      style={{
        border: isActive ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
        boxShadow: isActive ? '0 0 8px rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <child.icon
        className={cn("h-3 w-3 flex-shrink-0", isActive ? "text-white" : "text-slate-700")}
        style={isActive ? { filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.5))' } : {}}
      />
      <span>{child.label}</span>
    </Link>
  )
}

function NavNodeWidget({ node, pathname, onNav }: { node: NavNode; pathname: string; onNav: () => void }) {
  const isActive = pathname === node.href
  const hasChildren = node.children && node.children.length > 0
  const isChildActive = hasChildren && node.children!.some(c => pathname === c.href || pathname.startsWith(c.href.split('?')[0]))
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
        <node.icon
          className={cn("h-5 w-5 flex-shrink-0", (isActive || isChildActive) ? "text-white" : "text-slate-600")}
          style={(isActive || isChildActive) ? { filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.6))' } : {}}
        />
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
