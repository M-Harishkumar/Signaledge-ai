/**
 * Centralized Financial Calculation Service for SignalEdge OS
 * Ensures identical and mathematically verified ratio calculations across all components.
 */

export interface CalculationResult {
  metric: string;
  formula: string;
  inputs: Record<string, number | string>;
  result: number;
  formattedResult: string;
  threshold?: string;
  status: 'PASS' | 'FAIL' | 'UNKNOWN';
  explanation: string;
}

export interface DuPontRoEResult {
  metric: string;
  roe: number;
  formattedRoE: string;
  net_margin_pct: number;
  asset_turnover: number;
  equity_multiplier: number;
  status: 'PASS' | 'FAIL' | 'UNKNOWN';
  leverage_driven_risk: boolean;
  primary_driver: 'OPERATING_EFFICIENCY' | 'ASSET_TURNOVER' | 'FINANCIAL_LEVERAGE' | 'BALANCED' | 'INDETERMINATE';
  formula: string;
  inputs: {
    net_income: number | string;
    revenue: number | string;
    total_assets: number | string;
    total_equity: number | string;
  };
  explanation: string;
}

export interface FinancialTrendEvaluation {
  metric_name: string;
  trend: 'IMPROVING' | 'STABLE' | 'DETERIORATING' | 'VOLATILE' | 'INSUFFICIENT_DATA';
  direction: 'UP' | 'FLAT' | 'DOWN' | 'VOLATILE' | 'UNKNOWN';
  cagr_pct?: number;
  periods_count: number;
  historical_min: number;
  historical_max: number;
  historical_avg: number;
  latest_value: number;
  explanation: string;
}

export class FinancialCalculator {
  /**
   * Return on Capital Employed (RoCE)
   * Formula: EBIT / Capital Employed * 100 OR EBITDA / Capital Employed * 100
   * Capital Employed = Total Assets - Current Liabilities = Net Worth + Total Debt
   */
  public static calculateRoCE(
    ebitda: number | undefined,
    capitalEmployed: number | undefined,
    reportedRoce?: number
  ): CalculationResult {
    if (reportedRoce !== undefined && !isNaN(reportedRoce)) {
      const status = reportedRoce >= 15 ? 'PASS' : 'FAIL';
      return {
        metric: 'Return on Capital Employed (RoCE)',
        formula: 'EBITDA / Total Capital Employed × 100',
        inputs: { reportedRoCE: `${reportedRoce}%` },
        result: reportedRoce,
        formattedResult: `${reportedRoce.toFixed(1)}%`,
        threshold: '≥ 15.0%',
        status,
        explanation:
          status === 'PASS'
            ? `RoCE of ${reportedRoce}% satisfies the minimum 15% cost of capital threshold.`
            : `RoCE of ${reportedRoce}% falls below the 15% hurdle rate for compounders.`,
      };
    }

    if (ebitda === undefined || capitalEmployed === undefined || capitalEmployed <= 0) {
      return {
        metric: 'Return on Capital Employed (RoCE)',
        formula: 'EBITDA / Total Capital Employed × 100',
        inputs: { ebitda: ebitda ?? 'N/A', capitalEmployed: capitalEmployed ?? 'N/A' },
        result: 0,
        formattedResult: 'Data Unavailable',
        threshold: '≥ 15.0%',
        status: 'UNKNOWN',
        explanation: 'Insufficient capital employed or operating profit data to compute RoCE.',
      };
    }

    const val = (ebitda / capitalEmployed) * 100;
    const status = val >= 15 ? 'PASS' : 'FAIL';
    return {
      metric: 'Return on Capital Employed (RoCE)',
      formula: 'EBITDA / Total Capital Employed × 100',
      inputs: { ebitda, capitalEmployed },
      result: val,
      formattedResult: `${val.toFixed(1)}%`,
      threshold: '≥ 15.0%',
      status,
      explanation:
        status === 'PASS'
          ? `Calculated RoCE of ${val.toFixed(1)}% meets the 15% threshold.`
          : `Calculated RoCE of ${val.toFixed(1)}% is below the 15% hurdle.`,
    };
  }

