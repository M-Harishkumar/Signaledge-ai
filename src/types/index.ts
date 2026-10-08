export type InvestorRole = 'RETAIL_INVESTOR' | 'FAMILY_OFFICE' | 'HNI' | 'RESEARCH_ANALYST';

export interface User {
  user_id: string;
  email: string;
  display_name: string;
  role: InvestorRole;
  investment_horizon: string;
  risk_tolerance: string;
  portfolio_size_range: string;
  sectors_of_interest: string[];
  primary_goal: string;
  onboarding_completed: boolean;
  created_at: string;
}

export type SourceQualityTier =
  | 'TIER_1_OFFICIAL_REGULATORY' // Gazette, Ministry notifications, Exchange filings, Annual Reports
  | 'TIER_2_PRIMARY_MEDIA'       // Bloomberg, Reuters, Mint, Business Standard
  | 'TIER_3_INDUSTRY_BODY'       // SIAM, ASSOCHAM, Crisil, ICRA rating notes
  | 'TIER_4_UNVERIFIED_ESTIMATE';// Satellite estimates, customs vessel tracking

export type ConfidenceLabel = 'FACT' | 'HIGH_CONF' | 'SPECULATIVE' | 'INFERENCE';

export interface EvidenceItem {
  id: string;
  title: string;
  source_name: string;
  source_tier: SourceQualityTier;
  source_date: string;
  source_url?: string;
  excerpt: string;
  confidence_label: ConfidenceLabel;
}

export interface Company {
  company_id: string;
  nse_symbol: string;
  bse_code: string;
  isin: string;
  company_name: string;
  legal_name?: string;
  sector: string;
  industry: string;
  market_cap_category: 'LARGE_CAP' | 'MID_CAP' | 'SMALL_CAP' | 'MICRO_CAP';
  current_price: number;
  price_change_pct: number;
  market_cap: number; // in Cr INR
  enterprise_value?: number; // in Cr INR
  pe_ratio: number;
  forward_pe?: number;
  pb_ratio: number;
  ps_ratio?: number;
  ev_ebitda?: number;
  ev_sales?: number;
  ev_fcf?: number;
  peg_ratio?: number;
  dividend_yield?: number;
  fcf_yield?: number;
  roce: number;
  roe: number;
  roic?: number;
  roa?: number;
  operating_margin_pct?: number;
  net_margin_pct?: number;
  gross_margin_pct?: number;
  ebitda_margin_pct?: number;
  de_ratio: number;
  current_ratio?: number;
  quick_ratio?: number;
  interest_coverage?: number;
  promoter_pct: number;
  promoter_pledge_pct: number;
  fii_pct: number;
  dii_pct: number;
  mutual_fund_pct?: number;
  public_pct?: number;
  fii_qoq_change: number;
  dii_qoq_change: number;
  revenue_growth_1y?: number;
  revenue_growth_3y_cagr?: number;
  revenue_growth_5y_cagr?: number;
  profit_growth_1y?: number;
  profit_growth_3y_cagr?: number;
  eps_growth_1y?: number;
  beta?: number;
  fifty_two_week_high?: number;
  fifty_two_week_low?: number;
  day_high?: number;
  day_low?: number;
  volume?: number;
  avg_volume_10d?: number;
  signal_edge_score: number;
  prebuy_verdict: 'PASS' | 'INVESTIGATE' | 'HIGH_RISK';
  key_catalyst: string;
  business_summary: string;
  website?: string;
  headquarters?: string;
  founded_year?: number;
  exchange?: string;
  country?: string;
  data_last_updated: string;
  data_source_tier?: SourceQualityTier;
  data_freshness_label?: string;
  data_quality_tier?: 'SUPPORTED' | 'PARTIALLY_SUPPORTED' | 'DATA_UNAVAILABLE';
}

export interface DetailedFinancialStatement {
  fiscal_year: string;
  period_type: 'ANNUAL' | 'QUARTERLY';
  period_end_date?: string;
  // Income Statement
  revenue: number; // in Cr INR
  cost_of_revenue?: number;
  gross_profit?: number;
  operating_expenses?: number;
  ebitda: number;
  ebit?: number;
  operating_profit?: number;
  pbt?: number;
  tax?: number;
  pat: number;
  eps?: number;
  diluted_eps?: number;
  ebitda_margin_pct: number;
  pat_margin_pct: number;
  gross_margin_pct?: number;
  // Cash Flow Statement
  cfo: number;
  cfi?: number;
  cff?: number;
  capex: number;
  free_cash_flow: number;
  dividend_paid?: number;
  debt_repaid?: number;
  debt_raised?: number;
  // Balance Sheet Items
  total_assets?: number;
  total_liabilities?: number;
  total_equity?: number;
  net_worth?: number;
  cash_and_equivalents?: number;
  total_debt?: number;
  short_term_debt?: number;
  long_term_debt?: number;
  net_debt?: number;
  receivables?: number;
  inventory?: number;
  current_assets?: number;
  current_liabilities?: number;
  working_capital?: number;
  source?: string;
}

