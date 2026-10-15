import {
  Repository,
  CodeIssue,
  AIPatch,
  TestSuite,
  ContainerImage,
  DeploymentRecord,
  HealthProbe,
  MonitoringMetricPoint,
  IncidentRecord,
  ActivityLogEntry,
  AppSettings
} from '../types';

export const INITIAL_REPOSITORIES: Repository[] = [
  {
    id: 'repo-checkout',
    name: 'checkout-service',
    owner: 'reposage-org',
    url: 'https://github.com/reposage-org/checkout-service',
    description: 'High-throughput payment orchestration and cart reconciliation service.',
    language: 'Go',
    defaultBranch: 'main',
    latestCommit: {
      hash: '9f3b8e1',
      message: 'fix(idempotency): implement distributed lock release on context cancellation',
      author: 'demodev',
      timestamp: '28 minutes ago'
    },
    analysisStatus: 'issues_found',
    openIssuesCount: 3,
    lastAnalyzedAt: '12 minutes ago',
    stars: 142,
    forks: 38
  },
  {
    id: 'repo-gateway',
    name: 'payment-gateway',
    owner: 'reposage-org',
    url: 'https://github.com/reposage-org/payment-gateway',
    description: 'PCI-DSS compliant payment provider aggregator and webhook dispatcher.',
    language: 'TypeScript',
    defaultBranch: 'main',
    latestCommit: {
      hash: '3d7a9c2',
      message: 'chore(deps): bump @stripe/stripe-node from 14.8.0 to 14.12.0',
      author: 'sara-chen',
      timestamp: '2 hours ago'
    },
    analysisStatus: 'healthy',
    openIssuesCount: 0,
    lastAnalyzedAt: '45 minutes ago',
    stars: 218,
    forks: 52
  },
  {
    id: 'repo-inventory',
    name: 'inventory-worker',
    owner: 'reposage-org',
    url: 'https://github.com/reposage-org/inventory-worker',
    description: 'Asynchronous event consumer processing stock ledger mutations.',
    language: 'Python',
    defaultBranch: 'main',
    latestCommit: {
      hash: '7e2b104',
      message: 'perf(consumer): batch reserve queries with Redis pipelines',
      author: 'alex-kumar',
      timestamp: '5 hours ago'
    },
    analysisStatus: 'issues_found',
    openIssuesCount: 2,
    lastAnalyzedAt: '1 hour ago',
    stars: 89,
    forks: 14
  },
  {
    id: 'repo-auth',
    name: 'auth-proxy',
    owner: 'reposage-org',
    url: 'https://github.com/reposage-org/auth-proxy',
    description: 'Zero-trust mTLS proxy and OAuth2 token introspection sidecar.',
    language: 'Rust',
    defaultBranch: 'main',
    latestCommit: {
      hash: '1a4e5f9',
      message: 'security(crypto): replace non-constant time token verification',
      author: 'elena-rostova',
      timestamp: '1 day ago'
    },
    analysisStatus: 'healthy',
    openIssuesCount: 0,
    lastAnalyzedAt: '3 hours ago',
    stars: 310,
    forks: 67
  }
];

