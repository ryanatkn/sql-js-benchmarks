#!/usr/bin/env node

import { readdirSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { runBenchmark } from './lib/bench.js';
import {
	formatResultsTable,
	formatResultsTableWithORM,
	generateKeyFindings
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
		title: '1. Import Overhead (Cold Start)',
		description: `${DEFAULT_ITERATIONS} iterations, fresh Node process each time`,
		withORM: true
	},
	{
		id: '2-minimal-query',
		name: 'minimal-query',
		title: '2. Minimal Query (SELECT 1)',
		description: `${DEFAULT_ITERATIONS} iterations, full operation (cold start: connect + query + close)`,
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
	const errors = [];

	for (const testFile of testFiles) {
		try {
			const result = await runBenchmark(testFile, DEFAULT_ITERATIONS, true);
			phaseResults.push(result);

			console.log(`  ✓ ${result.driver} (${result.stats.median.toFixed(DECIMAL_PLACES)}ms median)`);
		} catch (error) {
			const errorInfo = { testFile, message: error.message };
			errors.push(errorInfo);
			console.error(`  ✗ ${testFile} failed:`, error.message);
		}
	}

	console.log('');
	return { results: phaseResults, errors };
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

		markdown += generateKeyFindings(results, phase.name);
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
	const allErrors = [];

	// Run all phases
	for (const phase of PHASES) {
		const { results, errors } = await runPhase(phase);
		allResults[phase.id] = results;
		allErrors.push(...errors);
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

	// Report errors if any
	if (allErrors.length > 0) {
		console.error(`\n⚠️  ${allErrors.length} test(s) failed:`);
		allErrors.forEach(({ testFile, message }) => {
			console.error(`   - ${testFile}: ${message}`);
		});
		process.exit(1);
	}
}

main().catch((error) => {
	console.error('Error running benchmarks:', error);
	process.exit(1);
});
