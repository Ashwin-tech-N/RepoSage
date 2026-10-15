import React from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  GitFork,
  FileSearch,
  AlertTriangle,
  Server,
  Activity,
  CheckCircle2,
  ArrowRight,
  Play,
  RotateCcw,
  Sparkles,
  GitCommit,
  Clock,
  Layers
} from 'lucide-react';
import { StatusText } from '../components/ui/StatusText';

export const OverviewPage: React.FC = () => {
  const {
    repositories,
    issues,
    deployments,
    incidents,
    activityLogs,
    runAnalysis,
    isAnalyzing
  } = useApp();
  const navigate = useNavigate();

  const totalRepos = repositories.length;
  const openIssues = issues.filter((i) => i.status === 'open' || i.status === 'in_review').length;
  const successfulDeploys = deployments.filter((d) => d.status === 'healthy').length;
  const failedDeploys = deployments.filter((d) => d.status === 'failed' || d.status === 'rolled_back').length;
  const activeCanary = deployments.find((d) => d.status === 'canary_in_progress');
  const activeIncident = incidents.find((i) => i.status !== 'resolved');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Incident Alert if active */}
      {activeIncident && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-200">
                Active Mitigated Incident: {activeIncident.id} — {activeIncident.title}
              </p>
              <p className="text-amber-800 dark:text-amber-300/80 mt-0.5 leading-relaxed">
                {activeIncident.errorSummary}
              </p>
            </div>
          </div>
          <Link
            to="/app/incidents"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium whitespace-nowrap shrink-0 transition-colors"
          >
            Review Triage & Recovery
          </Link>
        </div>
      )}

      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Engineering Overview
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Continuous repository posture, autonomous patch synthesis, and canary deployment telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/app/repositories"
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
          >
            <GitFork className="w-3.5 h-3.5 text-neutral-500" />
            <span>Connect Repository</span>
          </Link>
          <Link
            to="/app/analysis"
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Run AST Analysis</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid - Simple flat structure adhering to design guidelines */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>Repositories</span>
            <GitFork className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white">
            {totalRepos}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">Active tracked</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>Open Issues</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
            {openIssues}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">1 critical leak</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>Healthy Deploys</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {successfulDeploys}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">Production stable</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>Rollbacks / Failed</span>
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
            {failedDeploys}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">Automated failsafe</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>System Health</span>
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white">
            99.98%
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">Within SLA budget</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>Canary Traffic</span>
            <Server className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
            {activeCanary ? `${activeCanary.canaryTrafficPercent}%` : 'Idle'}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            {activeCanary ? activeCanary.appName : 'No active rollout'}
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Repositories & Canary Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Canary Pipeline Status Card */}
          {activeCanary && (
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Active Canary Rollout: {activeCanary.appName} ({activeCanary.version})
                  </span>
                </div>
                <Link
                  to="/app/deployments"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Manage Deployment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Progress bar and traffic allocation */}
              <div>
                <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1.5">
                  <span>Envoy / Istio Traffic Weight: <strong className="text-neutral-900 dark:text-white font-mono">{activeCanary.canaryTrafficPercent}%</strong></span>
                  <span>Previous Stable ({activeCanary.previousVersion}): <strong className="font-mono text-neutral-900 dark:text-white">{100 - activeCanary.canaryTrafficPercent}%</strong></span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${activeCanary.canaryTrafficPercent}%` }}
                  />
                </div>
              </div>

              {/* Steps timeline */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px]">
                {activeCanary.canarySteps.slice(0, 3).map((step, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{step.step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connected Repositories Table */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 overflow-hidden">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold text-neutral-900 dark:text-white">
                  Connected Repositories
                </h2>
                <p className="text-[11px] text-neutral-500">
                  Continuous AST scanning and automated patch generators
                </p>
              </div>
              <Link
                to="/app/repositories"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              {repositories.map((repo) => (
                <div key={repo.id} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        to="/app/repositories"
                        className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 truncate"
                      >
                        {repo.owner}/{repo.name}
                      </Link>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        ({repo.language})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <GitCommit className="w-3 h-3 text-neutral-400" />
                        <span>{repo.latestCommit.hash}</span>
                      </span>
                      <span>·</span>
                      <span className="truncate max-w-xs">{repo.latestCommit.message}</span>
                      <span>·</span>
                      <span className="text-neutral-400">{repo.lastAnalyzedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusText status={repo.analysisStatus} />
                    <button
                      onClick={() => runAnalysis(repo.id)}
                      disabled={isAnalyzing}
                      className="px-2.5 py-1 text-xs border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded font-medium text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <Play className="w-3 h-3 text-neutral-500" />
                      <span>Scan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Recent Activity & Suggested Fixes */}
        <div className="space-y-6">
          {/* Quick AI Patches Widget */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Pending AI Patches</span>
              </span>
              <Link to="/app/patches" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Review all →
              </Link>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Test-verified patches waiting for developer approval:
            </p>

            <div className="space-y-2">
              <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/60 rounded border border-neutral-200 dark:border-neutral-700 text-xs">
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  Drain timer channel in checkout timeout handler
                </p>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1 font-mono">
                  <span>checkout-service</span>
                  <span className="text-emerald-600 dark:text-emerald-400">42/42 tests pass</span>
                </div>
              </div>

              <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/60 rounded border border-neutral-200 dark:border-neutral-700 text-xs">
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  Defensive nil check on gateway error response
                </p>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1 font-mono">
                  <span>checkout-service</span>
                  <span className="text-emerald-600 dark:text-emerald-400">38/38 tests pass</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Recent Audit Activity</span>
              </span>
              <Link to="/app/activity" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Full logs →
              </Link>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0 mt-1.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-neutral-800 dark:text-neutral-200 leading-snug">
                      <span className="font-medium">{log.actor}</span> {log.action.toLowerCase()}:{' '}
                      <span className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400 truncate block">
                        {log.target}
                      </span>
                    </p>
                    <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">
                      {log.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
