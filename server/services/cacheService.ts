import { CacheProvider } from '../providers/types';
import { UsageTrackerService } from './usageTrackerService';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class InMemoryCacheProvider implements CacheProvider {
  readonly id = 'in_memory';
  private store: Map<string, CacheEntry<any>> = new Map();

  public async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  public async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  public async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  public clear(): void {
    this.store.clear();
  }
}

export class UpstashRedisCacheProvider implements CacheProvider {
  readonly id = 'upstash_redis';
  private restUrl: string | null;
  private restToken: string | null;

  constructor() {
    this.restUrl = process.env.UPSTASH_REDIS_REST_URL || null;
    this.restToken = process.env.UPSTASH_REDIS_REST_TOKEN || null;
  }

  public isConfigured(): boolean {
    return !!(this.restUrl && this.restToken);
  }

  public async get<T>(key: string): Promise<T | null> {
    if (!this.isConfigured()) return null;
    try {
      const res = await fetch(`${this.restUrl}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${this.restToken}` },
      });
      if (!res.ok) return null;
      const json = await res.json();
      if (!json.result) return null;
      return JSON.parse(json.result) as T;
    } catch {
      return null;
    }
  }

  public async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    if (!this.isConfigured()) return;
    try {
      const payload = JSON.stringify(value);
      await fetch(`${this.restUrl}/set/${encodeURIComponent(key)}?ex=${ttlSeconds}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.restToken}`,
          'Content-Type': 'application/json',
        },
        body: payload,
      });
    } catch {
      // Graceful ignore
    }
  }

  public async delete(key: string): Promise<void> {
    if (!this.isConfigured()) return;
    try {
      await fetch(`${this.restUrl}/del/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${this.restToken}` },
      });
    } catch {
      // Graceful ignore
    }
  }
}

export class CacheService {
  private static localProvider = new InMemoryCacheProvider();
  private static upstashProvider = new UpstashRedisCacheProvider();

  public static async get<T>(key: string, providerName = 'Cache'): Promise<T | null> {
    const val = await this.localProvider.get<T>(key);
    if (val !== null) {
      UsageTrackerService.recordCacheHit('cache_system', providerName);
      return val;
    }

    if (this.upstashProvider.isConfigured()) {
      const remoteVal = await this.upstashProvider.get<T>(key);
      if (remoteVal !== null) {
        await this.localProvider.set(key, remoteVal, 120); // Local warm up
        UsageTrackerService.recordCacheHit('cache_system', providerName);
        return remoteVal;
      }
    }

    UsageTrackerService.recordCacheMiss('cache_system', providerName);
    return null;
  }

  public static async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    await this.localProvider.set(key, value, ttlSeconds);
    if (this.upstashProvider.isConfigured()) {
      await this.upstashProvider.set(key, value, ttlSeconds);
    }
  }

  public static async delete(key: string): Promise<void> {
    await this.localProvider.delete(key);
    if (this.upstashProvider.isConfigured()) {
      await this.upstashProvider.delete(key);
    }
  }
}
