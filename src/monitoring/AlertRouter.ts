import type { TaskRouter } from '../queen/TaskRouter';
import { TaskRouter as TaskRouterImpl } from '../queen/TaskRouter';

export class AlertRouter {
  private readonly router?: TaskRouter;

  /** Creates alert router with optional task router integration. */
  constructor(router?: TaskRouter) {
    this.router = router;
  }

  /** Triggers rollback path for critical incidents. */
  async triggerRollback(reason: string): Promise<void> {
    await this.activeRouter().dispatch('rollback', { reason, metadata: { source: 'monitor' } });
  }

  /** Triggers debugger path for degraded incidents. */
  async triggerDebugger(reason: string): Promise<void> {
    await this.activeRouter().dispatch('debugger', { reason, metadata: { source: 'monitor' } });
  }

  /** Resolves router instance with lazy fallback for daemon mode. */
  private activeRouter(): TaskRouter {
    if (this.router) return this.router;
    return new TaskRouterImpl();
  }
}
