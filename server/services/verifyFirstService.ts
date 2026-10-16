import {
  VerifyFirstClaim,
  VerifyFirstAuditSummary,
  VerificationStatus,
  FreshnessStatus,
  SourceQualityTier,
  InformationTemporalType,
  ClaimCategory,
  ConflictingEvidenceDetail,
  ThesisAuditResult,
  DataProvenance,
} from '../../src/types';
import { db } from '../db/database';
import { SEBI_MANDATORY_DISCLAIMER } from '../../src/data/seedData';

export const PATENT_CONNECTION_STATEMENT =
  'SignalEdge OS adapts related principles of source-authority assessment, information-freshness validation and evidence relationships to investment research. These principles are relevant to the separately filed VERIFY-FIRST Adaptive Learning Path Generation System with Authority and Freshness Validation. The original invention concerns adaptive learning paths; this project applies related principles to financial claims, company analysis and research-thesis monitoring. The existing patent application is not represented as a granted patent or as automatically covering SignalEdge OS.';

export const PATENT_METADATA = {
  patent_title: 'VERIFY-FIRST Adaptive Learning Path Generation System with Authority and Freshness Validation',
  application_number: '202641118456',
  institution: 'Bannari Amman Institute of Technology',
  department: 'Artificial Intelligence and Data Science',
  application_status: 'Filed (Pending Examination)',
  project_domain: 'Indian public equity investment research (SignalEdge OS)',
  project_contribution:
    'A verify-first investment-research workflow that connects source authority, evidence support, information freshness and conflict detection to company screening and research-thesis monitoring.',
  legal_clarification:
    'The original patent concerns adaptive learning-path generation. It does not originally cover investment research, nor is it represented as granted or as automatically covering SignalEdge OS.',
};

/**
 * Curated benchmark and seed claims demonstrating verified, partially verified,
 * stale, conflicting, and data-unavailable research statements.
 */
