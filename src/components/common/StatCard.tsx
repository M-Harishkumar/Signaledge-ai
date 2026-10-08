import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeSuffix?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'highlight';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  changeSuffix = '%',
  subtitle,
  icon,
  variant = 'default',
  className,
}) => {
  const isPositive = change !== undefined && change >= 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div
      className={twMerge(
        clsx(
          'p-4 sm:p-5 rounded-xl border transition-all duration-150',
          variant === 'highlight'
            ? 'bg-[#161F30] border-emerald-500/30'
            : 'bg-[#111827] border-[#1F293D]',
          className
        )
      )}
    >
      <div className="flex items-center justify-between text-[#9CA3AF] mb-2">
        <span className="text-xs font-medium tracking-wide uppercase">{label}</span>
        {icon && <div className="text-[#9CA3AF] p-1.5 rounded-lg bg-[#1F293D]/50">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono text-[#F3F4F6] tracking-tight">{value}</span>
        {change !== undefined && (
          <span
            className={clsx(
              'inline-flex items-center gap-0.5 text-xs font-mono font-semibold px-1.5 py-0.5 rounded',
              isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
            )}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? '+' : ''}
            {change}
            {changeSuffix}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-[#6B7280] mt-1 font-sans">{subtitle}</p>}
    </div>
  );
};