  /**
   * Debt to Equity Ratio
   * Formula: Total Debt / Net Worth
   */
  public static calculateDebtToEquity(
    totalDebt: number | undefined,
    netWorth: number | undefined,
    reportedDE?: number
  ): CalculationResult {
    const de = reportedDE !== undefined ? reportedDE : totalDebt !== undefined && netWorth && netWorth > 0 ? totalDebt / netWorth : undefined;

    if (de === undefined) {
      return {
        metric: 'Debt to Equity Ratio',
        formula: 'Total Debt / Shareholders Net Worth',
        inputs: { totalDebt: totalDebt ?? 'N/A', netWorth: netWorth ?? 'N/A' },
        result: 0,
        formattedResult: 'Data Unavailable',
        threshold: '≤ 1.0x',
        status: 'UNKNOWN',
        explanation: 'Missing balance sheet debt or equity data to verify solvency.',
      };
    }

    const status = de <= 1.0 ? 'PASS' : 'FAIL';
    return {
      metric: 'Debt to Equity Ratio',
      formula: 'Total Debt / Shareholders Net Worth',
      inputs: { deRatio: `${de.toFixed(2)}x` },
      result: de,
      formattedResult: `${de.toFixed(2)}x`,
      threshold: '≤ 1.0x',
      status,
      explanation:
        status === 'PASS'
          ? `D/E of ${de.toFixed(2)}x reflects conservative balance sheet leverage.`
          : `D/E of ${de.toFixed(2)}x exceeds conservative tolerance of 1.0x.`,
    };
  }

  /**
   * Promoter Pledge Percentage
   */
  public static evaluatePromoterPledge(pledgePct: number | undefined): CalculationResult {
    if (pledgePct === undefined) {
      return {
        metric: 'Promoter Share Pledge',
        formula: 'Pledged Promoter Shares / Total Promoter Shares × 100',
        inputs: { pledgePct: 'N/A' },
        result: 0,
        formattedResult: 'Data Unavailable',
        threshold: '= 0.0%',
        status: 'UNKNOWN',
        explanation: 'Promoter pledge disclosures unavailable for this quarter.',
      };
    }

    const status = pledgePct === 0 ? 'PASS' : pledgePct <= 10 ? 'PASS' : 'FAIL';
    return {
      metric: 'Promoter Share Pledge',
      formula: 'Pledged Promoter Shares / Total Promoter Shares × 100',
      inputs: { pledgePct: `${pledgePct}%` },
      result: pledgePct,
      formattedResult: `${pledgePct.toFixed(1)}%`,
      threshold: '≤ 5.0%',
      status,
      explanation:
        pledgePct === 0
          ? 'Zero promoter pledge. Pristine governance and alignment.'
          : pledgePct > 15
          ? `Elevated promoter pledge of ${pledgePct}% creates margin call risk.`
          : `Low promoter pledge of ${pledgePct}% within monitoring limits.`,
    };
  }

  /**
   * Return on Equity (RoE)
   * Formula: Net Income / Total Shareholders Equity * 100
   */
  public static calculateROE(
    netIncome: number | undefined,
    equity: number | undefined,
    reportedRoe?: number
  ): CalculationResult {
    if (reportedRoe !== undefined && !isNaN(reportedRoe)) {
      const status = reportedRoe >= 12 ? 'PASS' : 'FAIL';
      return {
        metric: 'Return on Equity (RoE)',
        formula: 'Net Income / Total Shareholders Equity × 100',
        inputs: { reportedRoE: `${reportedRoe}%` },
        result: reportedRoe,
        formattedResult: `${reportedRoe.toFixed(1)}%`,
        threshold: '≥ 12.0%',
        status,
        explanation:
          status === 'PASS'
            ? `RoE of ${reportedRoe}% demonstrates strong net worth compounding.`
            : `RoE of ${reportedRoe}% is below the 12% equity cost hurdle.`,
      };
    }

    if (netIncome === undefined || equity === undefined || equity <= 0) {
      return {
        metric: 'Return on Equity (RoE)',
        formula: 'Net Income / Total Shareholders Equity × 100',
        inputs: { netIncome: netIncome ?? 'N/A', equity: equity ?? 'N/A' },
        result: 0,
        formattedResult: 'Data Unavailable',
        threshold: '≥ 12.0%',
        status: 'UNKNOWN',
        explanation: equity !== undefined && equity <= 0 
          ? 'Shareholders equity is negative or zero; RoE not computable without distortion.' 
          : 'Missing net profit or shareholders equity data.',
      };
    }

    const val = Math.round(((netIncome / equity) * 100) * 10) / 10;
    const status = val >= 12 ? 'PASS' : 'FAIL';
    return {
      metric: 'Return on Equity (RoE)',
      formula: 'Net Income / Total Shareholders Equity × 100',
      inputs: { netIncome, equity },
      result: val,
      formattedResult: `${val}%`,
      threshold: '≥ 12.0%',
      status,
      explanation:
        status === 'PASS'
          ? `Calculated RoE of ${val}% reflects profitable equity capital allocation.`
          : `Calculated RoE of ${val}% is below the 12% benchmark.`,
    };
  }