export const INITIAL_ISSUES: CodeIssue[] = [
  {
    id: 'iss-001',
    repoId: 'repo-checkout',
    repoName: 'checkout-service',
    branch: 'main',
    category: 'Logic errors',
    severity: 'critical',
    title: 'Potential Goroutine Leak in Order Timeout Handler',
    description: 'Context cancellation channel is selected without draining the timer channel, leaving active timer goroutines allocated in high-volume traffic.',
    filePath: 'internal/orchestrator/timeout.go',
    lineNumber: 74,
    snippet: `select {
case <-ctx.Done():
    return ctx.Err()
case res := <-timerChan:
    return processResult(res)
}`,
    suggestedFix: `if !timer.Stop() {
    select {
    case <-timer.C:
    default:
    }
}`,
    patchId: 'patch-001',
    status: 'open',
    detectedAt: '12 minutes ago'
  },
  {
    id: 'iss-002',
    repoId: 'repo-checkout',
    repoName: 'checkout-service',
    branch: 'main',
    category: 'Exception handling',
    severity: 'high',
    title: 'Unhandled Nil Pointer on Payment Intent Status Fallback',
    description: 'When the external acquirer returns an HTTP 504 Gateway Timeout, response.Error can be nil while response.Status is Unknown, causing an unexpected panic during telemetry emit.',
    filePath: 'pkg/client/acquirer.go',
    lineNumber: 138,
    snippet: `if resp.StatusCode >= 500 {
    metric.RecordFailure(resp.Error.Message) // Nil pointer if Error body is empty
}`,
    suggestedFix: `errDetail := "Unknown gateway error"
if resp.Error != nil && resp.Error.Message != "" {
    errDetail = resp.Error.Message
}
metric.RecordFailure(errDetail)`,
    patchId: 'patch-002',
    status: 'in_review',
    detectedAt: '18 minutes ago'
  },
  {
    id: 'iss-003',
    repoId: 'repo-checkout',
    repoName: 'checkout-service',
    branch: 'main',
    category: 'Security concerns',
    severity: 'medium',
    title: 'Subtle Non-Constant-Time Webhook Secret Verification',
    description: 'The incoming HMAC signature is evaluated using standard bytes.Equal instead of crypto/subtle.ConstantTimeCompare, potentially leaking length and byte equality under timing analysis.',
    filePath: 'internal/webhook/verifier.go',
    lineNumber: 42,
    snippet: `if !bytes.Equal(receivedHmac, computedHmac) {
    return ErrInvalidSignature
}`,
    suggestedFix: `if subtle.ConstantTimeCompare(receivedHmac, computedHmac) != 1 {
    return ErrInvalidSignature
}`,
    patchId: 'patch-003',
    status: 'open',
    detectedAt: '35 minutes ago'
  },
  {
    id: 'iss-004',
    repoId: 'repo-inventory',
    repoName: 'inventory-worker',
    branch: 'main',
    category: 'Dependency risks',
    severity: 'high',
    title: 'Vulnerable Pydantic Parser Dependency (CVE-2024-3789)',
    description: 'Pydantic core version <= 2.5.2 vulnerable to quadratic algorithmic complexity in deeply nested JSON schemas, causing worker denial of service.',
    filePath: 'pyproject.toml',
    lineNumber: 22,
    snippet: `dependencies = [
    "pydantic>=2.4.0,<2.5.3",
]`,
    suggestedFix: `dependencies = [
    "pydantic>=2.7.4",
]`,
    status: 'open',
    detectedAt: '1 hour ago'
  },
  {
    id: 'iss-005',
    repoId: 'repo-inventory',
    repoName: 'inventory-worker',
    branch: 'main',
    category: 'Code quality',
    severity: 'low',
    title: 'N+1 Database Query in Batch Item Reservation',
    description: 'Item stock records are fetched inside a synchronous loop rather than issuing a single SQL WHERE IN clause or batch cache lookup.',
    filePath: 'app/services/reserve.py',
    lineNumber: 89,
    snippet: `for item in order_payload.items:
    stock = db.query(StockItem).filter_by(sku=item.sku).first()
    allocated.append(stock)`,
    suggestedFix: `skus = [i.sku for i in order_payload.items]
stock_map = {s.sku: s for s in db.query(StockItem).filter(StockItem.sku.in_(skus)).all()}`,
    status: 'open',
    detectedAt: '2 hours ago'
  }
];

