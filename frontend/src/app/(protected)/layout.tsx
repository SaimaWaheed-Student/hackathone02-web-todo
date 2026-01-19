'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/signin');
    } else {
      setChecking(false);
    }
  }, [router]);

  // Show nothing while checking auth
  if (checking) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f9fafb;
          }
          .loading-spinner {
            color: #6b7280;
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
