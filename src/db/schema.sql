-- Track-ency canonical schema
-- Source-agnostic: it doesn't matter whether a record came from a CRM,
-- spreadsheet, or CSV. The ingestion layer normalises everything here.

DROP TABLE IF EXISTS verification_status CASCADE;
DROP TABLE IF EXISTS confirmations CASCADE;
DROP TABLE IF EXISTS disbursements CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS charities CASCADE;

-- Charities registered on the platform
CREATE TABLE charities (
  id        TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  metadata  JSONB NOT NULL DEFAULT '{}'
);

-- Every donation ingested from any source
CREATE TABLE donations (
  id               SERIAL PRIMARY KEY,
  charity_id       TEXT NOT NULL REFERENCES charities(id),
  external_ref     TEXT NOT NULL,          -- original source reference/ID
  donor_name       TEXT NOT NULL,
  amount           NUMERIC(12,2) NOT NULL,
  currency         TEXT NOT NULL DEFAULT 'GBP',
  fund_designation TEXT NOT NULL,          -- 'general' | 'zakat' | 'sadaqah' | 'restricted'
  date_received    DATE NOT NULL,
  source_type      TEXT NOT NULL,          -- 'crm' | 'spreadsheet' | 'csv' | 'manual'
  raw_payload      JSONB NOT NULL,         -- original untouched row for audit
  ingested_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (charity_id, external_ref)
);

-- Disbursements from the charity's fund to programmes/partners
CREATE TABLE disbursements (
  id               TEXT PRIMARY KEY,       -- e.g. 'DISB-001'
  charity_id       TEXT NOT NULL REFERENCES charities(id),
  fund_designation TEXT NOT NULL,
  amount           NUMERIC(12,2) NOT NULL,
  programme        TEXT NOT NULL,
  partner          TEXT NOT NULL,
  date             DATE NOT NULL,
  source_type      TEXT NOT NULL,
  raw_payload      JSONB NOT NULL,
  ingested_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Recipient/partner sign-off on a disbursement
CREATE TABLE confirmations (
  id               TEXT PRIMARY KEY,
  disbursement_id  TEXT NOT NULL REFERENCES disbursements(id),
  type             TEXT NOT NULL,          -- 'recipient' | 'partner'
  confirmed        BOOLEAN NOT NULL DEFAULT false,
  date             DATE NOT NULL,
  source           TEXT NOT NULL           -- who confirmed (name, role, org)
);

-- Pre-computed trust level per donation per stage.
-- Written at ingest time; the tracker reads these with zero logic.
-- status: confirmed | self_reported | pending | failed | boundary
CREATE TABLE verification_status (
  id           SERIAL PRIMARY KEY,
  donation_id  INT NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
  stage        INT NOT NULL CHECK (stage BETWEEN 1 AND 6),
  status       TEXT NOT NULL,
  source_label TEXT NOT NULL,              -- shown verbatim as the trust pill
  computed_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (donation_id, stage)
);

CREATE INDEX idx_donations_charity    ON donations(charity_id);
CREATE INDEX idx_donations_ref        ON donations(external_ref);
CREATE INDEX idx_donations_fund       ON donations(charity_id, fund_designation);
CREATE INDEX idx_disbursements_fund   ON disbursements(charity_id, fund_designation);
CREATE INDEX idx_vs_donation          ON verification_status(donation_id);
CREATE INDEX idx_confirmations_disb   ON confirmations(disbursement_id);
