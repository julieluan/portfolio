import ThreeCanvas from '../components/ThreeCanvas'
import { Button } from '../components/ui/button'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">My Portfolio</h1>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="h-96 border border-border rounded-lg overflow-hidden bg-card">
            <ThreeCanvas />
          </div>
          <div>
            <Link href="/project/sample">
              <Button size="lg">View Sample Project →</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