export const INITIAL_PATCHES: AIPatch[] = [
  {
    id: 'patch-001',
    issueId: 'iss-001',
    repoId: 'repo-checkout',
    repoName: 'checkout-service',
    branch: 'main',
    filePath: 'internal/orchestrator/timeout.go',
    title: 'Safely drain timer channel and eliminate goroutine leak',
    summary: 'Ensures timer.Stop() is invoked and its channel drained during context termination before returning, preventing runaway goroutine accumulation during peak load.',
    rootCause: 'Go timers do not automatically clean up their associated internal runtime channels when abandoned in a select case without an explicit Stop and drain sequence.',
    status: 'pending_review',
    diff: {
      oldCode: `func WaitForTimeout(ctx context.Context, d time.Duration) error {
\ttimer := time.NewTimer(d)
\tselect {
\tcase <-ctx.Done():
\t\treturn ctx.Err()
\tcase <-timer.C:
\t\treturn ErrTimeoutReached
\t}
}`,
      newCode: `func WaitForTimeout(ctx context.Context, d time.Duration) error {
\ttimer := time.NewTimer(d)
\tdefer func() {
\t\tif !timer.Stop() {
\t\t\tselect {
\t\t\tcase <-timer.C:
\t\t\tdefault:
\t\t\t}
\t\t}
\t}()

\tselect {
\tcase <-ctx.Done():
\t\treturn ctx.Err()
\tcase <-timer.C:
\t\treturn ErrTimeoutReached
\t}
}`,
      additions: 9,
      deletions: 0
    },
    passedTests: 42,
    totalTests: 42,
    createdAt: '10 minutes ago',
    updatedAt: '10 minutes ago'
  },
  {
    id: 'patch-002',
    issueId: 'iss-002',
    repoId: 'repo-checkout',
    repoName: 'checkout-service',
    branch: 'main',
    filePath: 'pkg/client/acquirer.go',
    title: 'Defensive nil check on gateway error response payload',
    summary: 'Guards against nil pointer dereference on response.Error when HTTP 504 timeouts occur without a serialized JSON error body.',
    rootCause: 'Downstream reverse proxy terminates with raw 504 HTML page, causing JSON decoder to yield a nil Error pointer on a failure status code.',
    status: 'pending_review',
    diff: {
      oldCode: `func handleGatewayError(resp *http.Response) error {
\tif resp.StatusCode >= 500 {
\t\tmetric.RecordFailure(resp.Error.Message)
\t\treturn fmt.Errorf("gateway fault: %s", resp.Error.Message)
\t}
\treturn nil
}`,
      newCode: `func handleGatewayError(resp *http.Response) error {
\tif resp.StatusCode >= 500 {
\t\terrMsg := "gateway timed out without error payload"
\t\tif resp.Error != nil && resp.Error.Message != "" {
\t\t\terrMsg = resp.Error.Message
\t\t}
\t\tmetric.RecordFailure(errMsg)
\t\treturn fmt.Errorf("gateway fault: %s", errMsg)
\t}
\treturn nil
}`,
      additions: 6,
      deletions: 2
    },
    passedTests: 38,
    totalTests: 38,
    createdAt: '15 minutes ago',
    updatedAt: '15 minutes ago'
  },
  {
    id: 'patch-003',
    issueId: 'iss-003',
    repoId: 'repo-checkout',
    repoName: 'checkout-service',
    branch: 'main',
    filePath: 'internal/webhook/verifier.go',
    title: 'Enforce constant-time comparison for HMAC signature verification',
    summary: 'Replaces bytes.Equal with crypto/subtle.ConstantTimeCompare to eliminate microsecond timing side-channels during webhook authorization.',
    rootCause: 'bytes.Equal returns immediately upon the first byte mismatch, permitting statistical timing attacks against webhook secret hashes.',
    status: 'approved',
    diff: {
      oldCode: `func VerifySignature(received, expected []byte) bool {
\treturn bytes.Equal(received, expected)
}`,
      newCode: `import "crypto/subtle"

func VerifySignature(received, expected []byte) bool {
\tif len(received) != len(expected) {
\t\treturn false
\t}
\treturn subtle.ConstantTimeCompare(received, expected) == 1
}`,
      additions: 6,
      deletions: 1
    },
    passedTests: 16,
    totalTests: 16,
    reviewComment: 'Verified with security test suite; approved for staging canary.',
    createdAt: '30 minutes ago',
    updatedAt: '8 minutes ago'
  }
];

