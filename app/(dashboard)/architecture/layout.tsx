import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Architecture",
  description: "FlowNode System Design",
  openGraph: {
    title: "Architecture | Aaron Stone",
    description: "FlowNode System Design",
    type: "website",
  },
}

export default function ArchitectureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
