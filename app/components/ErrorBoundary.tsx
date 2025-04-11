'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component to catch unhandled errors in React components
 * and display a user-friendly error message instead of a blank page.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
          <div className="rounded-lg border border-red-100 bg-red-50 p-6 max-w-md">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="mb-4 text-xl font-bold text-red-700">Something went wrong</h1>
            <p className="text-red-600 mb-6">
              We encountered an unexpected error. Please try again or contact support if the problem persists.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 