import React from 'react';
import { Link } from 'react-router-dom';
import { portfolioProjects, getProjectCardDescription } from '../data/portfolioProjects';
import './Projects.css';

const Projects = () => {
  const basketballShooter = {
    title: 'Robot Basketball Shooter',
    status: 'Currently Building',
    progressPercent: 60,
    description:
      'A MuJoCo humanoid robot that computes basketball shots at different distances, uses ROS2 to connect the shot planning to joint commands in sim.',
    bullets: [
      'Basketball, hoop, backboard, and court modeled in MuJoCo, along with the humanoid robot',
      'Analytical solver for release angle and velocity at a fixed distance',
      'ROS 2 nodes planned to connect shot planning to joint commands in sim',
    ],
    technologies: ['MuJoCo', 'ROS2', 'Python'],
    primaryCtaLabel: 'View GitHub',
    primaryCtaUrl: 'https://github.com/007Aurick/Robot-Basketball-Shooter',
  };

  return (
    <section className="projects section">
      <div className="container">
        <div className="section-header fade-in-up">
          <h1 className="section-title">Projects</h1>
          <p className="section-subtitle projects-intro">
            Here are some of my recent projects that showcase my skills and experience.
          </p>
        </div>

        <div className="featured-project fade-in-up">
          <div className="featured-content">
            <p className="featured-label">Featured Project</p>
            <h2>{basketballShooter.title}</h2>
            <p className="featured-status">{basketballShooter.status}</p>
            <p>{basketballShooter.description}</p>
            <ul className="featured-list">
              {basketballShooter.bullets.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="featured-progress-block" role="status" aria-live="polite">
              <div className="featured-progress-header">
                <span className="featured-progress-title">Progress</span>
                <span className="featured-progress-percent">{basketballShooter.progressPercent}%</span>
              </div>
              <div
                className="featured-progress-track"
                aria-label={`${basketballShooter.title} progress ${basketballShooter.progressPercent}%`}
              >
                <span
                  className="featured-progress-fill"
                  style={{ '--progress-width': `${basketballShooter.progressPercent}%` }}
                />
              </div>
            </div>
            <div className="project-technologies" style={{ marginTop: '1rem' }}>
              {basketballShooter.technologies.map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
            <div className="featured-actions">
              <a href={basketballShooter.primaryCtaUrl} target="_blank" rel="noopener noreferrer" className="btn">
                {basketballShooter.primaryCtaLabel}
              </a>
            </div>
          </div>
        </div>

        <div className="projects-divider" />

        <div className="projects-grid">
          {portfolioProjects.map((project, index) => (
            <article
              key={project.id}
              className="project-card fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`project-image${
                  project.imageFocusLeft ? ' project-image--left-focus' : ''
                }${project.imageZoomIn ? ' project-image--zoom' : ''}`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  style={
                    project.imageObjectPosition
                      ? { objectPosition: project.imageObjectPosition }
                      : undefined
                  }
                />
                <div className="project-image-overlay" />
              </div>

              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{getProjectCardDescription(project)}</p>

                <div className="project-technologies">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>

                <div className="project-actions">
                  <Link className="project-link" to={`/projects/${project.slug}`}>
                    View Description
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
