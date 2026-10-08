import React from 'react';
import {
  LayoutDashboard,
  Radio,
  Compass,
  Building2,
  Filter,
  BrainCircuit,
  Binary,
  Bookmark,
  Award,
  Settings,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';

export interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  className = '',
}) => {
  const mainNavItems = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, route: '/dashboard' },
    { label: "Today's Market Update", icon: <Radio className="w-4 h-4" />, route: '/brief' },
    { label: 'Find Opportunities', icon: <Compass className="w-4 h-4" />, route: '/discovery' },
    { label: 'Research Company', icon: <Building2 className="w-4 h-4" />, route: '/companies' },
    { label: 'Stock Screener', icon: <Filter className="w-4 h-4" />, route: '/screener' },
    { label: 'Research Workspace', icon: <Briefcase className="w-4 h-4" />, route: '/workspace' },
  ];

  const intelligenceNavItems = [
    { label: 'Different Investor Views', icon: <BrainCircuit className="w-4 h-4" />, route: '/simulation' },
    { label: 'Economic & Regional Impact', icon: <Binary className="w-4 h-4" />, route: '/analysis' },
    { label: "Companies I'm Watching", icon: <Bookmark className="w-4 h-4" />, route: '/watchlists' },
    { label: 'Settings & Security', icon: <Settings className="w-4 h-4" />, route: '/settings' },
  ];

  const renderItem = (item: { label: string; icon: React.ReactNode; route: string }) => {
    const isDiscoveryActive =
      item.route === '/discovery' &&
      [
        '/discovery',
        '/supply-chain',
        '/regulatory',
        '/strategy-dna',
        '/institutional',
        '/macro-simulator',
        '/constraint-cast',
        '/forensic-quality',
        '/cross-asset',
        '/research-bridge',
      ].includes(currentRoute);

    const isCompanyActive = item.route === '/companies' && (currentRoute === '/companies' || currentRoute === '/company-detail');

    const isActive = currentRoute === item.route || isDiscoveryActive || isCompanyActive;

    return (
      <button
        key={item.route}
        onClick={() => onNavigate(item.route)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer ${
          isActive
            ? 'bg-[#1E293B] text-[#F3F4F6] font-semibold border-l-2 border-[#10B981]'
            : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#161F30]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className={isActive ? 'text-[#10B981]' : 'text-[#9CA3AF]'}>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      </button>
    );
  };

  return (
    <aside
      className={`w-64 bg-[#0B0F17] border-r border-[#1F293D] flex flex-col justify-between p-4 shrink-0 select-none ${className}`}
    >
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 px-2 py-1 cursor-pointer" onClick={() => onNavigate('/dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#10B981] shadow-sm glow-emerald">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-[#F3F4F6] tracking-tight font-display">
                SignalEdge
              </span>
              <span className="text-[10px] font-mono px-1 py-0.2 bg-[#1E293B] text-[#9CA3AF] rounded">
                OS
              </span>
            </div>
            <span className="text-[10px] text-[#6B7280] block font-mono">India Equities</span>
          </div>
        </div>

        {/* Navigation Core */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-semibold tracking-wider text-[#6B7280] uppercase font-mono">
            Core Workflow
          </span>
          <div className="mt-1 space-y-0.5">{mainNavItems.map(renderItem)}</div>
        </div>

        {/* Intelligence Engines */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-semibold tracking-wider text-[#6B7280] uppercase font-mono">
            Intelligence Engines
          </span>
          <div className="mt-1 space-y-0.5">{intelligenceNavItems.map(renderItem)}</div>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="pt-4 border-t border-[#1F293D] space-y-2">
        <div className="px-3 py-2 rounded-xl bg-[#111827] border border-[#1F293D] flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#9CA3AF]">Market Feed</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Cached / Demo
          </span>
        </div>
      </div>
    </aside>
  );
};
