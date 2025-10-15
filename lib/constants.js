/**
 * Configuration constants for the benchmark suite
 */

// Directory and file paths
export const BENCHMARKS_DIR = 'benchmarks';
export const RESULTS_DIR = 'results';
export const OUTPUT_JSON_FILE = 'output.json';
export const OUTPUT_MD_FILE = 'output.md';

// File processing
export const TEST_FILE_EXTENSION = '.js';

// Benchmark configuration
export const DEFAULT_ITERATIONS = 30;
export const BENCHMARK_3_ROUND_TRIP_ITERATIONS = 100; // Number of INSERT+SELECT cycles per round-trip test

// Formatting
export const DECIMAL_PLACES = 2;
export const MARKDOWN_SEPARATOR = '---\n\n';
export const BENCHMARK_TITLE = '# PostgreSQL & SQLite Driver Benchmarks';

// Driver and variant identifiers
export const ORM_SUFFIX = '-drizzle';
export const VARIANT_RAW = 'raw';
export const VARIANT_ORM = 'orm';

// Statistical configuration
export const PERCENTILES = {
	p90: 0.90
};

// Analysis thresholds
export const FINDINGS_THRESHOLD_PERCENT = 5; // Minimum % difference to report in findings

// Unit conversions
export const BYTES_PER_GB = 1024 ** 3;

// Driver names (for findings generation)
export const DRIVERS = {
	SQLITE: 'sqlite',
	SQLITE_DRIZZLE: 'sqlite-drizzle',
	SQLITE_MEMORY: 'sqlite-memory',
	SQLITE_MEMORY_DRIZZLE: 'sqlite-memory-drizzle',
	SQLITE_FS: 'sqlite-fs',
	SQLITE_FS_DRIZZLE: 'sqlite-fs-drizzle',
	PG: 'pg',
	PG_DRIZZLE: 'pg-drizzle',
	POSTGRES: 'postgres',
	POSTGRES_DRIZZLE: 'postgres-drizzle',
	PGLITE: 'pglite',
	PGLITE_DRIZZLE: 'pglite-drizzle',
	PGLITE_MEMORY: 'pglite-memory',
	PGLITE_MEMORY_DRIZZLE: 'pglite-memory-drizzle',
	PGLITE_FS: 'pglite-fs',
	PGLITE_FS_DRIZZLE: 'pglite-fs-drizzle'
};

// PostgreSQL version detection
export const PSQL_VERSION_COMMAND = 'psql --version';
export const PSQL_VERSION_REGEX = /\d+\.\d+/;
