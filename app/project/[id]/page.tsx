'use client' // ← 必须加上

import { useParams } from 'next/navigation'

export default function Page() {
  const params = useParams()
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-3xl font-bold mb-4">Project: {params.id}</h1>
      <p className="text-muted-foreground">
        This is the detail page for project <strong>{params.id}</strong>.
      </p>
    </div>
  )
}
