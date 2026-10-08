import { db } from '../db/database';
import {
  MonitoringChangeItem,
  MonitoringChangeType,
  AlertItem,
  TrackRecordStats,
  Company,
  Signal,
  ResearchThesis,
  DataProvenance,
} from '../../src/types';
import { FinancialDataService } from './financialDataService';
import { SignalService } from './signalService';

export class MonitoringService {
  /**
   * Identifies chronological delta changes across watched equities.
   * Answers 6 critical audit questions for each item:
   * 1. What changed
   * 2. When it changed
   * 3. Why it changed
   * 4. Source of change
   * 5. Quantified financial / operational impact
   * 6. Required investigation action
   */
  public static detectWatchedCompanyChanges(
    watchedSymbols: string[] = [],
    userId?: string
  ): MonitoringChangeItem[] {
    const companies = db.getCompanies();
    const signalsRes = SignalService.getSignals();
    const allSignals = signalsRes.items;
    const theses = db.getTheses(userId);

    // If no specific symbols passed, default to all symbols in user's active watchlists
    let targetSymbols = watchedSymbols.map((s) => s.toUpperCase());
    if (targetSymbols.length === 0 && userId) {
      const userWls = db.getWatchlists(userId);
      const symSet = new Set<string>();
      userWls.forEach((wl) => {
        wl.companies?.forEach((c) => symSet.add(c.nse_symbol.toUpperCase()));
      });
      targetSymbols = Array.from(symSet);
    }

    // If still empty, monitor top marquee compounders
    if (targetSymbols.length === 0) {
      targetSymbols = ['TATAMOTORS', 'RELIANCE', 'HAL', 'BEL', 'MARUTI', 'TRENT'];
    }

    const changes: MonitoringChangeItem[] = [];

    targetSymbols.forEach((symbol) => {
      const comp = companies.find((c) => c.nse_symbol === symbol.toUpperCase());
      if (!comp) return;

      // 1. SIGNAL DETECTIONS (F1 to F7)
      const relevantSignals = allSignals.filter(
        (s) =>
          s.nse_symbol === symbol ||
          s.affected_companies?.some((ac) => ac.nse_symbol === symbol)
      );

      relevantSignals.forEach((sig) => {
        changes.push({
          change_id: `chg-sig-${sig.signal_id}`,
          nse_symbol: symbol,
          company_name: comp.company_name,
          change_type: 'SIGNAL',
          what_changed: `New ${sig.stream_name || sig.signal_stream || 'Catalyst'} Signal: "${sig.signal_title}"`,
          when_changed: sig.detected_at,
          why_changed: sig.catalyst_event || sig.why_am_i_seeing_this,
          source: sig.source || 'SignalEdge Verified Intelligence Stream',
          source_url: sig.source_url,
          impact: sig.why_it_matters || `Confidence score: ${sig.confidence_score}/100 with ${sig.lead_time_days}d lead time horizon`,
          severity: sig.confidence_score >= 85 ? 'HIGH' : 'MEDIUM',
          required_investigation: `Review signal evidence in Discovery Hub and evaluate affected supply chain exposures for ${symbol}.`,
          investigation_action_type: 'COMPANY_RESEARCH',
          provenance: 'SEED_DATA',
          provenance_label: 'Retrospective Historical Catalyst Stream',
          metric_before: undefined,
          metric_after: sig.confidence_score,
        });
      });

      // 2. FINANCIAL METRIC & RATIO SHIFTS
      if (comp.roce !== undefined) {
        const isHighRoCE = comp.roce >= 20.0;
        changes.push({
          change_id: `chg-fin-roce-${symbol}`,
          nse_symbol: symbol,
          company_name: comp.company_name,
          change_type: 'FINANCIAL_METRIC',
          what_changed: `Audited RoCE verified at ${comp.roce}% (Hurdle: >= 15.0%)`,
          when_changed: comp.data_last_updated || new Date().toISOString().split('T')[0],
          why_changed: 'Audited annual statement filing and capital allocation optimization.',
          source: 'BSE / NSE Statutory Financial Results Filing',
          impact: isHighRoCE
            ? `Superior capital efficiency (+${(comp.roce - 15.0).toFixed(1)}% above institutional hurdle rate)`
            : 'Sub-hurdle capital efficiency requiring operating margin monitoring',
          severity: isHighRoCE ? 'LOW' : 'MEDIUM',
          required_investigation: 'Execute 8-layer Pre-Buy Gate and DuPont RoE mathematical decomposition.',
          investigation_action_type: 'PRE_BUY_GATE',
          provenance: 'USER_DATA',
          provenance_label: 'Audited Exchange Filings & Canonical Ratios',
          metric_before: '15.0% (Benchmark)',
          metric_after: `${comp.roce}%`,
        });
      }

      // 3. VALUATION & PRICE EXTREMES
      if (comp.price_change_pct !== undefined && Math.abs(comp.price_change_pct) >= 2.0) {
        const isUp = comp.price_change_pct > 0;
        changes.push({
          change_id: `chg-val-${symbol}-${Date.now()}`,
          nse_symbol: symbol,
          company_name: comp.company_name,
          change_type: 'VALUATION',
          what_changed: `Daily market quote shifted ${isUp ? '+' : ''}${comp.price_change_pct}% to ₹${comp.current_price}`,
          when_changed: new Date().toISOString(),
          why_changed: 'Exchange trading session order flow and sector liquidity reallocation.',
          source: 'NSE / BSE Real-time Feed Adapter (Yahoo / Market Cache)',
          impact: `P/E multiple adjusted to ${comp.pe_ratio ? comp.pe_ratio + 'x' : 'N/A'}; market cap ₹${comp.market_cap.toLocaleString()} Cr`,
          severity: Math.abs(comp.price_change_pct) >= 4.0 ? 'HIGH' : 'LOW',
          required_investigation: 'Compare valuation multiples against 5-dimension industry & sector benchmarks.',
          investigation_action_type: 'BENCHMARK',
          provenance: 'USER_DATA',
          provenance_label: 'Live Exchange Feed',
          metric_before: (comp.current_price / (1 + comp.price_change_pct / 100)).toFixed(1),
          metric_after: comp.current_price,
        });
      }

      // 4. FORENSIC RISKS DETECTED
      const risks = FinancialDataService.detectFinancialRisks(comp);
      risks.forEach((rk) => {
        changes.push({
          change_id: `chg-rk-${rk.risk_id}-${symbol}`,
          nse_symbol: symbol,
          company_name: comp.company_name,
          change_type: 'RISK',
          what_changed: `Forensic Risk Flag: ${rk.title}`,
          when_changed: comp.data_last_updated || new Date().toISOString().split('T')[0],
          why_changed: rk.threshold_trigger,
          source: 'SignalEdge Automated Forensic Quality Filter Engine',
          impact: `${rk.description} | ${rk.mitigation_or_context}`,
          severity: rk.severity,
          required_investigation: `Investigate ${rk.category} risk factors and verify promoter shareholding trends.`,
          investigation_action_type: 'COMPANY_RESEARCH',
          provenance: 'USER_DATA',
          provenance_label: 'Forensic Audit Matrix',
          metric_before: 'Safe Threshold',
          metric_after: rk.metric_value,
        });
      });

      // 5. CORPORATE ACTIONS & FILINGS
      const actions = FinancialDataService.getCorporateActions(symbol);
      actions.forEach((act) => {
        changes.push({
          change_id: `chg-act-${act.action_id}`,
          nse_symbol: symbol,
          company_name: comp.company_name,
          change_type: 'COMPANY_EVENT',
          what_changed: `Corporate Action: ${act.action_type} (${act.amount_or_ratio || 'Disclosed'})`,
          when_changed: act.announcement_date,
          why_changed: act.details,
          source: 'Exchange Regulatory Disclosures & Board Meeting Minutes',
          impact: `Record Date: ${act.record_date || 'TBD'} | Ex-Date: ${act.ex_date || 'TBD'}`,
          severity: 'MEDIUM',
          required_investigation: 'Assess cash flow and shareholder equity impact in Corporate Actions workspace.',
          investigation_action_type: 'COMPANY_RESEARCH',
          provenance: 'SEED_DATA',
          provenance_label: 'Exchange Disclosures & Corporate Filings',
        });
      });

      // 6. THESIS INVALIDATION & KILL SWITCH MONITORING
      const relatedTheses = theses.filter((t) => t.primary_symbol === symbol);
      relatedTheses.forEach((th) => {
        if (th.status === 'INVALIDATED') {
          changes.push({
            change_id: `chg-th-inv-${th.thesis_id}`,
            nse_symbol: symbol,
            company_name: comp.company_name,
            change_type: 'THESIS_INVALIDATION',
            what_changed: `Thesis Kill Switch Breached: "${th.title}"`,
            when_changed: th.updated_at || new Date().toISOString(),
            why_changed: th.hypothesis,
            source: 'User Thesis Lifecycle Governance Monitor',
            impact: 'Active research thesis status transitioned to INVALIDATED.',
            severity: 'CRITICAL',
            required_investigation: 'Review invalidation rationale and re-assess risk/reward assumptions in Thesis detail view.',
            investigation_action_type: 'THESIS_REVIEW',
            provenance: 'USER_DATA',
            provenance_label: 'User Research Thesis Registry',
          });
        }
      });
    });

    // Sort descending by recency and severity
    const severityWeight: Record<string, number> = {
      CRITICAL: 4,
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1,
    };

    return changes.sort((a, b) => {
      const weightDiff = (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0);
      if (weightDiff !== 0) return weightDiff;
      return new Date(b.when_changed).getTime() - new Date(a.when_changed).getTime();
    });
  }

