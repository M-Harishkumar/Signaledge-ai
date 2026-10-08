import { db } from '../db/database';
import {
  PortfolioRiskSummary,
  MacroExposureItem,
  ConcentrationItem,
  Company,
  Signal,
} from '../../src/types';
import { SEBI_MANDATORY_DISCLAIMER } from '../../src/data/seedData';
import { SignalService } from './signalService';
import { FinancialDataService } from './financialDataService';

export class PortfolioRiskService {
  /**
   * Predefined Macro / Commodity / Currency / Geopolitical / Supply Chain Transmission Drivers
   */
  private static readonly MACRO_DRIVER_TAXONOMY: Array<{
    driver: string;
    category: 'COMMODITY' | 'CURRENCY' | 'MACRO_RATES' | 'GEOPOLITICAL' | 'REGULATORY' | 'SUPPLY_CHAIN';
    sectorsOrKeywords: string[];
    symbolMatchers: string[];
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    evidence: string;
    possible_transmission: string;
    mitigation_summary: string;
  }> = [
    {
      driver: 'Brent Crude Oil & Feedstock Price Inflation',
      category: 'COMMODITY',
      sectorsOrKeywords: ['Automotive', 'Specialty Chemicals', 'Paints & Adhesives', 'Aviation', 'Tyres'],
      symbolMatchers: ['TATAMOTORS', 'MARUTI', 'ASHOKLEY', 'ASIANPAINT', 'PIDILITIND', 'INDIGO', 'AARTIIND', 'SRF'],
      severity: 'HIGH',
      evidence: 'Brent crude benchmark trading sensitivity with pass-through lag of 45-60 days on monomer and solvent input costs.',
      possible_transmission: 'Elevated crude increases petroleum distillate input costs (rubber, pigments, petrochemicals, aviation fuel), compressing gross margins by 150-250 bps unless passed through via end-product price hikes.',
      mitigation_summary: 'Monitor raw material inventory buffers and pricing power across Tier-1 retail franchises.',
    },
    {
      driver: 'Interest Rate & Sovereign Yield Tightening Cycle',
      category: 'MACRO_RATES',
      sectorsOrKeywords: ['Banking & Financials', 'Real Estate', 'Infrastructure', 'Commercial Vehicles'],
      symbolMatchers: ['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK', 'AXISBANK', 'BAJFINANCE', 'DLF', 'LARSEN'],
      severity: 'MEDIUM',
      evidence: 'RBI repo rate and systemic liquidity adjustments shifting Net Interest Margins (NIM) and wholesale borrowing costs.',
      possible_transmission: 'High cost of funds increases deposit acquisition expense and slows credit demand in high-ticket capex and housing.',
      mitigation_summary: 'Assess CASA deposit ratio resilience and low-cost funding franchise depth.',
    },
    {
      driver: 'USD/INR Currency Depreciation & Import Parity Pricing',
      category: 'CURRENCY',
      sectorsOrKeywords: ['IT Services', 'Pharmaceuticals', 'Electronics Manufacturing', 'Automotive Components'],
      symbolMatchers: ['TCS', 'INFY', 'HCLTECH', 'SUNPHARMA', 'DRREDDY', 'CIPLA', 'DIXON', 'POLYCAB'],
      severity: 'MEDIUM',
      evidence: 'Foreign exchange realization volatility across US Dollar export revenues and imported electronics bills of materials.',
      possible_transmission: 'INR depreciation benefits IT/Pharma export realizations (+1% depreciation ≈ +30-40 bps EBIT margin), but elevates landed costs of imported active pharmaceutical ingredients (API) and semiconductor components.',
      mitigation_summary: 'Track forward FX contract hedging coverage ratios disclosed in annual reports.',
    },
    {
      driver: 'MoD Sovereign Indigenisation Mandate & DGQA Certification Cycle',
      category: 'REGULATORY',
      sectorsOrKeywords: ['Defense & Aerospace', 'Capital Goods', 'Industrial Engineering'],
      symbolMatchers: ['HAL', 'BEL', 'SOLARINDS', 'BDL', 'MAZDOCK', 'COCHINSHIP', 'SIEMENS', 'ABB'],
      severity: 'HIGH',
      evidence: 'Positive Indigenisation Lists (PIL 1-5) and DPP capital acquisition approvals mandating domestic manufacturing quotas.',
      possible_transmission: 'Expanded order books provide multi-year visibility, but rigorous DGQA batch testing and prototype validation can delay milestone billing by 1-3 quarters.',
      mitigation_summary: 'Verify order-book-to-bill ratios and advance payment clauses in government contracts.',
    },
    {
      driver: 'Semiconductor & Specialized Electronic Subsystem Supply Tightness',
      category: 'SUPPLY_CHAIN',
      sectorsOrKeywords: ['Automotive', 'Consumer Electronics', 'Industrial Automation'],
      symbolMatchers: ['TATAMOTORS', 'MARUTI', 'M&M', 'DIXON', 'VOLTAS', 'HAVELLS', 'POLYCAB'],
      severity: 'HIGH',
      evidence: 'Global foundry lead times and tier-1 electronic control unit (ECU) inventory buffer metrics.',
      possible_transmission: 'Subsystem component allocation constraints can throttle finished vehicle and appliance assembly lines, delaying order deliveries.',
      mitigation_summary: 'Monitor dual-sourcing agreements and strategic semiconductor inventory reserves.',
    },
    {
      driver: 'Steel & Coking Coal Raw Material Price Swings',
      category: 'COMMODITY',
      sectorsOrKeywords: ['Metals & Mining', 'Infrastructure', 'Capital Goods', 'Automotive'],
      symbolMatchers: ['TATASTEEL', 'JSWSTEEL', 'HINDALCO', 'COALINDIA', 'LARSEN', 'BHARTIARTL'],
      severity: 'HIGH',
      evidence: 'Global metallurgical coal freight benchmarks and domestic iron ore auction realization trajectories.',
      possible_transmission: 'Volatile blast-furnace fuel and iron ore prices directly swing EBITDA per tonne across domestic primary producers and construction contractors.',
      mitigation_summary: 'Evaluate captive iron ore mine integration and long-term coking coal import contracts.',
    },
  ];

