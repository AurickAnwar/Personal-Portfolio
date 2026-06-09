import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { workExperience } from '../../data/workExperience';

function WorkLogo({ company, logo }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="home-work-logo home-work-logo--fallback" aria-hidden="true">
        {company.charAt(0)}
      </span>
    );
  }

  return (
    <img
      src={logo}
      alt=""
      className="home-work-logo"
      width={48}
      height={48}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function WorkRow({ entry }) {
  const inner = (
    <>
      <WorkLogo company={entry.company} logo={entry.logo} />
      <div className="home-work-body">
        <div className="home-work-line">
          <p className="home-work-role">{entry.role}</p>
          <p className="home-work-meta">{entry.location}</p>
        </div>
        <div className="home-work-line home-work-line--sub">
          <p className="home-work-company">{entry.company}</p>
          <p className="home-work-meta home-work-meta--dates">{entry.dates}</p>
        </div>
      </div>
    </>
  );

  if (entry.url) {
    return (
      <li className="home-work-item">
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer"
          className="home-work-card home-work-card--link"
        >
          {inner}
        </a>
      </li>
    );
  }

  return (
    <li className="home-work-item">
      <div className="home-work-card">{inner}</div>
    </li>
  );
}

const WorkSection = () => (
  <motion.section
    className="home-work relative"
    aria-label="Work experience"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="relative mb-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-display text-2xl font-bold text-[#eaeaea] md:text-3xl">
        Work
      </h2>
    </motion.div>
    <ul className="home-work-list">
      {workExperience.map((entry) => (
        <WorkRow key={entry.id} entry={entry} />
      ))}
    </ul>
  </motion.section>
);

export default WorkSection;
