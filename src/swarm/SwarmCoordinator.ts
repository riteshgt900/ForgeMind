import type { Task } from '../types';
import type { QueenAgent } from '../queen/QueenAgent';

type TaskJob = () => Promise<void>;

export class SwarmCoordinator {
  private readonly queen: QueenAgent;
  private readonly concurrency: number;
  private readonly pending: TaskJob[] = [];
  private active = 0;
  private paused = false;

  /** Initializes coordinator with configurable concurrency. */
  constructor(queen: QueenAgent) {
    this.queen = queen;
    const parsed = Number.parseInt(process.env.RUFLO_MAX_CONCURRENT_TASKS ?? '3', 10);
    this.concurrency = Number.isNaN(parsed) ? 3 : Math.max(1, parsed);
  }

  /** Enqueues a task and starts processing loop. */
  async enqueue(task: Task): Promise<void> {
    this.pending.push(async () => {
      await this.queen.orchestrate(task);
    });
    await this.tick();
  }

  /** Returns queue state for diagnostics and health endpoint. */
  status(): { size: number; pending: number; isPaused: boolean } {
    return {
      size: this.pending.length,
      pending: this.active,
      isPaused: this.paused,
    };
  }

  /** Stops scheduling new tasks and waits for active tasks to finish. */
  async shutdown(): Promise<void> {
    this.paused = true;
    while (this.active > 0) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 25);
      });
    }
  }

  /** Processes queued jobs up to concurrency limit. */
  private async tick(): Promise<void> {
    if (this.paused) {
      return;
    }
    while (this.active < this.concurrency && this.pending.length > 0) {
      const job = this.pending.shift();
      if (!job) {
        return;
      }
      this.active += 1;
      void job()
        .catch(() => Promise.resolve())
        .finally(() => {
          this.active -= 1;
          void this.tick();
        });
    }
  }
}
