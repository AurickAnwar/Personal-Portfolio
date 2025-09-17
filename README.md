# Personal Portfolio Website

A modern, responsive personal portfolio website built with React.js featuring a clean design and smooth animations.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with gradient accents and smooth animations
- **Navigation**: Simple navigation with Home, Projects, and Contact sections
- **Interactive Elements**: Hover effects, smooth scrolling, and animated components
- **Contact Form**: Functional contact form with validation
- **Project Showcase**: Grid layout displaying projects with technology tags

## Sections

### Home
- Personal introduction and title
- Professional description
- Call-to-action buttons
- Statistics section
- Animated profile placeholder

### Projects
- Grid layout showcasing 6 sample projects
- Project cards with images, descriptions, and technology tags
- Live demo and GitHub links
- Hover effects and smooth animations

### Contact
- Contact information with icons
- Functional contact form
- Form validation and submission feedback
- Social media links

## Technologies Used

- React 18
- React Router DOM
- CSS3 with modern features
- Responsive Grid and Flexbox
- CSS Animations and Transitions

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
   ```bash
   cd personal-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

The build files will be in the `build` directory.

## Customization

### Personal Information
Update the following files with your personal information:

- `src/components/Home.js` - Update name, title, and description
- `src/components/Contact.js` - Update contact information
- `src/components/Projects.js` - Replace sample projects with your own

### Styling
- Modify `src/index.css` for global styles
- Update component-specific CSS files for individual styling
- Change color scheme by updating CSS custom properties

### Adding Projects
Edit `src/components/Projects.js` to add your own projects:

```javascript
const projects = [
  {
    id: 1,
    title: "Your Project Title",
    description: "Project description...",
    image: "path/to/image.jpg",
    technologies: ["React", "Node.js", "MongoDB"],
    liveUrl: "https://your-project.com",
    githubUrl: "https://github.com/yourusername/project"
  },
  // Add more projects...
];
```

## Deployment

This project can be deployed to various platforms:

- **Netlify**: Connect your GitHub repository for automatic deployments
- **Vercel**: Deploy with zero configuration
- **GitHub Pages**: Use the `gh-pages` package for deployment

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Feel free to submit issues and enhancement requests!

---

**Note**: Remember to replace placeholder content with your actual information before deploying.
