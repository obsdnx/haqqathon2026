import { DonationSourceAdapter, CanonicalDonation } from '../types';
import { CRM_EXPORT_ROWS, SPREADSHEET_EXPORT_ROWS } from './seed';

// Normalises the CRM export shape → canonical donation
export class JsonCrmAdapter implements DonationSourceAdapter {
  readonly source_type = 'crm' as const;

  async fetchDonations(): Promise<CanonicalDonation[]> {
    return CRM_EXPORT_ROWS.map((row) => ({
      external_ref: row.CRM_ID,
      charity_id: 'CHY-001',
      donor_name: row['Full Name'],
      amount: row['Amount (GBP)'],
      currency: 'GBP',
      fund_designation: row.Fund.toLowerCase(),
      date_received: row['Transaction Date'],
      source_type: 'crm',
      raw_payload: row as unknown as Record<string, unknown>,
    }));
  }
}

// Normalises the spreadsheet export shape → canonical donation
export class JsonSpreadsheetAdapter implements DonationSourceAdapter {
  readonly source_type = 'spreadsheet' as const;

  async fetchDonations(): Promise<CanonicalDonation[]> {
    return SPREADSHEET_EXPORT_ROWS.map((row) => ({
      external_ref: row.ref,
      charity_id: 'CHY-001',
      donor_name: row.name,
      amount: parseFloat(row.amount),
      currency: row.currency,
      fund_designation: row.fund.toLowerCase(),
      date_received: row.date,
      source_type: 'spreadsheet',
      raw_payload: row as unknown as Record<string, unknown>,
    }));
  }
}
