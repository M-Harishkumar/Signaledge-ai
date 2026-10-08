import React, { useState } from 'react';
import {
  ShieldCheck,
  BrainCircuit,
  Building2,
  Radio,
  FileText,
  Bookmark,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Company, Signal, PreBuyResult } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface InvestigateModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  signals: Signal[];
  onOpenGate: (symbol: string) => void;
  onRunSimulation: (scenario: string) => void;
  onCreateThesis: (symbol: string) => void;
  onAddToWatchlist: (symbol: string) => void;
}

export const InvestigateModal: React.FC<InvestigateModalProps> = ({
  isOpen,
  onClose,
  company,
  signals,
  onOpenGate,
  onRunSimulation,
  onCreateThesis,
  onAddToWatchlist,
}) => {
  const relatedSignals = signals.filter((s) => s.nse_symbol === company.nse_symbol);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold">
            {company.nse_symbol.substring(0, 2)}
          </div>
          <div>
            <span className="text-sm font-bold text-[#F3F4F6] font-display">
              Research {company.company_name} ({company.nse_symbol})
            </span>
            <span className="text-[10px] text-[#6B7280] font-mono block">
              Company Overview & Financial Checks • {company.sector}
            </span>
          </div>
        </div>
      }
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs font-sans">
        {/* Quick Fundamental Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-2.5 rounded-xl bg-[#161F30] border border-[#1F293D]">
            <span className="text-[10px] text-[#6B7280] font-mono block">Current Price</span>
            <span className="text-sm font-bold font-mono text-[#F3F4F6]">
              ₹{company.current_price.toLocaleString('en-IN')}
            </span>
            <span className={`text-[10px] font-mono font-bold block ${company.price_change_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {company.price_change_pct >= 0 ? '+' : ''}{company.price_change_pct}% Today
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161F30] border border-[#1F293D]">
            <span className="text-[10px] text-[#6B7280] font-mono block">Return on Capital (RoCE)</span>
            <span className="text-sm font-bold font-mono text-emerald-400">{company.roce}%</span>
            <span className="text-[10px] text-[#9CA3AF] font-mono block">P/E: {company.pe_ratio}x</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161F30] border border-[#1F293D]">
            <span className="text-[10px] text-[#6B7280] font-mono block">Debt / Equity</span>
            <span className="text-sm font-bold font-mono text-[#F3F4F6]">{company.de_ratio}x</span>
            <span className="text-[10px] text-[#9CA3AF] font-mono block">Pledge: {company.promoter_pledge_pct}%</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161F30] border border-[#1F293D]">
            <span className="text-[10px] text-[#6B7280] font-mono block">Quality Check</span>
            <Badge variant={company.prebuy_verdict === 'PASS' ? 'emerald' : 'amber'} size="sm" dot>
              {company.prebuy_verdict === 'PASS' ? 'PASSED' : company.prebuy_verdict === 'INVESTIGATE' ? 'CHECK' : 'RISK'}
            </Badge>
            <span className="text-[10px] text-[#6B7280] font-mono block mt-0.5">Score: {company.signal_edge_score}/100</span>
          </div>
        </div>

        {/* Business Summary */}
        <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D] space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-[#6B7280] block">
            Business Summary & Competitive Strength
          </span>
          <p className="text-xs text-[#D1D5DB] leading-relaxed">
            {company.business_summary}
          </p>
          <div className="pt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Main Growth Driver: {company.key_catalyst}</span>
          </div>
        </div>

        {/* Detected Intelligence Signals for this Company */}
        <div>
          <span className="text-[11px] uppercase font-mono font-bold text-[#9CA3AF] block mb-2">
            Active Market Signals ({relatedSignals.length})
          </span>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {relatedSignals.length === 0 ? (
              <div className="p-3 rounded-lg bg-[#161F30] text-center text-[#6B7280]">
                No pending signals for this company.
              </div>
            ) : (
              relatedSignals.map((sig) => (
                <div
                  key={sig.signal_id}
                  className="p-3 rounded-xl bg-[#161F30] border border-[#1F293D] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="teal" size="sm">
                      {sig.signal_type.replace('_', ' ')}
                    </Badge>
                    <span className="text-[10px] text-[#6B7280] font-mono">
                      Lead Time: ~{sig.lead_time_days}d • Confidence: {sig.confidence_score}%
                    </span>
                  </div>
                  <h4 className="font-bold text-[#F3F4F6] text-xs">{sig.signal_title}</h4>
                  <p className="text-[11px] text-[#9CA3AF] line-clamp-2">{sig.signal_summary}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Next Investigation Actions */}
        <div className="pt-3 border-t border-[#1F293D] flex flex-wrap gap-2 justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onAddToWatchlist(company.nse_symbol);
              }}
            >
              <Bookmark className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Watchlist
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                onClose();
                onOpenGate(company.nse_symbol);
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Before You Invest Check
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onClose();
                onRunSimulation(`Macroeconomic scenario impact on ${company.company_name} (${company.nse_symbol})`);
              }}
            >
              <BrainCircuit className="w-3.5 h-3.5 mr-1 text-purple-400" /> Test Scenario
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                onClose();
                onCreateThesis(company.nse_symbol);
              }}
            >
              Create Investment View <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
