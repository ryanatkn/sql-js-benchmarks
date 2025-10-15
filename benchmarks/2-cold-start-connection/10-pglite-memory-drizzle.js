import { drizzle } from 'drizzle-orm/pglite';
import { PGlite } from '@electric-sql/pglite';
import { sql } from 'drizzle-orm';

const start = process.hrtime.bigint();
const client = new PGlite();
const db = drizzle(client);
await db.execute(sql`SELECT 1`);
const end = process.hrtime.bigint();

await client.close();

console.log(
	JSON.stringify({
		phase: 'cold-start-connection',
		driver: 'pglite-memory-drizzle',
		variant: 'orm',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
