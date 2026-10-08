import React, { useState, useMemo } from 'react';
import {
  Compass,
  ArrowRight,
  Shield,
  Activity,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  BrainCircuit,
  Filter,
  Layers2,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Signal, RegulatoryTheme, SignalStreamId, FactLevel, MacroExposureItem } from '../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { SIGNAL_STREAM_DEFINITIONS, SignalService } from '../services/signalService';
import { api } from '../services/api';

export interface DiscoveryHubPageProps {
  activeView: string;
  signals: Signal[];
  regulatoryThemes: RegulatoryTheme[];
  onSelectCompany: (symbol: string) => void;
  onSelectSignal: (signal: Signal) => void;
  onRunSimulation: (scenario: string) => void;
  onInvestigate?: (symbol: string) => void;
  onRunPreBuy?: (symbol: string) => void;
}

export const DiscoveryHubPage: React.FC<DiscoveryHubPageProps> = ({
  activeView,
  signals,
  regulatoryThemes,
  onSelectCompany,
  onSelectSignal,
  onRunSimulation,
  onInvestigate,
  onRunPreBuy,
}) => {
  // Map initial view to stream if applicable
  const initialStream = useMemo<SignalStreamId | 'ALL'>(() => {
    switch (activeView) {
      case 'regulatory':
        return 'F1';
      case 'strategy-dna':
        return 'F2';
      case 'institutional':
        return 'F3';
      case 'macro-simulator':
      case 'analysis':
        return 'F4';
      case 'supply-chain':
      case 'constraint-cast':
        return 'F5';
      case 'forensic-quality':
        return 'F6';
      case 'cross-asset':
      case 'research-bridge':
        return 'F7';
      default:
        return 'ALL';
    }
  }, [activeView]);

  const [selectedStream, setSelectedStream] = useState<SignalStreamId | 'ALL'>(initialStream);
  const [selectedFactLevel, setSelectedFactLevel] = useState<FactLevel | 'ALL'>('ALL');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [groupDuplicates, setGroupDuplicates] = useState<boolean>(true);
  const [sharedRisks, setSharedRisks] = useState<MacroExposureItem[]>([]);

  React.useEffect(() => {
    api.getCommonRisks()
      .then((data) => setSharedRisks(data))
      .catch(() => setSharedRisks([]));
  }, []);

  // Normalize all input signals
  const normalizedSignals = useMemo(() => {
    return signals.map((s) => SignalService.normalizeSignal(s));
  }, [signals]);

  // Unique industries list
  const industries = useMemo(() => {
    const set = new Set<string>();
    normalizedSignals.forEach((s) => {
      if (s.affected_industry) set.add(s.affected_industry);
      if (s.sector) set.add(s.sector);
    });
    return Array.from(set).sort();
  }, [normalizedSignals]);

  // Filter signals based on criteria
  const filteredSignals = useMemo(() => {
    let list = normalizedSignals;

    if (selectedStream !== 'ALL') {
      list = list.filter((s) => s.signal_stream === selectedStream);
    }

    if (selectedFactLevel !== 'ALL') {
      list = list.filter((s) => s.fact_level === selectedFactLevel);
    }

    if (selectedIndustry !== 'ALL') {
      list = list.filter(
        (s) => s.affected_industry === selectedIndustry || s.sector === selectedIndustry
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.signal_title.toLowerCase().includes(q) ||
          s.signal_summary.toLowerCase().includes(q) ||
          s.nse_symbol.toLowerCase().includes(q) ||
          s.company_name.toLowerCase().includes(q) ||
          s.catalyst_event.toLowerCase().includes(q) ||
          (s.source && s.source.toLowerCase().includes(q))
      );
    }

    if (groupDuplicates) {
      const { groupedSignals } = SignalService.detectAndGroupDuplicates(list);
      list = groupedSignals.filter((s) => s.is_cluster_primary);
    }

    return list;
  }, [normalizedSignals, selectedStream, selectedFactLevel, selectedIndustry, searchQuery, groupDuplicates]);

  // Stream stats
  const streamCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: normalizedSignals.length,
      F1: normalizedSignals.filter((s) => s.signal_stream === 'F1').length,
      F2: normalizedSignals.filter((s) => s.signal_stream === 'F2').length,
      F3: normalizedSignals.filter((s) => s.signal_stream === 'F3').length,
      F4: normalizedSignals.filter((s) => s.signal_stream === 'F4').length,
      F5: normalizedSignals.filter((s) => s.signal_stream === 'F5').length,
      F6: normalizedSignals.filter((s) => s.signal_stream === 'F6').length,
      F7: normalizedSignals.filter((s) => s.signal_stream === 'F7').length,
    };
    return counts;
  }, [normalizedSignals]);

  const streamInfo = selectedStream !== 'ALL' ? SIGNAL_STREAM_DEFINITIONS[selectedStream] : null;

  const renderFactLevelBadge = (level?: FactLevel) => {
    switch (level) {
      case 'FACT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <CheckCircle2 className="w-3 h-3" /> Verified Fact
          </span>
        );
      case 'CALCULATED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Activity className="w-3 h-3" /> Calculated
          </span>
        );
      case 'INFERENCE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <BrainCircuit className="w-3 h-3" /> AI/Calculated Insight
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <HelpCircle className="w-3 h-3" /> Unknown / Not Available
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F293D] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/10 text-teal-400">
                <Compass className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold uppercase text-teal-400 tracking-wider">
                Find Opportunities • Market Signals
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F3F4F6] tracking-tight font-display">
              {streamInfo ? streamInfo.name : 'Find Opportunities & Catalysts'}
            </h1>
            <p className="text-xs text-[#9CA3AF] max-w-3xl leading-relaxed">
              {streamInfo
                ? streamInfo.description
                : 'Systematic multi-vector opportunity discovery across verified Indian market intelligence streams.'}
            </p>
          </div>

          {streamInfo && (
            <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#1F293D] text-xs font-mono shrink-0 space-y-1">
              <div className="text-[#6B7280] text-[10px] uppercase">Signal Focus</div>
              <div className="text-emerald-400 font-bold">{streamInfo.category}</div>
              <div className="text-[11px] text-[#9CA3AF]">{streamInfo.dataSource.split(',')[0]}</div>
            </div>
          )}
        </div>

        {/* F1 - F7 Stream Tabs */}
        <div className="mt-6 pt-4 border-t border-[#1F293D] flex items-center gap-1.5 overflow-x-auto pb-1 flex-nowrap scrollbar-none shrink-0">
          <button
            onClick={() => setSelectedStream('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer shrink-0 whitespace-nowrap ${
              selectedStream === 'ALL'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#161F30]'
            }`}
          >
            All Signals ({streamCounts.ALL || 0})
          </button>

          {(Object.keys(SIGNAL_STREAM_DEFINITIONS) as SignalStreamId[]).map((stId) => {
            const def = SIGNAL_STREAM_DEFINITIONS[stId];
            const isActive = selectedStream === stId;
            return (
              <button
                key={stId}
                onClick={() => setSelectedStream(stId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#161F30]'
                }`}
              >
                <span>{def.name}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#0B0F17] text-[#6B7280]">
                  {streamCounts[stId] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-[#111827] border border-[#1F293D] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search catalyst, company symbol, or evidence source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#0B0F17] border border-[#1F293D] rounded-lg text-xs text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Fact Level Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] text-[#6B7280] font-mono shrink-0">Source Type:</span>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'FACT', label: 'Verified Fact' },
            { id: 'CALCULATED', label: 'Calculated' },
            { id: 'INFERENCE', label: 'AI Insight' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSelectedFactLevel(id as any)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition cursor-pointer shrink-0 ${
                selectedFactLevel === id
                  ? 'bg-[#1E293B] text-emerald-400 border border-emerald-500/40'
                  : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#161F30]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Industry dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="bg-[#0B0F17] border border-[#1F293D] rounded-lg px-2.5 py-2 text-xs text-[#D1D5DB] focus:outline-none focus:border-emerald-500/50 cursor-pointer"
          >
            <option value="ALL">All Industries</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>

          {/* Group Duplicates Toggle */}
          <button
            onClick={() => setGroupDuplicates(!groupDuplicates)}
            className={`px-2.5 py-2 rounded-lg border text-xs font-mono transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              groupDuplicates
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-[#0B0F17] text-[#9CA3AF] border-[#1F293D]'
            }`}
            title="Group similar catalyst signals"
          >
            <Layers2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Group Similar</span>
          </button>
        </div>
      </div>

      {/* Monitored Policy Pipeline for F1 / Regulatory View */}
      {(selectedStream === 'F1' || selectedStream === 'ALL') && regulatoryThemes && regulatoryThemes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-[#9CA3AF] flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" /> Monitored Government Directives & Policy Updates
            </h2>
            <span className="text-xs text-[#6B7280] font-mono">{regulatoryThemes.length} Active Directives</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regulatoryThemes.map((theme) => (
              <Card key={theme.theme_id} variant="elevated">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="teal" size="sm" dot>
                      {theme.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-[11px] text-[#6B7280] font-mono">{theme.ministry}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#F3F4F6] font-display">{theme.title}</h3>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">{theme.impact_summary}</p>

                  <div className="pt-2 border-t border-[#1F293D] flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-[#6B7280] font-mono">Beneficiaries:</span>
                      {theme.beneficiary_companies.map((sym) => (
                        <div key={sym} className="flex items-center gap-1">
                          <button
                            onClick={() => onSelectCompany(sym)}
                            className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold hover:underline cursor-pointer"
                          >
                            {sym}
                          </button>
                          {onInvestigate && (
                            <button
                              onClick={() => onInvestigate(sym)}
                              className="text-[9px] font-mono text-[#9CA3AF] hover:text-emerald-300 p-0.5"
                              title={`Research ${sym}`}
                            >
                              [Research]
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRunSimulation(`Regulatory impact analysis: ${theme.title}`)}
                    >
                      Test Impact &rarr;
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Common Shared Macro & Supply Chain Risks */}
      {sharedRisks.length > 0 && (
        <Card variant="elevated" className="border-cyan-500/20 bg-gradient-to-br from-[#0F172A] to-[#0B0F17] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-cyan-400 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> Shared Economic & Supply Chain Risks ({sharedRisks.length})
            </h2>
            <span className="text-[11px] font-mono text-[#6B7280]">Key Market Risks</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sharedRisks.slice(0, 3).map((sr, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D] space-y-2 text-xs">
                <div className="flex items-start justify-between gap-1">
                  <Badge variant={sr.severity === 'HIGH' || sr.severity === 'CRITICAL' ? 'rose' : 'amber'} size="sm">
                    {sr.severity} • {sr.category}
                  </Badge>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">{sr.affected_count} Companies</span>
                </div>
                <h4 className="font-bold text-[#F3F4F6] text-xs leading-snug">{sr.driver}</h4>
                <p className="text-[#9CA3AF] text-[11px] line-clamp-2">{sr.possible_transmission}</p>
                <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-[#1F293D]">
                  <span className="text-[9px] text-[#6B7280] font-mono">Affected:</span>
                  {sr.affected_symbols.slice(0, 4).map((sym) => (
                    <button
                      key={sym}
                      onClick={() => onSelectCompany(sym)}
                      className="px-1.5 py-0.5 rounded bg-[#161F30] text-emerald-400 text-[10px] font-mono font-bold hover:underline cursor-pointer"
                    >
                      {sym}
                    </button>
                  ))}
                  {sr.affected_symbols.length > 4 && (
                    <span className="text-[9px] text-[#6B7280] font-mono">+{sr.affected_symbols.length - 4} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Signals Stream Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-[#9CA3AF] flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> Active Market Signals ({filteredSignals.length})
          </h2>
          <span className="text-xs text-[#6B7280] font-mono">
            {groupDuplicates ? 'Grouped by company/event' : 'All signals'}
          </span>
        </div>

        {filteredSignals.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#111827] border border-[#1F293D] space-y-2">
            <HelpCircle className="w-8 h-8 text-[#6B7280] mx-auto" />
            <h3 className="text-sm font-bold text-[#F3F4F6]">No signals matching active filter criteria</h3>
            <p className="text-xs text-[#9CA3AF]">
              Try adjusting the source type, industry selection, or search query.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSignals.map((sig) => {
              const streamDef = sig.signal_stream
                ? SIGNAL_STREAM_DEFINITIONS[sig.signal_stream]
                : null;
              const scoring = sig.scoring_breakdown || SignalService.calculateScoringBreakdown(sig);

              return (
                <Card
                  key={sig.signal_id}
                  variant="elevated"
                  className="hover:border-[#334155] transition space-y-4 cursor-default"
                >
                  {/* Card Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Stream badge */}
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {sig.signal_stream || 'F1'}: {streamDef?.name || sig.signal_type.replace('_', ' ')}
                        </span>

                        {/* Fact Level */}
                        {renderFactLevelBadge(sig.fact_level)}

                        {/* Regulatory Status */}
                        {sig.regulatory_status && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                            {sig.regulatory_status}
                          </span>
                        )}

                        {/* Primary Symbol */}
                        <button
                          onClick={() => onSelectCompany(sig.nse_symbol)}
                          className="font-mono font-bold text-emerald-400 hover:underline cursor-pointer text-sm"
                        >
                          {sig.nse_symbol}
                        </button>
                        <span className="text-[11px] text-[#9CA3AF]">({sig.company_name})</span>

                        {/* Lead time & Confidence */}
                        <span className="text-[11px] text-[#6B7280] font-mono">
                          Lead Time: ~{sig.lead_time_days}d
                        </span>
                        <Badge variant="teal" size="sm">
                          {sig.confidence_score}% Confidence
                        </Badge>

                        {sig.merged_signal_count && sig.merged_signal_count > 1 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/30">
                            {sig.merged_signal_count} merged catalysts
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => onSelectSignal(sig)}
                        className="font-bold text-[#F3F4F6] text-base hover:text-emerald-400 transition cursor-pointer font-display"
                      >
                        {sig.signal_title}
                      </h3>
                      <p className="text-xs text-[#D1D5DB] leading-relaxed">
                        {sig.signal_summary}
                      </p>
                    </div>

                    {/* Transparent Scoring Meter */}
                    <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D] flex items-center gap-4 shrink-0 text-right">
                      <div>
                        <span className="text-[10px] text-[#6B7280] font-mono block uppercase">Signal Strength</span>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-lg font-bold text-emerald-400 font-mono">
                            {scoring.total_score}
                          </span>
                          <span className="text-[10px] text-[#6B7280] font-mono">/100</span>
                        </div>
                        <div className="text-[10px] text-[#9CA3AF] font-mono">
                          Quality: {scoring.source_quality} • Exposure: {scoring.company_exposure}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Causal Transmission / Why it matters & Invalidation Risk Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[#1F293D] text-xs">
                    {/* Why it Matters */}
                    <div className="p-3 rounded-xl bg-[#0B0F17]/60 border border-[#1F293D]/80 space-y-1">
                      <span className="text-[10px] font-bold font-mono uppercase text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Why It Matters
                      </span>
                      <p className="text-[#D1D5DB] text-[11px] leading-relaxed">
                        {sig.why_it_matters || sig.why_am_i_seeing_this}
                      </p>
                    </div>

                    {/* Invalidation Risk */}
                    <div className="p-3 rounded-xl bg-[#0B0F17]/60 border border-[#1F293D]/80 space-y-1">
                      <span className="text-[10px] font-bold font-mono uppercase text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> What Would Prove This Wrong?
                      </span>
                      <p className="text-[#D1D5DB] text-[11px] leading-relaxed">
                        {sig.what_could_invalidate_it?.[0] ||
                          sig.what_could_prove_this_wrong?.[0] ||
                          sig.risk ||
                          'Structural policy delay or macro cyclical demand slowdown.'}
                      </p>
                    </div>
                  </div>

                  {/* Evidence & Affected Companies Bar */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    {/* Evidence Source & Affected Entities */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1 text-[11px] text-[#9CA3AF]">
                        <span className="text-[#6B7280] font-mono">Source:</span>
                        <span className="font-medium text-[#E5E7EB]">{sig.source || sig.evidence_list?.[0]?.source_name}</span>
                        {sig.source_url && (
                          <a
                            href={sig.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:text-emerald-300 ml-0.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* Affected / Beneficiary Badges */}
                      {sig.affected_companies && sig.affected_companies.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-[#6B7280] font-mono">Affected:</span>
                          {sig.affected_companies.map((aff) => (
                            <button
                              key={aff.nse_symbol}
                              onClick={() => onSelectCompany(aff.nse_symbol)}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                                aff.impact_direction === 'POSITIVE'
                                  ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                  : aff.impact_direction === 'NEGATIVE'
                                  ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                                  : 'bg-slate-500/10 text-slate-300 hover:bg-slate-500/20'
                              }`}
                              title={`${aff.rationale} (${aff.exposure_score}% exposure • ${aff.exposure_tier || 'DIRECT'})`}
                            >
                              {aff.exposure_tier && (
                                <span className="text-[8px] opacity-70 uppercase tracking-tighter">
                                  [{aff.exposure_tier.charAt(0)}]
                                </span>
                              )}
                              <span>{aff.nse_symbol}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Transitions */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {onInvestigate && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onInvestigate(sig.nse_symbol)}
                        >
                          <Search className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Research Company
                        </Button>
                      )}

                      {onRunPreBuy && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRunPreBuy(sig.nse_symbol)}
                        >
                          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-400" /> Before You Invest
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSelectCompany(sig.nse_symbol)}
                      >
                        Company Financials
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          onRunSimulation(`Simulate equity transmission: ${sig.signal_title} on ${sig.nse_symbol}`)
                        }
                      >
                        <BrainCircuit className="w-3.5 h-3.5 mr-1" /> Different Investor Views
                      </Button>

                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onSelectSignal(sig)}
                      >
                        View Research Report <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <DisclaimerBanner />
    </div>
  );
};
