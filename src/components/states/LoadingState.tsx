import React from 'react';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading financial models & intelligence streams...',
  className = '',
}) => {
  return (
    <div className={`py-16 text-center space-y-3 flex flex-col items-center justify-center ${className}`}>
      <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
      <p className="text-xs text-[#9CA3AF] font-mono tracking-tight">{message}</p>
    </div>
  );
};
