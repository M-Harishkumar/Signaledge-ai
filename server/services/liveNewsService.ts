import {
  NewsArticle,
  NewsProvider,
  YahooFinanceNewsProvider,
  GoogleNewsRSSProvider,
  OfficialFilingsNewsProvider,
} from '../providers/newsProvider';
import { db } from '../db/database';
import { FreshnessPolicy, FreshnessStatus } from './freshnessPolicy';

interface CachedNewsFeed {
  articles: NewsArticle[];
  cachedAtMs: number;
}

export interface NewsFeedResult {
  symbol?: string;
  company_name?: string;
  total_articles: number;
  live_count: number;
  recent_count: number;
  stale_count: number;
  historical_count: number;
  last_updated_at: string;
  primary_source: string;
  articles: NewsArticle[];
}

export class LiveNewsService {
  private static providers: NewsProvider[] = [
    new YahooFinanceNewsProvider(),
    new GoogleNewsRSSProvider(),
    new OfficialFilingsNewsProvider(),
  ];

  // 15-minute cache TTL (15 * 60 * 1000 ms)
  private static readonly CACHE_TTL_MS = 15 * 60 * 1000;
  private static memoryCache: Map<string, CachedNewsFeed> = new Map();

  /**
   * Normalize title string for hash deduplication
   */
  private static normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }

  /**
   * Deduplicate articles based on normalized title and canonical URL
   */
  public static deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
    const seenTitles = new Set<string>();
    const seenUrls = new Set<string>();
    const deduped: NewsArticle[] = [];

    for (const art of articles) {
      const norm = this.normalizeTitle(art.title);
      const url = art.url && art.url !== '#' ? art.url.toLowerCase().split('?')[0] : '';

      if (norm.length > 5 && seenTitles.has(norm)) {
        continue;
      }
      if (url && seenUrls.has(url)) {
        continue;
      }

      if (norm.length > 5) seenTitles.add(norm);
      if (url) seenUrls.add(url);
      deduped.push(art);
    }

    return deduped;
  }

  /**
   * Retrieve company-specific news with multi-provider fallback & 15-min cache
   */
  public static async getCompanyNews(symbol: string, limit = 10): Promise<NewsFeedResult> {
    const cleanSym = symbol.trim().toUpperCase().replace(/\.NS$/, '').replace(/\.BO$/, '');
    const cacheKey = `company_news_${cleanSym}`;
    const now = Date.now();

    const company = db.getCompanies().find((c) => c.nse_symbol === cleanSym);
    const companyName = company?.company_name || cleanSym;

    // 1. Check cache
    const cached = this.memoryCache.get(cacheKey);
    if (cached && now - cached.cachedAtMs < this.CACHE_TTL_MS) {
      return this.formatFeedResult(cached.articles.slice(0, limit), cleanSym, companyName);
    }

    let collectedArticles: NewsArticle[] = [];
    let activeProviderName = 'Local Filing Store';

    // 2. Query providers in priority order
    for (const provider of this.providers) {
      if (!provider.isConfigured()) continue;

      try {
        const results = await provider.fetchCompanyNews(cleanSym, companyName, limit);
        if (results && results.length > 0) {
          collectedArticles.push(...results);
          activeProviderName = provider.name;
          // If we got sufficient live or recent results from Yahoo or Google, stop querying
          if (collectedArticles.length >= limit) {
            break;
          }
        }
      } catch (err: any) {
        console.warn(`[LiveNewsService] Provider ${provider.name} failed for ${cleanSym}:`, err.message);
      }
    }

    // 3. Fallback to official statutory filings if online providers return empty
    if (collectedArticles.length === 0) {
      const filingProvider = new OfficialFilingsNewsProvider();
      const fallbackResults = await filingProvider.fetchCompanyNews(cleanSym, companyName, limit);
      collectedArticles = fallbackResults;
      activeProviderName = filingProvider.name;
    }

    // 4. Deduplicate & evaluate freshness & format relative time
    const deduped = this.deduplicateArticles(collectedArticles).map((art) => {
      const freshnessStatus = FreshnessPolicy.evaluateFreshness(art.publishedAt);
      return {
        ...art,
        freshnessStatus,
        relativeTimeStr: FreshnessPolicy.formatRelativeTime(art.publishedAt),
      };
    });

    // 5. Store in cache
    this.memoryCache.set(cacheKey, {
      articles: deduped,
      cachedAtMs: now,
    });

    return this.formatFeedResult(deduped.slice(0, limit), cleanSym, companyName, activeProviderName);
  }

  /**
   * Retrieve market-wide news feed
   */
  public static async getMarketNews(limit = 12): Promise<NewsFeedResult> {
    const cacheKey = 'market_wide_news';
    const now = Date.now();

    const cached = this.memoryCache.get(cacheKey);
    if (cached && now - cached.cachedAtMs < this.CACHE_TTL_MS) {
      return this.formatFeedResult(cached.articles.slice(0, limit), undefined, undefined);
    }

    let collectedArticles: NewsArticle[] = [];
    let activeProviderName = 'Official Statutory Registry';

    for (const provider of this.providers) {
      if (!provider.isConfigured()) continue;

      try {
        const results = await provider.fetchMarketNews(limit);
        if (results && results.length > 0) {
          collectedArticles.push(...results);
          activeProviderName = provider.name;
          if (collectedArticles.length >= limit) {
            break;
          }
        }
      } catch (err: any) {
        console.warn(`[LiveNewsService] Market news provider ${provider.name} failed:`, err.message);
      }
    }

    if (collectedArticles.length === 0) {
      const filingProvider = new OfficialFilingsNewsProvider();
      collectedArticles = await filingProvider.fetchMarketNews(limit);
      activeProviderName = filingProvider.name;
    }

    const deduped = this.deduplicateArticles(collectedArticles).map((art) => {
      const freshnessStatus = FreshnessPolicy.evaluateFreshness(art.publishedAt);
      return {
        ...art,
        freshnessStatus,
        relativeTimeStr: FreshnessPolicy.formatRelativeTime(art.publishedAt),
      };
    });

    this.memoryCache.set(cacheKey, {
      articles: deduped,
      cachedAtMs: now,
    });

    return this.formatFeedResult(deduped.slice(0, limit), undefined, undefined, activeProviderName);
  }

  /**
   * Clear cache for testing or manual refresh
   */
  public static clearCache(): void {
    this.memoryCache.clear();
  }

  /**
   * Helper to compute summary counts and format response payload
   */
  private static formatFeedResult(
    articles: NewsArticle[],
    symbol?: string,
    companyName?: string,
    primarySource = 'Multi-Tier News Engine'
  ): NewsFeedResult {
    let liveCount = 0;
    let recentCount = 0;
    let staleCount = 0;
    let historicalCount = 0;

    for (const a of articles) {
      if (a.freshnessStatus === 'LIVE') liveCount++;
      else if (a.freshnessStatus === 'RECENT') recentCount++;
      else if (a.freshnessStatus === 'STALE') staleCount++;
      else if (a.freshnessStatus === 'HISTORICAL') historicalCount++;
    }

    return {
      symbol,
      company_name: companyName,
      total_articles: articles.length,
      live_count: liveCount,
      recent_count: recentCount,
      stale_count: staleCount,
      historical_count: historicalCount,
      last_updated_at: new Date().toISOString(),
      primary_source: primarySource,
      articles,
    };
  }
}
