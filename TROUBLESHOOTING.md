# TROUBLESHOOTING

1. **ApprovalGate timeout after 24h**
   - Cause: no human decision before timeout.
   - Fix: call `POST /webhooks/gate/:gateId/approve` or set `FORGEMIND_GATE_TIMEOUT_MS`.
   - Prevention: configure Slack reminders for pending approvals.

2. **DebuggerAgent max retries exceeded**
   - Cause: three debug loops still failing.
   - Fix: inspect `logs/ai_fail.log`, patch manually, rerun tests.
   - Prevention: tighten acceptance criteria and add pre-merge regression tests.

3. **HNSW index corruption**
   - Cause: native index mismatch or abrupt process termination.
   - Fix: run `node scripts/seed-agentdb.js` and restart process.
   - Prevention: graceful shutdown and periodic snapshot export.

4. **Slack webhook signature invalid**
   - Cause: mismatched `SLACK_SIGNING_SECRET`.
   - Fix: rotate secret and update env in runtime.
   - Prevention: manage secrets via secure vault and environment sync.

5. **GitHub MCP 403 Forbidden**
   - Cause: PAT missing repo scopes.
   - Fix: grant repo write, pull request write, issue write.
   - Prevention: validate token scopes during startup checks.

6. **Ruflo daemon not responding**
   - Cause: stale daemon process.
   - Fix: `npm run swarm:stop` then `npm run swarm:start`.
   - Prevention: monitor daemon health and restart on crash.

7. **Cost limit exceeded**
   - Cause: token usage spike.
   - Fix: raise limits cautiously in env, reduce model tier usage.
   - Prevention: set conservative caps and enforce preflight estimation.

8. **RollbackAgent failed to revert**
   - Cause: non-clean repository or missing git context.
   - Fix: run `git status`, resolve conflicts, then `git revert --no-edit HEAD`.
   - Prevention: protect main with CI gates and clean merge strategy.

9. **MonitorAgent false positives**
   - Cause: thresholds too strict for traffic profile.
   - Fix: tune `MONITOR_P0_ERROR_RATE_THRESHOLD` and `MONITOR_P1_ERROR_RATE_THRESHOLD`.
   - Prevention: calibrate thresholds against baseline telemetry.

10. **Tests fail in CI but pass locally**
    - Cause: environment drift.
    - Fix: run tests in docker compose with same Node/runtime config.
    - Prevention: lock dependency versions and mirror CI environment locally.
