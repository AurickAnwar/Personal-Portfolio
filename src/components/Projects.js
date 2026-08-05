import React from 'react';
import { Link } from 'react-router-dom';
import { portfolioProjects, getProjectCardDescription } from '../data/portfolioProjects';
import './Projects.css';

const Projects = () => {
  return (
    <section className="projects section">
      <div className="container">
        <div className="section-header fade-in-up">
          <h1 className="section-title">Projects</h1>
          <p className="section-subtitle projects-intro">
            Here are some of my recent projects that showcase my skills and experience.
          </p>
        </div>

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
