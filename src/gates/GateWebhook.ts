import type { Request, Response } from 'express';
import type { ApprovalGate } from './ApprovalGate';
import type { GateStatus } from './GateStorage';
import { logger } from '../utils/logger';

export class GateWebhook {
  private readonly gate: ApprovalGate;

  /** Creates webhook adapter for approval gates. */
  constructor(gate: ApprovalGate) {
    this.gate = gate;
  }

  /** Handles approval webhook callback. */
  async handle(req: Request, res: Response): Promise<void> {
    const gateId = req.params.gateId;
    const decision = req.params.decision;
    if (!gateId || !decision) {
      res.status(400).json({ ok: false, error: 'gateId and decision required' });
      return;
    }
    const mapped = this.map(decision);
    if (!mapped) {
      res.status(400).json({ ok: false, error: 'Invalid decision' });
      return;
    }
    const comment = req.body && typeof req.body.comment === 'string' ? req.body.comment : undefined;
    await this.gate.resolve(gateId, mapped, comment);
    logger.info('gate-webhook', `Decision ${mapped} received for ${gateId}`, {
      logFile: 'logs/approval_gate.log',
      comment,
    });
    res.status(200).json({ ok: true, gateId, decision: mapped });
  }

  /** Maps URL decision token to GateStatus. */
  private map(decision: string): GateStatus | null {
    if (decision === 'approve') return 'APPROVED';
    if (decision === 'reject') return 'REJECTED';
    if (decision === 'iterate') return 'ITERATION_REQUESTED';
    return null;
  }
}
