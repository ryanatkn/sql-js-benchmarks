import { PGlite } from '@electric-sql/pglite';
import { rmSync } from 'fs';

const dataDir = `./tmp/pglite-bench-${Date.now()}`;

const start = process.hrtime.bigint();
const db = new PGlite(dataDir);
await db.query('SELECT 1');
await db.close();
const end = process.hrtime.bigint();

rmSync(dataDir, { recursive: true, force: true });

console.log(
	JSON.stringify({
		phase: 'minimal-query',
		driver: 'pglite-fs',
		variant: 'raw',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
