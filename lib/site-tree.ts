/**
 * SITE-TREE.ts — THE SINGLE SOURCE OF TRUTH FOR THE ENTIRE SITE.
 * 
 * Every page title, subtitle, graphic, link, and nesting relationship
 * is defined HERE and ONLY here. Nothing else defines page names.
 * 
 * Sidebar reads this. Page headers read this. Projects page reads this.
 * Home page reads this. If it's not here, it doesn't exist.
 */

export interface SiteNode {
  href: string
  title: string
  subtitle: string
  graphic: string
  github?: string
  techStack?: string[]
  description?: string        // longer description for project cards
  featured?: boolean
  children?: SiteNode[]
}

/** The full site tree. This IS the nav. This IS the page list. */
export const SITE_TREE: SiteNode[] = [
  {
    href: "/",
    title: "Home",
    subtitle: "Portfolio Dashboard",
    graphic: "home",
  },
  {
    href: "/projects",
    title: "Projects",
    subtitle: "Portfolio of Technical Work",
    graphic: "projects",
    children: [
      {
        href: "/flownode",
        title: "FlowNode",
        subtitle: "Visual DAG Workflow Builder",
        graphic: "flownode",
        github: "https://github.com/aaronstone2/flownode",
        techStack: ["React", "ReactFlow", "TypeScript", "Vite", "MUI", "D3.js", "Node.js"],
        description: "20+ custom node types, animated edges, drag-and-drop canvas, and real-time data flow visualization. Built for orchestrating Jira, Slack, and Google Sheets workflows.",
        featured: true,
        children: [
          {
            href: "/architecture",
            title: "Architecture",
            subtitle: "FlowNode System Design",
            graphic: "architecture",
          },
          {
            href: "/api-docs",
            title: "API Docs",
            subtitle: "FlowNode OpenAPI Reference",
            graphic: "document",
          },
        ],
      },
      {
        href: "/service-graph",
        title: "Service Graph",
        subtitle: "Microservice Dependency Visualizer",
        graphic: "service-graph",
        github: "https://github.com/aaronstone2/kraken-unchained",
        techStack: ["React", "ReactFlow", "Node.js", "Drizzle ORM", "EdgeDB", "NX Monorepo"],
        description: "Drag-and-drop service nodes, toxic injection simulation, K6 load test visualization, and real-time dependency graph analysis. Full NX monorepo with NodePalette sidebar and interactive canvas.",
        featured: true,
      },
      {
        href: "/thesis",
        title: "Bubble / Thesis",
        subtitle: "3D VR Programming Language",
        graphic: "thesis",
        techStack: ["3D Graphics", "VR", "Visual Programming", "Language Design", "Scene Graphs"],
        description: "3D visual programming language where code structures are navigable spheres in virtual reality. 78-page Honors Thesis from Brandeis University.",
        featured: true,
      },
      {
        href: "/job-graph",
        title: "Job Graph",
        subtitle: "Semantic Knowledge Graph over 21k+ Job Postings",
        graphic: "job-graph",
        github: "https://github.com/aaronstone2/job-graph",
        techStack: ["TypeScript", "React Flow", "MongoDB", "Zod", "Express", "Claude API"],
        description: "Scrapes 21,000+ job postings across 79 companies and 5 ATSes (Greenhouse, Lever, Ashby, Workday, SmartRecruiters), extracts keywords + skills from every JD, and ships an AI-reviewed resume-tailoring editor with drag-to-reorder interactions.",
        featured: true,
      },
      {
        href: "/subway",
        title: "Subway Map",
        subtitle: "Interactive Node Graph",
        graphic: "subway",
        techStack: ["React", "SVG", "TypeScript", "Graph Algorithms"],
        description: "Interactive NYC subway map built as a node graph with draggable stations, zoom controls, line coloring, and transfer detection.",
        featured: false,
      },
      {
        href: "/mqtt",
        title: "MQTT Visualizer",
        subtitle: "Shopfloor IoT Monitoring",
        graphic: "mqtt",
        techStack: ["React", "TypeScript", "MQTT", "SVG", "Real-time Data"],
        description: "Real-time shopfloor monitoring with MQTT topic tree visualization, time-series charts, and interactive topology graph. Models manufacturing IoT data from stations and machines.",
        featured: true,
        children: [
          {
            href: "/mqtt/architecture",
            title: "Architecture",
            subtitle: "MQTT JSON Nesting View",
            graphic: "mqtt-architecture",
          },
          {
            href: "/mqtt/shopfloor",
            title: "Shopfloor",
            subtitle: "Visual Shopfloor (Liquid Glass)",
            graphic: "mqtt-shopfloor",
          },
          {
            href: "/mqtt/dataflow",
            title: "Data Flow",
            subtitle: "Edge Animation Pipeline",
            graphic: "mqtt-dataflow",
          },
        ],
      },
    ],
  },
  {
    href: "/resume",
    title: "Resume",
    subtitle: "Interactive Career Flow",
    graphic: "resume",
    children: [
      {
        href: "/resume?view=website",
        title: "Timeline",
        subtitle: "Career Timeline View",
        graphic: "timeline",
      },
      {
        href: "/resume?view=document",
        title: "Document",
        subtitle: "Traditional Resume Format",
        graphic: "document",
      },
      {
        href: "/resume?view=graph",
        title: "Node Graph",
        subtitle: "Interactive Career Graph",
        graphic: "node-graph",
      },
    ],
  },
  {
    href: "/contact",
    title: "Contact",
    subtitle: "Get in Touch",
    graphic: "contact",
  },
]

/* ── Helper functions ── */

/** Flat lookup: get any node by href */
function flattenTree(nodes: SiteNode[]): SiteNode[] {
  const result: SiteNode[] = []
  for (const node of nodes) {
    result.push(node)
    if (node.children) result.push(...flattenTree(node.children))
  }
  return result
}

const _flat = flattenTree(SITE_TREE)

/** Get a page's metadata by href */
export function getPage(href: string): SiteNode | undefined {
  return _flat.find(n => n.href === href)
}

/** Get all project nodes (everything under /projects, recursively flattened) */
export function getProjects(): SiteNode[] {
  const projects = SITE_TREE.find(n => n.href === "/projects")
  if (!projects?.children) return []
  return flattenTree(projects.children).filter(n => n.description)
}

/** Get the top-level nav nodes */
export function getNavRoots(): SiteNode[] {
  return SITE_TREE
}
