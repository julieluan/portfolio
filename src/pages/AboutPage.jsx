import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="starry-sky starry-page starry-page--plain">
      <main className="starry-content">
        <section 
          className="glass-panel"
          style={{ borderLeftColor: '#7fa1ff', boxShadow: '0 0 25px #7fa1ff33' }}
        >
          <p className="eyebrow">ABOUT</p>
          <h1>Hi, I&apos;m Ruijia (Julie) Luan</h1>
          <p>
            I&apos;m a product strategist and creative technologist studying at USC’s Iovine and Young Academy.
          </p>
          <p>
            I build at the intersection of AI, full-stack engineering, product design, and emerging experiences. That work
            ranges from AI disaster-response platforms, to interactive data tools, to collectible toy design, to STEM innovations
            impacting 1,000+ students.
          </p>
          <p>
            What drives me is simple: turning complex problems into intuitive, human-centered experiences — whether through research,
            prototyping, or building full production systems.
          </p>
          <p>
            I’ve pitched ideas to Honda, Google, and Meow Wolf, led cross-disciplinary teams, and contributed to hackathon award-winning projects.
          </p>
          <p>
            Outside of work, I enjoy video games, badminton, seal carving, and building experimental side projects.
          </p>
          <div className="about-actions">
            <button onClick={() => navigate('/main')} className="ghost-btn">
              Return to Orbit
            </button>
            <button onClick={() => navigate('/start')} className="ghost-btn">
              Back to Launch
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;

