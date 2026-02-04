import { PGlite } from '@electric-sql/pglite';

const dataDir = './tmp/pglite-existing';

const start = process.hrtime.bigint();
const db = new PGlite(dataDir);
await db.query('SELECT 1');
const end = process.hrtime.bigint();

await db.close();

console.log(
	JSON.stringify({
		phase: 'cold-start-reopen',
		driver: 'pglite-fs',
		variant: 'raw',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000,
	}),
);
