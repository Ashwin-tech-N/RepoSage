export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  passwordHash?: string | null;
  avatar?: string;
  createdAt?: string;
}

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type IssueCategory = 'Logic errors' | 'Exception handling' | 'Code quality' | 'Dependency risks' | 'Security concerns';
export type IssueStatus = 'open' | 'in_review' | 'patched' | 'ignored';

export interface CodeIssue {
  id: string;
  repoId: string;
  repoName: string;
  branch: string;
  category: IssueCategory;
  severity: SeverityLevel;
  title: string;
  description: string;
  filePath: string;
  lineNumber: number;
  snippet: string;
  suggestedFix: string;
  patchId?: string;
  status: IssueStatus;
  detectedAt: string;
}

export type PatchStatus = 'pending_review' | 'approved' | 'rejected' | 'changes_requested';

export interface AIPatch {
  id: string;
  issueId: string;
  repoId: string;
  repoName: string;
  branch: string;
  filePath: string;
  title: string;
  summary: string;
  rootCause: string;
  status: PatchStatus;
  diff: {
    oldCode: string;
    newCode: string;
    additions: number;
    deletions: number;
  };
  passedTests: number;
  totalTests: number;
  reviewComment?: string;
  createdAt: string;
  updatedAt: string;
}

export type RepoStatus = 'healthy' | 'analyzing' | 'issues_found' | 'deploying' | 'failed';

export interface Repository {
  id: string;
  name: string;
  owner: string;
  url: string;
  description: string;
  language: string;
  defaultBranch: string;
  latestCommit: {
    hash: string;
    message: string;
    author: string;
    timestamp: string;
  };
  analysisStatus: RepoStatus;
  openIssuesCount: number;
  lastAnalyzedAt: string;
  stars?: number;
  forks?: number;
}

export interface TestCase {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running' | 'skipped';
  durationMs: number;
  errorMessage?: string;
  stackTrace?: string;
}

export interface TestSuite {
  id: string;
  name: string;
  type: 'unit' | 'integration' | 'e2e' | 'security';
  repoId: string;
  repoName: string;
  branch: string;
  passedCount: number;
  failedCount: number;
  totalCount: number;
  durationSeconds: number;
  lastRunTimestamp: string;
  status: 'passed' | 'failed' | 'running';
  associatedPatchId?: string;
  testCases: TestCase[];
}

export interface ContainerImage {
  id: string;
  name: string;
  repository: string;
  tag: string;
  registry: string;
  sizeMb: number;
  status: 'ready' | 'building' | 'failed';
  buildDurationSeconds: number;
  baseImage: string;
  createdAt: string;
  commitHash: string;
  cveSummary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  buildLogs: string[];
}

export type DeploymentStatus = 'healthy' | 'canary_in_progress' | 'promoting' | 'rolled_back' | 'failed';

export interface DeploymentRecord {
  id: string;
  appName: string;
  repoId: string;
  cluster: string;
  namespace: string;
  version: string;
  previousVersion: string;
  status: DeploymentStatus;
  canaryTrafficPercent: number;
  canarySteps: {
    step: string;
    status: 'completed' | 'in_progress' | 'pending' | 'failed';
    timestamp?: string;
  }[];
  startedAt: string;
  updatedAt: string;
  deployedBy: string;
  commitHash: string;
  targetInstances: number;
  healthyInstances: number;
  rollbackReason?: string;
}

export interface HealthProbe {
  id: string;
  timestamp: string;
  service: string;
  endpoint: string;
  region: string;
  httpStatus: number;
  latencyMs: number;
  status: 'nominal' | 'degraded' | 'failing';
}

export interface MonitoringMetricPoint {
  time: string;
  availability: number;
  latencyP50: number;
  latencyP90: number;
  latencyP99: number;
  errorRate: number;
  throughputRps: number;
  cpuPercent: number;
  memoryMb: number;
}

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'investigating' | 'mitigated' | 'resolved';

export interface IncidentRecord {
  id: string;
  title: string;
  severity: IncidentSeverity;
  appName: string;
  status: IncidentStatus;
  firstDetectedAt: string;
  resolvedAt?: string;
  errorSummary: string;
  rootCause: string;
  recommendedAction: string;
  relatedDeploymentId?: string;
  relatedCommitHash?: string;
  rollbackTriggered: boolean;
  rollbackStatus: 'not_needed' | 'in_progress' | 'completed' | 'failed';
  suggestedPatchId?: string;
  timeline: {
    time: string;
    event: string;
    actor: 'system' | 'agent' | 'user';
    detail: string;
  }[];
  logs: string[];
}

export type ActivityCategory = 'auth' | 'analysis' | 'patch' | 'test' | 'image' | 'deployment' | 'incident' | 'repository';

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  category: ActivityCategory;
  actor: string;
  actorType: 'user' | 'agent' | 'system';
  action: string;
  target: string;
  status: 'success' | 'warning' | 'error' | 'info';
  metadata?: Record<string, string | number>;
}

export interface AppSettings {
  profile: {
    name: string;
    email: string;
    username: string;
    role: string;
  };
  theme: 'light' | 'dark' | 'system';
  notifications: {
    emailOnFailure: boolean;
    slackAlerts: boolean;
    canaryAlerts: boolean;
    dailyDigest: boolean;
  };
  canaryPolicies: {
    autoRollbackOnHttp5xx: boolean;
    errorRateThresholdPercent: number;
    latencyP99ThresholdMs: number;
    soakDurationMinutes: number;
    requireTestPassBeforeDeploy: boolean;
  };
  aiPolicies: {
    autoGeneratePatchesForCritical: boolean;
    humanApprovalRequired: boolean;
    enforceTestRegressionCheck: boolean;
  };
  integrations: {
    githubConnected: boolean;
    githubOrganization: string;
    dockerRegistry: string;
    kubernetesContext: string;
  };
}
