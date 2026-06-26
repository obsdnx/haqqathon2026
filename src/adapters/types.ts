// Canonical shapes that every ingestion adapter must produce.
// The source format is irrelevant once it reaches these types.

export interface CanonicalDonation {
  external_ref: string;
  charity_id: string;
  donor_name: string;
  amount: number;
  currency: string;
  fund_designation: string;
  date_received: string; // YYYY-MM-DD
  source_type: 'crm' | 'spreadsheet' | 'csv' | 'manual';
  raw_payload: Record<string, unknown>; // original row, untouched
}

export interface CanonicalDisbursement {
  id: string;
  charity_id: string;
  fund_designation: string;
  amount: number;
  programme: string;
  partner: string;
  date: string;
  source_type: string;
  raw_payload: Record<string, unknown>;
}

export interface CanonicalConfirmation {
  id: string;
  disbursement_id: string;
  type: 'recipient' | 'partner';
  confirmed: boolean;
  date: string;
  source: string;
}

export interface CanonicalCharity {
  id: string;
  name: string;
  metadata: Record<string, unknown>;
}

// Contract: every donation source adapter implements this
export interface DonationSourceAdapter {
  source_type: CanonicalDonation['source_type'];
  fetchDonations(): Promise<CanonicalDonation[]>;
}
