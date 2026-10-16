import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Search,
  Filter,
  ExternalLink,
  Info,
  Layers,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Building2,
  RefreshCw,
  AlertCircle,
  PlusCircle,
  X,
} from 'lucide-react';
import {
  VerifyFirstClaim,
  VerifyFirstAuditSummary,
  VerificationStatus,
  FreshnessStatus,
  SourceQualityTier,
  ClaimCategory,
  InformationTemporalType,
} from '../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { StatCard } from '../components/common/StatCard';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export interface VerifyFirstPageProps {
  onSelectCompany: (symbol: string) => void;
  onSelectThesis?: (thesisId: string) => void;
}

export const VerifyFirstPage: React.FC<VerifyFirstPageProps> = ({
  onSelectCompany,
  onSelectThesis,
}) => {
  const [claims, setClaims] = useState<VerifyFirstClaim[]>([]);
  const [summary, setSummary] = useState<VerifyFirstAuditSummary | null>(null);
  const [patentContext, setPatentContext] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [showPatentDisclosure, setShowPatentDisclosure] = useState<boolean>(true);
  const [showEvaluatorModal, setShowEvaluatorModal] = useState<boolean>(false);

  // New claim interactive test form
  const [testClaimText, setTestClaimText] = useState<string>('');
  const [testSymbol, setTestSymbol] = useState<string>('TATAMOTORS');
  const [testSource, setTestSource] = useState<string>('National Stock Exchange (NSE) Statutory Filing');
  const [testTier, setTestTier] = useState<SourceQualityTier>('TIER_1_OFFICIAL_REGULATORY');
  const [testTemporal, setTestTemporal] = useState<InformationTemporalType>('QUARTERLY_DISCLOSURE');
  const [testPubDate, setTestPubDate] = useState<string>('2026-01-25');
  const [testExcerpt, setTestExcerpt] = useState<string>('');
  const [hasConflict, setHasConflict] = useState<boolean>(false);
  const [conflictText, setConflictText] = useState<string>('');
  const [conflictSource, setConflictSource] = useState<string>('');

  const { showToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [claimsRes, summaryRes, patentRes] = await Promise.all([
        api.getVerifyFirstClaims().catch(() => ({ claims: [], total: 0 })),
        api.getVerifyFirstSummary().catch(() => null),
        api.getVerifyFirstPatentContext().catch(() => null),
      ]);

      setClaims(claimsRes.claims || []);
      setSummary(summaryRes);
      setPatentContext(patentRes);
    } catch (err: any) {
      showToast('Failed to load Verify-First data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered claims
  const filteredClaims = useMemo(() => {
    return claims.filter((c) => {
      if (selectedCompany !== 'ALL' && c.company_symbol !== selectedCompany) return false;
      if (selectedStatus !== 'ALL' && c.verification_status !== selectedStatus) return false;
      if (selectedTier !== 'ALL' && c.source_tier !== selectedTier) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          c.claim_text.toLowerCase().includes(q) ||
          c.company_symbol.toLowerCase().includes(q) ||
          c.company_name.toLowerCase().includes(q) ||
          c.source_name.toLowerCase().includes(q) ||
          c.evidence_excerpt.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [claims, selectedCompany, selectedStatus, selectedTier, searchQuery]);

  const uniqueCompanies = useMemo(() => {
    const syms = Array.from(new Set(claims.map((c) => c.company_symbol))).filter(Boolean);
    return syms.sort();
  }, [claims]);

  const handleTestEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testClaimText.trim() || !testSource.trim()) {
      showToast('Claim text and source are required.', 'error');
      return;
    }

    try {
      const newClaim = await api.evaluateVerifyFirstClaim({
        claim_text: testClaimText.trim(),
        company_symbol: testSymbol.toUpperCase(),
        company_name: testSymbol.toUpperCase(),
        source_name: testSource.trim(),
        source_tier: testTier,
        temporal_type: testTemporal,
        published_at: testPubDate || null,
        evidence_excerpt: testExcerpt.trim(),
        conflicting_evidence: hasConflict && conflictText.trim() ? [
          {
            conflict_id: `conf-test-${Date.now()}`,
            source_name: conflictSource.trim() || 'Secondary Discrepancy Report',
            source_tier: 'TIER_3_INDUSTRY_BODY',
            excerpt: conflictText.trim(),
            opposing_statement: 'Opposing figure reported in secondary research note.',
            disagreement_nature: 'Disagreement on metric scope or reporting definitions.',
            severity: 'CRITICAL',
          }
        ] : [],
        provenance: 'USER_DATA',
        provenance_label: 'Interactive Evaluator Test Case',
      });

      setClaims((prev) => [newClaim, ...prev]);
      showToast(`Claim evaluated: Status is ${newClaim.verification_status}`, 'success');
      setShowEvaluatorModal(false);
      // Reset form
      setTestClaimText('');
      setTestExcerpt('');
      setHasConflict(false);
      setConflictText('');
    } catch (err: any) {
      showToast('Evaluation failed: ' + err.message, 'error');
    }
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> VERIFIED
          </span>
        );
      case 'PARTIALLY_VERIFIED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center gap-1 shrink-0">
            <ShieldCheck className="w-3 h-3 text-cyan-400" /> PARTIALLY VERIFIED
          </span>
        );
      case 'CONFLICTING':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 shrink-0 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-400" /> CONFLICTING EVIDENCE
          </span>
        );
      case 'STALE':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3 text-amber-400" /> STALE DATA
          </span>
        );
      case 'DATA_UNAVAILABLE':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-zinc-500/20 text-zinc-400 border border-zinc-500/40 flex items-center gap-1 shrink-0">
            <AlertCircle className="w-3 h-3 text-zinc-400" /> DATA UNAVAILABLE
          </span>
        );
      case 'UNVERIFIED':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-500/20 text-slate-400 border border-slate-500/40 flex items-center gap-1 shrink-0">
            <HelpCircle className="w-3 h-3 text-slate-400" /> UNVERIFIED
          </span>
        );
    }
  };

  const getTierBadge = (tier: SourceQualityTier) => {
    switch (tier) {
      case 'TIER_1_OFFICIAL_REGULATORY':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            Tier 1: Official Regulatory (1.0 Authority)
          </span>
        );
      case 'TIER_2_PRIMARY_MEDIA':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950/80 text-blue-300 border border-blue-500/40">
            Tier 2: Primary Financial Media (0.75 Authority)
          </span>
        );
      case 'TIER_3_INDUSTRY_BODY':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
            Tier 3: Rating / Industry Body (0.50 Authority)
          </span>
        );
      case 'TIER_4_UNVERIFIED_ESTIMATE':
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-500/40">
            Tier 4: Unverified / Derivative (0.15 Authority)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#0B0F17] border border-[#1F293D] shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              AUDITED EVIDENCE ARCHITECTURE
            </div>
            <span className="text-xs text-[#9CA3AF] font-mono">Verify-First Evidence Engine v2.6.4</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Verify-First Research
          </h1>
          <p className="text-xs text-[#9CA3AF] max-w-3xl leading-relaxed">
            Rigorous validation of source authority, evidential support, temporal freshness, and conflict detection
            before financial or regulatory claims are relied upon in company research, Pre-Buy Gates, and investment theses.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Button size="sm" variant="secondary" onClick={() => loadData()}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </Button>
          <Button size="sm" variant="primary" onClick={() => setShowEvaluatorModal(true)}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Test Claim Verification
          </Button>
        </div>
      </div>

      {/* Patent Connection & Academic Project Disclosure Banner */}
      {showPatentDisclosure && (
        <div className="p-5 rounded-xl bg-[#0F172A] border border-emerald-500/30 text-xs space-y-3 relative">
          <button
            onClick={() => setShowPatentDisclosure(false)}
            className="absolute top-3 right-3 text-[#6B7280] hover:text-[#E5E7EB] cursor-pointer"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              ACADEMIC RESEARCH & PATENT RELATIONSHIP
            </span>
            <span className="text-[#9CA3AF] font-mono text-[11px]">
              Application No. 202641118456 • Bannari Amman Institute of Technology
            </span>
          </div>

          <p className="text-[#D1D5DB] leading-relaxed font-sans text-xs">
            “SignalEdge OS adapts related principles of source-authority assessment, information-freshness validation and
            evidence relationships to investment research. These principles are relevant to the separately filed
            VERIFY-FIRST Adaptive Learning Path Generation System with Authority and Freshness Validation. The original
            invention concerns adaptive learning paths; this project applies related principles to financial claims,
            company analysis and research-thesis monitoring. The existing patent application is not represented as a
            granted patent or as automatically covering SignalEdge OS.”
          </p>

          <div className="pt-2 border-t border-[#1F293D] flex items-center justify-between flex-wrap gap-2 text-[11px] text-[#9CA3AF] font-mono">
            <div>
              <strong>Original Patent Title:</strong> “VERIFY-FIRST Adaptive Learning Path Generation System with Authority and Freshness Validation”
            </div>
            <div>
              <strong>Department:</strong> Artificial Intelligence and Data Science
            </div>
          </div>
        </div>
      )}

      {/* Metrics Banner */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            label="Total Claims Audited"
            value={summary.total_claims}
            subtitle="Centralized store"
          />
          <StatCard
            label="Fully Verified"
            value={summary.verified_count}
            subtitle={`${summary.overall_verification_rate_pct}% weighted rate`}
          />
          <StatCard
            label="Partially Verified"
            value={summary.partially_verified_count}
            subtitle="Secondary press"
          />
          <StatCard
            label="Conflicting Discrepancies"
            value={summary.conflicting_count}
            subtitle="Requires reconciliation"
          />
          <StatCard
            label="Stale Evidence"
            value={summary.stale_count}
            subtitle="Expired thresholds"
          />
          <StatCard
            label="Unverified / Missing"
            value={summary.unverified_count + summary.data_unavailable_count}
            subtitle="Zero authority"
          />
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-xl bg-[#111827] border border-[#1F293D] space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search claim statements, tickers, source filings, or excerpts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0F17] border border-[#1F293D] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Company Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full bg-[#0B0F17] border border-[#1F293D] rounded-lg px-3 py-2 text-xs text-[#E5E7EB] focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Companies ({claims.length})</option>
              {uniqueCompanies.map((sym) => (
                <option key={sym} value={sym}>
                  {sym}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-52">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#0B0F17] border border-[#1F293D] rounded-lg px-3 py-2 text-xs text-[#E5E7EB] focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="PARTIALLY_VERIFIED">PARTIALLY VERIFIED</option>
              <option value="CONFLICTING">CONFLICTING EVIDENCE</option>
              <option value="STALE">STALE DATA</option>
              <option value="UNVERIFIED">UNVERIFIED</option>
              <option value="DATA_UNAVAILABLE">DATA UNAVAILABLE</option>
            </select>
          </div>

          {/* Tier Filter */}
          <div className="w-full md:w-56">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full bg-[#0B0F17] border border-[#1F293D] rounded-lg px-3 py-2 text-xs text-[#E5E7EB] focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Authority Tiers</option>
              <option value="TIER_1_OFFICIAL_REGULATORY">Tier 1: Official Regulatory (1.0)</option>
              <option value="TIER_2_PRIMARY_MEDIA">Tier 2: Primary Financial Media (0.75)</option>
              <option value="TIER_3_INDUSTRY_BODY">Tier 3: Rating / Industry Body (0.50)</option>
              <option value="TIER_4_UNVERIFIED_ESTIMATE">Tier 4: Unverified / Rumor (0.15)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] font-mono pt-1">
          <span>Showing {filteredClaims.length} of {claims.length} claims</span>
          <span>Rules enforced: Anti-syndication • Category freshness • Conflict preservation</span>
        </div>
      </div>

      {/* Claims List View */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#9CA3AF]">
          Loading Verify-First Evidence Claims...
        </div>
      ) : filteredClaims.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#111827] border border-[#1F293D] text-center space-y-3">
          <HelpCircle className="w-8 h-8 text-[#6B7280] mx-auto" />
          <h3 className="text-sm font-semibold text-white">No Matching Claims Found</h3>
          <p className="text-xs text-[#9CA3AF] max-w-md mx-auto">
            Try adjusting your search query, company selector, or verification status filters.
          </p>
          <Button size="sm" variant="secondary" onClick={() => {
            setSelectedCompany('ALL');
            setSelectedStatus('ALL');
            setSelectedTier('ALL');
            setSearchQuery('');
          }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClaims.map((claim) => (
            <Card key={claim.claim_id} variant="elevated" className="space-y-4 border-[#1F293D] hover:border-emerald-500/30 transition">
              {/* Header: Company, Claim, Status */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#1F293D] pb-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      {claim.company_symbol}
                    </span>
                    <span className="text-xs text-[#9CA3AF]">{claim.company_name}</span>
                    <span className="text-[10px] font-mono text-[#6B7280]">• Category: {claim.category}</span>
                    <span className="text-[10px] font-mono text-cyan-400">[{claim.provenance_label}]</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
                    {claim.claim_text}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-start shrink-0">
                  {getStatusBadge(claim.verification_status)}
                </div>
              </div>

              {/* Source & Authority Context */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#0B0F17] p-3 rounded-xl border border-[#1F293D]">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-white">{claim.source_name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap pt-0.5">
                    {getTierBadge(claim.source_tier)}
                    {claim.is_syndicated_derivative && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-950/80 text-amber-400 border border-amber-500/40">
                        Syndicated Derivative (No Independent Weight)
                      </span>
                    )}
                  </div>
                  {claim.source_url && (
                    <a
                      href={claim.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 pt-1 font-mono"
                    >
                      <ExternalLink className="w-3 h-3" /> View Source Filing / Reference
                    </a>
                  )}
                </div>

                {/* Dates & Freshness Assessment */}
                <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#1F293D] md:pl-3 pt-2 md:pt-0">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#9CA3AF]">Publication Date:</span>
                    <span className="font-mono text-white">
                      {claim.published_at
                        ? new Date(claim.published_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'UNKNOWN / MISSING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#9CA3AF]">Retrieval Timestamp:</span>
                    <span className="font-mono text-[#D1D5DB]">
                      {new Date(claim.retrieved_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#9CA3AF]">Freshness Evaluation:</span>
                    <span className={`font-mono font-semibold ${
                      claim.freshness_status === 'LIVE'
                        ? 'text-emerald-400'
                        : claim.freshness_status === 'RECENT'
                        ? 'text-cyan-400'
                        : claim.freshness_status === 'HISTORICAL'
                        ? 'text-purple-400'
                        : 'text-amber-400'
                    }`}>
                      {claim.freshness_status}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] leading-tight pt-0.5">
                    {claim.freshness_explanation}
                  </p>
                </div>
              </div>

              {/* Evidence Excerpt & Document Section */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px] text-[#9CA3AF]">
                  <span className="font-semibold uppercase tracking-wider text-[10px] text-[#6B7280]">
                    Verified Excerpt / Supporting Text
                  </span>
                  {claim.document_name && (
                    <span className="font-mono text-[10px] text-emerald-400/90">
                      Doc: {claim.document_name} {claim.document_section ? `• ${claim.document_section}` : ''} {claim.document_page ? `(p. ${claim.document_page})` : ''}
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-lg bg-[#080C14] border border-[#1E293B] text-[#D1D5DB] text-xs leading-relaxed italic border-l-2 border-l-emerald-500">
                  {claim.evidence_excerpt ? `“${claim.evidence_excerpt}”` : <span className="text-[#6B7280] not-italic">No excerpt provided. Missing primary evidentiary grounding.</span>}
                </div>
              </div>

              {/* Conflicting Evidence Alert (Preserves both sides) */}
              {claim.conflicting_evidence && claim.conflicting_evidence.length > 0 && (
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Conflicting Evidence Detected ({claim.conflicting_evidence.length} opposing source)</span>
                  </div>

                  {claim.conflicting_evidence.map((conf) => (
                    <div key={conf.conflict_id} className="space-y-1 pt-1 text-[11px] border-t border-rose-500/20">
                      <div className="flex items-center justify-between text-[#E5E7EB]">
                        <strong>Opposing Source: {conf.source_name}</strong>
                        <span className="font-mono text-rose-300">Severity: {conf.severity}</span>
                      </div>
                      <p className="text-rose-200/90 italic">
                        “{conf.excerpt}”
                      </p>
                      <p className="text-rose-300 font-sans">
                        <strong>Disagreement:</strong> {conf.disagreement_nature}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Explanation & Dependencies */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#1F293D] text-[11px]">
                <div className="space-y-0.5 text-[#9CA3AF] max-w-2xl">
                  <div><strong>Audit Explanation:</strong> {claim.explanation}</div>
                  {claim.limitations && <div className="text-[10px] text-[#6B7280]"><strong>Limitations:</strong> {claim.limitations}</div>}
                </div>

                {/* Dependent Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onSelectCompany(claim.company_symbol)}
                  >
                    <Building2 className="w-3 h-3 mr-1" />
                    Company Hub
                  </Button>
                </div>
              </div>

              {/* Dependent Gate & Thesis impact */}
              {((claim.dependent_gate_layers && claim.dependent_gate_layers.length > 0) ||
                (claim.dependent_thesis_ids && claim.dependent_thesis_ids.length > 0)) && (
                <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono text-[#6B7280] pt-1">
                  <span>Downstream Dependencies:</span>
                  {claim.dependent_gate_layers?.map((layer) => (
                    <span key={layer} className="px-1.5 py-0.2 rounded bg-[#161F30] text-emerald-400/90 border border-[#1F293D]">
                      Pre-Buy: {layer}
                    </span>
                  ))}
                  {claim.dependent_thesis_ids?.map((thId) => (
                    <span key={thId} className="px-1.5 py-0.2 rounded bg-[#161F30] text-teal-400/90 border border-[#1F293D]">
                      Thesis: {thId}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Interactive Claim Evaluator Modal */}
      {showEvaluatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-[#0F172A] border border-[#1F293D] rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1F293D] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Test Verify-First Claim Evaluation</h3>
              </div>
              <button
                onClick={() => setShowEvaluatorModal(false)}
                className="text-[#6B7280] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTestEvaluate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[#9CA3AF] font-semibold">Claim Statement *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Suzlon Energy secured 1.2 GW firm wind turbine supply contract from NTPC Green Energy."
                  value={testClaimText}
                  onChange={(e) => setTestClaimText(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-[#1F293D] rounded-lg p-2.5 text-white placeholder-[#6B7280] focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#9CA3AF] font-semibold">Company NSE Symbol *</label>
                  <input
                    type="text"
                    required
                    value={testSymbol}
                    onChange={(e) => setTestSymbol(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-[#1F293D] rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#9CA3AF] font-semibold">Source Authority Tier *</label>
                  <select
                    value={testTier}
                    onChange={(e) => setTestTier(e.target.value as any)}
                    className="w-full bg-[#0B0F17] border border-[#1F293D] rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="TIER_1_OFFICIAL_REGULATORY">Tier 1: Official Regulatory (1.0)</option>
                    <option value="TIER_2_PRIMARY_MEDIA">Tier 2: Primary Financial Media (0.75)</option>
                    <option value="TIER_3_INDUSTRY_BODY">Tier 3: Rating / Industry Body (0.50)</option>
                    <option value="TIER_4_UNVERIFIED_ESTIMATE">Tier 4: Unverified / Rumor (0.15)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#9CA3AF] font-semibold">Source Name *</label>
                  <input
                    type="text"
                    required
                    value={testSource}
                    onChange={(e) => setTestSource(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-[#1F293D] rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#9CA3AF] font-semibold">Temporal Type</label>
                  <select
                    value={testTemporal}
                    onChange={(e) => setTestTemporal(e.target.value as any)}
                    className="w-full bg-[#0B0F17] border border-[#1F293D] rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="MARKET_EVENT">Market Event (90d cycle)</option>
                    <option value="QUARTERLY_DISCLOSURE">Quarterly Disclosure (105d threshold)</option>
                    <option value="ANNUAL_AUDIT">Annual Audit (425d threshold)</option>
                    <option value="REALTIME_PRICE">Real-Time Price (24-48h threshold)</option>
                    <option value="HISTORICAL_FACT">Historical Milestone (Non-expiring)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#9CA3AF] font-semibold">Publication Date</label>
                <input
                  type="date"
                  value={testPubDate}
                  onChange={(e) => setTestPubDate(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-[#1F293D] rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#9CA3AF] font-semibold">Evidence Excerpt from Document *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Paste excerpt from official filing or document to test semantic and factual support..."
                  value={testExcerpt}
                  onChange={(e) => setTestExcerpt(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-[#1F293D] rounded-lg p-2.5 text-white placeholder-[#6B7280] focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Conflict Simulator Checkbox */}
              <div className="p-3 rounded-lg bg-[#0B0F17] border border-[#1F293D] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasConflict}
                    onChange={(e) => setHasConflict(e.target.checked)}
                    className="rounded border-[#1F293D] text-emerald-500 focus:ring-0"
                  />
                  <span className="font-semibold text-rose-300">Simulate Opposing / Conflicting Evidence</span>
                </label>

                {hasConflict && (
                  <div className="space-y-2 pt-2 border-t border-[#1F293D]">
                    <input
                      type="text"
                      placeholder="Opposing Source Name (e.g. Audit Discrepancy Note, Media dispute)"
                      value={conflictSource}
                      onChange={(e) => setConflictSource(e.target.value)}
                      className="w-full bg-[#0F172A] border border-[#1F293D] rounded p-2 text-white placeholder-[#6B7280]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Opposing excerpt contradicting the claim..."
                      value={conflictText}
                      onChange={(e) => setConflictText(e.target.value)}
                      className="w-full bg-[#0F172A] border border-[#1F293D] rounded p-2 text-white placeholder-[#6B7280]"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1F293D]">
                <Button size="sm" variant="secondary" type="button" onClick={() => setShowEvaluatorModal(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Evaluate with Verify-First Engine
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory SEBI Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
};
export default VerifyFirstPage;
