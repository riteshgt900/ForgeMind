import fs from 'node:fs';
import path from 'node:path';
import type { ScopeDocument } from '../types';

export type GateStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ITERATION_REQUESTED' | 'TIMED_OUT';

export interface GateRecord {
  gateId: string;
  taskId: string;
  scope: ScopeDocument;
  channel?: 'slack' | 'google-chat';
  requesterId?: string;
  threadRef?: string;
  status: GateStatus;
  createdAt: number;
  resolvedAt?: number;
  comment?: string;
}

export class GateStorage {
  private readonly file: string;
  private readonly records = new Map<string, GateRecord>();

  /** Loads gate records from json store. */
  constructor(filePath = path.join(process.cwd(), '.tmp', 'gates.json')) {
    this.file = filePath;
    this.load();
  }

  /** Saves gate record. */
  async save(record: GateRecord): Promise<void> {
    this.records.set(record.gateId, record);
    this.persist();
  }

  /** Gets gate record by id. */
  async get(gateId: string): Promise<GateRecord> {
    const row = this.records.get(gateId);
    if (!row) throw new Error(`Gate not found: ${gateId}`);
    return row;
  }

  /** Updates gate record fields. */
  async update(gateId: string, patch: Partial<GateRecord>): Promise<GateRecord> {
    const current = await this.get(gateId);
    const next = { ...current, ...patch };
    this.records.set(gateId, next);
    this.persist();
    return next;
  }

  /** Lists all records. */
  async list(): Promise<GateRecord[]> {
    return [...this.records.values()];
  }

  /** Clears all records and persists empty set. */
  clear(): void {
    this.records.clear();
    this.persist();
  }

  /** Loads records from file if present. */
  private load(): void {
    try {
      if (!fs.existsSync(this.file)) return;
      const rows = JSON.parse(fs.readFileSync(this.file, 'utf8')) as GateRecord[];
      rows.forEach((r) => this.records.set(r.gateId, r));
    } catch {
      this.records.clear();
    }
  }

  /** Persists records to disk. */
  private persist(): void {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify([...this.records.values()], null, 2), 'utf8');
  }
}
