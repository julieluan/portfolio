import { Link, useRoute } from 'wouter';
import ThreeCanvas from '@/components/ThreeCanvas';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function ProjectDetailPage() {
  const [, params] = useRoute('/project/:id');
  const projectId = params?.id || 'unknown';

  // Sample project data
  const projects: Record<string, { title: string; description: string; details: string[] }> = {
    sample: {
      title: 'Sample 3D Project',
      description: 'A showcase project demonstrating Three.js integration with React',
      details: [
        'Interactive 3D visualization using Three.js',
        'Responsive design with Tailwind CSS',
        'Client-side routing with Wouter',
        'Modern React 19 with TypeScript',
      ],
    },
  };

  const project = projects[projectId] || {
    title: `Project: ${projectId}`,
    description: 'Project details page',
    details: ['This is a sample project detail page', 'You can customize this for your projects'],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{project.title}</h1>
        </div>
      </header>

      {/* Project Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Canvas */}
          <div className="h-96 border border-border rounded-lg overflow-hidden bg-card">
            <ThreeCanvas />
          </div>

          {/* Project Details */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
            <p className="text-muted-foreground mb-6">{project.description}</p>

            <h3 className="text-lg font-semibold mb-4">Key Features</h3>
            <ul className="space-y-3 mb-8">
              {project.details.map((detail, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm font-semibold flex-shrink-0">
                    ✓
                  </span>
                  <span className="text-muted-foreground">{detail}</span>
                </li>
              ))}
            </ul>

            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-semibold mb-2">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {['React', 'Three.js', 'TypeScript', 'Tailwind CSS'].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      <section className="bg-card border-t border-border mt-12">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8">Other Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/project/sample" className="block">
              <div className="p-6 border border-border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
                <h3 className="font-semibold mb-2">Sample 3D Project</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive 3D visualization showcase
                </p>
              </div>
            </Link>
            <div className="p-6 border border-border rounded-lg opacity-50">
              <h3 className="font-semibold mb-2">Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                More projects will be added soon
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
