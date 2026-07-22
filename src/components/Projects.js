import React from 'react';
import { Link } from 'react-router-dom';
import { portfolioProjects, getProjectCardDescription } from '../data/portfolioProjects';
import './Projects.css';
const Projects = () => {
  const warehouseCleanup = {
    title: 'TeleARM',
    status: 'Currently Building',
    progressPercent: 15,
    description:
      'Using a LiDAR and camera sensor, the robot is driven with teleop keys and picks up items when an object is detected! Built with ROS2, SLAM, and RViz2.',
    bullets: [
     
      'Gazebo warehouse environment with a mobile robot, mounted arm, and scattered objects to pick up',  
      'Manual teleop driving paired with real-time SLAM mapping via SLAM Toolbox',
      'LiDAR and camera-based object detection that triggers the arm\'s pick-and-place sequence',
    ],
    technologies: ['ROS2', 'Python', 'Gazebo', 'Linux', 'SLAM', 'RViz2', 'Nav2'],
    primaryCtaLabel: 'Github Repository',
    primaryCtaUrl: 'https://github.com/007Aurick/TeleArm',
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
            <h2>{warehouseCleanup.title}</h2>
            <p className="featured-status">{warehouseCleanup.status}</p>
            <p>{warehouseCleanup.description}</p>
            <ul className="featured-list">
              {warehouseCleanup.bullets.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="featured-progress-block" role="status" aria-live="polite">
              <div className="featured-progress-header">
                <span className="featured-progress-title">Progress</span>
                <span className="featured-progress-percent">{warehouseCleanup.progressPercent}%</span>
              </div>
              <div
                className="featured-progress-track"
                aria-label={`${warehouseCleanup.title} progress ${warehouseCleanup.progressPercent}%`}
              >
                <span
                  className="featured-progress-fill"
                  style={{ '--progress-width': `${warehouseCleanup.progressPercent}%` }}
                />
              </div>
            </div>
            <div className="project-technologies" style={{ marginTop: '1rem' }}>
              {warehouseCleanup.technologies.map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
            <div className="featured-actions">
              <a href={warehouseCleanup.primaryCtaUrl} target="_blank" rel="noopener noreferrer" className="btn">
                {warehouseCleanup.primaryCtaLabel}
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
                }`}
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