export interface FinancialStatement {
  fiscal_year: string;
  revenue: number; // in Cr INR
  ebitda: number;
  pat: number;
  ebitda_margin_pct: number;
  pat_margin_pct: number;
  cfo: number;
  capex: number;
  free_cash_flow: number;
}

export interface RatioRecord {
  fiscal_year: string;
  roce: number;
  roe: number;
  roic?: number;
  roa?: number;
  asset_turnover: number;
  working_capital_days: number;
  receivable_days?: number;
  inventory_days?: number;
  payable_days?: number;
  cash_conversion_cycle?: number;
  interest_coverage: number;
  debt_to_equity: number;
  debt_to_assets?: number;
  net_debt_to_ebitda?: number;
  current_ratio: number;
  quick_ratio?: number;
  pe_ratio?: number;
  pb_ratio?: number;
  ev_to_ebitda?: number;
}

export interface ShareholdingRecord {
  quarter: string;
  promoter_pct: number;
  promoter_pledged_pct: number;
  fii_pct: number;
  dii_pct: number;
  mutual_fund_pct?: number;
  public_pct: number;
  others_pct?: number;
}

export interface TechnicalIndicators {
  symbol: string;
  current_price: number;
  sma_20: number;
  sma_50: number;
  sma_200: number;
  rsi_14: number;
  macd: {
    macd_line: number;
    signal_line: number;
    histogram: number;
  };
  bollinger_bands: {
    upper: number;
    middle: number;
    lower: number;
  };
  atr_14: number;
  fifty_two_week_high: number;
  fifty_two_week_low: number;
  distance_from_52w_high_pct: number;
  distance_from_52w_low_pct: number;
  max_drawdown_1y_pct: number;
  volatility_30d_annualized_pct: number;
  price_trend_50_200: 'GOLDEN_CROSS' | 'DEATH_CROSS' | 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  calculated_at: string;
}

export interface BenchmarkComparisonItem {
  metric_name: string;
  company_value: number | string;
  industry_benchmark: number | string;
  sector_average: number | string;
  company_historical_avg: number | string;
  normalized_score: number; // 0.0 (very weak) to 1.0 (excellent)
  evaluation_band: 'EXCELLENT' | 'STRONG' | 'AVERAGE' | 'WEAK' | 'CRITICAL';
  unit: string;
  methodology: string;
}

export interface FinancialRiskFlag {
  risk_id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'SOLVENCY' | 'CASH_FLOW' | 'GOVERNANCE' | 'MARGIN' | 'VALUATION' | 'WORKING_CAPITAL';
  description: string;
  metric_value: string;
  threshold_trigger: string;
  mitigation_or_context: string;
}

export interface CorporateActionRecord {
  action_id: string;
  symbol: string;
  action_type: 'DIVIDEND' | 'SPLIT' | 'BONUS' | 'RIGHTS' | 'RESULTS' | 'AGM' | 'BOARD_MEETING';
  announcement_date: string;
  record_date?: string;
  ex_date?: string;
  details: string;
  amount_or_ratio?: string;
}

export interface TranscriptRecord {
  quarter: string;
  date: string;
  capex_guidance: string;
  margin_outlook: string;
  management_tone: 'BULLISH' | 'NEUTRAL' | 'CAUTIOUS';
  key_quotes: string[];
}

export interface FilingRecord {
  filing_id: string;
  date: string;
  title: string;
  category: 'ANNUAL_REPORT' | 'QUARTERLY_RESULTS' | 'INVESTOR_PRESENTATION' | 'CREDIT_RATING' | 'BOARD_MEETING' | 'ORDER_WIN' | 'DISCLOSURE' | 'REGULATORY_GAZETTE';
  summary: string;
  materiality_score: 'HIGH' | 'MEDIUM' | 'LOW';
  source_url?: string;
  source_organization?: string;
  extraction_status?: 'VERIFIED_GROUNDED' | 'PROCESSED' | 'PENDING';
}

export type SignalStreamId = 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7';

export type FactLevel = 'FACT' | 'CALCULATED' | 'INFERENCE' | 'UNKNOWN';

export type SignalType =
  | 'SUPPLY_CHAIN'
  | 'REGULATORY'
  | 'STRATEGY_DNA'
  | 'MACRO_SIMULATOR'
  | 'CONSTRAINT_CAST'
  | 'RESEARCH_BRIDGE'
  | 'INSTITUTIONAL'
  | 'FORENSIC_QUALITY'
  | 'CROSS_ASSET'
  | 'F1_REGULATORY'
  | 'F2_STRATEGY_DNA'
  | 'F3_INSTITUTIONAL'
  | 'F4_MACRO_CASCADE'
  | 'F5_SUPPLY_CHAIN'
  | 'F6_FORENSIC_QUALITY'
  | 'F7_CROSS_ASSET';

