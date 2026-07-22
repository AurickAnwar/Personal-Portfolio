import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function ExternalLinkIcon() {
  return (
    <svg className="nav-link-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17L17 7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 7h7v7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
            AURICK
          </Link>
          
          <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              to="/projects" 
              className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Projects
            </Link>
            <Link
              to="/outside-engineering"
              className={`nav-link nav-link--outside ${location.pathname === '/outside-engineering' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span className="nav-outside-full">Life</span>
              <span className="nav-outside-short">Outside</span>
            </Link>
            <Link
              to="/recruiters"
              className="nav-link nav-link--external"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
            >
              For Recruiters
              <ExternalLinkIcon />
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
          </div>
          
          <button
            type="button"
            className={`nav-toggle${isMobileMenuOpen ? ' active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
