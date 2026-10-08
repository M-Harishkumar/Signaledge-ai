import React from 'react';
import {
  Radio,
  Building2,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  BrainCircuit,
  Bell,
  Layers,
  Plus,
} from 'lucide-react';
import { User, Signal, Company, Watchlist, AlertItem, OpportunityItem, ResearchThesis, MonitoringChangeItem } from '../types';
import { StatCard } from '../components/common/StatCard';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { api } from '../services/api';

export interface DashboardPageProps {
  user: User;
  signals: Signal[];
  companies: Company[];
  watchlists: Watchlist[];
  alerts: AlertItem[];
  opportunities: OpportunityItem[];
  theses: ResearchThesis[];
  onNavigate: (route: string) => void;
  onRateSignal: (signalId: string, rating: 'USEFUL' | 'NOT_USEFUL') => void;
  onSelectCompany: (symbol: string) => void;
  onSelectSignal: (signal: Signal) => void;
  onOpenInvestigate: (symbol: string) => void;
  onOpenNewThesis: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  signals,
  companies,
  watchlists,
  alerts,
  opportunities,
  theses,
  onNavigate,
  onRateSignal,
  onSelectCompany,
  onSelectSignal,
  onOpenInvestigate,
  onOpenNewThesis,
}) => {
  const [monitoringChanges, setMonitoringChanges] = React.useState<MonitoringChangeItem[]>([]);
  const topSignals = signals.slice(0, 3);
  const primaryWatchlist = watchlists[0] || { companies: [] };

  React.useEffect(() => {
    let mounted = true;
    api.getMonitoringChanges().then((items) => {
      if (mounted) setMonitoringChanges(items.slice(0, 4));
    }).catch(console.error);
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Welcome & System Provenance Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#161F30] to-[#111827] border border-[#1F293D] relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge variant="emerald" size="sm" dot>
              Demo / Cached NSE Data
            </Badge>
            <span className="text-xs text-[#9CA3AF] font-mono">
              NSE: NIFTY 50 • 24,840.25 (+0.42%)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F4F6] tracking-tight font-display">
            Welcome back, {user.display_name}
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1 max-w-xl">
            {signals.length} leading indicators active across {companies.length} tracked Indian equities. Next pre-market brief delivers at 07:01 IST.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <Button size="sm" variant="outline" onClick={onOpenNewThesis}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Draft Investment View
          </Button>
          <Button size="sm" variant="primary" onClick={() => onNavigate('/brief')}>
            <Radio className="w-3.5 h-3.5 mr-1" /> Open Market Update
          </Button>
        </div>
      </div>

      {/* Top Intelligence Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Market Signals"
          value={signals.length}
          change={12.4}
          changeSuffix="% this week"
          subtitle="Signal lead times 30-120d"
        />
        <StatCard
          label="Companies Tracked"
          value={companies.length}
          subtitle="800+ NSE Universe"
        />
        <StatCard
          label="Active Investment Views"
          value={theses.length}
          subtitle="Risk and growth parameters set"
        />
        <StatCard
          label="Unread Alerts"
          value={alerts.filter((a) => !a.is_read).length}
          subtitle="Important company updates"
        />
      </div>

      {/* Opportunity Pipeline Flow Bar */}
      <Card variant="elevated">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase text-emerald-400">Research Progress</span>
            <span className="text-[11px] text-[#6B7280]">Research workflow stages</span>
          </div>
          <button
            onClick={() => onNavigate('/workspace')}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono"
          >
            Open Workspace <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {[
            { label: '1. New Signals', count: opportunities.filter((o) => o.status === 'NEW').length, color: 'text-blue-400' },
            { label: '2. In Research', count: opportunities.filter((o) => o.status === 'INVESTIGATING').length, color: 'text-amber-400' },
            { label: '3. Passed Checks', count: opportunities.filter((o) => o.status === 'VALIDATED').length, color: 'text-emerald-400' },
            { label: '4. Watching', count: opportunities.filter((o) => o.status === 'WATCHING').length, color: 'text-purple-400' },
            { label: '5. Closed / Disproved', count: opportunities.filter((o) => o.status === 'INVALIDATED').length, color: 'text-rose-400' },
          ].map((stage, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('/workspace')}
              className="p-3 rounded-xl bg-[#0B0F17] hover:bg-[#161F30] border border-[#1F293D] transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] text-[#9CA3AF] block font-mono">{stage.label}</span>
                <span className={`text-base font-bold font-mono ${stage.color}`}>{stage.count}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Main 2-Column Command Center Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Pre-Recognition Signals */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-[#F3F4F6]">
                Key Market Signals Today
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 font-bold">
                Daily Feed
              </span>
            </div>
            <button
              onClick={() => onNavigate('/brief')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              View all {signals.length} signals <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topSignals.map((sig) => (
              <Card
                key={sig.signal_id}
                variant="elevated"
                className="hover:border-[#334155] transition-all cursor-pointer"
                onClick={() => onSelectSignal(sig)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={
                          sig.confidence_label === 'FACT'
                            ? 'teal'
                            : sig.confidence_label === 'HIGH_CONF'
                            ? 'emerald'
                            : 'amber'
                        }
                        size="sm"
                        dot
                      >
                        {sig.confidence_label} • {sig.confidence_score}%
                      </Badge>
                      <Badge variant="slate" size="sm">
                        {sig.signal_type.replace('_', ' ')}
                      </Badge>
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {sig.nse_symbol}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#6B7280] font-mono shrink-0">
                      Lead: ~{sig.lead_time_days}d
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#F3F4F6] hover:text-emerald-400 transition font-display">
                      {sig.signal_title}
                    </h3>
                    <p className="text-xs text-[#9CA3AF] mt-1 line-clamp-2 leading-relaxed">
                      {sig.signal_summary}
                    </p>
                  </div>

                  {/* Why am I seeing this? */}
                  <div className="p-2.5 rounded-lg bg-[#0B0F17] border border-[#1F293D] text-[11px] text-[#9CA3AF] flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#D1D5DB]">Why prioritized:</strong> {sig.why_am_i_seeing_this}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#1F293D] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#6B7280]">Relevant?</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRateSignal(sig.signal_id, 'USEFUL');
                        }}
                        className={`p-1 rounded transition cursor-pointer ${
                          sig.user_rating === 'USEFUL'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-[#6B7280] hover:text-[#E5E7EB]'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRateSignal(sig.signal_id, 'NOT_USEFUL');
                        }}
                        className={`p-1 rounded transition cursor-pointer ${
                          sig.user_rating === 'NOT_USEFUL'
                            ? 'text-rose-400 bg-rose-500/10'
                            : 'text-[#6B7280] hover:text-[#E5E7EB]'
                        }`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenInvestigate(sig.nse_symbol);
                        }}
                      >
                        Research &rarr;
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Meaningful Watched Company Delta Feed */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-[#F3F4F6]">
                  Updates on Companies You Watch
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 font-bold">
                  Recent Changes
                </span>
              </div>
              <button
                onClick={() => onNavigate('/watchlists')}
                className="text-xs text-blue-400 hover:underline font-mono"
              >
                View Watchlist Updates &rarr;
              </button>
            </div>

            {monitoringChanges.length === 0 ? (
              <Card variant="elevated" className="text-center py-6 text-xs text-[#9CA3AF]">
                Scanning monitored equities for changes...
              </Card>
            ) : (
              <div className="space-y-2.5">
                {monitoringChanges.map((chg) => (
                  <Card key={chg.change_id} variant="elevated" className="hover:border-[#334155] transition">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant={
                              chg.severity === 'CRITICAL'
                                ? 'rose'
                                : chg.severity === 'HIGH'
                                ? 'amber'
                                : 'teal'
                            }
                            size="sm"
                          >
                            {chg.change_type}
                          </Badge>
                          <span className="font-mono font-bold text-[#F3F4F6]">{chg.nse_symbol}</span>
                          <span className="text-[11px] text-[#6B7280] font-mono">
                            {new Date(chg.when_changed).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#9CA3AF] bg-[#0B0F17] px-2 py-0.5 rounded border border-[#1F293D]">
                          Source: {chg.source}
                        </span>
                      </div>

                      <div>
                        <span className="font-bold text-[#F3F4F6] block">{chg.what_changed}</span>
                        <p className="text-[11px] text-[#9CA3AF] mt-0.5 leading-relaxed">
                          <strong className="text-[#D1D5DB]">Why changed:</strong> {chg.why_changed}
                        </p>
                      </div>

                      <div className="p-2 rounded bg-[#0B0F17] border border-[#1F293D] text-[11px] flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[#D1D5DB] font-semibold">Impact: </span>
                          <span className="text-[#9CA3AF]">{chg.impact}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="shrink-0 text-emerald-400 hover:text-emerald-300 text-[11px] py-1 h-auto"
                          onClick={() => onOpenInvestigate(chg.nse_symbol)}
                        >
                          {chg.investigation_action_type === 'PRE_BUY_GATE' ? 'Check Safety' : 'Research'} &rarr;
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Portfolio Watchlist & Quick Audit */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-[#F3F4F6]">
              Watchlist Summary
            </h2>
            <button
              onClick={() => onNavigate('/watchlists')}
              className="text-xs text-[#9CA3AF] hover:text-white font-mono cursor-pointer"
            >
              All Watchlists
            </button>
          </div>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>{primaryWatchlist.name || 'Primary Watchlist'}</CardTitle>
              <CardDescription>Companies you are watching and their research status</CardDescription>
            </CardHeader>

            <div className="space-y-3">
              {primaryWatchlist.companies?.map((comp) => {
                const isPositive = comp.price_change_pct >= 0;
                return (
                  <div
                    key={comp.nse_symbol}
                    onClick={() => onOpenInvestigate(comp.nse_symbol)}
                    className="p-3 rounded-lg bg-[#111827] hover:bg-[#1E293B] border border-[#1F293D] hover:border-[#334155] transition cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#F3F4F6] font-mono shrink-0">
                          {comp.nse_symbol}
                        </span>
                        <Badge variant="slate" size="sm" className="shrink-0">
                          {comp.research_status || 'WATCHING'}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5 truncate">{comp.notes}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-[#F3F4F6] block">
                        ₹{comp.current_price.toLocaleString('en-IN')}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-semibold ${
                          isPositive ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {comp.price_change_pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Quick Gate Launch */}
          <Card variant="elevated" className="border-emerald-500/20 bg-gradient-to-b from-[#161F30] to-[#111827]">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-[#F3F4F6]">
                Before You Invest Quality Check
              </h4>
            </div>
            <p className="text-xs text-[#9CA3AF] mb-3">
              Automated quality check for profitability, debt health, and safety before investing.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {companies.slice(0, 4).map((c) => (
                <button
                  key={c.nse_symbol}
                  onClick={() => onOpenInvestigate(c.nse_symbol)}
                  className="p-2 rounded-lg bg-[#111827] hover:bg-[#1E293B] border border-[#1F293D] text-left transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#F3F4F6]">{c.nse_symbol}</span>
                    <Badge variant={c.prebuy_verdict === 'PASS' ? 'emerald' : 'amber'} size="sm">
                      {c.prebuy_verdict}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-[#6B7280] font-mono block mt-1">
                    RoCE: {c.roce}%
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* SEBI Compliance Banner */}
      <DisclaimerBanner />
    </div>
  );
};