export const INITIAL_TEST_SUITES: TestSuite[] = [
  {
    id: 'suite-unit-checkout',
    name: 'Unit Tests: Core Orchestrator & State Machine',
    type: 'unit',
    repoId: 'repo-checkout',
    repoName: 'checkout-service',
    branch: 'main',
    passedCount: 88,
    failedCount: 0,
    totalCount: 88,
    durationSeconds: 3.4,
    lastRunTimestamp: '14 minutes ago',
    status: 'passed',
    testCases: [
      { id: 'tc-01', name: 'TestCartStateTransitions_Idempotency', status: 'passed', durationMs: 42 },
      { id: 'tc-02', name: 'TestDiscountCalculation_EdgeCases', status: 'passed', durationMs: 18 },
      { id: 'tc-03', name: 'TestTaxJurisdictionResolution_US_EU', status: 'passed', durationMs: 35 },
      { id: 'tc-04', name: 'TestDistributedLockTimeout_ContextCancellation', status: 'passed', durationMs: 64 }
    ]
  },
  {
    id: 'suite-security-checkout',
    name: 'Security & Invariant Regression Suite',
    type: 'security',
    repoId: 'repo-checkout',
    repoName: 'checkout-service',
    branch: 'main',
    passedCount: 24,
    failedCount: 0,
    totalCount: 24,
    durationSeconds: 5.1,
    lastRunTimestamp: '14 minutes ago',
    status: 'passed',
    associatedPatchId: 'patch-003',
    testCases: [
      { id: 'tc-s1', name: 'TestWebhookSignature_TimingVariance_UnderThreshold', status: 'passed', durationMs: 240 },
      { id: 'tc-s2', name: 'TestHeaderInjectionPrevention_Sanitization', status: 'passed', durationMs: 15 },
      { id: 'tc-s3', name: 'TestRateLimiter_BurstExhaustion_Returns429', status: 'passed', durationMs: 90 }
    ]
  },
  {
    id: 'suite-integration-checkout',
    name: 'Integration: Mock Payment Acquirers',
    type: 'integration',
    repoId: 'repo-checkout',
    repoName: 'checkout-service',
    branch: 'main',
    passedCount: 31,
    failedCount: 1,
    totalCount: 32,
    durationSeconds: 12.8,
    lastRunTimestamp: '25 minutes ago',
    status: 'failed',
    associatedPatchId: 'patch-002',
    testCases: [
      { id: 'tc-i1', name: 'TestStripeWebhook_PayloadReconciliation', status: 'passed', durationMs: 310 },
      { id: 'tc-i2', name: 'TestAdyenFallback_NetworkTimeout_ReturnsCleanError', status: 'failed', durationMs: 504, errorMessage: 'panic: runtime error: invalid memory address or nil pointer dereference', stackTrace: 'goroutine 48 [running]:\npkg/client.handleGatewayError(0x0)\n\t/pkg/client/acquirer.go:138 +0x42\ninternal/orchestrator.ProcessPayment()\n\t/internal/orchestrator/service.go:204 +0x1b' },
      { id: 'tc-i3', name: 'TestIdempotentDoubleCharge_Rejection', status: 'passed', durationMs: 190 }
    ]
  },
  {
    id: 'suite-e2e-gateway',
    name: 'End-to-End: Full Customer Checkout Journey',
    type: 'e2e',
    repoId: 'repo-gateway',
    repoName: 'payment-gateway',
    branch: 'main',
    passedCount: 14,
    failedCount: 0,
    totalCount: 14,
    durationSeconds: 28.5,
    lastRunTimestamp: '45 minutes ago',
    status: 'passed',
    testCases: [
      { id: 'tc-e1', name: 'E2E: Guest checkout with 3D Secure verification', status: 'passed', durationMs: 2400 },
      { id: 'tc-e2', name: 'E2E: Apple Pay token authorization', status: 'passed', durationMs: 1850 },
      { id: 'tc-e3', name: 'E2E: Partial refund workflow', status: 'passed', durationMs: 1600 }
    ]
  }
];

