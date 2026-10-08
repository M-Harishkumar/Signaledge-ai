import React, { useState, useEffect, useMemo } from 'react';
import {
  Filter,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Plus,
  Trash2,
  Save,
  Sliders,
  Award,
  BarChart3,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  Check,
  X,
} from 'lucide-react';
import {
  Company,
  Screener,
  ScreenerFilter,
  ScreenerResultItem,
  ScreenerOperator,
  FilterEvaluationDetail,
  FinancialQualityScore,
  DetailedBenchmarkMetric,
} from '../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { ScreenerService, SCREENER_METRICS, MetricDefinition } from '../services/screenerService';
import { api } from '../services/api';

export interface ScreenerPageProps {
  companies: Company[];
  savedScreeners: Screener[];
  onSelectCompany: (symbol: string) => void;
  onSaveScreener: (screener: Screener) => void;
  onInvestigate?: (symbol: string) => void;
  onOpenPreBuy?: (symbol: string) => void;
}

export const ScreenerPage: React.FC<ScreenerPageProps> = ({
  companies,
  savedScreeners: initialSavedScreeners,
  onSelectCompany,
  onSaveScreener,
  onInvestigate,
  onOpenPreBuy,
}) => {
  // Screen Filters State
  const [filters, setFilters] = useState<ScreenerFilter[]>([
    { metric: 'roce', operator: '>=', value: 15.0, unit: '%', label: 'Return on Capital Employed (RoCE)' },
    { metric: 'de_ratio', operator: '<=', value: 1.0, unit: 'x', label: 'Debt to Equity Ratio (D/E)' },
    { metric: 'pe_ratio', operator: '<=', value: 45.0, unit: 'x', label: 'Price to Earnings (P/E)' },
    { metric: 'promoter_pledge_pct', operator: '<=', value: 0.0, unit: '%', label: 'Promoter Share Pledge' },
  ]);

  const [logic, setLogic] = useState<'AND' | 'OR'>('AND');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Saved screens state
  const [savedScreens, setSavedScreens] = useState<Screener[]>(initialSavedScreeners);
  const [activeScreenName, setActiveScreenName] = useState<string>('Custom Quantitative Screen');
  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  const [newScreenName, setNewScreenName] = useState<string>('');
  const [newScreenDesc, setNewScreenDesc] = useState<string>('');
  const [savingLoading, setSavingLoading] = useState<boolean>(false);

  // Expanded Row for Details / Quality breakdown
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const [selectedResultItem, setSelectedResultItem] = useState<ScreenerResultItem | null>(null);

  // Available sectors
  const sectors = useMemo(() => ['ALL', ...Array.from(new Set(companies.map((c) => c.sector)))], [companies]);

  // Execute Screening Engine across universe
  const screenedResults: ScreenerResultItem[] = useMemo(() => {
    let source = companies;
    if (sectorFilter !== 'ALL') {
      source = source.filter((c) => c.sector === sectorFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      source = source.filter(
        (c) => c.nse_symbol.toLowerCase().includes(q) || c.company_name.toLowerCase().includes(q)
      );
    }
    return ScreenerService.screenCompanies(source, filters, logic);
  }, [companies, filters, logic, sectorFilter, searchQuery]);

  // Load saved screen
  const handleApplyScreen = (scr: Screener) => {
    setFilters(scr.filters);
    setLogic(scr.logic || 'AND');
    setActiveScreenName(scr.name);
  };

  // Add new filter rule
  const handleAddFilter = () => {
    const availableMetrics = Object.keys(SCREENER_METRICS);
    const existingKeys = new Set(filters.map((f) => f.metric));
    const nextKey = availableMetrics.find((k) => !existingKeys.has(k)) || 'roe';
    const def = SCREENER_METRICS[nextKey];

    setFilters((prev) => [
      ...prev,
      {
        metric: def.id,
        operator: def.defaultOperator,
        value: def.defaultValue,
        unit: def.unit,
        label: def.name,
      },
    ]);
  };

  // Remove a filter rule
  const handleRemoveFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  // Update a filter rule
  const handleUpdateFilter = (index: number, updates: Partial<ScreenerFilter>) => {
    setFilters((prev) =>
      prev.map((f, i) => {
        if (i !== index) return f;
        const updated = { ...f, ...updates };
        if (updates.metric && updates.metric !== f.metric) {
          const def = SCREENER_METRICS[updates.metric];
          if (def) {
            updated.operator = def.defaultOperator;
            updated.value = def.defaultValue;
            updated.unit = def.unit;
            updated.label = def.name;
          }
        }
        return updated;
      })
    );
  };

  // Save current active screen to database
  const handleSaveScreen = async () => {
    if (!newScreenName.trim()) return;
    setSavingLoading(true);
    try {
      const saved = await api.saveScreener({
        name: newScreenName.trim(),
        description: newScreenDesc.trim() || 'Custom quantitative multi-factor screening template',
        filters,
        logic,
        alert_enabled: false,
        alert_on_new_entrants: false,
        alert_on_leavers: false,
        alert_channels: ['IN_APP'],
        last_run_at: new Date().toISOString(),
        last_result_count: screenedResults.length,
      });

      setSavedScreens((prev) => [saved, ...prev]);
      setActiveScreenName(saved.name);
      onSaveScreener(saved);
      setSaveModalOpen(false);
      setNewScreenName('');
      setNewScreenDesc('');
    } catch (err) {
      console.warn('Failed to persist screener:', err);
    } finally {
      setSavingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F293D] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <Filter className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">
              Quantitative Multi-Factor Engine (Sprint 5)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F4F6] tracking-tight font-display">
            Precision Stock Screener & Quantitative Benchmarks
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1 max-w-2xl">
            Screen Indian equities using canonical financial data, transparent AND/OR logic gates, 7-pillar Financial Quality Scoring, and 5-dimension peer & sector benchmarking.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSaveModalOpen(true)}
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" /> Save Screen Template
          </Button>
        </div>
      </div>

      {/* Pre-built Strategy Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {savedScreens.slice(0, 4).map((scr) => {
          const isActive = activeScreenName === scr.name;
          return (
            <div
              key={scr.screener_id}
              onClick={() => handleApplyScreen(scr)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-2 ${
                isActive
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-sm'
                  : 'bg-[#111827] hover:bg-[#161F30] border-[#1F293D] hover:border-emerald-500/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-[#9CA3AF]'}`} />
                    <h3 className="text-xs font-bold text-[#F3F4F6]">{scr.name}</h3>
                  </div>
                  <Badge variant={scr.logic === 'OR' ? 'amber' : 'emerald'} size="sm">
                    {scr.logic || 'AND'}
                  </Badge>
                </div>
                <p className="text-[11px] text-[#9CA3AF] line-clamp-2">{scr.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1F293D]/60 text-[10px] font-mono text-[#6B7280]">
                <span>{scr.filters.length} Criteria</span>
                <span className="text-emerald-400 font-bold">{isActive ? 'ACTIVE' : 'Apply →'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Filter Builder */}
      <Card variant="elevated">
        <div className="p-5 border-b border-[#1F293D] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-[#F3F4F6]">Screening Criteria Builder</span>
            <div className="flex items-center gap-1 bg-[#161F30] p-1 rounded-lg border border-[#1F293D]">
              <button
                type="button"
                onClick={() => setLogic('AND')}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded transition ${
                  logic === 'AND' ? 'bg-emerald-500 text-[#0A0E17]' : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                AND (Strict All Pass)
              </button>
              <button
                type="button"
                onClick={() => setLogic('OR')}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded transition ${
                  logic === 'OR' ? 'bg-amber-500 text-[#0A0E17]' : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                OR (Any Pass)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={handleAddFilter} className="text-xs text-emerald-400 font-mono">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Criterion
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setFilters([
                  { metric: 'roce', operator: '>=', value: 15.0, unit: '%', label: 'Return on Capital Employed (RoCE)' },
                  { metric: 'de_ratio', operator: '<=', value: 1.0, unit: 'x', label: 'Debt to Equity Ratio (D/E)' },
                  { metric: 'pe_ratio', operator: '<=', value: 45.0, unit: 'x', label: 'Price to Earnings (P/E)' },
                  { metric: 'promoter_pledge_pct', operator: '<=', value: 0.0, unit: '%', label: 'Promoter Share Pledge' },
                ]);
                setLogic('AND');
                setSectorFilter('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-[#9CA3AF]"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reset
            </Button>
          </div>
        </div>

        {/* Filter Rows */}
        <div className="p-5 space-y-3">
          {filters.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#6B7280] font-mono border border-dashed border-[#1F293D] rounded-xl">
              No active filters. Click "+ Add Criterion" to specify screening parameters.
            </div>
          ) : (
            filters.map((f, idx) => {
              const def = SCREENER_METRICS[f.metric.toLowerCase()];
              return (
                <div
                  key={idx}
                  className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-[#161F30]/60 border border-[#1F293D] text-xs font-mono"
                >
                  <span className="w-6 text-center text-[#6B7280] font-bold">#{idx + 1}</span>

                  {/* Metric Select */}
                  <select
                    value={f.metric}
                    onChange={(e) => handleUpdateFilter(idx, { metric: e.target.value })}
                    className="flex-1 min-w-[200px] bg-[#0A0E17] border border-[#1F293D] rounded-lg p-2 text-xs text-[#F3F4F6] focus:outline-none focus:border-emerald-500"
                  >
                    {Object.values(SCREENER_METRICS).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.category})
                      </option>
                    ))}
                  </select>

                  {/* Operator Select */}
                  <select
                    value={f.operator}
                    onChange={(e) => handleUpdateFilter(idx, { operator: e.target.value as ScreenerOperator })}
                    className="w-24 bg-[#0A0E17] border border-[#1F293D] rounded-lg p-2 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value=">=">&gt;= (Min)</option>
                    <option value="<=">&lt;= (Max)</option>
                    <option value="=">= (Exact)</option>
                    <option value=">">&gt; (Greater)</option>
                    <option value="<">&lt; (Less)</option>
                  </select>

                  {/* Value Input */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step={f.unit === 'x' ? '0.1' : '1'}
                      value={typeof f.value === 'number' ? f.value : f.value[0]}
                      onChange={(e) => handleUpdateFilter(idx, { value: parseFloat(e.target.value) || 0 })}
                      className="w-28 bg-[#0A0E17] border border-[#1F293D] rounded-lg p-2 text-xs text-[#F3F4F6] font-bold focus:outline-none focus:border-emerald-500 text-right"
                    />
                    <span className="text-[#9CA3AF] w-10">{f.unit || def?.unit || ''}</span>
                  </div>

                  {/* Standard Benchmark Hint */}
                  <div className="hidden lg:flex items-center gap-1 text-[11px] text-[#6B7280]">
                    <span>Norm:</span>
                    <span className="font-bold text-[#9CA3AF]">
                      {def?.normalBenchmark} {def?.unit}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFilter(idx)}
                    className="p-1.5 text-[#9CA3AF] hover:text-rose-400 transition ml-auto"
                    title="Remove filter"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Global Controls */}
        <div className="p-4 bg-[#111827]/80 border-t border-[#1F293D] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[#9CA3AF] font-mono">Sector:</span>
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="bg-[#161F30] border border-[#1F293D] rounded-lg px-2.5 py-1.5 text-xs text-[#E5E7EB] focus:outline-none"
              >
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search symbol / name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#161F30] border border-[#1F293D] rounded-lg text-xs text-[#F3F4F6] focus:outline-none focus:border-emerald-500 w-44"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-[#9CA3AF]">Screening Universe:</span>
            <Badge variant="teal" size="sm">
              {screenedResults.length} / {companies.length} Passed
            </Badge>
          </div>
        </div>
      </Card>

      {/* Screener Results Table */}
      <Card variant="elevated" padding="none">
        <div className="p-4 border-b border-[#1F293D] flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle>Screener Results & Quality Ratings</CardTitle>
            <CardDescription>
              Ranked by Financial Quality Score and Sector Comparison
            </CardDescription>
          </div>
          <span className="text-xs text-[#6B7280] font-mono">Verified Exchange Data</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[880px]">
            <thead>
              <tr className="border-b border-[#1F293D] bg-[#161F30]/50 text-[11px] text-[#9CA3AF]">
                <th className="p-3.5">Company</th>
                <th className="p-3.5">Sector</th>
                <th className="p-3.5 text-right">Price</th>
                <th className="p-3.5 text-center">Quality Grade</th>
                <th className="p-3.5 text-center">Benchmark Score</th>
                <th className="p-3.5 text-right">RoCE</th>
                <th className="p-3.5 text-right">D/E</th>
                <th className="p-3.5 text-right">P/E</th>
                <th className="p-3.5">Match Summary</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F293D]">
              {screenedResults.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-xs text-[#6B7280] font-sans">
                    No companies match the specified {logic} condition. Try relaxing one or more filter gates.
                  </td>
                </tr>
              ) : (
                screenedResults.map((item) => {
                  const comp = item.company;
                  const isExpanded = expandedSymbol === comp.nse_symbol;
                  const qGrade = item.quality_score.grade;
                  const qColor =
                    qGrade === 'A+' || qGrade === 'A'
                      ? 'emerald'
                      : qGrade === 'B'
                      ? 'teal'
                      : qGrade === 'C'
                      ? 'amber'
                      : 'rose';

                  return (
                    <React.Fragment key={comp.nse_symbol}>
                      <tr
                        className={`hover:bg-[#1E293B]/40 transition cursor-pointer ${
                          isExpanded ? 'bg-[#1E293B]/60' : ''
                        }`}
                        onClick={() => setExpandedSymbol(isExpanded ? null : comp.nse_symbol)}
                      >
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#F3F4F6] block">{comp.nse_symbol}</span>
                            {comp.market_cap_category && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#161F30] border border-[#1F293D] text-[#9CA3AF]">
                                {comp.market_cap_category.replace('_CAP', '')}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#6B7280] font-sans block truncate max-w-[140px]">
                            {comp.company_name}
                          </span>
                        </td>

                        <td className="p-3.5 font-sans text-[#9CA3AF] max-w-[120px] truncate">{comp.sector}</td>

                        <td className="p-3.5 text-right font-bold text-[#F3F4F6]">
                          ₹{comp.current_price.toLocaleString('en-IN')}
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#161F30] border border-[#1F293D]">
                            <Award
                              className={`w-3 h-3 ${
                                qColor === 'emerald'
                                  ? 'text-emerald-400'
                                  : qColor === 'teal'
                                  ? 'text-teal-400'
                                  : qColor === 'amber'
                                  ? 'text-amber-400'
                                  : 'text-rose-400'
                              }`}
                            />
                            <span className="font-bold text-[#F3F4F6] text-[11px]">{item.quality_score.total_score}</span>
                            <span
                              className={`text-[10px] font-bold ${
                                qColor === 'emerald'
                                  ? 'text-emerald-400'
                                  : qColor === 'teal'
                                  ? 'text-teal-400'
                                  : qColor === 'amber'
                                  ? 'text-amber-400'
                                  : 'text-rose-400'
                              }`}
                            >
                              ({qGrade})
                            </span>
                          </div>
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="inline-flex items-center gap-1 font-mono text-[11px]">
                            <span className="font-bold text-emerald-400">
                              {item.benchmark_summary.overall_benchmark_score.toFixed(2)}
                            </span>
                            <span className="text-[#6B7280]">/ 1.0</span>
                          </div>
                        </td>

                        <td className="p-3.5 text-right font-bold text-emerald-400">{comp.roce}%</td>
                        <td className="p-3.5 text-right text-[#9CA3AF]">{comp.de_ratio}x</td>
                        <td className="p-3.5 text-right text-[#9CA3AF]">{comp.pe_ratio}x</td>

                        <td className="p-3.5 text-[11px] font-sans max-w-[240px]">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] truncate">
                              {item.explanation.why_matched}
                            </span>
                            {item.explanation.unknown_values.length > 0 && (
                              <span
                                title={`${item.explanation.unknown_values.length} metric(s) missing from filings`}
                                className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] font-mono shrink-0"
                              >
                                {item.explanation.unknown_values.length} Unknown
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs text-emerald-400 font-sans"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onInvestigate) onInvestigate(comp.nse_symbol);
                              }}
                            >
                              <Search className="w-3 h-3 mr-1" /> Research
                            </Button>
                            {onOpenPreBuy && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs text-teal-400 font-sans"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenPreBuy(comp.nse_symbol);
                                }}
                              >
                                <ShieldCheck className="w-3 h-3 mr-1" /> Safety Check
                              </Button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedSymbol(isExpanded ? null : comp.nse_symbol);
                              }}
                              className="p-1 rounded hover:bg-[#1F293D] text-[#9CA3AF]"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Quantitative & Quality Breakdown */}
                      {isExpanded && (
                        <tr className="bg-[#0D131F]/90 border-b border-[#1F293D]">
                          <td colSpan={10} className="p-5 space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                              {/* 1. Filter Match Breakdown */}
                              <div className="p-4 rounded-xl bg-[#111827] border border-[#1F293D] space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-[#F3F4F6] uppercase tracking-wider flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Filter Criteria Evaluation
                                  </span>
                                  <Badge variant={item.explanation.matched ? 'emerald' : 'rose'} size="sm">
                                    {item.explanation.match_percentage}% Score
                                  </Badge>
                                </div>

                                <div className="space-y-1.5 text-xs font-mono">
                                  {item.explanation.passed_filters.map((pf) => (
                                    <div
                                      key={pf.metric}
                                      className="flex items-center justify-between p-2 rounded bg-emerald-500/5 border border-emerald-500/20 text-emerald-300"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span>{pf.label}</span>
                                      </div>
                                      <span className="font-bold">
                                        {pf.formatted_actual} ({pf.formatted_target})
                                      </span>
                                    </div>
                                  ))}

                                  {item.explanation.failed_filters.map((ff) => (
                                    <div
                                      key={ff.metric}
                                      className="flex items-center justify-between p-2 rounded bg-rose-500/5 border border-rose-500/20 text-rose-300"
                                    >
                                      <div className="flex items-center gap-2">
                                        <X className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                        <span>{ff.label}</span>
                                      </div>
                                      <span className="font-bold">
                                        {ff.formatted_actual} ({ff.formatted_target})
                                      </span>
                                    </div>
                                  ))}

                                  {item.explanation.unknown_values.map((uf) => (
                                    <div
                                      key={uf.metric}
                                      className="flex items-center justify-between p-2 rounded bg-amber-500/5 border border-amber-500/20 text-amber-300"
                                    >
                                      <div className="flex items-center gap-2">
                                        <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                        <span>{uf.label}</span>
                                      </div>
                                      <span className="font-bold">{uf.formatted_actual}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* 2. 7-Pillar Financial Quality Breakdown */}
                              <div className="p-4 rounded-xl bg-[#111827] border border-[#1F293D] space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-[#F3F4F6] uppercase tracking-wider flex items-center gap-1.5">
                                    <Award className="w-3.5 h-3.5 text-emerald-400" /> Financial Quality Breakdown
                                  </span>
                                  <span className="text-xs font-bold text-[#9CA3AF] font-sans">
                                    {item.quality_score.verdict}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                  {Object.entries(item.quality_score.pillars).map(([key, pillar]) => (
                                    <div
                                      key={key}
                                      className="p-2 rounded bg-[#161F30] border border-[#1F293D] flex items-center justify-between"
                                    >
                                      <span className="text-[#9CA3AF]">{pillar.name}</span>
                                      <div className="flex items-center gap-1">
                                        <span className="font-bold text-[#F3F4F6]">{pillar.score}</span>
                                        <span className="text-[10px] text-emerald-400 font-bold">({pillar.grade})</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* 3. 5-Dimension Peer & Sector Benchmark Comparison */}
                            <div className="p-4 rounded-xl bg-[#111827] border border-[#1F293D] space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#F3F4F6] uppercase tracking-wider flex items-center gap-1.5">
                                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> Sector & Peer Comparison
                                </span>
                                <span className="text-xs font-mono font-bold text-emerald-400">
                                  Overall Rating: {item.benchmark_summary.relative_rating}
                                </span>
                              </div>

                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs font-mono min-w-[600px]">
                                  <thead>
                                    <tr className="border-b border-[#1F293D] text-[10px] text-[#9CA3AF]">
                                      <th className="py-2">Metric</th>
                                      <th className="py-2 text-right">Actual</th>
                                      <th className="py-2 text-right">Benchmark</th>
                                      <th className="py-2 text-right">Industry Avg</th>
                                      <th className="py-2 text-right">Sector Avg</th>
                                      <th className="py-2 text-center">Position</th>
                                      <th className="py-2 text-right">Score</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[#1F293D]/60">
                                    {item.benchmark_summary.metrics.map((bm) => (
                                      <tr key={bm.metric_name}>
                                        <td className="py-2 font-bold text-[#F3F4F6]">{bm.metric_name}</td>
                                        <td className="py-2 text-right font-bold text-emerald-400">{bm.formatted_actual}</td>
                                        <td className="py-2 text-right text-[#9CA3AF]">{bm.formatted_benchmark}</td>
                                        <td className="py-2 text-right text-[#9CA3AF]">
                                          {bm.industry_avg} {bm.unit}
                                        </td>
                                        <td className="py-2 text-right text-[#9CA3AF]">
                                          {bm.sector_avg} {bm.unit}
                                        </td>
                                        <td className="py-2 text-center">
                                          <span className="px-2 py-0.5 rounded bg-[#161F30] border border-[#1F293D] text-[10px] text-[#F3F4F6]">
                                            {bm.relative_position.replace('_', ' ')}
                                          </span>
                                        </td>
                                        <td className="py-2 text-right font-bold text-emerald-400">
                                          {bm.score.toFixed(2)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onSelectCompany(comp.nse_symbol)}
                                className="text-xs"
                              >
                                Open Company Research &rarr;
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Save Screener Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#111827] border border-[#1F293D] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F293D]">
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-[#F3F4F6]">Save Screener Template</h3>
              </div>
              <button
                type="button"
                onClick={() => setSaveModalOpen(false)}
                className="text-[#9CA3AF] hover:text-[#F3F4F6]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#9CA3AF] font-mono mb-1">Screen Name</label>
                <input
                  type="text"
                  placeholder="e.g. High FCF Compounders"
                  value={newScreenName}
                  onChange={(e) => setNewScreenName(e.target.value)}
                  className="w-full bg-[#161F30] border border-[#1F293D] rounded-lg p-2.5 text-xs text-[#F3F4F6] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[#9CA3AF] font-mono mb-1">Description / Strategy Rationale</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Screens for companies with RoCE > 20%, D/E < 0.5x, and zero promoter pledge."
                  value={newScreenDesc}
                  onChange={(e) => setNewScreenDesc(e.target.value)}
                  className="w-full bg-[#161F30] border border-[#1F293D] rounded-lg p-2.5 text-xs text-[#F3F4F6] focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#161F30] border border-[#1F293D] space-y-1 font-mono text-[11px] text-[#9CA3AF]">
                <div className="flex justify-between">
                  <span>Logic Mode:</span>
                  <span className="font-bold text-emerald-400">{logic}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Criteria:</span>
                  <span className="font-bold text-[#F3F4F6]">{filters.length} rules</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1F293D]">
              <Button size="sm" variant="ghost" onClick={() => setSaveModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleSaveScreen}
                disabled={!newScreenName.trim() || savingLoading}
              >
                {savingLoading ? 'Saving...' : 'Save Template'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
};
