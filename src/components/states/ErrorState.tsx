import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Data Feed Interrupted',
  message = 'We encountered an issue fetching this data stream. Please check your connection and try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-8 rounded-2xl bg-[#111827] border border-rose-500/30 text-center flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-[#F3F4F6] font-display">{title}</h3>
        <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto mt-1 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Try Again
        </Button>
      )}
    </div>
  );
};
