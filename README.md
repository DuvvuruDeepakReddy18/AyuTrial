# AIIA Clinical Trial Management System (AyuTrial)
**Smart India Hackathon 2026** · **Problem Statement: SIH26046**  
**Organization:** Ministry of Ayush, Government of India  
**Institution:** All India Institute of Ayurveda (AIIA), New Delhi  
**Domain:** Clinical Trial Management System (CTMS), Ayurveda Research, Clinical Research Analytics, and National Pharmacovigilance Coordination Centre (NPvCC) for ASU&H Drugs.


> **🌐 LIVE PUBLIC DEPLOYMENT (VERIFIED):**  
> **Production URL:** [https://ayutrial-ctms.vercel.app](https://ayutrial-ctms.vercel.app)  
> **Deployment Status:** `READY` (Vercel Global Edge Network)  
> **Evaluator Quick Access:** Instant 1-click RBAC persona switcher on top header bar (No password required in demo mode)

---

## 🏛️ Executive Product Overview

The **AIIA Clinical Trial Management System (AyuTrial)** is an enterprise cloud platform built specifically for the **All India Institute of Ayurveda (AIIA)** and the **Ministry of Ayush**. It unifies clinical research operations, multi-centre trial governance, GCP-ASU protocol tracking, CTRI registration verification, participant screening and enrolment funnels, CRA site monitoring, and adverse event surveillance into a unified institutional command centre.

Crucially, the platform serves as the digital apex for the **National Pharmacovigilance Coordination Centre (NPvCC)** for ASU&H drugs hosted at AIIA, featuring statutory 24-hour SAE triage, WHO-UMC causality algorithms, and CDSCO submission pipelines.

---

## ⚡ Key Highlights & Core Capabilities

| Capability | Institutional Description |
| :--- | :--- |
| **Multi-Study Portfolio Management** | 10 active Ayurveda clinical trials across Phases I–IV (Ashwagandha RCT, AYUSH-64, Nano-Curcumin, Guduchi, etc.). |
| **National Research Site Network** | 8 validated clinical research centres (AIIA New Delhi, IPGT&RA Jamnagar, NIA Jaipur, IMS BHU Varanasi, etc.). |
| **NPvCC Pharmacovigilance Apex** | Dedicated ASU&H safety desk with statutory 24-hour SAE countdown clock, 7-day expedited triage, and 14-day standard reporting window. |
| **WHO-UMC Causality Algorithm** | Standardized causality assessment (Certain, Probable, Possible, Unlikely, Unclassifiable) and Naranjo probability scores. |
| **ALCOA+ Cryptographic Audit Trail** | Immutable SHA-256 hash-chained ledger (`Hash(N) = SHA256(Hash(N-1) + ...)`) with real-time on-screen verification engine. |
| **CDISC & HL7 FHIR Interoperability** | SDTM domain mapping (DM, AE, EX, VS, LB, DS, SV), Define-XML 2.0 metadata inspector, and HL7 FHIR R4 ResearchStudy / AdverseEvent bundle generator. |
| **ABDM Integration Readiness** | Architectural blueprint for Ayushman Bharat Digital Mission (ABHA verification, HIP/HIU adapters, NAMASTE code mapping). |
| **Ethics & CTRI Governance** | ICMR 2017 & GCP-ASU compliance, continuing review expiry countdowns, and multi-lingual vernacular consent logs. |
| **7 Server-Enforced RBAC Roles** | Principal Investigator (PI), Study Coordinator (CRC), CRA Monitor, Ethics Committee (IEC), PV Officer, Admin, and Regulator. |
| **Instant Persona Simulator** | Dedicated 1-click role switcher in demo mode enabling judges and evaluators to experience tailored views for all 7 stakeholders. |

---

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router, Turbopack, React 19)
- **Language:** TypeScript 5 with strict static type safety
- **Styling:** Tailwind CSS with institutional Ayush design tokens (Deep Forest Green, Dark Navy, Slate, Sage)
- **Icons:** Lucide React
- **Analytics & Visualizations:** Recharts (responsive pie, bar, and area charts)
- **Data Architecture:** Dual-mode engine:
  - **In-Memory + Browser LocalStorage:** Full CRUD persistence, live derived KPIs, and cryptographic audit logging for seamless zero-dependency evaluation.
  - **PostgreSQL / Supabase:** Production-ready schema migrations with Row Level Security (RLS) policies.
- **Cryptography:** Web Crypto API / Node.js `crypto` (SHA-256 block hashing)
- **Interoperability:** CDISC SDTM v3.3 / CDASH / Define-XML 2.0 / HL7 FHIR R4 JSON

---

## 🚀 Quick Start & Local Execution

### 1. Prerequisites
- Node.js v18+ (tested on Node v24.15.0)
- npm v9+

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/DuvvuruDeepakReddy18/AyuTrial.git
cd AyuTrial

