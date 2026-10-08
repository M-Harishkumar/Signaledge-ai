import { GoogleGenAI } from '@google/genai';
import { AIProvider, ProviderClassification } from './types';
import { config } from '../config';
import { UsageTrackerService } from '../services/usageTrackerService';

export class GeminiProvider implements AIProvider {
  readonly id = 'gemini';
  readonly name = 'Google Gemini API (gemini-2.5-flash)';
  readonly classification: ProviderClassification = 'CORE_FREE';

  private client: GoogleGenAI | null = null;

  constructor() {
    if (config.geminiApiKey) {
      try {
        this.client = new GoogleGenAI({ apiKey: config.geminiApiKey });
      } catch (err) {
        console.warn('Could not initialize GoogleGenAI client:', err);
      }
    }
  }

  public isConfigured(): boolean {
    return !!(this.client && config.geminiApiKey);
  }

  public async generateStructured<T>(prompt: string, systemInstruction?: string): Promise<T> {
    if (!this.client) {
      throw new Error('Gemini API is not configured. Missing GEMINI_API_KEY.');
    }

    const start = Date.now();
    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || 'You are an institutional financial analyst. Respond ONLY in valid JSON.',
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const duration = Date.now() - start;
      const text = response.text || '{}';
      UsageTrackerService.recordRequest(this.id, this.name, 'models/generateContent', duration, true);
      return JSON.parse(text) as T;
    } catch (err: any) {
      UsageTrackerService.recordRequest(this.id, this.name, 'models/generateContent', Date.now() - start, false, err.message);
      throw err;
    }
  }

  public async chatWithTools(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    systemContext?: string
  ): Promise<{ text: string; toolCalls?: Array<{ name: string; args: any }> }> {
    if (!this.client) {
      throw new Error('Gemini API is not configured.');
    }

    const start = Date.now();
    try {
      const conversationText = messages
        .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n\n');

      const fullPrompt = `${systemContext ? `SYSTEM CONTEXT & GROUNDED DATA:\n${systemContext}\n\n` : ''}CONVERSATION HISTORY:\n${conversationText}\n\nASSISTANT:`;

      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          temperature: 0.3,
        },
      });

      const duration = Date.now() - start;
      UsageTrackerService.recordRequest(this.id, this.name, 'models/chat', duration, true);
      return { text: response.text || '' };
    } catch (err: any) {
      UsageTrackerService.recordRequest(this.id, this.name, 'models/chat', Date.now() - start, false, err.message);
      throw err;
    }
  }
}
