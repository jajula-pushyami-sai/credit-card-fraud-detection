import React, { Component, ErrorInfo } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
          <div className="w-full max-w-md">
            <EmptyState
              title="System Error"
              description="The application encountered an unexpected error. Please try reloading."
              icon={<AlertTriangle className="w-8 h-8 text-rose-500" />}
              action={
                <Button onClick={this.handleReload} className="flex items-center gap-2 mt-4">
                  <RefreshCw className="w-4 h-4" /> Reload Application
                </Button>
              }
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
