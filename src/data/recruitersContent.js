import { getProjectCardDescription, portfolioProjects } from './portfolioProjects';

export const RECRUITER_SOCIAL = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/aurick-anwar',
    icon: '/Linkedin.png',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/007Aurick',
    icon: '/Github.png',
  },
  {
    label: 'Resume',
    href: '/resume-AurickAnwar.pdf',
    icon: '/Resume.png',
  },
];

export const RECRUITER_INTRO = [
  {
    text: 'Engineering Physics at ',
    link: { label: 'McMaster University', href: 'https://www.mcmaster.ca/' },
    suffix: '.',
  },
  {
    text: 'Founding Engineer at ',
    link: { label: 'Magnified Systems', href: 'https://www.magnifiedsystems.com/' },
    suffix: ' · SWE intern at ',
    link2: { label: 'HermesAI', href: 'https://hermesai.ca/' },
    suffix2: '.',
  },
  {
    text: 'Interested in AI, robotics, embedded systems, and building things that work outside a demo video.',
  },
];

export const RECRUITER_WORK = [
  {
    company: 'Personalized Prescribing',
    role: 'Machine Learning Intern (Incoming Fall 2026)',
    logo: '/personalized.jpg',
    url: 'https://personalizedprescribing.com/',
  },
  {
    company: 'Magnified Systems',
    role: 'Founding Engineer',
    logo: '/MagnifiedSystems.png',
    url: 'https://www.magnifiedsystems.com/',
  },
  {
    company: 'HermesAI',
    role: 'Software Engineering Intern',
    logo: '/hermesailogo.jpg',
    url: 'https://hermesai.ca/',
  },
  {
    company: 'Orbitview',
    role: 'Co-Founder',
    logo: '/Orbitview.png',
    url: 'https://www.orbitview.net/',

  },
  {
    company: 'The STEAM Project',
    role: 'Manufacturing Assistant',
    logo: '/TheSTEAMProject.png',
    url: 'https://www.thesteamproject.ca/',
  }
  
];

const RECRUITER_PROJECT_SLUGS = [
  'autonomous-self-driving-carla',
  'hand-gesture-computer-control',
  'basketball-shot-predictor',
  'google-home-replica',
  'facial-recognition',
  'car-pedestrian-detection',
  'push-button-led-pcb',
  'scissor-bot',
  'arduino-smart-home',
];

const RECRUITER_PROJECT_TITLES = {
  'autonomous-self-driving-carla': 'Autonomous Self-Driving Vehicle',
};

function getRecruiterCtaLabel(slug) {
  if (slug === 'push-button-led-pcb') return 'Download PCB';
  if (slug === 'scissor-bot') return 'View Report';
  return 'View GitHub';
}

export const RECRUITER_PROJECTS = RECRUITER_PROJECT_SLUGS.map((slug) => {
  const project = portfolioProjects.find((p) => p.slug === slug);
  if (!project) return null;

  return {
    id: project.slug,
    slug: project.slug,
    title: RECRUITER_PROJECT_TITLES[slug] ?? project.title,
    detailTitle: project.title,
    category: project.category,
    year: project.year,
    projectType: project.projectType,
    summary: getProjectCardDescription(project),
    description: project.description,
    overview: project.overview ?? [],
    challenge: project.challenge ?? [],
    solution: project.solution ?? [],
    technical: project.technical ?? [],
    outcomes: project.outcomes ?? [],
    image: project.image,
    youtubeVideoId: project.youtubeVideoId,
    projectUrl: project.projectUrl,
    downloadFilename: project.downloadFilename,
    ctaLabel: getRecruiterCtaLabel(slug),
    technologies: project.technologies,
  };
}).filter(Boolean);
