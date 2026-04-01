import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resume",
  description: "Interactive Career Flow",
  openGraph: {
    title: "Resume | Aaron Stone",
    description: "Interactive Career Flow",
    type: "website",
  },
}

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
