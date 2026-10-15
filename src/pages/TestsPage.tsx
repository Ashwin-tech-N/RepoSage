import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import {
  CheckCheck,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  GitPullRequest,
  RefreshCw
} from 'lucide-react';
import { StatusText } from '../components/ui/StatusText';
import { TestSuite } from '../types';

export const TestsPage: React.FC = () => {
  const { testSuites, runTests } = useApp();
  const [isRunning, setIsRunning] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [expandedSuiteId, setExpandedSuiteId] = useState<string | null>('suite-integration-checkout');

  const totalTests = testSuites.reduce((acc, s) => acc + s.totalCount, 0);
  const totalPassed = testSuites.reduce((acc, s) => acc + s.passedCount, 0);
  const totalFailed = testSuites.reduce((acc, s) => acc + s.failedCount, 0);
  const totalDuration = testSuites.reduce((acc, s) => acc + s.durationSeconds, 0).toFixed(1);

  const handleRunAll = async () => {
    setIsRunning(true);
    await runTests();
    setIsRunning(false);
  };

  const handleRunSingle = async (suiteId: string) => {
    setIsRunning(true);
    await runTests(suiteId);
    setIsRunning(false);
  };

  const filteredSuites = testSuites.filter((suite) => {
    if (statusFilter === 'all') return true;
    return suite.status === statusFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Automated Testing & Regressions
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Continuous unit, integration, and security regression harnesses executed in isolated container microVMs.
          </p>
        </div>

        <button
          onClick={handleRunAll}
          disabled={isRunning}
          className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs disabled:opacity-50"
        >
          {isRunning ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
          <span>{isRunning ? 'Running Test Harnesses...' : 'Execute All Suites'}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <span className="text-xs text-neutral-500 block">Total Test Cases</span>
          <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white mt-0.5">
            {totalTests}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">Across 4 test suites</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <span className="text-xs text-neutral-500 block">Passed Tests</span>
          <p className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
            {totalPassed}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">{(totalPassed / totalTests * 100).toFixed(1)}% pass rate</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <span className="text-xs text-neutral-500 block">Failed Tests</span>
          <p className="text-xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-0.5">
            {totalFailed}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">Patch #002 addresses</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <span className="text-xs text-neutral-500 block">Total Duration</span>
          <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white mt-0.5">
            {totalDuration}s
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">Parallelized runs</span>
        </div>
      </div>

      {/* Filter and Simulator Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500 font-medium mr-1">Filter by status:</span>
          {(['all', 'passed', 'failed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                statusFilter === filter
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <span className="text-neutral-400 font-mono text-[11px]">
          Execution sandbox: Docker 26.1 / gVisor sandboxed kernel
        </span>
      </div>

      {/* Test Suites Accordion List */}
      <div className="space-y-3">
        {filteredSuites.map((suite) => {
          const isExpanded = expandedSuiteId === suite.id;
          const isFailed = suite.status === 'failed';

          return (
            <div
              key={suite.id}
              className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 overflow-hidden text-xs shadow-xs"
            >
              {/* Header row */}
              <div
                onClick={() => setExpandedSuiteId(isExpanded ? null : suite.id)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {suite.status === 'running' ? (
                      <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                    ) : isFailed ? (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {suite.name}
                      </h3>
                      <span className="font-mono text-[11px] text-neutral-400 uppercase">
                        [{suite.type}]
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-mono mt-0.5">
                      <span>{suite.repoName}:{suite.branch}</span>
                      <span>·</span>
                      <span>Duration: {suite.durationSeconds}s</span>
                      <span>·</span>
                      <span>Last run: {suite.lastRunTimestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="font-mono text-xs tabular-nums text-right">
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {suite.passedCount} passed
                    </span>
                    {suite.failedCount > 0 && (
                      <span className="text-rose-600 dark:text-rose-400 font-medium ml-2">
                        {suite.failedCount} failed
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunSingle(suite.id);
                    }}
                    disabled={isRunning}
                    className="p-1.5 hover:bg-neutral-200/60 dark:hover:bg-neutral-700 rounded text-neutral-600 dark:text-neutral-300"
                    title="Re-run this suite"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>

                  <div className="text-neutral-400">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded details: Test Cases & Stack traces */}
              {isExpanded && (
                <div className="border-t border-neutral-100 dark:border-neutral-800 p-4 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-3">
                  {suite.associatedPatchId && (
                    <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 rounded flex items-center justify-between text-xs">
                      <span className="text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                        <GitPullRequest className="w-3.5 h-3.5 text-blue-600" />
                        <span>This suite validates regression fix in Patch #{suite.associatedPatchId}</span>
                      </span>
                      <Link
                        to="/app/patches"
                        className="text-blue-700 dark:text-blue-400 font-medium hover:underline text-[11px]"
                      >
                        Inspect Patch →
                      </Link>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {suite.testCases.map((tc) => (
                      <div
                        key={tc.id}
                        className={`p-2.5 rounded border text-xs font-mono transition-colors ${
                          tc.status === 'failed'
                            ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200'
                            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{tc.name}</span>
                          <span className="text-neutral-400 text-[11px] tabular-nums">
                            {tc.durationMs}ms
                          </span>
                        </div>

                        {tc.errorMessage && (
                          <div className="mt-2 text-rose-700 dark:text-rose-300 font-sans text-xs">
                            <span className="font-semibold font-mono text-[11px]">Error:</span> {tc.errorMessage}
                          </div>
                        )}

                        {tc.stackTrace && (
                          <pre className="mt-2 p-2 bg-neutral-900 text-neutral-300 rounded text-[11px] font-mono overflow-x-auto whitespace-pre">
                            {tc.stackTrace}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
