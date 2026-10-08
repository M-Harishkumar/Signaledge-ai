import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

export interface AlertBannerProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'info',
  title,
  message,
  onDismiss,
  className = '',
}) => {
  const configs = {
    info: {
      bg: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
      icon: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
      icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    },
  };

  const current = configs[type];

  return (
    <div className={clsx('flex items-start justify-between p-3.5 rounded-xl border text-xs', current.bg, className)}>
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5">{current.icon}</span>
        <div>
          {title && <span className="font-semibold block mb-0.5">{title}</span>}
          <span className="leading-relaxed opacity-90">{message}</span>
        </div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="p-1 opacity-70 hover:opacity-100 transition cursor-pointer">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
