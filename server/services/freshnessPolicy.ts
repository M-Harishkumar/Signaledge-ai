export type FreshnessStatus = 'LIVE' | 'RECENT' | 'STALE' | 'HISTORICAL' | 'UNKNOWN';

export interface FreshnessPolicyConfig {
  liveThresholdHours: number; // e.g., 24 hours
  recentThresholdDays: number; // e.g., 7 days
}

export const DEFAULT_FRESHNESS_CONFIG: FreshnessPolicyConfig = {
  liveThresholdHours: 24,
  recentThresholdDays: 7,
};

export class FreshnessPolicy {
  /**
   * Determine freshness status based on publication timestamp
   */
  public static evaluateFreshness(
    publishedAt: string | number | Date | null | undefined,
    isExplicitlyHistorical: boolean = false,
    config: FreshnessPolicyConfig = DEFAULT_FRESHNESS_CONFIG
  ): FreshnessStatus {
    if (isExplicitlyHistorical) {
      return 'HISTORICAL';
    }

    if (!publishedAt) {
      return 'UNKNOWN';
    }

    const pubTime = new Date(publishedAt).getTime();
    if (isNaN(pubTime)) {
      return 'UNKNOWN';
    }

    const now = Date.now();
    const diffMs = now - pubTime;

    // If published in the future by more than 1 hour (clock skew), treat as unknown/recent
    if (diffMs < -3600000) {
      return 'UNKNOWN';
    }

    const diffHours = Math.max(0, diffMs / (1000 * 60 * 60));
    const diffDays = diffHours / 24;

    if (diffHours <= config.liveThresholdHours) {
      return 'LIVE';
    }

    if (diffDays <= config.recentThresholdDays) {
      return 'RECENT';
    }

    return 'STALE';
  }

  /**
   * Format human-readable relative time honestly without fake "Just now"
   */
  public static formatRelativeTime(publishedAt: string | number | Date | null | undefined): string {
    if (!publishedAt) return 'Date unverified';

    const pubTime = new Date(publishedAt).getTime();
    if (isNaN(pubTime)) return 'Date unverified';

    const now = Date.now();
    const diffSeconds = Math.floor((now - pubTime) / 1000);

    if (diffSeconds < 0) return 'Just published';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 86400 * 7) return `${Math.floor(diffSeconds / 86400)}d ago`;

    const date = new Date(pubTime);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
