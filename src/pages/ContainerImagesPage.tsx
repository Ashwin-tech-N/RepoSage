import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Play,
  RotateCw,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Plus,
  GitCommit,
  HardDrive
} from 'lucide-react';
import { StatusText } from '../components/ui/StatusText';
import { ContainerImage } from '../types';

export const ContainerImagesPage: React.FC = () => {
  const { containerImages, buildContainerImage, repositories } = useApp();
  const [selectedImageLogs, setSelectedImageLogs] = useState<ContainerImage | null>(null);
  const [triggerModalOpen, setTriggerModalOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(repositories[0]?.name || 'checkout-service');
  const [tagInput, setTagInput] = useState('v2.4.2');
  const [isBuilding, setIsBuilding] = useState(false);

  const handleTriggerBuild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    setTriggerModalOpen(false);
    setIsBuilding(true);
    await buildContainerImage(selectedRepo, tagInput);
    setIsBuilding(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Container Images & Registries
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Docker distroless container builds, Trivy CVE vulnerability scans, and GitHub Container Registry (ghcr.io) distribution.
          </p>
        </div>

        <button
          onClick={() => setTriggerModalOpen(true)}
          disabled={isBuilding}
          className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Build Container Image</span>
        </button>
      </div>

      {/* Simulator Notice */}
      <div className="p-3 bg-neutral-100/70 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            <strong>Container Sandbox:</strong> Demonstrates multi-stage Docker build logs, minimal base layer caching, and Trivy CVE scanning. Connect your CI worker or Kaniko operator for real image pushing.
          </span>
        </div>
      </div>

      {/* Images Table */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
              <tr>
                <th className="py-2.5 px-4 font-medium">Image & Repository</th>
                <th className="py-2.5 px-4 font-medium">Tag</th>
                <th className="py-2.5 px-4 font-medium">Registry</th>
                <th className="py-2.5 px-4 font-medium">Size</th>
                <th className="py-2.5 px-4 font-medium">Vulnerabilities</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {containerImages.map((img) => (
                <tr key={img.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {img.name}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono mt-0.5">
                        <span className="flex items-center gap-1">
                          <GitCommit className="w-3 h-3 text-neutral-400" />
                          <span>{img.commitHash}</span>
                        </span>
                        <span>·</span>
                        <span>{img.baseImage}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] font-medium text-neutral-700 dark:text-neutral-300">
                    {img.tag}
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">
                    {img.registry}
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] tabular-nums text-neutral-700 dark:text-neutral-300">
                    {img.sizeMb} MB
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono">
                      {img.cveSummary.critical === 0 && img.cveSummary.high === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>0 Critical / High</span>
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{img.cveSummary.critical} Crit / {img.cveSummary.high} High</span>
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <StatusText status={img.status} />
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedImageLogs(img)}
                        className="px-2.5 py-1 text-xs border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded font-medium text-neutral-700 dark:text-neutral-300 transition-colors inline-flex items-center gap-1"
                      >
                        <Terminal className="w-3 h-3 text-neutral-500" />
                        <span>Logs</span>
                      </button>

                      <button
                        onClick={() => buildContainerImage(img.name, `${img.tag}-rebuild`)}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-500 hover:text-neutral-900"
                        title="Re-run image build"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Build Logs Drawer / Modal */}
      {selectedImageLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Build Logs: {selectedImageLogs.name}:{selectedImageLogs.tag}
                </h3>
              </div>
              <button
                onClick={() => setSelectedImageLogs(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-neutral-950 font-mono text-xs text-neutral-200 space-y-1.5 max-h-96 overflow-y-auto">
              {selectedImageLogs.buildLogs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  <span className="text-neutral-500 select-none mr-2">[{index + 1}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="font-mono text-neutral-500">
                Digest: sha256:{selectedImageLogs.commitHash}49d28...
              </span>
              <button
                onClick={() => setSelectedImageLogs(null)}
                className="px-3.5 py-1.5 bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 text-white rounded text-xs font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Build Modal */}
      {triggerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-5">
            <div className="flex items-center justify-between mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Trigger Container Image Build
              </h3>
              <button onClick={() => setTriggerModalOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleTriggerBuild} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Target Service Repository
                </label>
                <select
                  value={selectedRepo}
                  onChange={(e) => setSelectedRepo(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                >
                  {repositories.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name} ({r.language})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Semantic Image Tag
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="v2.4.2"
                  className="w-full p-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono"
                  required
                />
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
                Build step will invoke isolated BuildKit container compiler, verify Dockerfile multi-stage layers, and scan final artifact for CVEs.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTriggerModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
                >
                  Start Build
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
