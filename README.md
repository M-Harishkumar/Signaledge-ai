# SignalEdge OS
### AI-Powered Investment Opportunity Discovery Platform for Indian Equities

**Author:** Harishkumar M  
**Repository:** [https://github.com/M-Harishkumar/Signaledge-ai](https://github.com/M-Harishkumar/Signaledge-ai)

---

## Overview

**SignalEdge OS** is an equity research and market opportunity discovery workstation built for Indian public equities (NSE/BSE). It analyzes market signals, statutory filings, corporate announcements, and financial statements to help investors identify structural opportunities before mainstream recognition.

---

## Core Features

- **Find Opportunities**: Multi-stream market signal radar monitoring Policy & Regulatory Changes, Corporate Strategy Shifts, Big Investor Activity, Economic Transmission, Supply Chain Dynamics, and Financial Quality Checks.
- **Research Company Hub**: Single source of truth for deep company fundamental analysis, SWOT synthesis, DuPont 3-Stage ROE breakdown, audited historical early detection logs, and management earnings call commentary.
- **Before You Invest (8-Point Quality Check)**: Objective fundamental checks covering Return on Capital (RoCE), leverage, interest coverage, cash flow conversion, and promoter share encumbrance.
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
