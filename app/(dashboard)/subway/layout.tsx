import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Subway Map",
  description: "Interactive Node Graph",
  openGraph: {
    title: "Subway Map | Aaron Stone",
    description: "Interactive Node Graph",
    type: "website",
  },
}

export default function SubwayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
