#!/usr/bin/env node
const simpleGit = require('simple-git');

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

/** Reverts last commit for rollback operation. */
async function main() {
  const args = parse(process.argv.slice(2));
  const reason = args.reason || 'unspecified';
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.error('[rollback] not a git repository');
    process.exit(1);
  }
  const from = (await git.revparse(['HEAD'])).trim();
  await git.raw(['revert', '--no-edit', 'HEAD']);
  const to = (await git.revparse(['HEAD'])).trim();
  console.log(JSON.stringify({ ok: true, reason, from, to }, null, 2));
}

main().catch((error) => {
  console.error(`[rollback] failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
