'use client';

import { HeroSection } from '@/components/home/HeroSection';
import { ActionCard } from '@/components/home/ActionCard';
import { ActionCardGrid } from '@/components/home/ActionCardGrid';
import { FeaturesSection } from '@/components/home/FeaturesSection';

// Action card icons
const ListIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function HomePage() {
  return (
    <main className="home-container">
      <div className="home-content">
        <HeroSection />

        <ActionCardGrid
          title="What would you like to do?"
          subtitle="Click any card to get started"
        >
          <ActionCard
            icon={<ListIcon />}
            title="View Tasks"
            description="See all your tasks"
            href="/tasks"
            color="primary"
          />
          <ActionCard
            icon={<PlusIcon />}
            title="Add Task"
            description="Create a new task"
            href="/tasks/new"
            color="primary"
          />
          <ActionCard
            icon={<ChatIcon />}
            title="Chat Assistant"
            description="Get help with AI"
            href="/chat"
            color="purple"
          />
          <ActionCard
            icon={<CheckCircleIcon />}
            title="Completed"
            description="View finished tasks"
            href="/tasks?filter=completed"
            color="success"
          />
          <ActionCard
            icon={<UserIcon />}
            title="Profile"
            description="Manage your account"
            href="/profile"
            color="warning"
          />
        </ActionCardGrid>

        <FeaturesSection />
      </div>

      <style jsx>{`
        .home-container {
          min-height: calc(100vh - 80px);
          background: var(--bg-secondary);
          padding: var(--spacing-xl) var(--spacing-md);
        }
        .home-content {
          max-width: 1000px;
          margin: 0 auto;
        }
        @media (min-width: 640px) {
          .home-container {
            padding: var(--spacing-2xl) var(--spacing-lg);
          }
        }
      `}</style>
    </main>
  );
}
