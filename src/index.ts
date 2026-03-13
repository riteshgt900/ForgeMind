import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { QueenAgent } from './queen/QueenAgent';
import { SwarmCoordinator } from './swarm/SwarmCoordinator';
import { ApprovalGate } from './gates/ApprovalGate';
import { GateWebhook } from './gates/GateWebhook';
import { HealthDashboard } from './monitoring/HealthDashboard';
import { RuntimeMonitor } from './monitoring/RuntimeMonitor';
import { logger } from './utils/logger';
import { validateSecrets } from './utils/secretsValidator';
import type { Task } from './types';

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

const queen = new QueenAgent();
const coordinator = new SwarmCoordinator(queen);
const approvalGate = new ApprovalGate();
const gateWebhook = new GateWebhook(approvalGate);
const healthDashboard = new HealthDashboard();
const monitor = new RuntimeMonitor();

/** Builds a normalized Task object from inbound API payload. */
function buildTask(payload: Record<string, unknown>): Task {
  const now = new Date().toISOString();
  const requirement =
    typeof payload.requirement === 'string'
      ? payload.requirement
      : typeof payload.description === 'string'
        ? payload.description
        : 'No requirement supplied';

  const acceptanceCriteria = Array.isArray(payload.acceptanceCriteria)
    ? payload.acceptanceCriteria.filter((item): item is string => typeof item === 'string')
    : ['Requirement implemented according to provided description'];

  return {
    id: typeof payload.id === 'string' ? payload.id : `task_${Date.now()}`,
    title: typeof payload.title === 'string' ? payload.title : requirement.slice(0, 80),
    description: requirement,
    acceptanceCriteria,
    estimatedComplexity: 'M',
    affectedDomains: ['application'],
    riskLevel: 'MEDIUM',
    requestedBy: typeof payload.requestedBy === 'string' ? payload.requestedBy : 'api@local',
    rawRequirement: requirement,
    createdAt: now,
    source: {
      channel: payload.sourceChannel === 'slack' || payload.sourceChannel === 'google-chat'
        ? payload.sourceChannel
        : 'api',
      channelId: typeof payload.channelId === 'string' ? payload.channelId : undefined,
      threadTs: typeof payload.threadTs === 'string' ? payload.threadTs : undefined,
      requesterId: typeof payload.requesterId === 'string' ? payload.requesterId : undefined,
      requesterDisplay: typeof payload.requesterDisplay === 'string' ? payload.requesterDisplay : undefined,
      spaceId: typeof payload.spaceId === 'string' ? payload.spaceId : undefined,
    },
  };
}

/** Queues one task and writes common enqueue response. */
async function enqueueTask(task: Task, res: Response): Promise<void> {
  const skipRun = process.env.NODE_ENV === 'test' && process.env.FORGEMIND_RUN_WORKFLOW_IN_TEST !== 'true';
  if (!skipRun) {
    await coordinator.enqueue(task);
  }
  res.status(202).json({ ok: true, taskId: task.id, status: 'queued' });
}

/** Parses Slack Events API payload into task request body. */
function taskBodyFromSlackEvent(event: Record<string, unknown>): Record<string, unknown> | null {
  const text = typeof event.text === 'string' ? event.text : '';
  const cleaned = text.replace(/<@[^>]+>/g, '').trim();
  if (!cleaned) return null;
  return {
    title: cleaned.slice(0, 80),
    requirement: cleaned,
    requestedBy: typeof event.user === 'string' ? `${event.user}@slack` : 'slack@local',
    sourceChannel: 'slack',
    channelId: typeof event.channel === 'string' ? event.channel : undefined,
    threadTs: typeof event.thread_ts === 'string'
      ? event.thread_ts
      : typeof event.ts === 'string'
        ? event.ts
        : undefined,
    requesterId: typeof event.user === 'string' ? event.user : undefined,
  };
}

/** Parses Google Chat event payload into task request body. */
function taskBodyFromGoogleChat(payload: Record<string, unknown>): Record<string, unknown> | null {
  const message = payload.message as Record<string, unknown> | undefined;
  const text = typeof message?.text === 'string' ? message.text.trim() : '';
  if (!text) return null;
  const user = (payload.user as Record<string, unknown> | undefined)
    ?? (message?.sender as Record<string, unknown> | undefined);
  const email = typeof user?.email === 'string' ? user.email : 'google-chat@local';
  const space = payload.space as Record<string, unknown> | undefined;
  return {
    title: text.slice(0, 80),
    requirement: text,
    requestedBy: email,
    sourceChannel: 'google-chat',
    spaceId: typeof space?.name === 'string' ? space.name : undefined,
    requesterId: typeof user?.name === 'string' ? user.name : undefined,
    requesterDisplay: typeof user?.displayName === 'string' ? user.displayName : undefined,
  };
}

