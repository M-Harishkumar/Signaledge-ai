import {
  Company,
  DetailedFinancialStatement,
  TechnicalIndicators,
  BenchmarkComparisonItem,
  FinancialRiskFlag,
  CorporateActionRecord,
  FilingRecord,
} from '../../src/types';

export interface LiveMarketQuote {
  symbol: string;
  nse_symbol: string;
  bse_code?: string;
  company_name?: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  regularMarketChange: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  regularMarketVolume: number;
  marketCap?: number;
  peRatio?: number;
  lastUpdated: string;
  source: string;
}

export type ProviderClassification =
  | 'CORE_FREE'
  | 'OPTIONAL_FREE'
  | 'FREE_WITH_LIMITS'
  | 'EDUCATIONAL_FREE'
  | 'TRIAL_ONLY'
  | 'PAID'
  | 'PRIMARY_OFFICIAL';

export interface ProviderMetadata {
  id: string;
  name: string;
  classification: ProviderClassification;
  dailyQuotaLimit: number;
  requestsRemainingToday: number;
  isConfigured: boolean;
  isHealthy: boolean;
  priorityOrder: number;
  description: string;
}

export interface FinancialDataProvider {
  readonly id: string;
  readonly name: string;
  readonly classification: ProviderClassification;
  readonly priorityOrder: number;

  isConfigured(): boolean;
  getQuote(symbol: string): Promise<LiveMarketQuote | null>;
  getFundamentals(symbol: string): Promise<Partial<Company> | null>;
  getFinancialStatements(symbol: string): Promise<DetailedFinancialStatement[] | null>;
  getTechnicals?(symbol: string): Promise<TechnicalIndicators | null>;
}

export interface AIProvider {
  readonly id: string;
  readonly name: string;
  readonly classification: ProviderClassification;

  isConfigured(): boolean;
  generateStructured<T>(prompt: string, systemInstruction?: string): Promise<T>;
  chatWithTools(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    systemContext?: string,
    toolDefinitions?: any[]
  ): Promise<{ text: string; toolCalls?: Array<{ name: string; args: any }> }>;
}

export interface CacheProvider {
  readonly id: string;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface UsageMetric {
  providerId: string;
  providerName: string;
  requestsToday: number;
  requestsThisMonth: number;
  errorsToday: number;
  lastSuccessfulRequestAt?: string;
  lastFailedRequestAt?: string;
  lastErrorReason?: string;
  avgLatencyMs: number;
  cacheHitCount: number;
  cacheMissCount: number;
}
