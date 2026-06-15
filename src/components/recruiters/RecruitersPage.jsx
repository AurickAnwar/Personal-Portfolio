import React, { useEffect, useState } from 'react';
import {
  RECRUITER_INTRO,
  RECRUITER_PROJECTS,
  RECRUITER_SOCIAL,
  RECRUITER_WORK,
} from '../../data/recruitersContent';
import './RecruitersPage.css';

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function IntroLine({ item }) {
  if (!item.link) {
    return <li>{item.text}</li>;
  }

  return (
    <li>
      {item.text}
      <a href={item.link.href} target="_blank" rel="noopener noreferrer">
        {item.link.label}
      </a>
      {item.suffix}
      {item.link2 && (
        <>
          <a href={item.link2.href} target="_blank" rel="noopener noreferrer">
            {item.link2.label}
          </a>
          {item.suffix2}
        </>
      )}
    </li>
  );
}

const THEME_KEY = 'recruiters-theme';

export default function RecruitersPage() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return window.localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    document.title = 'Aurick Anwar — Recruiters';
    return () => {
      document.title = 'Aurick Anwar';
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_KEY, theme);
    document.body.style.backgroundColor = isDark ? '#06080c' : '#fff';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [theme, isDark]);

  return (
    <main className={`recruiters-page${isDark ? ' recruiters-page--dark' : ''}`}>
      <div className="recruiters-shell">
        <header className="recruiters-header">
          <h1 className="recruiters-name">Aurick Anwar</h1>
          <div className="recruiters-header-actions">
            <button
              type="button"
              className="recruiters-theme-toggle"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <nav className="recruiters-social" aria-label="Social links">
            {RECRUITER_SOCIAL.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                className="recruiters-social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <img src={icon} alt="" />
              </a>
            ))}
            </nav>
          </div>
        </header>

        <ul className="recruiters-intro">
          {RECRUITER_INTRO.map((item) => (
            <IntroLine key={item.text.slice(0, 24)} item={item} />
          ))}
        </ul>

        <section className="recruiters-work" aria-labelledby="work-heading">
          <h2 id="work-heading" className="recruiters-section-title">
            Work
          </h2>
          <div className="recruiters-work-list">
            {RECRUITER_WORK.map(({ company, role, logo, url }) => (
              <a
                key={company}
                href={url}
                className="recruiters-work-item"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={logo}
                  alt=""
                  className={`recruiters-work-logo${
                    company !== 'Magnified Systems' ? ' recruiters-work-logo--contain' : ''
                  }`}
                />
                <div>
                  <div className="recruiters-work-role">{role}</div>
                  <div className="recruiters-work-company">{company}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="recruiters-projects" aria-labelledby="projects-heading">
          <h2 id="projects-heading" className="recruiters-section-title">
            Projects
          </h2>
          <div className="recruiters-projects-grid">
            {RECRUITER_PROJECTS.map(({ id, title, description, image, githubUrl, liveUrl }) => (
              <article key={id} className="recruiters-project-card">
                <div className="recruiters-project-image-wrap">
                  <img src={image} alt="" className="recruiters-project-image" />
                </div>
                <div className="recruiters-project-head">
                  <h3 className="recruiters-project-title">{title}</h3>
                  <div className="recruiters-project-links">
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        className="recruiters-project-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${title} on GitHub`}
                      >
                        <GitHubIcon />
                      </a>
                    )}
                    {liveUrl && (
                      <a
                        href={liveUrl}
                        className="recruiters-project-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${title} website`}
                      >
                        <ExternalIcon />
                      </a>
                    )}
                  </div>
                </div>
                <p className="recruiters-project-desc">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="recruiters-footer">
          <a href="/">Full portfolio</a>
          {' · '}
          <a href="/resume-AurickAnwar.pdf">Resume PDF</a>
        </footer>
      </div>
    </main>
  );
}
