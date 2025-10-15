import pg from 'pg';

const client = new pg.Client({
	host: process.env.PGHOST || 'localhost',
	port: process.env.PGPORT || 5432,
	database: process.env.PGDATABASE || 'postgres',
	user: process.env.PGUSER || 'postgres',
	password: process.env.PGPASSWORD || ''
});

const start = process.hrtime.bigint();
await client.connect();
await client.query('SELECT 1');
await client.end();
const end = process.hrtime.bigint();

console.log(
	JSON.stringify({
		phase: 'minimal-query',
		driver: 'pg',
		variant: 'raw',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