  /**
   * Return on Assets (RoA)
   * Formula: Net Income / Total Assets * 100
   */
  public static calculateROA(
    netIncome: number | undefined,
    totalAssets: number | undefined,
    reportedRoa?: number
  ): CalculationResult {
    if (reportedRoa !== undefined && !isNaN(reportedRoa)) {
      const status = reportedRoa >= 5.0 ? 'PASS' : 'FAIL';
      return {
        metric: 'Return on Assets (RoA)',
        formula: 'Net Income / Total Assets × 100',
        inputs: { reportedRoA: `${reportedRoa}%` },
        result: reportedRoa,
        formattedResult: `${reportedRoa.toFixed(1)}%`,
        threshold: '≥ 5.0%',
        status,
        explanation: `RoA of ${reportedRoa}% reflects asset utilization efficiency.`,
      };
    }

    if (netIncome === undefined || totalAssets === undefined || totalAssets <= 0) {
      return {
        metric: 'Return on Assets (RoA)',
        formula: 'Net Income / Total Assets × 100',
        inputs: { netIncome: netIncome ?? 'N/A', totalAssets: totalAssets ?? 'N/A' },
        result: 0,
        formattedResult: 'Data Unavailable',
        threshold: '≥ 5.0%',
        status: 'UNKNOWN',
        explanation: 'Missing asset base or earnings data.',
      };
    }

    const val = Math.round(((netIncome / totalAssets) * 100) * 10) / 10;
    return {
      metric: 'Return on Assets (RoA)',
      formula: 'Net Income / Total Assets × 100',
      inputs: { netIncome, totalAssets },
      result: val,
      formattedResult: `${val}%`,
      threshold: '≥ 5.0%',
      status: val >= 5.0 ? 'PASS' : 'FAIL',
      explanation: `Calculated RoA of ${val}%.`,
    };
  }

  /**
   * Return on Invested Capital (RoIC)
   * Formula: NOPAT / (Total Debt + Equity - Cash)
   * NOPAT = EBIT * (1 - Tax Rate)
   */
  public static calculateRoIC(
    ebit: number | undefined,
    taxRate: number | undefined = 0.25,
    totalDebt: number | undefined = 0,
    equity: number | undefined,
    cash: number | undefined = 0,
    reportedRoic?: number
  ): CalculationResult {
    if (reportedRoic !== undefined && !isNaN(reportedRoic)) {
      const status = reportedRoic >= 12.0 ? 'PASS' : 'FAIL';
      return {
        metric: 'Return on Invested Capital (RoIC)',
        formula: 'NOPAT / (Total Debt + Equity - Cash) × 100',
        inputs: { reportedRoic: `${reportedRoic}%` },
        result: reportedRoic,
        formattedResult: `${reportedRoic.toFixed(1)}%`,
        threshold: '≥ 12.0%',
        status,
        explanation: `RoIC of ${reportedRoic}% measures genuine economic return on operating capital.`,
      };
    }

    if (ebit === undefined || equity === undefined || equity <= 0) {
      return {
        metric: 'Return on Invested Capital (RoIC)',
        formula: 'NOPAT / (Total Debt + Equity - Cash) × 100',
        inputs: { ebit: ebit ?? 'N/A', equity: equity ?? 'N/A' },
        result: 0,
        formattedResult: 'Data Unavailable',
        threshold: '≥ 12.0%',
        status: 'UNKNOWN',
        explanation: 'Insufficient EBIT or invested capital data to compute RoIC.',
      };
    }

    const nopat = ebit * (1 - taxRate);
    const investedCapital = (totalDebt || 0) + equity - (cash || 0);

    if (investedCapital <= 0) {
      return {
        metric: 'Return on Invested Capital (RoIC)',
        formula: 'NOPAT / Invested Capital × 100',
        inputs: { nopat, investedCapital },
        result: 0,
        formattedResult: 'Not Computable (Negative Invested Capital)',
        threshold: '≥ 12.0%',
        status: 'UNKNOWN',
        explanation: 'Invested capital is net negative (cash balances exceed debt + equity).',
      };
    }

    const val = Math.round(((nopat / investedCapital) * 100) * 10) / 10;
    const status = val >= 12.0 ? 'PASS' : 'FAIL';
    return {
      metric: 'Return on Invested Capital (RoIC)',
      formula: 'NOPAT / (Total Debt + Equity - Cash) × 100',
      inputs: { nopat: Math.round(nopat), investedCapital: Math.round(investedCapital) },
      result: val,
      formattedResult: `${val.toFixed(1)}%`,
      threshold: '≥ 12.0%',
      status,
      explanation: status === 'PASS'
        ? `RoIC of ${val.toFixed(1)}% comfortably exceeds hurdle rate.`
        : `RoIC of ${val.toFixed(1)}% is below the 12.0% cost of capital.`,
    };
  }

