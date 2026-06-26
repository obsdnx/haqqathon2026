import * as fs from 'fs';
import * as path from 'path';
import { db } from './client';

async function setup() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  console.log('Running schema migrations...');
  await db.query(schema);
  console.log('Schema applied.');
  await db.end();
}

setup().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
