import { AIProvider } from './types';
import { GeminiProvider } from './geminiProvider';
import { FallbackAIProvider } from './fallbackAIProvider';

export class AIProviderRegistry {
  private static geminiProvider = new GeminiProvider();
  private static fallbackProvider = new FallbackAIProvider();

  public static getActiveProvider(): AIProvider {
    if (this.geminiProvider.isConfigured()) {
      return this.geminiProvider;
    }
    return this.fallbackProvider;
  }

  public static getProviderStatusList() {
    return [
      {
        id: this.geminiProvider.id,
        name: this.geminiProvider.name,
        isConfigured: this.geminiProvider.isConfigured(),
        isActive: this.geminiProvider.isConfigured(),
        classification: this.geminiProvider.classification,
      },
      {
        id: this.fallbackProvider.id,
        name: this.fallbackProvider.name,
        isConfigured: true,
        isActive: !this.geminiProvider.isConfigured(),
        classification: this.fallbackProvider.classification,
      },
    ];
  }
}
