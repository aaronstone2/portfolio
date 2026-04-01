import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bubble / Thesis",
  description: "3D VR Programming Language",
  openGraph: {
    title: "Bubble / Thesis | Aaron Stone",
    description: "3D VR Programming Language",
    type: "website",
  },
}

export default function ThesisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
