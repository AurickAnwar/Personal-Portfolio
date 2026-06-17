import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  RECRUITER_INTRO,
  RECRUITER_PROJECTS,
  RECRUITER_SOCIAL,
  RECRUITER_WORK,
} from '../../data/recruitersContent';
import YouTubeLoop from '../projects/YouTubeLoop';
import './RecruitersPage.css';

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

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
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

function toBullets(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function DetailBullets({ items }) {
  const bullets = toBullets(items);
  if (!bullets.length) return null;

  return (
    <ul className="recruiters-detail__bullets">
      {bullets.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function DetailSection({ label, children }) {
  return (
    <section className="recruiters-detail__section">
      <h3 className="recruiters-detail__section-label">{label}</h3>
      <div className="recruiters-detail__section-body">{children}</div>
    </section>
  );
}

function ProjectDetailModal({ projects, projectIndex, onNavigate, onClose }) {
  const overlayRef = useRef(null);
  const project = projects[projectIndex];

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onNavigate(-1);
      if (event.key === 'ArrowRight') onNavigate(1);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, onNavigate]);

  useEffect(() => {
    overlayRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [projectIndex]);

  if (!project) return null;

  const metaParts = [project.year, project.projectType].filter(Boolean);
  const ctaProps = project.downloadFilename
    ? { download: project.downloadFilename }
    : { target: '_blank', rel: 'noopener noreferrer' };

  return (
    <div
      ref={overlayRef}
      className="recruiters-detail-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div className="recruiters-detail-shell" onClick={(event) => event.stopPropagation()}>
        <div
          className="recruiters-detail-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="recruiters-detail-title"
        >
          <div className="recruiters-detail-toolbar">
            <div className="recruiters-detail-toolbar-nav">
              <button
                type="button"
                className="recruiters-detail-nav recruiters-detail-nav--prev"
                onClick={() => onNavigate(-1)}
                aria-label="Previous project description"
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                className="recruiters-detail-nav recruiters-detail-nav--next"
                onClick={() => onNavigate(1)}
                aria-label="Next project description"
              >
                <ChevronRightIcon />
              </button>
            </div>
            <button type="button" className="recruiters-detail-close" onClick={onClose} aria-label="Close">
              <CloseIcon />
            </button>
          </div>

          <div key={project.id} className="recruiters-detail-content">
            <div className="recruiters-detail-hero">
              {project.youtubeVideoId ? (
                <YouTubeLoop
                  videoId={project.youtubeVideoId}
                  title={`${project.title} demo`}
                  className="recruiters-detail-video"
                  poster={project.image}
                  showControls
                  eager
                />
              ) : (
                <img src={project.image} alt={project.title} className="recruiters-detail-poster" />
              )}
            </div>

            <div className="recruiters-detail-layout">
              <aside className="recruiters-detail-sidebar">
                <p className="recruiters-detail-category">{project.category}</p>
                <h2 id="recruiters-detail-title" className="recruiters-detail-title">
                  {project.detailTitle ?? project.title}
                </h2>
                {metaParts.length > 0 && (
                  <p className="recruiters-detail-meta">{metaParts.join(' · ')}</p>
                )}

                <div className="recruiters-detail-tech-block">
                  <h3 className="recruiters-detail-tech-label">Tech Stack</h3>
                  <ul className="recruiters-detail-tech-list">
                    {(project.technologies ?? []).map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </div>

                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    className="recruiters-detail-cta"
                    {...ctaProps}
                  >
                    {project.ctaLabel}
                  </a>
                )}
              </aside>

              <div className="recruiters-detail-main">
                <DetailSection label="Description">
                  <DetailBullets items={project.description} />
                </DetailSection>
                <DetailSection label="Overview">
                  <DetailBullets items={project.overview} />
                </DetailSection>
                <DetailSection label="Challenge">
                  <DetailBullets items={project.challenge} />
                </DetailSection>
                <DetailSection label="Solution">
                  <DetailBullets items={project.solution} />
                </DetailSection>
                <DetailSection label="Technical Implementation">
                  <DetailBullets items={project.technical} />
                </DetailSection>
                <DetailSection label="Outcomes & Impact">
                  <DetailBullets items={project.outcomes} />
                </DetailSection>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h13"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProjectCard({ project, onViewDescription, suppressClickRef }) {
  const { title, summary, image, technologies } = project;

  const openDescription = useCallback(() => {
    if (suppressClickRef?.current) return;
    onViewDescription(project);
  }, [onViewDescription, project, suppressClickRef]);

  const handleImageKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDescription();
    }
  };

  return (
    <article className="recruiters-project-card recruiters-project-card--interactive">
      <div
        className="recruiters-project-image-wrap"
        role="button"
        tabIndex={0}
        aria-label={`View ${title} description`}
        onClick={openDescription}
        onKeyDown={handleImageKeyDown}
      >
        <img src={image} alt="" className="recruiters-project-image" />
        <div className="recruiters-project-image-overlay" />
      </div>

      <div className="recruiters-project-content">
        <h3 className="recruiters-project-title">{title}</h3>
        <p className="recruiters-project-desc">{summary}</p>

        {technologies?.length > 0 && (
          <ul className="recruiters-project-tech" aria-label="Technologies">
            {technologies.map((tech) => (
              <li key={tech} className="recruiters-project-tech-tag">
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className="recruiters-project-footer">
          <button
            type="button"
            className="recruiters-project-view-btn"
            onClick={(event) => {
              event.stopPropagation();
              openDescription();
            }}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <span>View description</span>
            <span className="recruiters-project-view-arrow">
              <ArrowLinkIcon />
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

function useCarouselPerPage() {
  const [perPage, setPerPage] = useState(1);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 640px)');
    const update = () => setPerPage(media.matches ? 2 : 1);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return perPage;
}

function getVisibleProjects(projects, page, perPage) {
  const start = page * perPage;
  const slice = projects.slice(start, start + perPage);

  if (slice.length === perPage || perPage === 1) {
    return slice;
  }

  return [...slice, ...projects.slice(0, perPage - slice.length)];
}

const SWIPE_THRESHOLD_PX = 48;
const DRAG_START_PX = 10;
const WHEEL_THRESHOLD_PX = 18;
const WHEEL_COOLDOWN_MS = 450;

function isInteractiveCarouselTarget(target) {
  return Boolean(target.closest('button, a, input, textarea, select'));
}

function isSelectableCarouselTarget(target) {
  return Boolean(target.closest('.recruiters-project-content'));
}

function useCarouselSwipe({ onPrev, onNext, enabled, onDragChange, suppressClickRef }) {
  const dragRef = useRef(null);
  const wheelCooldownRef = useRef(false);

  const lockCardClick = useCallback(() => {
    if (!suppressClickRef) return;
    suppressClickRef.current = true;
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 120);
  }, [suppressClickRef]);

  const handlePointerDown = useCallback(
    (event) => {
      if (!enabled || event.button !== 0) return;
      if (isInteractiveCarouselTarget(event.target) || isSelectableCarouselTarget(event.target)) return;

      dragRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        pointerId: event.pointerId,
        captured: false,
      };
    },
    [enabled]
  );

  const handlePointerMove = useCallback(
    (event) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId || drag.captured) return;

      const deltaX = Math.abs(event.clientX - drag.startX);
      const deltaY = Math.abs(event.clientY - drag.startY);

      if (deltaX < DRAG_START_PX && deltaY < DRAG_START_PX) return;

      drag.captured = true;
      onDragChange?.(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [onDragChange]
  );

  const finishPointer = useCallback(
    (event) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      dragRef.current = null;
      onDragChange?.(false);

      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;

      if (drag.captured) {
        lockCardClick();
      }

      if (!drag.captured || Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) < Math.abs(deltaY)) {
        return;
      }

      if (deltaX > 0) onNext();
      else onPrev();
    },
    [lockCardClick, onDragChange, onNext, onPrev]
  );

  const handlePointerUp = useCallback(
    (event) => {
      finishPointer(event);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [finishPointer]
  );

  const handlePointerCancel = useCallback(
    (event) => {
      if (dragRef.current?.pointerId === event.pointerId) {
        dragRef.current = null;
        onDragChange?.(false);
      }
    },
    [onDragChange]
  );

  const handleWheel = useCallback(
    (event) => {
      if (!enabled || wheelCooldownRef.current) return;
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      if (Math.abs(event.deltaX) < WHEEL_THRESHOLD_PX) return;

      event.preventDefault();
      wheelCooldownRef.current = true;
      lockCardClick();
      window.setTimeout(() => {
        wheelCooldownRef.current = false;
      }, WHEEL_COOLDOWN_MS);

      if (event.deltaX > 0) onNext();
      else onPrev();
    },
    [enabled, lockCardClick, onNext, onPrev]
  );

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleWheel,
  };
}

function ProjectsCarousel({ projects }) {
  const perPage = useCarouselPerPage();
  const [page, setPage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef(null);
  const suppressCardClickRef = useRef(false);
  const pageCount = Math.max(1, Math.ceil(projects.length / perPage));
  const visibleProjects = getVisibleProjects(projects, page, perPage);

  const openProject = useCallback(
    (project) => {
      const index = projects.findIndex(({ id }) => id === project.id);
      setSelectedIndex(index >= 0 ? index : 0);
    },
    [projects]
  );

  const navigateProject = useCallback(
    (delta) => {
      setSelectedIndex((current) => {
        if (current === null) return 0;
        return (current + delta + projects.length) % projects.length;
      });
    },
    [projects.length]
  );

  const closeProject = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const goToPage = (nextPage) => {
    setPage((nextPage + pageCount) % pageCount);
  };

  const goPrev = useCallback(() => {
    setPage((current) => (current - 1 + pageCount) % pageCount);
  }, [pageCount]);

  const goNext = useCallback(() => {
    setPage((current) => (current + 1) % pageCount);
  }, [pageCount]);

  const swipeEnabled = selectedIndex === null;
  const { handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel, handleWheel } =
    useCarouselSwipe({
      onPrev: goPrev,
      onNext: goNext,
      enabled: swipeEnabled,
      onDragChange: setIsDragging,
      suppressClickRef: suppressCardClickRef,
    });

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    viewport.addEventListener('wheel', handleWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount - 1));
  }, [pageCount]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (selectedIndex !== null) return;
      if (event.key === 'ArrowLeft') {
        goPrev();
      }
      if (event.key === 'ArrowRight') {
        goNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev, selectedIndex]);

  if (!projects.length) return null;

  return (
    <>
      <div className="recruiters-projects-carousel">
        <button
          type="button"
          className="recruiters-carousel-nav recruiters-carousel-nav--prev"
          onClick={() => goToPage(page - 1)}
          aria-label="Previous projects"
        >
          <ChevronLeftIcon />
        </button>

        <div
          ref={viewportRef}
          className={`recruiters-carousel-viewport${
            isDragging ? ' recruiters-carousel-viewport--dragging' : ''
          }`}
          aria-live="polite"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <div key={`${page}-${perPage}`} className="recruiters-carousel-slide">
            {visibleProjects.map((project, slideIndex) => (
              <ProjectCard
                key={`${page}-${project.id}-${slideIndex}`}
                project={project}
                onViewDescription={openProject}
                suppressClickRef={suppressCardClickRef}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          className="recruiters-carousel-nav recruiters-carousel-nav--next"
          onClick={() => goToPage(page + 1)}
          aria-label="Next projects"
        >
          <ChevronRightIcon />
        </button>

        <div className="recruiters-carousel-dots" role="tablist" aria-label="Project pages">
          {Array.from({ length: pageCount }, (_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              role="tab"
              className={`recruiters-carousel-dot${
                dotIndex === page ? ' recruiters-carousel-dot--active' : ''
              }`}
              onClick={() => setPage(dotIndex)}
              aria-label={`Go to page ${dotIndex + 1}`}
              aria-selected={dotIndex === page}
            />
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <ProjectDetailModal
          projects={projects}
          projectIndex={selectedIndex}
          onNavigate={navigateProject}
          onClose={closeProject}
        />
      )}
    </>
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
            {RECRUITER_WORK.map(({ company, role, location, dates, logo, url }) => (
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
                <div className="recruiters-work-body">
                  <div className="recruiters-work-line">
                    <div className="recruiters-work-role">{role}</div>
                    <p className="recruiters-work-meta">{location}</p>
                  </div>
                  <div className="recruiters-work-line recruiters-work-line--sub">
                    <div className="recruiters-work-company">{company}</div>
                    <p className="recruiters-work-meta recruiters-work-meta--dates">{dates}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="recruiters-projects" aria-labelledby="projects-heading">
          <h2 id="projects-heading" className="recruiters-section-title">
            Projects
          </h2>
          <ProjectsCarousel projects={RECRUITER_PROJECTS} />
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
