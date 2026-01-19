'use client';

import { HeroSection } from '@/components/home/HeroSection';
import { FeatureButton } from '@/components/home/FeatureButton';
import { FeaturesSection } from '@/components/home/FeaturesSection';

// Simple icons as React components
const PlusIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ListIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const EditIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const CheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function HomePage() {
  return (
    <main className="home-container">
      <div className="home-content">
        <HeroSection />

        <section className="features-section">
          <h2 className="features-title">What would you like to do?</h2>
          <p className="features-subtitle">Click any button to get started</p>

          <div className="features-grid">
            <FeatureButton
              label="Add Task"
              href="/tasks/new"
              icon={<PlusIcon />}
              description="Create a new task"
            />
            <FeatureButton
              label="View Tasks"
              href="/tasks"
              icon={<ListIcon />}
              description="See all your tasks"
            />
            <FeatureButton
              label="Edit Task"
              href="/tasks"
              icon={<EditIcon />}
              description="Modify existing tasks"
            />
            <FeatureButton
              label="Delete Task"
              href="/tasks"
              icon={<TrashIcon />}
              description="Remove completed tasks"
            />
            <FeatureButton
              label="Complete Task"
              href="/tasks"
              icon={<CheckIcon />}
              description="Mark tasks as done"
            />
          </div>
        </section>

        <FeaturesSection />
      </div>

      <style jsx>{`
        .home-container {
          min-height: calc(100vh - 80px);
          background: var(--bg-secondary);
          padding: 2rem 1rem;
        }
        .home-content {
          max-width: 1000px;
          margin: 0 auto;
        }
        .features-section {
          margin-bottom: 3rem;
        }
        .features-title {
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          margin-bottom: 0.5rem;
          color: var(--foreground);
        }
        .features-subtitle {
          text-align: center;
          color: var(--muted);
          margin-bottom: 2rem;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
        }
        @media (min-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }
      `}</style>
    </main>
  );
}
