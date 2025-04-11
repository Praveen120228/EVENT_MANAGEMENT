'use client';

import ErrorBoundary from '../components/ErrorBoundary';

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
} 