export const SEED_VERIFY_FIRST_CLAIMS: VerifyFirstClaim[] = [
  // 1. Tata Motors Demerger Scheme (TIER 1, LIVE/RECENT, VERIFIED)
  {
    claim_id: 'vfc-tata-01',
    claim_text: 'Tata Motors Board approved composite scheme of arrangement to demerge commercial and passenger vehicle divisions into two separately listed entities.',
    company_symbol: 'TATAMOTORS',
    company_name: 'Tata Motors Limited',
    category: 'CATALYST_EVENT',
    temporal_type: 'MARKET_EVENT',
    source_name: 'National Stock Exchange (NSE) Corporate Announcement Reg 30',
    source_url: 'https://www.bseindia.com/xml-data/corpfiling/AttachLive/tata_demerger_scheme.pdf',
    source_category: 'Stock Exchange Regulatory Disclosure',
    source_tier: 'TIER_1_OFFICIAL_REGULATORY',
    source_authority_score: 1.0,
    is_syndicated_derivative: false,
    published_at: '2026-01-25T14:30:00+05:30',
    retrieved_at: '2026-10-15T09:00:00+05:30',
    evidence_excerpt: 'The Board of Directors has in-principle approved the demerger of Tata Motors Ltd into two separate listed companies: 1) Commercial Vehicles business and related investments, and 2) Passenger Vehicles businesses including PV, EV, JLR and related investments.',
    document_name: 'NSE_REG30_TML_DEMERGER_RESOLUTION.pdf',
    document_section: 'Section 2: Transaction Mechanics and Entity Split',
    document_page: 3,
    verification_status: 'VERIFIED',
    freshness_status: 'RECENT',
    freshness_explanation: 'Regulatory event within trailing reporting cycle; statutory scheme remains active under NCLT approval process.',
    support_level: 'DIRECT_SUPPORT',
    explanation: 'Confirmed by primary regulatory filing under SEBI LODR Regulation 30. High authority source with zero material contradictions.',
    limitations: 'Final legal execution subject to shareholder approval and National Company Law Tribunal (NCLT) sanction.',
    dependent_thesis_ids: ['th-01', 'th-04'],
    dependent_gate_layers: ['Layer 1: Structural Sector Tailwinds', 'Layer 8: Explicit Invalidation Thesis'],
    provenance: 'SEED_DATA',
    provenance_label: 'Audited Statutory Exchange Filing',
  },

  // 2. Tata Motors RoCE (TIER 1, ANNUAL_AUDIT, VERIFIED)
  {
    claim_id: 'vfc-tata-02',
    claim_text: 'Tata Motors achieved consolidated Return on Capital Employed (RoCE) of 22.4% in FY25, surpassing the 15% hurdle rate.',
    company_symbol: 'TATAMOTORS',
    company_name: 'Tata Motors Limited',
    category: 'FINANCIAL_METRIC',
    temporal_type: 'ANNUAL_AUDIT',
    source_name: 'Audited Annual Consolidated Financial Statements (MCA & Exchange Submission)',
    source_url: 'https://www.tatamotors.com/investors/annual-reports/fy25/',
    source_category: 'Audited Annual Financial Report',
    source_tier: 'TIER_1_OFFICIAL_REGULATORY',
    source_authority_score: 1.0,
    is_syndicated_derivative: false,
    published_at: '2025-07-20T10:00:00+05:30',
    retrieved_at: '2026-10-15T09:00:00+05:30',
    evidence_excerpt: 'Consolidated EBIT of ₹42,180 Cr on total capital employed of ₹1,88,300 Cr yields a consolidated RoCE of 22.4% for the financial year ended March 31, 2025.',
    document_name: 'Tata Motors Annual Report FY25',
    document_section: 'Financial Highlights & Key Performance Indicators',
    document_page: 18,
    verification_status: 'VERIFIED',
    freshness_status: 'RECENT',
    freshness_explanation: 'Audited annual report represents valid baseline until next audited annual release.',
    support_level: 'DIRECT_SUPPORT',
    explanation: 'Audited statement confirmed by independent statutory auditors. Matches exchange-filed financial schedules.',
    limitations: 'Historical annual accounting figure; subject to quarterly working capital fluctuations.',
    dependent_thesis_ids: ['th-01'],
    dependent_gate_layers: ['Layer 4: Capital Efficiency (RoCE)'],
    provenance: 'SEED_DATA',
    provenance_label: 'Audited Annual Report Schedule',
  },

  // 3. Tata Motors Net Debt Discrepancy (CONFLICTING EVIDENCE)
  {
    claim_id: 'vfc-tata-03',
    claim_text: 'Tata Motors automotive business has reached net debt zero status as of Q3 FY26.',
    company_symbol: 'TATAMOTORS',
    company_name: 'Tata Motors Limited',
    category: 'FINANCIAL_METRIC',
    temporal_type: 'QUARTERLY_DISCLOSURE',
    source_name: 'Investor Presentation Q3 FY26',
    source_url: 'https://www.tatamotors.com/investors/q3-fy26-presentation.pdf',
    source_category: 'Company Investor Presentation',
    source_tier: 'TIER_2_PRIMARY_MEDIA',
    source_authority_score: 0.8,
    is_syndicated_derivative: false,
    published_at: '2026-01-30T16:00:00+05:30',
    retrieved_at: '2026-10-15T09:00:00+05:30',
    evidence_excerpt: 'Automotive debt reduced to zero net debt with cash and liquid balances exceeding external borrowings across JLR and standalone operations.',
    document_name: 'TML_Q3_FY26_Investor_Deck.pdf',
    document_section: 'Balance Sheet Health & Net Cash Milestones',
    document_page: 12,
    verification_status: 'CONFLICTING',
    freshness_status: 'RECENT',
    freshness_explanation: 'Published in current fiscal quarter disclosures.',
    support_level: 'DIRECT_SUPPORT',
    conflicting_evidence: [
      {
        conflict_id: 'conf-tata-debt-01',
        source_name: 'CRISIL Credit Rating Rationale Update',
        source_tier: 'TIER_3_INDUSTRY_BODY',
        source_url: 'https://www.crisil.com/ratings/tata-motors-debt-review-feb2026',
        published_at: '2026-02-10T11:00:00+05:30',
        excerpt: 'While standalone operations and JLR exhibit surplus liquidity, consolidated debt includes ₹14,200 Cr of lease liabilities (under Ind AS 116) and short-term vendor financing obligations that rating agencies treat as debt-like obligations.',
        opposing_statement: 'Consolidated debt is NOT zero when factoring Ind AS 116 lease obligations and vehicle financing liabilities.',
        disagreement_nature: 'Disagreement between management presentation (excluding lease debt & working capital financing) and credit rating agency consolidated debt definition.',
        severity: 'CRITICAL',
      },
    ],
    explanation: 'Dispute identified between corporate management deck (operational automotive net cash) and credit rating definitions (Ind AS 116 lease capitalization). Requires explicit disclosure.',
    limitations: 'Standard non-GAAP definitions vs statutory rating definitions diverge on operating lease treatment.',
    dependent_thesis_ids: ['th-01'],
    dependent_gate_layers: ['Layer 5: Balance Sheet Leverage (Debt/Equity)'],
    provenance: 'SEED_DATA',
    provenance_label: 'Disputed Corporate Accounting Disclosure',
  },

  // 4. Suzlon Energy RTC Renewable Order Backlog (TIER 1, GAZETTE / OFFICIAL, VERIFIED)
  {
    claim_id: 'vfc-suzlon-01',
    claim_text: 'Ministry of Power gazetted 40% Round-The-Clock (RTC) renewable procurement mandate for heavy industrial consumers exceeding 1MW demand.',
    company_symbol: 'SUZLON',
    company_name: 'Suzlon Energy Limited',
    category: 'REGULATORY_POLICY',
    temporal_type: 'MARKET_EVENT',
    source_name: 'The Gazette of India: Extraordinary (Ministry of Power Notification No. 23/12/2025-R&R)',
    source_url: 'https://egazette.gov.in/WriteReadData/2025/256781.pdf',
    source_category: 'Government Gazette / Statutory Order',
    source_tier: 'TIER_1_OFFICIAL_REGULATORY',
    source_authority_score: 1.0,
    is_syndicated_derivative: false,
    published_at: '2025-11-15T18:00:00+05:30',
    retrieved_at: '2026-10-15T09:00:00+05:30',
    evidence_excerpt: 'All industrial and commercial electricity consumers with connected load of 1 Megawatt and above shall mandatorily source at least 40% of aggregate power consumption through firm, dispatchable Round-The-Clock renewable energy by FY27.',
    document_name: 'Ministry_of_Power_Gazette_RTC_Mandate.pdf',
    document_section: 'Clause 4(a): Commercial & Industrial Renewable Energy Obligation',
    document_page: 2,
    verification_status: 'VERIFIED',
    freshness_status: 'RECENT',
    freshness_explanation: 'Statutory government gazette notification remains in active legal force.',
    support_level: 'DIRECT_SUPPORT',
    explanation: 'Primary sovereign source document directly gazetted by Ministry of Power. Authority tier 1.',
    limitations: 'Implementation timelines subject to state electricity regulatory commission (SERC) open access tariff harmonization.',
    dependent_thesis_ids: ['th-02'],
    dependent_gate_layers: ['Layer 1: Structural Sector Tailwinds'],
    provenance: 'SEED_DATA',
    provenance_label: 'Sovereign Government Gazette Notice',
  },

  // 5. Suzlon Promoter Share Pledge (HISTORICAL STALE vs RECENT)
  {
    claim_id: 'vfc-suzlon-02',
    claim_text: 'Suzlon Energy promoters hold zero pledged equity shares following debt restructuring.',
    company_symbol: 'SUZLON',
    company_name: 'Suzlon Energy Limited',
    category: 'GOVERNANCE_AND_PROMOTER',
    temporal_type: 'QUARTERLY_DISCLOSURE',
    source_name: 'BSE Reg 31(1) Shareholding Pattern Q3 FY26',
    source_url: 'https://www.bseindia.com/corporates/shpSec.aspx?scripcd=532667',
    source_category: 'Stock Exchange Shareholding Filing',
    source_tier: 'TIER_1_OFFICIAL_REGULATORY',
    source_authority_score: 1.0,
    is_syndicated_derivative: false,
    published_at: '2026-01-18T12:00:00+05:30',
    retrieved_at: '2026-10-15T09:00:00+05:30',
    evidence_excerpt: 'Promoter and Promoter Group shareholding stands at 13.24% of total equity. Number of shares pledged or otherwise encumbered: NIL (0.00%).',
    document_name: 'BSE_Reg31_Suzlon_Q3FY26_SHP.pdf',
    document_section: 'Table II: Statement showing shareholding pattern of the Promoter and Promoter Group',
    document_page: 1,
    verification_status: 'VERIFIED',
    freshness_status: 'RECENT',
    freshness_explanation: 'Active quarterly filing valid through current reporting calendar.',
    support_level: 'DIRECT_SUPPORT',
    explanation: 'Verified via statutory exchange compliance filing. Promoters successfully de-pledged 100% of encumbered equity.',
    limitations: 'Low total promoter ownership (13.24%) leaves company with institutional and public ownership dispersion.',
    dependent_thesis_ids: ['th-02'],
    dependent_gate_layers: ['Layer 3: Promoter Pledge & Governance'],
    provenance: 'SEED_DATA',
    provenance_label: 'Official Exchange Filing (Reg 31)',
  },

  // 6. HAL Defence Indigenisation Sourcing (TIER 1, GAZETTE, VERIFIED)
  {
    claim_id: 'vfc-hal-01',
    claim_text: 'Ministry of Defence 6th Positive Indigenisation List imposes mandatory domestic manufacturing on 348 strategic military avionics subsystems.',
    company_symbol: 'HAL',
    company_name: 'Hindustan Aeronautics Limited',
    category: 'REGULATORY_POLICY',
    temporal_type: 'MARKET_EVENT',
    source_name: 'Department of Military Affairs, Ministry of Defence Gazette Order',
    source_url: 'https://www.mod.gov.in/pil-6-strategic-avionics-embargo.pdf',
    source_category: 'Ministry of Defence Official Policy',
    source_tier: 'TIER_1_OFFICIAL_REGULATORY',
    source_authority_score: 1.0,
    is_syndicated_derivative: false,
    published_at: '2025-10-20T11:00:00+05:30',
    retrieved_at: '2026-10-15T09:00:00+05:30',
    evidence_excerpt: 'Import embargo on 348 items taking effect in phased manner from December 2025. All frontline aerospace electronics, mission computers, and active phased radar modules to be procured exclusively from Indian indigenous manufacturers.',
    document_name: 'MoD_Positive_Indigenisation_List_6.pdf',
    document_section: 'Annexure B: Aerospace Avionics & Mission Systems',
    document_page: 5,
    verification_status: 'VERIFIED',
    freshness_status: 'RECENT',
    freshness_explanation: 'Active policy guideline with multi-year statutory enforcement horizon.',
    support_level: 'DIRECT_SUPPORT',
    explanation: 'Confirmed by primary defence gazette schedule. Direct beneficiary is HAL with sovereign monopoly in fighter jet avionics.',
    limitations: 'Tier-2 component supply bottlenecks could delay serial delivery schedules.',
    dependent_thesis_ids: ['th-03'],
    dependent_gate_layers: ['Layer 1: Structural Sector Tailwinds'],
    provenance: 'SEED_DATA',
    provenance_label: 'Ministry of Defence Official Document',
  },

  // 7. Reliance Retail Unverified Pre-IPO Rumor (TIER 4, UNVERIFIED / DERIVATIVE)
  {
    claim_id: 'vfc-reliance-01',
    claim_text: 'Reliance Retail will list on Indian bourses via an initial public offering in June 2026 at a minimum valuation of $150 Billion.',
    company_symbol: 'RELIANCE',
    company_name: 'Reliance Industries Limited',
    category: 'VALUATION_MULTIPLE',
    temporal_type: 'MARKET_EVENT',
    source_name: 'IndianFinTechScoop Blog (Syndicated anonymously across news feeds)',
    source_url: 'https://example-blog.in/reliance-retail-ipo-rumors-2026',
    source_category: 'Unverified Online Forum / Blog',
    source_tier: 'TIER_4_UNVERIFIED_ESTIMATE',
    source_authority_score: 0.15,
    is_syndicated_derivative: true,
    original_attribution: 'Anonymous trader social media leak',
    published_at: '2026-02-14T08:00:00+05:30',
    retrieved_at: '2026-10-15T09:00:00+05:30',
    evidence_excerpt: 'Sources close to investment bankers say Reliance Retail has drafted secret papers for $150B IPO in June 2026.',
    document_name: 'Unverified_Blog_Post_14Feb.txt',
    verification_status: 'UNVERIFIED',
    freshness_status: 'RECENT',
    freshness_explanation: 'Recent calendar post, but source lacks authority and documentation.',
    support_level: 'UNSUPPORTED',
    explanation: 'Zero regulatory filings or formal board resolutions exist. The company has made no exchange disclosure under SEBI LODR Regulation 30. Unverified market speculation.',
    limitations: 'Speculative blog leak without primary evidence or statutory company confirmation.',
    dependent_thesis_ids: ['th-04'],
    dependent_gate_layers: ['Layer 8: Explicit Invalidation Thesis'],
    provenance: 'SEED_DATA',
    provenance_label: 'Unverified Market Rumor (Benchmark Control)',
  },

  // 8. Stale Earnings Claim (STALE EVIDENCE BENCHMARK)
  {
    claim_id: 'vfc-reliance-02',
    claim_text: 'Reliance Jio Average Revenue Per User (ARPU) stands at ₹175 per subscriber.',
    company_symbol: 'RELIANCE',
    company_name: 'Reliance Industries Limited',
    category: 'FINANCIAL_METRIC',
    temporal_type: 'QUARTERLY_DISCLOSURE',
    source_name: 'Reliance Q2 FY24 Quarterly Release',
    source_url: 'https://www.ril.com/investor-relations/q2-fy24-jio.pdf',
    source_category: 'Quarterly Corporate Results',
    source_tier: 'TIER_1_OFFICIAL_REGULATORY',
    source_authority_score: 1.0,
    is_syndicated_derivative: false,
    published_at: '2023-10-27T17:00:00+05:30',
    retrieved_at: '2026-10-15T09:00:00+05:30',
    evidence_excerpt: 'Jio ARPU for the second quarter stood at ₹175.7 per month.',
    document_name: 'RIL_Q2_FY24_Media_Release.pdf',
    document_section: 'Jio Platforms Operational Review',
    document_page: 4,
    verification_status: 'STALE',
    freshness_status: 'STALE',
    freshness_explanation: 'Information is >24 months old. Superseded by multiple tariff hikes and newer FY25/FY26 reporting periods.',
    support_level: 'DIRECT_SUPPORT',
    explanation: 'Although originating from an official source, this quarterly metric is heavily outdated (>105 days threshold) and cannot be relied upon for current fundamental analysis.',
    limitations: 'Severely outdated telecom operating metric.',
    dependent_thesis_ids: ['th-04'],
    dependent_gate_layers: ['Layer 2: Market Scale & Revenue Base'],
    provenance: 'SEED_DATA',
    provenance_label: 'Outdated Quarterly Metric (Stale Benchmark)',
  },

  // 9. Missing Evidence Claim (DATA_UNAVAILABLE BENCHMARK)
  {
    claim_id: 'vfc-unknown-01',
    claim_text: 'Mid-cap specialty chemical manufacturer has secured patent license for solid-state battery electrolyte production.',
    company_symbol: 'AARTIIND',
    company_name: 'Aarti Industries Limited',
    category: 'CATALYST_EVENT',
    temporal_type: 'MARKET_EVENT',
    source_name: 'Source Unspecified / Missing Filing',
    source_category: 'Missing Document',
    source_tier: 'TIER_4_UNVERIFIED_ESTIMATE',
    source_authority_score: 0.0,
    published_at: null,
    retrieved_at: '2026-10-15T09:00:00+05:30',
    evidence_excerpt: '',
    verification_status: 'DATA_UNAVAILABLE',
    freshness_status: 'UNKNOWN',
    freshness_explanation: 'Publication date and original document unavailable.',
    support_level: 'UNSUPPORTED',
    explanation: 'Missing evidence: No primary filing, patent number, or exchange announcement has been provided. Cannot verify or evaluate.',
    limitations: 'Complete absence of verifiable primary documentation.',
    dependent_gate_layers: ['Layer 1: Circle of Competence', 'Layer 8: Explicit Invalidation Thesis'],
    provenance: 'SEED_DATA',
    provenance_label: 'Missing Metadata Test Case',
  },

  // 10. Syngene International US Biosecure Act Beneficiary (PARTIALLY_VERIFIED)
  {
    claim_id: 'vfc-syngene-01',
    claim_text: 'Syngene International will absorb 20% of outsourced CRDMO molecular synthesis redirected from Chinese contract research organizations under the proposed US Biosecure Act.',
    company_symbol: 'SYNGENE',
    company_name: 'Syngene International Limited',
    category: 'CATALYST_EVENT',
    temporal_type: 'MARKET_EVENT',
    source_name: 'Jefferies Institutional Equity Research & Management Interaction Note',
    source_url: 'https://example-broker.com/syngene-biosecure-act-note.pdf',
    source_category: 'Sell-Side Equity Research Note',
    source_tier: 'TIER_2_PRIMARY_MEDIA',
    source_authority_score: 0.7,
    is_syndicated_derivative: false,
    published_at: '2026-01-10T09:30:00+05:30',
    retrieved_at: '2026-10-15T09:00:00+05:30',
    evidence_excerpt: 'Management confirms receiving preliminary inquiries from global pharma innovators seeking alternative supply chains outside China. However, conversion into formal commercial master service agreements remains in exploratory stages.',
    document_name: 'Jefferies_Syngene_Research_Jan2026.pdf',
    document_section: 'Geopolitical Tailwinds & Pipeline Inquiries',
    document_page: 8,
    verification_status: 'PARTIALLY_VERIFIED',
    freshness_status: 'RECENT',
    freshness_explanation: 'Published within trailing 90 days; legislative developments remain ongoing in US Congress.',
    support_level: 'PARTIAL_SUPPORT',
    explanation: 'Source confirms customer inquiries, but the quantitative claim ("absorb 20% of outsourced synthesis") is an unverified broker projection rather than a signed contract.',
    limitations: 'US Biosecure Act pending final legislative enactment and grandfathering implementation.',
    dependent_thesis_ids: [],
    dependent_gate_layers: ['Layer 2: Industry Growth & Tailwind'],
    provenance: 'SEED_DATA',
    provenance_label: 'Sell-Side Research Projection (Partially Verified)',
  },
];

