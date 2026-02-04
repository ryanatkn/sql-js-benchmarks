const start = process.hrtime.bigint();
await import('drizzle-orm/pglite');
await import('@electric-sql/pglite');
const end = process.hrtime.bigint();

console.log(
	JSON.stringify({
		phase: 'import',
		driver: 'pglite-drizzle',
		variant: 'orm',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000,
	}),
);
