'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/page-header'

function ShopfloorContent() {
  const searchParams = useSearchParams()
  const isEmbed = searchParams.get('embed') === 'true'

  if (isEmbed) {
    return (
      <iframe
        src="https://uns-explorer.vercel.app/widgets/monitor"
        className="w-full h-screen border-0"
        allow="fullscreen"
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shopfloor Monitor"
        description="Live machine status, attributes, and sparklines across the stamping line"
      />
      <iframe
        src="https://uns-explorer.vercel.app/widgets/monitor"
        className="w-full border-0 rounded-lg"
        style={{ height: 'calc(100vh - 180px)' }}
        allow="fullscreen"
      />
    </div>
  )
}

export default function ShopfloorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>}>
      <ShopfloorContent />
    </Suspense>
  )
}
