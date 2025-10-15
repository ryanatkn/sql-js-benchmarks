import { drizzle } from 'drizzle-orm/pglite';
import { PGlite } from '@electric-sql/pglite';
import { sql } from 'drizzle-orm';
import { rmSync } from 'fs';

const dataDir = `./tmp/pglite-bench-${Date.now()}`;

const start = process.hrtime.bigint();
const client = new PGlite(dataDir);
const db = drizzle(client);
await db.execute(sql`SELECT 1`);
await client.close();
const end = process.hrtime.bigint();

rmSync(dataDir, { recursive: true, force: true });

console.log(
	JSON.stringify({
		phase: 'minimal-query',
		driver: 'pglite-fs-drizzle',
		variant: 'orm',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
