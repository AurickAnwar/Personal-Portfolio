import React from 'react';
import { Link } from 'react-router-dom';
import { portfolioProjects, getProjectCardDescription } from '../data/portfolioProjects';
import './Projects.css';
const Projects = () => {
  const magnifiedProject = {
    title: 'Magnified Systems',
    status: 'Currently Building',
    description:
      'Developing a real-time impact severity detection system using IMU sensor data and machine learning.',
    bullets: [
      'Working with ESP32 and IMU sensors for real-time motion data',
      'Building a machine learning model to predict impact severity (1-100 scale)',
      'Designing a helmet-mounted prototype for real-world testing'
    ],
    technologies: ['ESP32', 'IMU Sensors', 'Machine Learning', 'Embedded Prototyping'],
    primaryCtaLabel: 'View Website',
    primaryCtaUrl: 'https://www.magnifiedsystems.com/',
    secondaryCtaLabel: 'View Instagram',
    secondaryCtaUrl: 'https://www.instagram.com/magnifiedsystems/',
    thirdCtaLabel: 'View GitHub Repository',
    thirdCtaUrl: 'https://github.com/AurickAnwar/MagnifiedSystems'
  };
  const warehouseCleanup = {
    title: 'Warehouse Cleanup Robot Simulation',
    status: 'Currently Building',
    progressPercent: 5,
    description:
      'Building an autonomous warehouse cleanup robot that detects displaced boxes on the floor, picks them up with a forklift, and deposits them into storage zones.',
    bullets: [
      'Warehouse floor environment in Gazebo with randomly spawned displaced boxes',
      'Forklift-style robot with a single lift joint for box retrieval',
      'Autonomous navigation powered by Nav2',
      'Real-time map building with SLAM Toolbox',
      'LiDAR point cloud processing for floor-level box detection',
      'State machine managing patrol, detect, retrieve, and deposit behaviors',
      'Configurable storage zones for cleaned-up boxes',
      'RViz2 visualization for live map, robot pose, and sensor feeds',
      'Reproducible box spawn patterns via random seed',
    ],
    technologies: ['ROS2', 'Python', 'Gazebo', 'Linux', 'SLAM', 'RViz2', 'Nav2'],
    primaryCtaLabel: 'Github Repository',
    primaryCtaUrl: 'https://github.com/007Aurick/Warehouse-Cleanup-Robot-Simulation',
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
            <h2>{magnifiedProject.title}</h2>
            <p className="featured-status">{magnifiedProject.status}</p>
            <p>{magnifiedProject.description}</p>
            <ul className="featured-list">
              {magnifiedProject.bullets.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="project-technologies">
              {magnifiedProject.technologies.map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
            <div className="featured-actions">
              <a href={magnifiedProject.primaryCtaUrl} target="_blank" rel="noopener noreferrer" className="btn">
                {magnifiedProject.primaryCtaLabel}
              </a>
              <a href={magnifiedProject.secondaryCtaUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                {magnifiedProject.secondaryCtaLabel}
              </a>
              <a href={magnifiedProject.thirdCtaUrl} target="_blank" rel="noopener noreferrer" className="btn">
                {magnifiedProject.thirdCtaLabel}
              </a>

            </div>
          </div>
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
