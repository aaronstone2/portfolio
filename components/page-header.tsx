import { getPage } from "@/lib/site-tree"

interface PageHeaderProps {
  path: string
  children?: React.ReactNode  // right-side controls (view switchers, download buttons, etc.)
}

/**
 * Consistent snackbar header used on EVERY page.
 * Pulls title + subtitle from site-tree.ts so sidebar and header always match.
 */
export function PageHeader({ path, children }: PageHeaderProps) {
  const meta = getPage(path)
  if (!meta) return null

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-card/50 px-6 py-3 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-white/5 p-2 border border-white/10">
          <MiniIcon type={meta.graphic} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white" style={{ textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>{meta.title}</h1>
          <p className="text-sm text-slate-500">{meta.subtitle}</p>
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </header>
  )
}

/** Small icon SVGs matching the sidebar graphics */
function MiniIcon({ type }: { type: string }) {
  const s = "rgba(255,255,255,0.8)"
  const g = "rgba(255,255,255,0.5)"

  switch (type) {
    case "home":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="7" rx="1.5" stroke={s} strokeWidth="1.2" style={{ filter: `drop-shadow(0 0 2px ${g})` }} />
          <rect x="11" y="2" width="7" height="7" rx="1.5" stroke={s} strokeWidth="1.2" />
          <rect x="2" y="11" width="7" height="7" rx="1.5" stroke={s} strokeWidth="1.2" />
          <rect x="11" y="11" width="7" height="7" rx="1.5" stroke={s} strokeWidth="1.2" style={{ filter: `drop-shadow(0 0 2px ${g})` }} />
        </svg>
      )
    case "flownode":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <line x1="10" y1="5" x2="5" y2="15" stroke={s} strokeWidth="1" />
          <line x1="10" y1="5" x2="15" y2="15" stroke={s} strokeWidth="1" />
          <rect x="6" y="1" width="8" height="6" rx="1.5" stroke={s} strokeWidth="1.2" style={{ filter: `drop-shadow(0 0 2px ${g})` }} />
          <rect x="1" y="13" width="7" height="5" rx="1.5" stroke={s} strokeWidth="1" />
          <rect x="12" y="13" width="7" height="5" rx="1.5" stroke={s} strokeWidth="1" />
        </svg>
      )
    case "architecture":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <line x1="5" y1="5" x2="10" y2="15" stroke={s} strokeWidth="1" />
          <line x1="15" y1="5" x2="10" y2="15" stroke={s} strokeWidth="1" />
          <rect x="2" y="2" width="6" height="5" rx="1.5" stroke={s} strokeWidth="1.2" style={{ filter: `drop-shadow(0 0 2px ${g})` }} />
          <rect x="12" y="2" width="6" height="5" rx="1.5" stroke={s} strokeWidth="1.2" />
          <rect x="7" y="13" width="6" height="5" rx="1.5" stroke={s} strokeWidth="1.2" style={{ filter: `drop-shadow(0 0 2px ${g})` }} />
        </svg>
      )
    case "service-graph":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <line x1="4" y1="10" x2="10" y2="4" stroke={s} strokeWidth="0.8" />
          <line x1="4" y1="10" x2="10" y2="16" stroke={s} strokeWidth="0.8" />
          <line x1="10" y1="4" x2="16" y2="10" stroke={s} strokeWidth="0.8" />
          <line x1="10" y1="16" x2="16" y2="10" stroke={s} strokeWidth="0.8" />
          <circle cx="4" cy="10" r="2.5" stroke={s} strokeWidth="1" style={{ filter: `drop-shadow(0 0 2px ${g})` }} />
          <circle cx="10" cy="4" r="2" stroke={s} strokeWidth="1" />
          <circle cx="10" cy="16" r="2" stroke={s} strokeWidth="1" />
          <circle cx="16" cy="10" r="2.5" stroke={s} strokeWidth="1" style={{ filter: `drop-shadow(0 0 2px ${g})` }} />
        </svg>
      )
    case "resume":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="1" width="14" height="18" rx="1.5" stroke={s} strokeWidth="1.2" style={{ filter: `drop-shadow(0 0 2px ${g})` }} />
          <circle cx="8" cy="6" r="2" stroke={s} strokeWidth="0.8" />
          <line x1="11" y1="5" x2="15" y2="5" stroke={s} strokeWidth="0.8" opacity="0.6" />
          <line x1="11" y1="7" x2="14" y2="7" stroke={s} strokeWidth="0.6" opacity="0.4" />
          <line x1="6" y1="11" x2="15" y2="11" stroke={s} strokeWidth="0.8" opacity="0.5" />
          <line x1="6" y1="14" x2="13" y2="14" stroke={s} strokeWidth="0.6" opacity="0.3" />
          <line x1="6" y1="17" x2="11" y2="17" stroke={s} strokeWidth="0.6" opacity="0.2" />
        </svg>
      )
    case "projects":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="4" y="4" width="14" height="14" rx="1.5" stroke={s} strokeWidth="0.6" opacity="0.3" />
          <rect x="3" y="3" width="14" height="14" rx="1.5" stroke={s} strokeWidth="0.8" opacity="0.5" />
          <rect x="2" y="2" width="14" height="14" rx="1.5" stroke={s} strokeWidth="1.2" style={{ filter: `drop-shadow(0 0 2px ${g})` }} />
          <line x1="5" y1="6" x2="11" y2="6" stroke={s} strokeWidth="0.8" opacity="0.5" />
          <line x1="5" y1="9" x2="9" y2="9" stroke={s} strokeWidth="0.6" opacity="0.3" />
        </svg>
      )
    case "thesis":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke={s} strokeWidth="1" style={{ filter: `drop-shadow(0 0 3px ${g})` }} />
          <ellipse cx="10" cy="10" rx="7" ry="3" stroke={s} strokeWidth="0.5" opacity="0.5" />
          <ellipse cx="10" cy="10" rx="3" ry="7" stroke={s} strokeWidth="0.5" opacity="0.5" />
          <circle cx="10" cy="10" r="1.5" fill={s} style={{ filter: `drop-shadow(0 0 3px ${g})` }} />
        </svg>
      )
    case "subway":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 5 L8 5 L10 10 L18 10" stroke="#EE352E" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <path d="M2 10 L18 10" stroke="#00933C" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <path d="M2 15 L8 15 L10 10 L18 10" stroke="#2850AD" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <circle cx="10" cy="10" r="2" fill="white" stroke={s} strokeWidth="0.8" style={{ filter: `drop-shadow(0 0 2px ${g})` }} />
        </svg>
      )
    case "contact":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="4" width="16" height="12" rx="1.5" stroke={s} strokeWidth="1.2" style={{ filter: `drop-shadow(0 0 2px ${g})` }} />
          <polyline points="2,4 10,11 18,4" stroke={s} strokeWidth="0.8" fill="none" />
          <line x1="2" y1="16" x2="7" y2="11" stroke={s} strokeWidth="0.5" opacity="0.3" />
          <line x1="18" y1="16" x2="13" y2="11" stroke={s} strokeWidth="0.5" opacity="0.3" />
        </svg>
      )
    default:
      return <div className="h-5 w-5" />
  }
}
