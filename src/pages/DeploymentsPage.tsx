import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Server,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  XCircle,
  HelpCircle,
  Layers,
  Sparkles
} from 'lucide-react';
import { StatusText } from '../components/ui/StatusText';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { DeploymentRecord } from '../types';

export const DeploymentsPage: React.FC = () => {
  const {
    deployments,
    promoteCanary,
    abortCanary,
    triggerRollback,
    containerImages
  } = useApp();

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'abort' | 'rollback';
    deploymentId: string;
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: 'abort',
    deploymentId: '',
    title: '',
    description: ''
  });

  const [newDeployModalOpen, setNewDeployModalOpen] = useState(false);
  const [rollbackReasonInput, setRollbackReasonInput] = useState('');

  const activeCanaryDeployment = deployments.find((d) => d.status === 'canary_in_progress');

  const handleActionConfirm = () => {
    if (confirmModal.type === 'abort') {
      abortCanary(confirmModal.deploymentId);
    } else if (confirmModal.type === 'rollback') {
      triggerRollback(confirmModal.deploymentId, rollbackReasonInput || 'Operator triggered manual fail-safe rollback.');
      setRollbackReasonInput('');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Kubernetes Deployments & Canary Releases
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Istio-routed weighted traffic splitting, SLA error budget validation gates, and automated fail-safe rollback.
          </p>
        </div>

        <button
          onClick={() => setNewDeployModalOpen(true)}
          className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Start New Deployment</span>
        </button>
      </div>

      {/* Architectural Explainer Banner */}
      <div className="p-4 bg-neutral-100/70 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs space-y-2">
        <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 font-semibold">
          <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Traffic Splitting Architecture & Health Separation:</span>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
          1. <strong>Weighted Traffic Splitting:</strong> Weighted canary percentages are executed via an Envoy Ingress / Istio VirtualService layer. Native Kubernetes ClusterIP Services do not perform weighted percentage splitting.
        </p>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
          2. <strong>Deployment Status vs. Application Health:</strong> A deployment may have status <em>Healthy</em> while an application experiences degraded upstream responses. RepoSage monitors both Pod readiness probes and end-to-end HTTP synthetic health.
        </p>
      </div>

      {/* Active Canary Pipeline Hero Card */}
      {activeCanaryDeployment ? (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="font-mono text-xs uppercase font-bold text-blue-600 dark:text-blue-400">
                  Canary Rollout Active
                </span>
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
                <span className="font-mono text-xs text-neutral-500">
                  Cluster: {activeCanaryDeployment.cluster} ({activeCanaryDeployment.namespace})
                </span>
              </div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
                {activeCanaryDeployment.appName} ({activeCanaryDeployment.version})
              </h2>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setConfirmModal({
                    isOpen: true,
                    type: 'abort',
                    deploymentId: activeCanaryDeployment.id,
                    title: 'Abort Canary Release?',
                    description: `This will immediately throttle canary traffic for ${activeCanaryDeployment.appName} to 0% and route 100% of user traffic back to stable version ${activeCanaryDeployment.previousVersion}.`
                  })
                }
                className="px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-md transition-colors"
              >
                Abort Canary
              </button>

              <button
                onClick={() =>
                  setConfirmModal({
                    isOpen: true,
                    type: 'rollback',
                    deploymentId: activeCanaryDeployment.id,
                    title: 'Emergency Automated Rollback',
                    description: `Trigger an instant rollback to restore previous verified image ${activeCanaryDeployment.previousVersion}. Existing canary pods will be terminated.`
                  })
                }
                className="px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-md transition-colors"
              >
                Rollback to {activeCanaryDeployment.previousVersion}
              </button>

              <button
                onClick={() => promoteCanary(activeCanaryDeployment.id)}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs"
              >
                {activeCanaryDeployment.canaryTrafficPercent < 50
                  ? 'Step Traffic to 50%'
                  : 'Promote to 100% Production'}
              </button>
            </div>
          </div>

          {/* Traffic split visualizer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-600 dark:text-neutral-400">
                Canary Weight: <strong className="text-blue-600 dark:text-blue-400 text-sm">{activeCanaryDeployment.canaryTrafficPercent}%</strong>
              </span>
              <span className="text-neutral-600 dark:text-neutral-400">
                Stable ({activeCanaryDeployment.previousVersion}) Weight: <strong className="text-neutral-900 dark:text-white text-sm">{100 - activeCanaryDeployment.canaryTrafficPercent}%</strong>
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-3 rounded-full overflow-hidden flex">
              <div
                className="bg-blue-600 h-full transition-all duration-500 rounded-l-full"
                style={{ width: `${activeCanaryDeployment.canaryTrafficPercent}%` }}
              />
              <div
                className="bg-neutral-400 dark:bg-neutral-600 h-full transition-all duration-500 rounded-r-full"
                style={{ width: `${100 - activeCanaryDeployment.canaryTrafficPercent}%` }}
              />
            </div>
          </div>

          {/* Lifecycle Steps: Build -> Validate -> Deploy Canary -> Monitor -> Promote/Rollback */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-3">
              Deployment Lifecycle Stages
            </span>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-2 text-xs">
              {activeCanaryDeployment.canarySteps.map((step, idx) => {
                const isComplete = step.status === 'completed';
                const isInProgress = step.status === 'in_progress';

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border font-mono text-[11px] space-y-1 ${
                      isComplete
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-200/60 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200'
                        : isInProgress
                        ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200'
                        : 'bg-neutral-50 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-neutral-400">0{idx + 1}</span>
                      {isComplete && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                      {isInProgress && <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />}
                    </div>
                    <p className="font-sans font-medium text-xs leading-tight">{step.step}</p>
                    {step.timestamp && (
                      <span className="text-[10px] text-neutral-400 block">{step.timestamp}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>No active canary rollouts in progress. All cluster services are receiving 100% production traffic.</span>
          </div>
        </div>
      )}

      {/* Deployment History Table */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1">
          Cluster Deployment History
        </h2>

        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Application</th>
                  <th className="py-2.5 px-4 font-medium">Target Version</th>
                  <th className="py-2.5 px-4 font-medium">Cluster & Namespace</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 font-medium">Deployed By</th>
                  <th className="py-2.5 px-4 font-medium">Started</th>
                  <th className="py-2.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {deployments.map((dep) => (
                  <tr key={dep.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                      {dep.appName}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                      <span>{dep.version}</span>
                      <span className="text-neutral-400 ml-1.5">(prev: {dep.previousVersion})</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">
                      {dep.cluster} / {dep.namespace}
                    </td>

                    <td className="py-3 px-4">
                      <StatusText status={dep.status} />
                    </td>

                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                      {dep.deployedBy}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">
                      {dep.startedAt}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {dep.status !== 'rolled_back' ? (
                        <button
                          onClick={() =>
                            setConfirmModal({
                              isOpen: true,
                              type: 'rollback',
                              deploymentId: dep.id,
                              title: `Rollback ${dep.appName}?`,
                              description: `Revert ${dep.appName} back to stable release ${dep.previousVersion}.`
                            })
                          }
                          className="px-2.5 py-1 text-xs border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300 transition-colors"
                        >
                          Rollback
                        </button>
                      ) : (
                        <span className="text-neutral-400 font-mono text-[11px]">Rolled Back</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleActionConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmLabel={confirmModal.type === 'abort' ? 'Abort Release' : 'Trigger Rollback'}
        isDestructive={true}
      />

      {/* Start New Deployment Modal */}
      {newDeployModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-5">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              Start Kubernetes Canary Release
            </h3>
            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
              Select container image artifact from registry to deploy into production cluster with Istio canary routing:
            </p>

            <div className="space-y-3 text-xs mb-5">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Container Image
                </label>
                <select className="w-full p-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono">
                  {containerImages.map((img) => (
                    <option key={img.id} value={img.id}>
                      {img.name}:{img.tag} ({img.sizeMb}MB)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Target Kubernetes Cluster
                </label>
                <select className="w-full p-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono">
                  <option>prod-us-central1-gke / namespace: payments-prod</option>
                  <option>staging-us-east4-gke / namespace: staging</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Initial Canary Traffic Weight
                </label>
                <select className="w-full p-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono">
                  <option>10% (Recommended initial soak)</option>
                  <option>20%</option>
                  <option>50%</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNewDeployModalOpen(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewDeployModalOpen(false);
                  promoteCanary('dep-9041');
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
              >
                Launch Canary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
