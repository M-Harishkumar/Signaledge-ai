import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from '../config';
import {
  SEED_COMPANIES,
  SEED_SIGNALS,
  SEED_REGULATORY_THEMES,
  SEED_SCREENERS,
  SEED_SIMULATIONS,
  SEED_WATCHLISTS,
  SEED_ALERTS,
  SEED_OPPORTUNITIES,
  SEED_THESES,
  SEED_TRACK_RECORD,
} from '../../src/data/seedData';
import {
  Company,
  Signal,
  RegulatoryTheme,
  Screener,
  SimulationSession,
  Watchlist,
  WatchlistCompany,
  AlertItem,
  OpportunityItem,
  ResearchThesis,
  TrackRecordStats,
  InvestorRole,
  HistoricalDeltaRecord,
  ThesisEvolutionEvent,
} from '../../src/types';

export interface StoredUser {
  user_id: string;
  email: string;
  password_hash: string;
  password_salt: string;
  display_name: string;
  role: InvestorRole;
  investment_horizon: string;
  risk_tolerance: string;
  portfolio_size_range: string;
  sectors_of_interest: string[];
  primary_goal: string;
  onboarding_completed: boolean;
  created_at: string;
  reset_token?: string;
  reset_token_expires?: string;
}

export interface StoredSession {
  token: string;
  user_id: string;
  created_at: string;
  expires_at: string;
}

export interface DatabaseSchema {
  users: StoredUser[];
  sessions: StoredSession[];
  companies: Company[];
  signals: Signal[];
  regulatoryThemes: RegulatoryTheme[];
  screeners: (Screener & { user_id?: string })[];
  simulations: (SimulationSession & { user_id?: string })[];
  watchlists: (Watchlist & { user_id?: string })[];
  theses: (ResearchThesis & { user_id?: string })[];
  opportunities: OpportunityItem[];
  trackRecord: TrackRecordStats;
  user_signal_ratings: Array<{ user_id: string; signal_id: string; rating: 'USEFUL' | 'NOT_USEFUL' }>;
  alerts: AlertItem[];
  historicalDeltas: HistoricalDeltaRecord[];
  thesisEvolutions: ThesisEvolutionEvent[];
}

