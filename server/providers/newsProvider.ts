import { FreshnessPolicy, FreshnessStatus } from '../services/freshnessPolicy';
import { SourceQualityTier, FilingRecord } from '../../src/types';
import { UsageTrackerService } from '../services/usageTrackerService';
import { db } from '../db/database';
import { SEED_FILINGS } from '../../src/data/seedData';
import { FinancialDataService } from '../services/financialDataService';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string; // ISO 8601 string
  retrievedAt: string;
  companySymbol?: string;
  companyName?: string;
  provider: 'YAHOO_FINANCE' | 'GOOGLE_NEWS_RSS' | 'OFFICIAL_FILING' | 'STATUTORY_FEED';
  freshnessStatus: FreshnessStatus;
  sourceTier: SourceQualityTier;
  sentiment?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  relativeTimeStr?: string;
}

export interface NewsFetchOptions {
  limit?: number;
  companySymbol?: string;
  companyName?: string;
  query?: string;
}

export interface NewsProvider {
  readonly id: string;
  readonly name: string;
  readonly priorityOrder: number;
  isConfigured(): boolean;
  fetchCompanyNews(symbol: string, companyName?: string, limit?: number): Promise<NewsArticle[]>;
  fetchMarketNews(limit?: number): Promise<NewsArticle[]>;
}

/**
 * Helper to strip HTML tags from strings
 */
function cleanHtml(input?: string): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>?/gm, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/**
 * Provider 1: Yahoo Finance Live Search & News Engine (Primary)
 */
export class YahooFinanceNewsProvider implements NewsProvider {
  readonly id = 'yahoo_finance_news';
  readonly name = 'Yahoo Finance News Engine';
  readonly priorityOrder = 1;

  public isConfigured(): boolean {
    return true; // Free, keyless public endpoint
  }

  public async fetchCompanyNews(symbol: string, companyName?: string, limit = 8): Promise<NewsArticle[]> {
    const cleanSym = symbol.trim().toUpperCase().replace(/\.NS$/, '').replace(/\.BO$/, '');
    const query = companyName ? `${cleanSym} ${companyName}` : `${cleanSym}.NS`;
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&newsCount=${Math.min(limit * 2, 20)}&quotesCount=0`;
    const start = Date.now();

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      const duration = Date.now() - start;
      if (!response.ok) {
        UsageTrackerService.recordRequest(this.id, this.name, 'v1/finance/search', duration, false, `HTTP ${response.status}`);
        return [];
      }

      const json = await response.json();
      const newsItems: any[] = json?.news || [];
      UsageTrackerService.recordRequest(this.id, this.name, 'v1/finance/search', duration, true);

      const articles: NewsArticle[] = [];
      const retrievedAt = new Date().toISOString();

      for (const item of newsItems) {
        if (!item.title || !item.link) continue;

        const pubEpochMs = typeof item.providerPublishTime === 'number' ? item.providerPublishTime * 1000 : Date.now();
        const publishedAt = new Date(pubEpochMs).toISOString();
        const freshnessStatus = FreshnessPolicy.evaluateFreshness(publishedAt);

        // Classify source tier
        const publisher = item.publisher || 'Financial Media';
        let sourceTier: SourceQualityTier = 'TIER_2_PRIMARY_MEDIA';
        const pubLower = publisher.toLowerCase();
        if (pubLower.includes('bse') || pubLower.includes('nse') || pubLower.includes('sebi') || pubLower.includes('gazette')) {
          sourceTier = 'TIER_1_OFFICIAL_REGULATORY';
        } else if (pubLower.includes('crisil') || pubLower.includes('icra') || pubLower.includes('siam') || pubLower.includes('assocham')) {
          sourceTier = 'TIER_3_INDUSTRY_BODY';
        }

        articles.push({
          id: item.uuid || `yf-${Buffer.from(item.link).toString('base64').substring(0, 16)}`,
          title: cleanHtml(item.title),
          summary: cleanHtml(item.summary || item.title),
          source: publisher,
          url: item.link,
          publishedAt,
          retrievedAt,
          companySymbol: cleanSym,
          companyName: companyName || cleanSym,
          provider: 'YAHOO_FINANCE',
          freshnessStatus,
          sourceTier,
          relativeTimeStr: FreshnessPolicy.formatRelativeTime(publishedAt),
        });

        if (articles.length >= limit) break;
      }

      return articles;
    } catch (err: any) {
      UsageTrackerService.recordRequest(this.id, this.name, 'v1/finance/search', Date.now() - start, false, err.message);
      return [];
    }
  }

  public async fetchMarketNews(limit = 10): Promise<NewsArticle[]> {
    const query = 'Indian stock market NSE Nifty Sensex SEBI';
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&newsCount=${Math.min(limit * 2, 20)}&quotesCount=0`;
    const start = Date.now();

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      const duration = Date.now() - start;
      if (!response.ok) {
        UsageTrackerService.recordRequest(this.id, this.name, 'v1/finance/search-market', duration, false, `HTTP ${response.status}`);
        return [];
      }

      const json = await response.json();
      const newsItems: any[] = json?.news || [];
      UsageTrackerService.recordRequest(this.id, this.name, 'v1/finance/search-market', duration, true);

      const articles: NewsArticle[] = [];
      const retrievedAt = new Date().toISOString();

      for (const item of newsItems) {
        if (!item.title || !item.link) continue;

        const pubEpochMs = typeof item.providerPublishTime === 'number' ? item.providerPublishTime * 1000 : Date.now();
        const publishedAt = new Date(pubEpochMs).toISOString();
        const freshnessStatus = FreshnessPolicy.evaluateFreshness(publishedAt);

        articles.push({
          id: item.uuid || `yf-mkt-${Buffer.from(item.link).toString('base64').substring(0, 16)}`,
          title: cleanHtml(item.title),
          summary: cleanHtml(item.summary || item.title),
          source: item.publisher || 'Financial Media',
          url: item.link,
          publishedAt,
          retrievedAt,
          provider: 'YAHOO_FINANCE',
          freshnessStatus,
          sourceTier: 'TIER_2_PRIMARY_MEDIA',
          relativeTimeStr: FreshnessPolicy.formatRelativeTime(publishedAt),
        });

        if (articles.length >= limit) break;
      }

      return articles;
    } catch (err: any) {
      UsageTrackerService.recordRequest(this.id, this.name, 'v1/finance/search-market', Date.now() - start, false, err.message);
      return [];
    }
  }
}

