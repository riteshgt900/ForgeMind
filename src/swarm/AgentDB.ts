import crypto from 'node:crypto';

interface MemoryEntry {
  id: number;
  taskId: string;
  agentName: string;
  content: string;
  metadata: Record<string, unknown>;
  vector: number[];
  timestamp: number;
}

interface HnswLikeIndex {
  initIndex(maxElements: number): void;
  addPoint(point: number[], id: number): void;
  searchKnn(point: number[], k: number): { neighbors: number[] };
}

export class AgentDB {
  private static instance: AgentDB | undefined;
  private readonly entries = new Map<number, MemoryEntry>();
  private readonly costs = new Map<string, number>();
  private readonly dim = 64;
  private readonly index: HnswLikeIndex | null;
  private nextId = 0;

  /** Creates memory store and optional HNSW index. */
  private constructor() {
    this.index = this.createIndex();
  }

  /** Returns singleton AgentDB instance. */
  static getInstance(): AgentDB {
    if (!AgentDB.instance) AgentDB.instance = new AgentDB();
    return AgentDB.instance;
  }

  /** Stores one memory entry. */
  async store(taskId: string, agentName: string, content: unknown, metadata: Record<string, unknown> = {}): Promise<void> {
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    const id = this.nextId++;
    const vector = this.embed(text);
    this.entries.set(id, { id, taskId, agentName, content: text, metadata, vector, timestamp: Date.now() });
    this.index?.addPoint(vector, id);
    if (typeof metadata.cost === 'number') {
      this.costs.set(taskId, (this.costs.get(taskId) ?? 0) + metadata.cost);
    }
  }

  /** Searches top-K similar entries. */
  async search(query: string, k = 5): Promise<MemoryEntry[]> {
    if (this.entries.size === 0) return [];
    const vec = this.embed(query);
    if (this.index) {
      const res = this.index.searchKnn(vec, Math.min(k, this.entries.size));
      return res.neighbors.map((id) => this.entries.get(id)).filter((v): v is MemoryEntry => Boolean(v));
    }
    return [...this.entries.values()]
      .map((e) => ({ e, score: this.cos(vec, e.vector) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map((r) => r.e);
  }

  /** Returns task cost sum. */
  async getCost(taskId: string): Promise<number> {
    return this.costs.get(taskId) ?? 0;
  }

  /** Clears store for tests. */
  clear(): void {
    this.entries.clear();
    this.costs.clear();
    this.nextId = 0;
  }

  /** Produces deterministic embedding vector. */
  private embed(text: string): number[] {
    const hash = crypto.createHash('sha256').update(text).digest();
    const out: number[] = [];
    for (let i = 0; i < this.dim; i += 1) out.push(((hash[i % hash.length] ?? 0) / 255) * 2 - 1);
    return out;
  }

  /** Computes cosine similarity. */
  private cos(a: number[], b: number[]): number {
    let dot = 0;
    let aa = 0;
    let bb = 0;
    for (let i = 0; i < a.length; i += 1) {
      dot += (a[i] ?? 0) * (b[i] ?? 0);
      aa += (a[i] ?? 0) ** 2;
      bb += (b[i] ?? 0) ** 2;
    }
    if (aa === 0 || bb === 0) return 0;
    return dot / (Math.sqrt(aa) * Math.sqrt(bb));
  }

  /** Attempts to load native HNSW index. */
  private createIndex(): HnswLikeIndex | null {
    try {
      const mod = require('hnswlib-node') as { HierarchicalNSW: new (space: string, dim: number) => HnswLikeIndex };
      const idx = new mod.HierarchicalNSW('cosine', this.dim);
      idx.initIndex(10000);
      return idx;
    } catch {
      return null;
    }
  }
}