/** Resolves gate decision from Slack action payload object. */
async function resolveSlackAction(body: Record<string, unknown>): Promise<{ ok: boolean; message: string }> {
  const payloadRaw = typeof body.payload === 'string' ? body.payload : null;
  if (!payloadRaw) return { ok: false, message: 'Missing payload' };
  const payload = JSON.parse(payloadRaw) as Record<string, unknown>;
  const actions = Array.isArray(payload.actions) ? payload.actions : [];
  const first = actions[0] as Record<string, unknown> | undefined;
  if (!first) return { ok: false, message: 'Missing action' };

  const value = typeof first.value === 'string' ? first.value : '{}';
  const parsed = JSON.parse(value) as Record<string, unknown>;
  const gateId = typeof parsed.gateId === 'string' ? parsed.gateId : null;
  const action = typeof parsed.action === 'string' ? parsed.action : null;
  if (!gateId || !action) return { ok: false, message: 'Missing gateId/action' };

  if (action === 'approve') {
    await approvalGate.resolve(gateId, 'APPROVED');
    return { ok: true, message: 'approved' };
  }
  if (action === 'reject') {
    await approvalGate.resolve(gateId, 'REJECTED');
    return { ok: true, message: 'rejected' };
  }
  if (action === 'iterate') {
    await approvalGate.resolve(gateId, 'ITERATION_REQUESTED');
    return { ok: true, message: 'iteration_requested' };
  }
  return { ok: false, message: 'Invalid action' };
}

app.get('/health', async (_req: Request, res: Response) => {
  const queueStatus = coordinator.status();
  const payload = healthDashboard.render({
    queueSize: queueStatus.size,
    queuePending: queueStatus.pending,
    latestMetric: monitor.latestMetric(),
    monitorEnabled: process.env.MONITOR_ENABLED !== 'false',
  });
  res.status(200).json(payload);
});

app.post('/webhooks/gate/:gateId/:decision', async (req: Request, res: Response) => {
  await gateWebhook.handle(req, res);
});

app.post('/tasks', async (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown>;
  const task = buildTask(body);
  await enqueueTask(task, res);
});

app.post('/webhooks/slack/events', async (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown>;
  if (body.type === 'url_verification' && typeof body.challenge === 'string') {
    res.status(200).json({ challenge: body.challenge });
    return;
  }
  const event = body.event as Record<string, unknown> | undefined;
  if (!event) {
    res.status(400).json({ ok: false, error: 'Missing event payload' });
    return;
  }
  const eventType = typeof event.type === 'string' ? event.type : '';
  if (eventType !== 'app_mention' && eventType !== 'message') {
    res.status(200).json({ ok: true, ignored: true, eventType });
    return;
  }
  const taskBody = taskBodyFromSlackEvent(event);
  if (!taskBody) {
    res.status(200).json({ ok: true, ignored: true, reason: 'empty-requirement' });
    return;
  }
  const task = buildTask(taskBody);
  await enqueueTask(task, res);
});

app.post('/webhooks/slack/actions', async (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown>;
  try {
    const resolved = await resolveSlackAction(body);
    if (!resolved.ok) {
      res.status(400).json({ ok: false, error: resolved.message });
      return;
    }
    res.status(200).json({ ok: true, decision: resolved.message });
  } catch (error: unknown) {
    res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
});

app.post('/webhooks/google-chat/events', async (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown>;
  const type = typeof body.type === 'string' ? body.type : '';
  if (type === 'CARD_CLICKED') {
    const action = body.action as Record<string, unknown> | undefined;
    const params = Array.isArray(action?.parameters) ? action?.parameters as Record<string, unknown>[] : [];
    const gateId = params.find((p) => p.key === 'gateId')?.value;
    const decision = params.find((p) => p.key === 'decision')?.value;
    if (typeof gateId === 'string' && typeof decision === 'string') {
      if (decision === 'approve') await approvalGate.resolve(gateId, 'APPROVED');
      if (decision === 'reject') await approvalGate.resolve(gateId, 'REJECTED');
      if (decision === 'iterate') await approvalGate.resolve(gateId, 'ITERATION_REQUESTED');
    }
    res.status(200).json({ text: 'Decision captured' });
    return;
  }
  if (type !== 'MESSAGE') {
    res.status(200).json({ ok: true, ignored: true, type });
    return;
  }
  const taskBody = taskBodyFromGoogleChat(body);
  if (!taskBody) {
    res.status(200).json({ ok: true, ignored: true, reason: 'empty-requirement' });
    return;
  }
  const task = buildTask(taskBody);
  await enqueueTask(task, res);
});

/** Starts HTTP server and optional monitor daemon mode. */
export async function startServer(): Promise<void> {
  try {
    validateSecrets();
  } catch (error: unknown) {
    logger.warn('startup', `Environment validation warning: ${error instanceof Error ? error.message : String(error)}`);
  }

  const port = Number.parseInt(process.env.PORT ?? '3000', 10);
  app.listen(port, () => {
    logger.info('startup', `FORGEMIND listening on port ${port}`);
  });

  if (process.argv.includes('--daemon') || process.env.MONITOR_ENABLED === 'true') {
    void monitor.start();
  }
}

if (require.main === module) {
  void startServer();
}

export { app, queen, coordinator, approvalGate, monitor };
