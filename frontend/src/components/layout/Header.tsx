'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';

export function Header() {
  const { isAuthenticated, user, logout, isLoading } = useAuthContext();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="logo" onClick={closeMobileMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
            <rect x="9" y="3" width="6" height="4" rx="2"></rect>
            <line x1="9" y1="12" x2="15" y2="12"></line>
            <line x1="9" y1="16" x2="15" y2="16"></line>
          </svg>
          Todo App
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          {isLoading ? (
            <span className="nav-loading">Loading...</span>
          ) : isAuthenticated ? (
            <>
              <span className="user-email">{user?.email}</span>
              <Link href="/tasks" className="nav-link">
                My Tasks
              </Link>
              <button onClick={handleLogout} className="btn-secondary">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className="nav-link">
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-overlay" onClick={closeMobileMenu}></div>
          <nav className="nav-mobile">
            {isLoading ? (
              <span className="nav-loading">Loading...</span>
            ) : isAuthenticated ? (
              <>
                <div className="mobile-user">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>{user?.email}</span>
                </div>
                <Link href="/tasks" className="mobile-link" onClick={closeMobileMenu}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                  My Tasks
                </Link>
                <Link href="/tasks/new" className="mobile-link" onClick={closeMobileMenu}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  New Task
                </Link>
                <button onClick={handleLogout} className="mobile-link mobile-logout">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="mobile-link" onClick={closeMobileMenu}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  Sign In
                </Link>
                <Link href="/signup" className="mobile-link mobile-signup" onClick={closeMobileMenu}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </>
      )}

      <style jsx>{`
        .header {
          background: var(--background);
          border-bottom: 1px solid var(--border);
          padding: var(--spacing-md);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-md);
        }
        .logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--primary);
          text-decoration: none;
          transition: opacity var(--transition-fast);
        }
        .logo:hover {
          opacity: 0.9;
        }
        .nav-desktop {
          display: none;
          align-items: center;
          gap: var(--spacing-md);
        }
        @media (min-width: 640px) {
          .nav-desktop {
            display: flex;
          }
          .mobile-menu-btn {
            display: none;
          }
        }
        .nav-loading {
          color: var(--muted);
          font-size: var(--font-size-sm);
        }
        .user-email {
          color: var(--muted);
          font-size: var(--font-size-sm);
        }
        .nav-link {
          color: var(--foreground);
          text-decoration: none;
          font-weight: var(--font-weight-medium);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }
        .nav-link:hover {
          background: var(--bg-secondary);
        }
        .btn-primary {
          background: var(--primary);
          color: white;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          text-decoration: none;
          font-weight: var(--font-weight-medium);
          transition: background var(--transition-fast);
        }
        .btn-primary:hover {
          background: var(--primary-hover);
        }
        .btn-secondary {
          background: transparent;
          color: var(--foreground);
          border: 1px solid var(--border);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        .btn-secondary:hover {
          background: var(--bg-secondary);
        }
        .mobile-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-sm);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--foreground);
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }
        .mobile-menu-btn:hover {
          background: var(--bg-secondary);
        }
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 98;
          animation: fadeIn 0.2s ease-out;
        }
        .nav-mobile {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 280px;
          max-width: 80vw;
          background: var(--background);
          z-index: 99;
          padding: var(--spacing-xl);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          animation: slideIn 0.2s ease-out;
          box-shadow: var(--shadow-xl);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .mobile-user {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          color: var(--muted);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-md);
        }
        .mobile-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          color: var(--foreground);
          text-decoration: none;
          font-weight: var(--font-weight-medium);
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
          border: none;
          background: none;
          cursor: pointer;
          font-size: var(--font-size-base);
          width: 100%;
          text-align: left;
        }
        .mobile-link:hover {
          background: var(--bg-secondary);
        }
        .mobile-logout {
          color: var(--error);
          margin-top: auto;
        }
        .mobile-signup {
          background: var(--primary);
          color: white;
        }
        .mobile-signup:hover {
          background: var(--primary-hover);
        }
      `}</style>
    </header>
  );
}
