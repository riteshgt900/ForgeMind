import fs from 'node:fs';
import path from 'node:path';

export interface LogEvent {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  agent: string;
  message: string;
  metadata?: Record<string, unknown>;
}

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILES = {
  success: path.join(LOG_DIR, 'ai_success.log'),
  fail: path.join(LOG_DIR, 'ai_fail.log'),
  activity: path.join(LOG_DIR, 'agent_activity.log'),
  rollback: path.join(LOG_DIR, 'rollback.log'),
  approval: path.join(LOG_DIR, 'approval_gate.log'),
  cost: path.join(LOG_DIR, 'cost_tracker.log'),
} as const;

/** Returns a required log file path by key. */
function logFile(key: keyof typeof LOG_FILES): string {
  return LOG_FILES[key];
}

/** Ensures a log file exists with a jsonl header record. */
function ensure(file: string, schema: string): void {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  if (!fs.existsSync(file)) {
    fs.writeFileSync(
      file,
      `${JSON.stringify({ header: true, schema, version: '1.0.0', format: 'jsonl', created_at: new Date().toISOString() })}\n`,
      'utf8',
    );
  }
}

/** Appends one event to target file and activity log. */
function append(file: string, event: LogEvent): void {
  ensure(file, path.basename(file));
  ensure(logFile('activity'), 'agent_activity.log');
  fs.appendFileSync(file, `${JSON.stringify(event)}\n`, 'utf8');
  if (file !== logFile('activity')) {
    fs.appendFileSync(logFile('activity'), `${JSON.stringify(event)}\n`, 'utf8');
  }
}

/** Selects destination log file for level and metadata. */
function target(level: LogEvent['level'], metadata?: Record<string, unknown>): string {
  if (metadata?.logFile === 'logs/approval_gate.log') return logFile('approval');
  if (metadata?.logFile === 'logs/rollback.log') return logFile('rollback');
  if (level === 'success') return logFile('success');
  if (level === 'error') return logFile('fail');
  return logFile('activity');
}

/** Creates event object. */
function evt(level: LogEvent['level'], agent: string, message: string, metadata?: Record<string, unknown>): LogEvent {
  return { timestamp: new Date().toISOString(), level, agent, message, metadata };
}

/** Writes line to local console. */
function print(event: LogEvent): void {
  const line = `[${event.timestamp}] [${event.level.toUpperCase()}] [${event.agent}] ${event.message}`;
  if (event.level === 'error') console.error(line);
  else console.log(line);
}

export const logger = {
  /** Logs informational event. */
  info(agent: string, message: string, metadata?: Record<string, unknown>): void {
    const e = evt('info', agent, message, metadata);
    append(target('info', metadata), e);
    print(e);
  },

  /** Logs warning event. */
  warn(agent: string, message: string, metadata?: Record<string, unknown>): void {
    const e = evt('warn', agent, message, metadata);
    append(target('warn', metadata), e);
    print(e);
  },

  /** Logs failure event. */
  fail(agent: string, message: string, metadata?: Record<string, unknown>): void {
    const e = evt('error', agent, message, metadata);
    append(target('error', metadata), e);
    print(e);
  },

  /** Logs success event. */
  success(agent: string, message: string, metadata?: Record<string, unknown>): void {
    const e = evt('success', agent, message, metadata);
    append(target('success', metadata), e);
    print(e);
  },

  /** Returns known log file paths. */
  files(): Record<string, string> {
    return { ...LOG_FILES };
  },
};
