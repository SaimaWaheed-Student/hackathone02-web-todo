'use client';

import { FeatureCard } from './FeatureCard';

// Icons for feature cards
const TaskIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const MobileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
);

const features = [
  {
    icon: <TaskIcon />,
    title: 'Task Management',
    description: 'Create and organize tasks with titles and detailed descriptions',
  },
  {
    icon: <CalendarIcon />,
    title: 'Schedule Tasks',
    description: 'Set due dates and times to stay on top of your deadlines',
  },
  {
    icon: <CheckIcon />,
    title: 'Track Progress',
    description: 'Mark tasks complete and visualize your productivity',
  },
  {
    icon: <LockIcon />,
    title: 'Secure Authentication',
    description: 'Your data is protected with JWT-based authentication',
  },
  {
    icon: <MobileIcon />,
    title: 'Works Anywhere',
    description: 'Responsive design works perfectly on any device',
  },
];

export function FeaturesSection() {
  return (
    <section className="features-section">
      <h2 className="features-heading">Why Choose Our Todo App?</h2>
      <p className="features-subheading">
        Everything you need to stay organized and productive
      </p>
      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>

      <style jsx>{`
        .features-section {
          padding: var(--spacing-2xl) 0;
        }
        .features-heading {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--foreground);
          text-align: center;
          margin-bottom: var(--spacing-sm);
        }
        .features-subheading {
          font-size: var(--font-size-lg);
          color: var(--muted);
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing-lg);
        }
        @media (min-width: 640px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .features-heading {
            font-size: var(--font-size-3xl);
          }
        }
      `}</style>
    </section>
  );
}
