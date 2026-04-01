import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "API Docs",
  description: "FlowNode OpenAPI Reference",
  openGraph: {
    title: "API Docs | Aaron Stone",
    description: "FlowNode OpenAPI Reference",
    type: "website",
  },
}

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
