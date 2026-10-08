# SignalEdge OS
## AI-Powered Investment Opportunity Discovery Platform for Indian Public Equities

> [!IMPORTANT]
> **Regulatory Disclaimer (SEBI Compliance)**: SignalEdge OS is a discovery-first, analytical research workspace. It is NOT a SEBI-registered investment advisor, portfolio management service, algorithmic trading bot, or guaranteed return prediction engine. All analyses, simulations, and quantitative gates are educational and decision-support tools.

---

## 1. Core Architecture & Workflow

SignalEdge OS follows an institutional discovery and validation pipeline:

$$\text{DISCOVER} \rightarrow \text{UNDERSTAND} \rightarrow \text{SCREEN} \rightarrow \text{INVESTIGATE} \rightarrow \text{VALIDATE} \rightarrow \text{SIMULATE} \rightarrow \text{SCORE} \rightarrow \text{MONITOR} \rightarrow \text{REVIEW}$$

```mermaid
flowchart LR
    D[1. Discover F1-F7 Signals] --> U[2. Understand Macro Themes]
    U --> S[3. Screener Filtering]
    S --> I[4. Investigate Company Workspace]
    I --> V[5. Validate 8-Layer Pre-Buy Gate]
    V --> M[6. Simulate Multi-Persona Swarm]
    M --> T[7. Formulate Research Thesis]
    T --> W[8. Monitor Watchlists & Delta Audits]
    W --> R[9. Review Benchmark Track Record]
```

---

## 2. Truthful Data State Taxonomy

SignalEdge OS strictly categorizes all financial information to eliminate synthetic halluncinations and maintain total institutional transparency:

| Data State Tag | Definition & Source | Handling Policy |
| :--- | :--- | :--- |
| `[LIVE DATA]` | Live OHLCV, market cap, and primary quotes fetched via Yahoo Finance / NSE feeds. | Cached with 60s TTL; timestamped. |
| `[SEEDED DATA]` | Audited historical filings, 5-year financial statements, and baseline track records. | Explicitly labeled `SEED_DATA` in UI & APIs. |
| `[CALCULATED DATA]` | Mathematically derived ratios (RSI-14, SMA-50/200, MACD, RoCE, DuPont Decomposition). | Derived directly from verified numbers without modulo mockery. |
| `[SIMULATED DATA]` | LLM Persona Cluster Simulation (FII, DII, CFO, Regulator) scenario outputs. | Clearly labeled as multi-persona stress test. |
| `[AI INFERENCE]` | Synthesis, document grounding, and catalyst hypothesis explanations. | Grounded with page/document citations; never converted to FACT. |
| `[UNKNOWN]` | Unreported, unverified, or missing metric values. | Strictly preserved as `UNKNOWN`; never falsified into PASS. |

---

## 3. Signal Engine Taxonomy (F1–F7)

- **F1: Regulatory Radar** — PLI disbursements, defense indigenization, and export policy shifts.
- **F2: Strategy Shift DNA** — Management capex pivots, demergers, and value-unlocking restructurings.
- **F3: Institutional Flow Divergence** — DII accumulation vs. FII rotation divergence patterns.
- **F4: Macro Transmission Cascade** — Multi-stage commodity and interest-rate ripple models.
- **F5: Supply Chain Bottlenecks** — Critical component shortages and domestic capacity substitutes.
- **F6: Forensic Quality Filter** — Working capital deterioration, auditor changes, and leverage alerts.
- **F7: Cross-Asset Lead Indicators** — Freight rates, currency movements, and bond yield spreads.

---

## 4. Verification & Testing Matrix

Run the comprehensive test suite verifying all 103 integration and functional checkpoints:

```bash
# Execute automated test suite
npx tsx test_suite.ts

# Production build verification
npm run build
```

**Results**:
- **103 / 103 Tests Passed (100%)**
- **0 TypeScript compilation errors**
- **Vite production bundle generated in 7.31s**
