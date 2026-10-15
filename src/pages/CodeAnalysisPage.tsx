import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileSearch,
  Play,
  Filter,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  X,
  FileCode,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  GitBranch,
  Layers
} from 'lucide-react';
import { StatusText } from '../components/ui/StatusText';
import { CodeIssue, SeverityLevel, IssueStatus } from '../types';

export const CodeAnalysisPage: React.FC = () => {
  const {
    repositories,
    activeRepoId,
    setActiveRepoId,
    issues,
    runAnalysis,
    isAnalyzing,
    analysisProgress
  } = useApp();

  const navigate = useNavigate();

  const [selectedBranch, setSelectedBranch] = useState('main');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<CodeIssue | null>(null);

  const activeRepo = repositories.find((r) => r.id === activeRepoId) || repositories[0];
  const repoIssues = issues.filter((i) => i.repoId === activeRepoId || i.repoName === activeRepo?.name);

  // Filtered issues
  const filteredIssues = repoIssues.filter((issue) => {
    const matchesSev = severityFilter === 'all' || issue.severity === severityFilter;
    const matchesCat = categoryFilter === 'all' || issue.category === categoryFilter;
    return matchesSev && matchesCat;
  });

  const criticalCount = repoIssues.filter((i) => i.severity === 'critical').length;
  const highCount = repoIssues.filter((i) => i.severity === 'high').length;
  const mediumCount = repoIssues.filter((i) => i.severity === 'medium').length;
  const lowCount = repoIssues.filter((i) => i.severity === 'low').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Code Analysis & AST Inspection
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Static pattern heuristics, goroutine leak detection, exception flow verification, and dependency CVEs.
          </p>
        </div>

        {/* Repository & Branch Pickers + Run Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={activeRepoId}
            onChange={(e) => setActiveRepoId(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium focus:outline-hidden"
          >
            {repositories.map((r) => (
              <option key={r.id} value={r.id}>
                {r.owner}/{r.name}
              </option>
            ))}
          </select>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono focus:outline-hidden"
          >
            <option value="main">branch: main</option>
            <option value="staging">branch: staging</option>
          </select>

          <button
            onClick={() => runAnalysis(activeRepoId, selectedBranch)}
            disabled={isAnalyzing}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isAnalyzing ? 'Scanning AST...' : 'Start Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Progress Bar if Running */}
      {isAnalyzing && (
        <div className="p-4 bg-white dark:bg-neutral-900 border border-blue-200 dark:border-blue-900/60 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>Analyzing AST grammar & security invariants ({analysisProgress}%)...</span>
            </span>
            <span className="text-neutral-500">Checking internal/orchestrator/timeout.go</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Severity Breakdown Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Critical</span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <p className="text-lg font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-0.5">
            {criticalCount}
          </p>
          <span className="text-[10px] text-neutral-400">Immediate crash hazard</span>
        </div>

        <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>High Severity</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <p className="text-lg font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400 mt-0.5">
            {highCount}
          </p>
          <span className="text-[10px] text-neutral-400">Exception / timing flaw</span>
        </div>

        <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Medium Severity</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <p className="text-lg font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400 mt-0.5">
            {mediumCount}
          </p>
          <span className="text-[10px] text-neutral-400">Quality & subtle risks</span>
        </div>

        <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Low Severity</span>
            <span className="w-2 h-2 rounded-full bg-neutral-400" />
          </div>
          <p className="text-lg font-bold font-mono tabular-nums text-neutral-700 dark:text-neutral-300 mt-0.5">
            {lowCount}
          </p>
          <span className="text-[10px] text-neutral-400">Performance optimization</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 font-medium">Filter Severity:</span>
          {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                severityFilter === sev
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-500 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2 py-1 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="all">All Categories</option>
            <option value="Logic errors">Logic errors</option>
            <option value="Exception handling">Exception handling</option>
            <option value="Code quality">Code quality</option>
            <option value="Dependency risks">Dependency risks</option>
            <option value="Security concerns">Security concerns</option>
          </select>
        </div>
      </div>

      {/* Issues Table */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
              <tr>
                <th className="py-2.5 px-4 font-medium">Severity</th>
                <th className="py-2.5 px-4 font-medium">Issue Description</th>
                <th className="py-2.5 px-4 font-medium">Category</th>
                <th className="py-2.5 px-4 font-medium">File Path & Line</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    No issues found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono text-[11px] font-semibold uppercase ${
                          issue.severity === 'critical'
                            ? 'text-rose-600 dark:text-rose-400'
                            : issue.severity === 'high'
                            ? 'text-amber-600 dark:text-amber-400'
                            : issue.severity === 'medium'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-neutral-500'
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100 max-w-md">
                      <div>
                        <p className="font-semibold">{issue.title}</p>
                        <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                          {issue.description}
                        </p>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                      {issue.category}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-600 dark:text-neutral-300">
                      {issue.filePath}:{issue.lineNumber}
                    </td>

                    <td className="py-3 px-4">
                      <StatusText status={issue.status} />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIssue(issue);
                        }}
                        className="px-2.5 py-1 text-xs border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300 transition-colors inline-flex items-center gap-1"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3 h-3 text-neutral-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel / Detail Drawer for Selected Issue */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-xl h-full bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col justify-between overflow-y-auto">
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-xs font-bold uppercase ${
                      selectedIssue.severity === 'critical'
                        ? 'text-rose-600'
                        : selectedIssue.severity === 'high'
                        ? 'text-amber-600'
                        : 'text-blue-600'
                    }`}
                  >
                    {selectedIssue.severity} issue
                  </span>
                  <span className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span className="text-xs text-neutral-500">{selectedIssue.category}</span>
                </div>
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white leading-tight">
                    {selectedIssue.title}
                  </h2>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-500 mt-1">
                    <span>{selectedIssue.filePath}:{selectedIssue.lineNumber}</span>
                    <span>·</span>
                    <span>{selectedIssue.repoName}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                    Diagnostic Analysis:
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {selectedIssue.description}
                  </p>
                </div>

                {/* Code Snippet */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                    Vulnerable Code Segment:
                  </span>
                  <pre className="p-3 bg-neutral-900 text-neutral-200 rounded-lg font-mono text-[11px] overflow-x-auto border border-neutral-800">
                    {selectedIssue.snippet}
                  </pre>
                </div>

                {/* Suggested Fix */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                    AI Suggested Resolution:
                  </span>
                  <pre className="p-3 bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 rounded-lg font-mono text-[11px] overflow-x-auto border border-blue-200/50 dark:border-blue-900/40">
                    {selectedIssue.suggestedFix}
                  </pre>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between">
              <button
                onClick={() => setSelectedIssue(null)}
                className="px-3 py-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setSelectedIssue(null);
                  navigate('/app/patches');
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Review & Approve AI Patch →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
