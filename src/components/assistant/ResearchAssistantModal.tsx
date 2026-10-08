import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  Layers,
  FileText,
  ShieldCheck,
  TrendingUp,
  X,
  RefreshCw,
  Search,
  ExternalLink,
  ArrowRight,
  Sliders,
  Award,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  GroundedEvidenceCitation,
  InvestigationAction,
  AssistantChatMessage,
} from '../../types';

export interface ResearchAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSymbol?: string;
  onSelectCompany?: (symbol: string) => void;
  onOpenGate?: (symbol: string) => void;
  onOpenSimulation?: (symbol?: string) => void;
  onOpenScreener?: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolsCalled?: Array<{
    tool: string;
    parameters: any;
    result_summary: string;
    execution_status?: 'SUCCESS' | 'ERROR' | 'UNKNOWN';
  }>;
  citations?: GroundedEvidenceCitation[];
  investigationActions?: InvestigationAction[];
  qualityLabel?: 'FACT' | 'CALCULATED' | 'INFERENCE' | 'UNKNOWN';
  disclaimer?: string;
}

export const ResearchAssistantModal: React.FC<ResearchAssistantModalProps> = ({
  isOpen,
  onClose,
  activeSymbol = 'TATAMOTORS',
  onSelectCompany,
  onOpenGate,
  onOpenSimulation,
  onOpenScreener,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am your SignalEdge Research Assistant. I answer questions directly using verified company filings (NSE/BSE), audited financial statements, ROE breakdowns, and Before You Invest quality checks.\n\nWhat would you like to research about **${activeSymbol}** or the market?`,
      qualityLabel: 'FACT',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [liveStatus, setLiveStatus] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    `Why is ROE low or high for ${activeSymbol}? (ROE Breakdown)`,
    `Is ${activeSymbol} financially strong? (Financial Check)`,
    `Run Before You Invest check for ${activeSymbol}`,
    `What are the debt and balance sheet risks for ${activeSymbol}?`,
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (userPrompt?: string) => {
    const text = (userPrompt || inputValue).trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInputValue('');
    setLoading(true);
    setLiveStatus('Connecting to research engine...');

    try {
      const response = await api.chatWithAssistantStream(
        newMessages.map((m) => ({ role: m.role, content: m.content })),
        activeSymbol,
        (status) => {
          setLiveStatus(status.message);
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.answer,
          toolsCalled: response.tools_called,
          citations: response.evidence_citations,
          investigationActions: response.investigation_actions,
          qualityLabel: response.data_quality_label || 'FACT',
          disclaimer: response.disclaimer,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Unable to complete research query: ${err.message}. Please verify the symbol or try again.`,
          qualityLabel: 'UNKNOWN',
        },
      ]);
    } finally {
      setLoading(false);
      setLiveStatus('');
    }
  };

  const handleActionClick = (action: InvestigationAction) => {
    if (action.action_type === 'COMPANY_RESEARCH' && onSelectCompany && action.payload.symbol) {
      onSelectCompany(action.payload.symbol);
      onClose();
    } else if (action.action_type === 'PRE_BUY_GATE' && onOpenGate && action.payload.symbol) {
      onOpenGate(action.payload.symbol);
      onClose();
    } else if (action.action_type === 'SIMULATION' && onOpenSimulation) {
      onOpenSimulation(action.payload.symbol);
      onClose();
    } else if (action.action_type === 'SCREENER' && onOpenScreener) {
      onOpenScreener();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl h-[85vh] bg-[#0F172A] border border-[#1E293B] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-[#1E293B] bg-[#111C30]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white font-display">
                  SignalEdge Research Assistant
                </h2>
                <Badge variant="emerald" size="sm">
                  Real Data Grounded
                </Badge>
              </div>
              <p className="text-[11px] text-[#94A3B8] font-mono">
                Company: <span className="text-emerald-400 font-bold">{activeSymbol}</span> • Verified Official Filings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl p-4 space-y-3 ${
                  m.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-[#162238] border border-[#1E293B] text-[#E2E8F0] rounded-tl-none'
                }`}
              >
                {/* Tools executed & Quality classification header */}
                {m.role === 'assistant' && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1E293B]/60 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[#94A3B8] flex items-center gap-1">
                        <Layers className="w-3 h-3 text-emerald-400" /> Data Source:
                      </span>
                      {m.toolsCalled && m.toolsCalled.length > 0 ? (
                        m.toolsCalled.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded bg-[#0F172A] border border-[#1E293B] text-emerald-400 font-semibold"
                            title={t.result_summary}
                          >
                            {t.tool}()
                          </span>
                        ))
                      ) : (
                        <span className="text-[#64748B]">Official Company Data</span>
                      )}
                    </div>

                    {m.qualityLabel && (
                      <span
                        className={`px-2 py-0.5 rounded font-bold uppercase ${
                          m.qualityLabel === 'FACT'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : m.qualityLabel === 'CALCULATED'
                            ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
                            : m.qualityLabel === 'INFERENCE'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {m.qualityLabel === 'FACT' ? 'Verified Fact' : m.qualityLabel === 'CALCULATED' ? 'Calculated' : m.qualityLabel === 'INFERENCE' ? 'Estimate' : 'Unconfirmed'}
                      </span>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-line font-sans">
                  {m.content}
                </div>

                {/* Grounding Citations */}
                {m.citations && m.citations.length > 0 && (
                  <div className="pt-2 border-t border-[#1E293B]/60 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-[#94A3B8] block flex items-center gap-1">
                      <FileText className="w-3 h-3 text-emerald-400" /> Evidence & Source Documents:
                    </span>
                    {m.citations.map((c, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-2.5 rounded bg-[#0F172A] border border-[#1E293B] text-[11px] text-[#CBD5E1] space-y-1"
                      >
                        <div className="flex items-center justify-between text-[#94A3B8] font-mono text-[10px]">
                          <span className="font-bold text-[#E2E8F0]">{c.document_name}</span>
                          <span className="text-emerald-400">{c.date || 'Audited'}</span>
                        </div>
                        <p className="italic text-[#94A3B8] text-[11px]">"{c.excerpt}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Investigation Pathways / Action Buttons */}
                {m.investigationActions && m.investigationActions.length > 0 && (
                  <div className="pt-2 border-t border-[#1E293B]/60 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-[#94A3B8] block">
                      Recommended Next Steps:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {m.investigationActions.map((act) => (
                        <button
                          key={act.action_id}
                          type="button"
                          onClick={() => handleActionClick(act)}
                          className="p-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] hover:border-emerald-500/40 text-left transition flex items-center justify-between gap-2.5 group cursor-pointer min-w-0"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-xs text-[#F3F4F6] block group-hover:text-emerald-400 transition truncate">
                              {act.title}
                            </span>
                            <span className="text-[10px] text-[#94A3B8] block truncate font-sans">
                              {act.description}
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:translate-x-0.5 transition" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notice */}
                {m.role === 'assistant' && (
                  <div className="pt-1 text-[9px] text-[#64748B] font-mono border-t border-[#1E293B]/40">
                    SignalEdge OS • For research and educational purposes only • Not financial advice
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500 flex items-center justify-center text-emerald-300 shrink-0 mt-1">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-[#94A3B8] font-mono">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse shrink-0">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span className="text-emerald-400 font-mono tracking-tight">{liveStatus || 'Reviewing financial data & calculating key numbers...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 sm:px-6 py-2 border-t border-[#1E293B] bg-[#0B1322] flex gap-2 overflow-x-auto flex-nowrap scrollbar-none shrink-0">
          {quickPrompts.map((qp, qIdx) => (
            <button
              key={qIdx}
              type="button"
              onClick={() => handleSend(qp)}
              className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-[#162238] hover:bg-[#1E293B] border border-[#1E293B] hover:border-emerald-500/40 text-[#CBD5E1] hover:text-emerald-300 transition shrink-0 whitespace-nowrap cursor-pointer"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 px-4 sm:px-6 border-t border-[#1E293B] bg-[#111C30]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder={`Ask any question about ${activeSymbol} (e.g. "Why is ROE low?", "Is it financially strong?")...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-[#0A101D] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-emerald-500 transition font-sans min-w-0"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!inputValue.trim() || loading}
              className="px-4 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