  /**
   * Current Ratio (Liquidity)
   */
  public static calculateCurrentRatio(
    currentAssets: number | undefined,
    currentLiabilities: number | undefined,
    reportedRatio?: number
  ): CalculationResult {
    const cr = reportedRatio !== undefined ? reportedRatio : currentAssets !== undefined && currentLiabilities && currentLiabilities > 0 ? currentAssets / currentLiabilities : undefined;

    if (cr === undefined) {
      return {
        metric: 'Current Ratio (Liquidity)',
        formula: 'Current Assets / Current Liabilities',
        inputs: { currentAssets: currentAssets ?? 'N/A', currentLiabilities: currentLiabilities ?? 'N/A' },
        result: 0,
        formattedResult: 'Data Unavailable',
        threshold: '≥ 1.2x',
        status: 'UNKNOWN',
        explanation: 'Working capital disclosures unavailable.',
      };
    }

    const status = cr >= 1.2 ? 'PASS' : 'FAIL';
    return {
      metric: 'Current Ratio (Liquidity)',
      formula: 'Current Assets / Current Liabilities',
      inputs: { currentRatio: `${cr.toFixed(2)}x` },
      result: cr,
      formattedResult: `${cr.toFixed(2)}x`,
      threshold: '≥ 1.2x',
      status,
      explanation: status === 'PASS' ? `Healthy short-term liquidity of ${cr.toFixed(2)}x.` : `Tight working capital buffer (${cr.toFixed(2)}x < 1.2x).`,
    };
  }

  /**
   * Quick Ratio (Acid Test Liquidity)
   * Formula: (Current Assets - Inventory) / Current Liabilities
   */
  public static calculateQuickRatio(
    currentAssets: number | undefined,
    inventory: number | undefined = 0,
    currentLiabilities: number | undefined,
    reportedQuickRatio?: number
  ): CalculationResult {
    if (reportedQuickRatio !== undefined && !isNaN(reportedQuickRatio)) {
      const status = reportedQuickRatio >= 1.0 ? 'PASS' : 'FAIL';
      return {
        metric: 'Quick Ratio (Acid Test)',
        formula: '(Current Assets - Inventory) / Current Liabilities',
        inputs: { reportedQuickRatio: `${reportedQuickRatio.toFixed(2)}x` },
        result: reportedQuickRatio,
        formattedResult: `${reportedQuickRatio.toFixed(2)}x`,
        threshold: '≥ 1.0x',
        status,
        explanation: `Quick ratio of ${reportedQuickRatio.toFixed(2)}x measures immediate liquid solvency.`,
      };
    }

    if (currentAssets === undefined || currentLiabilities === undefined || currentLiabilities <= 0) {
      return {
        metric: 'Quick Ratio (Acid Test)',
        formula: '(Current Assets - Inventory) / Current Liabilities',
        inputs: { currentAssets: currentAssets ?? 'N/A', currentLiabilities: currentLiabilities ?? 'N/A' },
        result: 0,
        formattedResult: 'Data Unavailable',
        threshold: '≥ 1.0x',
        status: 'UNKNOWN',
        explanation: 'Current assets or liabilities unavailable to evaluate quick liquidity.',
      };
    }

    const quickAssets = currentAssets - (inventory || 0);
    const qr = Math.round((quickAssets / currentLiabilities) * 100) / 100;
    const status = qr >= 1.0 ? 'PASS' : 'FAIL';
    return {
      metric: 'Quick Ratio (Acid Test)',
      formula: '(Current Assets - Inventory) / Current Liabilities',
      inputs: { quickAssets, currentLiabilities },
      result: qr,
      formattedResult: `${qr.toFixed(2)}x`,
      threshold: '≥ 1.0x',
      status,
      explanation: status === 'PASS'
        ? `Acid-test ratio of ${qr.toFixed(2)}x provides strong non-inventory liquidity.`
        : `Acid-test ratio of ${qr.toFixed(2)}x signals dependence on inventory monetization.`,
    };
  }

