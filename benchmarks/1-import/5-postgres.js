const start = process.hrtime.bigint();
await import('postgres');
const end = process.hrtime.bigint();

console.log(
	JSON.stringify({
		phase: 'import',
		driver: 'postgres',
		variant: 'raw',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
