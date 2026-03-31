/**
 * Single source of truth for all page names and subtitles.
 * Used by BOTH the sidebar nav AND page snackbar headers.
 * If you rename something here, it changes everywhere.
 */

export interface PageMeta {
  title: string
  subtitle: string
  graphic: string
}

export const PAGE_META: Record<string, PageMeta> = {
  "/":              { title: "Home",            subtitle: "Portfolio Dashboard",              graphic: "home" },
  "/flownode":      { title: "FlowNode",        subtitle: "Visual DAG Workflow Builder",      graphic: "flownode" },
  "/architecture":  { title: "Architecture",    subtitle: "FlowNode System Design",           graphic: "architecture" },
  "/service-graph": { title: "Service Graph",   subtitle: "Microservice Dependency Visualizer", graphic: "service-graph" },
  "/resume":        { title: "Resume",          subtitle: "Interactive Career Flow",          graphic: "resume" },
  "/projects":      { title: "Projects",        subtitle: "Portfolio of Technical Work",      graphic: "projects" },
  "/thesis":        { title: "Bubble / Thesis", subtitle: "3D VR Programming Language",       graphic: "thesis" },
  "/subway":        { title: "Subway Map",      subtitle: "Interactive Node Graph",           graphic: "subway" },
  "/contact":       { title: "Contact",         subtitle: "Get in Touch",                     graphic: "contact" },
}

/* Resume sub-view labels (used in sidebar children) */
export const RESUME_VIEWS: Record<string, { label: string; graphic: string }> = {
  website:  { label: "Timeline",   graphic: "timeline" },
  document: { label: "Document",   graphic: "document" },
  graph:    { label: "Node Graph", graphic: "node-graph" },
}