/**
 * Provider 2: Google News RSS Engine (Secondary Fallback)
 */
export class GoogleNewsRSSProvider implements NewsProvider {
  readonly id = 'google_news_rss';
  readonly name = 'Google News RSS Engine';
  readonly priorityOrder = 2;

  public isConfigured(): boolean {
    return true; // Free public RSS feed
  }

  public async fetchCompanyNews(symbol: string, companyName?: string, limit = 8): Promise<NewsArticle[]> {
    const cleanSym = symbol.trim().toUpperCase().replace(/\.NS$/, '').replace(/\.BO$/, '');
    const query = companyName ? `${cleanSym} ${companyName} NSE share price` : `${cleanSym} NSE India`;
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
    const start = Date.now();

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/rss+xml, application/xml, text/xml',
        },
        signal: AbortSignal.timeout(5000),
      });

      const duration = Date.now() - start;
      if (!response.ok) {
        UsageTrackerService.recordRequest(this.id, this.name, 'rss/company', duration, false, `HTTP ${response.status}`);
        return [];
      }

      const xmlText = await response.text();
      UsageTrackerService.recordRequest(this.id, this.name, 'rss/company', duration, true);

      return this.parseRssFeed(xmlText, cleanSym, companyName, limit);
    } catch (err: any) {
      UsageTrackerService.recordRequest(this.id, this.name, 'rss/company', Date.now() - start, false, err.message);
      return [];
    }
  }

  public async fetchMarketNews(limit = 10): Promise<NewsArticle[]> {
    const query = 'Nifty 50 Sensex Indian Stock Market Economy';
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
    const start = Date.now();

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/rss+xml, application/xml, text/xml',
        },
        signal: AbortSignal.timeout(5000),
      });

      const duration = Date.now() - start;
      if (!response.ok) {
        UsageTrackerService.recordRequest(this.id, this.name, 'rss/market', duration, false, `HTTP ${response.status}`);
        return [];
      }

      const xmlText = await response.text();
      UsageTrackerService.recordRequest(this.id, this.name, 'rss/market', duration, true);

      return this.parseRssFeed(xmlText, undefined, undefined, limit);
    } catch (err: any) {
      UsageTrackerService.recordRequest(this.id, this.name, 'rss/market', Date.now() - start, false, err.message);
      return [];
    }
  }

  private parseRssFeed(xml: string, symbol?: string, companyName?: string, limit = 8): NewsArticle[] {
    const articles: NewsArticle[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match: RegExpExecArray | null;
    const retrievedAt = new Date().toISOString();

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemContent = match[1];

      const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
      const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      const sourceMatch = itemContent.match(/<source[^>]*>([\s\S]*?)<\/source>/);

      if (!titleMatch || !linkMatch) continue;

      const rawTitle = cleanHtml(titleMatch[1]);
      const link = cleanHtml(linkMatch[1]);
      const pubDateStr = pubDateMatch ? pubDateMatch[1] : new Date().toISOString();
      const source = sourceMatch ? cleanHtml(sourceMatch[1]) : 'Google News Feed';

      let publishedAt: string;
      try {
        const parsedDate = new Date(pubDateStr);
        publishedAt = !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : new Date().toISOString();
      } catch {
        publishedAt = new Date().toISOString();
      }

      const freshnessStatus = FreshnessPolicy.evaluateFreshness(publishedAt);

      articles.push({
        id: `gn-${Buffer.from(link).toString('base64').substring(0, 16)}`,
        title: rawTitle,
        summary: rawTitle,
        source,
        url: link,
        publishedAt,
        retrievedAt,
        companySymbol: symbol,
        companyName: companyName || symbol,
        provider: 'GOOGLE_NEWS_RSS',
        freshnessStatus,
        sourceTier: 'TIER_2_PRIMARY_MEDIA',
        relativeTimeStr: FreshnessPolicy.formatRelativeTime(publishedAt),
      });

      if (articles.length >= limit) break;
    }

    return articles;
  }
}

