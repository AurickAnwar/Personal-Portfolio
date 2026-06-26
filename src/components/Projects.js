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
  const ros2Learning = {
    title: 'Learning ROS2',
    status: 'Currently Learning',
    progressPercent: 65,
    description:
      'Future Projects: ',
    bullets: [
      'Autonomous Driving and obstacle avoidance',
      'Amazon Wearhouse Simulation',
      'Drone Navigation and Mapping',
    
    ],
    technologies: ['ROS2', 'Python', 'Gazebo', 'Linux', 'SLAM', 'RVIZ'],
    primaryCtaLabel: 'Github Repository',
    primaryCtaUrl: 'https://github.com/007Aurick/ROS2',
 
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
            <h2>{ros2Learning.title}</h2>
            <p className="featured-status">{ros2Learning.status}</p>
            <p>{ros2Learning.description}</p>
            <ul className="featured-list">
              {ros2Learning.bullets.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="featured-progress-block" role="status" aria-live="polite">
              <div className="featured-progress-header">
                <span className="featured-progress-title">Progress</span>
                <span className="featured-progress-percent">{ros2Learning.progressPercent}%</span>
              </div>
              <div className="featured-progress-track" aria-label={`ROS2 learning progress ${ros2Learning.progressPercent}%`}>
                <span
                  className="featured-progress-fill"
                  style={{ '--progress-width': `${ros2Learning.progressPercent}%` }}
                />
              </div>
            </div>
            <div className="project-technologies" style={{ marginTop: '1rem' }}>
              {ros2Learning.technologies.map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
            <div className="featured-actions">
              <a href={ros2Learning.primaryCtaUrl} target="_blank" rel="noopener noreferrer" className="btn">
                {ros2Learning.primaryCtaLabel}
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
