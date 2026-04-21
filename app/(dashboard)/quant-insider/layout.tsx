import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quant Insider",
  description: "Dependency Graph for Public Markets — portfolio intelligence SaaS",
  openGraph: {
    title: "Quant Insider | Aaron Stone",
    description: "Dependency Graph for Public Markets — portfolio intelligence SaaS",
    type: "website",
  },
}

export default function QuantInsiderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
