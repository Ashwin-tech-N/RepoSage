import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  Sparkles,
  GitFork,
  FileSearch,
  GitPullRequest,
  CheckCheck,
  Server,
  Activity,
  ArrowRight,
  ShieldCheck,
  Check,
  Code2,
  Terminal,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const handleConnectRepo = () => {
    if (isAuthenticated) {
      navigate('/app/repositories');
    } else {
      navigate('/signup');
    }
  };

  const handleExploreDashboard = () => {
    if (!isAuthenticated) {
      demoLogin();
    }
    navigate('/app/overview');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Bar adhering to Top Bar Contract */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs sticky top-0 z-30">
        {/* Zone 1: Single text element wordmark */}
        <Link to="/" className="flex items-center gap-2.5 text-base font-bold tracking-tight text-neutral-900 dark:text-white whitespace-nowrap shrink-0">
          <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span>RepoSage</span>
        </Link>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-600 dark:text-neutral-400">
          <a href="#features" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            Features
          </a>
          <a href="#workflow" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            Workflow
          </a>
          <button
            onClick={() => setDocModalOpen(true)}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            Documentation
          </button>
          <button
            onClick={() => setContactModalOpen(true)}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            Support
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <Link
              to="/app/overview"
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors whitespace-nowrap shrink-0"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-12 max-w-5xl mx-auto text-center w-full">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-6 bg-neutral-200/50 dark:bg-neutral-900 px-3 py-1 rounded-full border border-neutral-300/60 dark:border-neutral-800">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Continuous Engineering Verification & Canary Guard</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.15] text-balance mb-5">
          Ship reliable software with confidence.
        </h1>

        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed text-balance mb-8">
          Analyze code, validate fixes, deploy safely, and monitor application health from one engineering workspace.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={handleConnectRepo}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Connect Repository</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleExploreDashboard}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors flex items-center justify-center gap-2"
          >
            <span>Explore Dashboard</span>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </section>

      {/* Realistic Dashboard Preview Frame */}
      <section className="px-4 sm:px-6 max-w-6xl mx-auto w-full mb-20">
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900 shadow-xl">
          {/* Mock Browser/App Header */}
          <div className="px-4 py-3 bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <span className="text-[11px] font-mono text-neutral-400 ml-2">
                reposage.dev/app/overview · checkout-service:main
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-900/40">
              Canary 20% · Nominal
            </span>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-50/50 dark:bg-neutral-900/50">
            {/* Column 1: Static AST Analysis */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-950 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  <FileSearch className="w-3.5 h-3.5 text-blue-600" />
                  <span>AST Code Analysis</span>
                </span>
                <span className="font-mono text-amber-600 dark:text-amber-400 text-[11px]">3 Issues</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                AST parser detected goroutine leak on <code className="font-mono text-[11px] bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">timeout.go:74</code>.
              </p>
              <div className="p-2.5 bg-neutral-100/70 dark:bg-neutral-900 rounded font-mono text-[11px] text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-800">
                select &#123; case &lt;-ctx.Done(): ... &#125;
              </div>
            </div>

            {/* Column 2: Test-Gated Patch */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-950 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-blue-600" />
                  <span>AI Patch #001</span>
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 text-[11px]">42/42 Passed</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Auto-generated fix safely drains timer channel before return. Verified in container test sandbox.
              </p>
              <div className="p-2 bg-emerald-50/50 dark:bg-emerald-950/20 rounded font-mono text-[11px] text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-900/30">
                + defer timer.Stop() channel drain
              </div>
            </div>

            {/* Column 3: Canary Deployment */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-950 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-blue-600" />
                  <span>Canary Pipeline</span>
                </span>
                <span className="font-mono text-blue-600 dark:text-blue-400 text-[11px]">prod-us-central</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Traffic weight</span>
                  <span className="font-mono text-neutral-900 dark:text-neutral-100 font-semibold">20%</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
              <p className="text-xs text-neutral-500">
                Automated rollback armed: triggers if HTTP 5xx error budget exceeds 1.0%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-16 max-w-6xl mx-auto w-full border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
            Engineered for production resilience
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            A unified suite connecting repository analysis, test execution, container builds, and deployment observability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 bg-white dark:bg-neutral-900 space-y-2.5">
            <div className="w-8 h-8 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 flex items-center justify-center">
              <FileSearch className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              AST & Semantic Code Analysis
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Scans repositories for subtle concurrency hazards, memory leaks, unhandled exception paths, and dependency vulnerabilities without noisy false positives.
            </p>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 bg-white dark:bg-neutral-900 space-y-2.5">
            <div className="w-8 h-8 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 flex items-center justify-center">
              <GitPullRequest className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Test-Gated AI Patches
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Generates context-aware diffs verified by your existing unit, integration, and security regression test suites before reaching code review.
            </p>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 bg-white dark:bg-neutral-900 space-y-2.5">
            <div className="w-8 h-8 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 flex items-center justify-center">
              <Server className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Kubernetes Canary & Rollbacks
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Deploys releases incrementally with traffic stepping (10% → 20% → 50% → 100%). Automatically halts and restores previous stable replicas on SLA breach.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="px-6 py-16 max-w-6xl mx-auto w-full border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
            Three-step engineering lifecycle
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            From Git commit to live telemetry validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 space-y-2">
            <div className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
              01. Ingest & Inspect
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Repository Indexing
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Connect your GitHub repository. RepoSage parses the project dependency graph and builds an internal syntax model of critical execution paths.
            </p>
          </div>

          <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 space-y-2">
            <div className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
              02. Validate & Patch
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Autonomous Verification
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              When issues are identified, the agent writes targeted patches and executes containerized test suites to confirm regressions are eliminated.
            </p>
          </div>

          <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 space-y-2">
            <div className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
              03. Deploy & Monitor
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Guardrail Rollout
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Container images are built and released via weighted canary traffic. Real-time probes monitor latency, error rate, and memory consumption.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Stack Support */}
      <section className="px-6 py-12 max-w-5xl mx-auto w-full border-t border-neutral-200 dark:border-neutral-800 text-center">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-6">
          Supported Ecosystem & Tooling
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-mono text-neutral-600 dark:text-neutral-400">
          <span>Go</span>
          <span>·</span>
          <span>TypeScript / Node.js</span>
          <span>·</span>
          <span>Python</span>
          <span>·</span>
          <span>Rust</span>
          <span>·</span>
          <span>Docker</span>
          <span>·</span>
          <span>Kubernetes</span>
          <span>·</span>
          <span>Prometheus</span>
          <span>·</span>
          <span>GitHub Actions</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 py-6 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">RepoSage</span>
            <span>·</span>
            <span>Autonomous Software Engineering Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setDocModalOpen(true)}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Documentation
            </button>
            <button
              onClick={() => setContactModalOpen(true)}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Contact Support
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Documentation Modal */}
      {docModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-6">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              RepoSage Architecture & Documentation
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              RepoSage combines AST code parsing, LLM patch synthesis, and Kubernetes canary orchestration. In this demonstration workspace, all components run client-side with full state simulation.
            </p>
            <div className="space-y-2 text-xs font-mono text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-950 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <p>• Auth: LocalStorage & demo JSON user repository</p>
              <p>• Analysis: Static pattern matching & vulnerability scoring</p>
              <p>• Deployments: Weighted Canary & Envoy/Istio routing simulation</p>
              <p>• Telemetry: 100ms synthetic probe metrics & health checks</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setDocModalOpen(false)}
                className="px-4 py-1.5 text-xs font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Support Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-6">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Engineering Support
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Need assistance configuring RepoSage with your on-premise Kubernetes cluster or private GitHub Enterprise instance?
            </p>
            <div className="text-xs space-y-1.5 text-neutral-700 dark:text-neutral-300">
              <p><span className="font-semibold">Email:</span> support@reposage.dev</p>
              <p><span className="font-semibold">Slack:</span> #reposage-devs</p>
              <p><span className="font-semibold">Status:</span> status.reposage.dev (All Systems Nominal)</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setContactModalOpen(false)}
                className="px-4 py-1.5 text-xs font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
