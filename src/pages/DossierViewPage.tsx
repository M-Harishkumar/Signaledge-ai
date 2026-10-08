import React from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  BrainCircuit,
  Building2,
  TrendingUp,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Signal } from '../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';

export interface DossierViewPageProps {
  signal: Signal;
  onBack: () => void;
  onSelectCompany: (symbol: string) => void;
  onRunSimulation: (scenario: string) => void;
  onRunPreBuy: (symbol: string) => void;
}

export const DossierViewPage: React.FC<DossierViewPageProps> = ({
  signal,
  onBack,
  onSelectCompany,
  onRunSimulation,
  onRunPreBuy,
}) => {
  return (
    <div className="space-y-6">
      {/* Back button and Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#111827] border border-[#1F293D]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Market Signals
        </button>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => onRunPreBuy(signal.nse_symbol)}>
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Before You Invest Check
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onRunSimulation(`Scenario simulation for catalyst: "${signal.signal_title}" involving ${signal.nse_symbol}`)}
          >
            <BrainCircuit className="w-3.5 h-3.5 mr-1" /> Run Scenario Test
          </Button>
        </div>
      </div>

      {/* Main Dossier Header */}
      <Card variant="elevated">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={
                    signal.confidence_label === 'FACT'
                      ? 'teal'
                      : signal.confidence_label === 'HIGH_CONF'
                      ? 'emerald'
                      : 'amber'
                  }
                  size="md"
                  dot
                >
                  {signal.confidence_label === 'FACT' ? 'Verified Fact' : signal.confidence_label === 'HIGH_CONF' ? 'High Confidence' : 'Calculated'} • {signal.confidence_score}% Confidence
                </Badge>
                <Badge variant="slate" size="md">
                  {signal.signal_type.replace('_', ' ')}
                </Badge>
                <span className="font-mono text-xs text-[#6B7280]">
                  Timeframe: {signal.impact_horizon}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#F3F4F6] font-display break-words">
                {signal.signal_title}
              </h1>
              <p className="text-xs text-[#9CA3AF] max-w-3xl leading-relaxed break-words">
                {signal.signal_summary}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F293D] text-right shrink-0">
              <span className="text-[10px] text-[#6B7280] font-mono block">Main Company</span>
              <span
                onClick={() => onSelectCompany(signal.nse_symbol)}
                className="font-mono text-base font-bold text-emerald-400 hover:underline cursor-pointer block"
              >
                {signal.nse_symbol}
              </span>
              <span className="text-[11px] text-[#9CA3AF]">{signal.company_name}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Causal Transmission Chain Section */}
      {signal.causal_chain && signal.causal_chain.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>How This News / Signal Affects the Business</CardTitle>
            <CardDescription>Step-by-step explanation from event to profit impact</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            {signal.causal_chain.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#1F293D] flex items-start gap-3 text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <span className="font-semibold text-[#F3F4F6] font-mono">Step {idx + 1}</span>
                  <p className="text-[#D1D5DB] leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Beneficiaries & Risks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Beneficiaries */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Companies That Benefit</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {signal.beneficiary_companies && signal.beneficiary_companies.length > 0 ? (
              signal.beneficiary_companies.map((ben) => (
                <div
                  key={ben.nse_symbol}
                  onClick={() => onSelectCompany(ben.nse_symbol)}
                  className="p-3.5 rounded-xl bg-[#0B0F17] hover:bg-[#161F30] border border-[#1F293D] transition cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400">{ben.nse_symbol}</span>
                      <span className="text-[#9CA3AF]">{ben.company_name}</span>
                    </div>
                    <p className="text-[11px] text-[#D1D5DB] mt-1">{ben.gain_mechanism}</p>
                  </div>
                  <Badge variant="emerald" size="sm">
                    +{ben.alpha_potential_pct}% Expected Upside
                  </Badge>
                </div>
              ))
            ) : (
              <div
                onClick={() => onSelectCompany(signal.nse_symbol)}
                className="p-3.5 rounded-xl bg-[#0B0F17] hover:bg-[#161F30] border border-[#1F293D] transition cursor-pointer flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-emerald-400">{signal.nse_symbol}</span>
                  <span className="text-[#9CA3AF] ml-2">{signal.company_name}</span>
                </div>
                <Badge variant="emerald" size="sm">Directly Affected Company</Badge>
              </div>
            )}
          </div>
        </Card>

        {/* Key Thesis Risks */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>What Could Prove This Wrong? (Key Risks)</CardTitle>
          </CardHeader>
          <div className="space-y-2 text-xs">
            {signal.key_risks && signal.key_risks.length > 0 ? (
              signal.key_risks.map((risk, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D] text-[#D1D5DB] flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{risk}</span>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1F293D] text-[#9CA3AF]">
                Macroeconomic interest rate fluctuations and general equity multiple compression.
              </div>
            )}
          </div>
        </Card>
      </div>

      <DisclaimerBanner />
    </div>
  );
};
