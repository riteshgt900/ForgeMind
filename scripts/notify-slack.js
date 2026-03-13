#!/usr/bin/env node
const { WebClient } = require('@slack/web-api');

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

/** Sends Slack message in live or mock mode. */
async function main() {
  const args = parse(process.argv.slice(2));
  const phase = args.phase || 'unknown';
  const task = args.task || process.env.FORGEMIND_TASK_ID || 'unknown-task';
  const channel = process.env.SLACK_PR_CHANNEL || process.env.SLACK_CHANNEL || '#ai-dev-requests';
  const text = args.message || `FORGEMIND update phase=${phase} task=${task}`;

  if (!process.env.SLACK_BOT_TOKEN) {
    console.log(`[notify-slack][mock] ${text}`);
    return;
  }
  const client = new WebClient(process.env.SLACK_BOT_TOKEN);
  await client.chat.postMessage({ channel, text });
  console.log(`[notify-slack] sent to ${channel}`);
}

main().catch((error) => {
  console.error(`[notify-slack] failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
