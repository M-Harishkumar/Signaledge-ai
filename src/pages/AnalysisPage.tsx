import React, { useState } from 'react';
import {
  Binary,
  Play,
  Share2,
  FileSpreadsheet,
  Building2,
  CheckCircle2,
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { GeoMacroReport, GeoMacroStage } from '../types';
import { api } from '../services/api';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';

export interface AnalysisPageProps {
  onSelectCompany: (symbol: string) => void;
  onRunSimulation: (scenario: string) => void;
  onInvestigate?: (symbol: string) => void;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({
  onSelectCompany,
  onRunSimulation,
  onInvestigate,
}) => {
  const [eventInput, setEventInput] = useState<string>(
    'OPEC+ announces an unannounced 1.2M bpd voluntary crude production cut amidst Middle Eastern shipping insurance escalation.'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<GeoMacroReport | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventInput.trim()) return;
    setLoading(true);
    try {
      const res = await api.runGeoMacroAnalysis(eventInput);
      setReport(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F293D]">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="p-1 rounded bg-teal-500/10 text-teal-400">
            <Binary className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold uppercase text-teal-400 tracking-wider">
            Step-by-Step Economic Impact Flow
          </span>
          <Badge variant="teal" size="sm">
            6 Step Analysis
          </Badge>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#F3F4F6] tracking-tight font-display">
          Global & Economic Event Analyzer
        </h1>
        <p className="text-xs text-[#9CA3AF] mt-1 max-w-2xl leading-relaxed">
          Breaks down major global and economic news into clear, step-by-step impacts on Indian industries and stocks with clear confidence ratings.
        </p>
      </div>

      {/* Input Event Form */}
      <Card variant="elevated">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#F3F4F6] block mb-1">
              Event Description or News Headline
            </label>
            <textarea
              rows={3}
              value={eventInput}
              onChange={(e) => setEventInput(e.target.value)}
              placeholder="Paste geopolitical announcement, central bank rate decision, or tariff policy..."
              className="w-full bg-[#161F30] border border-[#1F293D] rounded-xl p-3 text-xs text-[#E5E7EB] focus:outline-none focus:border-teal-500/50 font-sans leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1F293D] flex-wrap gap-2">
            <span className="text-xs text-[#6B7280] font-mono">
              6-Step Flow Analysis
            </span>

            <Button type="submit" size="md" isLoading={loading}>
              <Play className="w-3.5 h-3.5 mr-1" /> Analyze Step-by-Step Impact
            </Button>
          </div>
        </form>
      </Card>

      {/* Report Output */}
      {report && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-[#9CA3AF]">
              Impact Breakdown ({report.stages?.length || 6} Steps)
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRunSimulation(`Simulate scenario from macro event: ${report.event_text}`)}
            >
              <BrainCircuit className="w-3.5 h-3.5 mr-1" /> Test Across Investor Views
            </Button>
          </div>

          <div className="space-y-4">
            {report.stages?.map((stage) => (
              <Card key={stage.stage_num} variant="elevated">
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 text-xs font-mono font-bold">
                      Step {stage.stage_num}
                    </span>
                    <h3 className="text-sm font-bold text-[#F3F4F6] font-display">{stage.stage_name}</h3>
                  </div>

                  <Badge
                    variant={
                      stage.confidence === 'FACT'
                        ? 'teal'
                        : stage.confidence === 'INFERENCE'
                        ? 'blue'
                        : 'amber'
                    }
                    size="sm"
                  >
                    {stage.confidence === 'FACT' ? 'Verified Fact' : stage.confidence === 'INFERENCE' ? 'Calculated' : 'Estimate'}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-[#D1D5DB] leading-relaxed font-sans">
                  <div>
                    <span className="font-mono text-[10px] text-[#6B7280] uppercase block">Event Trigger</span>
                    <p className="text-[#9CA3AF]">{stage.input || stage.input_event}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-teal-400 uppercase block">What Happens Next</span>
                    <p className="text-[#F3F4F6]">{stage.transmission_mechanism || stage.transmitted_effect}</p>
                  </div>
                  {stage.next_cascade_target && (
                    <div className="p-2.5 rounded-lg bg-[#0B0F17] border border-[#1F293D] font-mono text-[11px] text-[#9CA3AF]">
                      <span className="text-emerald-400 font-bold">Next Effect &rarr; </span>
                      {stage.next_cascade_target}
                    </div>
                  )}

                  {(stage.affected_companies || stage.affected_entities) && ((stage.affected_companies?.length ?? 0) > 0 || (stage.affected_entities?.length ?? 0) > 0) && (
                    <div className="pt-2 border-t border-[#1F293D] flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-[#6B7280]">Affected Companies:</span>
                      {(stage.affected_companies || stage.affected_entities || []).map((sym: string) => (
                        <div key={sym} className="flex items-center gap-1">
                          <button
                            onClick={() => onSelectCompany(sym)}
                            className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold hover:underline cursor-pointer text-xs"
                          >
                            {sym}
                          </button>
                          {onInvestigate && (
                            <button
                              onClick={() => onInvestigate(sym)}
                              className="text-[9px] font-mono text-[#9CA3AF] hover:text-emerald-300"
                            >
                              [research]
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
};