export const INITIAL_CONTAINER_IMAGES: ContainerImage[] = [
  {
    id: 'img-001',
    name: 'checkout-service',
    repository: 'reposage-org/checkout-service',
    tag: 'v2.4.1',
    registry: 'ghcr.io',
    sizeMb: 46.2,
    status: 'ready',
    buildDurationSeconds: 48,
    baseImage: 'gcr.io/distroless/static:nonroot',
    createdAt: '35 minutes ago',
    commitHash: '9f3b8e1',
    cveSummary: { critical: 0, high: 0, medium: 1, low: 2 },
    buildLogs: [
      '[1/6] FROM gcr.io/distroless/static:nonroot AS base',
      '[2/6] COPY bin/checkout-service /app/checkout-service',
      '[3/6] USER nonroot:nonroot',
      '[4/6] EXPOSE 8080 9090',
      '[5/6] HEALTHCHECK --interval=5s --timeout=2s CMD ["/app/checkout-service", "health"]',
      '[6/6] Successfully tagged ghcr.io/reposage-org/checkout-service:v2.4.1',
      'Scan completed: 0 Critical, 0 High, 1 Medium CVE identified (libssl3-suppressed).'
    ]
  },
  {
    id: 'img-002',
    name: 'checkout-service',
    repository: 'reposage-org/checkout-service',
    tag: 'v2.4.0',
    registry: 'ghcr.io',
    sizeMb: 45.8,
    status: 'ready',
    buildDurationSeconds: 42,
    baseImage: 'gcr.io/distroless/static:nonroot',
    createdAt: '2 days ago',
    commitHash: '8b2d110',
    cveSummary: { critical: 0, high: 0, medium: 0, low: 1 },
    buildLogs: [
      '[1/5] Building binary with Go 1.22.4 linux/amd64 CGO_ENABLED=0',
      '[2/5] Distroless packaging complete',
      '[3/5] Pushed SHA: 8b2d110 to ghcr.io/reposage-org/checkout-service:v2.4.0'
    ]
  },
  {
    id: 'img-003',
    name: 'payment-gateway',
    repository: 'reposage-org/payment-gateway',
    tag: 'v1.18.3',
    registry: 'ghcr.io',
    sizeMb: 118.4,
    status: 'ready',
    buildDurationSeconds: 74,
    baseImage: 'node:20-alpine',
    createdAt: '2 hours ago',
    commitHash: '3d7a9c2',
    cveSummary: { critical: 0, high: 0, medium: 0, low: 0 },
    buildLogs: [
      '[1/7] Node 20-alpine base image verified',
      '[2/7] RUN npm ci --omit=dev --ignore-scripts',
      '[3/7] Hardened container filesystem non-root execution UID 1001',
      '[4/7] Trivy security scan completed: Clean'
    ]
  }
];

export const INITIAL_DEPLOYMENTS: DeploymentRecord[] = [
  {
    id: 'dep-9041',
    appName: 'checkout-service',
    repoId: 'repo-checkout',
    cluster: 'prod-us-central1-gke',
    namespace: 'payments-prod',
    version: 'v2.4.1',
    previousVersion: 'v2.4.0',
    status: 'canary_in_progress',
    canaryTrafficPercent: 20,
    canarySteps: [
      { step: 'Container Build & Vulnerability Scan', status: 'completed', timestamp: '10:14:02' },
      { step: 'Automated Regression Test Gate', status: 'completed', timestamp: '10:15:30' },
      { step: 'Deploy Canary Replica (10% Traffic)', status: 'completed', timestamp: '10:16:10' },
      { step: 'Health Probe & Latency Soak (5 min)', status: 'completed', timestamp: '10:21:10' },
      { step: 'Step Up Traffic to 20%', status: 'in_progress', timestamp: '10:22:00' },
      { step: 'Promote to 100% Full Production', status: 'pending' }
    ],
    startedAt: '18 minutes ago',
    updatedAt: '2 minutes ago',
    deployedBy: 'RepoSage Automated Agent',
    commitHash: '9f3b8e1',
    targetInstances: 12,
    healthyInstances: 12
  },
  {
    id: 'dep-9040',
    appName: 'payment-gateway',
    repoId: 'repo-gateway',
    cluster: 'prod-us-central1-gke',
    namespace: 'payments-prod',
    version: 'v1.18.3',
    previousVersion: 'v1.18.2',
    status: 'healthy',
    canaryTrafficPercent: 100,
    canarySteps: [
      { step: 'Container Build & Vulnerability Scan', status: 'completed' },
      { step: 'Automated Regression Test Gate', status: 'completed' },
      { step: 'Deploy Canary Replica (10% Traffic)', status: 'completed' },
      { step: 'Health Probe & Latency Soak (5 min)', status: 'completed' },
      { step: 'Step Up Traffic to 50%', status: 'completed' },
      { step: 'Promote to 100% Full Production', status: 'completed' }
    ],
    startedAt: '3 hours ago',
    updatedAt: '2 hours ago',
    deployedBy: 'sara-chen',
    commitHash: '3d7a9c2',
    targetInstances: 8,
    healthyInstances: 8
  },
  {
    id: 'dep-9038',
    appName: 'inventory-worker',
    repoId: 'repo-inventory',
    cluster: 'prod-us-central1-gke',
    namespace: 'inventory-prod',
    version: 'v0.9.4',
    previousVersion: 'v0.9.3',
    status: 'rolled_back',
    canaryTrafficPercent: 0,
    canarySteps: [
      { step: 'Container Build & Vulnerability Scan', status: 'completed' },
      { step: 'Deploy Canary Replica (10% Traffic)', status: 'completed' },
      { step: 'Health Probe & Latency Soak', status: 'failed' },
      { step: 'Automated Rollback to v0.9.3', status: 'completed' }
    ],
    startedAt: '1 day ago',
    updatedAt: '1 day ago',
    deployedBy: 'alex-kumar',
    commitHash: '5a1b32f',
    targetInstances: 6,
    healthyInstances: 6,
    rollbackReason: 'Memory leak triggered OOMKilled in Pod worker-7b9c within 4 minutes of 10% traffic.'
  }
];

