import React from 'react';
import {
  ShieldCheck,
  BrainCircuit,
  Binary,
  Radio,
  Building2,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export interface LandingPageProps {
  onStart: () => void;
  onLogIn: () => void;
  onViewLiveSignals: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onLogIn,
  onViewLiveSignals,
}) => {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#E5E7EB] selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <nav className="border-b border-[#1F293D] px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold text-[#F3F4F6] font-display">SignalEdge OS</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#1E293B] text-[#9CA3AF] rounded">
              Institutional
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogIn}
            className="text-xs font-semibold text-[#9CA3AF] hover:text-white transition cursor-pointer px-3 py-1.5"
          >
            Sign In
          </button>
          <Button size="sm" onClick={onStart}>
            Launch Workstation <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Automated Pre-Recognition Intelligence for Indian Equities</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F3F4F6] font-display tracking-tight leading-tight">
          Detect Structural Equity Catalysts{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Before Consensus Re-rating
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#9CA3AF] max-w-3xl mx-auto leading-relaxed">
          Continuous synthesis across port logistics dwell times, gazette ministry notifications, management concall nuances, and multi-agent scenario simulations across 800+ NSE/BSE listed companies.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button size="lg" onClick={onStart} className="w-full sm:w-auto">
            Launch Workstation <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
          <Button size="lg" variant="secondary" onClick={onViewLiveSignals} className="w-full sm:w-auto">
            <Radio className="w-4 h-4 mr-1.5 text-emerald-400" /> View Live Morning Brief
          </Button>
        </div>

        <div className="pt-8 flex items-center justify-center gap-6 text-xs text-[#6B7280] font-mono flex-wrap">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> SEBI Compliance Guardrails
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4 text-purple-400" /> Multi-Persona Institutional Cluster Simulation
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-teal-400" /> Local Session Privacy Lock
          </span>
        </div>
      </section>

      {/* Core Intelligence Pillar Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F3F4F6] font-display">Daily Pre-Recognition Brief</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Delivered daily at 07:01 IST. Filtered non-obvious catalysts with 30-120 day lead time before market consensus catches up.
            </p>
          </Card>

          <Card variant="elevated" className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F3F4F6] font-display">500-Persona Multi-Agent Swarm</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Simulates market reactions of institutional FIIs, DII mutual funds, corporate CFOs, and regulatory bodies to test non-linear shocks.
            </p>
          </Card>

          <Card variant="elevated" className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F3F4F6] font-display">8-Layer Pre-Buy Gate Check</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Automated 90%+ pre-populated fundamental checklist enforcing circle of competence, balance sheet health, and fraud red flags.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1F293D] py-10 px-6 mt-16 text-center text-xs text-[#6B7280] space-y-3">
        <p className="max-w-3xl mx-auto leading-relaxed">
          SignalEdge OS is an automated research intelligence platform. Not a SEBI-registered advisory entity. Research intelligence is generated for analytical purposes. Indian equity investments are subject to market risks.
        </p>
        <p>© 2026 SignalEdge OS. All rights reserved.</p>
      </footer>
    </div>
  );
};
