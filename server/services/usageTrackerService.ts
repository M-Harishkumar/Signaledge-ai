import { UsageMetric, ProviderMetadata } from '../providers/types';

export class UsageTrackerService {
  private static metrics: Map<string, UsageMetric> = new Map();
  private static requestLogs: Array<{
    timestamp: string;
    providerId: string;
    endpoint: string;
    durationMs: number;
    success: boolean;
    error?: string;
  }> = [];

  private static MAX_LOGS = 200;

  private static getOrCreateMetric(providerId: string, providerName: string): UsageMetric {
    let metric = this.metrics.get(providerId);
    if (!metric) {
      metric = {
        providerId,
        providerName,
        requestsToday: 0,
        requestsThisMonth: 0,
        errorsToday: 0,
        avgLatencyMs: 0,
        cacheHitCount: 0,
        cacheMissCount: 0,
      };
      this.metrics.set(providerId, metric);
    }
    return metric;
  }

  public static recordRequest(
    providerId: string,
    providerName: string,
    endpoint: string,
    durationMs: number,
    success: boolean,
    error?: string
  ): void {
    const metric = this.getOrCreateMetric(providerId, providerName);
    const now = new Date().toISOString();

    metric.requestsToday += 1;
    metric.requestsThisMonth += 1;
    metric.avgLatencyMs = Math.round(
      (metric.avgLatencyMs * (metric.requestsToday - 1) + durationMs) / metric.requestsToday
    );

    if (success) {
      metric.lastSuccessfulRequestAt = now;
    } else {
      metric.errorsToday += 1;
      metric.lastFailedRequestAt = now;
      metric.lastErrorReason = error || 'Unknown provider error';
    }

    this.requestLogs.unshift({
      timestamp: now,
      providerId,
      endpoint,
      durationMs,
      success,
      error,
    });

    if (this.requestLogs.length > this.MAX_LOGS) {
      this.requestLogs.pop();
    }
  }

  public static recordCacheHit(providerId: string, providerName: string): void {
    const metric = this.getOrCreateMetric(providerId, providerName);
    metric.cacheHitCount += 1;
  }

  public static recordCacheMiss(providerId: string, providerName: string): void {
    const metric = this.getOrCreateMetric(providerId, providerName);
    metric.cacheMissCount += 1;
  }

  public static getAllMetrics(): UsageMetric[] {
    return Array.from(this.metrics.values());
  }

  public static getRecentLogs(limit = 50) {
    return this.requestLogs.slice(0, limit);
  }

  public static getSummary() {
    const all = this.getAllMetrics();
    const totalRequests = all.reduce((sum, m) => sum + m.requestsToday, 0);
    const totalErrors = all.reduce((sum, m) => sum + m.errorsToday, 0);
    const totalHits = all.reduce((sum, m) => sum + m.cacheHitCount, 0);
    const totalMisses = all.reduce((sum, m) => sum + m.cacheMissCount, 0);
    const cacheHitRate = totalHits + totalMisses > 0
      ? Math.round((totalHits / (totalHits + totalMisses)) * 1000) / 10
      : 100.0;

    return {
      totalRequestsToday: totalRequests,
      totalErrorsToday: totalErrors,
      overallCacheHitRatePct: cacheHitRate,
      activeProvidersCount: all.length,
      metrics: all,
    };
  }
}
