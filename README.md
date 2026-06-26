# Track-ency

**Track-ency** is a charity transparency platform that lets donors follow their money from the moment of donation through to programme delivery — and lets charities demonstrate that journey with independently-verifiable evidence.

Live demo: [https://accra-ten.vercel.app](https://accra-ten.vercel.app)

---

## What it does

Donors often have no visibility beyond the payment confirmation screen. Track-ency closes that gap by exposing two complementary views of the same underlying data:

- **Charity view** — connects multiple donation data sources (CRMs, spreadsheets, CSV exports), normalises them into a single canonical table, and shows the per-donation lifecycle through a 6-stage tracker.
- **Donor view** — a public-facing tracker a donor can open (or embed as a widget) to see exactly where their specific donation sits in the pipeline, with trust-status badges on each stage.

Neither view fabricates traceability past the point where individual donations merge into a shared fund pool. The pooling boundary is made explicit in the UI — stage 3 (Allocated to Fund) is as far as pound-level tracing goes. Disbursement stages beyond that boundary are reported at the programme level, not the individual donation level.

---

## Two-view demo

### Charity view

| Feature | Description |
|---------|-------------|
| **Source connector** | Click any source card (Beacon CRM, Donorfy, Salesforce, CSV, Manual) to simulate a live connection. A 1.3-second animation signals ingestion. |
| **Normalisation showcase** | After connecting a source, a before/after panel appears. The "before" panel shows raw data with colour-coded issues (red = date format inconsistency, amber = donor name variation). The "after" panel shows the normalised output. A legend explains each highlight colour. |
| **Canonical donations table** | Aggregates all connected sources. Rows from the most recently connected source are highlighted with a teal left border so you can see exactly which records a new source contributed. |
| **Donation tracker** | Click any row to open the 6-stage tracker for that donation. The stepper visually separates pre-pool stages from post-pool stages with an inline pool boundary marker (◆ pool). |

### Donor view

| Feature | Description |
|---------|-------------|
| **Donation lookup** | Pre-loaded with six example donations across different funds (Zakat, General Sadaqah, Emergency Relief). Select any to load its tracker. |
| **6-stage stepper** | Visual progress indicator with trust-status badges per stage (confirmed / self-reported / pending). |
| **Pool boundary** | An explicit "◆ pool" chip inside the stepper connector marks where pound-level tracing ends. |
| **Stage detail panel** | Click any stage node to expand a detail card showing date, reference, description, and trust status. |
| **Stage hint** | "Select a stage to see details" hint visible by default; hidden once a stage is selected. |
| **Embed mode** | Toggle between standalone page and widget embed modes to preview how the tracker looks when embedded on a charity's own site. |
| **Phone frame preview** | Wrap the tracker in a phone frame to preview the mobile experience. |

---

## Trust status model

Each stage carries one of four trust statuses:

| Status | Visual | Meaning |
|--------|--------|---------|
| `confirmed` | Solid green | Independently verified by the recipient or a third party |
| `self_reported` | Muted grey | Reported by the charity itself; not independently verified |
| `pending` | Dashed hollow | Stage not yet reached |
| `boundary` | Divider chip | Pool boundary — individual tracing stops here |

---

## Architecture

This is a deliberately simple single-file Express server. There is no database, no authentication, and no external API calls. All data is held in memory.

```
accra/
├── src/
│   ├── server.ts          # Entire application — Express server + HTML page generator
│   ├── adapters/          # Source adapter stubs (not used in demo UI)
│   │   ├── crm/           # CRM adapter interfaces
│   │   └── ...
│   ├── db/                # Database schema (Postgres, not used in demo UI)
│   ├── ingestion/         # Ingestion pipeline (not used in demo UI)
│   └── ingest.ts          # Orchestration entry point
├── seed-data/             # Sample donation records for the ingestion pipeline
├── .env.example           # Environment variable template
├── docker-compose.yml     # Postgres container for the ingestion pipeline
├── package.json
├── tsconfig.json
└── vercel.json            # Vercel deployment configuration
```

### How the server works

`src/server.ts` is the only file that matters for the demo. It exports an Express app with a single route:

```
GET / → buildPage() → full self-contained HTML page (inline CSS + inline JS)
```

The `buildPage()` function returns a complete HTML document. All styles and scripts are inlined — no build step, no bundler, no external assets beyond Google Fonts.

When running locally (`npm run dev`), the server calls `app.listen()`. When deployed to Vercel, the `VERCEL` environment variable is set, and `app.listen()` is skipped — Vercel handles the port binding. The module default-exports `app` for Vercel to import.

### In-memory data structures

The page contains five data constants that model what a real normalisation database would hold:

```javascript
SOURCES      // five source systems: Beacon, Donorfy, Salesforce, CSV, Manual
DONATIONS    // six canonical donation records (post-normalisation)
VERIFICATION // per-stage trust status for each donation
RAW_INPUTS   // raw pre-normalisation rows with data quality issues
NORM_ROWS    // clean post-normalisation rows for the before/after showcase
STAGES       // six stage definitions with names and icons
```

### Adapter pattern (ingestion pipeline)

The `src/adapters/` directory contains the real adapter pattern used by the ingestion pipeline (separate from the demo UI):

| Adapter | Source type | What it does |
|---------|------------|--------------|
| `JsonCrmAdapter` | CRM JSON export | Parses CRM-format JSON, maps to canonical schema |
| `JsonSpreadsheetAdapter` | Spreadsheet JSON | Parses spreadsheet-format JSON |
| `CsvDonationAdapter` | CSV file | Parses CSV donation exports |

Adding a new source adapter: implement the `DonationAdapter` interface and register it in `ingest.ts`. No changes required to core normalisation or reconciliation logic.

### Design system

The UI uses a strict CSS custom property system — no utility-class framework, no external component library.

```css
/* Brand colours */
--navy, --navy-mid, --green, --green-bg, --green-border, --amber, --amber-bg, --red

/* Neutrals: 10-step grey scale */
--gray-50 through --gray-900

/* Type scale: 6 sizes only */
--f-2xl: 1.75rem  --f-xl: 1.25rem  --f-lg: 1rem
--f-base: 0.875rem  --f-sm: 0.75rem  --f-xs: 0.6875rem

/* Spacing: 8pt grid */
--s1: 4px  --s2: 8px  --s3: 12px  --s4: 16px  --s5: 20px
--s6: 24px  --s7: 28px  --s8: 32px  --s9: 36px  --s10: 40px

/* Radii */
--r-sm: 4px  --r: 6px  --r-lg: 8px  --r-full: 9999px

/* Shadows: two only */
--shadow-xs  --shadow-sm
```

---

## Local development

### Prerequisites

- Node.js 18+
- npm

### Run the demo (no database needed)

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
# → http://localhost:3000
```

That is all. The demo UI uses only in-memory data — no Postgres, no `.env` file needed.

### Run the full ingestion pipeline (requires Postgres)

The ingestion pipeline reconciles CRM data against a bank feed and writes results to Postgres. It is separate from the demo UI.

```bash
# 1. Start Postgres
docker-compose up -d

# 2. Copy env and fill in values
cp .env.example .env

# 3. Apply database schema
npm run setup-db

# 4. Ingest seed data
npm run ingest

# 5. Start server
npm run dev
```

### Build for production

```bash
npm run build       # tsc → dist/
npm start           # node dist/server.js
```

---

## Deploying to Vercel

The project is pre-configured for Vercel via `vercel.json`:

```json
{
  "version": 2,
  "builds": [{ "src": "src/server.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/server.ts" }]
}
```

Vercel compiles TypeScript directly using `@vercel/node` — no manual `tsc` step required on deploy.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

### Environment variables

No environment variables are required for the demo UI.

For the ingestion pipeline, set the following in your Vercel project settings or in a local `.env` file:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

---

## The pooling problem

A common transparency failure in charity reporting is false pound-level tracing past a shared fund. When multiple donations are pooled into one bank account before disbursement, it is mathematically impossible to say "donor A's specific £50 paid for item X". Track-ency makes this honest:

1. Stages 1–3 (Donation Received → Logged → Allocated to Fund) trace the individual donation.
2. The pool boundary chip (◆) marks where the money enters the shared pot.
3. Stages 5–6 (Disbursed → Delivery Confirmed) are reported at the programme level.

The UI never draws a line from an individual donor through the pool to a specific output. That is the point.

---

## Project context

Built for the Haqqathon 2026 — a hackathon focused on financial transparency for Islamic charitable giving. The demo organisation is Al-Noor Community Trust, with sample donations across Zakat, General Sadaqah, and Emergency Relief funds.
