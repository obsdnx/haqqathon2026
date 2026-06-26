import * as fs from 'fs';
import * as path from 'path';
import { DonationSourceAdapter, CanonicalDonation } from '../types';

function parseCSV(content: string): Array<Record<string, string>> {
  const lines = content.trim().split('\n').filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ''; });
    return row;
  });
}

export class CsvDonationAdapter implements DonationSourceAdapter {
  readonly source_type = 'csv' as const;

  constructor(
    private readonly filePath: string,
    private readonly charityId: string,
  ) {}

  async fetchDonations(): Promise<CanonicalDonation[]> {
    const content = fs.readFileSync(path.resolve(this.filePath), 'utf8');
    const rows = parseCSV(content);

    return rows.map((row) => ({
      external_ref: row['external_ref'],
      charity_id: this.charityId,
      donor_name: row['donor_name'],
      amount: parseFloat(row['amount']),
      currency: row['currency'] || 'GBP',
      fund_designation: row['fund_designation'].toLowerCase(),
      date_received: row['date_received'],
      source_type: 'csv',
      raw_payload: row as Record<string, unknown>,
    }));
  }
}
