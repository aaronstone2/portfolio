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
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card neon-border-blue md:hidden"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6 text-primary" />
        ) : (
          <Menu className="h-6 w-6 text-primary" />
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
          "fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 md:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-sidebar-border px-6">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="h-8 w-8 overflow-hidden rounded-full border border-primary/40">
                <img src="/aaron-photo.jpg" alt="Aaron Stone" className="h-full w-full object-cover" />
              </div>
              <span className="font-mono text-lg font-semibold tracking-tight text-sidebar-foreground">
                AARON.DEV
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
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent neon-border-cyan text-accent"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-accent" : "text-sidebar-foreground/50"
                    )}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-accent neon-glow-cyan" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <div className="rounded-lg bg-sidebar-accent/50 p-3">
              <p className="text-xs text-muted-foreground font-mono">
                <span className="neon-text-purple">STATUS:</span> Open to work
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                NYC Fintech / Tech
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