  /**
   * Aggregates portfolio and watchlist risk exposures without fake returns or fabricated portfolio weights.
   * Produces honest qualitative exposure counts, concentration breakdowns, and shared risk clusters.
   */
  public static aggregatePortfolioRisks(
    symbols?: string[],
    userId?: string
  ): PortfolioRiskSummary {
    const allCompanies = db.getCompanies();

    // 1. Determine Target Symbols
    let targetSymbols: string[] = [];
    if (symbols && symbols.length > 0) {
      targetSymbols = symbols.map((s) => s.trim().toUpperCase());
    } else if (userId) {
      const wls = db.getWatchlists(userId);
      const set = new Set<string>();
      wls.forEach((w) => {
        w.companies?.forEach((c) => set.add(c.nse_symbol.toUpperCase()));
      });
      const theses = db.getTheses(userId);
      theses.forEach((t) => set.add(t.primary_symbol.toUpperCase()));
      targetSymbols = Array.from(set);
    }

    // Default to marquee sample if still empty
    if (targetSymbols.length === 0) {
      targetSymbols = ['TATAMOTORS', 'RELIANCE', 'HAL', 'BEL', 'MARUTI', 'TRENT', 'PIDILITIND', 'HDFCBANK'];
    }

    const matchedCompanies: Company[] = [];
    targetSymbols.forEach((sym) => {
      const comp = allCompanies.find((c) => c.nse_symbol === sym);
      if (comp) matchedCompanies.push(comp);
    });

    const totalMonitored = matchedCompanies.length;

    // 2. Sector Concentration
    const sectorMap: Record<string, string[]> = {};
    const industryMap: Record<string, string[]> = {};

    matchedCompanies.forEach((c) => {
      const sec = c.sector || 'Unclassified';
      if (!sectorMap[sec]) sectorMap[sec] = [];
      sectorMap[sec].push(c.nse_symbol);

      const ind = c.industry || sec;
      if (!industryMap[ind]) industryMap[ind] = [];
      industryMap[ind].push(c.nse_symbol);
    });

    const sectorConcentration: ConcentrationItem[] = Object.entries(sectorMap)
      .map(([name, syms]) => ({
        name,
        count: syms.length,
        percentage: totalMonitored > 0 ? Math.round((syms.length / totalMonitored) * 1000) / 10 : 0,
        symbols: syms,
      }))
      .sort((a, b) => b.count - a.count);

    const industryConcentration: ConcentrationItem[] = Object.entries(industryMap)
      .map(([name, syms]) => ({
        name,
        count: syms.length,
        percentage: totalMonitored > 0 ? Math.round((syms.length / totalMonitored) * 1000) / 10 : 0,
        symbols: syms,
      }))
      .sort((a, b) => b.count - a.count);

    // 3. Balance Sheet & Governance Specific Risks
    const leverageRiskSymbols: string[] = [];
    const valuationRiskSymbols: string[] = [];
    const governanceRiskSymbols: string[] = [];

    matchedCompanies.forEach((c) => {
      if (c.de_ratio > 1.0 || (c.interest_coverage !== undefined && c.interest_coverage < 3.0)) {
        leverageRiskSymbols.push(c.nse_symbol);
      }
      if (c.pe_ratio > 45.0) {
        valuationRiskSymbols.push(c.nse_symbol);
      }
      if (c.promoter_pledge_pct > 5.0) {
        governanceRiskSymbols.push(c.nse_symbol);
      }
    });

    // 4. Macro & Common Risk Cluster Detection
    const macroExposures: MacroExposureItem[] = [];
    const sharedRisks: MacroExposureItem[] = [];

    this.MACRO_DRIVER_TAXONOMY.forEach((driverDef) => {
      const matchingSymbols = matchedCompanies
        .filter((c) => {
          const inSymbolList = driverDef.symbolMatchers.includes(c.nse_symbol);
          const inSectorList = driverDef.sectorsOrKeywords.some((sec) =>
            c.sector.toLowerCase().includes(sec.toLowerCase()) ||
            c.industry.toLowerCase().includes(sec.toLowerCase())
          );
          return inSymbolList || inSectorList;
        })
        .map((c) => c.nse_symbol);

      if (matchingSymbols.length > 0) {
        const item: MacroExposureItem = {
          driver: driverDef.driver,
          category: driverDef.category,
          affected_count: matchingSymbols.length,
          affected_symbols: matchingSymbols,
          severity: driverDef.severity,
          evidence: driverDef.evidence,
          possible_transmission: driverDef.possible_transmission,
          mitigation_summary: driverDef.mitigation_summary,
        };

        macroExposures.push(item);

        // A risk is classified as a SHARED COMMON RISK if 2 or more monitored companies share it
        if (matchingSymbols.length >= 2) {
          sharedRisks.push(item);
        }
      }
    });

    return {
      total_companies_monitored: totalMonitored,
      sector_concentration: sectorConcentration,
      industry_concentration: industryConcentration,
      leverage_risk_count: leverageRiskSymbols.length,
      leverage_risk_symbols: leverageRiskSymbols,
      valuation_risk_count: valuationRiskSymbols.length,
      valuation_risk_symbols: valuationRiskSymbols,
      governance_risk_count: governanceRiskSymbols.length,
      governance_risk_symbols: governanceRiskSymbols,
      macro_exposures: macroExposures,
      shared_risks: sharedRisks.sort((a, b) => b.affected_count - a.affected_count),
      disclaimer: SEBI_MANDATORY_DISCLAIMER,
    };
  }

  /**
   * Retrieves all universal shared risk clusters across the entire 53-stock canonical universe.
   */
  public static getAllUniverseSharedRisks(): MacroExposureItem[] {
    const allSymbols = db.getCompanies().map((c) => c.nse_symbol);
    const summary = this.aggregatePortfolioRisks(allSymbols);
    return summary.shared_risks;
  }
}
