import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Projects from './components/Projects';
import ProjectDetail from './components/projects/ProjectDetail';
import Contact from './components/Contact';
import OutsideEngineering from './components/OutsideEngineering';
import IntroLoader from './components/IntroLoader';
import './App.css';

function revealAnimatedSections() {
  const animated = document.querySelectorAll('.fade-in, .fade-in-up');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
  );

  animated.forEach((node) => {
    observer.observe(node);
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      node.classList.add('in-view');
      observer.unobserve(node);
    }
  });

  return () => observer.disconnect();
}

function AppContent() {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (showIntro) {
      return undefined;
    }

    let disconnect = () => {};
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        disconnect = revealAnimatedSections();
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      disconnect();
    };
  }, [location.pathname, showIntro]);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <>
      <AnimatePresence>{showIntro && <IntroLoader onComplete={handleIntroComplete} />}</AnimatePresence>

      <motion.div
        className="App"
        initial={false}
        animate={{
          opacity: showIntro ? 0 : 1,
          y: showIntro ? 8 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={showIntro}
        style={{ pointerEvents: showIntro ? 'none' : 'auto' }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/outside-engineering" element={<OutsideEngineering />} />
        </Routes>
      </motion.div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
