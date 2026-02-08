import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'Todo App - Organize Your Tasks',
  description: 'A simple, powerful task management app that helps you stay focused, organized, and productive. Create tasks, set due dates, and track your progress.',
  keywords: ['todo', 'tasks', 'productivity', 'task management', 'organization'],
  authors: [{ name: 'Todo App Team' }],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Todo App - Organize Your Tasks',
    description: 'A simple, powerful task management app that helps you stay focused, organized, and productive.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <Header />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
