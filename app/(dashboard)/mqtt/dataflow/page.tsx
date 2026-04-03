'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/page-header'

function DataflowContent() {
  const searchParams = useSearchParams()
  const isEmbed = searchParams.get('embed') === 'true'

  if (isEmbed) {
    return (
      <iframe
        src="https://uns-explorer.vercel.app/widgets/flow"
        className="w-full h-screen border-0"
        allow="fullscreen"
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Flow"
        description="End-to-end MQTT pipeline: Broker → On-Prem CH → Connector → Machines → Tables → App"
      />
      <iframe
        src="https://uns-explorer.vercel.app/widgets/flow"
        className="w-full border-0 rounded-lg"
        style={{ height: 'calc(100vh - 180px)' }}
        allow="fullscreen"
      />
    </div>
  )
}

export default function DataflowPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>}>
      <DataflowContent />
    </Suspense>
  )
}
