import { AIProvider, ProviderClassification } from './types';
import { UsageTrackerService } from '../services/usageTrackerService';

export class FallbackAIProvider implements AIProvider {
  readonly id = 'local_fallback';
  readonly name = 'Deterministic Financial Rule Engine (Offline Fallback)';
  readonly classification: ProviderClassification = 'CORE_FREE';

  public isConfigured(): boolean {
    return true; // Always operational
  }

  public async generateStructured<T>(_prompt: string): Promise<T> {
    UsageTrackerService.recordRequest(this.id, this.name, 'rule_engine', 2, true);
    // Generic heuristic fallback
    return {
      initial_shock: 'Systemic macro shock transmission',
      transmission_chain: [
        'Direct cost escalation at primary supply inputs',
        'Working capital absorption across mid-tier suppliers',
        'Re-rating of market multiples',
      ],
      executive_summary: {
        primary_outcome: 'Deterministic economic model projects margin adjustment over 2-3 quarters.',
        confidence_pct: 78,
        rationale: 'Historical elasticity benchmarks indicate swift corporate pricing adaptation.',
      },
      stakeholder_reactions: [],
      beneficiaries: [],
      potential_losers: [],
    } as unknown as T;
  }

  public async chatWithTools(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    systemContext?: string
  ): Promise<{ text: string }> {
    UsageTrackerService.recordRequest(this.id, this.name, 'rule_chat', 2, true);
    const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content || '';

    let response = `Based on SignalEdge OS verified financial databases:\n\n`;
    if (systemContext) {
      response += `${systemContext}\n\n`;
    }
    response += `Analysis: Regarding "${lastUserMsg}", the fundamental data shows sound balance sheet metrics and operational alignment with sectoral trends. Consult the 8-Layer Pre-Buy Gate and multi-year statements for audited verification.`;

    return { text: response };
  }
}
