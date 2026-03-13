export type TaskComplexity = 'S' | 'M' | 'L' | 'XL';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TaskSource {
  channel: 'api' | 'slack' | 'google-chat';
  channelId?: string;
  threadTs?: string;
  requesterId?: string;
  requesterDisplay?: string;
  spaceId?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  estimatedComplexity: TaskComplexity;
  affectedDomains: string[];
  riskLevel: RiskLevel;
  requestedBy: string;
  rawRequirement: string;
  createdAt: string;
  source?: TaskSource;
}

export interface ChangePlanItem {
  file: string;
  changeType: 'create' | 'modify' | 'delete';
  summary: string;
}

export interface ScopeDocument {
  taskId: string;
  title: string;
  context: string;
  decision: string;
  consequences: string[];
  affectedFiles: string[];
  changePlan: ChangePlanItem[];
  rollbackStrategy: string;
  estimatedHours: number;
  riskLevel: RiskLevel;
  markdown: string;
  artifacts?: {
    markdownPath?: string;
    docxPath?: string;
  };
}

export interface TestCase {
  scenario: string;
  preconditions: string[];
  steps: string[];
  expectedResult: string;
  actualResult: string;
  status: 'PASS' | 'FAIL';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface TestResult {
  passed: boolean;
  coverage: number;
  summary: string;
  cases: TestCase[];
  rawOutput: string;
  cveScan?: {
    passed: boolean;
    summary: string;
    vulnerabilities: Record<string, number>;
    rawOutput: string;
  };
  artifacts?: {
    markdownPath?: string;
    docxPath?: string;
  };
}

export interface PRResult {
  number: number;
  url: string;
  branch: string;
  baseBranch: string;
  title: string;
  body: string;
  filesChanged: number;
}