  /**
   * Generates deduplicated, high-signal alerts for meaningful changes on watched stocks.
   * Anti-Spam Architecture:
   * 1. Suppresses low-severity noise unless explicit threshold breached.
   * 2. Deduplicates against existing unread alerts in database.
   * 3. Attaches explicit investigation routes.
   */
  public static generateIntelligentAlerts(userId: string): AlertItem[] {
    const changes = this.detectWatchedCompanyChanges([], userId);
    const existingAlerts = db.getAlerts();

    const meaningfulChanges = changes.filter(
      (c) => c.severity === 'CRITICAL' || c.severity === 'HIGH' || c.change_type === 'THESIS_INVALIDATION'
    );

    const generatedAlerts: AlertItem[] = [];

    meaningfulChanges.forEach((change) => {
      // Deduplication check: Do not create duplicate alert for same symbol and event
      const alreadyExists = existingAlerts.some(
        (a) =>
          a.affected_symbol === change.nse_symbol &&
          a.what_changed === change.what_changed
      );

      if (!alreadyExists) {
        const newAlert = db.createAlert({
          alert_type: change.change_type,
          title: `[${change.severity}] ${change.nse_symbol}: ${change.what_changed}`,
          what_changed: change.what_changed,
          why_it_matters: change.impact,
          affected_symbol: change.nse_symbol,
          link: `/company/${change.nse_symbol}`,
          severity: change.severity,
          source: change.source,
          required_investigation: change.required_investigation,
          provenance: change.provenance,
        });
        generatedAlerts.push(newAlert);
      }
    });

    return db.getAlerts();
  }

  /**
   * Returns benchmark track record stats with explicit SEED DATA provenance,
   * statistical disclaimers, and transparent validation methodology.
   */
  public static getTrackRecordWithProvenance(): TrackRecordStats {
    const rawTrackRecord = db.getTrackRecord();

    return {
      ...rawTrackRecord,
      provenance: 'SEED_DATA',
      provenance_label: 'Retrospective Historical Benchmark Data (Seed Validation Set)',
      methodology_summary:
        'Calculated by backtesting verified catalyst detection dates against subsequent public exchange filings and quarterly market price recognition windows over a 30 to 90 day lead-time horizon.',
      benchmark_comparator: 'NIFTY 50 Total Returns Index (TRI) over identical holding periods.',
      statistical_limitations:
        'Historical backtest statistics are for methodology illustration only and do not guarantee future performance. Actual outcomes depend on execution timing, liquidity constraints, and real-time market risk dynamics.',
    };
  }
}
