import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { User, InvestorRole } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export interface OnboardingFlowProps {
  onComplete: (profileData: Partial<User>) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [role, setRole] = useState<InvestorRole>('RETAIL_INVESTOR');
  const [horizon, setHorizon] = useState('7-15YR');
  const [risk, setRisk] = useState('MODERATE_AGGRESSIVE');
  const [sectors, setSectors] = useState<string[]>([
    'Automotive',
    'Defense & Aerospace',
    'Renewable Energy',
  ]);

  const availableSectors = [
    'Automotive',
    'Defense & Aerospace',
    'Renewable Energy',
    'Specialty Chemicals',
    'Capital Goods & Infrastructure',
    'Information Technology',
    'Banking & Financials',
    'Pharma & Healthcare',
  ];

  const toggleSector = (sec: string) => {
    if (sectors.includes(sec)) {
      setSectors(sectors.filter((s) => s !== sec));
    } else {
      setSectors([...sectors, sec]);
    }
  };

  const handleFinish = () => {
    onComplete({
      role,
      investment_horizon: horizon,
      risk_tolerance: risk,
      sectors_of_interest: sectors,
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#E5E7EB] flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#F3F4F6] font-display">
            Personalize Your Intelligence Desk
          </h1>
          <p className="text-xs text-[#9CA3AF]">
            Configure your risk constraints, circle of competence, and investment horizon.
          </p>
        </div>

        <Card variant="elevated" className="space-y-5 text-xs">
          <div>
            <label className="font-semibold text-[#F3F4F6] block mb-2">Investor Classification</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'RETAIL_INVESTOR' as InvestorRole, label: 'Individual Investor' },
                { id: 'FAMILY_OFFICE' as InvestorRole, label: 'Family Office / HNI' },
                { id: 'RESEARCH_ANALYST' as InvestorRole, label: 'Research Analyst' },
                { id: 'HNI' as InvestorRole, label: 'Portfolio Manager' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    role === item.id
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold'
                      : 'bg-[#161F30] border-[#1F293D] text-[#9CA3AF]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-[#F3F4F6] block mb-2">Sectors of Focus</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableSectors.map((sec) => {
                const isSelected = sectors.includes(sec);
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => toggleSector(sec)}
                    className={`p-2 rounded-lg border text-left text-[11px] transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold'
                        : 'bg-[#161F30] border-[#1F293D] text-[#9CA3AF]'
                    }`}
                  >
                    <span className="truncate">{sec}</span>
                    {isSelected && <Check className="w-3 h-3 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#1F293D] flex justify-end">
            <Button size="md" onClick={handleFinish}>
              Enter SignalEdge OS <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