export interface BeneficiaryCompany {
  nse_symbol: string;
  company_name: string;
  gain_mechanism: string;
  alpha_potential_pct: number;
}

export type ExposureTier = 'DIRECT' | 'INDIRECT' | 'SECOND_ORDER' | 'UNKNOWN';

export interface AffectedCompanyExposure {
  nse_symbol: string;
  company_name: string;
  impact_direction: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  exposure_score: number; // 0 - 100
  exposure_tier?: ExposureTier;
  rationale: string;
}

export interface SignalScoringBreakdown {
  signal_strength: number; // 0-100
  source_quality: number; // 0-100
  recency: number; // 0-100
  confidence: number; // 0-100
  breadth_of_impact: number; // 0-100
  company_exposure: number; // 0-100
  total_score: number; // 0-100
}

export type RegulatoryStatus = 'ANNOUNCED' | 'PROPOSED' | 'APPROVED' | 'IMPLEMENTED' | 'DELAYED' | 'REVERSED';

export interface SupplyChainNode {
  supplier_name: string;
  raw_material_or_input: string;
  industry: string;
  company_symbol: string;
  customer_or_market: string;
  relationship_type: 'DIRECT' | 'INDIRECT' | 'POTENTIAL' | 'UNKNOWN';
  bottleneck_risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  dependency_type: 'COMMODITY' | 'GEOGRAPHIC' | 'REGULATORY' | 'SINGLE_SOURCE' | 'LOGISTICAL';
  geographic_origin: string;
  description: string;
}

export interface InstitutionalFlowData {
  fii_holding_pct: number;
  dii_holding_pct: number;
  fii_change_qoq: number;
  dii_change_qoq: number;
  promoter_holding_pct: number;
  retail_holding_pct: number;
  smart_money_divergence: number; // Δ(FII+DII) - ΔRetail
  data_period: string;
  source: string;
}

export interface InstitutionalFlowInterpretation {
  accumulation_status: 'ACCUMULATION' | 'DISTRIBUTION' | 'NEUTRAL' | 'ROTATION';
  divergence_interpretation: string;
  conviction_level: 'HIGH' | 'MODERATE' | 'LOW' | 'UNKNOWN';
  caveat: string;
}

export interface ForensicQualityItem {
  check_name: string;
  status: 'PASS' | 'FLAG' | 'INVESTIGATE' | 'UNKNOWN';
  metric_value: string | number;
  benchmark_threshold: string;
  forensic_rationale: string;
  source_tier: SourceQualityTier;
}

export interface ContradictoryFactorsSummary {
  supporting_factors: string[];
  counter_factors: string[];
  overall_uncertainty: string;
}

export interface Signal {
  signal_id: string;
  signal_type: SignalType;
  signal_stream?: SignalStreamId;
  stream_name?: string;
  signal_title: string;
  signal_summary: string;
  nse_symbol: string;
  company_name: string;
  sector: string;
  detected_at: string;
  source?: string;
  source_url?: string;
  source_tier?: SourceQualityTier;
  fact_level?: FactLevel;
  regulatory_status?: RegulatoryStatus;
  affected_industry?: string;
  affected_companies?: AffectedCompanyExposure[];
  confidence_score: number;
  confidence_label: ConfidenceLabel;
  lead_time_days: number;
  catalyst_event: string;
  impact_horizon: string;
  causal_chain: string[];
  why_am_i_seeing_this: string;
  why_it_matters?: string;
  what_could_prove_this_wrong: string[];
  what_could_invalidate_it?: string[];
  risk?: string;
  evidence_list: EvidenceItem[];
  user_rating?: 'USEFUL' | 'NOT_USEFUL';
  beneficiary_companies?: BeneficiaryCompany[];
  key_risks?: string[];
  scoring_breakdown?: SignalScoringBreakdown;
  duplicate_cluster_id?: string;
  is_cluster_primary?: boolean;
  merged_signal_count?: number;
  supply_chain_linkage?: SupplyChainNode;
  contradictory_factors?: ContradictoryFactorsSummary;
}

export interface PreBuyLayerScore {
  name: string;
  purpose: string;
  score: number;
  max: number;
  status: 'PASS' | 'FAIL' | 'UNKNOWN';
  actual_value: string | number;
  threshold: string;
  formula: string;
  explanation: string;
  source: string;
  risk_if_failed: string;
}

export interface FraudChecklistItem {
  id: number;
  name: string;
  flagged: boolean;
  status: 'PASS' | 'FAIL' | 'UNKNOWN';
  details: string;
}

