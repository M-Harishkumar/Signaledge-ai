import { FinancialDataProvider, LiveMarketQuote, ProviderMetadata } from './types';
import { YahooFinanceProvider } from './yahooFinanceProvider';
import { AlphaVantageProvider } from './alphaVantageProvider';
import { OfficialFilingProvider } from './officialFilingProvider';
import { Company, DetailedFinancialStatement } from '../../src/types';
import { CacheService } from '../services/cacheService';

export class FinancialProviderRegistry {
  private static providers: FinancialDataProvider[] = [
    new YahooFinanceProvider(),
    new AlphaVantageProvider(),
    new OfficialFilingProvider(),
  ];

  public static getProviders(): FinancialDataProvider[] {
    return this.providers;
  }

  public static getProviderStatusList(): ProviderMetadata[] {
    return this.providers.map((p) => ({
      id: p.id,
      name: p.name,
      classification: p.classification,
      dailyQuotaLimit: p.id === 'alpha_vantage' ? 25 : p.id === 'yahoo_finance' ? 10000 : 99999,
      requestsRemainingToday: p.isConfigured() ? 999 : 0,
      isConfigured: p.isConfigured(),
      isHealthy: true,
      priorityOrder: p.priorityOrder,
      description: `Data provider for Indian and global equities (${p.classification})`,
    }));
  }

  public static async fetchLiveQuote(symbol: string): Promise<LiveMarketQuote | null> {
    const cleanSym = symbol.trim().toUpperCase().replace(/\.NS$/, '').replace(/\.BO$/, '');
    const cacheKey = `quote:${cleanSym}`;
    const cached = await CacheService.get<LiveMarketQuote>(cacheKey, 'Live Market Data');
    if (cached) return cached;

    for (const provider of this.providers) {
      if (!provider.isConfigured()) continue;
      try {
        const quote = await provider.getQuote(cleanSym);
        if (quote && typeof quote.regularMarketPrice === 'number' && quote.regularMarketPrice > 0) {
          await CacheService.set(cacheKey, quote, 60); // 1-minute TTL for live prices
          return quote;
        }
      } catch (err: any) {
        console.warn(`[ProviderRegistry] ${provider.name} failed for quote ${cleanSym}:`, err.message);
      }
    }

    return null;
  }

  public static async fetchFundamentals(symbol: string): Promise<Partial<Company> | null> {
    const cleanSym = symbol.trim().toUpperCase().replace(/\.NS$/, '').replace(/\.BO$/, '');
    const cacheKey = `fundamentals:${cleanSym}`;
    const cached = await CacheService.get<Partial<Company>>(cacheKey, 'Fundamentals');
    if (cached) return cached;

    for (const provider of this.providers) {
      if (!provider.isConfigured()) continue;
      try {
        const fundamentals = await provider.getFundamentals(cleanSym);
        if (fundamentals && (fundamentals.market_cap || fundamentals.current_price)) {
          await CacheService.set(cacheKey, fundamentals, 900); // 15-min TTL
          return fundamentals;
        }
      } catch (err: any) {
        console.warn(`[ProviderRegistry] ${provider.name} failed for fundamentals ${cleanSym}:`, err.message);
      }
    }

    return null;
  }

  public static async fetchFinancialStatements(symbol: string): Promise<DetailedFinancialStatement[]> {
    const cleanSym = symbol.trim().toUpperCase().replace(/\.NS$/, '').replace(/\.BO$/, '');
    const cacheKey = `statements:${cleanSym}`;
    const cached = await CacheService.get<DetailedFinancialStatement[]>(cacheKey, 'Financial Statements');
    if (cached) return cached;

    for (const provider of this.providers) {
      if (!provider.isConfigured()) continue;
      try {
        const statements = await provider.getFinancialStatements(cleanSym);
        if (statements && statements.length > 0) {
          await CacheService.set(cacheKey, statements, 3600); // 1-hour TTL
          return statements;
        }
      } catch (err: any) {
        console.warn(`[ProviderRegistry] ${provider.name} failed for statements ${cleanSym}:`, err.message);
      }
    }

    return [];
  }
}
