import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'underline',
}) => {
  if (variant === 'pills') {
    return (
      <div className={twMerge(clsx('flex items-center gap-1.5 p-1 bg-[#111827] border border-[#1F293D] rounded-xl overflow-x-auto flex-nowrap scrollbar-none shrink-0', className))}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer',
                isActive
                  ? 'bg-[#1E293B] text-[#F3F4F6] shadow-sm font-semibold'
                  : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#161F30]'
              )}
            >
              {tab.icon && <span className="w-3.5 h-3.5 shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={clsx(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-mono shrink-0',
                    isActive ? 'bg-[#334155] text-white' : 'bg-[#1F293D] text-[#9CA3AF]'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={twMerge(clsx('flex items-center gap-6 border-b border-[#1F293D] overflow-x-auto flex-nowrap scrollbar-none shrink-0', className))}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 py-3 text-sm font-medium border-b-2 -mb-px transition whitespace-nowrap shrink-0 cursor-pointer',
              isActive
                ? 'border-[#10B981] text-[#10B981] font-semibold'
                : 'border-transparent text-[#9CA3AF] hover:text-[#E5E7EB] hover:border-[#334155]'
            )}
          >
            {tab.icon && <span className="w-4 h-4 shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'text-xs px-1.5 py-0.5 rounded-full font-mono shrink-0',
                  isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#1F293D] text-[#9CA3AF]'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
