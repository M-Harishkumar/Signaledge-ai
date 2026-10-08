import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className,
  ...props
}) => {
  const baseStyles = 'rounded-xl border transition-all duration-150 overflow-hidden min-w-0';

  const variantStyles = {
    default: 'bg-[#111827] border-[#1F293D] text-[#E5E7EB]',
    elevated: 'bg-[#161F30] border-[#1F293D] text-[#E5E7EB] shadow-lg shadow-black/20',
    glass: 'bg-[#161F30]/80 backdrop-blur-md border-[#1F293D]/90 text-[#E5E7EB]',
    interactive:
      'bg-[#111827] hover:bg-[#161F30] border-[#1F293D] hover:border-[#334155] text-[#E5E7EB] cursor-pointer shadow-sm hover:shadow-md',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3.5',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-7',
  };

  return (
    <div className={twMerge(clsx(baseStyles, variantStyles[variant], paddingStyles[padding], className))} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={twMerge(clsx('flex items-center justify-between pb-3.5 mb-4 border-b border-[#1F293D] flex-wrap gap-2 min-w-0', className))} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className, ...props }) => (
  <h3 className={twMerge(clsx('text-base font-semibold text-[#F3F4F6] tracking-tight font-display break-words min-w-0', className))} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className, ...props }) => (
  <p className={twMerge(clsx('text-xs text-[#9CA3AF] mt-0.5 leading-relaxed break-words', className))} {...props}>
    {children}
  </p>
);