# Install dependencies
npm install
```

### 3. Environment Setup
Copy the environment template:
```bash
cp .env.example .env.local
```
*(No external API keys are required to run the comprehensive demo dataset).*

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Production Build & Test Suite
```bash
# Execute automated workflow integration tests (21/21 passing assertions)
npx -y tsx -e "import { runAllWorkflowTests } from './src/tests/workflows.test'; runAllWorkflowTests();"

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 🧭 Application Site Map (All 28 Implemented Routes)

### Public Routes
- `/` — Institutional Landing Page with Ministry of Ayush branding, SIH26046 problem overview, and 1-click persona launcher.
- `/login` — Authentication portal with Quick 1-Click Demo Persona Sign-In.
- `/access-denied` — HTTP 403 authorization diagnostic page with security clearance indicators.

### Operational Command
- `/dashboard` — Executive Command Centre with 10 real computed KPIs, 7 Recharts visualisations, 24h SAE countdown clock, and recent audit events.

### Clinical Portfolio & Accrual
- `/studies` — Protocol portfolio directory with multi-parameter filtering, search, and progress bars.
- `/studies/new` — Protocol registration form with GCP-ASU metadata fields.
- `/studies/[id]` — Comprehensive study dossier with 10-stage lifecycle pipeline, milestone tracker, and tabbed dossiers.
- `/studies/[id]/edit` — Protocol parameter editor with status transition validation.
- `/sites` — National research site network with recruitment target meters and monitoring dates.
- `/participants` — Synthetic participant registry with de-identified IDs (DEMO-series).
- `/participants/[id]` — Participant clinical dossier with scheduled visit compliance matrices and linked safety cases.
- `/screening` — Screening logs & eligibility checklist evaluation engine.
- `/enrolment` — Accrual velocity analytics and conversion funnels.
- `/visits` — Scheduled visit adherence matrix with Ayush exam evaluations (Prakriti, Agni, Koshtha) and drug dispensing tracking.

### Quality, Oversight & Safety
- `/monitoring` — CRA site monitoring visits, source data verification (SDV), and CAPA tracking.
- `/deviations` — Protocol deviations management with severity classification, root cause analysis, and IEC notification logs.
- `/data-management` — eCRF query resolution workflow with clinical response notes.
- `/pharmacovigilance` — National Pharmacovigilance Coordination Centre (NPvCC) command dashboard.
- `/pharmacovigilance/new` — ICSR safety reporting form with statutory regulatory deadline calculations and WHO-UMC causality algorithm.
- `/pharmacovigilance/[id]` — Printable formal CIOMS-I / MedWatch 3500A style case report dossier.

### Compliance & Standards
- `/regulatory` — Statutory compliance matrix covering GCP-ASU, ICMR 2017 guidelines, and NDCT Rules 2019.
- `/ethics` — Institutional Ethics Committee (IEC) review workflow and continuing review renewal triage.
- `/consent` — Informed consent documentation with vernacular language and audio-visual recording tracking.
- `/reports` — Multi-scope reporting centre with instant CSV exports.
- `/interoperability` — CDISC SDTM domain explorer (DM, AE, EX, VS, LB) + HL7 FHIR R4 bundle inspector + ABDM readiness matrix.
- `/audit-logs` — ALCOA+ cryptographic audit ledger with real-time SHA-256 chain verification.

### Administration & Governance
- `/users` — User directory with RBAC clearances and 1-click persona simulation.
- `/settings` — Statutory regulatory deadline rules editor and storage engine configuration.

---

## 🔒 Security, Compliance & Limitations

1. **Role-Based Access Control (RBAC):** Server-side clearance checks enforce permissions across every operational module.
2. **De-identified Data:** Only synthetic participant identifiers (e.g. `DEMO-0001`) are utilized. No real patient health information (PHI) is present.
3. **Data Integrity:** The SHA-256 hash chain prevents silent alterations to clinical records.
4. **Compliance Disclaimer:** This platform is developed as a demonstrative prototype for Smart India Hackathon 2026 and requires institutional validation prior to direct clinical decision-making.

---

## 👥 SIH 2026 Evaluation Personas

To test different role perspectives, use the **Role Switcher** in the top navigation bar or log in via `/login`:
- **Institutional Administrator:** Vikramaditya Sen (`admin.ctms@aiia.gov.in`)
- **Principal Investigator (PI):** Dr. Sujata Sharma (`dr.sharma@aiia.gov.in`)
- **Pharmacovigilance Officer (NPvCC):** Dr. Priya Nair (`pv.officer@npvcc-ayush.gov.in`)
- **Study Coordinator (CRC):** Rajesh Kumar (`rajesh.crc@aiia.gov.in`)
- **CRA Site Monitor:** Ananya Deshmukh (`ananya.cra@aiia-monitoring.in`)
- **Institutional Ethics Committee Chair:** Prof. V. K. Joshi (`iec.chair@aiia.gov.in`)
- **Read-Only Regulator (CDSCO):** S. K. Verma (`regulator.audit@cdsco.nic.in`)
