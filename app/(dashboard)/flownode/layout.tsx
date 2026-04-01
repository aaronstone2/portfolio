import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FlowNode",
  description: "Visual DAG Workflow Builder",
  openGraph: {
    title: "FlowNode | Aaron Stone",
    description: "Visual DAG Workflow Builder",
    type: "website",
  },
}

export default function FlowNodeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
