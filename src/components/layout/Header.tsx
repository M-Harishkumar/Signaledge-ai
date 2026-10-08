import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Lock,
  Unlock,
  Cloud,
  Check,
  ChevronDown,
  Menu,
  Shield,
  User as UserIcon,
  RefreshCw,
  TrendingUp,
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { User, AlertItem, Company, Signal } from '../../types';
import { Badge } from '../common/Badge';
import { lookupBrandOrSubsidiary, EntityMapping, entityLevenshteinDistance } from '../../data/brandSubsidiaryMap';

export interface HeaderProps {
  user: User;
  alerts: AlertItem[];
  isVaultUnlocked: boolean;
  companies?: Company[];
  signals?: Signal[];
  onOpenVault: () => void;
  onOpenCloudModal?: () => void;
  onOpenAssistant?: () => void;
  onSearch: (query: string) => void;
  onNavigate: (route: string) => void;
  onMarkAllAlertsRead: () => void;
  onToggleMobileMenu?: () => void;
  onRefreshLiveMarket?: () => Promise<void> | void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  alerts,
  isVaultUnlocked,
  companies = [],
  signals = [],
  onOpenVault,
  onOpenCloudModal,
  onOpenAssistant,
  onSearch,
  onNavigate,
  onMarkAllAlertsRead,
  onToggleMobileMenu,
  onRefreshLiveMarket,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefreshClick = async () => {
    if (!onRefreshLiveMarket || isRefreshing) return;
    setIsRefreshing(true);
    try {
      await onRefreshLiveMarket();
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setShowSearchDropdown(false);
      onSearch(searchInput.trim());
      onNavigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleSelectSuggestion = (symbol: string) => {
    setShowSearchDropdown(false);
    setSearchInput('');
    onNavigate(`/companies/${symbol}`);
  };

  const handleSelectSignalSuggestion = (signal: Signal) => {
    setShowSearchDropdown(false);
    setSearchInput('');
    onNavigate(`/companies/${signal.nse_symbol}`);
  };

  // Compute live suggestions with relevance scoring and typo-tolerance
  const q = searchInput.trim().toLowerCase();
  const brandMatches: EntityMapping[] = q.length >= 2 ? lookupBrandOrSubsidiary(q) : [];

  const matchedCompanies = q.length >= 1
    ? companies
        .map((c) => {
          const sym = c.nse_symbol.toLowerCase();
          const name = c.company_name.toLowerCase();
          const sec = c.sector.toLowerCase();
          const ind = c.industry.toLowerCase();
          const bse = (c.bse_code || '').toLowerCase();
          let score = 0;

          // 1. Exact match on Symbol or BSE Code
          if (sym === q || bse === q) {
            score += 100;
          } else if (name === q) {
            score += 90;
          }
          // 2. Prefix match on Symbol or Name
          else if (sym.startsWith(q)) {
            score += 80;
          } else if (name.startsWith(q)) {
            score += 70;
          }
          // 3. Word Prefix match in Company Name
          else if (name.split(/\s+/).some((w) => w.startsWith(q))) {
            score += 65;
          }
          // 4. Substring match in Symbol or Name
          else if (sym.includes(q)) {
            score += 50;
          } else if (name.includes(q)) {
            score += 45;
          }
          // 5. Fuzzy / Typo tolerance for query >= 3 chars
          else if (q.length >= 3) {
            // Compare to symbol
            if (entityLevenshteinDistance(q, sym) <= (q.length <= 4 ? 1 : 2)) {
              score += 40;
            } else {
              // Compare to words in company name
              const words = name.split(/\s+/);
              for (const w of words) {
                if (w.length >= 3) {
                  const prefix = w.slice(0, Math.max(q.length, 3));
                  if (entityLevenshteinDistance(q, prefix) <= 1) {
                    score += 35;
                    break;
                  }
                }
              }
            }
          }

          // 6. Sector or Industry match (only if query >= 3 chars)
          if (score === 0 && q.length >= 3) {
            if (sec.startsWith(q) || ind.startsWith(q)) {
              score += 20;
            } else if (sec.includes(q) || ind.includes(q)) {
              score += 10;
            }
          }

          return { company: c, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.company)
        .slice(0, 5)
    : [];

  const matchedSignals = q.length >= 2
    ? signals
        .map((s) => {
          const title = s.signal_title.toLowerCase();
          const sym = s.nse_symbol.toLowerCase();
          const summary = s.signal_summary.toLowerCase();
          let score = 0;

          if (sym === q) {
            score += 100;
          } else if (sym.startsWith(q)) {
            score += 80;
          } else if (title.startsWith(q)) {
            score += 70;
          } else if (title.includes(q)) {
            score += 50;
          } else if (summary.includes(q)) {
            score += 25;
          } else if (q.length >= 3 && entityLevenshteinDistance(q, sym) <= 1) {
            score += 30;
          }

          return { signal: s, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.signal)
        .slice(0, 3)
    : [];

  const hasSuggestions = q.length >= 1 && (brandMatches.length > 0 || matchedCompanies.length > 0 || matchedSignals.length > 0);

  return (
    <header className="h-16 bg-[#0B0F17] border-b border-[#1F293D] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3 flex-1 max-w-xl relative" ref={searchContainerRef}>
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-[#1E293B]"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onFocus={() => setShowSearchDropdown(true)}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setShowSearchDropdown(true);
            }}
            placeholder="Search symbol, brand, subsidiary, sector (e.g. Reliance, Blinkit, Zudio, JLR, Tejas)..."
            className="w-full bg-[#111827] text-xs text-[#E5E7EB] placeholder-[#6B7280] pl-9 pr-4 py-2 rounded-lg border border-[#1F293D] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition font-sans"
          />
        </form>

        {/* Instant Predictive Suggestions Dropdown */}
        {showSearchDropdown && hasSuggestions && (
          <div className="absolute left-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-[500px] md:w-[560px] max-w-[95vw] bg-[#0D131F] border border-[#2A374F] rounded-xl shadow-2xl shadow-black ring-1 ring-black/90 overflow-hidden z-[100] max-h-[70vh] overflow-y-auto divide-y divide-[#1F293D] animate-in fade-in zoom-in-95 duration-150">
            {/* 1. Brand & Subsidiary / Child-to-Parent Matches */}
            {brandMatches.length > 0 && (
              <div className="bg-[#0D131F]">
                <div className="flex items-center justify-between px-3 py-2 bg-[#111827]/90 border-b border-[#1F293D] text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Sparkles className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                    <span className="truncate">Brand & Company Suggestions</span>
                  </div>
                  <span className="text-[10px] text-[#6B7280] font-normal shrink-0 ml-2">{brandMatches.length} found</span>
                </div>
                <div className="p-1.5 space-y-1">
                  {brandMatches.slice(0, 4).map((bm, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectSuggestion(bm.matchedSymbol)}
                      className="p-3 rounded-lg hover:bg-[#161F30] transition cursor-pointer group"
                    >
                      {/* Top Row */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          <span className="text-xs font-bold text-white capitalize">{bm.queryTerm}</span>
                          <span className="text-[10px] text-[#6B7280]">&rarr;</span>
                          <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                            {bm.matchedSymbol}
                          </span>
                          <Badge variant="teal" size="sm">
                            {bm.relationshipType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 opacity-80 group-hover:opacity-100 transition shrink-0 ml-auto">
                          <span className="hidden sm:inline">View Company</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                      {/* Bottom Row */}
                      <p className="text-[11px] text-[#9CA3AF] mt-1.5 leading-relaxed break-words">{bm.relationshipNote}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Direct Matching Equities */}
            {matchedCompanies.length > 0 && (
              <div className="bg-[#0D131F]">
                <div className="flex items-center justify-between px-3 py-2 bg-[#111827]/90 border-b border-[#1F293D] text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Layers className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span className="truncate">Matching Companies</span>
                  </div>
                  <span className="text-[10px] text-[#6B7280] font-normal shrink-0 ml-2">{matchedCompanies.length} matches</span>
                </div>
                <div className="p-1.5 space-y-1">
                  {matchedCompanies.map((c) => (
                    <div
                      key={c.nse_symbol}
                      onClick={() => handleSelectSuggestion(c.nse_symbol)}
                      className="p-3 rounded-lg hover:bg-[#161F30] transition cursor-pointer group"
                    >
                      {/* Top Row: Symbol, Name, Verdict, Price */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                          <span className="font-mono text-xs font-bold text-white bg-[#1F293D] px-1.5 py-0.5 rounded shrink-0">{c.nse_symbol}</span>
                          <span className="text-xs font-medium text-[#E5E7EB] truncate min-w-0">{c.company_name}</span>
                          <Badge
                            variant={
                              (c.prebuy_verdict || 'PASS') === 'PASS'
                                ? 'emerald'
                                : (c.prebuy_verdict || 'PASS') === 'INVESTIGATE'
                                ? 'amber'
                                : 'rose'
                            }
                            size="sm"
                            className="shrink-0"
                          >
                            {c.prebuy_verdict === 'PASS' ? 'Passed Checks' : c.prebuy_verdict === 'INVESTIGATE' ? 'Needs Research' : 'High Risk'}
                          </Badge>
                        </div>
                        <div className="text-right font-mono text-xs shrink-0 pl-2">
                          <span className="text-[#F3F4F6] font-bold">₹{(c.current_price ?? 0).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      {/* Bottom Row: Sector / Industry and 24h Change */}
                      <div className="flex items-center justify-between text-[10px] text-[#9CA3AF] mt-1 font-mono gap-2">
                        <span className="truncate flex-1 min-w-0">{c.sector || 'Public Equity'} • {c.industry || 'Market Cap'}</span>
                        <span className={(c.price_change_pct ?? 0) >= 0 ? 'text-emerald-400 shrink-0 font-semibold' : 'text-rose-400 shrink-0 font-semibold'}>
                          {(c.price_change_pct ?? 0) >= 0 ? '+' : ''}{c.price_change_pct ?? 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Pre-Recognition Signals */}
            {matchedSignals.length > 0 && (
              <div className="bg-[#0D131F]">
                <div className="flex items-center justify-between px-3 py-2 bg-[#111827]/90 border-b border-[#1F293D] text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                    <span className="truncate">Market Signals</span>
                  </div>
                  <span className="text-[10px] text-[#6B7280] font-normal shrink-0 ml-2">{matchedSignals.length} active</span>
                </div>
                <div className="p-1.5 space-y-1">
                  {matchedSignals.map((s) => (
                    <div
                      key={s.signal_id}
                      onClick={() => handleSelectSignalSuggestion(s)}
                      className="p-3 rounded-lg hover:bg-[#161F30] transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                          <Badge variant="teal" size="sm" className="shrink-0">{s.signal_type}</Badge>
                          <span className="font-mono text-xs font-bold text-emerald-400 shrink-0">{s.nse_symbol}</span>
                          <span className="text-xs font-medium text-[#E5E7EB] truncate min-w-0">{s.signal_title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#6B7280] shrink-0">{s.lead_time_days}d lead</span>
                      </div>
                      <p className="text-[11px] text-[#9CA3AF] mt-1 line-clamp-1">{s.signal_summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer: View All Results */}
            <div
              onClick={handleSearchSubmit}
              className="p-3 bg-[#0D131F] hover:bg-[#161F30] text-center text-xs font-mono text-emerald-400 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Press Enter or click to view all search results for "{searchInput}"</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-4">
        {/* Live Market Sync Button */}
        {onRefreshLiveMarket && (
          <button
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold transition cursor-pointer"
            title="Fetch Real-Time Live Market Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isRefreshing ? 'Syncing...' : 'Sync Live Market'}
            </span>
          </button>
        )}

        {/* AI Research Assistant Button */}
        {onOpenAssistant && (
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-sm glow-emerald transition cursor-pointer"
            title="Open AI Research Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline font-mono text-[11px]">AI Assistant</span>
          </button>
        )}

        {/* Session Privacy Lock Button */}
        <button
          onClick={onOpenVault}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
            isVaultUnlocked
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
              : 'bg-[#111827] border-[#1F293D] text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#161F30]'
          }`}
          title={isVaultUnlocked ? 'Session Privacy Lock: Unlocked' : 'Session Privacy Lock: Locked'}
        >
          {isVaultUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-[#9CA3AF]" />}
          <span className="hidden sm:inline font-mono text-[11px]">
            {isVaultUnlocked ? 'Session Open' : 'Session Lock'}
          </span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowAlertsDropdown(!showAlertsDropdown);
              setShowProfileDropdown(false);
            }}
            className="p-2 rounded-lg bg-[#111827] hover:bg-[#161F30] border border-[#1F293D] text-[#9CA3AF] hover:text-[#E5E7EB] relative transition cursor-pointer"
            title="Important Changes"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showAlertsDropdown && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#0D131F] border border-[#2A374F] rounded-xl shadow-2xl shadow-black ring-1 ring-black/90 p-4 z-[100]">
              <div className="flex items-center justify-between pb-3 border-b border-[#1F293D]">
                <span className="font-semibold text-sm text-[#F3F4F6] font-display">
                  Important Changes
                </span>
                <button
                  onClick={onMarkAllAlertsRead}
                  className="text-xs text-emerald-400 hover:underline font-mono"
                >
                  Mark all read
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                {alerts.length === 0 ? (
                  <p className="text-xs text-[#6B7280] text-center py-4">No active alerts</p>
                ) : (
                  alerts.map((a) => (
                    <div
                      key={a.alert_id}
                      onClick={() => {
                        setShowAlertsDropdown(false);
                        if (a.affected_symbol) {
                          onNavigate(`/companies/${a.affected_symbol}`);
                        } else if (a.link) {
                          onNavigate(a.link);
                        }
                      }}
                      className={`p-3 rounded-lg border transition cursor-pointer ${
                        a.is_read
                          ? 'bg-[#111827]/60 border-[#1F293D] text-[#9CA3AF]'
                          : 'bg-[#111827] border-emerald-500/40 text-[#F3F4F6]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                        <span className="font-bold text-emerald-400">{a.affected_symbol || a.alert_type}</span>
                        <span className="text-[#6B7280]">{a.created_at}</span>
                      </div>
                      <p className="text-xs font-medium text-[#F3F4F6]">{a.title}</p>
                      <p className="text-[11px] text-[#9CA3AF] line-clamp-2 mt-0.5">{a.what_changed || a.why_it_matters}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowAlertsDropdown(false);
            }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#161F30] border border-[#1F293D] text-xs transition cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              {user.display_name.charAt(0)}
            </div>
            <span className="hidden md:inline font-medium text-[#E5E7EB] text-xs">
              {user.display_name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#0D131F] border border-[#2A374F] rounded-xl shadow-2xl shadow-black ring-1 ring-black/90 p-2 z-[100]">
              <div className="px-3 py-2 border-b border-[#1F293D]">
                <p className="text-xs font-bold text-[#F3F4F6]">{user.display_name}</p>
                <p className="text-[11px] text-[#9CA3AF] font-mono">{user.email}</p>
                <Badge variant="teal" size="sm" className="mt-1">
                  {user.role}
                </Badge>
              </div>

              <div className="mt-1 space-y-1">
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onNavigate('/settings');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#E5E7EB] hover:bg-[#161F30] rounded-lg transition"
                >
                  Account & Settings
                </button>
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onNavigate('/exports');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#E5E7EB] hover:bg-[#161F30] rounded-lg transition"
                >
                  Export Data (.csv)
                </button>
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onNavigate('/track-record');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#E5E7EB] hover:bg-[#161F30] rounded-lg transition"
                >
                  Track Record & Performance
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