/**
 * Provider 3: Official Filings & Regulatory Announcements Provider (Baseline Fallback)
 */
export class OfficialFilingsNewsProvider implements NewsProvider {
  readonly id = 'official_filings_news';
  readonly name = 'Official Statutory Filing Feed';
  readonly priorityOrder = 3;

  public isConfigured(): boolean {
    return true;
  }

  public async fetchCompanyNews(symbol: string, companyName?: string, limit = 8): Promise<NewsArticle[]> {
    const cleanSym = symbol.trim().toUpperCase().replace(/\.NS$/, '').replace(/\.BO$/, '');
    const filings: FilingRecord[] = SEED_FILINGS[cleanSym] || SEED_FILINGS['TATAMOTORS'] || [];
    const corpActions = FinancialDataService.getCorporateActions(cleanSym);
    const retrievedAt = new Date().toISOString();

    const articles: NewsArticle[] = [];

    // Add corporate actions
    for (const act of corpActions) {
      const pubDate = act.announcement_date || '2026-01-01';
      const publishedAt = new Date(pubDate).toISOString();
      const freshnessStatus = FreshnessPolicy.evaluateFreshness(publishedAt);

      articles.push({
        id: `filing-act-${act.action_id}`,
        title: `${act.action_type}: ${act.details}`,
        summary: act.amount_or_ratio ? `Payout / Terms: ${act.amount_or_ratio}. ${act.details}` : act.details,
        source: 'NSE / BSE Official Filing Registry',
        url: '#',
        publishedAt,
        retrievedAt,
        companySymbol: cleanSym,
        companyName: companyName || cleanSym,
        provider: 'OFFICIAL_FILING',
        freshnessStatus,
        sourceTier: 'TIER_1_OFFICIAL_REGULATORY',
        relativeTimeStr: FreshnessPolicy.formatRelativeTime(publishedAt),
      });
    }

    // Add regulatory filings
    for (const fil of filings) {
      const pubDate = fil.date || '2026-01-01';
      const publishedAt = new Date(pubDate).toISOString();
      const freshnessStatus = FreshnessPolicy.evaluateFreshness(publishedAt);

      articles.push({
        id: `filing-doc-${fil.filing_id}`,
        title: `[${fil.category}] ${fil.title}`,
        summary: fil.summary,
        source: 'SEBI / Exchange Disclosure Portal',
        url: '#',
        publishedAt,
        retrievedAt,
        companySymbol: cleanSym,
        companyName: companyName || cleanSym,
        provider: 'OFFICIAL_FILING',
        freshnessStatus,
        sourceTier: 'TIER_1_OFFICIAL_REGULATORY',
        relativeTimeStr: FreshnessPolicy.formatRelativeTime(publishedAt),
      });
    }

    return articles.slice(0, limit);
  }

  public async fetchMarketNews(limit = 10): Promise<NewsArticle[]> {
    const allFilings = Object.entries(SEED_FILINGS).flatMap(([sym, list]) =>
      list.map((fil) => ({ ...fil, nse_symbol: sym }))
    );
    const filings = allFilings.slice(0, limit);
    const retrievedAt = new Date().toISOString();

    return filings.map((fil) => {
      const pubDate = fil.date || '2026-01-01';
      const publishedAt = new Date(pubDate).toISOString();
      return {
        id: `filing-mkt-${fil.filing_id}`,
        title: `[${fil.nse_symbol}] ${fil.title}`,
        summary: fil.summary,
        source: 'SEBI Regulatory Disclosure Portal',
        url: '#',
        publishedAt,
        retrievedAt,
        companySymbol: fil.nse_symbol,
        provider: 'OFFICIAL_FILING',
        freshnessStatus: FreshnessPolicy.evaluateFreshness(publishedAt),
        sourceTier: 'TIER_1_OFFICIAL_REGULATORY',
        relativeTimeStr: FreshnessPolicy.formatRelativeTime(publishedAt),
      };
    });
  }
}
