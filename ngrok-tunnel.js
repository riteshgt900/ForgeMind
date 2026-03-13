// ngrok-tunnel.js — Run with: node ngrok-tunnel.js
// Starts an ngrok tunnel on port 3000 using the @ngrok/ngrok Node SDK

require('dotenv').config();
const ngrok = require('@ngrok/ngrok');
const fs = require('fs');
const path = require('path');

async function startTunnel() {
  console.log('Starting ngrok tunnel on port 3000...');

  // If you have an ngrok authtoken, set it here or via NGROK_AUTHTOKEN env var
  // Get a free authtoken at: https://dashboard.ngrok.com/get-started/your-authtoken
  const authtoken = process.env.NGROK_AUTHTOKEN;

  const listener = await ngrok.forward({
    addr: 3000,
    authtoken: authtoken, // optional for basic tunnels
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

  // Keep the Node event loop alive so the tunnel stays open
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
  console.log('\nIf you see an auth error, get a free token at:');
  console.log('  https://dashboard.ngrok.com/get-started/your-authtoken');
  console.log('Then run: node ngrok-tunnel.js  (with NGROK_AUTHTOKEN=your-token)');
  process.exit(1);
});
