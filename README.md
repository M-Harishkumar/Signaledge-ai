# SignalEdge OS
### AI-Powered Investment Opportunity Discovery Platform for Indian Equities

**Author:** Harishkumar M  
**Version:** 2.7.0  
**Repository:** [https://github.com/M-Harishkumar/Signaledge-ai](https://github.com/M-Harishkumar/Signaledge-ai)

---

## Overview

**SignalEdge OS** is an equity research and market opportunity discovery workstation built for Indian public equities (NSE/BSE). Developed in the Department of Artificial Intelligence and Data Science at Bannari Amman Institute of Technology, it analyzes market signals, statutory filings, corporate announcements, and financial statements to help investors identify structural opportunities before mainstream recognition.

---

## Academic & Patent Connection

- **Institution:** Bannari Amman Institute of Technology
- **Department:** Department of Artificial Intelligence and Data Science
- **Project Title:** SignalEdge OS &mdash; AI-Powered Investment Opportunity Discovery Platform
- **Application Domain:** Indian Public Equity Investment Research
- **Filed Patent Application:** Indian Patent Office Application No. `202641118456`
- **Original Patent Title:** *“VERIFY-FIRST Adaptive Learning Path Generation System with Authority and Freshness Validation”*
- **Legal Status:** Filed Patent Application (Not Granted)

### Official Patent Relationship Statement

> “SignalEdge OS adapts related principles of source-authority assessment, information-freshness validation and evidence relationships to investment research. These principles are relevant to the separately filed VERIFY-FIRST Adaptive Learning Path Generation System with Authority and Freshness Validation. The original invention concerns adaptive learning paths; this project applies related principles to financial claims, company analysis and research-thesis monitoring. The existing patent application is not represented as a granted patent or as automatically covering SignalEdge OS.”

### Verify-First Evidence Engine Architecture

SignalEdge OS implements an evidence-grounding engine adapting principles from the patent application:
- **Hierarchical Source Authority**: Tier 1 (Statutory BSE/NSE filings, SEBI disclosures, weight: 1.0) down to Tier 4 (Unverified rumors, social commentary, weight: 0.15).
- **Anti-Syndication Deduplication**: Identifies syndicated wire agency reprints so derivative reporting is never counted as independent corroboration.
- **Strict Temporal Freshness**: Category-specific expiry thresholds (Quarterly filings: 105 days, Annual reports: 425 days, Real-time orders: 24–48 hours).
- **Missing Data Discipline**: Missing fundamental ratios (e.g., RoCE, D/E) strictly evaluate to `UNKNOWN` with `DATA_UNAVAILABLE` evidence status, forcing Pre-Buy Gate verdicts to `Requires investigation` rather than assuming a pass.
- **Contradiction Preservation**: Flags conflicting claims (e.g., reported net debt vs. off-balance sheet operating lease debt) and preserves both sources with `CONFLICTING` status.
- **Thesis Degradation Triggers**: Automatically audits active research theses and transitions status to `NEEDS_REVIEW` whenever underlying evidence becomes stale or contradicted.

---

## Core Features

- **Verify-First Research**: Interactive evidence verification console for auditing claim authority, freshness, source tiers, excerpts, and conflicting evidence.
- **Find Opportunities**: Multi-stream market signal radar monitoring Policy & Regulatory Changes, Corporate Strategy Shifts, Big Investor Activity, Economic Transmission, Supply Chain Dynamics, and Financial Quality Checks.
- **Research Company Hub**: Single source of truth for deep company fundamental analysis, SWOT synthesis, DuPont 3-Stage ROE breakdown, audited historical early detection logs, and management earnings call commentary.
- **Before You Invest (8-Point Quality Check)**: Objective fundamental checks covering Return on Capital (RoCE), leverage, interest coverage, cash flow conversion, and promoter share encumbrance with grounded Verify-First evidence links.
- **Stock Screener**: Multi-metric quantitative screening with strategy presets (Conservative Compounders, High-ROCE Leaders, Deleveraging Plays) and custom criteria builder.
- **Scenario & Economic Impact Simulator**: Multi-perspective scenario modeling (Growth, Value, Quant, Macro) and 6-stage macroeconomic causal cascade analysis.
- **Continuous Monitoring & Watchlists**: Real-time tracking and structured "What Changed" delta alerts for watched companies.
- **Institutional Research Assistant**: Tool-grounded AI assistant powered by Google Gemini API to query financial ratios, risk checks, and document citations.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key (optional, for grounded AI Research Assistant features)

### Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/M-Harishkumar/Signaledge-ai.git
   cd Signaledge-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

6. **Run Verification & Test Suite:**
   ```bash
   npx tsx test_suite.ts
   ```

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Express.js, TypeScript, Server-Sent Events (SSE)
- **AI Integration**: `@google/genai` (Google Gemini API)
- **Financial Analytics**: 3-Stage DuPont ROE Engine, Technical Indicators (RSI-14, SMA-50/200, Bollinger Bands)

---

## Disclaimer

*SignalEdge OS is an analytical research and educational workstation. It is not a SEBI-registered investment advisor or portfolio management service. All analyses and simulations are decision-support tools.*
