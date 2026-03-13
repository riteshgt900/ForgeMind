#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

/** Seeds deterministic local AgentDB bootstrap artifacts. */
function main() {
  const dir = path.join(process.cwd(), '.tmp');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'agentdb-seed.json');
  const payload = {
    version: '1.0.0',
    seeded_at: new Date().toISOString(),
    entries: [
      { taskId: 'seed_task_1', agentName: 'architect', content: 'Scope planning baseline memory.' },
      { taskId: 'seed_task_2', agentName: 'tester', content: 'Testing strategy baseline memory.' },
      { taskId: 'seed_task_3', agentName: 'reviewer-security', content: 'Security checklist baseline memory.' },
    ],
  };
  fs.writeFileSync(file, JSON.stringify(payload, null, 2), 'utf8');
  console.log(JSON.stringify({ ok: true, file }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(`[seed-agentdb] failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
