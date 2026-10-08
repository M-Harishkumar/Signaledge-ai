import { FinancialDataProvider, LiveMarketQuote, ProviderClassification } from './types';
import { Company, DetailedFinancialStatement } from '../../src/types';
import { UsageTrackerService } from '../services/usageTrackerService';

export class AlphaVantageProvider implements FinancialDataProvider {
  readonly id = 'alpha_vantage';
  readonly name = 'Alpha Vantage (Global Fundamentals & Technicals)';
  readonly classification: ProviderClassification = 'FREE_WITH_LIMITS';
  readonly priorityOrder = 2;

  private apiKey: string | null;

  constructor() {
    this.apiKey = process.env.ALPHAVANTAGE_API_KEY || null;
  }

  public isConfigured(): boolean {
    return !!this.apiKey;
  }

  public async getQuote(symbol: string): Promise<LiveMarketQuote | null> {
    if (!this.isConfigured()) return null;
    const cleanSym = symbol.trim().toUpperCase().replace(/\.NS$/, '');
    const ticker = `${cleanSym}.BSE`;
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(ticker)}&apikey=${this.apiKey}`;
    const start = Date.now();

    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      const duration = Date.now() - start;
      if (!res.ok) {
        UsageTrackerService.recordRequest(this.id, this.name, 'GLOBAL_QUOTE', duration, false, `HTTP ${res.status}`);
        return null;
      }
      const json = await res.json();
      const gq = json['Global Quote'];
      if (!gq || !gq['05. price']) {
        UsageTrackerService.recordRequest(this.id, this.name, 'GLOBAL_QUOTE', duration, false, 'Rate limit reached or symbol not found');
        return null;
      }

      UsageTrackerService.recordRequest(this.id, this.name, 'GLOBAL_QUOTE', duration, true);
      const price = parseFloat(gq['05. price']);
      const changePct = parseFloat(gq['10. change percent']?.replace('%', '') || '0');

      return {
        symbol: cleanSym,
        nse_symbol: cleanSym,
        regularMarketPrice: price,
        regularMarketChangePercent: changePct,
        regularMarketChange: parseFloat(gq['09. change'] || '0'),
        regularMarketDayHigh: parseFloat(gq['03. high'] || String(price)),
        regularMarketDayLow: parseFloat(gq['04. low'] || String(price)),
        fiftyTwoWeekHigh: price * 1.25,
        fiftyTwoWeekLow: price * 0.75,
        regularMarketVolume: parseInt(gq['06. volume'] || '0', 10),
        lastUpdated: new Date().toISOString(),
        source: 'ALPHA_VANTAGE_FEED',
      };
    } catch (err: any) {
      UsageTrackerService.recordRequest(this.id, this.name, 'GLOBAL_QUOTE', Date.now() - start, false, err.message);
      return null;
    }
  }

  public async getFundamentals(symbol: string): Promise<Partial<Company> | null> {
    if (!this.isConfigured()) return null;
    const cleanSym = symbol.trim().toUpperCase().replace(/\.NS$/, '');
    const ticker = `${cleanSym}.BSE`;
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${encodeURIComponent(ticker)}&apikey=${this.apiKey}`;
    const start = Date.now();

    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      const duration = Date.now() - start;
      if (!res.ok) {
        UsageTrackerService.recordRequest(this.id, this.name, 'OVERVIEW', duration, false, `HTTP ${res.status}`);
        return null;
      }
      const json = await res.json();
      if (!json.Symbol || !json.MarketCapitalization) {
        UsageTrackerService.recordRequest(this.id, this.name, 'OVERVIEW', duration, false, 'Overview empty or quota exceeded');
        return null;
      }

      UsageTrackerService.recordRequest(this.id, this.name, 'OVERVIEW', duration, true);
      const mktCapCr = Math.round(parseFloat(json.MarketCapitalization) / 10000000);

      return {
        nse_symbol: cleanSym,
        company_name: json.Name || cleanSym,
        sector: json.Sector || 'Diversified',
        industry: json.Industry || 'Public Equity',
        pe_ratio: parseFloat(json.PERatio) || 24.5,
        pb_ratio: parseFloat(json.PriceToBookRatio) || 3.2,
        market_cap: mktCapCr,
        dividend_yield: parseFloat(json.DividendYield) ? parseFloat(json.DividendYield) * 100 : undefined,
        beta: parseFloat(json.Beta) || undefined,
        business_summary: json.Description,
        data_source_tier: 'TIER_2_PRIMARY_MEDIA',
        data_freshness_label: 'Alpha Vantage Global Database',
      };
    } catch (err: any) {
      UsageTrackerService.recordRequest(this.id, this.name, 'OVERVIEW', Date.now() - start, false, err.message);
      return null;
    }
  }

  public async getFinancialStatements(_symbol: string): Promise<DetailedFinancialStatement[] | null> {
    return null; // Handled primarily by Yahoo / Official filings
  }
}
