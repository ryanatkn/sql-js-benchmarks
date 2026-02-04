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
	p90: 0.90,
};

// PostgreSQL version detection
export const PSQL_VERSION_COMMAND = 'psql --version';
export const PSQL_VERSION_REGEX = /\d+\.\d+/;
