import { SlackChannel } from '../channels/SlackChannel';

export class SlackProgressHook {
  private readonly slack: SlackChannel;

  /** Initializes hook with Slack adapter. */
  constructor(slack?: SlackChannel) {
    this.slack = slack ?? new SlackChannel();
  }

  /** Posts phase progress message. */
  async run(taskId: string, phase: string, detail: string): Promise<void> {
    await this.slack.postProgress(taskId, `[${phase}] ${detail}`);
  }
}
