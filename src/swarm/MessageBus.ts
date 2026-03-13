import { EventEmitter } from 'node:events';
import Redis from 'ioredis';

export type MessageHandler<T = unknown> = (payload: T) => Promise<void> | void;

export class MessageBus {
  private static instance: MessageBus | undefined;
  private readonly emitter = new EventEmitter();
  private readonly pub: Redis | null;
  private readonly sub: Redis | null;

  /** Initializes message bus and optional Redis clients. */
  private constructor() {
    const url = process.env.REDIS_URL;
    if (url) {
      this.pub = new Redis(url);
      this.sub = new Redis(url);
      this.sub.on('message', (channel: string, message: string) => {
        try {
          this.emitter.emit(channel, JSON.parse(message));
        } catch {
          this.emitter.emit(channel, message);
        }
      });
    } else {
      this.pub = null;
      this.sub = null;
    }
  }

  /** Returns singleton bus. */
  static getInstance(): MessageBus {
    if (!MessageBus.instance) MessageBus.instance = new MessageBus();
    return MessageBus.instance;
  }

  /** Publishes payload to channel. */
  async publish<T>(channel: string, payload: T): Promise<void> {
    this.emitter.emit(channel, payload);
    if (this.pub) await this.pub.publish(channel, JSON.stringify(payload));
  }

  /** Subscribes callback to channel. */
  async subscribe<T>(channel: string, handler: MessageHandler<T>): Promise<() => Promise<void>> {
    const wrapped = (payload: unknown): void => {
      void handler(payload as T);
    };
    this.emitter.on(channel, wrapped);
    if (this.sub) await this.sub.subscribe(channel);
    return async (): Promise<void> => {
      this.emitter.off(channel, wrapped);
      if (this.sub) await this.sub.unsubscribe(channel);
    };
  }

  /** Closes redis resources and listeners. */
  async close(): Promise<void> {
    this.emitter.removeAllListeners();
    if (this.pub) await this.pub.quit();
    if (this.sub) await this.sub.quit();
  }
}
