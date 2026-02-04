import postgres from 'postgres';

const sql = postgres({
	host: process.env.PGHOST || 'localhost',
	port: process.env.PGPORT || 5432,
	database: process.env.PGDATABASE || 'postgres',
	user: process.env.PGUSER || 'postgres',
	password: process.env.PGPASSWORD || '',
});

const start = process.hrtime.bigint();
await sql`SELECT 1`;
const end = process.hrtime.bigint();

await sql.end();

console.log(
	JSON.stringify({
		phase: 'cold-start-connection',
		driver: 'postgres',
		variant: 'raw',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000,
	}),
);