  /**
   * Interest Coverage Ratio
   * Formula: EBIT / Annual Debt Interest Expense
   */
  public static calculateInterestCoverage(
    ebit: number | undefined,
    interestExpense: number | undefined,
    reportedCoverage?: number
  ): CalculationResult {
    if (reportedCoverage !== undefined && !isNaN(reportedCoverage)) {
      const status = reportedCoverage >= 3.0 ? 'PASS' : 'FAIL';
      return {
        metric: 'Interest Coverage Ratio',
        formula: 'EBIT / Interest Expense',
        inputs: { reportedCoverage: `${reportedCoverage.toFixed(1)}x` },
        result: reportedCoverage,
        formattedResult: `${reportedCoverage.toFixed(1)}x`,
        threshold: '≥ 3.0x',
        status,
        explanation: `Interest coverage of ${reportedCoverage.toFixed(1)}x.`,
      };
    }

    if (ebit === undefined) {
      return {
        metric: 'Interest Coverage Ratio',
        formula: 'EBIT / Interest Expense',
        inputs: { ebit: 'N/A', interestExpense: interestExpense ?? 'N/A' },
        result: 0,
        formattedResult: 'Data Unavailable',
        threshold: '≥ 3.0x',
        status: 'UNKNOWN',
        explanation: 'Operating profit (EBIT) unavailable.',
      };
    }

    // Zero interest expense indicates virtually zero debt burden -> pristine pass
    if (interestExpense === undefined || interestExpense <= 0) {
      return {
        metric: 'Interest Coverage Ratio',
        formula: 'EBIT / Interest Expense',
        inputs: { ebit, interestExpense: 0 },
        result: 99.9,
        formattedResult: 'Zero Debt / Negligible Interest Expense',
        threshold: '≥ 3.0x',
        status: 'PASS',
        explanation: 'Company operates with negligible or zero borrowing cost obligations.',
      };
    }

    const cov = Math.round((ebit / interestExpense) * 10) / 10;
    const status = cov >= 3.0 ? 'PASS' : 'FAIL';
    return {
      metric: 'Interest Coverage Ratio',
      formula: 'EBIT / Interest Expense',
      inputs: { ebit, interestExpense },
      result: cov,
      formattedResult: `${cov.toFixed(1)}x`,
      threshold: '≥ 3.0x',
      status,
      explanation: status === 'PASS'
        ? `Comfortable operating buffer of ${cov.toFixed(1)}x over annual interest service.`
        : `Tight coverage of ${cov.toFixed(1)}x creates distress vulnerability under margin squeeze.`,
    };
  }

  /**
   * Debt to EBITDA Ratio
   * Formula: Total Debt / EBITDA
   */
  public static calculateDebtToEBITDA(
    totalDebt: number | undefined,
    ebitda: number | undefined
  ): CalculationResult {
    if (totalDebt === undefined || ebitda === undefined) {
      return {
        metric: 'Debt to EBITDA',
        formula: 'Total Debt / EBITDA',
        inputs: { totalDebt: totalDebt ?? 'N/A', ebitda: ebitda ?? 'N/A' },
        result: 0,
        formattedResult: 'Data Unavailable',
        threshold: '≤ 2.5x',
        status: 'UNKNOWN',
        explanation: 'Debt or EBITDA data missing.',
      };
    }

    if (ebitda <= 0) {
      return {
        metric: 'Debt to EBITDA',
        formula: 'Total Debt / EBITDA',
        inputs: { totalDebt, ebitda },
        result: 99.0,
        formattedResult: 'Negative / Zero EBITDA',
        threshold: '≤ 2.5x',
        status: 'FAIL',
        explanation: 'Company is operating with negative or zero cash EBITDA; debt cannot be serviced from operational flows.',
      };
    }

    if (totalDebt === 0) {
      return {
        metric: 'Debt to EBITDA',
        formula: 'Total Debt / EBITDA',
        inputs: { totalDebt: 0, ebitda },
        result: 0,
        formattedResult: '0.00x (Debt Free)',
        threshold: '≤ 2.5x',
        status: 'PASS',
        explanation: 'Zero financial debt obligations.',
      };
    }

    const ratio = Math.round((totalDebt / ebitda) * 100) / 100;
    const status = ratio <= 2.5 ? 'PASS' : 'FAIL';
    return {
      metric: 'Debt to EBITDA',
      formula: 'Total Debt / EBITDA',
      inputs: { totalDebt, ebitda },
      result: ratio,
      formattedResult: `${ratio.toFixed(2)}x`,
      threshold: '≤ 2.5x',
      status,
      explanation: status === 'PASS'
        ? `Manageable debt payback period of ${ratio.toFixed(2)} years of EBITDA.`
        : `Elevated leverage: debt payback exceeds ${ratio.toFixed(2)} years of EBITDA.`,
    };
  }