export const INITIAL_HEALTH_PROBES: HealthProbe[] = [
  { id: 'pb-01', timestamp: 'Just now', service: 'checkout-service', endpoint: 'https://checkout-api.reposage.dev/healthz', region: 'us-east4', httpStatus: 200, latencyMs: 24, status: 'nominal' },
  { id: 'pb-02', timestamp: '1 min ago', service: 'checkout-service', endpoint: 'https://checkout-api.reposage.dev/healthz', region: 'eu-west1', httpStatus: 200, latencyMs: 82, status: 'nominal' },
  { id: 'pb-03', timestamp: '2 min ago', service: 'payment-gateway', endpoint: 'https://gateway.reposage.dev/status', region: 'us-east4', httpStatus: 200, latencyMs: 31, status: 'nominal' },
  { id: 'pb-04', timestamp: '3 min ago', service: 'checkout-service', endpoint: 'https://checkout-api.reposage.dev/v1/orders', region: 'ap-southeast1', httpStatus: 200, latencyMs: 142, status: 'nominal' },
  { id: 'pb-05', timestamp: '4 min ago', service: 'inventory-worker', endpoint: 'grpc://inventory.internal:9090', region: 'us-east4', httpStatus: 200, latencyMs: 12, status: 'nominal' },
  { id: 'pb-06', timestamp: '5 min ago', service: 'auth-proxy', endpoint: 'https://auth.reposage.dev/introspect', region: 'us-east4', httpStatus: 200, latencyMs: 18, status: 'nominal' }
];

export const MONITORING_METRICS: MonitoringMetricPoint[] = [
  { time: '09:00', availability: 99.98, latencyP50: 38, latencyP90: 84, latencyP99: 110, errorRate: 0.01, throughputRps: 340, cpuPercent: 32, memoryMb: 380 },
  { time: '09:10', availability: 99.99, latencyP50: 39, latencyP90: 82, latencyP99: 112, errorRate: 0.01, throughputRps: 360, cpuPercent: 34, memoryMb: 385 },
  { time: '09:20', availability: 99.96, latencyP50: 42, latencyP90: 89, latencyP99: 124, errorRate: 0.03, throughputRps: 390, cpuPercent: 36, memoryMb: 394 },
  { time: '09:30', availability: 99.97, latencyP50: 40, latencyP90: 86, latencyP99: 118, errorRate: 0.02, throughputRps: 410, cpuPercent: 35, memoryMb: 390 },
  { time: '09:40', availability: 99.98, latencyP50: 41, latencyP90: 88, latencyP99: 120, errorRate: 0.02, throughputRps: 430, cpuPercent: 37, memoryMb: 402 },
  { time: '09:50', availability: 99.99, latencyP50: 40, latencyP90: 85, latencyP99: 115, errorRate: 0.01, throughputRps: 450, cpuPercent: 38, memoryMb: 405 },
  { time: '10:00', availability: 99.95, latencyP50: 44, latencyP90: 92, latencyP99: 130, errorRate: 0.04, throughputRps: 480, cpuPercent: 41, memoryMb: 418 },
  { time: '10:10', availability: 99.98, latencyP50: 42, latencyP90: 87, latencyP99: 122, errorRate: 0.02, throughputRps: 460, cpuPercent: 39, memoryMb: 412 },
  { time: '10:20', availability: 99.97, latencyP50: 41, latencyP90: 89, latencyP99: 125, errorRate: 0.02, throughputRps: 475, cpuPercent: 40, memoryMb: 415 }
];

