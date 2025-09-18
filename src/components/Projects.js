import React from 'react';
import './Projects.css';
import { getImagePath, getAssetPath } from '../utils/imageUtils';

const Projects = () => {
  const projects = [
    // Python Projects (5)
    {
      id: 1,
      title: "Google Home",
      description: "Programmed a google home replica on OpenCv python and speech recognition. It was able to run and we could say anything to the system and they would return a response.",
      image: "STT.png",
      technologies: ["Python", "TextToSpeech", "OpenCV", "SpeechToText"],
      githubUrl: "https://github.com/AurickAnwar/Python-Projects-w-OpenCV/blob/main/Google%20Home.py"
    },
    {
      id: 2,
      title: "Car and Pedestrian Detection",
      description: "Designed an AI detection car system using OpenCv on python and made an algorithm to display a counter for when each car/pedestrian passes by.",
      image: "Car Detection.png",
      technologies: ["Python", "OpenCV", "NumPy"],
      githubUrl: "https://github.com/AurickAnwar/Python-Projects-w-OpenCV/blob/main/Pedestrian%20and%20Car%20Detection%20System.py",
      reportUrl: "https://docs.google.com/document/d/1CIpkooX8EVqJkrTwUZ0tDHImPGGr1oqaoGuMrc3TTdc/edit?tab=t.0"
    },
    {
      id: 3,
      title: "Facial Recognition",
      description: "Created a very basic facial recognition system using OpenCv on python and XML to detect the face.",
      image: "facial recognition.jpg",
      technologies: ["Python", "OpenCV", "XML"],
      githubUrl: "https://github.com/AurickAnwar/Python-Projects-w-OpenCV/blob/main/Face%20Recognition.py"
    },
    // CAD Projects (3) — IDs 4-6
    {
      id: 4,
      title: "Robotic Arm (CAD)",
      description: "Created a simple robotic arm using Fusion 360.",
      image: "RobotArm.png",
      technologies: ["Fusion 360"],
      stlUrl: "Robotic Arm.stl"
    },
    {
      id: 5,
      title: "Phone Stand",
      description: "3D Modeled and printed a phone stand using Fusion 360.",
      image: "PhoneStand.png",
      technologies: ["Fusion 360", "3D Printing", "Cura"],
      stlUrl: "Phone Stand.stl"
    },
    {
      id: 6,
      title: "Catapult",
      description: "3D Modeled and animated a catapult using Fusion 360.",
      image: "Catapult.png",
      technologies: ["Fusion 360", "Mesh", "Simulation"],
      stlUrl: "Catapult.stl"
    },
    // Arduino Projects (3) — IDs 7-9
    {
      id: 7,
      title: "Dancing Robot Capstone Project",
      description: "Participated in a competition and built a dancing robot using Servo Motors, LEDs and an ultrasonic sensor. Designed 3D printed parts on Fusion 360 such as the body, head and legs. Placed top 5",
      image: "Dancing Robot.jpg",
      technologies: ["Arduino", "Servo Motors", "LEDs", "Ultrasonic Sensor", "Fusion 360"],
      demoUrl: "https://www.youtube.com/watch?v=o9u5nqU2DyI"
    },
    {
      id: 8,
      title: "Smart Home ",
      description: "3D modelled a house model on Fusion 360 and built a smart home using Arduino using an Ultrasonic Sensor, LCD Module, Servo Motor and Fan",
      image: "SmartHome.jpg",
      technologies: ["Arduino", "Fusion 360", "Laser Cut", "Ultrasonic Sensor", "LEDs", "Fan", "Sensor Shield", "Piezzo Buzzer"],
      demoUrl: "SmartHome.mov"
    },
    {
      id: 9,
      title: "Obstacle Avoidance Robot Car",
      description: "3D modelled, wired and programmed an autonomous vehicle using Arduino to replicate the Future of Self driving Vehicles. Using an Ultrasonic Sensor, 4 gear motors, and a motor driver, I built this project to where if the ultrasonic sensor sees an object/wall from about 15 cm it turns in the opposite direction, however if there is no object near the car will go forward",
      image: "Car.jpg",
      technologies: ["Arduino", "Motor Driver", "Ultrasonic Sensor", "Gear Motors"],
      demoUrl: "https://www.youtube.com/watch?v=nR2MRY3dU_E"
    }
  ];

  return (
    <section className="projects section">
      <div className="container">
        <div className="section-header fade-in-up">
          <h1 className="section-title">My Projects</h1>
          <p className="section-subtitle">
            Here are some of my recent projects that showcase my skills and experience
          </p>
        </div>
        
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={project.id} className="project-card fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="project-image">
                <img src={getImagePath(project.image)} alt={project.title} />
                <div className="project-overlay">
                  <div className={`project-links ${project.reportUrl ? 'double' : 'single'}`}>
                    {project.stlUrl ? (
                      <a href={getAssetPath(project.stlUrl)} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">🧩</i>
                        STL File
                      </a>
                    ) : project.demoUrl ? (
                      <a href={project.demoUrl.startsWith('http') ? project.demoUrl : getAssetPath(project.demoUrl)} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">🎥</i>
                        Demo
                      </a>
                    ) : (
                      <a href={project.githubUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">📁</i>
                        GitHub
                      </a>
                    )}
                    {project.reportUrl && (
                      <a href={project.reportUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">📄</i>
                        Report
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-technologies">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
