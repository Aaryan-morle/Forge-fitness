import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Button, Card } from '../ui/Base';
import { AlertCircle, RotateCcw } from 'lucide-react';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
          <AlertCircle size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
          <p className="text-slate-500 mt-2 text-sm">
            We encountered an unexpected error. Please try refreshing the application.
          </p>
        </div>
        {error && (
          <div className="bg-red-50 p-4 rounded-lg text-left overflow-auto max-h-32">
            <p className="text-red-700 text-[10px] font-mono">{error.message}</p>
          </div>
        )}
        <Button 
          className="w-full"
          onClick={() => window.location.reload()}
        >
          <RotateCcw size={18} className="mr-2" />
          Refresh Application
        </Button>
      </Card>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}
