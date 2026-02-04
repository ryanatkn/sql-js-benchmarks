import { PGlite } from '@electric-sql/pglite';

const start = process.hrtime.bigint();
const db = new PGlite();
await db.query('SELECT 1');
const end = process.hrtime.bigint();

await db.close();

console.log(
	JSON.stringify({
		phase: 'cold-start-connection',
		driver: 'pglite-memory',
		variant: 'raw',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000,
	}),
);
