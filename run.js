#!/usr/bin/env node

import { readdirSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { runBenchmark } from './lib/bench.js';
import {
	formatResultsTable,
	formatResultsTableWithORM
} from './lib/format.js';
import { getEnvironmentInfo, formatEnvironmentMarkdown } from './lib/env.js';
import {
	DEFAULT_ITERATIONS,
	BENCHMARK_3_ROUND_TRIP_ITERATIONS,
	BENCHMARKS_DIR,
	RESULTS_DIR,
	OUTPUT_JSON_FILE,
	OUTPUT_MD_FILE,
	TEST_FILE_EXTENSION,
	BENCHMARK_TITLE,
	MARKDOWN_SEPARATOR,
	DECIMAL_PLACES
} from './lib/constants.js';

// Benchmark phases configuration
const PHASES = [
	{
		id: '1-import',
		name: 'import',
		title: '1. Import Overhead',
		description: `${DEFAULT_ITERATIONS} iterations, fresh Node process each time`,
		withORM: true
	},
	{
		id: '2-cold-start-connection',
		name: 'cold-start-connection',
		title: '2. Cold Start Connection',
		description: `${DEFAULT_ITERATIONS} iterations, fresh connection each time (connect + query)`,
		withORM: true
	},
	{
		id: '3-round-trip',
		name: 'round-trip',
		title: '3. Round Trip (INSERT + SELECT)',
		description: `${DEFAULT_ITERATIONS} iterations, ${BENCHMARK_3_ROUND_TRIP_ITERATIONS} cycles of INSERT RETURNING + SELECT per iteration`,
		withORM: true
	}
];

/**
 * Clean and recreate results directory
 */
function cleanResultsDirectory() {
	console.log('🧹 Cleaning results directory...');
	rmSync(RESULTS_DIR, { recursive: true, force: true });
	mkdirSync(RESULTS_DIR, { recursive: true });
}

/**
 * Ensure tmp directory exists for filesystem-based tests
 */
function ensureTmpDirectory() {
	mkdirSync('./tmp', { recursive: true });
}

/**
 * Get all test files for a phase
 */
function getTestFiles(phaseId) {
	const benchmarkDir = join(BENCHMARKS_DIR, phaseId);
	return readdirSync(benchmarkDir)
		.filter((f) => f.endsWith(TEST_FILE_EXTENSION))
		.sort()
		.map((f) => join(benchmarkDir, f));
}

/**
 * Run all benchmarks for a single phase
 */
async function runPhase(phase) {
	console.log(`[${phase.id}] ${phase.title}`);

	const testFiles = getTestFiles(phase.id);
	const phaseResults = [];

	for (const testFile of testFiles) {
		const result = await runBenchmark(testFile, DEFAULT_ITERATIONS, true);
		phaseResults.push(result);

		console.log(`  ✓ ${result.driver} (${result.stats.median.toFixed(DECIMAL_PLACES)}ms median)`);
	}

	console.log('');
	return phaseResults;
}

/**
 * Generate JSON output file
 */
function writeJsonOutput(env, allResults) {
	const jsonOutput = {
		environment: env,
		iterations: DEFAULT_ITERATIONS,
		results: allResults
	};

	const outputPath = join(RESULTS_DIR, OUTPUT_JSON_FILE);
	writeFileSync(outputPath, JSON.stringify(jsonOutput, null, 2));
}

/**
 * Generate Markdown output file
 */
function writeMarkdownOutput(env, allResults) {
	let markdown = `${BENCHMARK_TITLE}\n\n`;
	markdown += formatEnvironmentMarkdown(env) + '\n\n';
	markdown += MARKDOWN_SEPARATOR;

	for (const phase of PHASES) {
		const results = allResults[phase.id];
		if (!results || results.length === 0) continue;

		if (phase.withORM) {
			markdown += formatResultsTableWithORM(results, phase.title, phase.description);
		} else {
			markdown += formatResultsTable(results, phase.title, phase.description);
		}

		markdown += MARKDOWN_SEPARATOR;
	}

	const outputPath = join(RESULTS_DIR, OUTPUT_MD_FILE);
	writeFileSync(outputPath, markdown);
}

/**
 * Main benchmark runner
 */
async function main() {
	cleanResultsDirectory();
	ensureTmpDirectory();

	console.log('📊 Running benchmarks...\n');

	const env = getEnvironmentInfo();
	const allResults = {};

	// Run all phases
	for (const phase of PHASES) {
		const results = await runPhase(phase);
		allResults[phase.id] = results;
	}

	// Write output files
	writeJsonOutput(env, allResults);
	writeMarkdownOutput(env, allResults);

	// Report completion
	const jsonPath = join(RESULTS_DIR, OUTPUT_JSON_FILE);
	const mdPath = join(RESULTS_DIR, OUTPUT_MD_FILE);

	console.log('✅ Complete! Results written to:');
	console.log(`   - ${jsonPath}`);
	console.log(`   - ${mdPath}`);
}

main().catch((error) => {
	console.error('Error running benchmarks:', error);
	process.exit(1);
});
