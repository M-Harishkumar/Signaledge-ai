import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0F17] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none shrink-0 whitespace-nowrap';

  const variantStyles = {
    primary: 'bg-[#10B981] hover:bg-[#059669] text-[#0B0F17] font-semibold focus:ring-[#10B981] shadow-sm',
    secondary: 'bg-[#1E293B] hover:bg-[#334155] text-[#F3F4F6] focus:ring-[#64748B] border border-[#334155]',
    outline: 'bg-transparent hover:bg-[#1E293B] text-[#E5E7EB] border border-[#334155] focus:ring-[#64748B]',
    ghost: 'bg-transparent hover:bg-[#1E293B] text-[#9CA3AF] hover:text-[#F3F4F6] focus:ring-[#64748B]',
    danger: 'bg-[#F43F5E] hover:bg-[#E11D48] text-white focus:ring-[#F43F5E]',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variantStyles[variant], sizeStyles[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
