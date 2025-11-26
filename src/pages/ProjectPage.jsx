import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectBySlug } from '../data/portfolioData';

const ProjectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = getProjectBySlug(slug);

  const renderContent = () => (
    <section 
      className="glass-panel"
      style={{
        borderLeftColor: project.category.color,
        boxShadow: `0 0 25px ${project.category.color}33`
      }}
    >
      <p className="eyebrow">{project.category.title}</p>
      <h1>{project.name}</h1>
      {project.subtitle && (
        <p style={{ letterSpacing: '0.4rem', fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8 }}>
          {project.subtitle}
        </p>
      )}
      <p style={{ fontWeight: 600 }}>{project.summary}</p>

      {project.problem && (
        <div className="project-section">
          <h3>Problem</h3>
          <p>{project.problem}</p>
        </div>
      )}
      {project.outcome && (
        <div className="project-section">
          <h3>Outcome</h3>
          <p>{project.outcome}</p>
        </div>
      )}
      {project.role && (
        <div className="project-section">
          <h3>My Role</h3>
          <p>{project.role}</p>
        </div>
      )}
      {project.process?.length > 0 && (
        <div className="project-section">
          <h3>Process</h3>
          <ul>
            {project.process.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      )}
      {project.impact && (
        <div className="project-section">
          <h3>Impact</h3>
          <p>{project.impact}</p>
        </div>
      )}

      <div className="about-actions">
        {project.link && (
          <a 
            className="ghost-btn" 
            href={project.link} 
            target="_blank" 
            rel="noreferrer"
          >
            Open Case Study
          </a>
        )}
        <button className="ghost-btn" onClick={() => navigate('/main')}>
          Back to Orbit
        </button>
      </div>
    </section>
  );

  if (!project) {
    return (
      <div className="starry-sky starry-page starry-page--plain">
        <main className="starry-content">
          <section className="glass-panel">
            <h1>Signal Lost</h1>
            <p>The requested project orbit cannot be located.</p>
            <button className="ghost-btn" onClick={() => navigate('/main')}>
              Return to Orbit
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="starry-sky starry-page starry-page--plain">
      <main className="starry-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default ProjectPage;