export const SEED_HISTORICAL_DELTAS: HistoricalDeltaRecord[] = [
  {
    delta_id: 'dt-001',
    company_symbol: 'SUZLON',
    field_changed: 'DEBT_TO_EQUITY',
    previous_value: 1.45,
    new_value: 0.08,
    change_magnitude_pct: -94.48,
    detected_at: '2025-11-20T10:30:00+05:30',
    source_tier: 'TIER_1_OFFICIAL_REGULATORY',
    source_name: 'BSE/NSE Q2 FY26 Financial Results & Balance Sheet Filing',
    source_url: 'https://www.bseindia.com/corporates/results.html',
    data_mode: 'AUDITED',
    fact_level: 'FACT',
    thesis_impact: 'SUPPORTS',
    explanation: 'Deleveraging rights issue and debt retirement reduced D/E from 1.45x to 0.08x, structurally curing distress overhang.',
  },
  {
    delta_id: 'dt-002',
    company_symbol: 'SUZLON',
    field_changed: 'ORDER_BOOK_MW',
    previous_value: 1613,
    new_value: 3800,
    change_magnitude_pct: 135.59,
    detected_at: '2025-12-15T14:00:00+05:30',
    source_tier: 'TIER_1_OFFICIAL_REGULATORY',
    source_name: 'BSE Corporate Announcement: 3.8 GW Milestone Order Book',
    source_url: 'https://www.bseindia.com/corporates/ann.html',
    data_mode: 'AUDITED',
    fact_level: 'FACT',
    thesis_impact: 'SUPPORTS',
    explanation: 'C&I orders surged following Ministry C&I renewable mandates, scaling multi-year revenue visibility.',
  },
  {
    delta_id: 'dt-003',
    company_symbol: 'SUZLON',
    field_changed: 'RAW_MATERIAL_COMMODITY_COST',
    previous_value: 'STABLE',
    new_value: 'ELEVATED',
    change_magnitude_pct: 18.2,
    detected_at: '2026-01-10T09:15:00+05:30',
    source_tier: 'TIER_2_PRIMARY_MEDIA',
    source_name: 'Metal & Resin Commodity Price Index (Crisil)',
    data_mode: 'AUDITED',
    fact_level: 'CALCULATED',
    thesis_impact: 'CONTRADICTS',
    explanation: 'Surge in composite glass fiber and neodymium raw material prices represents gross margin headwind (-120 bps).',
  },
  {
    delta_id: 'dt-004',
    company_symbol: 'TATAMOTORS',
    field_changed: 'NET_AUTOMOTIVE_DEBT',
    previous_value: '₹18,500 Cr',
    new_value: '₹-1,200 Cr (Net Cash)',
    change_magnitude_pct: -106.49,
    detected_at: '2025-10-18T16:00:00+05:30',
    source_tier: 'TIER_1_OFFICIAL_REGULATORY',
    source_name: 'JLR Q2 Earnings Release & Balance Sheet Audit',
    data_mode: 'AUDITED',
    fact_level: 'FACT',
    thesis_impact: 'SUPPORTS',
    explanation: 'JLR achieved net cash milestone, unlocking free cash flow compounding for the domestic CV/PV split.',
  },
  {
    delta_id: 'dt-005',
    company_symbol: 'HAL',
    field_changed: 'DEFENSE_PROCUREMENT_CLEARANCE',
    previous_value: 'PENDING_CCS',
    new_value: 'APPROVED_CCS_26K_CR',
    detected_at: '2025-11-28T18:00:00+05:30',
    source_tier: 'TIER_1_OFFICIAL_REGULATORY',
    source_name: 'Press Information Bureau (PIB) - Cabinet Committee on Security',
    source_url: 'https://pib.gov.in/PressReleasePage.aspx',
    data_mode: 'AUDITED',
    fact_level: 'FACT',
    thesis_impact: 'SUPPORTS',
    explanation: 'CCS cleared ₹26,000 Cr Su-30MKI engine upgrade and Tejas Mk1A radar indigenisation.',
  },
  {
    delta_id: 'dt-006',
    company_symbol: 'HAL',
    field_changed: 'GE_F404_ENGINE_DELIVERY',
    previous_value: 'ON_SCHEDULE',
    new_value: 'DELAYED_Q4',
    change_magnitude_pct: -25.0,
    detected_at: '2026-01-20T11:45:00+05:30',
    source_tier: 'TIER_2_PRIMARY_MEDIA',
    source_name: 'Defense Aviation Review & Supply Chain Disruption Report',
    data_mode: 'AUDITED',
    fact_level: 'INFERENCE',
    thesis_impact: 'CONTRADICTS',
    explanation: 'GE Aerospace engine supply delays could defer FY26 delivery schedule by 1-2 quarters.',
  },
];

