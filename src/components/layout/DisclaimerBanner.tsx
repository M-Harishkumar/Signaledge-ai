import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { SEBI_MANDATORY_DISCLAIMER } from '../../data/seedData';

export const DisclaimerBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <footer className={`mt-12 p-4 rounded-xl bg-[#0D131F] border border-[#1F293D] text-[11px] text-[#6B7280] leading-relaxed flex items-start gap-3 ${className}`}>
      <ShieldAlert className="w-4 h-4 text-emerald-500/60 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-[#9CA3AF] uppercase tracking-wider font-mono block mb-1">
          Regulatory Disclaimer & Risk Warning (SEBI Compliance Notice)
        </span>
        <p>{SEBI_MANDATORY_DISCLAIMER}</p>
      </div>
    </footer>
  );
};