  /**
   * CFO to PAT Ratio (Cash Conversion & Earnings Quality)
   * Formula: Cash Flow from Operations / Net Profit (PAT)
   */
  public static calculateCFOtoPAT(
    cfo: number | undefined,
    pat: number | undefined
  ): CalculationResult {
    if (cfo === undefined || pat === undefined) {
      return {
        metric: 'CFO to PAT (Earnings Quality)',
        formula: 'Cash Flow from Operations / Net Profit (PAT)',
        inputs: { cfo: cfo ?? 'N/A', pat: pat ?? 'N/A' },
        result: 0,
        formattedResult: 'Data Unavailable',
        threshold: '≥ 0.85x',
        status: 'UNKNOWN',
        explanation: 'Operating cash flow or net profit figures unavailable.',
      };
    }

    if (pat <= 0) {
      const status = cfo > 0 ? 'PASS' : 'FAIL';
      return {
        metric: 'CFO to PAT (Earnings Quality)',
        formula: 'CFO / PAT',
        inputs: { cfo, pat },
        result: 0,
        formattedResult: pat === 0 ? 'Zero PAT' : 'Negative PAT',
        threshold: '≥ 0.85x',
        status,
        explanation: cfo > 0
          ? 'Positive operating cash flow despite accounting net loss.'
          : 'Negative operating cash flow and accounting net loss.',
      };
    }

    const ratio = Math.round((cfo / pat) * 100) / 100;
    const status = ratio >= 0.85 ? 'PASS' : 'FAIL';
    return {
      metric: 'CFO to PAT (Earnings Quality)',
      formula: 'Cash Flow from Operations / Net Profit (PAT)',
      inputs: { cfo, pat },
      result: ratio,
      formattedResult: `${ratio.toFixed(2)}x`,
      threshold: '≥ 0.85x',
      status,
      explanation: status === 'PASS'
        ? `High cash conversion of ${ratio.toFixed(2)}x confirms genuine accounting earnings.`
        : `Low cash conversion of ${ratio.toFixed(2)}x signals potential working capital accumulation or aggressive revenue recognition.`,
    };
  }

  /**
   * Capex Intensity (%)
   * Formula: Capital Expenditure / Total Revenue * 100
   */
  public static calculateCapexIntensity(
    capex: number | undefined,
    revenue: number | undefined
  ): CalculationResult {
    if (capex === undefined || revenue === undefined || revenue <= 0) {
      return {
        metric: 'Capex Intensity',
        formula: 'Capital Expenditures / Total Revenue × 100',
        inputs: { capex: capex ?? 'N/A', revenue: revenue ?? 'N/A' },
        result: 0,
        formattedResult: 'Data Unavailable',
        threshold: 'Reference',
        status: 'UNKNOWN',
        explanation: 'Capex or revenue figures unavailable.',
      };
    }

    const val = Math.round((Math.abs(capex) / revenue) * 1000) / 10;
    return {
      metric: 'Capex Intensity',
      formula: 'Capital Expenditures / Total Revenue × 100',
      inputs: { capex: Math.abs(capex), revenue },
      result: val,
      formattedResult: `${val.toFixed(1)}%`,
      threshold: 'Industry Contextual',
      status: 'PASS',
      explanation: `Reinvesting ${val.toFixed(1)}% of annual revenues back into gross fixed assets.`,
    };
  }

  /**
   * Operating Margin (%)
   */
  public static calculateOperatingMargin(
    ebit: number | undefined,
    revenue: number | undefined,
    reportedMargin?: number
  ): CalculationResult {
    const margin = reportedMargin !== undefined ? reportedMargin : ebit !== undefined && revenue && revenue > 0 ? (ebit / revenue) * 100 : undefined;

    if (margin === undefined) {
      return {
        metric: 'Operating Margin',
        formula: 'Operating Profit (EBIT) / Total Revenue × 100',
        inputs: { ebit: ebit ?? 'N/A', revenue: revenue ?? 'N/A' },
        result: 0,
        formattedResult: 'Data Unavailable',
        threshold: '≥ 10.0%',
        status: 'UNKNOWN',
        explanation: 'Revenue or operating profit unavailable.',
      };
    }

    const status = margin >= 10.0 ? 'PASS' : 'FAIL';
    return {
      metric: 'Operating Margin',
      formula: 'Operating Profit (EBIT) / Total Revenue × 100',
      inputs: { margin: `${margin.toFixed(1)}%` },
      result: margin,
      formattedResult: `${margin.toFixed(1)}%`,
      threshold: '≥ 10.0%',
      status,
      explanation: `Operating margin stands at ${margin.toFixed(1)}%.`,
    };
  }

