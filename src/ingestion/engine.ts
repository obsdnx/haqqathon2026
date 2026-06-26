import { PoolClient } from 'pg';
import {
  CanonicalCharity,
  CanonicalDonation,
  CanonicalDisbursement,
  CanonicalConfirmation,
  DonationSourceAdapter,
} from '../adapters/types';

// ─── Writers ────────────────────────────────────────────────────────────────

export async function upsertCharity(client: PoolClient, charity: CanonicalCharity) {
  await client.query(
    `INSERT INTO charities (id, name, metadata) VALUES ($1, $2, $3)
     ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, metadata = EXCLUDED.metadata`,
    [charity.id, charity.name, JSON.stringify(charity.metadata)],
  );
}

export async function ingestDonations(
  client: PoolClient,
  adapter: DonationSourceAdapter,
): Promise<number> {
  const donations = await adapter.fetchDonations();
  let count = 0;
  for (const d of donations) {
    await client.query(
      `INSERT INTO donations
         (charity_id, external_ref, donor_name, amount, currency,
          fund_designation, date_received, source_type, raw_payload)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (charity_id, external_ref) DO UPDATE
         SET donor_name = EXCLUDED.donor_name,
             amount = EXCLUDED.amount,
             fund_designation = EXCLUDED.fund_designation,
             source_type = EXCLUDED.source_type,
             raw_payload = EXCLUDED.raw_payload`,
      [d.charity_id, d.external_ref, d.donor_name, d.amount, d.currency,
       d.fund_designation, d.date_received, d.source_type, JSON.stringify(d.raw_payload)],
    );
    count++;
  }
  return count;
}

export async function ingestDisbursements(
  client: PoolClient,
  disbursements: CanonicalDisbursement[],
): Promise<void> {
  for (const d of disbursements) {
    await client.query(
      `INSERT INTO disbursements
         (id, charity_id, fund_designation, amount, programme, partner, date, source_type, raw_payload)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO UPDATE
         SET amount = EXCLUDED.amount, programme = EXCLUDED.programme,
             partner = EXCLUDED.partner, raw_payload = EXCLUDED.raw_payload`,
      [d.id, d.charity_id, d.fund_designation, d.amount, d.programme,
       d.partner, d.date, d.source_type, JSON.stringify(d.raw_payload)],
    );
  }
}

export async function ingestConfirmations(
  client: PoolClient,
  confirmations: CanonicalConfirmation[],
): Promise<void> {
  for (const c of confirmations) {
    await client.query(
      `INSERT INTO confirmations (id, disbursement_id, type, confirmed, date, source)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO UPDATE
         SET confirmed = EXCLUDED.confirmed, source = EXCLUDED.source`,
      [c.id, c.disbursement_id, c.type, c.confirmed, c.date, c.source],
    );
  }
}

// ─── Verification status computation ────────────────────────────────────────
// Called once, after all donations/disbursements/confirmations are loaded.
// Writes one row per donation per stage — the tracker reads these with zero logic.

async function upsertVS(
  client: PoolClient,
  donationId: number,
  stage: number,
  status: string,
  sourceLabel: string,
) {
  await client.query(
    `INSERT INTO verification_status (donation_id, stage, status, source_label)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (donation_id, stage) DO UPDATE
       SET status = EXCLUDED.status, source_label = EXCLUDED.source_label, computed_at = NOW()`,
    [donationId, stage, status, sourceLabel],
  );
}

export async function recomputeAllVerificationStatus(client: PoolClient): Promise<void> {
  const { rows: donations } = await client.query(
    `SELECT id, charity_id, fund_designation FROM donations`,
  );

  for (const don of donations) {
    const donId: number = don.id;
    const charityId: string = don.charity_id;
    const fund: string = don.fund_designation;

    // Stage 1 — Donation Received: charity recorded it, no external proof
    await upsertVS(client, donId, 1, 'self_reported', 'self-reported by charity');

    // Stage 2 — Verified Against Bank: no live bank integration yet
    await upsertVS(client, donId, 2, 'pending', 'coming soon — bank verification not yet live');

    // Stage 3 — Allocated to Fund: charity says it went to this fund
    await upsertVS(client, donId, 3, 'self_reported', 'self-reported by charity');

    // Stage 4 — Pooling boundary marker
    await upsertVS(client, donId, 4, 'boundary', 'pooling boundary');

    // Stage 5 — Disbursed to Programme: exists if a disbursement was made for this fund
    const { rows: disbs } = await client.query(
      `SELECT id FROM disbursements WHERE charity_id = $1 AND fund_designation = $2`,
      [charityId, fund],
    );
    if (disbs.length > 0) {
      await upsertVS(client, donId, 5, 'self_reported', 'self-reported by charity');
    } else {
      await upsertVS(client, donId, 5, 'pending', 'pending');
    }

    // Stage 6 — Delivery Confirmed: a recipient has independently signed off
    let stage6Status = 'pending';
    let stage6Label = 'pending';
    if (disbs.length > 0) {
      const disbIds = disbs.map((d: { id: string }) => d.id);
      const { rows: confs } = await client.query(
        `SELECT type, source FROM confirmations
         WHERE disbursement_id = ANY($1) AND confirmed = true
         LIMIT 1`,
        [disbIds],
      );
      if (confs.length > 0) {
        stage6Status = 'confirmed';
        stage6Label = 'confirmed by ' + confs[0].type; // 'confirmed by recipient'
      }
    }
    await upsertVS(client, donId, 6, stage6Status, stage6Label);
  }
}
