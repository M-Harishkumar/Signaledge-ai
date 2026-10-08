import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { PreBuyResult } from '../../types';
import { api } from '../../services/api';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface PreBuyCheckModalProps {
  symbol: string;
  onClose: () => void;
  onRunSimulation?: (scenario: string) => void;
}

export const PreBuyCheckModal: React.FC<PreBuyCheckModalProps> = ({
  symbol,
  onClose,
  onRunSimulation,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<PreBuyResult | null>(null);
  const [userThesis, setUserThesis] = useState<string>('');

  const loadAudit = async (thesis?: string) => {
    setLoading(true);
    try {
      const res = await api.runPreBuyCheck(symbol, thesis);
      setResult(res);
    } catch (e) {
      console.error('Failed to run Pre-Buy Gate Check:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudit();
  }, [symbol]);

  const handleRerun = (e: React.FormEvent) => {
    e.preventDefault();
    loadAudit(userThesis);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#F3F4F6] font-display">
              Before You Invest: 8-Point Company Quality Check — {symbol.toUpperCase()}
            </span>
            <span className="text-[10px] text-[#6B7280] font-mono block">
              Financial Health, Debt Levels, Profit Quality & Business Durability
            </span>
          </div>
        </div>
      }
      maxWidth="lg"
    >
      <div className="space-y-5 text-xs font-sans">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#9CA3AF] font-mono">
              Running 8-point financial quality check for {symbol}...
            </p>
          </div>
        ) : result ? (
          <>
            {/* Top Score Banner */}
            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                result.verdict_color === 'GREEN'
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : result.verdict_color === 'AMBER'
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-rose-950/20 border-rose-500/40'
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#9CA3AF] block">
                  Overall Check Verdict
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-lg font-bold text-[#F3F4F6] font-display">
                    {result.verdict}
                  </span>
                  <Badge
                    variant={
                      result.verdict_color === 'GREEN'
                        ? 'emerald'
                        : result.verdict_color === 'AMBER'
                        ? 'amber'
                        : 'rose'
                    }
                    size="md"
                    dot
                  >
                    {result.total_score}/{result.max_score} Passed
                  </Badge>
                </div>
                <p className="text-[11px] text-[#9CA3AF] mt-1">
                  {result.total_score >= 7
                    ? 'All critical capital efficiency and financial health checks passed.'
                    : `${8 - result.total_score} checks require closer attention before investing.`}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-[#6B7280] font-mono block">Audited On</span>
                <span className="text-xs font-mono font-bold text-[#F3F4F6]">{result.analysis_date}</span>
                <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
                  Auto-populated: {result.auto_populate_rate}%
                </span>
              </div>
            </div>

            {/* Layer by Layer Breakdown */}
            <div className="space-y-2.5">
              <span className="text-[11px] uppercase font-mono font-bold text-[#9CA3AF] block">
                8-Point Company Quality Checklist
              </span>

              {Object.entries(result.layer_scores).map(([key, layer]) => {
                const isPass = layer.status === 'PASS';
                const isUnknown = layer.status === 'UNKNOWN';
                return (
                  <div
                    key={key}
                    className="p-3 rounded-xl bg-[#161F30] border border-[#1F293D] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isPass ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : isUnknown ? (
                          <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="font-bold text-[#F3F4F6] text-xs">{layer.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-[#9CA3AF]">
                          Current: <strong className="text-white">{layer.actual_value}</strong> (Safe Standard: {layer.threshold})
                        </span>
                        <Badge
                          variant={isPass ? 'emerald' : isUnknown ? 'blue' : 'rose'}
                          size="sm"
                        >
                          {isPass ? 'PASSED' : isUnknown ? 'CHECK' : 'FAILED'}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#9CA3AF] pl-6">{layer.explanation}</p>

                    <div className="pl-6 pt-1 flex flex-wrap justify-between text-[10px] font-mono text-[#6B7280]">
                      <span>Calculation: {layer.formula}</span>
                      <span>Source: {layer.source}</span>
                    </div>

                    {!isPass && !isUnknown && (
                      <div className="pl-6 text-[10px] text-rose-400 font-mono">
                        Why this is a risk: {layer.risk_if_failed}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Anti-Fraud Forensic Summary */}
            <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#1F293D] space-y-2">
              <span className="text-[11px] uppercase font-mono font-bold text-[#6B7280] block">
                Financial Warning Signs & Risk Flags
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.fraud_checklist_detected.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-lg bg-[#161F30] border border-[#1F293D] flex items-center justify-between text-[11px]"
                  >
                    <span className="text-[#D1D5DB]">{item.name}</span>
                    <Badge variant={item.status === 'PASS' ? 'emerald' : 'rose'} size="sm">
                      {item.status === 'PASS' ? 'PASSED' : 'FLAGGED'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Thesis Input */}
            <form onSubmit={handleRerun} className="p-3 rounded-xl bg-[#161F30] border border-[#1F293D] space-y-2">
              <label className="font-semibold text-[#F3F4F6] block text-[11px]">
                Test Your Investment Idea Against These Checks
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userThesis}
                  onChange={(e) => setUserThesis(e.target.value)}
                  placeholder="E.g. Expecting 25% revenue growth from new factory capacity..."
                  className="flex-1 bg-[#0B0F17] border border-[#1F293D] rounded-lg px-2.5 py-1.5 text-xs text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none"
                />
                <Button type="submit" size="sm" variant="outline">
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Re-Check
                </Button>
              </div>
            </form>

            {/* Action Bar */}
            <div className="pt-2 border-t border-[#1F293D] flex items-center justify-between">
              <span className="text-[10px] text-[#6B7280] font-mono">Independent Research Checklist</span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Close
                </Button>
                {onRunSimulation && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      onClose();
                      onRunSimulation(`Scenario stress-test for ${symbol} based on Pre-Buy Gate findings`);
                    }}
                  >
                    Test Scenario <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
};