  /**
   * 3-Stage DuPont RoE Decomposition
   * Formula: RoE = Net Margin (PAT / Revenue) * Asset Turnover (Revenue / Assets) * Equity Multiplier (Assets / Equity)
   * Flags whether RoE is driven by operational excellence vs dangerous financial leverage.
   */
  public static calculateDuPontRoE(
    netIncome: number | undefined,
    revenue: number | undefined,
    totalAssets: number | undefined,
    equity: number | undefined,
    reportedRoe?: number
  ): DuPontRoEResult {
    if (netIncome === undefined || revenue === undefined || totalAssets === undefined || equity === undefined ||
        revenue <= 0 || totalAssets <= 0 || equity <= 0) {
      return {
        metric: '3-Stage DuPont RoE Decomposition',
        roe: reportedRoe ?? 0,
        formattedRoE: reportedRoe ? `${reportedRoe.toFixed(1)}%` : 'Data Unavailable',
        net_margin_pct: 0,
        asset_turnover: 0,
        equity_multiplier: 0,
        status: 'UNKNOWN',
        leverage_driven_risk: false,
        primary_driver: 'INDETERMINATE',
        formula: 'Net Margin (PAT/Rev) × Asset Turnover (Rev/Assets) × Equity Multiplier (Assets/Equity)',
        inputs: {
          net_income: netIncome ?? 'N/A',
          revenue: revenue ?? 'N/A',
          total_assets: totalAssets ?? 'N/A',
          total_equity: equity ?? 'N/A',
        },
        explanation: 'Complete balance sheet and income statement items required for 3-stage DuPont decomposition.',
      };
    }

    const netMargin = (netIncome / revenue) * 100;
    const assetTurnover = revenue / totalAssets;
    const equityMultiplier = totalAssets / equity;
    const calculatedRoE = (netMargin / 100) * assetTurnover * equityMultiplier * 100;

    // Check for leverage-driven risk:
    // If equity multiplier > 3.5x (Assets > 3.5x Equity implies > 70% debt-funded assets)
    // or if net margin is paper thin (< 4%) while RoE is artificially high (> 18%)
    const leverageDriven = equityMultiplier > 3.5 || (equityMultiplier > 2.5 && netMargin < 5.0);

    let primaryDriver: DuPontRoEResult['primary_driver'] = 'BALANCED';
    if (leverageDriven) {
      primaryDriver = 'FINANCIAL_LEVERAGE';
    } else if (netMargin >= 18.0) {
      primaryDriver = 'OPERATING_EFFICIENCY';
    } else if (assetTurnover >= 1.5) {
      primaryDriver = 'ASSET_TURNOVER';
    }

    const status = calculatedRoE >= 12.0 && !leverageDriven ? 'PASS' : calculatedRoE < 12.0 ? 'FAIL' : 'FAIL';

    const explanation = leverageDriven
      ? `CAUTION: High RoE of ${calculatedRoE.toFixed(1)}% is predominantly driven by aggressive financial leverage (Equity Multiplier: ${equityMultiplier.toFixed(2)}x, Net Margin: ${netMargin.toFixed(1)}%).`
      : `RoE of ${calculatedRoE.toFixed(1)}% is driven by ${primaryDriver.toLowerCase().replace('_', ' ')} (Net Margin: ${netMargin.toFixed(1)}%, Asset Turnover: ${assetTurnover.toFixed(2)}x, Leverage: ${equityMultiplier.toFixed(2)}x).`;

    return {
      metric: '3-Stage DuPont RoE Decomposition',
      roe: Math.round(calculatedRoE * 10) / 10,
      formattedRoE: `${calculatedRoE.toFixed(1)}%`,
      net_margin_pct: Math.round(netMargin * 10) / 10,
      asset_turnover: Math.round(assetTurnover * 100) / 100,
      equity_multiplier: Math.round(equityMultiplier * 100) / 100,
      status: calculatedRoE >= 12.0 ? 'PASS' : 'FAIL',
      leverage_driven_risk: leverageDriven,
      primary_driver: primaryDriver,
      formula: 'Net Margin (PAT/Rev) × Asset Turnover (Rev/Assets) × Equity Multiplier (Assets/Equity)',
      inputs: {
        net_income: netIncome,
        revenue,
        total_assets: totalAssets,
        total_equity: equity,
      },
      explanation,
    };
  }

