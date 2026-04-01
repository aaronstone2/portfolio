import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Service Graph",
  description: "Microservice Dependency Visualizer",
  openGraph: {
    title: "Service Graph | Aaron Stone",
    description: "Microservice Dependency Visualizer",
    type: "website",
  },
}

export default function ServiceGraphLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
