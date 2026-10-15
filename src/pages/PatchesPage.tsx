import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import {
  GitPullRequest,
  CheckCircle2,
  XCircle,
  MessageSquare,
  FileCode,
  ShieldCheck,
  CheckCheck,
  ArrowRight,
  GitCommit,
  Sparkles
} from 'lucide-react';
import { DiffViewer } from '../components/ui/DiffViewer';
import { StatusText } from '../components/ui/StatusText';
import { AIPatch, PatchStatus } from '../types';

export const PatchesPage: React.FC = () => {
  const { patches, updatePatchStatus } = useApp();
  const [selectedPatchId, setSelectedPatchId] = useState<string>(patches[0]?.id || '');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState('');

  const activePatch = patches.find((p) => p.id === selectedPatchId) || patches[0];

  const handleApprove = () => {
    if (!activePatch) return;
    updatePatchStatus(activePatch.id, 'approved');
  };

  const handleReject = () => {
    if (!activePatch) return;
    updatePatchStatus(activePatch.id, 'rejected');
  };

  const handleRequestChanges = () => {
    if (!activePatch) return;
    updatePatchStatus(activePatch.id, 'changes_requested', feedbackComment);
    setFeedbackComment('');
    setFeedbackModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            AI Patch Review Workspace
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Evaluate synthesized code patches verified by containerized test execution before merging into production.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/app/tests"
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>View Associated Test Runs</span>
          </Link>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="p-3 bg-neutral-100/70 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            <strong>Human-in-the-Loop Safeguard:</strong> Approving a patch updates local workspace state. In production, verified diffs are pushed as Pull Requests via GitHub App permissions.
          </span>
        </div>
      </div>

      {/* Main Grid: Left Patch List, Right Diff & Detail Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Patches List (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block px-1">
            Proposed AI Patches ({patches.length})
          </span>

          <div className="space-y-2">
            {patches.map((patch) => {
              const isSelected = patch.id === activePatch?.id;
              return (
                <button
                  key={patch.id}
                  onClick={() => setSelectedPatchId(patch.id)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all text-xs ${
                    isSelected
                      ? 'bg-white dark:bg-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-sm'
                      : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-mono text-[11px] text-neutral-500">#{patch.id}</span>
                    <StatusText status={patch.status} />
                  </div>

                  <p className="font-semibold text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2">
                    {patch.title}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                    <span className="truncate max-w-[130px]">{patch.repoName}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {patch.passedTests}/{patch.totalTests} tests pass
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Patch Review (8 cols) */}
        {activePatch ? (
          <div className="lg:col-span-8 space-y-5">
            {/* Header info */}
            <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-neutral-400">
                      Patch #{activePatch.id}
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">·</span>
                    <span className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
                      {activePatch.repoName}:{activePatch.branch}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
                    {activePatch.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <StatusText status={activePatch.status} />
                </div>
              </div>

              {/* Rationale and root cause */}
              <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">Summary:</span>{' '}
                  <span className="text-neutral-600 dark:text-neutral-300">{activePatch.summary}</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">Root Cause:</span>{' '}
                  <span className="text-neutral-600 dark:text-neutral-300">{activePatch.rootCause}</span>
                </div>
                {activePatch.reviewComment && (
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 rounded border border-amber-200 dark:border-amber-900/30">
                    <span className="font-semibold">Reviewer feedback:</span> {activePatch.reviewComment}
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2 font-mono text-xs text-neutral-500">
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    Validation: <strong>{activePatch.passedTests}/{activePatch.totalTests}</strong> automated tests passed
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFeedbackModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Request Changes</span>
                  </button>

                  <button
                    onClick={handleReject}
                    disabled={activePatch.status === 'rejected'}
                    className="px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={handleApprove}
                    disabled={activePatch.status === 'approved'}
                    className="px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{activePatch.status === 'approved' ? 'Approved' : 'Approve Patch'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Diff Viewer Component */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Before-and-After Code Comparison
                </span>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-emerald-600 dark:text-emerald-400">+{activePatch.diff.additions} lines</span>
                  <span className="text-rose-600 dark:text-rose-400">-{activePatch.diff.deletions} lines</span>
                </div>
              </div>

              <DiffViewer
                oldCode={activePatch.diff.oldCode}
                newCode={activePatch.diff.newCode}
                fileName={activePatch.filePath}
              />
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-neutral-400 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg">
            No patches available.
          </div>
        )}
      </div>

      {/* Request Changes Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-5">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              Request Changes on Patch #{activePatch?.id}
            </h3>
            <p className="text-xs text-neutral-500 mb-3 leading-relaxed">
              Provide instructions or edge cases for the agent to consider in the next patch iteration:
            </p>
            <textarea
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder="e.g. Please verify that context deadline errors are preserved rather than masked..."
              className="w-full p-2.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-blue-500 h-24 mb-4"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setFeedbackModalOpen(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestChanges}
                className="px-3.5 py-1.5 bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 text-white rounded-md text-xs font-medium hover:bg-neutral-800"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
