import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'card' | 'circle' | 'rect';
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  variant = 'text',
  className,
  ...props
}) => {
  const baseStyles = 'animate-pulse bg-[#1E293B] rounded';

  const variantStyles = {
    text: 'h-4 w-full',
    card: 'h-32 w-full rounded-xl',
    circle: 'w-10 h-10 rounded-full',
    rect: 'h-20 w-full rounded-lg',
  };

  return (
    <div
      className={twMerge(clsx(baseStyles, variantStyles[variant], className))}
      {...props}
    />
  );
};
