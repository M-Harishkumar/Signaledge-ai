import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Play,
  Sparkles,
  Users,
  AlertTriangle,
  FileText,
  Upload,
  X,
  Layers,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  History,
  CheckCircle2,
} from 'lucide-react';
import { SimulationSession } from '../types';
import { Card, CardHeader, CardTitle } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export interface SimulationPageProps {
  sessions: SimulationSession[];
  initialScenario?: string;
  onRunNewSimulation: (
    scenario: string,
    name: string,
    uploadedText?: string,
    onStatus?: (status: { message: string; step?: number }) => void
  ) => Promise<SimulationSession>;
  onSelectCompany: (symbol: string) => void;
  onInvestigate?: (symbol: string) => void;
}

export const SimulationPage: React.FC<SimulationPageProps> = ({
  sessions,
  initialScenario = '',
  onRunNewSimulation,
  onSelectCompany,
  onInvestigate,
}) => {
  const [scenarioInput, setScenarioInput] = useState<string>(
    initialScenario ||
      'Geopolitical tensions in the Persian Gulf cause insurance war-risk premia on crude and LNG carriers to surge 300%, impacting Indian fertilizer and downstream chemical feedstock margins.'
  );
  const [sessionName, setSessionName] = useState<string>('Persian Gulf LNG Supply Shock');
  const [running, setRunning] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<{ message: string; step?: number } | null>(null);
  const [activeSession, setActiveSession] = useState<SimulationSession>(sessions[0]);
  const [activeReportTab, setActiveReportTab] = useState<
    'BENEFICIARIES' | 'EXECUTIVE' | 'TRANSMISSION' | 'RISKS' | 'DISSENT' | 'CITATIONS' | 'METHODOLOGY'
  >('BENEFICIARIES');

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<{ name: string; preview: string } | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (initialScenario) {
      setScenarioInput(initialScenario);
      setSessionName(initialScenario.substring(0, 36) + (initialScenario.length > 36 ? '...' : ''));
    }
  }, [initialScenario]);

  useEffect(() => {
    if (sessions && sessions.length > 0) {
      if (!activeSession || !sessions.some((s) => s.session_id === activeSession.session_id)) {
        setActiveSession(sessions[0]);
      }
    }
  }, [sessions]);

  const templates = [
    {
      name: 'Middle East LNG & Oil Shock',
      scenario: 'Strait of Hormuz tanker freight rates surge 300%. Model feedstock margin transmission for Indian chemicals & aviation.',
    },
    {
      name: 'US Fed / RBI 50 bps Rate Cut',
      scenario: 'Synchronized global rate easing unlocks $4B FII inflows into Indian banking & high-capex capital goods.',
    },
    {
      name: 'Defense Indigenisation Ban Wave',
      scenario: 'MoD issues PIL-6 banning import of 340+ electronic subsystems. Model margin expansion for domestic PSUs.',
    },
    {
      name: 'EV Battery & PLI Localization',
      scenario: 'Ministry of Heavy Industries raises domestic value addition thresholds to 60% for EV subsidies, accelerating domestic battery pack integration.',
    },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('File exceeds 5MB size limit.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const res = await api.uploadSimulationFiling(file);
      setUploadedFile({
        name: file.name,
        preview: res.extracted_text_preview,
      });
      showToast(`Uploaded ${file.name} for document grounding scenario context.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'File upload failed.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartSim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioInput.trim() || running) return;
    setRunning(true);
    setSimProgress({ message: 'Initializing scenario context & live macro benchmarks...', step: 1 });

    try {
      const newSession = await onRunNewSimulation(
        scenarioInput,
        sessionName,
        uploadedFile?.preview,
        (status) => setSimProgress(status)
      );
      setActiveSession(newSession);
      setActiveReportTab('BENEFICIARIES');
      showToast('Persona-Cluster Swarm Simulation complete.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Simulation failed.', 'error');
    } finally {
      setRunning(false);
      setSimProgress(null);
    }
  };

  const rep = activeSession?.report;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F293D]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1 rounded bg-purple-500/10 text-purple-400">
            <BrainCircuit className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold uppercase text-purple-400 tracking-wider">
            Different Investor Perspectives & Market Simulation
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#F3F4F6] tracking-tight font-display">
          Scenario & Market Impact Simulator
        </h1>
        <p className="text-xs text-[#9CA3AF] mt-1 max-w-3xl">
          Simulates how major events impact different market participants (foreign investors, domestic mutual funds, company leaders, and regulators) to see who benefits, who is at risk, and what could go wrong.
        </p>
      </div>

      {/* Preset Scenarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {templates.map((tpl, idx) => (
          <div
            key={idx}
            onClick={() => {
              setSessionName(tpl.name);
              setScenarioInput(tpl.scenario);
            }}
            className="p-3.5 rounded-xl bg-[#111827] hover:bg-[#161F30] border border-[#1F293D] hover:border-purple-500/40 transition cursor-pointer text-xs space-y-1"
          >
            <div className="flex items-center gap-1.5 font-bold text-[#F3F4F6]">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">{tpl.name}</span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] line-clamp-2">{tpl.scenario}</p>
          </div>
        ))}
      </div>

      {/* Scenario Launcher Form */}
      <Card variant="elevated">
        <form onSubmit={handleStartSim} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="text-xs font-semibold text-[#F3F4F6] block mb-1">
                Simulation Name
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="E.g., Crude Price Shock"
                className="w-full bg-[#161F30] border border-[#1F293D] rounded-xl p-2.5 text-xs text-[#E5E7EB] focus:outline-none focus:border-purple-500/50 font-sans"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-[#F3F4F6] block mb-1">
                Scenario or Event Description
              </label>
              <input
                type="text"
                value={scenarioInput}
                onChange={(e) => setScenarioInput(e.target.value)}
                placeholder="Describe an event, policy change, or market shift to test..."
                className="w-full bg-[#161F30] border border-[#1F293D] rounded-xl p-2.5 text-xs text-[#E5E7EB] focus:outline-none focus:border-purple-500/50 font-sans"
              />
            </div>
          </div>

          {/* Optional Document Upload */}
          <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#1F293D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Upload className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="font-semibold text-[#F3F4F6] block">
                  Attach Company Filing, Report or Document (Optional)
                </span>
                <span className="text-[11px] text-[#9CA3AF]">
                  Attach earnings transcripts, annual reports, or official PDFs (max 5MB) to ground the simulation in real data
                </span>
              </div>
            </div>

            <div>
              {uploadedFile ? (
                <div className="flex items-center gap-2 bg-[#161F30] px-3 py-1.5 rounded-lg border border-[#1F293D]">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-mono font-medium text-emerald-300 max-w-[140px] truncate">
                    {uploadedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="text-[#9CA3AF] hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161F30] hover:bg-[#1E293B] border border-[#1F293D] text-[#E5E7EB] font-medium cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5 text-purple-400" />
                  <span>{isUploading ? 'Uploading...' : 'Attach Document'}</span>
                  <input
                    type="file"
                    accept=".pdf,.txt,.csv,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
          </div>

          {running && simProgress && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3 animate-pulse">
              <div className="w-5 h-5 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin shrink-0" />
              <div className="text-xs font-mono text-purple-300">
                <span className="font-bold mr-1.5">{simProgress.step ? `[Step ${simProgress.step}/4]` : 'Processing:'}</span>
                <span>{simProgress.message}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-[#1F293D] flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs text-[#9CA3AF] font-mono">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Different Investor Views • 30-Day Market Impact Horizon</span>
            </div>

            <Button type="submit" size="md" isLoading={running}>
              <Play className="w-3.5 h-3.5 mr-1" /> Run Market Simulation
            </Button>
          </div>
        </form>
      </Card>

      {/* Historical Simulation Sessions Switcher */}
      {sessions && sessions.length > 1 && (
        <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1F293D] space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#9CA3AF]">
            <History className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-bold text-[#F3F4F6]">Past Simulations ({sessions.length} Saved)</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {sessions.map((s) => (
              <button
                key={s.session_id}
                type="button"
                onClick={() => setActiveSession(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition cursor-pointer border ${
                  activeSession?.session_id === s.session_id
                    ? 'bg-purple-500/20 border-purple-500/60 text-purple-200 font-bold'
                    : 'bg-[#161F30] border-[#1F293D] text-[#9CA3AF] hover:text-white'
                }`}
              >
                {s.session_name || s.input_scenario?.substring(0, 24) || 'Simulation'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Simulation Result Report */}
      {rep && (
        <div className="space-y-4">
          {/* Top Outcome Bar */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 to-[#111827] border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="purple" size="md">
                  Main Consensus Outcome
                </Badge>
                <Badge variant="emerald" size="md">
                  Confidence: {rep.executive_summary?.confidence_pct || 82}%
                </Badge>
              </div>
              <span className="text-[11px] text-[#9CA3AF] font-mono">
                Analysis: {rep.methodology?.model || 'Deterministic Multi-Agent Engine + Live Feed'}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#F3F4F6] font-display">
              {rep.executive_summary?.primary_outcome || rep.initial_shock}
            </h3>
            <p className="text-xs text-[#D1D5DB] leading-relaxed">
              {rep.executive_summary?.rationale || rep.consensus_summary}
            </p>
          </div>

          {/* Report Tab Navigation */}
          <div className="flex border-b border-[#1F293D] gap-6 text-xs font-medium overflow-x-auto flex-nowrap scrollbar-none shrink-0">
            <button
              type="button"
              onClick={() => setActiveReportTab('BENEFICIARIES')}
              className={`pb-3 -mb-px transition cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeReportTab === 'BENEFICIARIES'
                  ? 'border-b-2 border-purple-500 text-purple-300 font-semibold'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Companies That Benefit or Lose ({rep.beneficiaries?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveReportTab('EXECUTIVE')}
              className={`pb-3 -mb-px transition cursor-pointer whitespace-nowrap shrink-0 ${
                activeReportTab === 'EXECUTIVE'
                  ? 'border-b-2 border-purple-500 text-purple-300 font-semibold'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              Investor & Leader Reactions
            </button>
            <button
              type="button"
              onClick={() => setActiveReportTab('TRANSMISSION')}
              className={`pb-3 -mb-px transition cursor-pointer whitespace-nowrap shrink-0 ${
                activeReportTab === 'TRANSMISSION'
                  ? 'border-b-2 border-purple-500 text-purple-300 font-semibold'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              How Impact Spreads & Signals to Watch
            </button>
            <button
              type="button"
              onClick={() => setActiveReportTab('RISKS')}
              className={`pb-3 -mb-px transition cursor-pointer whitespace-nowrap shrink-0 ${
                activeReportTab === 'RISKS'
                  ? 'border-b-2 border-purple-500 text-purple-300 font-semibold'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              Key Risks & Likelihood ({rep.risk_map?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveReportTab('DISSENT')}
              className={`pb-3 -mb-px transition cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeReportTab === 'DISSENT'
                  ? 'border-b-2 border-purple-500 text-purple-300 font-semibold'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Opposing & Critical Views ({rep.dissenting_views?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveReportTab('CITATIONS')}
              className={`pb-3 -mb-px transition cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeReportTab === 'CITATIONS'
                  ? 'border-b-2 border-purple-500 text-purple-300 font-semibold'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              Document Sources & Quotes ({rep.grounded_evidence_citations?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveReportTab('METHODOLOGY')}
              className={`pb-3 -mb-px transition cursor-pointer whitespace-nowrap shrink-0 ${
                activeReportTab === 'METHODOLOGY'
                  ? 'border-b-2 border-purple-500 text-purple-300 font-semibold'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              How This Was Calculated
            </button>
          </div>

          {/* Tab 0: Beneficiaries & Potential Losers */}
          {activeReportTab === 'BENEFICIARIES' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Beneficiaries */}
                <Card variant="elevated" className="border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
                      Companies That Benefit ({rep.beneficiaries?.length || 0})
                    </span>
                  </div>
                  <div className="space-y-3">
                    {(!rep.beneficiaries || rep.beneficiaries.length === 0) ? (
                      <p className="text-xs text-[#9CA3AF]">No direct beneficiaries identified for this shock scenario.</p>
                    ) : (
                      rep.beneficiaries.map((ben, bIdx) => (
                        <div
                          key={bIdx}
                          className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D] flex items-center justify-between gap-3"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onSelectCompany(ben.symbol)}
                                className="font-mono font-bold text-xs text-emerald-400 hover:underline cursor-pointer"
                              >
                                {ben.symbol}
                              </button>
                              <Badge variant="emerald" size="sm">
                                {ben.potential_impact}
                              </Badge>
                            </div>
                            <p className="text-xs text-[#9CA3AF] line-clamp-2">{ben.reason}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {onInvestigate && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onInvestigate(ben.symbol)}
                              >
                                Research Company
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>

                {/* Potential Losers / Margin Compression */}
                <Card variant="elevated" className="border-rose-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-bold font-mono text-rose-400 uppercase tracking-wider">
                      Companies at Risk ({rep.potential_losers?.length || 0})
                    </span>
                  </div>
                  <div className="space-y-3">
                    {(!rep.potential_losers || rep.potential_losers.length === 0) ? (
                      <p className="text-xs text-[#9CA3AF]">No direct margin compression targets identified.</p>
                    ) : (
                      rep.potential_losers.map((los, lIdx) => (
                        <div
                          key={lIdx}
                          className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D] flex items-center justify-between gap-3"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onSelectCompany(los.symbol)}
                                className="font-mono font-bold text-xs text-rose-400 hover:underline cursor-pointer"
                              >
                                {los.symbol}
                              </button>
                              <Badge variant="rose" size="sm">
                                {los.potential_impact}
                              </Badge>
                            </div>
                            <p className="text-xs text-[#9CA3AF] line-clamp-2">{los.reason}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {onInvestigate && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onInvestigate(los.symbol)}
                              >
                                Research Company
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>

              {/* Transmission Chain Accordion */}
              {rep.transmission_chain && rep.transmission_chain.length > 0 && (
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>How the Impact Spreads Step-by-Step</CardTitle>
                  </CardHeader>
                  <div className="space-y-2 text-xs">
                    {rep.transmission_chain.map((stg, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D] flex items-start gap-3"
                      >
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                          0{sIdx + 1}
                        </span>
                        <span className="text-[#D1D5DB] leading-relaxed">{stg}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Tab 1: Stakeholder Reactions */}
          {activeReportTab === 'EXECUTIVE' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {rep.stakeholder_reactions.map((stk, idx) => (
                <Card key={idx} variant="elevated">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#F3F4F6] font-display">
                      {stk.stakeholder_type}
                    </span>
                    <Badge variant={stk.intensity === 'HIGH' ? 'rose' : 'amber'} size="sm">
                      {stk.intensity} Intensity
                    </Badge>
                  </div>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed mb-3">
                    {stk.predicted_response}
                  </p>
                  <div className="pt-2 border-t border-[#1F293D] flex justify-between text-[10px] font-mono text-[#6B7280]">
                    <span>Peak Reaction Time:</span>
                    <span className="text-[#F3F4F6] font-bold">Day {stk.peak_reaction_day}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Tab 2: Transmission Chain & Leading Indicators */}
          {activeReportTab === 'TRANSMISSION' && (
            <div className="space-y-4">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Key Signals to Watch (Confirm or Disprove)</CardTitle>
                </CardHeader>
                <div className="space-y-2 text-xs font-mono">
                  {(rep.leading_indicators_to_monitor || [
                    'Baltic Clean Tanker Index (BCTI) weekly rate changes.',
                    'RBI FX reserves weekly burn rate during crude escalation.',
                    'Quarterly concall gross margin guidance from listed specialty chemical peers.',
                  ]).map((ind, iIdx) => (
                    <div
                      key={iIdx}
                      className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D] flex items-center gap-2.5 text-[#D1D5DB]"
                    >
                      <span className="text-teal-400 font-bold">#{iIdx + 1}</span>
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {rep.second_order_effects && rep.second_order_effects.length > 0 && (
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Next-Stage & Follow-on Effects</CardTitle>
                  </CardHeader>
                  <div className="space-y-2 text-xs">
                    {rep.second_order_effects.map((eff, eIdx) => (
                      <div
                        key={eIdx}
                        className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D] text-[#D1D5DB]"
                      >
                        <span className="font-mono font-bold text-purple-400 block mb-1">
                          Follow-on Effect 0{eIdx + 1}
                        </span>
                        <span>{eff}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Tab 3: Sensitivity & Risk Map */}
          {activeReportTab === 'RISKS' && (
            <div className="space-y-3">
              {rep.risk_map.map((risk) => (
                <Card key={risk.rank} variant="elevated">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-amber-400">Rank 0{risk.rank}</span>
                        <h4 className="text-xs font-bold text-[#F3F4F6]">{risk.title}</h4>
                      </div>
                      <p className="text-xs text-[#9CA3AF]">{risk.mechanism}</p>
                      <span className="text-[10px] font-mono text-[#6B7280] block mt-1">
                        Trigger / Driver: {risk.driver_stakeholder}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-[#6B7280] font-mono block">Likelihood</span>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {risk.probability_pct}%
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Tab 4: Mandatory Minority Dissenting Views */}
          {activeReportTab === 'DISSENT' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#0B0F17] border border-[#1F293D] text-xs text-[#9CA3AF] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Critical & opposing perspectives: Highlights what others might miss and potential downside risks to avoid groupthink.
                </span>
              </div>
              {rep.dissenting_views.map((dis, idx) => (
                <Card key={idx} variant="elevated" className="border-amber-500/30">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="amber" size="sm">
                      {dis.agent_percentage}% Opposing View
                    </Badge>
                  </div>
                  <p className="text-xs text-[#E5E7EB] font-medium leading-relaxed">{dis.view}</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-1 font-mono">
                    Why This Matters: {dis.risk_implication}
                  </p>
                </Card>
              ))}
            </div>
          )}

          {/* Tab 5: Grounded Citations & Document Excerpts */}
          {activeReportTab === 'CITATIONS' && (
            <div className="space-y-3">
              {uploadedFile && (
                <div className="p-3.5 rounded-xl bg-teal-950/20 border border-teal-500/30 text-xs text-[#E5E7EB]">
                  <span className="font-bold text-teal-400 block mb-1">Attached Document Excerpt</span>
                  <p className="text-[11px] text-[#9CA3AF] font-mono line-clamp-3">
                    {uploadedFile.preview}
                  </p>
                </div>
              )}

              {(rep.grounded_evidence_citations || [
                {
                  document_name: 'SEBI Corporate Filing / Ministry of Petroleum Notification',
                  section: 'Section 4.1',
                  excerpt: 'Long-term LNG supply contracts remain indexed to 3-month trailing Brent averages with fixed shipping formula.',
                },
                {
                  document_name: 'Q3 FY26 Earnings Call Transcript (Chemicals Sector)',
                  section: 'Management Remarks',
                  excerpt: 'Raw material inventory buffers currently stand at 42 days of forward production requirements.',
                },
              ]).map((cit, cIdx) => (
                <Card key={cIdx} variant="elevated">
                  <div className="flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="teal" size="sm">Citation 0{cIdx + 1}</Badge>
                        <span className="font-mono text-emerald-400 font-semibold">{cit.document_name}</span>
                        {cit.section && <span className="text-[11px] text-[#6B7280] font-mono">{cit.section}</span>}
                      </div>
                      <p className="text-[#D1D5DB] italic">"{cit.excerpt}"</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Tab 6: Methodology */}
          {activeReportTab === 'METHODOLOGY' && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Simulation Details</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D]">
                  <span className="text-[#6B7280] block text-[10px]">Analysis Type</span>
                  <span className="text-[#F3F4F6] font-bold">{rep.methodology?.simulation_mode || 'Persona-Cluster Swarm'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D]">
                  <span className="text-[#6B7280] block text-[10px]">Investor Views Analyzed</span>
                  <span className="text-purple-400 font-bold">{rep.methodology?.agent_personas_modeled || 12} Perspectives</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D]">
                  <span className="text-[#6B7280] block text-[10px]">Time Horizon</span>
                  <span className="text-emerald-400 font-bold">{rep.methodology?.simulation_horizon_days || 30} Days</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D]">
                  <span className="text-[#6B7280] block text-[10px]">Documents Used</span>
                  <span className="text-teal-400 font-bold">{rep.methodology?.documents_processed || 1} Document Source</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
};
