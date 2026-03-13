#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

/** Parses --key=value args. */
function parse(argv) {
  const out = {};
  for (const item of argv) {
    if (!item.startsWith('--')) continue;
    const [k, v] = item.slice(2).split('=');
    out[k] = v ?? 'true';
  }
  return out;
}

/** Reads jsonl rows excluding headers and malformed lines. */
function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter((row) => row && !row.header);
}

/** Generates stream preview or aggregate cost report. */
function main() {
  const args = parse(process.argv.slice(2));
  const logsDir = path.join(process.cwd(), 'logs');

  if (args.stream) {
    const map = { success: 'ai_success.log', fail: 'ai_fail.log', rollback: 'rollback.log' };
    const file = map[args.stream];
    if (!file) throw new Error(`Unknown stream ${args.stream}`);
    const rows = readJsonl(path.join(logsDir, file));
    console.log(JSON.stringify({ stream: args.stream, count: rows.length, records: rows.slice(-5) }, null, 2));
    return;
  }

  const rows = readJsonl(path.join(logsDir, 'cost_tracker.log'));
  const total = rows.reduce((sum, row) => sum + Number(row.estimated_cost_usd || 0), 0);
  const taskCount = new Set(rows.map((row) => row.task_id)).size;
  console.log(JSON.stringify({
    period: args.period || 'all',
    tasks: taskCount,
    total_estimated_cost_usd: Number(total.toFixed(6)),
    avg_cost_per_task_usd: taskCount > 0 ? Number((total / taskCount).toFixed(6)) : 0,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(`[cost-report] failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
