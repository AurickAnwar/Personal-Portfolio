import React from 'react';
import './Projects.css';

const Projects = () => {
  const projects = [
    // Python Projects (5)
    {
      id: 1,
      title: "Google Home",
      description: "Programmed a google home replica on OpenCv python and speech recognition. It was able to run and we could say anything to the system and they would return a response.",
      image: "/STT.png",
      technologies: ["Python", "TextToSpeech", "OpenCV", "SpeechToText"],
      githubUrl: "https://github.com/AurickAnwar/Google-Home-Replica"
    },
    {
      id: 2,
      title: "Real-Time Object Detection System",
      description: "Built a real-time object detection system using OpenCv on python and YOLOv11. It was able to detect objects in real-time and display the bounding box of the object.",
      image: "/ObjectDetection.jpg",
      technologies: ["Python", "OpenCV", "YOLOv11"],
      githubUrl: "https://github.com/AurickAnwar/Object-Detection-AI-Model-With-YOLOv11"
      
    },

    // ⭐ Updated project (Assembly file instead of GitHub)
    {
      id: 3,
      title: "Car and Pedestrian Detection",
      description: "Designed an AI detection car system using OpenCv on python and made an algorithm to display a counter for when each car/pedestrian passes by.",
      image: "/Car Detection.png",
      technologies: ["Python", "OpenCV", "NumPy"],
      githubUrl: "https://github.com/AurickAnwar/Python-Projects-w-OpenCV/blob/main/Pedestrian%20and%20Car%20Detection%20System.py",
      reportUrl: "https://docs.google.com/document/d/1CIpkooX8EVqJkrTwUZ0tDHImPGGr1oqaoGuMrc3TTdc/edit?tab=t.0"
      
      
    },

    // CAD Projects (3)
    {
      id: 4,
      title: "Robotic Arm Gripper (CAD)",
      description: "Used a base plate end effector and added a gripper to the end of the arm to pick up and drop off objects.",
      image: "/RoboticGrip.png",
      technologies: ["Autodesk Inventor", "Assembly", "Constraints"],
      assemblyUrl: "/Robotic-Gripper.iam"
      
    },
    {
      id: 5,
      title: "3D Modelled Drone",
      description: "Designed and 3D modelled a drone using Autodesk Inventor. Was designed to be a simple prototype for a drone.",
      image: "/Drone.png",
      technologies: ["Autodesk Inventor", "Assembly", "Constraints", "Design"],
      assemblyUrl: "/Drone.iam"
      
    },
    {
      id: 6,
      title: "Phone Stand",
      description: "3D Modeled and printed a phone stand using Fusion 360.",
      image: "/PhoneStand.png",
      technologies: ["Fusion 360", "3D Printing", "Cura"],
      stlUrl: "/Phone Stand.stl"
    },

    // Arduino Projects (3)
    {
      id: 7,
      title: "Scissor Bot",
      description: "Built an extension grabber mechanism that can retrieve items from the floor. Two push buttons are used to control the gripper's open and close state. We 3D modelled and built a scissor mechanism to extend the gripper's reach.",
      image: "/ScissorsBot.jpg",
      technologies: ["Arduino", "Autodesk Inventor", "3D Printing"],
      demoUrl: "https://www.youtube.com/watch?v=-lGsktbrvjc"
      
    },
    {
      id: 8,
      title: "Smart Home",
      description: "3D modelled a house model on Fusion 360 and built a smart home using Arduino using an Ultrasonic Sensor, LCD Module, Servo Motor and Fan",
      image: "/SmartHome.jpg",
      technologies: ["Arduino", "Fusion 360", "Laser Cut", "Ultrasonic Sensor", "LEDs", "Fan", "Sensor Shield", "Piezzo Buzzer"],
      demoUrl: "/SmartHome.mov"
      
    },
    {
      id: 9,
      title: "Push Button LED PCB",
      description: "Designed a push button LED PCB using KiCad",
      image: "/LEDPCB.png",
      technologies: ["KiCad", "PCB", "LEDs", "Push Button"],
      pcbUrl: "/ledlight.kicad_pcb",
      schematicUrl: "/ledlight.kicad_sch"
      
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
                <img 
                  src={project.image} 
                  alt={project.title}
                />
                
                <div className="project-overlay">
                  <div className={`project-links ${project.reportUrl ? 'double' : 'single'}`}>

                    {/* ORDER OF PRIORITY: STL → Assembly → Demo → GitHub */}
                    {project.stlUrl ? (
                      <a href={project.stlUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">🧩</i> STL File
                      </a>
                    ) : project.assemblyUrl ? (
                      <a href={project.assemblyUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">🧩</i> Assembly File
                      </a>
                    ) : project.demoUrl ? (
                      <a href={project.demoUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">🎥</i> Demo
                      </a>
                    ) : project.githubUrl ? (
                      <a href={project.githubUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">📁</i> GitHub
                      </a>
                    ) : null}

                    {project.reportUrl && (
                      <a href={project.reportUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">📄</i> Report
                      </a>
                    )}
                    {project.pcbUrl && (
                      <a href={project.pcbUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">🗲</i> PCB
                      </a>
                    )}
                    {project.schematicUrl && (
                      <a href={project.schematicUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">🗲</i> Schematic
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>

                <div className="project-technologies">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="tech-tag">{tech}</span>
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