export const SEED_THESIS_EVOLUTIONS: ThesisEvolutionEvent[] = [
  {
    event_id: 'evo-001',
    thesis_id: 'th-01',
    timestamp: '2025-08-15T10:00:00+05:30',
    state_before: 'UNINITIALIZED',
    state_after: 'INITIAL_HYPOTHESIS',
    trigger_type: 'CATALYST_CONFIRMED',
    trigger_description: 'Initial opportunity discovered: Suzlon debt restructuring & Renewable obligations draft policy.',
    evidence_at_the_time: [
      {
        id: 'ev-init-01',
        title: 'Draft Ministry of Power C&I Mandate',
        source_name: 'Ministry of Power Gazette',
        source_tier: 'TIER_1_OFFICIAL_REGULATORY',
        source_date: '2025-08-10',
        excerpt: 'Draft proposal requiring 40% C&I consumption from renewable sources by 2028.',
        confidence_label: 'FACT',
      },
    ],
    known_at_the_time: {
      price: 44.5,
      roce: 14.2,
      de_ratio: 0.45,
      pe_ratio: 38.0,
      status: 'INVESTIGATING',
    },
    known_now: {
      current_status: 'VALIDATED',
      subsequent_deltas_count: 3,
    },
    evaluation_verdict: 'THESIS_STRENGTHENED',
    reasoning: 'Hypothesis formed around balance sheet recovery and sovereign regulatory push for wind energy.',
    hindsight_bias_safeguard: 'Evaluated purely using financial metrics and policy drafts available on 2025-08-15. No subsequent execution assumptions included.',
  },
  {
    event_id: 'evo-002',
    thesis_id: 'th-01',
    timestamp: '2025-11-20T11:00:00+05:30',
    state_before: 'INITIAL_HYPOTHESIS',
    state_after: 'BALANCE_SHEET_DELEVERAGED',
    trigger_type: 'FINANCIAL_DELTA',
    trigger_description: 'Q2 FY26 balance sheet filing confirmed net cash inflection and D/E drop to 0.08x.',
    evidence_at_the_time: [
      {
        id: 'ev-q2-01',
        title: 'Suzlon Q2 FY26 Audited Financial Filing',
        source_name: 'BSE Financial Filing',
        source_tier: 'TIER_1_OFFICIAL_REGULATORY',
        source_date: '2025-11-20',
        excerpt: 'Net cash balance at ₹1,120 Cr; interest burden reduced by 92% YoY.',
        confidence_label: 'FACT',
      },
    ],
    known_at_the_time: {
      price: 58.2,
      roce: 22.4,
      de_ratio: 0.08,
      pe_ratio: 32.5,
      status: 'VALIDATED',
    },
    known_now: {
      current_status: 'VALIDATED',
      subsequent_deltas_count: 2,
    },
    evaluation_verdict: 'THESIS_STRENGTHENED',
    reasoning: 'Solvency risk definitively removed; interest cost savings directly accrete to profit before tax.',
    hindsight_bias_safeguard: 'Recorded strictly at time of Q2 filing publication. Did not anticipate subsequent raw material inflation.',
  },
  {
    event_id: 'evo-003',
    thesis_id: 'th-01',
    timestamp: '2026-01-15T15:30:00+05:30',
    state_before: 'BALANCE_SHEET_DELEVERAGED',
    state_after: 'MONITORING_SUPPLY_CONSTRAINTS',
    trigger_type: 'RISK_SPIKE',
    trigger_description: 'Commodity inflation in composite resin and grid connectivity bottlenecks surfaced.',
    evidence_at_the_time: [
      {
        id: 'ev-risk-01',
        title: 'Crisil Wind Supply Chain Cost Pressures Note',
        source_name: 'Crisil Research',
        source_tier: 'TIER_3_INDUSTRY_BODY',
        source_date: '2026-01-12',
        excerpt: 'Neodymium and resin prices rose 18%, putting near-term pressure on fixed-price EPC contracts.',
        confidence_label: 'HIGH_CONF',
      },
    ],
    known_at_the_time: {
      price: 74.0,
      roce: 24.8,
      de_ratio: 0.05,
      pe_ratio: 42.0,
      status: 'VALIDATED',
    },
    known_now: {
      current_status: 'VALIDATED',
      subsequent_deltas_count: 0,
    },
    evaluation_verdict: 'THESIS_UNCHANGED',
    reasoning: 'Core structural volume thesis intact due to 3.8 GW order backlog with pass-through clauses, but short-term margin caution warranted.',
    hindsight_bias_safeguard: 'Uncertainty documented transparently. Valuation multiple re-rating headroom moderated to reflect margin squeeze risk.',
  },
];

export class Database {
  private schema: DatabaseSchema;
  private filePath: string;

  constructor() {
    this.filePath = config.storeFilePath;
    this.schema = this.loadOrInitialize();
  }