  /**
   * Multi-Year Financial Trend Evaluator
   * Classifies historical series into: IMPROVING, STABLE, DETERIORATING, VOLATILE, INSUFFICIENT_DATA
   */
  public static evaluateFinancialTrend(
    metricName: string,
    values: number[]
  ): FinancialTrendEvaluation {
    const validValues = (values || []).filter((v) => typeof v === 'number' && !isNaN(v));

    if (validValues.length < 2) {
      return {
        metric_name: metricName,
        trend: 'INSUFFICIENT_DATA',
        direction: 'UNKNOWN',
        periods_count: validValues.length,
        historical_min: validValues[0] ?? 0,
        historical_max: validValues[0] ?? 0,
        historical_avg: validValues[0] ?? 0,
        latest_value: validValues[0] ?? 0,
        explanation: `Insufficient historical periods (${validValues.length} < 2) to establish trend trajectory.`,
      };
    }

    const min = Math.min(...validValues);
    const max = Math.max(...validValues);
    const avg = Math.round((validValues.reduce((s, v) => s + v, 0) / validValues.length) * 100) / 100;
    const latest = validValues[validValues.length - 1];
    const first = validValues[0];
    const periods = validValues.length - 1;

    // Calculate YoY deltas
    const deltas: number[] = [];
    for (let i = 1; i < validValues.length; i++) {
      const prev = validValues[i - 1];
      const delta = prev !== 0 ? ((validValues[i] - prev) / Math.abs(prev)) * 100 : 0;
      deltas.push(delta);
    }

    // Direction changes count
    let signChanges = 0;
    for (let i = 1; i < deltas.length; i++) {
      if ((deltas[i] > 0 && deltas[i - 1] < 0) || (deltas[i] < 0 && deltas[i - 1] > 0)) {
        signChanges++;
      }
    }

    // CAGR
    let cagr: number | undefined = undefined;
    if (first > 0 && latest > 0 && periods > 0) {
      cagr = Math.round(((Math.pow(latest / first, 1 / periods) - 1) * 100) * 10) / 10;
    }

    let trend: FinancialTrendEvaluation['trend'] = 'STABLE';
    let direction: FinancialTrendEvaluation['direction'] = 'FLAT';

    if (signChanges >= 2 && deltas.some((d) => Math.abs(d) > 25)) {
      trend = 'VOLATILE';
      direction = 'VOLATILE';
    } else if (cagr !== undefined && cagr >= 8.0) {
      trend = 'IMPROVING';
      direction = 'UP';
    } else if (cagr !== undefined && cagr <= -8.0) {
      trend = 'DETERIORATING';
      direction = 'DOWN';
    } else {
      const positiveDeltas = deltas.filter((d) => d > 0).length;
      const negativeDeltas = deltas.filter((d) => d < 0).length;

      if (positiveDeltas >= deltas.length * 0.7) {
        trend = 'IMPROVING';
        direction = 'UP';
      } else if (negativeDeltas >= deltas.length * 0.7) {
        trend = 'DETERIORATING';
        direction = 'DOWN';
      } else if (Math.abs((latest - first) / (first || 1)) < 0.1) {
        trend = 'STABLE';
        direction = 'FLAT';
      } else {
        trend = 'VOLATILE';
        direction = 'VOLATILE';
      }
    }

    const explanation = `${metricName} has demonstrated an ${trend.toLowerCase()} trend across ${validValues.length} reporting periods (Historical range: ${min} to ${max}, Latest: ${latest}${cagr !== undefined ? `, CAGR: ${cagr}%` : ''}).`;

    return {
      metric_name: metricName,
      trend,
      direction,
      cagr_pct: cagr,
      periods_count: validValues.length,
      historical_min: min,
      historical_max: max,
      historical_avg: avg,
      latest_value: latest,
      explanation,
    };
  }

  /**
   * Compound Annual Growth Rate (CAGR)
   */
  public static calculateCAGR(startValue: number, endValue: number, periods: number): number | null {
    if (startValue <= 0 || endValue <= 0 || periods <= 0) return null;
    const cagr = (Math.pow(endValue / startValue, 1 / periods) - 1) * 100;
    return Math.round(cagr * 10) / 10;
  }

  /**
   * Free Cash Flow (FCF)
   */
  public static calculateFreeCashFlow(cfo: number | undefined, capex: number | undefined): number | null {
    if (cfo === undefined || capex === undefined) return null;
    return Math.round((cfo - Math.abs(capex)) * 10) / 10;
  }
}
