#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const axios = require('axios');

/** Checks required logs exist and are writable. */
function checkLogs(root) {
  const files = ['ai_success.log', 'ai_fail.log', 'agent_activity.log', 'rollback.log', 'approval_gate.log', 'cost_tracker.log'];
  const missing = [];
  for (const name of files) {
    const full = path.join(root, 'logs', name);
    if (!fs.existsSync(full)) {
      missing.push(name);
      continue;
    }
    fs.accessSync(full, fs.constants.R_OK | fs.constants.W_OK);
  }
  return missing;
}

/** Runs health checks and exits non-zero on failures. */
async function main() {
  const root = process.cwd();
  const missing = checkLogs(root);
  let remoteOk = false;
  try {
    const res = await axios.get(process.env.FORGEMIND_HEALTH_URL || 'http://localhost:3000/health', { timeout: 1500 });
    remoteOk = res.status === 200;
  } catch {
    remoteOk = false;
  }
  const out = { ok: missing.length === 0, remote_health_ok: remoteOk, missing_logs: missing, node_version: process.version };
  console.log(JSON.stringify(out, null, 2));
  if (missing.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(`[health-check] failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
