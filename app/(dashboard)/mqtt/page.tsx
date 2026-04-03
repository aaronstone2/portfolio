'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/page-header'

function MQTTContent() {
  const searchParams = useSearchParams()
  const isEmbed = searchParams.get('embed') === 'true'

  if (isEmbed) {
    return (
      <iframe
        src="https://uns-explorer.vercel.app/explorer"
        className="w-full h-screen border-0"
        allow="fullscreen"
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="MQTT Visualizer"
        description="Interactive Unified Namespace Explorer for ISA-95 MQTT manufacturing systems"
      />
      <iframe
        src="https://uns-explorer.vercel.app/explorer"
        className="w-full border-0 rounded-lg"
        style={{ height: 'calc(100vh - 180px)' }}
        allow="fullscreen"
      />
    </div>
  )
}

export default function MQTTPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>}>
      <MQTTContent />
    </Suspense>
  )
}