export interface PreBuyResult {
  prebuy_result_id: string;
  nse_symbol: string;
  company_name: string;
  analysis_date: string;
  auto_populate_rate: number;
  gate_check: 'PASS' | 'INVESTIGATE' | 'HIGH_RISK';
  instant_disqualifiers: string[];
  layer_scores: Record<string, PreBuyLayerScore>;
  total_score: number;
  max_score: number;
  unknown_count: number;
  verdict: 'Passes screening' | 'Requires investigation' | 'High-risk screen';
  verdict_color: 'GREEN' | 'AMBER' | 'RED';
  user_thesis?: string;
  key_risks: string[];
  fraud_checklist_detected: FraudChecklistItem[];
  disclaimer: string;
}

export type ScreenerOperator = '>=' | '<=' | '>' | '<' | '=' | 'between';

export interface ScreenerFilter {
  metric: string;
  operator: ScreenerOperator;
  value: number | [number, number];
  unit?: string;
  label?: string;
}

export interface FilterEvaluationDetail {
  metric: string;
  label: string;
  actual_value: number | string;
  formatted_actual: string;
  target_value: number | [number, number];
  formatted_target: string;
  operator: ScreenerOperator;
  status: 'PASS' | 'FAIL' | 'UNKNOWN';
  reason: string;
}

export interface ScreenMatchExplanation {
  matched: boolean;
  why_matched: string;
  passed_filters: FilterEvaluationDetail[];
  failed_filters: FilterEvaluationDetail[];
  unknown_values: FilterEvaluationDetail[];
  match_percentage: number;
}

export interface QualityPillarScore {
  name: string;
  score: number; // 0 to 100
  weight_pct: number;
  grade: 'A' | 'B' | 'C' | 'D';
  metrics_analyzed: string[];
  rationale: string;
}

export interface FinancialQualityScore {
  total_score: number; // 0 to 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  verdict: string;
  pillars: {
    profitability: QualityPillarScore;
    growth: QualityPillarScore;
    leverage: QualityPillarScore;
    cash_flow: QualityPillarScore;
    capital_efficiency: QualityPillarScore;
    valuation: QualityPillarScore;
    shareholding: QualityPillarScore;
  };
}

export interface DetailedBenchmarkMetric {
  metric_name: string;
  actual_value: number;
  formatted_actual: string;
  normal_benchmark: number;
  formatted_benchmark: string;
  industry_avg: number;
  sector_avg: number;
  top_peers: Array<{ symbol: string; value: number }>;
  historical_range: { min: number; max: number; avg: number };
  relative_position: 'TOP_DECILE' | 'ABOVE_AVERAGE' | 'IN_LINE' | 'BELOW_AVERAGE' | 'LAGGING';
  score: number; // strictly 0.0 to 1.0
  unit: string;
}

export interface ScreenerResultItem {
  company: Company;
  explanation: ScreenMatchExplanation;
  quality_score: FinancialQualityScore;
  benchmark_summary: {
    overall_benchmark_score: number; // 0.0 to 1.0
    relative_rating: string;
    metrics: DetailedBenchmarkMetric[];
  };
}

