import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { getImagePath, getAssetPath } from '../utils/imageUtils';

const Home = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  const fullText = "Hi my name is Aurick. I am a first year Engineering 1 Student at McMaster university";
  const subtitle = "Aspiring Robotics Engineer";

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 150); // Adjust speed here (lower = faster)
      
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [currentIndex, fullText]);

  return (
    <section className="home section">
      <div className="container">
        <div className="home-content">
          <div className="home-text fade-in-up">
            <h1 className="home-title">
              <span className="typewriter-text">
                {displayedText}
                {isTyping && <span className="cursor">|</span>}
              </span>
            </h1>
            <h2 className="home-subtitle">
              {subtitle}
            </h2>
            <p className="home-description">
              I am extremely passionate about robotics and AI. I am always looking for new opportunities to learn and grow. I have been programming for 3 years now and I have a strong foundation in Python and C++. I have used many different libraries and frameworks such as Pytorch, Tensorflow, OpenCV, and more. I love using CAD software such as Autodesk Inventor, Fusion 360 and AutoCAD to design projects such as robots and other machines. I have been working with Arduino and Raspberry Pi to simple projects such as a robot car and a smart home system.
            </p>
            <div className="home-buttons">
              <Link to="/projects" className="btn">
                View My Work
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Get In Touch
              </Link>
            </div>
          </div>
          <div className="home-image fade-in">
            <div className="image-placeholder">
            <div className="profile-circle">
  <img
    src={getImagePath("aurick-anwar-photo.jpg")}
    alt="Aurick Anwar"
    className="profile-image"
    onError={(e) => {
      console.log('Image failed to load:', e.target.src);
      e.target.style.display = 'none';
    }}
  />
</div>
            </div>
          </div>
        </div>
        
      

<div className="home-stats fade-in-up">
  <a 
    href="https://linkedin.com/in/aurick-anwar" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="stat-button"
  >
    <div className="stat-icon">💼</div>
    <h3>LinkedIn</h3>
    <p>Connect with me</p>
  </a>
  
  <a 
    href={getAssetPath("Aurick_Anwar_Resume.pdf")} 
    download="Aurick_Anwar_Resume.pdf" 
    className="stat-button"
  >
    <div className="stat-icon">🗎</div>
    <h3>Resume</h3>
    <p>Download PDF</p>
  </a>
  
  <a 
    href="https://github.com/AurickAnwar" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="stat-button"
  >
    <div className="stat-icon">🖥️</div>
    <h3>Github</h3>
    <p>Check out my projects!</p>
  </a>
</div>


      </div>
    </section>
  );
};

export default Home;