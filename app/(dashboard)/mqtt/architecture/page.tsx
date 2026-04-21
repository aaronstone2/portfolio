'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/page-header'

function ArchitectureContent() {
  const searchParams = useSearchParams()
  const isEmbed = searchParams.get('embed') === 'true'

  if (isEmbed) {
    return (
      <iframe
        src="https://uns-explorer.vercel.app/explorer-react"
        className="w-full h-screen border-0"
        allow="fullscreen"
      />
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <PageHeader path="/mqtt/architecture" />
      <div className="flex-1 relative">
        <iframe
          src="https://uns-explorer.vercel.app/explorer-react"
          className="absolute inset-0 w-full h-full border-0"
          allow="fullscreen"
          title="MQTT Architecture"
        />
      </div>
    </div>
  )
}

export default function ArchitecturePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>}>
      <ArchitectureContent />
    </Suspense>
  )
}
