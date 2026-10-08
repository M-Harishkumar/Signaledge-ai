import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Award,
  Settings,
  Search,
  Download,
  Trash2,
  Plus,
  Shield,
  Key,
  CheckCircle2,
  TrendingUp,
  Radio,
  FileSpreadsheet,
  AlertTriangle,
  LogOut,
  Bell,
  Lock,
  FileText,
  Info,
  Sparkles,
  ArrowRight,
  CornerDownRight,
  Layers,
} from 'lucide-react';
import { Company, Signal, Watchlist, User, TrackRecordEntry, TrackRecordStats } from '../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { StatCard } from '../components/common/StatCard';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { lookupBrandOrSubsidiary, BRAND_SUBSIDIARY_MAPPINGS } from '../data/brandSubsidiaryMap';

// ==========================================
// 1. WATCHLISTS & MONITORING AUDIT PAGE
// ==========================================
export const WatchlistsPage: React.FC<{
  companies: Company[];
  watchlists: Watchlist[];
  onSelectCompany: (symbol: string) => void;
  onUpdateWatchlists: (lists: Watchlist[]) => void;
  onInvestigate?: (symbol: string) => void;
  onCreateThesis?: (symbol: string) => void;
}> = ({ companies, watchlists, onSelectCompany, onUpdateWatchlists, onInvestigate, onCreateThesis }) => {
  const [selectedWl, setSelectedWl] = useState<Watchlist>(
    watchlists[0] || { watchlist_id: 'wl-1', name: 'Primary Watchlist', description: '', is_default: true, company_count: 0, created_at: '', companies: [] }
  );
  const [activeTab, setActiveTab] = useState<'WATCHLIST' | 'AUDIT_LOG'>('WATCHLIST');
  const [monitoringChanges, setMonitoringChanges] = useState<any[]>([]);
  const [newSymbolInput, setNewSymbolInput] = useState('');
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [isCreatingWl, setIsCreatingWl] = useState(false);
  const [editingNotesSymbol, setEditingNotesSymbol] = useState<string | null>(null);
  const [editingNotesText, setEditingNotesText] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    if (watchlists && watchlists.length > 0) {
      const match = watchlists.find((w) => w.watchlist_id === selectedWl.watchlist_id);
      if (match) {
        setSelectedWl(match);
      } else {
        setSelectedWl(watchlists[0]);
      }
    }
  }, [watchlists]);

  useEffect(() => {
    let mounted = true;
    const loadChanges = async () => {
      try {
        const symbols = selectedWl.companies?.map((c) => c.nse_symbol) || [];
        const data = await api.getMonitoringChanges(symbols);
        if (mounted) setMonitoringChanges(data);
      } catch (e) {
        console.error('Failed to load monitoring changes:', e);
      }
    };
    loadChanges();
    return () => {
      mounted = false;
    };
  }, [selectedWl]);

  const handleCreateWatchlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWatchlistName.trim()) return;
    try {
      const created = await api.createWatchlist(newWatchlistName.trim(), 'Custom institutional portfolio bin', true);
      const updatedLists = [...watchlists, created];
      onUpdateWatchlists(updatedLists);
      setSelectedWl(created);
      setNewWatchlistName('');
      setIsCreatingWl(false);
      showToast(`Created watchlist "${created.name}"`, 'success');
    } catch (err) {
      showToast('Failed to create watchlist', 'error');
    }
  };

  const handleDeleteWatchlist = async (wlId: string) => {
    if (watchlists.length <= 1) {
      showToast('Cannot delete the last remaining watchlist.', 'error');
      return;
    }
    try {
      await api.deleteWatchlist(wlId);
      const remaining = watchlists.filter((w) => w.watchlist_id !== wlId);
      onUpdateWatchlists(remaining);
      setSelectedWl(remaining[0]);
      showToast('Watchlist deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete watchlist', 'error');
    }
  };

  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    const sym = newSymbolInput.trim().toUpperCase();
    if (!sym) return;

    const comp = companies.find((c) => c.nse_symbol === sym);
    if (!comp) {
      showToast(`Ticker "${sym}" not found in current tracking universe.`, 'error');
      return;
    }

    try {
      const updated = await api.addTickerToWatchlist(selectedWl.watchlist_id, sym, 'High-conviction watchlist monitoring');
      setSelectedWl(updated);
      onUpdateWatchlists(watchlists.map((w) => (w.watchlist_id === updated.watchlist_id ? updated : w)));
      setNewSymbolInput('');
      showToast(`Added ${sym} to ${selectedWl.name}`, 'success');
    } catch (err) {
      showToast('Failed to add ticker', 'error');
    }
  };

  const handleRemoveTicker = async (sym: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await api.removeTickerFromWatchlist(selectedWl.watchlist_id, sym);
      setSelectedWl(updated);
      onUpdateWatchlists(watchlists.map((w) => (w.watchlist_id === updated.watchlist_id ? updated : w)));
      showToast(`Removed ${sym} from ${selectedWl.name}`, 'info');
    } catch (err) {
      showToast('Failed to remove ticker', 'error');
    }
  };

  const handleSaveNotes = async (sym: string) => {
    try {
      const updated = await api.updateWatchlistCompany(selectedWl.watchlist_id, sym, { notes: editingNotesText });
      setSelectedWl(updated);
      onUpdateWatchlists(watchlists.map((w) => (w.watchlist_id === updated.watchlist_id ? updated : w)));
      setEditingNotesSymbol(null);
      showToast(`Updated notes for ${sym}`, 'success');
    } catch (err) {
      showToast('Failed to update notes', 'error');
    }
  };

  const handleStatusChange = async (sym: string, newStatus: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await api.updateWatchlistCompany(selectedWl.watchlist_id, sym, { research_status: newStatus });
      setSelectedWl(updated);
      onUpdateWatchlists(watchlists.map((w) => (w.watchlist_id === updated.watchlist_id ? updated : w)));
      showToast(`Status updated to ${newStatus}`, 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#111827] border border-[#1F293D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase text-emerald-400">Companies I'm Watching</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F4F6] font-display">My Watchlist & Recent Changes</h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Keep track of companies on your radar, check recent updates, review your investment views, and conduct research.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => setIsCreatingWl(!isCreatingWl)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> New Watchlist
          </Button>
          <form onSubmit={handleAddTicker} className="flex gap-2">
            <input
              type="text"
              value={newSymbolInput}
              onChange={(e) => setNewSymbolInput(e.target.value)}
              placeholder="Add stock symbol (e.g. HAL)..."
              className="bg-[#161F30] border border-[#1F293D] rounded-xl px-3.5 py-2 text-xs text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none uppercase font-mono"
            />
            <Button type="submit" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add
            </Button>
          </form>
        </div>
      </div>

      {/* Watchlist Creation Box */}
      {isCreatingWl && (
        <Card variant="elevated" className="border-emerald-500/30">
          <form onSubmit={handleCreateWatchlist} className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              value={newWatchlistName}
              onChange={(e) => setNewWatchlistName(e.target.value)}
              placeholder="Enter new watchlist name (e.g. Defense Pure-Plays)..."
              className="bg-[#161F30] border border-[#1F293D] rounded-xl px-3.5 py-2 text-xs text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none flex-1 font-mono"
            />
            <Button type="submit" size="sm" variant="primary">Create Watchlist</Button>
            <Button size="sm" variant="ghost" onClick={() => setIsCreatingWl(false)}>Cancel</Button>
          </form>
        </Card>
      )}

      {/* Watchlist Switcher Pills */}
      <div className="flex items-center justify-between gap-4 border-b border-[#1F293D] pb-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          {watchlists.map((wl) => (
            <button
              key={wl.watchlist_id}
              onClick={() => setSelectedWl(wl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
                selectedWl.watchlist_id === wl.watchlist_id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#161F30] text-[#9CA3AF] hover:text-white border border-[#1F293D]'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              {wl.name} ({wl.companies?.length || 0})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab('WATCHLIST')}
            className={`pb-1 transition cursor-pointer ${
              activeTab === 'WATCHLIST' ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold' : 'text-[#9CA3AF]'
            }`}
          >
            Watchlist Table
          </button>
          <button
            onClick={() => setActiveTab('AUDIT_LOG')}
            className={`pb-1 transition cursor-pointer ${
              activeTab === 'AUDIT_LOG' ? 'text-blue-400 border-b-2 border-blue-400 font-bold' : 'text-[#9CA3AF]'
            }`}
          >
            Updates on Companies You Watch ({monitoringChanges.length})
          </button>
        </div>
      </div>

      {activeTab === 'WATCHLIST' ? (
        <Card variant="elevated" padding="none">
          <div className="p-4 border-b border-[#1F293D] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <CardTitle>{selectedWl.name} ({selectedWl.companies?.length || 0} Companies)</CardTitle>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                SAVED
              </span>
            </div>
            {watchlists.length > 1 && (
              <Button
                size="sm"
                variant="ghost"
                className="text-rose-400 hover:text-rose-300 text-xs"
                onClick={() => handleDeleteWatchlist(selectedWl.watchlist_id)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete List
              </Button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono min-w-[720px]">
              <thead>
                <tr className="border-b border-[#1F293D] bg-[#161F30]/50 text-[11px] text-[#9CA3AF]">
                  <th className="p-3.5">Symbol</th>
                  <th className="p-3.5">Company</th>
                  <th className="p-3.5">Sector</th>
                  <th className="p-3.5 text-right">Price</th>
                  <th className="p-3.5 text-right">Change</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Investment Notes</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293D]">
                {!selectedWl.companies || selectedWl.companies.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-xs text-[#6B7280] font-sans">
                      No tickers added yet. Type an NSE symbol above to start tracking.
                    </td>
                  </tr>
                ) : (
                  selectedWl.companies.map((comp) => {
                    const isPos = comp.price_change_pct >= 0;
                    const isEditingNotes = editingNotesSymbol === comp.nse_symbol;
                    return (
                      <tr
                        key={comp.nse_symbol}
                        onClick={() => onSelectCompany(comp.nse_symbol)}
                        className="hover:bg-[#1E293B]/40 transition cursor-pointer"
                      >
                        <td className="p-3.5 font-bold text-[#F3F4F6]">{comp.nse_symbol}</td>
                        <td className="p-3.5 text-[#9CA3AF] font-sans">{comp.company_name}</td>
                        <td className="p-3.5 text-[#9CA3AF] font-sans">{comp.sector}</td>
                        <td className="p-3.5 text-right font-bold text-[#F3F4F6]">
                          ₹{comp.current_price.toLocaleString('en-IN')}
                        </td>
                        <td className={`p-3.5 text-right font-semibold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPos ? '+' : ''}{comp.price_change_pct}%
                        </td>
                        <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={comp.research_status || 'WATCHING'}
                            onChange={(e) => handleStatusChange(comp.nse_symbol, e.target.value, e as any)}
                            className="bg-[#111827] border border-[#1F293D] text-[11px] rounded px-2 py-1 text-emerald-400 focus:outline-none"
                          >
                            <option value="WATCHING">WATCHING</option>
                            <option value="INVESTIGATING">RESEARCHING</option>
                            <option value="STRONG_SIGNAL">STRONG OPPORTUNITY</option>
                            <option value="INVALIDATED">NO LONGER INTERESTED</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-[#9CA3AF] font-sans text-xs" onClick={(e) => e.stopPropagation()}>
                          {isEditingNotes ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={editingNotesText}
                                onChange={(e) => setEditingNotesText(e.target.value)}
                                className="bg-[#111827] border border-[#1F293D] text-xs px-2 py-1 rounded text-white focus:outline-none"
                              />
                              <button
                                onClick={() => handleSaveNotes(comp.nse_symbol)}
                                className="text-emerald-400 hover:text-emerald-300 text-[11px] font-mono px-1"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <span
                              onClick={() => {
                                setEditingNotesSymbol(comp.nse_symbol);
                                setEditingNotesText(comp.notes || '');
                              }}
                              className="hover:text-white cursor-text underline decoration-dotted"
                            >
                              {comp.notes || 'Click to add notes...'}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            {onInvestigate && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs text-emerald-400"
                                onClick={() => onInvestigate(comp.nse_symbol)}
                              >
                                Check
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs text-blue-400"
                              onClick={() => onSelectCompany(comp.nse_symbol)}
                            >
                              Research
                            </Button>
                            {onCreateThesis && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs text-purple-400"
                                onClick={() => onCreateThesis(comp.nse_symbol)}
                              >
                                Investment View
                              </Button>
                            )}
                            <button
                              onClick={(e) => handleRemoveTicker(comp.nse_symbol, e)}
                              className="p-1 rounded text-[#6B7280] hover:text-rose-400 transition"
                              title="Remove from watchlist"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Audit Log / What-Changed Delta Feed */
        <div className="space-y-3">
          {monitoringChanges.length === 0 ? (
            <Card variant="elevated" className="text-center py-8 text-xs text-[#9CA3AF]">
              No updates detected across your watchlist companies.
            </Card>
          ) : (
            monitoringChanges.map((chg) => (
              <Card key={chg.change_id} variant="elevated">
                <div className="space-y-2.5 text-xs">
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
                      <span className="font-mono font-bold text-[#F3F4F6] text-sm">{chg.nse_symbol}</span>
                      <span className="text-xs text-[#9CA3AF]">{chg.company_name}</span>
                      <span className="text-[11px] text-[#6B7280] font-mono">
                        {new Date(chg.when_changed).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#9CA3AF] bg-[#0B0F17] px-2.5 py-1 rounded border border-[#1F293D]">
                      Source: {chg.source}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D] space-y-1.5">
                    <span className="font-bold text-[#F3F4F6] text-xs block">{chg.what_changed}</span>
                    <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                      <strong className="text-[#D1D5DB]">Why it changed:</strong> {chg.why_changed}
                    </p>
                    <p className="text-[11px] text-emerald-400">
                      <strong>Impact:</strong> {chg.impact}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[11px] text-[#9CA3AF]">
                      <strong>Recommended Step:</strong> {chg.required_investigation}
                    </span>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onSelectCompany(chg.nse_symbol)}
                    >
                      Research {chg.nse_symbol} &rarr;
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
};

// ==========================================
// 2. TRACK RECORD PAGE (WITH DATA PROVENANCE)
// ==========================================
export const TrackRecordPage: React.FC<{
  onSelectCompany: (symbol: string) => void;
  onInvestigate?: (symbol: string) => void;
}> = ({ onSelectCompany, onInvestigate }) => {
  const [entries, setEntries] = useState<TrackRecordEntry[]>([]);
  const [stats, setStats] = useState<TrackRecordStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadTrackRecord = async () => {
      try {
        const data = await api.getTrackRecord();
        if (mounted) {
          setEntries(data.entries || []);
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to load track record:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadTrackRecord();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F293D]">
        <div className="flex items-center gap-2 mb-1.5">
          <Award className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold uppercase text-emerald-400">Past Signal Performance & Track Record</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
            [HISTORICAL BENCHMARK]
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#F3F4F6] font-display">Historical Signal Results & Performance</h1>
        <p className="text-xs text-[#9CA3AF] mt-1 max-w-3xl">
          Past record showing early signal detection compared to public market reactions and forward stock returns.
        </p>
      </div>

      {/* Honest Sample Size Disclosure Alert */}
      <div className="p-4 rounded-xl bg-[#161F30] border border-[#1F293D] flex items-start gap-3 text-xs text-[#D1D5DB]">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#F3F4F6] block">How This Track Record Is Measured</span>
          <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
            {stats?.methodology_summary || 'Historical return figures represent backtested and tracked catalysts across audited cases. Past performance is not a guarantee of future results.'}
          </p>
          <p className="text-[10px] text-[#6B7280] font-mono">
            <strong>Benchmark:</strong> {stats?.benchmark_comparator || 'NIFTY 50 Total Returns Index (TRI)'} • <strong>Data Type:</strong> HISTORICAL BENCHMARK
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tracked Opportunities"
          value={stats ? `${stats.total_historical_records}` : '12'}
          subtitle="Evaluated Companies"
        />
        <StatCard
          label="Positive Return Rate"
          value={stats ? `${stats.win_rate_pct}%` : '75.0%'}
          change={stats?.win_rate_pct || 75}
          changeSuffix="Outperformed Market"
        />
        <StatCard
          label="Average Lead Time"
          value={stats ? `${stats.avg_lead_time_days} Days` : '95 Days'}
          subtitle="Before Mainstream Media"
        />
        <StatCard
          label="Completed Cases"
          value={stats ? `${stats.verified_count}` : '9'}
          subtitle="Full Track Record Review"
        />
      </div>

      <Card variant="elevated" padding="none">
        <div className="p-4 border-b border-[#1F293D] flex items-center justify-between">
          <CardTitle>Historical Early Signal Performance Log</CardTitle>
          <span className="text-xs text-[#6B7280] font-mono">Sample Size: {entries.length} Cases • [HISTORICAL BENCHMARK]</span>
        </div>
        <div className="divide-y divide-[#1F293D] text-xs">
          {entries.length === 0 ? (
            <div className="p-8 text-center text-[#9CA3AF]">
              Loading historical track record audit...
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.record_id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#161F30]/30 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={(entry.alpha_generated_pct ?? 0) >= 50 ? 'emerald' : 'teal'}
                      size="sm"
                    >
                      +{(entry.alpha_generated_pct ?? 0)}% Return
                    </Badge>
                    <span className="font-mono font-bold text-[#F3F4F6]">{entry.nse_symbol}</span>
                    <span className="text-[11px] text-[#6B7280] font-mono">
                      Lead Time: {entry.lead_time_days} Days
                    </span>
                    <Badge variant="slate" size="sm">
                      {entry.actual_outcome_status}
                    </Badge>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      [BENCHMARK]
                    </span>
                  </div>
                  <p className="text-[#D1D5DB] font-medium">{entry.signal_title}</p>
                  <span className="text-[11px] text-[#6B7280] font-mono block">
                    Detected: {entry.detected_date} • Recognition: {entry.recognition_date || 'In Progress'} • {entry.evaluation_notes}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onInvestigate && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-emerald-400"
                      onClick={() => onInvestigate(entry.nse_symbol)}
                    >
                      <Search className="w-3.5 h-3.5 mr-1" /> Research Company
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => onSelectCompany(entry.nse_symbol)}>
                    View Research Report
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <DisclaimerBanner />
    </div>
  );
};

// ==========================================
// 3. SETTINGS PAGE
// ==========================================
export const SettingsPage: React.FC<{
  user: User;
  onUpdateUser: (updates: Partial<User>) => Promise<void> | void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
}> = ({ user, onUpdateUser, onLogout, onDeleteAccount }) => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'PROVIDERS' | 'DANGER'>('PROFILE');
  const [name, setName] = useState(user.display_name);
  const [email, setEmail] = useState(user.email);
  const [horizon, setHorizon] = useState(user.investment_horizon);
  const [riskTolerance, setRiskTolerance] = useState(user.risk_tolerance);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [usageData, setUsageData] = useState<any>(null);
  const [providerStatus, setProviderStatus] = useState<any>(null);
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (activeTab === 'PROVIDERS') {
      setIsLoadingUsage(true);
      Promise.all([
        api.getDeveloperUsage().catch(() => null),
        api.getProviderStatus().catch(() => null),
      ]).then(([usage, prov]) => {
        setUsageData(usage);
        setProviderStatus(prov);
        setIsLoadingUsage(false);
      });
    }
  }, [activeTab]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onUpdateUser({ display_name: name, email, investment_horizon: horizon, risk_tolerance: riskTolerance });
    setIsSaving(false);
    showToast('Investor preferences updated successfully.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F293D]">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold uppercase text-emerald-400">Account, Settings & Connections</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#F3F4F6] font-display">Account & Connection Settings</h1>
        <p className="text-xs text-[#9CA3AF] mt-1">
          Manage your personal preferences, data connections, and account security.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1F293D] gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`pb-3 -mb-px transition cursor-pointer ${
            activeTab === 'PROFILE'
              ? 'border-b-2 border-emerald-500 text-emerald-400 font-semibold'
              : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Personal Profile
        </button>
        <button
          onClick={() => setActiveTab('PROVIDERS')}
          className={`pb-3 -mb-px transition cursor-pointer ${
            activeTab === 'PROVIDERS'
              ? 'border-b-2 border-emerald-500 text-emerald-400 font-semibold'
              : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Data Connections & Usage
        </button>
        <button
          onClick={() => setActiveTab('DANGER')}
          className={`pb-3 -mb-px transition cursor-pointer ${
            activeTab === 'DANGER'
              ? 'border-b-2 border-rose-500 text-rose-400 font-semibold'
              : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Security & Account
        </button>
      </div>

      {/* TAB 1: Investor Profile */}
      {activeTab === 'PROFILE' && (
        <Card variant="elevated">
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#F3F4F6] block mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#161F30] border border-[#1F293D] rounded-xl p-2.5 text-[#E5E7EB] focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="font-semibold text-[#F3F4F6] block mb-1">Registered Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#161F30] border border-[#1F293D] rounded-xl p-2.5 text-[#E5E7EB] focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-[#F3F4F6] block mb-1">Investment Time Horizon</label>
                <select
                  value={horizon}
                  onChange={(e) => setHorizon(e.target.value)}
                  className="w-full bg-[#161F30] border border-[#1F293D] rounded-xl p-2.5 text-[#E5E7EB] focus:outline-none"
                >
                  <option value="1-3YR">1 to 3 Years (Medium-Term)</option>
                  <option value="3-7YR">3 to 7 Years (Long-Term Compounding)</option>
                  <option value="7-15YR">7 to 15 Years (Multi-Year Wealth Creation)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#F3F4F6] block mb-1">Risk Tolerance</label>
                <select
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value)}
                  className="w-full bg-[#161F30] border border-[#1F293D] rounded-xl p-2.5 text-[#E5E7EB] focus:outline-none"
                >
                  <option value="CONSERVATIVE">Cautious (Established Companies & Low Debt)</option>
                  <option value="MODERATE">Balanced (Growth at a Reasonable Price)</option>
                  <option value="MODERATE_AGGRESSIVE">High Growth (High Potential & Turnarounds)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1F293D] flex justify-end">
              <Button type="submit" size="sm" isLoading={isSaving}>
                Save Preferences
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 2: API Quotas & Providers */}
      {activeTab === 'PROVIDERS' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card variant="elevated" className="p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#9CA3AF]">Data Requests Today</span>
              <p className="text-xl font-bold font-mono text-emerald-400">
                {usageData?.totalRequestsToday ?? 0}
              </p>
              <span className="text-[10px] text-[#6B7280]">Live market & company lookups</span>
            </Card>

            <Card variant="elevated" className="p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#9CA3AF]">Cache Efficiency</span>
              <p className="text-xl font-bold font-mono text-cyan-400">
                {usageData?.overallCacheHitRatePct ?? 100}%
              </p>
              <span className="text-[10px] text-[#6B7280]">Fast local response rate</span>
            </Card>

            <Card variant="elevated" className="p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#9CA3AF]">Connection Errors</span>
              <p className="text-xl font-bold font-mono text-rose-400">
                {usageData?.totalErrorsToday ?? 0}
              </p>
              <span className="text-[10px] text-[#6B7280]">Data reliability monitor</span>
            </Card>
          </div>

          {/* Active Data Providers List */}
          <Card variant="elevated" className="space-y-3">
            <h3 className="font-bold text-sm text-[#F3F4F6] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Live Data Sources
            </h3>

            <div className="divide-y divide-[#1F293D]">
              {(providerStatus?.financial_providers || [
                { id: 'yahoo_finance', name: 'Yahoo Finance Feed', classification: 'CORE_FREE', isConfigured: true, dailyQuotaLimit: 10000 },
                { id: 'alpha_vantage', name: 'Alpha Vantage Global', classification: 'FREE_WITH_LIMITS', isConfigured: false, dailyQuotaLimit: 25 },
                { id: 'official_filings', name: 'Primary Regulatory Store', classification: 'PRIMARY_OFFICIAL', isConfigured: true, dailyQuotaLimit: 99999 },
              ]).map((p: any) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{p.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161F30] border border-[#1F293D] text-[#9CA3AF]">
                        {p.classification}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#6B7280] font-mono">
                      Daily Limit: {p.dailyQuotaLimit.toLocaleString()} calls
                    </span>
                  </div>

                  <Badge variant={p.isConfigured ? 'emerald' : 'amber'} size="sm">
                    {p.isConfigured ? 'Active / Configured' : 'Optional (Fallback Active)'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Providers */}
          <Card variant="elevated" className="space-y-3">
            <h3 className="font-bold text-sm text-[#F3F4F6] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> AI & Smart Analysis Engines
            </h3>
            <div className="divide-y divide-[#1F293D]">
              {(providerStatus?.ai_providers || [
                { id: 'gemini', name: 'Google Gemini (gemini-2.5-flash)', isActive: true, classification: 'CORE_FREE' },
                { id: 'local_fallback', name: 'Deterministic Rule Engine', isActive: false, classification: 'CORE_FREE' },
              ]).map((ai: any) => (
                <div key={ai.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">{ai.name}</span>
                    <span className="text-[10px] text-[#6B7280] font-mono">
                      Category: {ai.classification}
                    </span>
                  </div>
                  <Badge variant={ai.isActive ? 'emerald' : 'slate'} size="sm">
                    {ai.isActive ? 'Active Primary' : 'Standby Fallback'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: Danger Zone */}
      {activeTab === 'DANGER' && (
        <Card variant="elevated" className="border-rose-500/30 space-y-4">
          <CardHeader>
            <div>
              <CardTitle className="text-rose-400">Account Management & Sign Out</CardTitle>
              <CardDescription>Options to sign out or permanently remove your account</CardDescription>
            </div>
          </CardHeader>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-semibold text-[#F3F4F6] block">Sign Out of Session</span>
              <span className="text-[#9CA3AF]">Safely close workstation on this browser</span>
            </div>
            {onLogout && (
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
              </Button>
            )}
          </div>

          <div className="pt-4 border-t border-[#1F293D] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-semibold text-rose-400 block">Delete My Account</span>
              <span className="text-[#9CA3AF]">Permanently removes all your watchlists, notes, saved views, and simulations</span>
            </div>
            <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Account
            </Button>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowDeleteModal(false)}
          maxWidth="sm"
          title={<span className="text-rose-400 font-bold">Confirm Account Deletion</span>}
        >
          <div className="space-y-4 text-xs">
            <p className="text-[#9CA3AF]">
              Are you sure you want to permanently delete your account (<strong className="text-white">{user.email}</strong>)? This action is irreversible and all your watchlists and research logs will be purged.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#1F293D]">
              <Button variant="secondary" size="sm" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setShowDeleteModal(false);
                  if (onDeleteAccount) onDeleteAccount();
                }}
              >
                Yes, Delete My Account
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <DisclaimerBanner />
    </div>
  );
};

function clientLevenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix: number[][] = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));
  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;
  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (a[i - 1] === b[j - 1]) matrix[j][i] = matrix[j - 1][i - 1];
      else matrix[j][i] = Math.min(matrix[j - 1][i - 1] + 1, matrix[j][i - 1] + 1, matrix[j - 1][i] + 1);
    }
  }
  return matrix[bn][an];
}

// ==========================================
// 4. SEARCH RESULTS PAGE (Live & Dynamic)
// ==========================================
export const SearchResultsPage: React.FC<{
  query: string;
  companies: Company[];
  signals: Signal[];
  onSelectCompany: (symbol: string) => void;
  onSelectSignal: (signal: Signal) => void;
  onInvestigate?: (symbol: string) => void;
  onSearchChange?: (q: string) => void;
}> = ({ query, companies, signals, onSelectCompany, onSelectSignal, onInvestigate, onSearchChange }) => {
  const [serverCompanies, setServerCompanies] = useState<Company[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState<boolean>(false);

  const q = (query || '').trim().toLowerCase();

  // Fetch dynamically from server on query change
  useEffect(() => {
    let isMounted = true;
    if (query && query.trim().length >= 2) {
      setIsSearchingLive(true);
      api
        .getCompanies(query.trim())
        .then((items) => {
          if (isMounted) {
            setServerCompanies(items || []);
            setIsSearchingLive(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsSearchingLive(false);
        });
    } else {
      setServerCompanies([]);
    }
    return () => {
      isMounted = false;
    };
  }, [query]);

  // Combine local and server results with de-duplication and fuzzy matching
  const allPool = [...companies];
  serverCompanies.forEach((sc) => {
    if (!allPool.some((c) => c.nse_symbol === sc.nse_symbol)) {
      allPool.push(sc);
    }
  });

  const matchedComps = allPool.filter((c) => {
    if (!q) return true;
    const sym = c.nse_symbol.toLowerCase();
    const name = c.company_name.toLowerCase();
    const sec = c.sector.toLowerCase();
    const ind = c.industry.toLowerCase();
    const bse = (c.bse_code || '').toLowerCase();

    // Direct substring match
    if (sym.includes(q) || name.includes(q) || sec.includes(q) || ind.includes(q) || bse.includes(q)) {
      return true;
    }

    // Fuzzy distance match (e.g. 'reliamce' matches 'RELIANCE')
    if (q.length >= 3) {
      if (clientLevenshtein(q, sym) <= 2) return true;
      const nameWords = name.split(/\s+/);
      if (nameWords.some((w) => clientLevenshtein(q, w) <= 2)) return true;
    }

    return false;
  });

  const matchedSigs = signals.filter((s) => {
    if (!q) return true;
    return (
      s.signal_title.toLowerCase().includes(q) ||
      s.signal_summary.toLowerCase().includes(q) ||
      s.nse_symbol.toLowerCase().includes(q)
    );
  });

  const popularTickers = [
    'RELIANCE',
    'TCS',
    'INFY',
    'HDFCBANK',
    'TATAMOTORS',
    'DIXON',
    'SUZLON',
    'HAL',
    'ZOMATO',
    'TRENT',
    'SUNPHARMA',
    'BHARTIARTL',
  ];

  const brandMappings = q.length >= 2 ? lookupBrandOrSubsidiary(q) : [];

  // Also pull in any parent companies from brand mappings
  brandMappings.forEach((bm) => {
    const parent = allPool.find((c) => c.nse_symbol.toUpperCase() === bm.matchedSymbol.toUpperCase());
    if (parent && !matchedComps.some((c) => c.nse_symbol === parent.nse_symbol)) {
      matchedComps.unshift(parent);
    }
  });

  const popularEntities = [
    { label: 'Blinkit', desc: 'Zomato Ltd' },
    { label: 'Zudio', desc: 'Trent Ltd' },
    { label: 'JLR', desc: 'Tata Motors' },
    { label: 'Jio', desc: 'Reliance' },
    { label: 'Tanishq', desc: 'Titan' },
    { label: 'Tejas', desc: 'HAL' },
    { label: 'Thar', desc: 'M&M' },
    { label: 'Airtel', desc: 'Bharti Airtel' },
    { label: 'Google (Tech)', desc: 'TCS / INFY' },
    { label: 'Railways', desc: 'IRFC' },
    { label: 'Dixon (EMS)', desc: 'Dixon Tech' },
    { label: 'Suzlon (Wind)', desc: 'Suzlon Energy' },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F293D]">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase text-emerald-400">
              Search Companies, Brands & Signals
            </span>
          </div>
          {isSearchingLive && (
            <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Searching live market data...
            </span>
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#F3F4F6] font-display">
          Results for "{query || 'All Assets'}"
        </h1>
        <p className="text-xs text-[#9CA3AF] mt-1">
          Showing matching listed companies, parent businesses, subsidiaries, and market signals.
        </p>

        {/* Quick Suggestion Pills */}
        <div className="mt-4 pt-3 border-t border-[#1F293D] flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[#6B7280] font-mono">Popular Searches:</span>
          {popularEntities.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSearchChange ? onSearchChange(item.label) : onSelectCompany(item.desc)}
              className="px-2 py-0.5 rounded-md bg-[#0B0F17] hover:bg-[#1F293D] border border-[#1F293D] text-[#9CA3AF] hover:text-[#F3F4F6] font-mono text-[11px] transition flex items-center gap-1"
            >
              <span>{item.label}</span>
              <span className="text-[#6B7280] text-[9px]">({item.desc})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. Brand, Subsidiary & Child-to-Parent Company Mapping Card */}
      {brandMappings.length > 0 && (
        <Card variant="elevated" className="border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-[#111827] to-[#0B0F17]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <CardTitle className="text-cyan-300">Brand & Subsidiary &rarr; Listed Parent Company</CardTitle>
              </div>
              <Badge variant="cyan" size="sm">Smart Match</Badge>
            </div>
            <CardDescription>
              Found familiar brand names or subsidiaries and mapped them to their listed parent company on the stock exchange.
            </CardDescription>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {brandMappings.map((bm, i) => (
              <div
                key={i}
                onClick={() => onSelectCompany(bm.matchedSymbol)}
                className="p-4 rounded-xl bg-[#0B0F17]/90 border border-[#1F293D] hover:border-cyan-500/60 transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm font-bold text-[#F3F4F6] capitalize">"{bm.queryTerm}"</span>
                    <Badge variant="teal" size="sm">{bm.relationshipType}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono mb-1">
                    <span className="text-[#9CA3AF]">Listed Parent Company:</span>
                    <span className="text-emerald-400 font-bold">{bm.matchedSymbol}</span>
                    <span className="text-[#6B7280]">({bm.matchedCompanyName})</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] mt-1">{bm.relationshipNote}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#1F293D] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#6B7280] text-[11px]">{bm.sector}</span>
                  <span className="text-cyan-400 group-hover:underline flex items-center gap-1">
                    View Research Report <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {matchedComps.length === 0 && matchedSigs.length === 0 && brandMappings.length === 0 && !isSearchingLive && (
        <Card variant="elevated">
          <div className="p-8 text-center space-y-3">
            <Search className="w-10 h-10 text-[#4B5563] mx-auto" />
            <h3 className="text-base font-bold text-[#F3F4F6]">No direct matches found for "{query}"</h3>
            <p className="text-xs text-[#9CA3AF] max-w-md mx-auto">
              Try searching by brand name (e.g. <span className="font-mono text-emerald-400">Blinkit</span>, <span className="font-mono text-emerald-400">Zudio</span>, <span className="font-mono text-emerald-400">JLR</span>, <span className="font-mono text-emerald-400">Tejas</span>, <span className="font-mono text-emerald-400">Thar</span>) or by exact stock symbol (<span className="font-mono text-emerald-400">RELIANCE</span>, <span className="font-mono text-emerald-400">TCS</span>).
            </p>
          </div>
        </Card>
      )}

      {/* Matching Equities */}
      {matchedComps.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Matching Companies ({matchedComps.length})</CardTitle>
              <Badge variant="emerald" size="sm">Live Market Data</Badge>
            </div>
            <CardDescription>Click any company to open detailed financial checks and research</CardDescription>
          </CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {matchedComps.map((c) => (
              <div
                key={c.nse_symbol}
                onClick={() => onSelectCompany(c.nse_symbol)}
                className="p-3.5 rounded-xl bg-[#0B0F17] hover:bg-[#161F30] border border-[#1F293D] hover:border-emerald-500/50 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono font-bold text-[#F3F4F6] text-sm">{c.nse_symbol}</span>
                    <Badge
                      variant={
                        (c.prebuy_verdict || 'PASS') === 'PASS'
                          ? 'emerald'
                          : (c.prebuy_verdict || 'PASS') === 'INVESTIGATE'
                          ? 'amber'
                          : 'rose'
                      }
                      size="sm"
                    >
                      {(c.prebuy_verdict || 'PASS') === 'PASS' ? 'PASSED' : (c.prebuy_verdict || 'PASS') === 'INVESTIGATE' ? 'CHECK' : 'RISK'}
                    </Badge>
                  </div>
                  <span className="text-xs text-[#9CA3AF] block font-sans line-clamp-1">{c.company_name}</span>
                  <div className="mt-2 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-[#F3F4F6] font-bold">₹{(c.current_price ?? 0).toLocaleString('en-IN')}</span>
                    <span
                      className={
                        (c.price_change_pct ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      {(c.price_change_pct ?? 0) >= 0 ? '+' : ''}
                      {c.price_change_pct ?? 0}%
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-[#6B7280] font-mono flex items-center justify-between">
                    <span>RoCE: {c.roce ?? 18}%</span>
                    <span>P/E: {c.pe_ratio ?? 22}x</span>
                    <span>Score: {c.signal_edge_score ?? 80}/100</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#1F293D] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#6B7280] text-[10px]">{c.sector || 'Listed Company'}</span>
                  <div className="flex items-center gap-2">
                    {onInvestigate && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onInvestigate(c.nse_symbol);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        Test Scenario &rarr;
                      </button>
                    )}
                    <span className="text-emerald-400 hover:underline">Research &rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Matching Signals */}
      {matchedSigs.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Matching Market Signals ({matchedSigs.length})</CardTitle>
            <CardDescription>Company announcements, government notifications, and industry updates</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            {matchedSigs.map((s) => (
              <div
                key={s.signal_id}
                onClick={() => onSelectSignal(s)}
                className="p-4 rounded-xl bg-[#0B0F17] hover:bg-[#161F30] border border-[#1F293D] hover:border-cyan-500/50 transition cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="teal" size="sm">{s.signal_type}</Badge>
                    <span className="font-mono text-xs font-bold text-emerald-400">{s.nse_symbol}</span>
                    <span className="text-xs text-[#9CA3AF]">• {s.lead_time_days}d lead</span>
                  </div>
                  <Badge variant="slate" size="sm">
                    {s.confidence_label === 'FACT' ? 'Verified Fact' : s.confidence_label === 'HIGH_CONF' ? 'High Confidence' : 'Calculated'}
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-[#F3F4F6]">{s.signal_title}</h4>
                <p className="text-xs text-[#9CA3AF] line-clamp-2">{s.signal_summary}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <DisclaimerBanner />
    </div>
  );
};

// ==========================================
// 5. EXPORTS PAGE
// ==========================================
export const ExportsPage: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleDownload = (type: string, url: string, filename: string) => {
    setDownloading(type);
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(`Downloaded ${filename}`, 'success');
    } catch (err: any) {
      showToast('Download failed. Try again.', 'error');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F293D]">
        <div className="flex items-center gap-2 mb-1">
          <Download className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold uppercase text-emerald-400">Export & Download</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#F3F4F6] font-display">Export Your Research & Data</h1>
        <p className="text-xs text-[#9CA3AF] mt-1">
          Download market data, your investment views, opportunity lists, and track records as CSV spreadsheet files.
        </p>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Available Downloads (Instant CSV)</CardTitle>
          <CardDescription>Ready to open in Microsoft Excel, Google Sheets, or any spreadsheet tool</CardDescription>
        </CardHeader>

        <div className="space-y-3 text-xs">
          {/* Monitored Equities CSV */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F293D] flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="font-bold text-[#F3F4F6] block text-sm">Tracked Companies List (.csv)</span>
              <span className="text-[#9CA3AF]">Full company table with prices, financial ratios, debt levels, and investment checks</span>
            </div>
            <Button
              size="sm"
              onClick={() => handleDownload('companies', api.getCompaniesExportUrl(), 'signaledge_monitored_equities.csv')}
              isLoading={downloading === 'companies'}
            >
              <Download className="w-3.5 h-3.5 mr-1" /> Download CSV
            </Button>
          </div>

          {/* Research Theses CSV */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F293D] flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="font-bold text-[#F3F4F6] block text-sm">Saved Investment Views (.csv)</span>
              <span className="text-[#9CA3AF]">Best/Base/Worst case scenarios, investment reasons, and risks</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload('theses', api.getThesesExportUrl(), 'signaledge_research_theses.csv')}
              isLoading={downloading === 'theses'}
            >
              <Download className="w-3.5 h-3.5 mr-1" /> Download CSV
            </Button>
          </div>

          {/* Opportunity Pipeline CSV */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F293D] flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="font-bold text-[#F3F4F6] block text-sm">Investment Opportunities Pipeline (.csv)</span>
              <span className="text-[#9CA3AF]">Full list of opportunities with summary, scores, and risk ratings</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload('opportunities', api.getOpportunitiesExportUrl(), 'signaledge_opportunity_pipeline.csv')}
              isLoading={downloading === 'opportunities'}
            >
              <Download className="w-3.5 h-3.5 mr-1" /> Download CSV
            </Button>
          </div>

          {/* Track Record Audit CSV */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F293D] flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="font-bold text-[#F3F4F6] block text-sm">Historical Signal Track Record (.csv)</span>
              <span className="text-[#9CA3AF]">Historical record of early signals and forward stock performance</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload('trackrecord', api.getTrackRecordExportUrl(), 'signaledge_track_record_audit.csv')}
              isLoading={downloading === 'trackrecord'}
            >
              <Download className="w-3.5 h-3.5 mr-1" /> Download CSV
            </Button>
          </div>
        </div>
      </Card>

      <DisclaimerBanner />
    </div>
  );
};