export const INITIAL_INCIDENTS: IncidentRecord[] = [
  {
    id: 'INC-8491',
    title: 'Canary Latency P99 Spike in checkout-service',
    severity: 'high',
    appName: 'checkout-service',
    status: 'mitigated',
    firstDetectedAt: '18 minutes ago',
    resolvedAt: '12 minutes ago',
    errorSummary: 'P99 response time on /v1/orders crossed the 250ms SLA budget following Canary step to 20% traffic.',
    rootCause: 'Goroutine leak in context timeout handler accumulated 1,400 active goroutines under concurrency, causing Go runtime GC pauses.',
    recommendedAction: 'Approve and deploy Patch #patch-001 to properly drain the timer channel on context cancellation.',
    relatedDeploymentId: 'dep-9041',
    relatedCommitHash: '9f3b8e1',
    rollbackTriggered: true,
    rollbackStatus: 'completed',
    suggestedPatchId: 'patch-001',
    timeline: [
      { time: '10:18:12', event: 'SLA Breach Detected', actor: 'system', detail: 'P99 Latency reached 312ms (Threshold: 250ms)' },
      { time: '10:18:18', event: 'Health Evaluation', actor: 'agent', detail: 'Canary pod replica failing health check timeout' },
      { time: '10:18:30', event: 'Canary Halted', actor: 'agent', detail: 'Traffic allocation throttled back to 0% automatically' },
      { time: '10:19:04', event: 'Auto-Rollback Complete', actor: 'agent', detail: 'Service traffic safely routed to previous stable version v2.4.0' },
      { time: '10:20:15', event: 'Diagnosis & Root Cause', actor: 'agent', detail: 'Goroutine accumulation trace identified in internal/orchestrator/timeout.go:74' },
      { time: '10:21:00', event: 'Patch Generated', actor: 'agent', detail: 'AI Patch #patch-001 created and verified with 42/42 unit tests passing' }
    ],
    logs: [
      '2026-10-15T10:18:12Z WARN [ingress-envoy] upstream response time P99=312ms [threshold=250ms]',
      '2026-10-15T10:18:14Z ERROR [checkout-canary-7b89f] runtime: goroutine stack allocation spike: 1,482 goroutines active',
      '2026-10-15T10:18:18Z INFO [reposage-controller] Canary health gate degraded. Initiating automated fail-safe rollback.',
      '2026-10-15T10:18:30Z INFO [k8s-istio] VirtualService checkout-service weights updated: stable=100%, canary=0%',
      '2026-10-15T10:19:04Z INFO [reposage-controller] Rollback verified. Cluster error rate returned to 0.01%.'
    ]
  },
  {
    id: 'INC-8490',
    title: 'Adyen Webhook Ingestion Panic in payment-gateway',
    severity: 'critical',
    appName: 'payment-gateway',
    status: 'resolved',
    firstDetectedAt: '6 hours ago',
    resolvedAt: '5 hours ago',
    errorSummary: 'Downstream 504 Gateway Timeout produced unhandled nil pointer dereference in webhook ingestion service.',
    rootCause: 'Missing nil check on response.Error payload when status >= 500.',
    recommendedAction: 'Apply Patch #patch-002 with defensive nil guards and fallback error messages.',
    relatedDeploymentId: 'dep-9040',
    relatedCommitHash: '3d7a9c2',
    rollbackTriggered: false,
    rollbackStatus: 'not_needed',
    suggestedPatchId: 'patch-002',
    timeline: [
      { time: '04:12:00', event: 'Error Rate Alert', actor: 'system', detail: '500 Internal Server Error spike on /webhooks/adyen' },
      { time: '04:14:20', event: 'Root Cause Diagnosed', actor: 'agent', detail: 'Identified nil dereference at acquirer.go:138' },
      { time: '04:18:00', event: 'Hotfix Staged', actor: 'user', detail: 'Temporary rate limit applied to mitigate worker crashes' },
      { time: '05:02:00', event: 'Incident Resolved', actor: 'user', detail: 'Hotfix validated and released to production' }
    ],
    logs: [
      '2026-10-15T04:12:01Z FATAL [payment-gateway] panic: runtime error: invalid memory address or nil pointer dereference',
      '2026-10-15T04:12:02Z INFO [reposage-agent] Stack trace captured: handleGatewayError(0x0) at acquirer.go:138'
    ]
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLogEntry[] = [
  {
    id: 'act-01',
    timestamp: '2 minutes ago',
    category: 'deployment',
    actor: 'RepoSage Agent',
    actorType: 'agent',
    action: 'Stepped Canary Traffic',
    target: 'checkout-service (v2.4.1)',
    status: 'success',
    metadata: { trafficPercent: 20, cluster: 'prod-us-central1-gke' }
  },
  {
    id: 'act-02',
    timestamp: '8 minutes ago',
    category: 'patch',
    actor: 'Demo Developer',
    actorType: 'user',
    action: 'Approved AI Patch',
    target: 'Patch #patch-003 (Constant-Time HMAC)',
    status: 'success'
  },
  {
    id: 'act-03',
    timestamp: '12 minutes ago',
    category: 'analysis',
    actor: 'RepoSage Agent',
    actorType: 'agent',
    action: 'Completed AST Analysis',
    target: 'checkout-service:main (commit 9f3b8e1)',
    status: 'warning',
    metadata: { issuesFound: 3, criticalCount: 1 }
  },
  {
    id: 'act-04',
    timestamp: '14 minutes ago',
    category: 'test',
    actor: 'CI Pipeline',
    actorType: 'system',
    action: 'Ran Automated Test Suite',
    target: 'Security & Invariant Regression Suite',
    status: 'success',
    metadata: { passed: 24, failed: 0, duration: '5.1s' }
  },
  {
    id: 'act-05',
    timestamp: '18 minutes ago',
    category: 'incident',
    actor: 'RepoSage Auto-Recovery',
    actorType: 'agent',
    action: 'Mitigated Incident & Rolled Back Canary',
    target: 'INC-8491 (Latency SLA Spike)',
    status: 'info'
  },
  {
    id: 'act-06',
    timestamp: '35 minutes ago',
    category: 'image',
    actor: 'Docker Builder',
    actorType: 'system',
    action: 'Built Container Image',
    target: 'ghcr.io/reposage-org/checkout-service:v2.4.1',
    status: 'success',
    metadata: { sizeMb: 46.2, cveCritical: 0 }
  },
  {
    id: 'act-07',
    timestamp: '1 hour ago',
    category: 'repository',
    actor: 'Demo Developer',
    actorType: 'user',
    action: 'Connected GitHub Repository',
    target: 'reposage-org/inventory-worker',
    status: 'success'
  },
  {
    id: 'act-08',
    timestamp: '2 hours ago',
    category: 'auth',
    actor: 'Demo Developer',
    actorType: 'user',
    action: 'Authenticated via Demo Session',
    target: 'demo@reposage.dev',
    status: 'success'
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  profile: {
    name: 'Demo Developer',
    email: 'demo@reposage.dev',
    username: 'demodev',
    role: 'Lead Software Engineer'
  },
  theme: 'light',
  notifications: {
    emailOnFailure: true,
    slackAlerts: true,
    canaryAlerts: true,
    dailyDigest: false
  },
  canaryPolicies: {
    autoRollbackOnHttp5xx: true,
    errorRateThresholdPercent: 1.0,
    latencyP99ThresholdMs: 250,
    soakDurationMinutes: 10,
    requireTestPassBeforeDeploy: true
  },
  aiPolicies: {
    autoGeneratePatchesForCritical: true,
    humanApprovalRequired: true,
    enforceTestRegressionCheck: true
  },
  integrations: {
    githubConnected: true,
    githubOrganization: 'reposage-org',
    dockerRegistry: 'ghcr.io/reposage-org',
    kubernetesContext: 'prod-us-central1-gke'
  }
};
