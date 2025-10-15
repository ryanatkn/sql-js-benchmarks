import { PGlite } from '@electric-sql/pglite';

const start = process.hrtime.bigint();
const db = new PGlite();
await db.query('SELECT 1');
await db.close();
const end = process.hrtime.bigint();

console.log(
	JSON.stringify({
		phase: 'minimal-query',
		driver: 'pglite-memory',
		variant: 'raw',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
