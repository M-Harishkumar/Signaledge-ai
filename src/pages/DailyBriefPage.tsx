import React, { useState, useEffect } from 'react';
import {
  Radio,
  Clock,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  FileText,
  AlertTriangle,
  HelpCircle,
  Search,
  Sparkles,
  ExternalLink,
  Layers,
  Zap,
  Globe,
  Info,
} from 'lucide-react';
import { Signal, SourceQualityTier, SignalStreamId, NewsFeedResult, FreshnessStatus } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Tabs } from '../components/common/Tabs';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { SIGNAL_STREAM_DEFINITIONS } from '../services/signalService';
import { api } from '../services/api';

export interface DailyBriefPageProps {
  signals: Signal[];
  onRateSignal: (signalId: string, rating: 'USEFUL' | 'NOT_USEFUL') => void;
  onSelectCompany: (symbol: string) => void;
  onSelectSignal: (signal: Signal) => void;
  onInvestigate?: (symbol: string) => void;
  onCreateThesis?: (symbol: string) => void;
}

export const DailyBriefPage: React.FC<DailyBriefPageProps> = ({
  signals,
  onRateSignal,
  onSelectCompany,
  onSelectSignal,
  onInvestigate,
  onCreateThesis,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedWhySignal, setExpandedWhySignal] = useState<string | null>(null);
  const [marketNews, setMarketNews] = useState<NewsFeedResult | null>(null);
  const [isNewsExpanded, setIsNewsExpanded] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    api.getMarketNews(8).then((data) => {
      if (isMounted) setMarketNews(data);
    }).catch(() => null);
    return () => {
      isMounted = false;
    };
  }, []);

  const renderFreshnessBadge = (status: FreshnessStatus) => {
    switch (status) {
      case 'LIVE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE (&lt;24h)
          </span>
        );
      case 'RECENT':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shrink-0">
            RECENT (&lt;7d)
          </span>
        );
      case 'HISTORICAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/40 shrink-0">
            HISTORICAL
          </span>
        );
      case 'STALE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
            STALE (&gt;7d)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-500/20 text-slate-400 border border-slate-500/40 shrink-0">
            UNVERIFIED
          </span>
        );
    }
  };

  const categories = [
    { id: 'ALL', label: 'All Signals', count: signals.length },
    { id: 'F1', label: 'Policy & Regulation', count: signals.filter((s) => s.signal_stream === 'F1' || s.signal_type === 'REGULATORY' || s.signal_type === 'F1_REGULATORY').length },
    { id: 'F2', label: 'Company Strategy', count: signals.filter((s) => s.signal_stream === 'F2' || s.signal_type === 'STRATEGY_DNA' || s.signal_type === 'F2_STRATEGY_DNA').length },
    { id: 'F3', label: 'Big Investor Activity', count: signals.filter((s) => s.signal_stream === 'F3' || s.signal_type === 'INSTITUTIONAL' || s.signal_type === 'F3_INSTITUTIONAL').length },
    { id: 'F4', label: 'Economic Impact', count: signals.filter((s) => s.signal_stream === 'F4' || s.signal_type === 'MACRO_SIMULATOR' || s.signal_type === 'F4_MACRO_CASCADE').length },
    { id: 'F5', label: 'Supply Chain', count: signals.filter((s) => s.signal_stream === 'F5' || s.signal_type === 'SUPPLY_CHAIN' || s.signal_type === 'F5_SUPPLY_CHAIN').length },
    { id: 'F6', label: 'Financial Risk Check', count: signals.filter((s) => s.signal_stream === 'F6' || s.signal_type === 'FORENSIC_QUALITY' || s.signal_type === 'F6_FORENSIC_QUALITY').length },
    { id: 'F7', label: 'Market & Commodity Signals', count: signals.filter((s) => s.signal_stream === 'F7' || s.signal_type === 'CROSS_ASSET' || s.signal_type === 'F7_CROSS_ASSET').length },
  ];

  const filteredSignals = signals.filter((s) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'F1') return s.signal_stream === 'F1' || s.signal_type === 'REGULATORY' || s.signal_type === 'F1_REGULATORY';
    if (selectedCategory === 'F2') return s.signal_stream === 'F2' || s.signal_type === 'STRATEGY_DNA' || s.signal_type === 'F2_STRATEGY_DNA';
    if (selectedCategory === 'F3') return s.signal_stream === 'F3' || s.signal_type === 'INSTITUTIONAL' || s.signal_type === 'F3_INSTITUTIONAL';
    if (selectedCategory === 'F4') return s.signal_stream === 'F4' || s.signal_type === 'MACRO_SIMULATOR' || s.signal_type === 'F4_MACRO_CASCADE';
    if (selectedCategory === 'F5') return s.signal_stream === 'F5' || s.signal_type === 'SUPPLY_CHAIN' || s.signal_type === 'F5_SUPPLY_CHAIN';
    if (selectedCategory === 'F6') return s.signal_stream === 'F6' || s.signal_type === 'FORENSIC_QUALITY' || s.signal_type === 'F6_FORENSIC_QUALITY';
    if (selectedCategory === 'F7') return s.signal_stream === 'F7' || s.signal_type === 'CROSS_ASSET' || s.signal_type === 'F7_CROSS_ASSET';
    return true;
  });

  const renderTierBadge = (tier?: SourceQualityTier) => {
    switch (tier) {
      case 'TIER_1_OFFICIAL_REGULATORY':
        return (
          <Badge variant="teal" size="sm">
            Tier 1 • Official / Regulatory
          </Badge>
        );
      case 'TIER_2_PRIMARY_MEDIA':
        return (
          <Badge variant="emerald" size="sm">
            Tier 2 • Primary Media
          </Badge>
        );
      case 'TIER_3_INDUSTRY_BODY':
        return (
          <Badge variant="blue" size="sm">
            Tier 3 • Industry Body / Brokerage
          </Badge>
        );
      case 'TIER_4_UNVERIFIED_ESTIMATE':
        return (
          <Badge variant="amber" size="sm">
            Tier 4 • Unverified Estimate
          </Badge>
        );
      default:
        return (
          <Badge variant="slate" size="sm">
            Verified Source
          </Badge>
        );
    }
  };

  const activeStreamDef = selectedCategory !== 'ALL' ? SIGNAL_STREAM_DEFINITIONS[selectedCategory as SignalStreamId] : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#111827] border border-[#1F293D]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <Radio className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">
              Today's Market Update • Intelligence Streams
            </span>
            <span className="text-xs text-[#6B7280] font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" /> Live Exchange Feed • 07:01 IST
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F4F6] tracking-tight font-display">
            Today's Market Update & Signals
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1 max-w-2xl leading-relaxed">
            Synthesizing key market intelligence streams across government regulations, company strategy changes, big investor moves, economic trends, supply chains, financial risk checks, and market signals.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="teal" size="md">
            {signals.length} Signals Active
          </Badge>
        </div>
      </div>

      {/* Stream Description Callout when stream is selected */}
      {activeStreamDef && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#161F30] to-[#111827] border border-emerald-500/30 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-emerald-400 text-sm">
                Stream {activeStreamDef.id}: {activeStreamDef.name}
              </span>
              <span className="text-[#6B7280]">[{activeStreamDef.category}]</span>
            </div>
            <p className="text-[#D1D5DB] leading-relaxed">{activeStreamDef.description}</p>
            <div className="text-[11px] text-[#9CA3AF] font-mono">
              Primary Sources: <span className="text-[#E5E7EB]">{activeStreamDef.dataSource}</span>
            </div>
          </div>
          <Badge variant="teal" size="sm" className="self-start md:self-auto">
            Default: {activeStreamDef.defaultFactLevel}
          </Badge>
        </div>
      )}

      {/* Filter Tabs */}
      <Tabs
        tabs={categories}
        activeTab={selectedCategory}
        onChange={(id) => setSelectedCategory(id)}
        variant="pills"
      />

      {/* Live Market Wire & Breaking Developments */}
      <Card variant="elevated" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F293D] pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" />
              LIVE MARKET WIRE
            </span>
            <span className="text-xs font-bold text-white">
              NSE / BSE Real-Time Regulatory & Media Intelligence
            </span>
            {marketNews && (
              <span className="text-xs font-mono text-[#9CA3AF]">
                ({marketNews.live_count} Live • {marketNews.recent_count} Recent)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsNewsExpanded(!isNewsExpanded)}
              className="text-xs font-mono text-[#9CA3AF] hover:text-white"
            >
              {isNewsExpanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              {isNewsExpanded ? 'Collapse Wire' : 'Expand Wire'}
            </Button>
          </div>
        </div>

        {isNewsExpanded && (
          <div>
            {(!marketNews || marketNews.articles.length === 0) ? (
              <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F293D] text-xs text-[#9CA3AF] text-center">
                Fetching live exchange & market wire feeds...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {marketNews.articles.slice(0, 6).map((art) => (
                  <div
                    key={art.id}
                    className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D] hover:border-emerald-500/40 transition flex flex-col justify-between space-y-2 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {renderFreshnessBadge(art.freshnessStatus)}
                        <span className="text-[11px] font-mono text-[#6B7280]">
                          {art.relativeTimeStr || 'Verified Date'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#F3F4F6] group-hover:text-emerald-400 transition leading-snug line-clamp-2">
                        {art.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#1F293D]/60 text-[11px] font-mono">
                      <span className="text-emerald-400 font-medium truncate max-w-[180px]">
                        {art.source}
                      </span>
                      {art.url && art.url !== '#' ? (
                        <a
                          href={art.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#9CA3AF] hover:text-white flex items-center gap-1 transition"
                        >
                          Source <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[#6B7280]">Exchange Verified</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Signals Feed */}
      <div className="space-y-4">
        {filteredSignals.length === 0 ? (
          <div className="p-8 text-center bg-[#111827] border border-[#1F293D] rounded-2xl space-y-2">
            <Zap className="w-6 h-6 text-[#6B7280] mx-auto" />
            <h3 className="text-sm font-bold text-[#F3F4F6]">No signals in this stream</h3>
            <p className="text-xs text-[#9CA3AF]">
              All companies in this stream currently satisfy standard baselines without active catalyst breaches.
            </p>
          </div>
        ) : (
          filteredSignals.map((sig) => {
            const isWhyExpanded = expandedWhySignal === sig.signal_id;
            const primaryTier = sig.source_tier || sig.evidence_list?.[0]?.source_tier || 'TIER_1_OFFICIAL_REGULATORY';

            return (
              <Card
                key={sig.signal_id}
                variant="elevated"
                className="hover:border-[#334155] transition-all"
              >
                <div className="space-y-4">
                  {/* Header line */}
                  <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {sig.signal_stream || 'F1'}: {sig.stream_name || sig.signal_type}
                        </span>
                        <Badge
                          variant={
                            sig.confidence_label === 'FACT' || sig.fact_level === 'FACT'
                              ? 'teal'
                              : sig.confidence_label === 'HIGH_CONF'
                              ? 'emerald'
                              : sig.confidence_label === 'INFERENCE' || sig.fact_level === 'INFERENCE'
                              ? 'blue'
                              : 'amber'
                          }
                          size="sm"
                          dot
                        >
                          [{sig.fact_level || sig.confidence_label || 'FACT'}] • {sig.confidence_score}%
                        </Badge>
                        {renderTierBadge(primaryTier)}
                        <button
                          onClick={() => onSelectCompany(sig.nse_symbol)}
                          className="text-xs font-mono font-bold text-emerald-400 hover:underline cursor-pointer"
                        >
                          NSE: {sig.nse_symbol}
                        </button>
                        <span className="text-[11px] text-[#6B7280] font-mono">
                          Lead: ~{sig.lead_time_days} days
                        </span>
                      </div>

                      <h3
                        onClick={() => onSelectSignal(sig)}
                        className="text-base font-bold text-[#F3F4F6] hover:text-emerald-400 transition cursor-pointer font-display leading-snug"
                      >
                        {sig.signal_title}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-[#6B7280] font-mono block">Detected</span>
                      <span className="text-xs text-[#9CA3AF] font-mono">
                        {new Date(sig.detected_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-[#D1D5DB] leading-relaxed">
                    {sig.signal_summary}
                  </p>

                  {/* Why am I seeing this? Expandable Section */}
                  <div className="rounded-xl bg-[#0B0F17]/80 border border-[#1F293D] overflow-hidden text-xs">
                    <button
                      onClick={() => setExpandedWhySignal(isWhyExpanded ? null : sig.signal_id)}
                      className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-[#161F30]/40 transition text-[#9CA3AF] hover:text-[#E5E7EB]"
                    >
                      <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-teal-400">
                        <HelpCircle className="w-3.5 h-3.5" /> Why does this matter for {sig.nse_symbol}?
                      </span>
                      <span className="text-[11px] font-mono text-[#6B7280]">
                        {isWhyExpanded ? 'Collapse ▲' : 'Inspect Rationale & Grounding ▼'}
                      </span>
                    </button>

                    {isWhyExpanded && (
                      <div className="p-3.5 border-t border-[#1F293D] space-y-3 bg-[#0B0F17]">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] block mb-1 font-bold">
                            Operating Moat & Discovery Match Rationale
                          </span>
                          <p className="text-xs text-[#D1D5DB] leading-relaxed">
                            {sig.why_it_matters ||
                              sig.why_am_i_seeing_this ||
                              `Matched because ${sig.nse_symbol} has direct revenue exposure to this sovereign/macro catalyst and fits within your conservative fundamental filters.`}
                          </p>
                        </div>

                        {/* Tiered Evidence Items */}
                        {sig.evidence_list && sig.evidence_list.length > 0 && (
                          <div className="space-y-1.5 pt-1 border-t border-[#1F293D]">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] block font-bold">
                              Tiered Statutory Evidence Grounding
                            </span>
                            {sig.evidence_list.map((ev, eIdx) => (
                              <div
                                key={eIdx}
                                className="p-2.5 rounded-lg bg-[#161F30] border border-[#1F293D] space-y-1"
                              >
                                <div className="flex items-center justify-between text-[10px] flex-wrap gap-1">
                                  <span className="font-semibold text-emerald-400 font-mono">
                                    {ev.title || ev.source_name}
                                  </span>
                                  <Badge variant="slate" size="sm">
                                    {ev.source_tier?.replace(/_/g, ' ') || 'OFFICIAL'}
                                  </Badge>
                                </div>
                                <p className="text-[11px] text-[#9CA3AF] italic leading-relaxed">
                                  "{ev.excerpt}"
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Invalidation Triggers ("What could prove this wrong?") */}
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>What Would Prove This Wrong?</span>
                    </div>
                    <ul className="space-y-1 text-xs text-[#D1D5DB]">
                      {(sig.what_could_invalidate_it || sig.what_could_prove_this_wrong || [
                        'Regulatory postponement or withdrawal of government directive.',
                        'Surge in raw material input costs compressing profit margins.',
                      ]).map((trig, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold shrink-0">•</span>
                          <span>{trig}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Causal Transmission Chain */}
                  {sig.causal_chain && sig.causal_chain.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#1F293D] space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#6B7280] block">
                        How This Signal Affects the Business
                      </span>
                      <div className="space-y-1.5">
                        {sig.causal_chain.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2 text-xs font-mono text-[#D1D5DB]">
                            <span className="text-emerald-400 font-bold shrink-0">
                              Step {sIdx + 1} &rarr;
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Beneficiary Companies & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#1F293D]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#6B7280]">Relevance:</span>
                      <button
                        onClick={() => onRateSignal(sig.signal_id, 'USEFUL')}
                        className={`p-1.5 rounded text-xs transition cursor-pointer ${
                          sig.user_rating === 'USEFUL'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-[#6B7280] hover:text-[#E5E7EB]'
                        }`}
                        title="Mark as useful for my research profile"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRateSignal(sig.signal_id, 'NOT_USEFUL')}
                        className={`p-1.5 rounded text-xs transition cursor-pointer ${
                          sig.user_rating === 'NOT_USEFUL'
                            ? 'text-rose-400 bg-rose-500/10'
                            : 'text-[#6B7280] hover:text-[#E5E7EB]'
                        }`}
                        title="Not relevant"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {onInvestigate && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onInvestigate(sig.nse_symbol)}
                        >
                          <Search className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Research Company
                        </Button>
                      )}
                      {onCreateThesis && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onCreateThesis(sig.nse_symbol)}
                        >
                          <FileText className="w-3.5 h-3.5 mr-1 text-teal-400" /> Draft Investment View
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectCompany(sig.nse_symbol)}
                      >
                        Company Financials
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onSelectSignal(sig)}
                      >
                        Research Report <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <DisclaimerBanner />
    </div>
  );
};
