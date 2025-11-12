import { Link } from 'wouter';
import ThreeCanvas from '@/components/ThreeCanvas';
import { Button } from '@/components/ui/button';

export default function MainPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">My Portfolio</h1>
          <p className="text-muted-foreground mt-2">Welcome to my 3D portfolio showcase</p>
        </div>
      </header>

      {/* Hero Section with Three.js Canvas */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Canvas */}
          <div className="h-96 border border-border rounded-lg overflow-hidden bg-card">
            <ThreeCanvas />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Welcome</h2>
            <p className="text-muted-foreground mb-6">
              This is a simple portfolio website built with React, Three.js, and Tailwind CSS. 
              The rotating cube on the left is rendered using Three.js, a powerful 3D graphics library.
            </p>
            <p className="text-muted-foreground mb-8">
              Click the button below to view a sample project with more details.
            </p>
            
            <Link href="/project/sample">
              <Button size="lg" className="w-full sm:w-auto">
                View Sample Project →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-t border-border mt-12">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-border rounded-lg">
              <h3 className="font-semibold mb-2">React 19</h3>
              <p className="text-sm text-muted-foreground">
                Modern React with hooks and functional components
              </p>
            </div>
            <div className="p-6 border border-border rounded-lg">
              <h3 className="font-semibold mb-2">Three.js</h3>
              <p className="text-sm text-muted-foreground">
                3D graphics and animations for stunning visuals
              </p>
            </div>
            <div className="p-6 border border-border rounded-lg">
              <h3 className="font-semibold mb-2">Tailwind CSS</h3>
              <p className="text-sm text-muted-foreground">
                Utility-first CSS for rapid UI development
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 My Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
