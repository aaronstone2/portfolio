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
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/flownode", label: "FlowNode", icon: GitBranch },
  { href: "/service-graph", label: "Service Graph", icon: Activity },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/architecture", label: "Architecture", icon: Network },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/thesis", label: "Thesis", icon: BookOpen },
  { href: "/subway", label: "Subway", icon: Train },
  { href: "/contact", label: "Contact", icon: Mail },
]

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
        {mobileMenuOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-white/5 transition-transform duration-300 md:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center border-b border-white/5 px-5 py-5">
            <Link
              href="/"
              className="flex items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="h-16 w-16 rounded-full p-[2px] transition-all duration-300 hover:scale-[2.0] cursor-pointer" style={{ background: 'rgba(255,255,255,0.25)', boxShadow: '0 0 20px rgba(255,255,255,0.25), 0 0 40px rgba(255,255,255,0.08)', animation: 'sidebarPulse 2s ease-in-out infinite' }}>
                <div className="h-full w-full rounded-full overflow-hidden border-[2px] border-[#0a0a1a]">
                  <img src="/aaron-photo.jpg" alt="Aaron Stone" className="h-full w-full object-cover" />
                </div>
              </div>
              <style dangerouslySetInnerHTML={{ __html: `@keyframes sidebarPulse { 0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.25), 0 0 40px rgba(255,255,255,0.08); } 50% { box-shadow: 0 0 40px rgba(255,255,255,0.45), 0 0 70px rgba(255,255,255,0.15); } }` }} />
              <span className="text-2xl tracking-wide transition-all duration-300 hover:scale-[1.2] cursor-pointer" style={{ fontFamily: "'Comfortaa', 'Nunito', system-ui, sans-serif", fontWeight: 300, color: '#fff', textShadow: '0 0 7px #fff, 0 0 15px #fff, 0 0 30px #fff, 0 0 50px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}>
                aaron.stone
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.05]",
                    isActive
                      ? "bg-white/5 border border-white/15 text-white"
                      : "text-slate-500 hover:bg-white/5 hover:text-white border border-transparent"
                  )}
                  style={isActive ? { boxShadow: '0 0 10px rgba(255,255,255,0.08)' } : {}}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-white" : "text-slate-600"
                    )}
                    style={isActive ? { filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' } : {}}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-white" style={{ boxShadow: '0 0 6px #fff, 0 0 12px #fff' }} />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-white/5 p-4">
            <div className="rounded-lg bg-white/3 border border-white/8 p-3">
              <p className="text-xs text-slate-400 font-mono">
                <span className="text-white" style={{ textShadow: '0 0 8px rgba(255,255,255,0.4)' }}>STATUS:</span> Open to work
              </p>
              <p className="mt-1 text-xs text-slate-500">
                NYC Fintech / Tech
              </p>
              <a
                href="https://linkedin.com/in/aaron-stone-2b6994141"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
