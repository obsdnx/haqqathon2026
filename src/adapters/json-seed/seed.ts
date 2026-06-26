// Raw seed records — intentionally messy/inconsistent column names to prove
// the adapter normalises them regardless of source shape.

export const CHARITY_SEED = {
  id: 'CHY-001',
  name: 'Al-Amal Foundation',
  metadata: { registered_number: 'UK1234567', contact: 'info@al-amal.example' },
};

// Simulates a CRM export — field names come from the CRM system
export const CRM_EXPORT_ROWS = [
  {
    CRM_ID: 'CRM-001',
    'Full Name': 'Ahmed Al-Rashid',
    'Amount (GBP)': 500.00,
    Fund: 'ZAKAT',
    'Gift Aid Claimed': 'No',
    'Transaction Date': '2024-01-15',
    Notes: 'Bank transfer — annual zakat payment',
  },
  {
    CRM_ID: 'CRM-002',
    'Full Name': 'Ibrahim Osei',
    'Amount (GBP)': 1200.00,
    Fund: 'ZAKAT',
    'Gift Aid Claimed': 'No',
    'Transaction Date': '2024-02-01',
    Notes: 'Standing order',
  },
  {
    CRM_ID: 'CRM-003',
    'Full Name': 'Kwame Mensah',
    'Amount (GBP)': 800.00,
    Fund: 'GENERAL',
    'Gift Aid Claimed': 'Yes',
    'Transaction Date': '2024-02-28',
    Notes: 'Online donation',
  },
];

// Simulates a spreadsheet export — different column naming convention
export const SPREADSHEET_EXPORT_ROWS = [
  {
    ref: 'SS-001',
    name: 'Fatima Nkrumah',
    amount: '250.00',
    currency: 'GBP',
    fund: 'general',
    date: '2024-01-20',
    source_note: 'Church collection, counted and deposited 22 Jan',
  },
  {
    ref: 'SS-002',
    name: 'Zainab Traore',
    amount: '3000.00',
    currency: 'GBP',
    fund: 'zakat',
    date: '2024-03-10',
    source_note: 'Bank wire from Dubai account',
  },
];

// Disbursements — how the charity spent the funds
export const DISBURSEMENT_SEED = [
  {
    id: 'DISB-001',
    charity_id: 'CHY-001',
    fund_designation: 'zakat',
    amount: 700.00,
    programme: 'Emergency Food Aid — Ghana',
    partner: 'Hand Up Ghana',
    date: '2024-03-01',
    source_type: 'manual',
    raw_payload: { internal_ref: 'ZDISB-2024-001', approved_by: 'Finance Committee', invoice: 'INV-HUG-2024-03' },
  },
  {
    id: 'DISB-002',
    charity_id: 'CHY-001',
    fund_designation: 'general',
    amount: 250.00,
    programme: 'Community Hall Renovation',
    partner: 'Accra Community Trust',
    date: '2024-04-01',
    source_type: 'manual',
    raw_payload: { internal_ref: 'GDISB-2024-001', approved_by: 'Trustee Board' },
  },
  {
    id: 'DISB-003',
    charity_id: 'CHY-001',
    fund_designation: 'zakat',
    amount: 1200.00,
    programme: 'Medical Kit Distribution — Sahel',
    partner: 'Nile Relief',
    date: '2024-04-15',
    source_type: 'manual',
    raw_payload: { internal_ref: 'ZDISB-2024-002', approved_by: 'Finance Committee', invoice: 'INV-NR-2024-04' },
  },
];

// Independent recipient confirmations
export const CONFIRMATION_SEED = [
  {
    id: 'CONF-001',
    disbursement_id: 'DISB-001',
    type: 'recipient' as const,
    confirmed: true,
    date: '2024-03-05',
    source: 'Kwabena Asante, Project Coordinator, Hand Up Ghana — 70 food parcels distributed to 70 households.',
  },
  {
    id: 'CONF-002',
    disbursement_id: 'DISB-003',
    type: 'recipient' as const,
    confirmed: true,
    date: '2024-04-22',
    source: 'Dr Amina Hassan, Director, Nile Relief — 240 medical kits deployed across 3 clinics in the Sahel region.',
  },
];
