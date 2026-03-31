import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Sidebar />
      <main className="md:pl-80">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  )
}