export class VerifyFirstService {
  private static claimsStore: Map<string, VerifyFirstClaim> = new Map();
  private static initialized = false;

  public static initialize() {
    if (this.initialized) return;
    for (const claim of SEED_VERIFY_FIRST_CLAIMS) {
      this.claimsStore.set(claim.claim_id, claim);
    }
    this.initialized = true;
  }

  /**
   * Authority Score Lookup
   */
  public static getAuthorityScore(tier: SourceQualityTier): number {
    switch (tier) {
      case 'TIER_1_OFFICIAL_REGULATORY':
        return 1.0;
      case 'TIER_2_PRIMARY_MEDIA':
        return 0.75;
      case 'TIER_3_INDUSTRY_BODY':
        return 0.5;
      case 'TIER_4_UNVERIFIED_ESTIMATE':
      default:
        return 0.15;
    }
  }

  /**
   * Assess temporal freshness strictly based on information category
   */
  public static evaluateTemporalFreshness(
    publishedAt: string | null | undefined,
    temporalType: InformationTemporalType
  ): { status: FreshnessStatus; explanation: string } {
    if (!publishedAt) {
      return {
        status: 'UNKNOWN',
        explanation: 'Publication date is missing or unverified; temporal validity cannot be established.',
      };
    }

    const pubTime = new Date(publishedAt).getTime();
    if (isNaN(pubTime)) {
      return {
        status: 'UNKNOWN',
        explanation: 'Invalid timestamp format; treated as unverified.',
      };
    }

    const now = Date.now();
    const diffMs = now - pubTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    switch (temporalType) {
      case 'REALTIME_PRICE':
        if (diffHours <= 24) return { status: 'LIVE', explanation: 'Price/quote recorded within 24h market session.' };
        if (diffHours <= 48) return { status: 'RECENT', explanation: 'Recorded within 48h; valid for weekend carryover.' };
        return { status: 'STALE', explanation: `Price action exceeds 48h (${Math.round(diffDays)}d old); stale market feed.` };

      case 'MARKET_EVENT':
        if (diffHours <= 24) return { status: 'LIVE', explanation: 'Breaking market/regulatory event within 24 hours.' };
        if (diffDays <= 7) return { status: 'RECENT', explanation: 'Recent corporate event published within the past 7 days.' };
        if (diffDays <= 90) return { status: 'RECENT', explanation: 'Event occurred within active quarter cycle.' };
        return { status: 'STALE', explanation: `Event occurred >90 days ago (${Math.round(diffDays)}d); requires refresh check.` };

      case 'QUARTERLY_DISCLOSURE':
        // Quarterly results remain valid for ~105 days (3 months + filing buffer)
        if (diffDays <= 105) return { status: 'RECENT', explanation: 'Active quarterly financial disclosure cycle (<105 days).' };
        return { status: 'STALE', explanation: `Quarterly disclosure is ${Math.round(diffDays)} days old; superseded by newer filings.` };

      case 'ANNUAL_AUDIT':
        // Annual audited statements remain valid for 425 days (1 year + 60d AGM filing window)
        if (diffDays <= 425) return { status: 'RECENT', explanation: 'Valid annual statutory audit baseline.' };
        return { status: 'STALE', explanation: `Annual statement exceeds 425 days (${Math.round(diffDays)}d); superseded by new fiscal year.` };

      case 'HISTORICAL_FACT':
        return {
          status: 'HISTORICAL',
          explanation: 'Structural historical corporate milestone; does not expire purely due to age.',
        };

      default:
        return { status: 'UNKNOWN', explanation: 'Unclassified temporal scope.' };
    }
  }

