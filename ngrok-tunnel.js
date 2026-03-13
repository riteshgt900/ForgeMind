// ngrok-tunnel.js — Run with: node ngrok-tunnel.js
require('dotenv').config();
const ngrok = require('@ngrok/ngrok');

async function startTunnel() {
  console.log('Starting ngrok tunnel on port 3000...');
  const listener = await ngrok.forward({
    addr: 3000,
    authtoken: process.env.NGROK_AUTHTOKEN,
  });

  const url = listener.url();
  console.log('\n✅ ngrok tunnel started!');
  console.log('Public URL:', url);
  console.log('\n📋 Copy this into your .env file:');
  console.log(`FORGEMIND_WEBHOOK_URL=${url}/webhooks`);
  console.log('\n📋 Slack Events URL:');
  console.log(`  ${url}/webhooks/slack/events`);
  console.log('\n📋 Slack Actions URL:');
  console.log(`  ${url}/webhooks/slack/actions`);
  console.log('\n⏳ Tunnel is running... Press Ctrl+C to stop.\n');

  process.stdin.resume();
  const keepAlive = setInterval(() => { }, 60000);

  process.on('SIGINT', async () => {
    console.log('\nClosing ngrok tunnel...');
    clearInterval(keepAlive);
    await ngrok.disconnect();
    process.exit(0);
  });
}

startTunnel().catch((err) => {
  console.error('Failed to start ngrok:', err.message);
  process.exit(1);
});
