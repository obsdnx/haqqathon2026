import * as dotenv from 'dotenv';
dotenv.config();

import * as path from 'path';
import { db } from './db/client';
import { JsonCrmAdapter, JsonSpreadsheetAdapter } from './adapters/json-seed/adapter';
import { CsvDonationAdapter } from './adapters/csv/adapter';
import { CHARITY_SEED, DISBURSEMENT_SEED, CONFIRMATION_SEED } from './adapters/json-seed/seed';
import {
  upsertCharity,
  ingestDonations,
  ingestDisbursements,
  ingestConfirmations,
  recomputeAllVerificationStatus,
} from './ingestion/engine';

export async function ingest() {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // 1. Register the charity
    await upsertCharity(client, CHARITY_SEED);
    console.log('[ingest] Charity registered:', CHARITY_SEED.name);

    // 2. Ingest donations from all source adapters
    // Adding a new source = adding one adapter here, nothing else changes.
    const adapters = [
      new JsonCrmAdapter(),
      new JsonSpreadsheetAdapter(),
      new CsvDonationAdapter(
        path.join(__dirname, '../seed-data/donations.csv'),
        'CHY-001',
      ),
    ];

    let totalDonations = 0;
    for (const adapter of adapters) {
      const n = await ingestDonations(client, adapter);
      console.log('[ingest]', adapter.source_type, '→', n, 'donations');
      totalDonations += n;
    }
    console.log('[ingest] Total donations:', totalDonations);

    // 3. Ingest disbursements
    await ingestDisbursements(client, DISBURSEMENT_SEED);
    console.log('[ingest] Disbursements:', DISBURSEMENT_SEED.length);

    // 4. Ingest confirmations
    await ingestConfirmations(client, CONFIRMATION_SEED);
    console.log('[ingest] Confirmations:', CONFIRMATION_SEED.length);

    // 5. Recompute verification_status for every donation
    // This must run after all disbursements + confirmations are loaded.
    await recomputeAllVerificationStatus(client);
    console.log('[ingest] Verification status computed for all donations.');

    await client.query('COMMIT');
    console.log('[ingest] Done.');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  ingest().then(() => db.end()).catch((e) => { console.error(e); process.exit(1); });
}