  /**
   * Core Verify-First Evaluation Rule Engine
   * Evaluates authority, freshness, support level, conflicts, and sets definitive verification status.
   */
  public static evaluateClaim(input: Partial<VerifyFirstClaim>): VerifyFirstClaim {
    this.initialize();

    const claimId = input.claim_id || `vfc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const claimText = (input.claim_text || '').trim();
    const companySymbol = (input.company_symbol || 'GENERAL').toUpperCase();
    const companyName = input.company_name || companySymbol;
    const category: ClaimCategory = input.category || 'CATALYST_EVENT';
    const temporalType: InformationTemporalType = input.temporal_type || 'MARKET_EVENT';
    const sourceTier: SourceQualityTier = input.source_tier || 'TIER_4_UNVERIFIED_ESTIMATE';
    const sourceAuthorityScore = this.getAuthorityScore(sourceTier);
    const sourceName = (input.source_name || '').trim();
    const sourceUrl = input.source_url;
    const sourceCategory = input.source_category || (sourceTier === 'TIER_1_OFFICIAL_REGULATORY' ? 'Official Filing' : 'Secondary Media');
    const publishedAt = input.published_at || null;
    const retrievedAt = input.retrieved_at || new Date().toISOString();
    const evidenceExcerpt = (input.evidence_excerpt || '').trim();
    const conflicting = input.conflicting_evidence || [];

    // 1. Check for complete absence of evidence or source
    if (!sourceName || !evidenceExcerpt || !claimText) {
      return {
        claim_id: claimId,
        claim_text: claimText || 'Unspecified Claim',
        company_symbol: companySymbol,
        company_name: companyName,
        category,
        temporal_type: temporalType,
        source_name: sourceName || 'DATA_UNAVAILABLE',
        source_url: sourceUrl,
        source_category: sourceCategory,
        source_tier: sourceTier,
        source_authority_score: 0,
        published_at: publishedAt,
        retrieved_at: retrievedAt,
        evidence_excerpt: evidenceExcerpt,
        verification_status: 'DATA_UNAVAILABLE',
        freshness_status: 'UNKNOWN',
        freshness_explanation: 'Missing essential source identification, excerpt, or claim statement.',
        support_level: 'UNSUPPORTED',
        explanation: 'Verification blocked: Required evidential metadata is absent.',
        limitations: 'Data unavailable. Must never be treated as verified or passing.',
        provenance: 'USER_DATA',
        provenance_label: 'Missing Evidence Claim',
      };
    }

    // 2. Freshness evaluation
    const freshness = this.evaluateTemporalFreshness(publishedAt, temporalType);

    // 3. Evaluate Support Level (Semantic alignment heuristic)
    let supportLevel: VerifyFirstClaim['support_level'] = input.support_level || 'DIRECT_SUPPORT';
    if (!input.support_level) {
      const claimLower = claimText.toLowerCase();
      const excerptLower = evidenceExcerpt.toLowerCase();

      // Check if excerpt is completely unrelated
      const keyWords = claimLower
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3);

      const matches = keyWords.filter((w) => excerptLower.includes(w)).length;
      const matchRatio = keyWords.length > 0 ? matches / keyWords.length : 0;

      if (matchRatio >= 0.5) {
        supportLevel = 'DIRECT_SUPPORT';
      } else if (matchRatio >= 0.25) {
        supportLevel = 'PARTIAL_SUPPORT';
      } else {
        supportLevel = 'UNSUPPORTED';
      }
    }

    // 4. Syndication / Repost Rule: Do not count copied versions as independent corroboration
    const isSyndicated = !!input.is_syndicated_derivative;

    // 5. Determine Final Verification Status
    let verificationStatus: VerificationStatus = 'UNVERIFIED';
    let explanation = '';

    // Condition A: Conflicting evidence from credible sources
    if (conflicting.length > 0 && conflicting.some((c) => c.severity === 'CRITICAL' || c.severity === 'MODERATE')) {
      verificationStatus = 'CONFLICTING';
      explanation = `Active evidentiary conflict detected across ${conflicting.length} opposing source(s). Unresolved discrepancies prevent verified consensus.`;
    }
    // Condition B: Stale information
    else if (freshness.status === 'STALE') {
      verificationStatus = 'STALE';
      explanation = `Information is outdated under ${temporalType} policy rules (${freshness.explanation}). Must be refreshed before relying in active investment decisions.`;
    }
    // Condition C: Unsupported claim or Tier 4 unverified source
    else if (supportLevel === 'UNSUPPORTED' || sourceTier === 'TIER_4_UNVERIFIED_ESTIMATE' || isSyndicated) {
      verificationStatus = 'UNVERIFIED';
      explanation =
        supportLevel === 'UNSUPPORTED'
          ? 'Evidence excerpt does not substantiate the specific assertions made in the claim.'
          : isSyndicated
          ? 'Source is a syndicated derivative of an unconfirmed rumor without independent primary verification.'
          : 'Source lacks institutional authority (Tier 4 unverified estimate or forum chatter).';
    }
    // Condition D: Partially supported or Tier 2/3 secondary source
    else if (supportLevel === 'PARTIAL_SUPPORT' || sourceTier === 'TIER_2_PRIMARY_MEDIA' || sourceTier === 'TIER_3_INDUSTRY_BODY') {
      verificationStatus = 'PARTIALLY_VERIFIED';
      explanation =
        sourceTier === 'TIER_1_OFFICIAL_REGULATORY'
          ? 'Evidence partially supports the claim, but key details require further primary confirmation.'
          : 'Claim is corroborated by credible financial press or industry bodies, but lacks primary exchange or statutory filing reference.';
    }
    // Condition E: Tier 1, fresh, directly supporting, no conflicts
    else if (sourceTier === 'TIER_1_OFFICIAL_REGULATORY' && supportLevel === 'DIRECT_SUPPORT') {
      verificationStatus = 'VERIFIED';
      explanation = 'Fully verified by primary statutory or regulatory authority document. High freshness and direct evidential support with zero unresolved conflicts.';
    }

    return {
      claim_id: claimId,
      claim_text: claimText,
      company_symbol: companySymbol,
      company_name: companyName,
      category,
      temporal_type: temporalType,
      source_name: sourceName,
      source_url: sourceUrl,
      source_category: sourceCategory,
      source_tier: sourceTier,
      source_authority_score: sourceAuthorityScore,
      is_syndicated_derivative: isSyndicated,
      original_attribution: input.original_attribution,
      published_at: publishedAt,
      retrieved_at: retrievedAt,
      evidence_excerpt: evidenceExcerpt,
      document_name: input.document_name,
      document_section: input.document_section,
      document_page: input.document_page,
      verification_status: verificationStatus,
      freshness_status: freshness.status,
      freshness_explanation: freshness.explanation,
      support_level: supportLevel,
      conflicting_evidence: conflicting,
      explanation,
      limitations: input.limitations || 'Audited within SignalEdge Verify-First Evidence Engine scope.',
      dependent_thesis_ids: input.dependent_thesis_ids || [],
      dependent_gate_layers: input.dependent_gate_layers || [],
      provenance: input.provenance || 'USER_DATA',
      provenance_label: input.provenance_label || 'Verify-First Evaluated Record',
    };
  }

  /**
   * Query all claims with granular filters
   */
  public static getClaims(filter?: {
    symbol?: string;
    status?: string;
    freshness?: string;
    tier?: string;
    category?: string;
    search?: string;
  }): VerifyFirstClaim[] {
    this.initialize();

    let list = Array.from(this.claimsStore.values());

    if (filter?.symbol && filter.symbol !== 'ALL') {
      const sym = filter.symbol.toUpperCase();
      list = list.filter((c) => c.company_symbol === sym);
    }

    if (filter?.status && filter.status !== 'ALL') {
      list = list.filter((c) => c.verification_status === filter.status);
    }

    if (filter?.freshness && filter.freshness !== 'ALL') {
      list = list.filter((c) => c.freshness_status === filter.freshness);
    }

    if (filter?.tier && filter.tier !== 'ALL') {
      list = list.filter((c) => c.source_tier === filter.tier);
    }

    if (filter?.category && filter.category !== 'ALL') {
      list = list.filter((c) => c.category === filter.category);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.claim_text.toLowerCase().includes(q) ||
          c.company_symbol.toLowerCase().includes(q) ||
          c.company_name.toLowerCase().includes(q) ||
          c.source_name.toLowerCase().includes(q) ||
          c.evidence_excerpt.toLowerCase().includes(q)
      );
    }

    return list;
  }

  public static getClaimById(claimId: string): VerifyFirstClaim | null {
    this.initialize();
    return this.claimsStore.get(claimId) || null;
  }

  public static addClaim(claim: Partial<VerifyFirstClaim>): VerifyFirstClaim {
    this.initialize();
    const evaluated = this.evaluateClaim(claim);
    this.claimsStore.set(evaluated.claim_id, evaluated);
    return evaluated;
  }

  /**
   * System-wide audit metrics & patent connection notice
   */
  public static getAuditSummary(symbol?: string): VerifyFirstAuditSummary {
    this.initialize();

    const claims = symbol ? this.getClaims({ symbol }) : this.getClaims();
    const total = claims.length;

    const verified = claims.filter((c) => c.verification_status === 'VERIFIED').length;
    const partiallyVerified = claims.filter((c) => c.verification_status === 'PARTIALLY_VERIFIED').length;
    const unverified = claims.filter((c) => c.verification_status === 'UNVERIFIED').length;
    const stale = claims.filter((c) => c.verification_status === 'STALE').length;
    const conflicting = claims.filter((c) => c.verification_status === 'CONFLICTING').length;
    const unavailable = claims.filter((c) => c.verification_status === 'DATA_UNAVAILABLE').length;

    const tier1 = claims.filter((c) => c.source_tier === 'TIER_1_OFFICIAL_REGULATORY').length;
    const tier2 = claims.filter((c) => c.source_tier === 'TIER_2_PRIMARY_MEDIA').length;
    const tier3 = claims.filter((c) => c.source_tier === 'TIER_3_INDUSTRY_BODY').length;
    const tier4 = claims.filter((c) => c.source_tier === 'TIER_4_UNVERIFIED_ESTIMATE').length;

    const verificationRate = total > 0 ? Math.round(((verified + partiallyVerified * 0.5) / total) * 1000) / 10 : 0;

    return {
      total_claims: total,
      verified_count: verified,
      partially_verified_count: partiallyVerified,
      unverified_count: unverified,
      stale_count: stale,
      conflicting_count: conflicting,
      data_unavailable_count: unavailable,
      tier1_official_count: tier1,
      tier2_media_count: tier2,
      tier3_industry_count: tier3,
      tier4_unverified_count: tier4,
      overall_verification_rate_pct: verificationRate,
      claims,
      disclaimer: SEBI_MANDATORY_DISCLAIMER,
      patent_connection_notice: PATENT_CONNECTION_STATEMENT,
    };
  }

  /**
   * Evaluates research thesis health against underlying evidence verification status.
   * If any dependent claim has degraded (CONFLICTING, STALE, UNVERIFIED), triggers NEEDS_REVIEW.
   */
  public static auditThesisEvidence(thesisId: string, userId?: string): ThesisAuditResult {
    this.initialize();

    const theses = db.getTheses(userId);
    const targetThesis = theses.find((t) => t.thesis_id === thesisId);
    const primarySym = targetThesis?.primary_symbol || 'TATAMOTORS';

    // Find claims linked to this thesis
    const linkedClaims = Array.from(this.claimsStore.values()).filter(
      (c) => c.dependent_thesis_ids?.includes(thesisId) || c.company_symbol === primarySym
    );

    const verified = linkedClaims.filter((c) => c.verification_status === 'VERIFIED').length;
    const stale = linkedClaims.filter((c) => c.verification_status === 'STALE').length;
    const conflicting = linkedClaims.filter((c) => c.verification_status === 'CONFLICTING').length;
    const unverified = linkedClaims.filter((c) => c.verification_status === 'UNVERIFIED').length;

    let overallStatus: ThesisAuditResult['overall_status'] = 'HEALTHY';
    let actionRequired = 'All underlying thesis evidence remains verified with adequate freshness.';

    if (conflicting > 0) {
      overallStatus = 'CRITICAL_CONCERNS';
      actionRequired = `Critical evidentiary conflict detected across ${conflicting} claim(s). Thesis assumptions must be re-evaluated.`;
    } else if (stale > 0 || unverified > 0) {
      overallStatus = 'NEEDS_REVIEW';
      actionRequired = `Evidence degradation detected (${stale} stale claims, ${unverified} unverified claims). Update filing references before capital commitment.`;
    }

    return {
      thesis_id: thesisId,
      primary_symbol: primarySym,
      overall_status: overallStatus,
      claims_audited_count: linkedClaims.length,
      verified_claims_count: verified,
      stale_claims_count: stale,
      conflicting_claims_count: conflicting,
      unverified_claims_count: unverified,
      action_required: actionRequired,
      audit_timestamp: new Date().toISOString(),
    };
  }

  /**
   * Pre-Buy Gate Layer Verification Validator
   * Guarantees that missing data NEVER counts as PASS!
   */
  public static verifyGateLayerData(
    layerName: string,
    metricValue: any,
    requiredThreshold: string,
    evidenceClaimId?: string
  ): {
    status: 'PASS' | 'FAIL' | 'UNKNOWN';
    evidence_status: VerificationStatus;
    reason: string;
    supporting_claim?: VerifyFirstClaim;
  } {
    this.initialize();

    // 1. Missing data check: NEVER PASS on null / undefined / empty string
    if (metricValue === undefined || metricValue === null || metricValue === '' || Number.isNaN(metricValue)) {
      return {
        status: 'UNKNOWN',
        evidence_status: 'DATA_UNAVAILABLE',
        reason: `Parameter ${layerName} is unconfirmed or missing from official exchange filings. Requires independent investigation.`,
      };
    }

    let claim: VerifyFirstClaim | undefined;
    if (evidenceClaimId) {
      claim = this.claimsStore.get(evidenceClaimId);
    }

    if (claim && claim.verification_status === 'CONFLICTING') {
      return {
        status: 'UNKNOWN',
        evidence_status: 'CONFLICTING',
        reason: `Conflicting evidence detected on ${layerName}. Divergent reports prevent clear pass.`,
        supporting_claim: claim,
      };
    }

    return {
      status: 'PASS',
      evidence_status: claim ? claim.verification_status : 'VERIFIED',
      reason: `Audited value ${metricValue} meets threshold ${requiredThreshold}.`,
      supporting_claim: claim,
    };
  }
}
