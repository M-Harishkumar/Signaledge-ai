# SignalEdge OS — Research Validation & QA Playbook

This playbook provides sample documents, test scenarios, and step-by-step validation procedures to test every module of **SignalEdge OS**.

---

## 📁 Available Sample Documents

All sample files are located in:
`C:\Users\Harishkumar.M\.gemini\antigravity\scratch\signaledge-os\sample_research_docs\`

| File Name | Category | Primary Tickers | Target Module |
| :--- | :--- | :--- | :--- |
| **`tatamotors_q3_fy26_concall_transcript.txt`** | Tier-2 Concall Transcript | `TATAMOTORS` | Multi-Agent Simulation, 8-Layer Gate Check, Thesis Builder |
| **`ministry_of_power_rtc_renewable_gazette_notification.txt`** | Tier-1 Official Gazette | `SUZLON`, `TATAPOWER` | Discovery Hub (F2), Geo-Macro Cascade, Pre-Buy Audit |
| **`defence_indigenisation_subsystems_pil6_filing.txt`** | Tier-1 Defence Directive | `HAL`, `BEL` | Daily Morning Brief, Simulation Grounding, Workspace |
| **`crude_oil_persian_gulf_freight_shock_case.txt`** | Tier-3 Macro Transmission | `AARTIIND`, `ONGC` | 21-Part Geo-Macro Cascade, Multi-Agent Swarm |

---

## 🧪 Step-by-Step Validation Scenarios

### Test 1: Grounded Multi-Agent Swarm Simulation
1. Navigate to **Multi-Agent Simulator** in the sidebar (`/simulation`).
2. Select the preset **"Middle East LNG & Oil Shock"** or enter:
   > *"Strait of Hormuz tanker freight rates surge 300%. Model feedstock margin transmission for Indian chemicals & aviation."*
3. Click **Attach Document** / **Choose File** and upload:
   `sample_research_docs/crude_oil_persian_gulf_freight_shock_case.txt`
4. Click **Run Swarm Simulation**.
5. **Verify**:
   - **Grounded Citations Tab**: Inspect that the document excerpts and source attribution are rendered.
   - **Stakeholder Dynamics**: View predicted actions of FIIs, DII Mutual Funds, Corporate CFOs, and Regulators.
   - **Transmission & Leading Indicators**: Verify second/third-order transmission stages.
   - **Dissenting Views**: Verify mandatory non-consensus minority cluster (e.g. 15–20% dissent analysis).

---

### Test 2: 8-Layer Pre-Buy Gate Check & Formula Audit
1. Navigate to **Companies & Audits** (`/companies`) and select **`TATAMOTORS`** or **`SUZLON`**.
2. Click **Run 8-Layer Gate Check**.
3. **Verify**:
   - **Layer 3 (Promoter Pledge)**: Verified at `0.0%` with formula $\text{Pledged Shares} / \text{Total Shares} \times 100 \le 5.0\%$.
   - **Layer 4 (RoCE)**: Verified at `22.4%` (TATAMOTORS) or `28.4%` (SUZLON) with formula $\text{EBITDA} / \text{Capital Employed} \ge 15.0\%$.
   - **Layer 5 (Debt/Equity)**: Verified at `0.42x` with formula $\text{Total Debt} / \text{Net Worth} \le 1.0\text{x}$.
   - **Status Transparency**: Verify explicit `PASS`, `FAIL`, or `UNKNOWN` badges.
   - **Forensic Red Flags**: Cash-Profit divergence and auditor stability checks.

---

### Test 3: Daily Morning Brief & Tiered Evidence Inspection
1. Navigate to **Daily Brief** in the sidebar (`/brief`).
2. Click **"Inspect Reason ▼"** on any catalyst card under **"Why am I seeing this signal?"**.
3. **Verify**:
   - **Tiered Source Badge**: Tier 1 (Official Regulatory), Tier 2 (Corporate Filing), Tier 3 (Primary Research).
   - **Invalidation Triggers**: "What could prove this wrong?" checklist.
   - **Direct Action Buttons**: Click **"Investigate"** to launch the universal research popup or **"Create Thesis"** to launch the thesis builder.

---

### Test 4: Research Workspace & Opportunity Pipeline
1. Navigate to **Research Workspace** (`/workspace`).
2. Switch between **Active Research Theses** and **5-Stage Opportunity Pipeline**.
3. In the Pipeline tab, click any stage button (e.g. `Investigating`, `Validated`, `Watching`) to move opportunities across stages.
4. Click **+ New Research Thesis** to open the 3-scenario builder:
   - Configure **Bull**, **Base**, and **Bear** probability cases.
   - Add custom invalidation triggers.
   - Click **Save Thesis** and verify atomic persistence in `data/store.json`.

---

### Test 5: 21-Part Geo-Macro Cascade Engine
1. Navigate to **Geo-Macro Cascade** in the sidebar (`/analysis`).
2. Enter a macro shock headline (e.g., from `ministry_of_power_rtc_renewable_gazette_notification.txt`):
   > *"Ministry of Power mandates 40% RTC renewable procurement for industrial consumers >1MW with 25-year ISTS wheeling charge waiver."*
3. Click **Synthesize 21-Part Analysis**.
4. **Verify**:
   - Multi-stage transmission from macro policy to sectoral impact.
   - Confidence labels (`FACT`, `INFERENCE`, `SPECULATION`).
   - Impacted NSE equity tickers with direct `[audit]` investigation triggers.

---

### Test 6: Verifiable Track Record & Sample Size Disclosure
1. Navigate to **Track Record & Alpha** in the sidebar (`/track-record`).
2. **Verify**:
   - Prominent **Sample Size & Methodology Disclosure Banner**.
   - Verified historical catalysts (e.g. Suzlon balance sheet turnaround, HAL aerospace indigenisation).
   - Lead time in days prior to public consensus recognition.
   - Alpha generated relative to the Nifty 50 benchmark.
