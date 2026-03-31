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
  ChevronDown,
} from "lucide-react"
import { useState } from "react"

interface NavNode {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  children?: { href: string; label: string }[]
}

const navNodes: NavNode[] = [
  { href: "/", label: "Home", icon: Home },
  {
    href: "/flownode", label: "FlowNode", icon: GitBranch,
    children: [
      { href: "/architecture", label: "Architecture" },
      { href: "/service-graph", label: "Service Graph" },
    ]
  },
  {
    href: "/resume", label: "Resume", icon: FileText,
    children: [
      { href: "/thesis", label: "Thesis" },
    ]
  },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/subway", label: "Subway", icon: Train },
  { href: "/contact", label: "Contact", icon: Mail },
]

function NavNodeItem({ node, pathname, onNavigate }: { node: NavNode; pathname: string; onNavigate: () => void }) {
  const isActive = pathname === node.href
  const hasChildren = node.children && node.children.length > 0
  const isChildActive = hasChildren && node.children!.some(c => pathname === c.href)
  const [expanded, setExpanded] = useState(isActive || isChildActive)
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded)
      setClicked(true)
      setTimeout(() => setClicked(false), 300)
    }
    onNavigate()
  }

  return (
    <div className="mb-1">
      {/* Parent node */}
      <Link
        href={node.href}
        onClick={handleClick}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          isActive || isChildActive
            ? "bg-white/5 text-white"
            : "text-slate-500 hover:text-white",
          clicked ? "scale-[1.15]" : "hover:scale-[1.06]",
        )}
        style={{
          border: isActive || isChildActive ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
          boxShadow: isActive || isChildActive ? '0 0 12px rgba(255,255,255,0.08)' : clicked ? '0 0 25px rgba(255,255,255,0.3)' : 'none',
          transition: 'all 0.2s',
        }}
      >
        <node.icon
          className={cn("h-5 w-5", isActive || isChildActive ? "text-white" : "text-slate-600")}
          style={isActive || isChildActive ? { filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.6))' } : {}}
        />
        <span>{node.label}</span>
        {isActive && (
          <div className="ml-auto h-2.5 w-2.5 rounded-full bg-white" style={{ boxShadow: '0 0 6px #fff, 0 0 12px #fff' }} />
        )}
        {hasChildren && !isActive && (
          <ChevronDown className={cn("ml-auto h-4 w-4 text-slate-600 transition-transform duration-200", expanded && "rotate-180")} />
        )}
      </Link>

      {/* Subnodes */}
      {hasChildren && expanded && (
        <div className="ml-4 mt-1 pl-4 space-y-1" style={{ borderLeft: '2px solid rgba(255,255,255,0.06)' }}>
          {node.children!.map(child => {
            const isSubActive = pathname === child.href
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-all duration-200",
                  isSubActive
                    ? "bg-white/5 text-white"
                    : "text-slate-600 hover:text-white",
                  "hover:scale-[1.1] active:scale-[1.2]",
                )}
                style={{
                  border: isSubActive ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
                  boxShadow: isSubActive ? '0 0 10px rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <div
                  className={cn("h-1.5 w-1.5 rounded-full", isSubActive ? "bg-white" : "bg-slate-700")}
                  style={isSubActive ? { boxShadow: '0 0 4px #fff, 0 0 8px #fff' } : {}}
                />
                <span>{child.label}</span>
              </Link>
            )
          })}
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
      {/* Mobile menu button */}
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
              <div className="h-16 w-16 rounded-full p-[2px] transition-all duration-300 hover:scale-[2.0] cursor-pointer" style={{ background: 'rgba(255,255,255,0.25)', boxShadow: '0 0 20px rgba(255,255,255,0.25), 0 0 40px rgba(255,255,255,0.08)', animation: 'sidebarPulse 2s ease-in-out infinite' }}>
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

          {/* Navigation Nodes */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {navNodes.map(node => (
              <NavNodeItem
                key={node.href}
                node={node}
                pathname={pathname}
                onNavigate={() => setMobileMenuOpen(false)}
              />
            ))}
          </nav>

          {/* Footer — as a node */}
          <div className="border-t border-white/5 p-3">
            <div
              className="rounded-lg border border-white/8 p-3 transition-all duration-200 hover:scale-[1.04] hover:border-white/15 cursor-default"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <p className="text-xs text-slate-400 font-mono mb-1">
                <span className="text-white" style={{ textShadow: '0 0 8px rgba(255,255,255,0.4)' }}>STATUS</span>
              </p>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" style={{ boxShadow: '0 0 4px #fff, 0 0 8px #fff' }} />
                <span className="text-xs text-slate-300">Open to work</span>
              </div>
              {/* Subnodes */}
              <div className="space-y-1 ml-2 pl-2" style={{ borderLeft: '2px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 rounded px-2 py-1 hover:scale-[1.08] hover:text-white transition-all cursor-default">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  NYC Fintech / Tech
                </div>
                <a
                  href="https://linkedin.com/in/aaron-stone-2b6994141"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[11px] text-slate-500 rounded px-2 py-1 hover:scale-[1.08] hover:text-white transition-all"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/aaronstone2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[11px] text-slate-500 rounded px-2 py-1 hover:scale-[1.08] hover:text-white transition-all"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
