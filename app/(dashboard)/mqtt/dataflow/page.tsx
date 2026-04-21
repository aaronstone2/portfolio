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
    <div className="flex h-screen flex-col overflow-hidden">
      <PageHeader path="/mqtt/dataflow" />
      <div className="flex-1 relative">
        <iframe
          src="https://uns-explorer.vercel.app/widgets/flow"
          className="absolute inset-0 w-full h-full border-0"
          allow="fullscreen"
          title="Data Flow"
        />
      </div>
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
