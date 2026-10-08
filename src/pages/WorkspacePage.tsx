import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  TrendingUp,
  ShieldCheck,
  BrainCircuit,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  FileText,
} from 'lucide-react';
import { ResearchThesis, OpportunityItem, Company, Signal } from '../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { useToast } from '../context/ToastContext';

export interface WorkspacePageProps {
  theses: ResearchThesis[];
  opportunities: OpportunityItem[];
  companies: Company[];
  signals: Signal[];
  onOpenNewThesis: () => void;
  onSelectCompany: (symbol: string) => void;
  onRunSimulation: (scenario: string) => void;
  onOpenGate: (symbol: string) => void;
  onDeleteThesis: (id: string) => void;
  onUpdateOpportunityStatus: (id: string, status: OpportunityItem['status']) => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  theses,
  opportunities,
  companies,
  signals,
  onOpenNewThesis,
  onSelectCompany,
  onRunSimulation,
  onOpenGate,
  onDeleteThesis,
  onUpdateOpportunityStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'THESES' | 'PIPELINE'>('THESES');
  const { showToast } = useToast();

  const pipelineStages: Array<{ status: OpportunityItem['status']; label: string; count: number }> = [
    { status: 'NEW', label: 'New Discoveries', count: opportunities.filter((o) => o.status === 'NEW').length },
    { status: 'INVESTIGATING', label: 'Investigating', count: opportunities.filter((o) => o.status === 'INVESTIGATING').length },
    { status: 'VALIDATED', label: 'Validated', count: opportunities.filter((o) => o.status === 'VALIDATED').length },
    { status: 'WATCHING', label: 'Watching', count: opportunities.filter((o) => o.status === 'WATCHING').length },
    { status: 'INVALIDATED', label: 'Invalidated', count: opportunities.filter((o) => o.status === 'INVALIDATED').length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#111827] border border-[#1F293D]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">
              My Research Workspace
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F4F6] tracking-tight font-display">
            My Investment Views & Opportunities
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1 max-w-2xl">
            Track your investment views and opportunities from initial discovery to validation and monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" onClick={onOpenNewThesis}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Create Investment View
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1F293D] gap-6 text-xs font-medium overflow-x-auto flex-nowrap scrollbar-none shrink-0">
        <button
          onClick={() => setActiveTab('THESES')}
          className={`pb-3 -mb-px transition cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'THESES'
              ? 'border-b-2 border-emerald-500 text-emerald-400 font-semibold'
              : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Active Investment Views ({theses.length})
        </button>
        <button
          onClick={() => setActiveTab('PIPELINE')}
          className={`pb-3 -mb-px transition cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'PIPELINE'
              ? 'border-b-2 border-emerald-500 text-emerald-400 font-semibold'
              : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Opportunities Pipeline ({opportunities.length})
        </button>
      </div>

      {/* View 1: Active Theses */}
      {activeTab === 'THESES' && (
        <div className="space-y-4">
          {theses.length === 0 ? (
            <Card variant="elevated" className="text-center py-12 space-y-3">
              <p className="text-xs text-[#9CA3AF]">No investment views created yet.</p>
              <Button size="sm" onClick={onOpenNewThesis}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Create Your First Investment View
              </Button>
            </Card>
          ) : (
            theses.map((th) => (
              <Card key={th.thesis_id} variant="elevated" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="emerald" size="sm" dot className="shrink-0">
                        Status: {th.status}
                      </Badge>
                      <button
                        onClick={() => onSelectCompany(th.primary_symbol)}
                        className="font-mono text-xs font-bold text-emerald-400 hover:underline cursor-pointer shrink-0"
                      >
                        {th.primary_symbol}
                      </button>
                      <span className="text-[11px] text-[#6B7280] font-mono shrink-0">• {th.sector}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#F3F4F6] font-display break-words">{th.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onOpenGate(th.primary_symbol)}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Before You Invest
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        onRunSimulation(`Stress-test thesis: "${th.title}" for ${th.primary_symbol} across market personas.`)
                      }
                    >
                      <BrainCircuit className="w-3.5 h-3.5 mr-1 text-purple-400" /> Test Scenarios
                    </Button>
                    <button
                      onClick={() => {
                        onDeleteThesis(th.thesis_id);
                        showToast('Investment view deleted.', 'info');
                      }}
                      className="p-2 text-[#6B7280] hover:text-rose-400 transition cursor-pointer"
                      title="Delete Investment View"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#D1D5DB] leading-relaxed bg-[#0B0F17] p-3 rounded-xl border border-[#1F293D]">
                  <strong className="text-white block mb-0.5">Core Investment Reason:</strong>
                  {th.hypothesis}
                </p>

                {/* Bull / Base / Bear Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#161F30] border border-emerald-500/30 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">
                      {th.bull_scenario?.name || 'Best Case'} ({th.bull_scenario?.target_probability_pct || 35}%)
                    </span>
                    <p className="text-xs text-[#E5E7EB]">{th.bull_scenario?.potential_impact || '+40% Target'}</p>
                    <span className="text-[10px] text-[#9CA3AF] block font-mono">
                      {th.bull_scenario?.description}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#161F30] border border-teal-500/30 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-teal-400 uppercase block">
                      {th.base_scenario?.name || 'Base Case'} ({th.base_scenario?.target_probability_pct || 50}%)
                    </span>
                    <p className="text-xs text-[#E5E7EB]">{th.base_scenario?.potential_impact || '+20% Target'}</p>
                    <span className="text-[10px] text-[#9CA3AF] block font-mono">
                      {th.base_scenario?.description}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#161F30] border border-rose-500/30 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-rose-400 uppercase block">
                      {th.bear_scenario?.name || 'Worst Case'} ({th.bear_scenario?.target_probability_pct || 15}%)
                    </span>
                    <p className="text-xs text-[#E5E7EB]">{th.bear_scenario?.potential_impact || '-15% Target'}</p>
                    <span className="text-[10px] text-[#9CA3AF] block font-mono">
                      {th.bear_scenario?.description}
                    </span>
                  </div>
                </div>

                {/* Invalidation Triggers */}
                {th.invalidation_triggers && th.invalidation_triggers.length > 0 && (
                  <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D] space-y-1.5">
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> What Could Prove This Wrong? (Key Risks)
                    </span>
                    <div className="space-y-1">
                      {th.invalidation_triggers.map((trig, idx) => (
                        <div key={idx} className="text-xs text-[#9CA3AF] font-mono flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{trig}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {/* View 2: Opportunity Pipeline */}
      {activeTab === 'PIPELINE' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {pipelineStages.map((stg) => (
              <div
                key={stg.status}
                className="p-3.5 rounded-xl bg-[#111827] border border-[#1F293D] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F3F4F6] font-display">{stg.label}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#161F30] text-[10px] font-mono font-bold text-[#9CA3AF]">
                    {stg.count}
                  </span>
                </div>

                <div className="space-y-2">
                  {opportunities
                    .filter((o) => o.status === stg.status)
                    .map((opp) => (
                      <div
                        key={opp.opportunity_id}
                        className="p-3 rounded-lg bg-[#161F30] border border-[#1F293D] space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            onClick={() => onSelectCompany(opp.nse_symbol)}
                            className="font-mono font-bold text-emerald-400 hover:underline cursor-pointer"
                          >
                            {opp.nse_symbol}
                          </span>
                          <Badge variant="emerald" size="sm">
                            Score: {opp.opportunity_score}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-[#F3F4F6] leading-tight">{opp.title}</h4>
                        <p className="text-[11px] text-[#9CA3AF] line-clamp-2">{opp.why_it_matters}</p>

                        {/* Status Mover */}
                        <div className="pt-2 border-t border-[#1F293D] flex justify-between items-center text-[10px]">
                          <select
                            value={opp.status}
                            onChange={(e) =>
                              onUpdateOpportunityStatus(opp.opportunity_id, e.target.value as OpportunityItem['status'])
                            }
                            className="bg-[#0B0F17] border border-[#1F293D] rounded px-1.5 py-0.5 text-[#E5E7EB] font-mono text-[10px]"
                          >
                            <option value="NEW">New</option>
                            <option value="INVESTIGATING">Researching</option>
                            <option value="VALIDATED">Validated</option>
                            <option value="WATCHING">Watching</option>
                            <option value="INVALIDATED">Passed</option>
                          </select>
                          <button
                            onClick={() => onSelectCompany(opp.nse_symbol)}
                            className="text-emerald-400 hover:underline"
                          >
                            Research &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
};