export interface Screener {
  screener_id: string;
  user_id?: string;
  name: string;
  description: string;
  filters: ScreenerFilter[];
  logic: 'AND' | 'OR';
  alert_enabled: boolean;
  alert_on_new_entrants: boolean;
  alert_on_leavers: boolean;
  alert_channels: string[];
  last_run_at: string;
  last_result_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface ScenarioCase {
  name: 'Bull Case' | 'Base Case' | 'Bear Case';
  description: string;
  key_assumptions: string[];
  target_probability_pct: number;
  catalyst_triggers: string[];
  potential_impact: string;
}

export interface ResearchThesis {
  thesis_id: string;
  user_id: string;
  title: string;
  company_name?: string;
  hypothesis: string;
  sector: string;
  primary_symbol: string;
  related_symbols: string[];
  supporting_signals: string[];
  supporting_evidence: EvidenceItem[];
  contradicting_evidence: EvidenceItem[];
  assumptions?: string[];
  risks: string[];
  invalidation_triggers: string[];
  monitoring_indicators?: string[];
  bull_scenario: ScenarioCase;
  base_scenario: ScenarioCase;
  bear_scenario: ScenarioCase;
  status: 'DRAFT' | 'INVESTIGATING' | 'SUPPORTED' | 'WATCHING' | 'STRENGTHENING' | 'WEAKENING' | 'CONFIRMED' | 'INVALIDATED';
  created_at: string;
  updated_at: string;
}

export interface OpportunityItem {
  opportunity_id: string;
  nse_symbol: string;
  company_name: string;
  sector: string;
  title: string;
  thesis_snippet: string;
  opportunity_score: number; // 0 - 100
  signal_strength: 'STRONG' | 'MODERATE' | 'EARLY';
  confidence: 'HIGH' | 'MEDIUM' | 'SPECULATIVE';
  time_horizon: string;
  why_it_matters: string;
  what_could_go_wrong: string[];
  evidence_count: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'NEW' | 'INVESTIGATING' | 'VALIDATED' | 'WATCHING' | 'INVALIDATED';
  last_updated: string;
}

export interface StakeholderReaction {
  stakeholder_type: string;
  predicted_response: string;
  intensity: 'HIGH' | 'MEDIUM' | 'LOW';
  peak_reaction_day: number;
  reasoning: string;
}

export interface RiskItem {
  rank: number;
  title: string;
  probability_pct: number;
  magnitude: 'HIGH' | 'MEDIUM' | 'LOW';
  driver_stakeholder: string;
  mechanism: string;
  monitoring_indicator: string;
}

export interface DissentingView {
  agent_percentage: number;
  view: string;
  risk_implication: string;
}

export interface SimulationReport {
  report_id: string;
  session_id: string;
  generated_at: string;
  scenario: string;
  initial_shock: string;
  transmission_chain: string[];
  executive_summary: {
    primary_outcome: string;
    confidence_pct: number;
    rationale: string;
  };
  stakeholder_reactions: StakeholderReaction[];
  consensus_summary: string;
  dissenting_views: DissentingView[];
  second_order_effects: string[];
  third_order_effects: string[];
  beneficiaries: Array<{ symbol: string; reason: string; potential_impact: string }>;
  potential_losers: Array<{ symbol: string; reason: string; potential_impact: string }>;
  risk_map: RiskItem[];
  leading_indicators_to_monitor: string[];
  grounded_evidence_citations: Array<{ document_name: string; section?: string; excerpt: string }>;
  methodology: {
    simulation_mode: string;
    agent_personas_modeled: number;
    simulation_horizon_days: number;
    documents_processed: number;
    model: string;
  };
  disclaimer: string;
}

export interface SimulationSession {
  session_id: string;
  session_name: string;
  input_scenario: string;
  template_id?: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  agent_count: number;
  simulation_horizon_days: number;
  started_at: string;
  completed_at?: string;
  documents_uploaded: number;
  report?: SimulationReport;
}

export interface GeoMacroStage {
  stage_num: number;
  stage_name: string;
  input: string;
  transmission_mechanism: string;
  affected_variable: string;
  affected_industry: string;
  affected_companies: string[];
  financial_impact: string;
  risk_or_opportunity: 'RISK' | 'OPPORTUNITY' | 'NEUTRAL';
  evidence_excerpt: string;
  confidence: 'FACT' | 'INFERENCE' | 'UNKNOWN';
  uncertainty_note?: string;
  // Legacy backward-compatibility aliases
  input_event?: string;
  transmitted_effect?: string;
  next_cascade_target?: string;
  affected_entities?: string[];
}

export interface GeoMacroReport {
  report_id: string;
  event_text: string;
  generated_at: string;
  status: 'COMPLETED';
  stages: GeoMacroStage[];
  disclaimer: string;
}

export interface RegulatoryTheme {
  theme_id: string;
  title: string;
  ministry: string;
  status: 'GAZETTED' | 'DRAFT_CONSULTATION' | 'CABINET_APPROVED' | 'PARLIAMENTARY_STAGE';
  impact_summary: string;
  confidence_score: number;
  target_sectors: string[];
  beneficiary_companies: string[];
  adversely_affected_companies: string[];
  policy_timeline: Array<{ date: string; stage: string; status: 'DONE' | 'UPCOMING' }>;
}

export type MonitoringChangeType =
  | 'SIGNAL'
  | 'FINANCIAL_METRIC'
  | 'VALUATION'
  | 'RISK'
  | 'COMPANY_EVENT'
  | 'THESIS_INVALIDATION'
  | 'REGULATORY'
  | 'PREBUY'
  | 'WATCHLIST';

export type DataProvenance = 'SEED_DATA' | 'USER_DATA' | 'SIMULATION';

export interface MonitoringChangeItem {
  change_id: string;
  nse_symbol: string;
  company_name: string;
  change_type: MonitoringChangeType;
  what_changed: string;
  when_changed: string;
  why_changed: string;
  source: string;
  source_url?: string;
  impact: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  required_investigation: string;
  investigation_action_type: 'COMPANY_RESEARCH' | 'PRE_BUY_GATE' | 'THESIS_REVIEW' | 'BENCHMARK';
  provenance: DataProvenance;
  provenance_label: string;
  metric_before?: string | number;
  metric_after?: string | number;
}

export interface WatchlistCompany {
  company_id: string;
  nse_symbol: string;
  company_name: string;
  sector: string;
  current_price: number;
  price_change_pct: number;
  added_at: string;
  notes: string;
  research_status: 'WATCHING' | 'INVESTIGATING' | 'STRONG_SIGNAL' | 'WEAKENING' | 'INVALIDATED';
  linked_thesis_id?: string;
  last_gate_verdict: 'Passes screening' | 'Requires investigation' | 'High-risk screen' | 'UNKNOWN';
  last_reviewed_at: string;
}

export interface Watchlist {
  watchlist_id: string;
  name: string;
  description: string;
  is_default: boolean;
  company_count: number;
  created_at: string;
  updated_at?: string;
  alerts_enabled?: boolean;
  companies: WatchlistCompany[];
}

export interface AlertItem {
  alert_id: string;
  alert_type: MonitoringChangeType;
  title: string;
  what_changed: string;
  why_it_matters: string;
  affected_symbol: string;
  created_at: string;
  is_read: boolean;
  link: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  source?: string;
  required_investigation?: string;
  provenance?: DataProvenance;
}

export interface TrackRecordEntry {
  record_id: string;
  signal_id: string;
  signal_title: string;
  nse_symbol: string;
  signal_type: SignalType;
  detected_date: string;
  recognition_date?: string;
  lead_time_days: number;
  expected_direction: 'POSITIVE' | 'NEGATIVE';
  actual_outcome_status: 'VERIFIED_ACCURATE' | 'FALSE_POSITIVE' | 'IN_PROGRESS' | 'EXPIRED';
  alpha_generated_pct?: number;
  evaluation_notes: string;
  provenance?: DataProvenance;
}

export interface TrackRecordStats {
  total_historical_records: number;
  verified_count: number;
  false_positive_count: number;
  in_progress_count: number;
  avg_lead_time_days: number;
  win_rate_pct: number;
  is_statistically_significant: boolean;
  provenance: DataProvenance;
  provenance_label: string;
  methodology_summary: string;
  benchmark_comparator: string;
  statistical_limitations: string;
  entries: TrackRecordEntry[];
}

export interface GroundedEvidenceCitation {
  document_id: string;
  document_name: string;
  section?: string;
  page?: number;
  date?: string;
  source: string;
  company_symbol?: string;
  metric?: string;
  calculation?: string;
  excerpt: string;
  relevance_score: number;
  confidence: 'FACT' | 'CALCULATED' | 'INFERENCE' | 'UNKNOWN';
}

export type OpportunityClassification =
  | 'HIGH_INTEREST'
  | 'INVESTIGATE'
  | 'WATCH'
  | 'WEAK'
  | 'INSUFFICIENT_DATA';

export interface FinancialExposureDetail {
  segment: string;
  metric_at_risk: string;
  expected_direction: 'POSITIVE' | 'NEGATIVE';
  exposure_tier?: ExposureTier;
  rationale: string;
  confidence_label: FactLevel; // FACT | CALCULATED | INFERENCE | UNKNOWN
}

export interface PreBuyStatusSummary {
  verdict: 'Passes screening' | 'Requires investigation' | 'High-risk screen';
  score: number;
  max_score: number;
  unknown_count: number;
  passed_layers: string[];
  failed_layers: Array<{
    layer: string;
    actual: string;
    threshold: string;
    source: string;
    impact: string;
  }>;
  unknown_layers: string[];
  status_message: string;
}

export interface ResearchScoreComponent {
  name: string;
  score: number; // 0 - 100
  weight_pct: number;
  definition: string;
  formula: string;
  reason: string;
  source: string;
  confidence_label: FactLevel;
}

export interface CompositeResearchScore {
  total_score: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  verdict: string;
  components: {
    signal_strength: ResearchScoreComponent;
    evidence_quality: ResearchScoreComponent;
    financial_quality: ResearchScoreComponent;
    industry_tailwind: ResearchScoreComponent;
    valuation: ResearchScoreComponent;
    risk: ResearchScoreComponent;
    prebuy_gate: ResearchScoreComponent;
    thesis_confidence: ResearchScoreComponent;
  };
  disclaimer: string;
}

export interface OpportunityCase {
  opportunity_id: string;
  company: Company;
  signal?: Signal;
  catalyst_event: string;
  affected_industry: string;
  opportunity_classification?: OpportunityClassification;
  classification_reason?: string;
  exposure_classification?: ExposureTier;
  supply_chain_linkage?: SupplyChainNode[];
  contradictory_factors?: ContradictoryFactorsSummary;
  evidence_list: EvidenceItem[];
  financial_exposure: FinancialExposureDetail;
  potential_upside_driver: string;
  financial_quality: FinancialQualityScore;
  benchmark_summary: {
    overall_benchmark_score: number;
    relative_rating: string;
    metrics: DetailedBenchmarkMetric[];
  };
  risk_matrix: FinancialRiskFlag[];
  prebuy_status: PreBuyStatusSummary;
  simulation_summary?: {
    session_id?: string;
    primary_outcome?: string;
    consensus?: string;
    confidence_pct?: number;
    key_risks?: string[];
  };
  thesis_status?: {
    thesis_id?: string;
    status?: string;
    hypothesis?: string;
    bull_prob?: number;
    base_prob?: number;
    bear_prob?: number;
    invalidation_triggers?: string[];
  };
  watchlist_status: {
    is_in_watchlist: boolean;
    watchlist_name?: string;
    research_status?: string;
    notes?: string;
  };
  monitoring_status: {
    recent_changes_count: number;
    latest_change?: string;
    latest_severity?: string;
    alerts_count: number;
  };
  composite_research_score: CompositeResearchScore;
  invalidation_triggers: string[];
  data_quality_label: FactLevel;
  disclaimer: string;
}

export interface MacroExposureItem {
  driver: string;
  category: 'COMMODITY' | 'CURRENCY' | 'MACRO_RATES' | 'GEOPOLITICAL' | 'REGULATORY' | 'SUPPLY_CHAIN';
  affected_count: number;
  affected_symbols: string[];
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  evidence: string;
  possible_transmission: string;
  mitigation_summary: string;
}

export interface ConcentrationItem {
  name: string;
  count: number;
  percentage: number;
  symbols: string[];
}

export interface PortfolioRiskSummary {
  total_companies_monitored: number;
  sector_concentration: ConcentrationItem[];
  industry_concentration: ConcentrationItem[];
  leverage_risk_count: number;
  leverage_risk_symbols: string[];
  valuation_risk_count: number;
  valuation_risk_symbols: string[];
  governance_risk_count: number;
  governance_risk_symbols: string[];
  macro_exposures: MacroExposureItem[];
  shared_risks: MacroExposureItem[];
  disclaimer: string;
}

export interface ThesisDeltaEvaluation {
  thesis_id: string;
  symbol: string;
  current_status: string;
  evaluated_impact: 'THESIS_STRENGTHENED' | 'THESIS_WEAKENED' | 'THESIS_UNCHANGED' | 'THESIS_INVALIDATED';
  confidence_label: FactLevel;
  rationale: string;
  supporting_deltas: MonitoringChangeItem[];
  invalidation_triggers_breached: string[];
  recommended_action: string;
}

export type EvidenceSourceType =
  | 'PRIMARY_REGULATORY'
  | 'COMPANY_FILING'
  | 'FINANCIAL_DATA_PROVIDER'
  | 'SECONDARY_MEDIA'
  | 'INDUSTRY_BODY'
  | 'CALCULATED'
  | 'AI_INFERENCE'
  | 'UNKNOWN';

export type DataMode = 'LIVE' | 'AUDITED' | 'SEEDED' | 'SIMULATED';

export interface ContradictoryEvidenceItem {
  source_type: EvidenceSourceType;
  source_name: string;
  source_date: string;
  contradiction_summary: string;
  data_mode: DataMode;
  impact_on_claim: 'WEAKENS' | 'MODIFIES_TIMELINE' | 'DISPUTES_MAGNITUDE' | 'CRITICAL_REFUTATION';
}

export interface ResearchClaimItem {
  claim_id: string;
  statement: string;
  claim_type: 'CATALYST' | 'FINANCIAL_METRIC' | 'VALUATION' | 'RISK' | 'MANAGEMENT_GUIDANCE' | 'MACRO_TRANSMISSION';
  source_type: EvidenceSourceType;
  source_name: string;
  source_tier: SourceQualityTier;
  source_url?: string;
  retrieval_date: string;
  data_period: string;
  formula_or_derivation?: string;
  confidence_level: FactLevel;
  data_mode: DataMode;
  supporting_evidence_ids: string[];
  contradictory_evidence?: ContradictoryEvidenceItem[];
  uncertainty_rationale?: string;
}

export interface ClaimEvidenceMapping {
  company_symbol: string;
  total_claims: number;
  claims: ResearchClaimItem[];
  verified_facts_count: number;
  calculated_count: number;
  inferences_count: number;
  contradictions_count: number;
  overall_traceability_grade: 'A+' | 'A' | 'B' | 'C';
}

export interface HistoricalDeltaRecord {
  delta_id: string;
  company_symbol: string;
  field_changed: string;
  previous_value: string | number | null;
  new_value: string | number | null;
  change_magnitude_pct?: number;
  detected_at: string;
  source_tier: SourceQualityTier;
  source_name: string;
  source_url?: string;
  data_mode: DataMode;
  fact_level: FactLevel;
  thesis_impact: 'SUPPORTS' | 'CONTRADICTS' | 'NEUTRAL' | 'CRITICAL_RISK';
  explanation: string;
}

export interface ThesisEvolutionEvent {
  event_id: string;
  thesis_id: string;
  timestamp: string;
  state_before: string;
  state_after: string;
  trigger_type: 'CATALYST_CONFIRMED' | 'FINANCIAL_DELTA' | 'RISK_SPIKE' | 'KILL_SWITCH_BREACH' | 'SCHEDULED_REVIEW';
  trigger_description: string;
  evidence_at_the_time: EvidenceItem[];
  known_at_the_time: {
    price?: number;
    roce?: number;
    de_ratio?: number;
    pe_ratio?: number;
    status: string;
  };
  known_now: {
    current_status: string;
    subsequent_deltas_count: number;
  };
  evaluation_verdict: 'THESIS_STRENGTHENED' | 'THESIS_WEAKENED' | 'THESIS_INVALIDATED' | 'THESIS_UNCHANGED';
  reasoning: string;
  hindsight_bias_safeguard: string;
}

export interface ResearchScorePillarAudit {
  pillar_id: string;
  name: string;
  weight_pct: number;
  raw_input: string | number;
  normalized_score: number; // 0 - 100
  formula: string;
  reason: string;
  confidence: FactLevel;
  double_counting_risk: 'NONE' | 'LOW' | 'DECORRELATED';
  decorrelation_note?: string;
}

export interface ResearchScoreAuditExplanation {
  overall_score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  verdict: string;
  pillars: ResearchScorePillarAudit[];
  double_counting_analysis: {
    potential_overlaps_checked: string[];
    decorrelation_adjustments: string[];
    audit_verdict: string;
  };
  mathematical_consistency: string;
}

export interface InvestigationNode {
  node_id: string;
  node_type: 'DISCOVERY' | 'SIGNAL' | 'COMPANY' | 'FINANCIALS' | 'BENCHMARK' | 'RISK' | 'PREBUY' | 'SIMULATION' | 'THESIS' | 'MONITORING';
  title: string;
  status: 'VERIFIED' | 'CAUTION' | 'CRITICAL' | 'UNKNOWN';
  fact_level: FactLevel;
  data_mode: DataMode;
  headline: string;
  details: Record<string, any>;
  parent_id?: string;
  children_ids: string[];
}

export interface InvestigationTree {
  company_symbol: string;
  company_name: string;
  nodes: InvestigationNode[];
  root_node_id: string;
  summary: string;
}

export interface ResearchDossier {
  dossier_id: string;
  generated_at: string;
  company: Company;
  opportunity_case: OpportunityCase;
  claim_evidence_mapping: ClaimEvidenceMapping;
  score_audit: ResearchScoreAuditExplanation;
  investigation_tree: InvestigationTree;
  historical_evolution: ThesisEvolutionEvent[];
  recent_deltas: HistoricalDeltaRecord[];
  contradictory_evidence_summary: {
    has_conflicts: boolean;
    conflicting_points: Array<{
      positive_aspect: string;
      negative_counterweight: string;
      uncertainty_level: string;
      research_interpretation: string;
    }>;
  };
  disclaimer: string;
}

export interface InvestigationAction {
  action_id: string;
  action_type: 'COMPANY_RESEARCH' | 'PRE_BUY_GATE' | 'SCREENER' | 'EVIDENCE' | 'SIMULATION' | 'THESIS' | 'OPPORTUNITY_CASE' | 'RISK_AGGREGATION' | 'RESEARCH_DOSSIER' | 'INVESTIGATION_TREE';
  title: string;
  description: string;
  payload: {
    symbol?: string;
    filters?: ScreenerFilter[];
    scenario?: string;
    screener_id?: string;
    [key: string]: any;
  };
}

export interface AssistantChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AssistantResponse {
  answer: string;
  tools_called: Array<{
    tool: string;
    parameters: any;
    result_summary: string;
    execution_status: 'SUCCESS' | 'ERROR' | 'UNKNOWN';
  }>;
  evidence_citations: GroundedEvidenceCitation[];
  investigation_actions: InvestigationAction[];
  data_quality_label: 'FACT' | 'CALCULATED' | 'INFERENCE' | 'UNKNOWN';
  disclaimer: string;
}

export type FreshnessStatus = 'LIVE' | 'RECENT' | 'STALE' | 'HISTORICAL' | 'UNKNOWN';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  retrievedAt: string;
  companySymbol?: string;
  companyName?: string;
  provider: 'YAHOO_FINANCE' | 'GOOGLE_NEWS_RSS' | 'OFFICIAL_FILING' | 'STATUTORY_FEED';
  freshnessStatus: FreshnessStatus;
  sourceTier: SourceQualityTier;
  sentiment?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  relativeTimeStr?: string;
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


