import React, { useState } from 'react';
import { Sparkles, X, Plus, Trash2, ArrowRight } from 'lucide-react';
import { ResearchThesis, ScenarioCase, Company, Signal } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export interface ThesisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (thesisData: Omit<ResearchThesis, 'thesis_id' | 'created_at' | 'updated_at' | 'user_id'>) => void;
  initialCompany?: string;
  initialSignalId?: string;
  companies: Company[];
  signals: Signal[];
}

export const ThesisModal: React.FC<ThesisModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCompany = 'TATAMOTORS',
  initialSignalId,
  companies,
  signals,
}) => {
  const [title, setTitle] = useState('Domestic Electric Mobility Value Chain Acceleration');
  const [hypothesis, setHypothesis] = useState(
    'Demerger of commercial and passenger vehicle units unlocks balance sheet agility while domestic EV penetration expands.'
  );
  const [primarySymbol, setPrimarySymbol] = useState(initialCompany);
  const [sector, setSector] = useState(
    companies.find((c) => c.nse_symbol === initialCompany)?.sector || 'Automotive'
  );
  const [invalidationTriggers, setInvalidationTriggers] = useState<string[]>([
    'Operating cash flow to PAT divergence exceeding 2 quarters',
    'Promoter pledge increases above 5%',
  ]);
  const [newTrigger, setNewTrigger] = useState('');

  // Bull Case
  const [bullProb, setBullProb] = useState(35);
  const [bullImpact, setBullImpact] = useState('+40% multiple re-rating');

  // Base Case
  const [baseProb, setBaseProb] = useState(50);
  const [baseImpact, setBaseImpact] = useState('+20% earnings-led growth');

  // Bear Case
  const [bearProb, setBearProb] = useState(15);
  const [bearImpact, setBearImpact] = useState('-15% multiple derating');

  const handleAddTrigger = () => {
    if (newTrigger.trim()) {
      setInvalidationTriggers([...invalidationTriggers, newTrigger.trim()]);
      setNewTrigger('');
    }
  };

  const handleRemoveTrigger = (idx: number) => {
    setInvalidationTriggers(invalidationTriggers.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bull_scenario: ScenarioCase = {
      name: 'Bull Case',
      description: 'Accelerated domestic execution and multiple expansion.',
      key_assumptions: ['Macro tailwinds sustain', 'No regulatory tariff penalties'],
      target_probability_pct: bullProb,
      catalyst_triggers: ['Q-on-Q margin expansion'],
      potential_impact: bullImpact,
    };

    const base_scenario: ScenarioCase = {
      name: 'Base Case',
      description: 'Steady compounder execution in line with GDP growth.',
      key_assumptions: ['Stable input costs'],
      target_probability_pct: baseProb,
      catalyst_triggers: ['Delivery on capex guidance'],
      potential_impact: baseImpact,
    };

    const bear_scenario: ScenarioCase = {
      name: 'Bear Case',
      description: 'Input cost spikes and margin compression.',
      key_assumptions: ['Slowing consumer demand'],
      target_probability_pct: bearProb,
      catalyst_triggers: ['Policy delays / commodity spikes'],
      potential_impact: bearImpact,
    };

    onSave({
      title,
      hypothesis,
      sector,
      primary_symbol: primarySymbol,
      related_symbols: [],
      supporting_signals: initialSignalId ? [initialSignalId] : [],
      supporting_evidence: [],
      contradicting_evidence: [],
      risks: ['Commodity price inflation', 'Regulatory shift'],
      invalidation_triggers: invalidationTriggers,
      bull_scenario,
      base_scenario,
      bear_scenario,
      status: 'INVESTIGATING',
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-sm font-bold text-[#F3F4F6] font-display">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Create Investment View</span>
        </div>
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div>
          <label className="font-semibold text-[#F3F4F6] block mb-1">Investment View Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#161F30] border border-[#1F293D] rounded-xl p-2.5 text-[#E5E7EB] focus:outline-none focus:border-emerald-500/50"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-[#F3F4F6] block mb-1">Main Stock</label>
            <select
              value={primarySymbol}
              onChange={(e) => {
                setPrimarySymbol(e.target.value);
                const c = companies.find((comp) => comp.nse_symbol === e.target.value);
                if (c) setSector(c.sector);
              }}
              className="w-full bg-[#161F30] border border-[#1F293D] rounded-xl p-2.5 text-[#E5E7EB] focus:outline-none font-mono"
            >
              {companies.map((c) => (
                <option key={c.nse_symbol} value={c.nse_symbol}>
                  {c.nse_symbol} - {c.company_name} ({c.sector})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-[#F3F4F6] block mb-1">Sector / Industry</label>
            <input
              type="text"
              value={sector}
              readOnly
              className="w-full bg-[#111827] border border-[#1F293D] rounded-xl p-2.5 text-[#9CA3AF] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-[#F3F4F6] block mb-1">Core Investment Reason</label>
          <textarea
            rows={2}
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            placeholder="Explain why you believe this is a good opportunity and what will drive growth..."
            className="w-full bg-[#161F30] border border-[#1F293D] rounded-xl p-2.5 text-[#E5E7EB] focus:outline-none focus:border-emerald-500/50 font-sans"
            required
          />
        </div>

        {/* Bull / Base / Bear Scenarios Grid */}
        <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#1F293D] space-y-2.5">
          <span className="text-[11px] uppercase font-mono font-bold text-emerald-400 block">
            Expected Scenarios (Best / Base / Worst Case)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-[#161F30] border border-[#1F293D] space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 block font-mono">Best Case ({bullProb}%)</span>
              <input
                type="text"
                value={bullImpact}
                onChange={(e) => setBullImpact(e.target.value)}
                className="w-full bg-[#0B0F17] border border-[#1F293D] rounded px-2 py-1 text-[11px] text-[#E5E7EB]"
              />
            </div>
            <div className="p-2.5 rounded-lg bg-[#161F30] border border-[#1F293D] space-y-1">
              <span className="text-[10px] font-bold text-teal-400 block font-mono">Base Case ({baseProb}%)</span>
              <input
                type="text"
                value={baseImpact}
                onChange={(e) => setBaseImpact(e.target.value)}
                className="w-full bg-[#0B0F17] border border-[#1F293D] rounded px-2 py-1 text-[11px] text-[#E5E7EB]"
              />
            </div>
            <div className="p-2.5 rounded-lg bg-[#161F30] border border-[#1F293D] space-y-1">
              <span className="text-[10px] font-bold text-rose-400 block font-mono">Worst Case ({bearProb}%)</span>
              <input
                type="text"
                value={bearImpact}
                onChange={(e) => setBearImpact(e.target.value)}
                className="w-full bg-[#0B0F17] border border-[#1F293D] rounded px-2 py-1 text-[11px] text-[#E5E7EB]"
              />
            </div>
          </div>
        </div>

        {/* Invalidation Triggers */}
        <div>
          <label className="font-semibold text-[#F3F4F6] block mb-1">
            "What Could Prove This Wrong?" (Key Risks & Warning Signs)
          </label>
          <div className="space-y-1.5 mb-2">
            {invalidationTriggers.map((trig, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#161F30] border border-[#1F293D]">
                <span className="text-[11px] text-[#D1D5DB]">• {trig}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTrigger(idx)}
                  className="text-[#9CA3AF] hover:text-rose-400 cursor-pointer p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTrigger}
              onChange={(e) => setNewTrigger(e.target.value)}
              placeholder="E.g. Raw material steel price spikes > 25%..."
              className="flex-1 bg-[#161F30] border border-[#1F293D] rounded-lg px-2.5 py-1.5 text-xs text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none"
            />
            <Button type="button" size="sm" variant="outline" onClick={handleAddTrigger}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Risk / Warning Sign
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#1F293D]">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm">
            Save Investment View <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </form>
    </Modal>
  );
};