  private hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }

  private loadOrInitialize(): DatabaseSchema {
    if (!fs.existsSync(config.dataDir)) {
      fs.mkdirSync(config.dataDir, { recursive: true });
    }

    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all collections and seed companies exist if loaded from older JSON
        if (!parsed.theses) parsed.theses = [...SEED_THESES];
        if (!parsed.opportunities) parsed.opportunities = [...SEED_OPPORTUNITIES];
        if (!parsed.trackRecord) parsed.trackRecord = { ...SEED_TRACK_RECORD };
        if (!parsed.historicalDeltas) parsed.historicalDeltas = [...SEED_HISTORICAL_DELTAS];
        if (!parsed.thesisEvolutions) parsed.thesisEvolutions = [...SEED_THESIS_EVOLUTIONS];

        if (!parsed.companies || !Array.isArray(parsed.companies)) {
          parsed.companies = [...SEED_COMPANIES].map((c) => ({
            ...c,
            data_quality_tier: c.data_quality_tier || 'SUPPORTED',
          }));
        } else {
          const existingSyms = new Set(parsed.companies.map((c: Company) => c.nse_symbol));
          SEED_COMPANIES.forEach((seedComp) => {
            if (!existingSyms.has(seedComp.nse_symbol)) {
              parsed.companies.push({
                ...seedComp,
                data_quality_tier: seedComp.data_quality_tier || 'SUPPORTED',
              });
            }
          });
          parsed.companies.forEach((c: Company) => {
            if (!c.data_quality_tier) {
              c.data_quality_tier = 'SUPPORTED';
            }
          });
        }

        if (!parsed.signals || !Array.isArray(parsed.signals) || parsed.signals.length < SEED_SIGNALS.length) {
          parsed.signals = [...SEED_SIGNALS];
        } else {
          const existingSigIds = new Set(parsed.signals.map((s: Signal) => s.signal_id));
          SEED_SIGNALS.forEach((seedSig) => {
            if (!existingSigIds.has(seedSig.signal_id)) {
              parsed.signals.push(seedSig);
            }
          });
        }

        if (!parsed.regulatoryThemes || !Array.isArray(parsed.regulatoryThemes)) {
          parsed.regulatoryThemes = [...SEED_REGULATORY_THEMES];
        }

        return parsed;
      } catch (err) {
        console.warn('Corrupted database file, reinitializing with seed data:', err);
      }
    }

    // Default Seed Demo User
    const defaultSalt = crypto.randomBytes(16).toString('hex');
    const defaultHash = this.hashPassword('password123', defaultSalt);

    const defaultUser: StoredUser = {
      user_id: 'usr-default-01',
      email: 'investor@signaledge.in',
      password_hash: defaultHash,
      password_salt: defaultSalt,
      display_name: 'Aravind Kumar',
      role: 'RETAIL_INVESTOR',
      investment_horizon: '7-15YR',
      risk_tolerance: 'MODERATE_AGGRESSIVE',
      portfolio_size_range: '50L-2CR',
      sectors_of_interest: ['Automotive', 'Defense & Aerospace', 'Specialty Chemicals', 'Renewable Energy'],
      primary_goal: 'DISCOVERY',
      onboarding_completed: true,
      created_at: '2026-01-15T09:00:00+05:30',
    };

    const initial: DatabaseSchema = {
      users: [defaultUser],
      sessions: [
        {
          token: 'demo-session-token-2026',
          user_id: defaultUser.user_id,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      companies: [...SEED_COMPANIES],
      signals: [...SEED_SIGNALS],
      regulatoryThemes: [...SEED_REGULATORY_THEMES],
      screeners: SEED_SCREENERS.map((s) => ({ ...s, user_id: defaultUser.user_id })),
      simulations: SEED_SIMULATIONS.map((s) => ({ ...s, user_id: defaultUser.user_id })),
      watchlists: SEED_WATCHLISTS.map((w) => ({ ...w, user_id: defaultUser.user_id })),
      theses: SEED_THESES.map((t) => ({ ...t, user_id: defaultUser.user_id })),
      opportunities: [...SEED_OPPORTUNITIES],
      trackRecord: { ...SEED_TRACK_RECORD },
      user_signal_ratings: [
        { user_id: defaultUser.user_id, signal_id: 'sig-001', rating: 'USEFUL' },
        { user_id: defaultUser.user_id, signal_id: 'sig-002', rating: 'USEFUL' },
        { user_id: defaultUser.user_id, signal_id: 'sig-003', rating: 'USEFUL' },
      ],
      alerts: [...SEED_ALERTS],
      historicalDeltas: [...SEED_HISTORICAL_DELTAS],
      thesisEvolutions: [...SEED_THESIS_EVOLUTIONS],
    };

    this.persistSync(initial);
    return initial;
  }

  private persistSync(dataToPersist?: DatabaseSchema) {
    const data = dataToPersist || this.schema;
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      try {
        const tempPath = `${this.filePath}.tmp`;
        fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
        fs.copyFileSync(tempPath, this.filePath);
        fs.unlinkSync(tempPath);
      } catch (innerErr) {
        console.error('Failed to persist database:', innerErr);
      }
    }
  }

  // --- USER OPERATIONS ---
  public getUserByEmail(email: string): StoredUser | undefined {
    return this.schema.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(userId: string): StoredUser | undefined {
    return this.schema.users.find((u) => u.user_id === userId);
  }

  public createUser(userData: {
    email: string;
    passwordPlain: string;
    displayName: string;
  }): StoredUser {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = this.hashPassword(userData.passwordPlain, salt);

    const newUser: StoredUser = {
      user_id: `usr-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      email: userData.email.toLowerCase(),
      password_hash: hash,
      password_salt: salt,
      display_name: userData.displayName,
      role: 'RETAIL_INVESTOR',
      investment_horizon: '3-7YR',
      risk_tolerance: 'MODERATE',
      portfolio_size_range: '10L-50L',
      sectors_of_interest: ['Automotive', 'Renewable Energy'],
      primary_goal: 'DISCOVERY',
      onboarding_completed: false,
      created_at: new Date().toISOString(),
    };

    this.schema.users.push(newUser);

    // Create a default focus watchlist for the new user
    this.schema.watchlists.push({
      watchlist_id: `wl-${Date.now()}`,
      user_id: newUser.user_id,
      name: 'Primary Watchlist',
      description: 'Your top monitored ideas and investment theses',
      is_default: true,
      company_count: 2,
      created_at: new Date().toISOString(),
      companies: [
        {
          company_id: 'comp-01',
          nse_symbol: 'TATAMOTORS',
          company_name: 'Tata Motors',
          sector: 'Automotive',
          current_price: 942.5,
          price_change_pct: 1.85,
          added_at: new Date().toISOString(),
          notes: 'Demerger catalyst + EV market leadership',
          research_status: 'INVESTIGATING',
          last_gate_verdict: 'Passes screening',
          last_reviewed_at: new Date().toISOString().split('T')[0],
        },
        {
          company_id: 'comp-02',
          nse_symbol: 'SUZLON',
          company_name: 'Suzlon Energy',
          sector: 'Renewable Energy',
          current_price: 68.2,
          price_change_pct: 3.45,
          added_at: new Date().toISOString(),
          notes: 'Deleveraged balance sheet + C&I wind demand',
          research_status: 'STRONG_SIGNAL',
          last_gate_verdict: 'Passes screening',
          last_reviewed_at: new Date().toISOString().split('T')[0],
        },
      ],
    });

    this.persistSync();
    return newUser;
  }

  public verifyPassword(user: StoredUser, passwordPlain: string): boolean {
    const hash = this.hashPassword(passwordPlain, user.password_salt);
    return hash === user.password_hash;
  }

  public updateUser(userId: string, updates: Partial<StoredUser>): StoredUser | null {
    const user = this.getUserById(userId);
    if (!user) return null;

    if (updates.password_hash) user.password_hash = updates.password_hash;
    if (updates.password_salt) user.password_salt = updates.password_salt;
    if (updates.display_name) user.display_name = updates.display_name;
    if (updates.role) user.role = updates.role;
    if (updates.investment_horizon) user.investment_horizon = updates.investment_horizon;
    if (updates.risk_tolerance) user.risk_tolerance = updates.risk_tolerance;
    if (updates.sectors_of_interest) user.sectors_of_interest = updates.sectors_of_interest;
    if (updates.onboarding_completed !== undefined) user.onboarding_completed = updates.onboarding_completed;
    if (updates.reset_token !== undefined) user.reset_token = updates.reset_token;
    if (updates.reset_token_expires !== undefined) user.reset_token_expires = updates.reset_token_expires;

    this.persistSync();
    return user;
  }

  public deleteUser(userId: string): boolean {
    const initialLen = this.schema.users.length;
    this.schema.users = this.schema.users.filter((u) => u.user_id !== userId);
    this.schema.sessions = this.schema.sessions.filter((s) => s.user_id !== userId);
    this.schema.watchlists = this.schema.watchlists.filter((w) => w.user_id !== userId);
    this.schema.simulations = this.schema.simulations.filter((s) => s.user_id !== userId);
    this.schema.screeners = this.schema.screeners.filter((s) => s.user_id !== userId);
    this.schema.theses = this.schema.theses.filter((t) => t.user_id !== userId);
    this.schema.user_signal_ratings = this.schema.user_signal_ratings.filter((r) => r.user_id !== userId);
    this.persistSync();
    return this.schema.users.length < initialLen;
  }

  // --- SESSIONS ---
  public createSession(userId: string): StoredSession {
    const token = `tok_${crypto.randomBytes(32).toString('hex')}`;
    const session: StoredSession = {
      token,
      user_id: userId,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    this.schema.sessions.push(session);
    this.persistSync();
    return session;
  }

  public getSession(token: string): StoredSession | undefined {
    const session = this.schema.sessions.find((s) => s.token === token);
    if (!session) return undefined;
    if (new Date(session.expires_at).getTime() < Date.now()) {
      this.deleteSession(token);
      return undefined;
    }
    return session;
  }

  public deleteSession(token: string) {
    this.schema.sessions = this.schema.sessions.filter((s) => s.token !== token);
    this.persistSync();
  }

  // --- COMPANIES & SIGNALS ---
  public getCompanies() {
    return this.schema.companies;
  }

  public getCompany(symbol: string): Company | undefined {
    const sym = symbol.toUpperCase();
    return this.schema.companies.find((c) => c.nse_symbol.toUpperCase() === sym || (c.bse_code && c.bse_code === sym));
  }

  public addOrUpdateCompany(company: Company): Company {
    const idx = this.schema.companies.findIndex(
      (c) => c.nse_symbol.toUpperCase() === company.nse_symbol.toUpperCase()
    );
    if (idx >= 0) {
      this.schema.companies[idx] = { ...this.schema.companies[idx], ...company };
    } else {
      this.schema.companies.push(company);
    }
    this.persistSync();
    return company;
  }

  public getSignals(userId?: string): Signal[] {
    const raw = (this.schema.signals && this.schema.signals.length > 0) ? this.schema.signals : SEED_SIGNALS;
    return raw.map((sig) => {
      let withRating = sig;
      if (userId) {
        const rating = this.schema.user_signal_ratings.find(
          (r) => r.user_id === userId && r.signal_id === sig.signal_id
        );
        withRating = { ...sig, user_rating: rating ? rating.rating : undefined };
      }
      return withRating;
    });
  }

  public getRegulatoryThemes(): RegulatoryTheme[] {
    return this.schema.regulatoryThemes || SEED_REGULATORY_THEMES;
  }

  public rateSignal(userId: string, signalId: string, rating: 'USEFUL' | 'NOT_USEFUL') {
    const existing = this.schema.user_signal_ratings.find(
      (r) => r.user_id === userId && r.signal_id === signalId
    );
    if (existing) {
      existing.rating = rating;
    } else {
      this.schema.user_signal_ratings.push({ user_id: userId, signal_id: signalId, rating });
    }
    this.persistSync();
  }

  // --- OPPORTUNITIES & PIPELINE ---
  public getOpportunities() {
    return this.schema.opportunities || SEED_OPPORTUNITIES;
  }

  public updateOpportunityStatus(opportunityId: string, status: OpportunityItem['status']) {
    const opp = this.schema.opportunities.find((o) => o.opportunity_id === opportunityId);
    if (opp) {
      opp.status = status;
      opp.last_updated = new Date().toISOString().split('T')[0];
      this.persistSync();
    }
    return opp;
  }

  // --- RESEARCH THESES ---
  public getTheses(userId?: string): ResearchThesis[] {
    if (!userId) return this.schema.theses;
    return this.schema.theses.filter((t) => !t.user_id || t.user_id === userId);
  }

  public getThesis(thesisId: string, userId?: string): ResearchThesis | null {
    const thesis = this.schema.theses.find(
      (t) => t.thesis_id === thesisId && (!userId || !t.user_id || t.user_id === userId)
    );
    return thesis || null;
  }

  public createThesis(userId: string, thesis: Omit<ResearchThesis, 'thesis_id' | 'created_at' | 'updated_at'>): ResearchThesis {
    const newThesis: ResearchThesis = {
      ...thesis,
      thesis_id: `th-${Date.now()}`,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.schema.theses.unshift(newThesis);
    this.persistSync();
    return newThesis;
  }

  public updateThesis(userId: string, thesisId: string, updates: Partial<ResearchThesis>): ResearchThesis | null {
    const th = this.schema.theses.find((t) => t.thesis_id === thesisId && (!t.user_id || t.user_id === userId));
    if (!th) return null;
    // Anti-Hindsight Bias Protection: created_at, thesis_id, and user_id are immutable once created
    const { created_at, thesis_id, user_id, ...safeUpdates } = updates as any;
    Object.assign(th, safeUpdates, { updated_at: new Date().toISOString() });
    this.persistSync();
    return th;
  }

  public deleteThesis(userId: string, thesisId: string): boolean {
    const initialLen = this.schema.theses.length;
    this.schema.theses = this.schema.theses.filter((t) => t.thesis_id !== thesisId || (t.user_id && t.user_id !== userId));
    this.persistSync();
    return this.schema.theses.length < initialLen;
  }

  // --- WATCHLISTS ---
  public getWatchlists(userId: string): Watchlist[] {
    return this.schema.watchlists.filter((w) => !w.user_id || w.user_id === userId);
  }

  public getWatchlist(watchlistId: string, userId?: string): Watchlist | null {
    const wl = this.schema.watchlists.find(
      (w) => w.watchlist_id === watchlistId && (!userId || !w.user_id || w.user_id === userId)
    );
    return wl || null;
  }

  public createWatchlist(
    userId: string,
    data: { name: string; description?: string; alerts_enabled?: boolean }
  ): Watchlist {
    const newWl: Watchlist & { user_id: string } = {
      watchlist_id: `wl-${Date.now()}`,
      user_id: userId,
      name: data.name || 'New Watchlist',
      description: data.description || '',
      is_default: false,
      company_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      alerts_enabled: data.alerts_enabled !== undefined ? data.alerts_enabled : true,
      companies: [],
    };
    this.schema.watchlists.push(newWl);
    this.persistSync();
    return newWl;
  }

  public updateWatchlist(
    userId: string,
    watchlistId: string,
    updates: Partial<Pick<Watchlist, 'name' | 'description' | 'alerts_enabled'>>
  ): Watchlist | null {
    const wl = this.schema.watchlists.find(
      (w) => w.watchlist_id === watchlistId && (!w.user_id || w.user_id === userId)
    );
    if (!wl) return null;
    if (updates.name !== undefined) wl.name = updates.name;
    if (updates.description !== undefined) wl.description = updates.description;
    if (updates.alerts_enabled !== undefined) wl.alerts_enabled = updates.alerts_enabled;
    wl.updated_at = new Date().toISOString();
    this.persistSync();
    return wl;
  }

  public deleteWatchlist(userId: string, watchlistId: string): boolean {
    const initialLen = this.schema.watchlists.length;
    this.schema.watchlists = this.schema.watchlists.filter(
      (w) => w.watchlist_id !== watchlistId || (w.user_id && w.user_id !== userId)
    );
    this.persistSync();
    return this.schema.watchlists.length < initialLen;
  }

  public addCompanyToWatchlist(
    userId: string,
    watchlistId: string,
    companySymbol: string,
    notes?: string,
    researchStatus?: WatchlistCompany['research_status']
  ): Watchlist | null {
    const wl = this.schema.watchlists.find(
      (w) => w.watchlist_id === watchlistId && (!w.user_id || w.user_id === userId)
    );
    if (!wl) return null;

    const comp = this.schema.companies.find((c) => c.nse_symbol === companySymbol.toUpperCase());
    if (!comp) return wl;

    if (!wl.companies) wl.companies = [];
    const exists = wl.companies.find((c) => c.nse_symbol === comp.nse_symbol);
    if (!exists) {
      wl.companies.push({
        company_id: comp.company_id,
        nse_symbol: comp.nse_symbol,
        company_name: comp.company_name,
        sector: comp.sector,
        current_price: comp.current_price,
        price_change_pct: comp.price_change_pct,
        added_at: new Date().toISOString(),
        notes: notes || 'Watchlist tracking',
        research_status: researchStatus || 'WATCHING',
        last_gate_verdict: 'Passes screening',
        last_reviewed_at: new Date().toISOString().split('T')[0],
      });
      wl.company_count = wl.companies.length;
      wl.updated_at = new Date().toISOString();
      this.persistSync();
    }
    return wl;
  }

  public removeCompanyFromWatchlist(userId: string, watchlistId: string, symbol: string): Watchlist | null {
    const wl = this.schema.watchlists.find(
      (w) => w.watchlist_id === watchlistId && (!w.user_id || w.user_id === userId)
    );
    if (!wl || !wl.companies) return null;
    wl.companies = wl.companies.filter((c) => c.nse_symbol !== symbol.toUpperCase());
    wl.company_count = wl.companies.length;
    wl.updated_at = new Date().toISOString();
    this.persistSync();
    return wl;
  }

  public updateWatchlistCompany(
    userId: string,
    watchlistId: string,
    symbol: string,
    updates: Partial<Pick<WatchlistCompany, 'notes' | 'research_status' | 'linked_thesis_id' | 'last_gate_verdict'>>
  ): Watchlist | null {
    const wl = this.schema.watchlists.find(
      (w) => w.watchlist_id === watchlistId && (!w.user_id || w.user_id === userId)
    );
    if (!wl || !wl.companies) return null;
    const targetComp = wl.companies.find((c) => c.nse_symbol === symbol.toUpperCase());
    if (!targetComp) return wl;

    if (updates.notes !== undefined) targetComp.notes = updates.notes;
    if (updates.research_status !== undefined) targetComp.research_status = updates.research_status;
    if (updates.linked_thesis_id !== undefined) targetComp.linked_thesis_id = updates.linked_thesis_id;
    if (updates.last_gate_verdict !== undefined) targetComp.last_gate_verdict = updates.last_gate_verdict;
    targetComp.last_reviewed_at = new Date().toISOString().split('T')[0];
    wl.updated_at = new Date().toISOString();
    this.persistSync();
    return wl;
  }

  // --- SIMULATIONS ---
  public getSimulations(userId: string): SimulationSession[] {
    return this.schema.simulations.filter((s) => !s.user_id || s.user_id === userId);
  }

  public addSimulation(userId: string, sim: SimulationSession): SimulationSession {
    const withUser = { ...sim, user_id: userId };
    this.schema.simulations.unshift(withUser);
    this.persistSync();
    return withUser;
  }

  // --- SCREENERS ---
  public getScreeners(userId?: string): Screener[] {
    const list = this.schema.screeners || SEED_SCREENERS;
    if (!userId) return list;
    return list.filter((s) => !s.user_id || s.user_id === userId);
  }

  public getScreener(screenerId: string, userId?: string): Screener | undefined {
    const list = this.schema.screeners || SEED_SCREENERS;
    return list.find((s) => s.screener_id === screenerId && (!userId || !s.user_id || s.user_id === userId));
  }

  public saveScreener(userId: string, screener: Omit<Screener, 'screener_id'>): Screener {
    if (!this.schema.screeners) this.schema.screeners = [...SEED_SCREENERS];
    const newScreener: Screener = {
      ...screener,
      screener_id: `sc-${Date.now()}`,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.schema.screeners.unshift(newScreener);
    this.persistSync();
    return newScreener;
  }

  public updateScreener(userId: string, screenerId: string, updates: Partial<Screener>): Screener | null {
    if (!this.schema.screeners) this.schema.screeners = [...SEED_SCREENERS];
    const scr = this.schema.screeners.find(
      (s) => s.screener_id === screenerId && (!s.user_id || s.user_id === userId)
    );
    if (!scr) return null;
    Object.assign(scr, updates, { updated_at: new Date().toISOString() });
    this.persistSync();
    return scr;
  }

  public deleteScreener(userId: string, screenerId: string): boolean {
    if (!this.schema.screeners) this.schema.screeners = [...SEED_SCREENERS];
    const initialLen = this.schema.screeners.length;
    this.schema.screeners = this.schema.screeners.filter(
      (s) => s.screener_id !== screenerId || (s.user_id && s.user_id !== userId)
    );
    this.persistSync();
    return this.schema.screeners.length < initialLen;
  }

  // --- TRACK RECORD ---
  public getTrackRecord(): TrackRecordStats {
    return this.schema.trackRecord || SEED_TRACK_RECORD;
  }

  // --- ALERTS ---
  public getAlerts(): AlertItem[] {
    return this.schema.alerts;
  }

  public createAlert(alert: Omit<AlertItem, 'alert_id' | 'created_at' | 'is_read'>): AlertItem {
    const newAlert: AlertItem = {
      ...alert,
      alert_id: `al-${Date.now()}`,
      created_at: new Date().toISOString(),
      is_read: false,
    };
    this.schema.alerts.unshift(newAlert);
    this.persistSync();
    return newAlert;
  }

  public markAlertsRead() {
    this.schema.alerts.forEach((a) => (a.is_read = true));
    this.persistSync();
  }

  // --- HISTORICAL DELTAS & THESIS REPLAY ---
  public getHistoricalDeltas(symbol?: string): HistoricalDeltaRecord[] {
    const list = this.schema.historicalDeltas || SEED_HISTORICAL_DELTAS;
    if (!symbol) return list;
    return list.filter((d) => d.company_symbol.toUpperCase() === symbol.toUpperCase());
  }

  public addHistoricalDelta(
    delta: Omit<HistoricalDeltaRecord, 'delta_id' | 'detected_at'> & { delta_id?: string; detected_at?: string }
  ): HistoricalDeltaRecord {
    if (!this.schema.historicalDeltas) this.schema.historicalDeltas = [...SEED_HISTORICAL_DELTAS];
    const newDelta: HistoricalDeltaRecord = {
      ...delta,
      delta_id: delta.delta_id || `dt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      detected_at: delta.detected_at || new Date().toISOString(),
    };
    this.schema.historicalDeltas.unshift(newDelta);
    this.persistSync();
    return newDelta;
  }

  public getThesisEvolution(thesisId: string): ThesisEvolutionEvent[] {
    const list = this.schema.thesisEvolutions || SEED_THESIS_EVOLUTIONS;
    return list
      .filter((e) => e.thesis_id === thesisId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  public getAllThesisEvolutions(): ThesisEvolutionEvent[] {
    return this.schema.thesisEvolutions || SEED_THESIS_EVOLUTIONS;
  }

  public addThesisEvolutionEvent(
    event: Omit<ThesisEvolutionEvent, 'event_id' | 'timestamp'> & { event_id?: string; timestamp?: string }
  ): ThesisEvolutionEvent {
    if (!this.schema.thesisEvolutions) this.schema.thesisEvolutions = [...SEED_THESIS_EVOLUTIONS];
    const newEvent: ThesisEvolutionEvent = {
      ...event,
      event_id: event.event_id || `evo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: event.timestamp || new Date().toISOString(),
    };
    this.schema.thesisEvolutions.push(newEvent);
    this.persistSync();
    return newEvent;
  }
}

export const db = new Database();
