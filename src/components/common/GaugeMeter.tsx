import React from 'react';
import { clsx } from 'clsx';

export interface GaugeMeterProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'teal' | 'amber' | 'rose';
  className?: string;
}

export const GaugeMeter: React.FC<GaugeMeterProps> = ({
  value,
  max = 100,
  label,
  size = 'md',
  color,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const calculatedColor =
    color || (percentage >= 75 ? 'emerald' : percentage >= 50 ? 'amber' : 'rose');

  const strokeColors = {
    emerald: '#10B981',
    teal: '#14B8A6',
    amber: '#F59E0B',
    rose: '#F43F5E',
  };

  const dim = size === 'sm' ? 64 : size === 'md' ? 88 : 120;
  const strokeWidth = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const radius = (dim - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={clsx('flex flex-col items-center justify-center', className)}>
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            stroke="#1F293D"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            stroke={strokeColors[calculatedColor]}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className={clsx(
              'font-mono font-bold text-[#F3F4F6]',
              size === 'sm' ? 'text-xs' : size === 'md' ? 'text-base' : 'text-xl'
            )}
          >
            {Math.round(value)}%
          </span>
        </div>
      </div>
      {label && <span className="text-[11px] font-medium text-[#9CA3AF] mt-1.5">{label}</span>}
    </div>
  );
};
